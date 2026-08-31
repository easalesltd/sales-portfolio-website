import { ENGLISH_PYRAMID_TEAM_BY_CODE } from '@/app/data/english-pyramid-fantasy';
import type {
  EnglishPyramidMatchResult,
  MatchdayEntry,
  MatchdaySchedule,
} from '@/app/lib/english-pyramid-scoring';
import { gameLeaderboardRedis } from '@/app/lib/game-leaderboard-redis';
import {
  countRedCardsFromEspnCompetition,
  type EspnRedCardCounts,
} from '@/app/lib/espn-red-cards';
import { isEspnFullTimePeriod } from '@/app/lib/world-cup-espn-finals';
import {
  fetchFwpLiveEventsForInPlayEntries,
  isFwpFullTimePeriod,
} from '@/app/lib/english-pyramid-fwp-live-scores';
import { fetchFotMobLiveEventsForInPlayEntries } from '@/app/lib/english-pyramid-fotmob-live-scores';

const DIVISION_TO_ESPN_SLUG: Record<string, string> = {
  PL: 'eng.1',
  CH: 'eng.2',
  L1: 'eng.3',
  L2: 'eng.4',
  NL: 'eng.5',
};

/** ESPN abbreviation → sweepstake code (per league slug). Mirrors scripts/lib/english-pyramid-fixture-lib.cjs */
const ESPN_ABBREV_BY_SLUG: Record<string, Record<string, string>> = {
  'eng.1': {
    MNC: 'MCI',
    MAN: 'MUN',
    ARS: 'ARS',
    AVL: 'AVL',
    CHE: 'CHE',
    LIV: 'LIV',
    NEW: 'NEW',
    HUL: 'HUL',
    COV: 'COV',
    IPS: 'IPS',
    SUN: 'SUN',
    FUL: 'FUL',
    LEE: 'LEE',
    CRY: 'CRY',
  },
  'eng.2': {
    WHU: 'WHU',
    WOL: 'WOL',
    BUR: 'BUR',
    MID: 'MID',
    BIR: 'BIR',
    SHU: 'SHU',
    SOU: 'SOU',
    BOL: 'BOL',
    LCN: 'LIN',
    CHA: 'CHA',
    CAR: 'CDF',
    PNE: 'PNE',
    POR: 'POR',
    BLK: 'BLK',
  },
  'eng.3': {
    LEI: 'LEI',
    SHW: 'SHW',
    LTN: 'LUT',
    STO: 'STP',
    PLY: 'PLY',
    HUD: 'HUD',
    MKD: 'MKD',
    BRO: 'BRO',
    WIM: 'WIM',
    BRT: 'BTN',
    CAM: 'CAM',
    LEY: 'LEY',
    NCO: 'NCO',
    OXF: 'OXF',
  },
  'eng.4': {
    BAR: 'BAR',
    PTV: 'PVL',
    SAL: 'SAL',
    CHES: 'CHS',
    BRI: 'BRST',
    GRI: 'GRI',
    YORK: 'YOR',
    NEW: 'NWP',
    CHL: 'CHT',
    ACC: 'ACC',
    TRN: 'TRN',
    SHR: 'SHR',
    FLE: 'FLE',
    CRA: 'CRA',
  },
  'eng.5': {
    CAR: 'CAR',
    SOUT: 'STD',
    FGR: 'FGR',
    BOR: 'BORE',
    SCU: 'SCU',
    BRW: 'BRW',
    HOR: 'HRN',
    WEA: 'WEA',
    ALT: 'ALT',
    ALD: 'ALD',
    KID: 'KID',
    SUT: 'SUT',
    TAM: 'TAM',
  },
};

/** ESPN team id → sweepstake code when abbreviation alone is ambiguous. */
const ESPN_TEAM_ID_BY_SLUG: Record<string, Record<string, string>> = {
  'eng.4': { '315': 'YOR' },
  'eng.5': { '323': 'HPL' },
};

/** Keep in sync with ESPN_OPPONENT_ABBREV_COLLISION in scripts/lib/english-pyramid-fixture-lib.cjs */
const ESPN_OPPONENT_ABBREV_COLLISION: Record<string, Record<string, string>> = {
  'eng.3': { BAR: 'BSL' },
};

