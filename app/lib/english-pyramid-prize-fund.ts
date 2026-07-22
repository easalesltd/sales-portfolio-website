/**
 * Live prize-pot valuation for the English pyramid sweepstake.
 * Tracks an all-world accumulating fund (default VWRP.L) via Yahoo Finance chart API.
 */

import { ENGLISH_PYRAMID_PRIZE_FUND } from '@/app/data/english-pyramid-fantasy';
import { gameLeaderboardRedis } from '@/app/lib/game-leaderboard-redis';

const YAHOO_CHART = 'https://query1.finance.yahoo.com/v8/finance/chart';
const CACHE_TTL_SECONDS = 60 * 60; // 1 hour — daily ETF moves, not tick-by-tick
const REDIS_CACHE_KEY_PREFIX = 'english-pyramid:prize-fund:v1';

export type EnglishPyramidPrizeFundSnapshot = {
  fundName: string;
  yahooSymbol: string;
  investedAmountGbp: number;
  /** True once `units` is set on the config. */
  invested: boolean;
  units: number | null;
  purchasePriceGbp: number | null;
  investedAt: string | null;
  currentPriceGbp: number | null;
  /** Current pot value (units × price), or investedAmount when not yet invested. */
  currentValueGbp: number | null;
  changeGbp: number | null;
  changePercent: number | null;
  dayChangePercent: number | null;
  currency: string | null;
  asOf: string | null;
  note?: string;
  error?: string | null;
};

type YahooChartResult = {
  meta?: {
    currency?: string;
    symbol?: string;
    regularMarketPrice?: number;
    chartPreviousClose?: number;
    regularMarketTime?: number;
  };
  timestamp?: number[];
  indicators?: {
    adjclose?: Array<{ adjclose?: Array<number | null> }>;
    quote?: Array<{ close?: Array<number | null> }>;
  };
};

type YahooChartResponse = {
  chart?: {
    result?: YahooChartResult[] | null;
    error?: { code?: string; description?: string } | null;
  };
};

type CachedQuote = {
  priceGbp: number;
  previousCloseGbp: number | null;
  currency: string;
  asOf: string;
  fetchedAtMs: number;
};

const memoryQuoteCache = new Map<string, CachedQuote>();

function yahooCurrencyToGbpFactor(currency: string | undefined): number {
  const c = (currency ?? 'GBP').trim();
  const upper = c.toUpperCase();
  // LSE sometimes reports GBp / GBX (pence)
  if (upper === 'GBP') return 1;
  if (upper === 'GBX' || c === 'GBp' || upper === 'GBPENCE') return 0.01;
  return 1;
}

function toGbp(price: number, currency: string | undefined): number {
  return price * yahooCurrencyToGbpFactor(currency);
}

function displayCurrency(currency: string | undefined): string {
  const c = (currency ?? 'GBP').trim();
  const upper = c.toUpperCase();
  if (upper === 'GBP' || upper === 'GBX' || c === 'GBp' || upper === 'GBPENCE') return 'GBP';
  return currency ?? 'GBP';
}

async function fetchYahooChart(
  symbol: string,
  params: Record<string, string>
): Promise<YahooChartResult> {
  const qs = new URLSearchParams(params).toString();
  const url = `${YAHOO_CHART}/${encodeURIComponent(symbol)}?${qs}`;
  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; EASalesPyramidPrizeFund/1.0)',
      Accept: 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`Yahoo chart failed (${response.status}) for ${symbol}`);
  }
  const json = (await response.json()) as YahooChartResponse;
  const err = json.chart?.error;
  if (err) {
    throw new Error(`Yahoo chart error for ${symbol}: ${err.description ?? err.code ?? 'unknown'}`);
  }
  const result = json.chart?.result?.[0];
  if (!result) throw new Error(`Yahoo chart empty for ${symbol}`);
  return result;
}

function cacheKeyForSymbol(symbol: string): string {
  return `${REDIS_CACHE_KEY_PREFIX}:${symbol}`;
}

async function readCachedQuote(symbol: string): Promise<CachedQuote | null> {
  const mem = memoryQuoteCache.get(symbol);
  if (mem && Date.now() - mem.fetchedAtMs < CACHE_TTL_SECONDS * 1000) {
    return mem;
  }

  const redis = gameLeaderboardRedis();
  if (redis) {
    try {
      const cached = await redis.get<CachedQuote>(cacheKeyForSymbol(symbol));
      if (cached?.priceGbp != null) {
        memoryQuoteCache.set(symbol, { ...cached, fetchedAtMs: Date.now() });
        return cached;
      }
    } catch {
      // ignore cache read failures
    }
  }
  return null;
}

async function writeCachedQuote(symbol: string, quote: CachedQuote): Promise<void> {
  memoryQuoteCache.set(symbol, quote);
  const redis = gameLeaderboardRedis();
  if (!redis) return;
  try {
    await redis.set(cacheKeyForSymbol(symbol), quote, { ex: CACHE_TTL_SECONDS });
  } catch {
    // ignore cache write failures
  }
}

