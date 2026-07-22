/**
 * Near-live NL North/South scores from Football Web Pages competition day pages.
 * ESPN does not cover these divisions; FWP updates fwp-status-* cells during matches.
 */

import { gameLeaderboardRedis } from '@/app/lib/game-leaderboard-redis';
import type { MatchdayEntry } from '@/app/lib/english-pyramid-scoring';
import { ENGLISH_PYRAMID_TEAM_BY_CODE } from '@/app/data/english-pyramid-fantasy';

const FWP_ORIGIN = 'https://www.footballwebpages.co.uk';
const CACHE_TTL_SECONDS = 45;
const REDIS_CACHE_KEY_PREFIX = 'english-pyramid:fwp-scoreboard:v1';

export type FwpScoreboardEvent = {
  homeTla: string;
  awayTla: string;
  homeGoals: number;
  awayGoals: number;
  period: string;
  homeRedCards: number;
  awayRedCards: number;
};

const FWP_CODE_BY_SLUG: Record<string, string> = {
  'south-shields': 'SSH',
  macclesfield: 'MAC',
  'merthyr-town': 'MER',
  'worksop-town': 'WRK',
  darlington: 'DAR',
  buxton: 'BUX',
  chester: 'CHF',
  'hebburn-town': 'HEB',
  'spalding-united': 'SPA',
  'bedford-town': 'BED',
  'harborough-town': 'HBO',
  'hednesford-town': 'HED',
  'oxford-city': 'OXC',
  marine: 'MAR',
  'afc-telford-united': 'TEL',
  'brackley-town': 'BRK',
  chorley: 'CHO',
  hereford: 'HER',
  'kings-lynn-town': 'KLT',
  morecambe: 'MOR',
  radcliffe: 'RAD',
  'scarborough-athletic': 'SCA',
  southport: 'SPT',
  'spennymoor-town': 'SPE',
  'dagenham-and-redbridge': 'DAG',
  'torquay-united': 'TOR',
  horsham: 'HOR',
  'weston-super-mare': 'WSM',
  'maidstone-united': 'MAI',
  'ebbsfleet-united': 'EBB',
  'chelmsford-city': 'CLM',
  'farnham-town': 'FNH',
  'afc-totton': 'AFT',
  'dover-athletic': 'DOV',
  salisbury: 'SBY',
  'chesham-united': 'CHU',
  'tonbridge-angels': 'TON',
  'walton-and-hersham': 'WAH',
  'billericay-town': 'BIL',
  'braintree-town': 'BRT',
  'dorking-wanderers': 'DOR',
  farnborough: 'FAR',
  'folkestone-invicta': 'FOL',
  'hampton-and-richmond-borough': 'HRB',
  'hemel-hempstead-town': 'HEM',
  'maidenhead-united': 'MDH',
  'slough-town': 'SLO',
  'truro-city': 'TRU',
};

type MemoryCache = {
  events: FwpScoreboardEvent[];
  fetchedAtMs: number;
};

const memoryCacheByKey = new Map<string, MemoryCache>();

function isNlnNlsTeam(code: string): boolean {
  const divisionId = ENGLISH_PYRAMID_TEAM_BY_CODE[code]?.divisionId;
  return divisionId === 'NLN' || divisionId === 'NLS';
}

function competitionForTeam(code: string): 'national-league-north' | 'national-league-south' | null {
  const divisionId = ENGLISH_PYRAMID_TEAM_BY_CODE[code]?.divisionId;
  if (divisionId === 'NLN') return 'national-league-north';
  if (divisionId === 'NLS') return 'national-league-south';
  return null;
}

function looksLikeKickoff(status: string): boolean {
  return /^\d{1,2}([.:]\d{2})?\s*(am|pm)$/i.test(status.trim());
}

export function isFwpFullTimePeriod(period: string): boolean {
  const normalized = period.trim().toLowerCase();
  return (
    normalized === 'ft' ||
    normalized === 'full time' ||
    normalized === 'full-time' ||
    normalized.startsWith('full time') ||
    /\bft\b/.test(normalized)
  );
}

function parseLiveFromTitleAndStatus(
  title: string,
  status: string
): Omit<FwpScoreboardEvent, 'homeTla' | 'awayTla'> | null {
  const statusTrim = status.trim();
  if (!statusTrim || looksLikeKickoff(statusTrim)) return null;

  const titleScore = title.match(/^(.+?)\s+(\d+)\s*[-–]\s*(\d+)\s+(.+)$/);
  const statusScore = statusTrim.match(/^(\d+)\s*[-–]\s*(\d+)$/);
  const isFt = isFwpFullTimePeriod(statusTrim);

  if (titleScore) {
    return {
      homeGoals: Number(titleScore[2]),
      awayGoals: Number(titleScore[3]),
      period: isFt ? 'FT' : 'In progress',
      homeRedCards: 0,
      awayRedCards: 0,
    };
  }

  if (statusScore) {
    return {
      homeGoals: Number(statusScore[1]),
      awayGoals: Number(statusScore[2]),
      period: isFt ? 'FT' : 'In progress',
      homeRedCards: 0,
      awayRedCards: 0,
    };
  }

  return null;
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&quot;/g, '"')
    .trim();
}

