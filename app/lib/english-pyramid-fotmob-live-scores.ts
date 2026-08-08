/**
 * FotMob fallback for National League live scores and dismissal totals.
 *
 * ESPN remains the primary feed. FotMob's daily endpoint is useful when ESPN
 * is delayed and exposes explicit home/away red-card totals when available.
 */

import { ENGLISH_PYRAMID_TEAM_BY_CODE } from '@/app/data/english-pyramid-fantasy';
import { gameLeaderboardRedis } from '@/app/lib/game-leaderboard-redis';
import type { MatchdayEntry } from '@/app/lib/english-pyramid-scoring';

const FOTMOB_MATCHES_URL = 'https://www.fotmob.com/api/data/matches';
const CACHE_TTL_SECONDS = 60;
const REDIS_CACHE_KEY_PREFIX = 'english-pyramid:fotmob-national-league:v1';

type FotMobTeam = {
  id?: number;
  name?: string;
  longName?: string;
  score?: number | string;
};

type FotMobStatus = {
  started?: boolean;
  finished?: boolean;
  ongoing?: boolean;
  cancelled?: boolean;
  numberOfHomeRedCards?: number;
  numberOfAwayRedCards?: number;
  liveTime?: { short?: string };
};

export type FotMobDayMatch = {
  id: number;
  home: FotMobTeam;
  away: FotMobTeam;
  status: FotMobStatus;
};

export type FotMobLiveEvent = {
  homeTla: string;
  awayTla: string;
  homeGoals: number;
  awayGoals: number;
  period: string;
  homeRedCards: number;
  awayRedCards: number;
  postponed?: boolean;
};

type MemoryDayCache = {
  matches: FotMobDayMatch[];
  fetchedAtMs: number;
};

const memoryCacheByDate = new Map<string, MemoryDayCache>();

