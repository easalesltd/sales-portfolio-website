import { ENGLISH_PYRAMID_TEAM_BY_CODE } from '@/app/data/english-pyramid-fantasy';
import type {
  EnglishPyramidMatchResult,
  MatchdayEntry,
  MatchdaySchedule,
} from '@/app/lib/english-pyramid-scoring';
import { gameLeaderboardRedis } from '@/app/lib/game-leaderboard-redis';
import { countRedCardsFromEspnCompetition } from '@/app/lib/espn-red-cards';
import { isEspnFullTimePeriod } from '@/app/lib/world-cup-espn-finals';

const DIVISION_TO_ESPN_SLUG: Record<string, string> = {
  PL: 'eng.1',
  CH: 'eng.2',
  L1: 'eng.3',
  L2: 'eng.4',
  NL: 'eng.5',
};

/** ESPN abbreviation → sweepstake code (per league slug). Mirrors scripts/english-pyramid-fetch-fixtures.cjs */
const ESPN_ABBREV_BY_SLUG: Record<string, Record<string, string>> = {
  'eng.1': { MNC: 'MCI', MAN: 'MUN', ARS: 'ARS', AVL: 'AVL', CHE: 'CHE', LIV: 'LIV', NEW: 'NEW' },
  'eng.2': { WHU: 'WHU', WOL: 'WOL', BUR: 'BUR', MID: 'MID', BIR: 'BIR', SHU: 'SHU', SOU: 'SOU' },
  'eng.3': { LEI: 'LEI', SHW: 'SHW', LTN: 'LUT', STO: 'STP', PLY: 'PLY', HUD: 'HUD', BOL: 'BOL' },
  'eng.4': { BAR: 'BAR', ROT: 'ROT', PTV: 'PVL', SAL: 'SAL', CHES: 'CHS', BRI: 'BRST', GRI: 'GRI' },
  'eng.5': { CAR: 'CAR', SOUT: 'STD', FGR: 'FGR', BOR: 'BORE', HAR: 'HPL', SCU: 'SCU', YORK: 'YOR' },
};

const REDIS_CACHE_KEY_PREFIX = 'english-pyramid:espn-scoreboard:v1';
const CACHE_TTL_SECONDS = 90;

type MemoryScoreboardCache = {
  events: EspnScoreboardEvent[];
  fetchedAtMs: number;
};

const memoryScoreboardCacheByKey = new Map<string, MemoryScoreboardCache>();

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

type EspnScoreboardEvent = {
  homeTla: string;
  awayTla: string;
  homeGoals: number;
  awayGoals: number;
  period: string;
  homeRedCards: number;
  awayRedCards: number;
};

type ScoreboardFetchKey = {
  slug: string;
  ymd: string;
};

function parseScore(value: string | number | undefined): number | null {
  if (value == null) return null;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function normalizeEspnAbbrevToTeamCode(slug: string, abbrev: string): string | null {
  const upper = abbrev.trim().toUpperCase();
  const mapped = ESPN_ABBREV_BY_SLUG[slug]?.[upper];
  if (mapped) return mapped;
  // Opponent abbrev only — do not alias across leagues (eng.4 NEW = Newport County).
  return upper;
}

export function espnSlugForTeamCode(code: string): string | null {
  const divisionId = ENGLISH_PYRAMID_TEAM_BY_CODE[code]?.divisionId;
  if (!divisionId) return null;
  return DIVISION_TO_ESPN_SLUG[divisionId] ?? null;
}

export function scoreboardFetchKeysForInPlayEntries(
  entries: readonly MatchdayEntry[]
): ScoreboardFetchKey[] {
  const keys = new Map<string, ScoreboardFetchKey>();

  for (const entry of entries) {
    const slug = espnSlugForTeamCode(entry.homeTeam.tla);
    if (!slug) continue;

    const ymd = entry.utcDate.slice(0, 10).replace(/-/g, '');
    const cacheKey = `${slug}:${ymd}`;
    if (!keys.has(cacheKey)) {
      keys.set(cacheKey, { slug, ymd });
    }
  }

  return [...keys.values()];
}

export function parseEspnScoreboard(slug: string, payload: unknown): EspnScoreboardEvent[] {
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

    const homeTla = normalizeEspnAbbrevToTeamCode(slug, homeAbbrev);
    const awayTla = normalizeEspnAbbrevToTeamCode(slug, awayAbbrev);
    if (!homeTla || !awayTla) continue;

    const redCards = countRedCardsFromEspnCompetition(competition);

    parsed.push({
      homeTla,
      awayTla,
      homeGoals,
      awayGoals,
      period: period.trim() || 'In progress',
      homeRedCards: redCards?.homeRedCards ?? 0,
      awayRedCards: redCards?.awayRedCards ?? 0,
    });
  }

  return parsed;
}