export function parseFwpCompetitionDayHtml(html: string): FwpScoreboardEvent[] {
  const events: FwpScoreboardEvent[] = [];
  const rowPattern = /<tr[^>]*title="([^"]+)" data-href="(match\/[^"]+)"[^>]*>([\s\S]*?)<\/tr>/g;

  for (const match of html.matchAll(rowPattern)) {
    const title = decodeHtmlEntities(match[1]);
    const href = match[2];
    const body = match[3];
    const parts = href.split('/');
    if (parts.length < 6 || parts[0] !== 'match') continue;

    const homeSlug = parts[3];
    const awaySlug = parts[4];
    const homeTla = FWP_CODE_BY_SLUG[homeSlug];
    const awayTla = FWP_CODE_BY_SLUG[awaySlug];
    if (!homeTla || !awayTla) continue;

    const statusMatch =
      body.match(/id="fwp-status-\d+"[^>]*>([^<]*)/) ??
      body.match(/class="[^"]*status[^"]*"[^>]*>([^<]*)/) ??
      body.match(/class="ko-score"[^>]*>([^<]*)/);
    if (!statusMatch) continue;

    const live = parseLiveFromTitleAndStatus(title, decodeHtmlEntities(statusMatch[1]));
    if (!live) continue;

    events.push({
      homeTla,
      awayTla,
      homeGoals: live.homeGoals,
      awayGoals: live.awayGoals,
      period: live.period,
      homeRedCards: 0,
      awayRedCards: 0,
    });
  }

  return events;
}

function ymdCompactFromUtcDate(utcDate: string): string {
  return utcDate.slice(0, 10).replace(/-/g, '');
}

function cacheKey(comp: string, ymd: string): string {
  return `${REDIS_CACHE_KEY_PREFIX}:${comp}:${ymd}`;
}

async function fetchCompetitionDayHtml(comp: string, ymd: string): Promise<string> {
  const url = `${FWP_ORIGIN}/${comp}/${ymd}`;
  const response = await fetch(url, {
    headers: {
      Accept: 'text/html',
      'User-Agent':
        'Mozilla/5.0 (compatible; english-pyramid-live/1.0; +https://github.com/easalesltd/sales-portfolio-website)',
    },
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`FWP live request failed (${response.status}): ${url}`);
  }
  return response.text();
}

async function getCachedFwpDayEvents(comp: string, ymd: string): Promise<FwpScoreboardEvent[]> {
  const key = cacheKey(comp, ymd);

  const redis = gameLeaderboardRedis();
  if (redis) {
    try {
      const cached = await redis.get<FwpScoreboardEvent[]>(key);
      if (Array.isArray(cached) && cached.length > 0) return cached;
    } catch {
      // optional
    }
  }

  const memory = memoryCacheByKey.get(key);
  if (memory && Date.now() - memory.fetchedAtMs < CACHE_TTL_SECONDS * 1000) {
    return memory.events;
  }

  const html = await fetchCompetitionDayHtml(comp, ymd);
  const events = parseFwpCompetitionDayHtml(html);
  memoryCacheByKey.set(key, { events, fetchedAtMs: Date.now() });

  if (redis && events.length > 0) {
    try {
      await redis.set(key, events, { ex: CACHE_TTL_SECONDS });
    } catch {
      // optional
    }
  }

  return events;
}

/** Fetch FWP live/FT scores for in-play NLN/NLS matchday entries. */
export async function fetchFwpLiveEventsForInPlayEntries(
  entries: readonly MatchdayEntry[]
): Promise<FwpScoreboardEvent[]> {
  const dayKeys = new Map<string, { comp: string; ymd: string }>();

  for (const entry of entries) {
    const homeComp = competitionForTeam(entry.homeTeam.tla);
    const awayComp = competitionForTeam(entry.awayTeam.tla);
    const comp = homeComp ?? awayComp;
    if (!comp) continue;
    if (!isNlnNlsTeam(entry.homeTeam.tla) && !isNlnNlsTeam(entry.awayTeam.tla)) continue;

    const ymd = ymdCompactFromUtcDate(entry.utcDate);
    dayKeys.set(`${comp}:${ymd}`, { comp, ymd });
  }

  if (dayKeys.size === 0) return [];

  const batches = await Promise.all(
    [...dayKeys.values()].map(async ({ comp, ymd }) => {
      try {
        return await getCachedFwpDayEvents(comp, ymd);
      } catch {
        return [] as FwpScoreboardEvent[];
      }
    })
  );

  return batches.flat();
}
