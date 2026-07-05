import {
  findEspnEventForFixture,
  parseEspnScoreboard as parseEspnScoreboardPayload,
  type EspnParsedEvent,
} from '@/app/lib/world-cup-espn-scoreboard';
import { gameLeaderboardRedis } from '@/app/lib/game-leaderboard-redis';
import type {
  MatchdayEntry,
  MatchdaySchedule,
  WorldCupMatchResult,
} from '@/app/lib/world-cup-scoring';

const ESPN_SCOREBOARD_URL =
  'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';
const REDIS_CACHE_KEY = 'world-cup:espn-scoreboard:v1';
const CACHE_TTL_SECONDS = 90;

type MemoryScoreboardCache = {
  events: EspnParsedEvent[];
  fetchedAtMs: number;
};

let memoryScoreboardCache: MemoryScoreboardCache | null = null;

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
  homeRedCards: number;
  awayRedCards: number;
};

export type EspnScoreboardEvent = EspnParsedEvent;

export {
  findEspnEventForFixture,
  normalizeEspnAbbrevToTeamCode,
} from '@/app/lib/world-cup-espn-scoreboard';

export function parseEspnScoreboard(payload: unknown): EspnParsedEvent[] {
  return parseEspnScoreboardPayload(payload, {
    ignoreStatuses: IGNORED_ESPN_STATUSES,
  });
}

async function fetchEspnScoreboardEvents(): Promise<EspnParsedEvent[]> {
  const response = await fetch(ESPN_SCOREBOARD_URL, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`ESPN scoreboard request failed (${response.status})`);
  }

  return parseEspnScoreboardPayload(await response.json(), {
    ignoreStatuses: IGNORED_ESPN_STATUSES,
  });
}

async function readCachedScoreboardFromRedis(): Promise<EspnParsedEvent[] | null> {
  const redis = gameLeaderboardRedis();
  if (!redis) return null;

  try {
    const cached = await redis.get<EspnParsedEvent[]>(REDIS_CACHE_KEY);
    return Array.isArray(cached) && cached.length > 0 ? cached : null;
  } catch {
    return null;
  }
}

async function writeCachedScoreboardToRedis(events: EspnParsedEvent[]): Promise<void> {
  const redis = gameLeaderboardRedis();
  if (!redis || events.length === 0) return;

  try {
    await redis.set(REDIS_CACHE_KEY, events, { ex: CACHE_TTL_SECONDS });
  } catch {
    // Live scores are optional; ignore cache write failures.
  }
}

function readMemoryScoreboardCache(): EspnParsedEvent[] | null {
  if (!memoryScoreboardCache || memoryScoreboardCache.events.length === 0) return null;

  const ageMs = Date.now() - memoryScoreboardCache.fetchedAtMs;
  if (ageMs >= CACHE_TTL_SECONDS * 1000) return null;

  return memoryScoreboardCache.events;
}

function writeMemoryScoreboardCache(events: EspnParsedEvent[]): void {
  if (events.length === 0) return;
  memoryScoreboardCache = { events, fetchedAtMs: Date.now() };
}

async function getCachedScoreboardEvents(): Promise<EspnParsedEvent[]> {
  const redisCached = await readCachedScoreboardFromRedis();
  if (redisCached) return redisCached;

  const memoryCached = readMemoryScoreboardCache();
  if (memoryCached) return memoryCached;

  const events = await fetchEspnScoreboardEvents();
  if (events.length > 0) {
    await writeCachedScoreboardToRedis(events);
    writeMemoryScoreboardCache(events);
  }

  return events;
}

export {
  isEspnFinalPeriod,
  isEspnFullTimePeriod,
} from '@/app/lib/world-cup-espn-finals';

function provisionalMatchFromFinishedEntry(
  entry: MatchdayEntry,
  redCards: { homeRedCards: number; awayRedCards: number }
): WorldCupMatchResult {
  return {
    id: entry.id,
    utcDate: entry.utcDate,
    status: 'FINISHED',
    homeTeam: { name: entry.homeTeam.name, tla: entry.homeTeam.tla },
    awayTeam: { name: entry.awayTeam.name, tla: entry.awayTeam.tla },
    homeGoals: entry.homeGoals!,
    awayGoals: entry.awayGoals!,
    homeRedCards: redCards.homeRedCards,
    awayRedCards: redCards.awayRedCards,
  };
}

export function matchLiveScoreForFixture(
  fixture: Pick<MatchdayEntry, 'homeTeam' | 'awayTeam'>,
  events: readonly EspnParsedEvent[]
): LiveFixtureScore | null {
  const match = findEspnEventForFixture(events, fixture.homeTeam.tla, fixture.awayTeam.tla);
  if (!match) return null;

  return {
    homeGoals: match.homeGoals,
    awayGoals: match.awayGoals,
    period: match.period,
    homeRedCards: match.homeRedCards,
    awayRedCards: match.awayRedCards,
  };
}

export function applyLiveScoresToSchedule(
  schedule: MatchdaySchedule,
  events: readonly EspnParsedEvent[]
): LiveScoresEnrichment {
  const schedulesByDate: Record<string, MatchdayEntry[]> = {};
  const provisionalMatches: WorldCupMatchResult[] = [];

  for (const [date, entries] of Object.entries(schedule.schedulesByDate)) {
    schedulesByDate[date] = entries.map((entry) => {
      if (entry.status !== 'in-play') return entry;

      const live = matchLiveScoreForFixture(entry, events);
      if (!live) return entry;

      if (isEspnFullTimePeriod(live.period)) {
        const finishedEntry: MatchdayEntry = {
          ...entry,
          status: 'finished',
          homeGoals: live.homeGoals,
          awayGoals: live.awayGoals,
        };
        provisionalMatches.push(
          provisionalMatchFromFinishedEntry(finishedEntry, {
            homeRedCards: live.homeRedCards,
            awayRedCards: live.awayRedCards,
          })
        );
        return finishedEntry;
      }

      return {
        ...entry,
        liveHomeGoals: live.homeGoals,
        liveAwayGoals: live.awayGoals,
        livePeriod: live.period,
      };
    });
  }

  return {
    schedule: { ...schedule, schedulesByDate },
    provisionalMatches,
  };
}

export type LiveScoresEnrichment = {
  schedule: MatchdaySchedule;
  provisionalMatches: WorldCupMatchResult[];
};

export async function enrichMatchdayScheduleWithLiveScores(
  schedule: MatchdaySchedule
): Promise<LiveScoresEnrichment> {
  const inPlayEntries = Object.values(schedule.schedulesByDate)
    .flat()
    .filter((entry) => entry.status === 'in-play');

  if (inPlayEntries.length === 0) {
    return { schedule, provisionalMatches: [] };
  }

  let events: EspnParsedEvent[] = [];
  try {
    events = await getCachedScoreboardEvents();
  } catch {
    return { schedule, provisionalMatches: [] };
  }

  return applyLiveScoresToSchedule(schedule, events);
}