function parseNonNegativeInteger(value: unknown): number | null {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

export function normalizeFotMobTeamName(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\bfootball club\b/g, ' ')
    .replace(/\b(?:afc|fc|town|borough|athletic|city)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function teamNames(team: FotMobTeam): string[] {
  return [...new Set([team.longName, team.name].filter((name): name is string => Boolean(name)))];
}

function teamNameMatches(team: FotMobTeam, fixtureName: string): boolean {
  const expected = normalizeFotMobTeamName(fixtureName);
  return teamNames(team).some((name) => normalizeFotMobTeamName(name) === expected);
}

export function parseFotMobNationalLeagueMatches(payload: unknown): FotMobDayMatch[] {
  if (!payload || typeof payload !== 'object') return [];
  const leagues = (payload as { leagues?: unknown[] }).leagues;
  if (!Array.isArray(leagues)) return [];

  const matches: FotMobDayMatch[] = [];
  for (const league of leagues) {
    if (!league || typeof league !== 'object') continue;
    const leagueName = (league as { name?: string }).name?.trim().toLowerCase();
    if (
      leagueName !== 'national league' &&
      leagueName !== 'national league north' &&
      leagueName !== 'national league south'
    ) {
      continue;
    }

    const leagueMatches = (league as { matches?: unknown[] }).matches;
    if (!Array.isArray(leagueMatches)) continue;

    for (const match of leagueMatches) {
      if (!match || typeof match !== 'object') continue;
      const candidate = match as Partial<FotMobDayMatch>;
      if (
        typeof candidate.id !== 'number' ||
        !candidate.home ||
        !candidate.away ||
        !candidate.status
      ) {
        continue;
      }
      matches.push(candidate as FotMobDayMatch);
    }
  }

  return matches;
}

export function matchFotMobEventToFixture(
  fixture: Pick<MatchdayEntry, 'homeTeam' | 'awayTeam'>,
  matches: readonly FotMobDayMatch[]
): FotMobLiveEvent | null {
  const match = matches.find(
    (candidate) =>
      teamNameMatches(candidate.home, fixture.homeTeam.name) &&
      teamNameMatches(candidate.away, fixture.awayTeam.name)
  );
  if (!match) {
    return null;
  }

  const homeGoals = parseNonNegativeInteger(match.home.score);
  const awayGoals = parseNonNegativeInteger(match.away.score);
  if (match.status.cancelled) {
    return {
      homeTla: fixture.homeTeam.tla,
      awayTla: fixture.awayTeam.tla,
      homeGoals: homeGoals ?? 0,
      awayGoals: awayGoals ?? 0,
      period: 'Postponed',
      homeRedCards: 0,
      awayRedCards: 0,
      postponed: true,
    };
  }
  if (!match.status.started && !match.status.finished) return null;
  if (homeGoals == null || awayGoals == null) return null;

  return {
    homeTla: fixture.homeTeam.tla,
    awayTla: fixture.awayTeam.tla,
    homeGoals,
    awayGoals,
    // The day feed has the final score but not a dependable dismissal list.
    // Keep this non-final until ESPN or the ledger sync verifies match details.
    period: match.status.finished
      ? 'Awaiting final verification'
      : match.status.liveTime?.short?.trim() || 'In progress',
    homeRedCards: parseNonNegativeInteger(match.status.numberOfHomeRedCards) ?? 0,
    awayRedCards: parseNonNegativeInteger(match.status.numberOfAwayRedCards) ?? 0,
  };
}

function isNationalLeagueEntry(entry: MatchdayEntry): boolean {
  return [entry.homeTeam.tla, entry.awayTeam.tla].some(
    (code) => {
      const divisionId = ENGLISH_PYRAMID_TEAM_BY_CODE[code]?.divisionId;
      return divisionId === 'NL' || divisionId === 'NLN' || divisionId === 'NLS';
    }
  );
}

function compactDate(utcDate: string): string {
  return utcDate.slice(0, 10).replace(/-/g, '');
}

function redisKey(date: string): string {
  return `${REDIS_CACHE_KEY_PREFIX}:${date}`;
}

async function fetchFotMobDay(date: string): Promise<FotMobDayMatch[]> {
  const response = await fetch(`${FOTMOB_MATCHES_URL}?date=${date}`, {
    headers: {
      Accept: 'application/json',
      'User-Agent':
        'Mozilla/5.0 (compatible; english-pyramid-live/1.0; +https://github.com/easalesltd/sales-portfolio-website)',
    },
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`FotMob matches request failed (${response.status})`);
  }
  return parseFotMobNationalLeagueMatches(await response.json());
}

async function getCachedFotMobDay(date: string): Promise<FotMobDayMatch[]> {
  const redis = gameLeaderboardRedis();
  if (redis) {
    try {
      const cached = await redis.get<FotMobDayMatch[]>(redisKey(date));
      if (Array.isArray(cached) && cached.length > 0) return cached;
    } catch {
      // Optional cache — continue to memory/network.
    }
  }

  const memory = memoryCacheByDate.get(date);
  if (memory && Date.now() - memory.fetchedAtMs < CACHE_TTL_SECONDS * 1000) {
    return memory.matches;
  }

  const matches = await fetchFotMobDay(date);
  memoryCacheByDate.set(date, { matches, fetchedAtMs: Date.now() });

  if (redis && matches.length > 0) {
    try {
      await redis.set(redisKey(date), matches, { ex: CACHE_TTL_SECONDS });
    } catch {
      // Optional cache.
    }
  }

  return matches;
}

/** Fetch FotMob fallbacks for in-play National League fixtures only. */
export async function fetchFotMobLiveEventsForInPlayEntries(
  entries: readonly MatchdayEntry[]
): Promise<FotMobLiveEvent[]> {
  const relevantEntries = entries.filter(isNationalLeagueEntry);
  const dates = [...new Set(relevantEntries.map((entry) => compactDate(entry.utcDate)))];
  const matchesByDate = new Map(
    await Promise.all(
      dates.map(async (date) => [date, await getCachedFotMobDay(date)] as const)
    )
  );

  return relevantEntries
    .map((entry) =>
      matchFotMobEventToFixture(entry, matchesByDate.get(compactDate(entry.utcDate)) ?? [])
    )
    .filter((event): event is FotMobLiveEvent => event != null);
}