const REDIS_CACHE_KEY_PREFIX = 'english-pyramid:espn-scoreboard:v1';
const REDIS_RED_FLOOR_PREFIX = 'english-pyramid:red-card-floor:v1';
const CACHE_TTL_SECONDS = 90;
/** Keep a seen dismissal after ESPN/FotMob drop it from the FT payload. */
const RED_CARD_FLOOR_TTL_SECONDS = 48 * 60 * 60;
/** Re-apply live reds onto recently finished ledger rows. */
const RECENT_FINISHED_OVERLAY_MS = 36 * 60 * 60 * 1000;

type MemoryRedCardFloor = EspnRedCardCounts & { savedAtMs: number };

const memoryRedCardFloors = new Map<string, MemoryRedCardFloor>();

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
  postponed?: boolean;
};

type EspnScoreboardEvent = {
  homeTla: string;
  awayTla: string;
  homeGoals: number;
  awayGoals: number;
  period: string;
  homeRedCards: number;
  awayRedCards: number;
  postponed?: boolean;
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

export function normalizeEspnAbbrevToTeamCode(
  slug: string,
  abbrev: string,
  teamId?: string | number | null
): string | null {
  const idKey = teamId != null ? String(teamId) : '';
  const idMapped = idKey ? ESPN_TEAM_ID_BY_SLUG[slug]?.[idKey] : undefined;
  if (idMapped) return idMapped;

  const upper = abbrev.trim().toUpperCase();
  const mapped = ESPN_ABBREV_BY_SLUG[slug]?.[upper];
  if (mapped) return mapped;
  const collision = ESPN_OPPONENT_ABBREV_COLLISION[slug]?.[upper];
  if (collision) return collision;
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
    const slug =
      espnSlugForTeamCode(entry.homeTeam.tla) ??
      espnSlugForTeamCode(entry.awayTeam.tla);
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
    ) as
      | { team?: { abbreviation?: string; id?: string | number }; score?: string | number }
      | undefined;
    const away = competitors.find(
      (entry) =>
        entry &&
        typeof entry === 'object' &&
        (entry as { homeAway?: string }).homeAway === 'away'
    ) as
      | { team?: { abbreviation?: string; id?: string | number }; score?: string | number }
      | undefined;

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

    const homeTla = normalizeEspnAbbrevToTeamCode(slug, homeAbbrev, home?.team?.id);
    const awayTla = normalizeEspnAbbrevToTeamCode(slug, awayAbbrev, away?.team?.id);
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

export function mergeRedCardCounts(
  current: { homeRedCards?: number; awayRedCards?: number } | null | undefined,
  incoming: { homeRedCards?: number; awayRedCards?: number } | null | undefined
): EspnRedCardCounts {
  return {
    homeRedCards: Math.max(current?.homeRedCards ?? 0, incoming?.homeRedCards ?? 0),
    awayRedCards: Math.max(current?.awayRedCards ?? 0, incoming?.awayRedCards ?? 0),
  };
}

export function isRecentLiveScoreCandidate(
  entry: Pick<MatchdayEntry, 'status' | 'utcDate'>,
  nowMs = Date.now()
): boolean {
  if (entry.status === 'in-play' || entry.status === 'postponed') return true;
  if (entry.status !== 'finished') return false;
  const kickoffMs = Date.parse(entry.utcDate);
  if (!Number.isFinite(kickoffMs)) return false;
  return nowMs - kickoffMs < RECENT_FINISHED_OVERLAY_MS && kickoffMs <= nowMs + 5 * 60 * 1000;
}

export function applyRedCardFloorsToRecordedMatches(
  recorded: readonly EnglishPyramidMatchResult[],
  schedule: MatchdaySchedule
): EnglishPyramidMatchResult[] {
  const byId = new Map(
    Object.values(schedule.schedulesByDate)
      .flat()
      .map((entry) => [entry.id, entry] as const)
  );

  return recorded.map((match) => {
    const row = byId.get(match.id);
    if (!row) return match;
    const reds = mergeRedCardCounts(match, row);
    if (
      reds.homeRedCards === (match.homeRedCards ?? 0) &&
      reds.awayRedCards === (match.awayRedCards ?? 0)
    ) {
      return match;
    }
    return { ...match, ...reds };
  });
}

function redCardFloorKey(id: string): string {
  return `${REDIS_RED_FLOOR_PREFIX}:${id}`;
}

async function loadRedCardFloors(ids: readonly string[]): Promise<Map<string, EspnRedCardCounts>> {
  const floors = new Map<string, EspnRedCardCounts>();
  const nowMs = Date.now();

  for (const id of ids) {
    const cached = memoryRedCardFloors.get(id);
    if (!cached || nowMs - cached.savedAtMs >= RED_CARD_FLOOR_TTL_SECONDS * 1000) continue;
    floors.set(id, { homeRedCards: cached.homeRedCards, awayRedCards: cached.awayRedCards });
  }

  const redis = gameLeaderboardRedis();
  if (!redis) return floors;

  const missing = ids.filter((id) => !floors.has(id));
  if (missing.length === 0) return floors;

  try {
    const values = await Promise.all(
      missing.map((id) => redis.get<EspnRedCardCounts>(redCardFloorKey(id)))
    );
    missing.forEach((id, index) => {
      const value = values[index];
      if (!value || typeof value.homeRedCards !== 'number' || typeof value.awayRedCards !== 'number') {
        return;
      }
      floors.set(id, {
        homeRedCards: value.homeRedCards,
        awayRedCards: value.awayRedCards,
      });
    });
  } catch {
    // Floors are optional; live feeds still apply for this request.
  }

  return floors;
}

async function saveRedCardFloors(floors: ReadonlyMap<string, EspnRedCardCounts>): Promise<void> {
  const nowMs = Date.now();
  const persisted = new Map<string, EspnRedCardCounts>();
  for (const [id, reds] of floors) {
    if (reds.homeRedCards <= 0 && reds.awayRedCards <= 0) continue;
    const next = mergeRedCardCounts(memoryRedCardFloors.get(id), reds);
    memoryRedCardFloors.set(id, { ...next, savedAtMs: nowMs });
    persisted.set(id, next);
  }

  const redis = gameLeaderboardRedis();
  if (!redis || persisted.size === 0) return;

  try {
    await Promise.all(
      [...persisted.entries()].map(([id, reds]) =>
        redis.set(redCardFloorKey(id), reds, { ex: RED_CARD_FLOOR_TTL_SECONDS })
      )
    );
  } catch {
    // Optional cache.
  }
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
    postponed: match.postponed,
  };
}