export async function fetchFundQuoteGbp(symbol: string): Promise<CachedQuote> {
  const cached = await readCachedQuote(symbol);
  if (cached) return cached;

  const result = await fetchYahooChart(symbol, { range: '5d', interval: '1d' });
  const meta = result.meta ?? {};
  const rawPrice = meta.regularMarketPrice;
  if (rawPrice == null || !Number.isFinite(rawPrice)) {
    throw new Error(`No regularMarketPrice for ${symbol}`);
  }
  const currency = meta.currency ?? 'GBP';
  const priceGbp = toGbp(rawPrice, currency);
  const prevRaw = meta.chartPreviousClose;
  const previousCloseGbp =
    prevRaw != null && Number.isFinite(prevRaw) ? toGbp(prevRaw, currency) : null;
  const asOf =
    meta.regularMarketTime != null
      ? new Date(meta.regularMarketTime * 1000).toISOString()
      : new Date().toISOString();

  const quote: CachedQuote = {
    priceGbp,
    previousCloseGbp,
    currency: displayCurrency(currency),
    asOf,
    fetchedAtMs: Date.now(),
  };
  await writeCachedQuote(symbol, quote);
  return quote;
}

/**
 * Look up the GBP close nearest to investedAt (YYYY-MM-DD).
 * Used when purchasePriceGbp is left null after investing.
 */
export async function fetchFundCloseOnDateGbp(
  symbol: string,
  investedAtYmd: string
): Promise<number | null> {
  const dayStart = Date.parse(`${investedAtYmd}T00:00:00Z`);
  if (!Number.isFinite(dayStart)) return null;
  // Pull a small window around the date in case of weekends/holidays
  const period1 = Math.floor(dayStart / 1000) - 5 * 24 * 3600;
  const period2 = Math.floor(dayStart / 1000) + 2 * 24 * 3600;
  const result = await fetchYahooChart(symbol, {
    period1: String(period1),
    period2: String(period2),
    interval: '1d',
  });
  const timestamps = result.timestamp ?? [];
  const closes =
    result.indicators?.adjclose?.[0]?.adjclose ??
    result.indicators?.quote?.[0]?.close ??
    [];
  if (timestamps.length === 0 || closes.length === 0) return null;

  let bestIdx = -1;
  let bestDelta = Number.POSITIVE_INFINITY;
  for (let i = 0; i < timestamps.length; i += 1) {
    const close = closes[i];
    if (close == null || !Number.isFinite(close)) continue;
    const delta = Math.abs(timestamps[i] * 1000 - dayStart);
    if (delta < bestDelta) {
      bestDelta = delta;
      bestIdx = i;
    }
  }
  if (bestIdx < 0) return null;
  return toGbp(closes[bestIdx] as number, result.meta?.currency);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

/**
 * Resolve the live prize pot from config + Yahoo quote.
 * Safe to call on every API request — quotes are cached ~1h.
 */
export async function resolveEnglishPyramidPrizeFund(): Promise<EnglishPyramidPrizeFundSnapshot> {
  const config = ENGLISH_PYRAMID_PRIZE_FUND;
  const invested = config.units != null && config.units > 0;

  const base: EnglishPyramidPrizeFundSnapshot = {
    fundName: config.fundName,
    yahooSymbol: config.yahooSymbol,
    investedAmountGbp: config.investedAmountGbp,
    invested,
    units: config.units,
    purchasePriceGbp: config.purchasePriceGbp,
    investedAt: config.investedAt,
    currentPriceGbp: null,
    currentValueGbp: invested ? null : config.investedAmountGbp,
    changeGbp: null,
    changePercent: null,
    dayChangePercent: null,
    currency: null,
    asOf: null,
    note: config.note,
    error: null,
  };

  try {
    const quote = await fetchFundQuoteGbp(config.yahooSymbol);
    base.currentPriceGbp = round4(quote.priceGbp);
    base.currency = quote.currency;
    base.asOf = quote.asOf;

    if (quote.previousCloseGbp != null && quote.previousCloseGbp > 0) {
      base.dayChangePercent = round2(
        ((quote.priceGbp - quote.previousCloseGbp) / quote.previousCloseGbp) * 100
      );
    }

    if (!invested) {
      return base;
    }

    const units = config.units as number;
    let purchasePrice = config.purchasePriceGbp;

    if (purchasePrice == null && config.investedAt) {
      purchasePrice = await fetchFundCloseOnDateGbp(config.yahooSymbol, config.investedAt);
      if (purchasePrice != null) {
        base.purchasePriceGbp = round4(purchasePrice);
      }
    }

    const currentValue = round2(units * quote.priceGbp);
    base.currentValueGbp = currentValue;

    // Prefer cost basis from units × purchase price; fall back to investedAmountGbp
    const costBasis =
      purchasePrice != null && purchasePrice > 0
        ? round2(units * purchasePrice)
        : config.investedAmountGbp;

    base.changeGbp = round2(currentValue - costBasis);
    if (costBasis > 0) {
      base.changePercent = round2((base.changeGbp / costBasis) * 100);
    }

    return base;
  } catch (error) {
    return {
      ...base,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
