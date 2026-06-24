import { unstable_cache } from 'next/cache';
import { WORLD_CUP_TEAM_BY_CODE } from '@/app/data/world-cup-fantasy';
import { gameLeaderboardRedis } from '@/app/lib/game-leaderboard-redis';
import type { MatchdayEntry, MatchdaySchedule } from '@/app/lib/world-cup-scoring';

const ESPN_SCOREBOARD_URL =
  'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';
const REDIS_CACHE_KEY = 'world-cup:espn-scoreboard:v1';
const CACHE_TTL_SECONDS = 90;

const IGNORED_ESPN_STATUSES = new Set([
  'scheduled',
  'postponed',
  'canceled',
  'cancelled',
  'delayed',
  'suspended',
]);

export type LiveFixtureScore = {
  homeGoals: number;
  awayGoals: number;
  period: string;
};

type EspnScoreboardEvent = {
  homeTla: string;
  awayTla: string;
  homeGoals: number;
  awayGoals: number;
  period: string;
};

function parseScore(value: string | number | undefined): number | null {
  if (value == null) return null;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function normalizeEspnAbbrevToTeamCode(abbrev: string): string {
  const upper = abbrev.trim().toUpperCase();
  if (WORLD_CUP_TEAM_BY_CODE[upper]) return upper;

  for (const [code, meta] of Object.entries(WORLD_CUP_TEAM_BY_CODE)) {
    if (meta.aliases?.some((alias) => alias.toUpperCase() === upper)) {
      return code;
    }
  }

  return upper;
}

export function parseEspnScoreboard(payload: unknown): EspnScoreboardEvent[] {
  if (!payload || typeof payload !== 'object') return [];

  const events = (payload as { events?: unknown[] }).events;
  if (!Array.isArray(events)) return [];

  const parsed: EspnScoreboardEvent[] = [];

  for (const event of events) {
    if (!event || typeof event !== 'object') continue;

    const competition = (event as { competitions?: unknown[] }).competitions?.[0];
    if (!competition || typeof competition !== 'object') continue;

    const competitors = (competition as { competitors?: unknown[] }).competitors;
    if (!Array.isArray(competitors) || competitors.length < 2) continue;

    const home = competitors.find(
      (entry) =>
        entry &&
        typeof entry === 'object' &&
        (entry as { homeAway?: string }).homeAway === 'home'
    ) as { team?: { abbreviation?: string }; score?: string | number } | undefined;
    const away = competitors.find(
      (entry) =>
        entry &&
        typeof entry === 'object' &&
        (entry as { homeAway?: string }).homeAway === 'away'
    ) as { team?: { abbreviation?: string }; score?: string | number } | undefined;

    const homeAbbrev = home?.team?.abbreviation;
    const awayAbbrev = away?.team?.abbreviation;
    const homeGoals = parseScore(home?.score);
    const awayGoals = parseScore(away?.score);
    const period =
      (event as { status?: { type?: { description?: string; shortDetail?: string } } }).status?.type
        ?.shortDetail ??
      (event as { status?: { type?: { description?: string } } }).status?.type?.description ??
      '';

    if (!homeAbbrev || !awayAbbrev || homeGoals == null || awayGoals == null) continue;
    if (IGNORED_ESPN_STATUSES.has(period.trim().toLowerCase())) continue;

    parsed.push({
      homeTla: normalizeEspnAbbrevToTeamCode(homeAbbrev),
      awayTla: normalizeEspnAbbrevToTeamCode(awayAbbrev),
      homeGoals,
      awayGoals,
      period: period.trim() || 'In progress',
    });
  }

  return parsed;
}

async function fetchEspnScoreboardEvents(): Promise<EspnScoreboardEvent[]> {
  const response = await fetch(ESPN_SCOREBOARD_URL, {
    headers: { Accept: 'application/json' },
    next: { revalidate: CACHE_TTL_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`ESPN scoreboard request failed (${response.status})`);
  }

  return parseEspnScoreboard(await response.json());
}

async function readCachedScoreboardFromRedis(): Promise<EspnScoreboardEvent[] | null> {
  const redis = gameLeaderboardRedis();
  if (!redis) return null;

  try {
    const cached = await redis.get<EspnScoreboardEvent[]>(REDIS_CACHE_KEY);
    return Array.isArray(cached) ? cached : null;
  } catch {
    return null;
  }
}

async function writeCachedScoreboardToRedis(events: EspnScoreboardEvent[]): Promise<void> {
  const redis = gameLeaderboardRedis();
  if (!redis) return;

  try {
    await redis.set(REDIS_CACHE_KEY, events, { ex: CACHE_TTL_SECONDS });
  } catch {
    // Live scores are optional; ignore cache write failures.
  }
}

const getCachedScoreboardWithoutRedis = unstable_cache(
  async () => fetchEspnScoreboardEvents(),
  ['world-cup-espn-scoreboard'],
  { revalidate: CACHE_TTL_SECONDS }
);

async function getCachedScoreboardEvents(): Promise<EspnScoreboardEvent[]> {
  const cached = await readCachedScoreboardFromRedis();
  if (cached) return cached;

  const events = gameLeaderboardRedis()
    ? await fetchEspnScoreboardEvents()
    : await getCachedScoreboardWithoutRedis();

  if (gameLeaderboardRedis()) {
    await writeCachedScoreboardToRedis(events);
  }

  return events;
}

export function matchLiveScoreForFixture(
  fixture: Pick<MatchdayEntry, 'homeTeam' | 'awayTeam'>,
  events: readonly EspnScoreboardEvent[]
): LiveFixtureScore | null {
  const match = events.find(
    (event) =>
      event.homeTla === fixture.homeTeam.tla && event.awayTla === fixture.awayTeam.tla
  );

  if (!match) return null;

  return {
    homeGoals: match.homeGoals,
    awayGoals: match.awayGoals,
    period: match.period,
  };
}

export async function enrichMatchdayScheduleWithLiveScores(
  schedule: MatchdaySchedule
): Promise<MatchdaySchedule> {
  const inPlayEntries = Object.values(schedule.schedulesByDate)
    .flat()
    .filter((entry) => entry.status === 'in-play');

  if (inPlayEntries.length === 0) return schedule;

  let events: EspnScoreboardEvent[] = [];
  try {
    events = await getCachedScoreboardEvents();
  } catch {
    return schedule;
  }

  const schedulesByDate: Record<string, MatchdayEntry[]> = {};

  for (const [date, entries] of Object.entries(schedule.schedulesByDate)) {
    schedulesByDate[date] = entries.map((entry) => {
      if (entry.status !== 'in-play') return entry;

      const live = matchLiveScoreForFixture(entry, events);
      if (!live) return entry;

      return {
        ...entry,
        liveHomeGoals: live.homeGoals,
        liveAwayGoals: live.awayGoals,
        livePeriod: live.period,
      };
    });
  }

  return { ...schedule, schedulesByDate };
}