/**
 * Preserve the primary score feed, supplement red-card totals from FotMob, and
 * accept a supplementary full-time result when the primary feed still lags.
 */
export function mergeLiveScoreEvents(
  primaryEvents: readonly EspnScoreboardEvent[],
  supplementaryEvents: readonly EspnScoreboardEvent[]
): EspnScoreboardEvent[] {
  const merged = new Map<string, EspnScoreboardEvent>(
    primaryEvents.map((event) => [`${event.homeTla}|${event.awayTla}`, { ...event }] as const)
  );

  for (const supplementary of supplementaryEvents) {
    const key = `${supplementary.homeTla}|${supplementary.awayTla}`;
    const primary = merged.get(key);
    if (!primary) {
      merged.set(key, { ...supplementary });
      continue;
    }

    const primaryFinished =
      isEspnFullTimePeriod(primary.period) || isFwpFullTimePeriod(primary.period);
    const supplementaryFinished =
      isEspnFullTimePeriod(supplementary.period) || isFwpFullTimePeriod(supplementary.period);
    const useSupplementaryResult = !primaryFinished && supplementaryFinished;

    merged.set(key, {
      ...(useSupplementaryResult ? supplementary : primary),
      homeRedCards: Math.max(primary.homeRedCards, supplementary.homeRedCards),
      awayRedCards: Math.max(primary.awayRedCards, supplementary.awayRedCards),
    });
  }

  return [...merged.values()];
}