function scoreboardUrl({ slug, ymd }: ScoreboardFetchKey): string {
  return `https://site.api.espn.com/apis/site/v2/sports/soccer/${slug}/scoreboard?dates=${ymd}&limit=100`;
}

function cacheKeyForFetchKey(key: ScoreboardFetchKey): string {
  return `${REDIS_CACHE_KEY_PREFIX}:${key.slug}:${key.ymd}`;
}

async function fetchEspnScoreboardEvents(key: ScoreboardFetchKey): Promise<EspnScoreboardEvent[]> {
  const response = await fetch(scoreboardUrl(key), {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`ESPN scoreboard request failed (${response.status})`);
  }

  return parseEspnScoreboard(key.slug, await response.json());
}

async function readCachedScoreboardFromRedis(
  key: ScoreboardFetchKey
): Promise<EspnScoreboardEvent[] | null> {
  const redis = gameLeaderboardRedis();
  if (!redis) return null;

  try {
    const cached = await redis.get<EspnScoreboardEvent[]>(cacheKeyForFetchKey(key));
    return Array.isArray(cached) && cached.length > 0 ? cached : null;
  } catch {
    return null;
  }
}

async function writeCachedScoreboardToRedis(
  key: ScoreboardFetchKey,
  events: EspnScoreboardEvent[]
): Promise<void> {
  const redis = gameLeaderboardRedis();
  if (!redis || events.length === 0) return;

  try {
    await redis.set(cacheKeyForFetchKey(key), events, { ex: CACHE_TTL_SECONDS });
  } catch {
    // Live scores are optional; ignore cache write failures.
  }
}

function readMemoryScoreboardCache(key: ScoreboardFetchKey): EspnScoreboardEvent[] | null {
  const cached = memoryScoreboardCacheByKey.get(cacheKeyForFetchKey(key));
  if (!cached || cached.events.length === 0) return null;

  const ageMs = Date.now() - cached.fetchedAtMs;
  if (ageMs >= CACHE_TTL_SECONDS * 1000) return null;

  return cached.events;
}

function writeMemoryScoreboardCache(key: ScoreboardFetchKey, events: EspnScoreboardEvent[]): void {
  if (events.length === 0) return;
  memoryScoreboardCacheByKey.set(cacheKeyForFetchKey(key), { events, fetchedAtMs: Date.now() });
}

async function getCachedScoreboardEvents(key: ScoreboardFetchKey): Promise<EspnScoreboardEvent[]> {
  const redisCached = await readCachedScoreboardFromRedis(key);
  if (redisCached) return redisCached;

  const memoryCached = readMemoryScoreboardCache(key);
  if (memoryCached) return memoryCached;

  const events = await fetchEspnScoreboardEvents(key);
  if (events.length > 0) {
    await writeCachedScoreboardToRedis(key, events);
    writeMemoryScoreboardCache(key, events);
  }

  return events;
}

function provisionalMatchFromFinishedEntry(
  entry: MatchdayEntry,
  redCards: { homeRedCards: number; awayRedCards: number }
): EnglishPyramidMatchResult {
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
    homeRedCards: match.homeRedCards,
    awayRedCards: match.awayRedCards,
  };
}

export function applyLiveScoresToSchedule(
  schedule: MatchdaySchedule,
  events: readonly EspnScoreboardEvent[]
): LiveScoresEnrichment {
  const schedulesByDate: Record<string, MatchdayEntry[]> = {};
  const provisionalMatches: EnglishPyramidMatchResult[] = [];

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
  provisionalMatches: EnglishPyramidMatchResult[];
};

async function getCachedScoreboardEventsForKeys(
  keys: readonly ScoreboardFetchKey[]
): Promise<EspnScoreboardEvent[]> {
  const batches = await Promise.all(keys.map((key) => getCachedScoreboardEvents(key)));
  return batches.flat();
}

export async function enrichMatchdayScheduleWithLiveScores(
  schedule: MatchdaySchedule
): Promise<LiveScoresEnrichment> {
  const inPlayEntries = Object.values(schedule.schedulesByDate)
    .flat()
    .filter((entry) => entry.status === 'in-play');

  if (inPlayEntries.length === 0) {
    return { schedule, provisionalMatches: [] };
  }

  const fetchKeys = scoreboardFetchKeysForInPlayEntries(inPlayEntries);
  if (fetchKeys.length === 0) {
    return { schedule, provisionalMatches: [] };
  }

  let events: EspnScoreboardEvent[] = [];
  try {
    events = await getCachedScoreboardEventsForKeys(fetchKeys);
  } catch {
    return { schedule, provisionalMatches: [] };
  }

  return applyLiveScoresToSchedule(schedule, events);
}
