'use client';

import { useEffect, useState } from 'react';
import type { EnglishPyramidPrizeFundSnapshot } from '@/app/lib/english-pyramid-prize-fund';

type Props = {
  prizeFund: EnglishPyramidPrizeFundSnapshot;
};

const MILESTONE_STORAGE_KEY = 'epffl-prize-milestones-v1';

type StoredMilestones = {
  high: number;
  wasBelowInvestment: boolean;
};

function formatGbp(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatSignedGbp(value: number): string {
  const abs = formatGbp(Math.abs(value));
  if (value > 0) return `+${abs}`;
  if (value < 0) return `−${abs}`;
  return abs;
}

function formatSignedPercent(value: number): string {
  const abs = Math.abs(value).toFixed(2);
  if (value > 0) return `+${abs}%`;
  if (value < 0) return `−${abs}%`;
  return `${abs}%`;
}

function formatAsOf(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/London',
  });
}

export default function EnglishPyramidPrizeFundPanel({ prizeFund }: Props) {
  const [milestone, setMilestone] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const value = prizeFund.currentValueGbp;
  const change = prizeFund.changeGbp;
  const changePct = prizeFund.changePercent;
  const up = change != null && change > 0;
  const down = change != null && change < 0;
  const changeTone = up ? 'text-emerald-300' : down ? 'text-red-300' : 'text-[#e8dfc8]/70';
  const asOf = formatAsOf(prizeFund.asOf);

  useEffect(() => {
    if (!prizeFund.invested || value == null || !Number.isFinite(value)) return;

    try {
      const raw = window.localStorage.getItem(MILESTONE_STORAGE_KEY);
      const stored = raw ? (JSON.parse(raw) as StoredMilestones) : null;
      const isBelowInvestment = value < prizeFund.investedAmountGbp;

      if (!stored || !Number.isFinite(stored.high)) {
        window.localStorage.setItem(
          MILESTONE_STORAGE_KEY,
          JSON.stringify({ high: value, wasBelowInvestment: isBelowInvestment })
        );
        return;
      }

      let message: string | null = null;
      if (stored.wasBelowInvestment && !isBelowInvestment) {
        message = `Back above water — the pot has recovered to ${formatGbp(value)}.`;
      } else if (value > stored.high + 0.01) {
        message = `New prize-pot high: ${formatGbp(value)}.`;
      }

      window.localStorage.setItem(
        MILESTONE_STORAGE_KEY,
        JSON.stringify({
          high: Math.max(stored.high, value),
          wasBelowInvestment: isBelowInvestment,
        })
      );

      if (message) {
        setMilestone(message);
        const timeout = window.setTimeout(() => setMilestone(null), 6500);
        return () => window.clearTimeout(timeout);
      }
    } catch {
      // Storage may be disabled in private browsing; valuation still works normally.
    }
  }, [prizeFund.invested, prizeFund.investedAmountGbp, value]);

  const displayValue = value != null ? formatGbp(value) : formatGbp(prizeFund.investedAmountGbp);

  return (
    <section
      className="relative overflow-hidden rounded-lg border border-[#d4af37]/35 bg-[#141f38]/70 px-3 py-2.5 sm:px-4 sm:py-3 [background-image:linear-gradient(135deg,rgba(212,175,55,0.12)_0%,transparent_55%)]"
      aria-label="Prize pot"
    >
      {milestone ? (
        <div
          className="mb-2 flex items-center justify-between gap-3 rounded-md border border-emerald-400/35 bg-emerald-950/50 px-3 py-2.5 text-xs font-semibold text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.12)] sm:mb-3"
          role="status"
        >
          <span>🏆 {milestone}</span>
          <button
            type="button"
            onClick={() => setMilestone(null)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-emerald-100/60 hover:text-emerald-100"
            aria-label="Dismiss prize milestone"
          >
            ×
          </button>
        </div>
      ) : null}

      {/* Mobile compact strip */}
      <div className="sm:hidden">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]/80">
              Prize pot
            </p>
            <p className="mt-0.5 text-2xl font-bold tracking-tight tabular-nums text-[#f5f5f0]">
              {displayValue}
            </p>
            {prizeFund.invested && change != null && changePct != null ? (
              <p className={`mt-0.5 text-xs font-semibold tabular-nums ${changeTone}`}>
                {formatSignedGbp(change)} ({formatSignedPercent(changePct)})
              </p>
            ) : (
              <p className="mt-0.5 text-xs text-[#e8dfc8]/70">Awaiting investment</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setDetailsOpen((open) => !open)}
            className="min-h-10 shrink-0 rounded-md border border-[#d4af37]/30 px-3 text-xs font-semibold text-[#e8dfc8]"
            aria-expanded={detailsOpen}
          >
            {detailsOpen ? 'Hide' : 'Details'}
          </button>
        </div>
        {detailsOpen ? (
          <div className="mt-2 space-y-1 border-t border-white/10 pt-2 text-xs text-[#e8dfc8]/65">
            <p className="font-medium text-[#e8dfc8]/85">{prizeFund.fundName}</p>
            <p className="tabular-nums">
              {prizeFund.yahooSymbol}
              {prizeFund.currentPriceGbp != null ? ` · ${formatGbp(prizeFund.currentPriceGbp)}` : null}
              {prizeFund.dayChangePercent != null ? (
                <span
                  className={
                    prizeFund.dayChangePercent > 0
                      ? ' text-emerald-300'
                      : prizeFund.dayChangePercent < 0
                        ? ' text-red-300'
                        : ''
                  }
                >
                  {' '}
                  ({formatSignedPercent(prizeFund.dayChangePercent)} today)
                </span>
              ) : null}
            </p>
            {prizeFund.invested && prizeFund.units != null ? (
              <p className="tabular-nums">
                {prizeFund.units.toLocaleString('en-GB', { maximumFractionDigits: 4 })} units
                {prizeFund.purchasePriceGbp != null
                  ? ` @ ${formatGbp(prizeFund.purchasePriceGbp)}`
                  : null}
                {prizeFund.investedAt ? ` · since ${prizeFund.investedAt}` : null}
              </p>
            ) : null}
            {asOf ? <p className="text-[11px] text-[#e8dfc8]/45">As of {asOf}</p> : null}
          </div>
        ) : null}
      </div>

      {/* Desktop full layout */}
      <div className="hidden flex-wrap items-start justify-between gap-3 sm:flex">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]/80">
            Prize pot
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight tabular-nums text-[#f5f5f0]">
            {displayValue}
          </p>
          {prizeFund.invested && change != null && changePct != null ? (
            <p className={`mt-1 text-sm font-semibold tabular-nums ${changeTone}`}>
              {formatSignedGbp(change)} ({formatSignedPercent(changePct)}) since invest
            </p>
          ) : (
            <p className="mt-1 text-sm text-[#e8dfc8]/70">
              £{prizeFund.investedAmountGbp.toFixed(0)} cash · awaiting investment
            </p>
          )}
        </div>

        <div className="min-w-0 max-w-full text-right text-sm text-[#e8dfc8]/65">
          <p className="font-medium text-[#e8dfc8]/85">{prizeFund.fundName}</p>
          <p className="mt-0.5 tabular-nums">
            {prizeFund.yahooSymbol}
            {prizeFund.currentPriceGbp != null
              ? ` · ${formatGbp(prizeFund.currentPriceGbp)}`
              : null}
            {prizeFund.dayChangePercent != null ? (
              <span
                className={
                  prizeFund.dayChangePercent > 0
                    ? ' text-emerald-300'
                    : prizeFund.dayChangePercent < 0
                      ? ' text-red-300'
                      : ''
                }
              >
                {' '}
                ({formatSignedPercent(prizeFund.dayChangePercent)} today)
              </span>
            ) : null}
          </p>
          {prizeFund.invested && prizeFund.units != null ? (
            <p className="mt-0.5 tabular-nums">
              {prizeFund.units.toLocaleString('en-GB', { maximumFractionDigits: 4 })} units
              {prizeFund.purchasePriceGbp != null
                ? ` @ ${formatGbp(prizeFund.purchasePriceGbp)}`
                : null}
              {prizeFund.investedAt ? ` · since ${prizeFund.investedAt}` : null}
            </p>
          ) : null}
          {asOf ? <p className="mt-0.5 text-[11px] text-[#e8dfc8]/45">As of {asOf}</p> : null}
        </div>
      </div>

      {prizeFund.error ? (
        <p className="mt-2 text-xs text-amber-300/90">
          Live price unavailable — showing cash pot. ({prizeFund.error})
        </p>
      ) : null}
      {!prizeFund.invested && prizeFund.note ? (
        <p className="mt-2 text-xs text-[#e8dfc8]/45">{prizeFund.note}</p>
      ) : null}
    </section>
  );
}