export function applyLiveScoresToSchedule(
  schedule: MatchdaySchedule,
  events: readonly EspnScoreboardEvent[],
  options: { redCardFloors?: ReadonlyMap<string, EspnRedCardCounts> } = {}
): LiveScoresEnrichment {
  const schedulesByDate: Record<string, MatchdayEntry[]> = {};
  const provisionalMatches: EnglishPyramidMatchResult[] = [];

  for (const [date, entries] of Object.entries(schedule.schedulesByDate)) {
    schedulesByDate[date] = entries.map((entry) => {
      const live = matchLiveScoreForFixture(entry, events);
      const reds = mergeRedCardCounts(
        mergeRedCardCounts(entry, live),
        options.redCardFloors?.get(entry.id)
      );

      if (entry.status === 'finished') {
        if (
          reds.homeRedCards === (entry.homeRedCards ?? 0) &&
          reds.awayRedCards === (entry.awayRedCards ?? 0)
        ) {
          return entry;
        }
        return { ...entry, ...reds };
      }

      if (entry.status !== 'in-play' && entry.status !== 'postponed') return entry;
      if (!live) {
        if (
          reds.homeRedCards === (entry.homeRedCards ?? 0) &&
          reds.awayRedCards === (entry.awayRedCards ?? 0)
        ) {
          return entry;
        }
        return { ...entry, ...reds };
      }

      if (live.postponed) {
        return {
          ...entry,
          status: 'postponed',
          livePeriod: 'Postponed',
        };
      }

      if (isEspnFullTimePeriod(live.period) || isFwpFullTimePeriod(live.period)) {
        const finishedEntry: MatchdayEntry = {
          ...entry,
          status: 'finished',
          homeGoals: live.homeGoals,
          awayGoals: live.awayGoals,
          ...reds,
          livePeriod: undefined,
        };
        provisionalMatches.push(provisionalMatchFromFinishedEntry(finishedEntry, reds));
        return finishedEntry;
      }

      return {
        ...entry,
        status: 'in-play',
        liveHomeGoals: live.homeGoals,
        liveAwayGoals: live.awayGoals,
        livePeriod: live.period,
        ...reds,
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
  schedule: MatchdaySchedule,
  nowMs = Date.now()
): Promise<LiveScoresEnrichment> {
  const liveCandidateEntries = Object.values(schedule.schedulesByDate)
    .flat()
    .filter((entry) => isRecentLiveScoreCandidate(entry, nowMs));

  if (liveCandidateEntries.length === 0) {
    return { schedule, provisionalMatches: [] };
  }

  const fetchKeys = scoreboardFetchKeysForInPlayEntries(liveCandidateEntries);
  const [espnEvents, fwpEvents, fotMobEvents, redCardFloors] = await Promise.all([
    fetchKeys.length > 0
      ? getCachedScoreboardEventsForKeys(fetchKeys).catch(() => [] as EspnScoreboardEvent[])
      : Promise.resolve([] as EspnScoreboardEvent[]),
    fetchFwpLiveEventsForInPlayEntries(liveCandidateEntries).catch(() => []),
    fetchFotMobLiveEventsForInPlayEntries(liveCandidateEntries).catch(() => []),
    loadRedCardFloors(liveCandidateEntries.map((entry) => entry.id)),
  ]);

  const events = mergeLiveScoreEvents([...espnEvents, ...fwpEvents], fotMobEvents);
  if (events.length === 0 && redCardFloors.size === 0) {
    return { schedule, provisionalMatches: [] };
  }

  const enrichment = applyLiveScoresToSchedule(schedule, events, { redCardFloors });
  const nextFloors = new Map(redCardFloors);
  for (const entry of Object.values(enrichment.schedule.schedulesByDate).flat()) {
    const reds = mergeRedCardCounts(nextFloors.get(entry.id), entry);
    if (reds.homeRedCards > 0 || reds.awayRedCards > 0) {
      nextFloors.set(entry.id, reds);
    }
  }
  await saveRedCardFloors(nextFloors);
  return enrichment;
}
