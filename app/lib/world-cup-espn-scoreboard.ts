import { WORLD_CUP_TEAM_BY_CODE } from '@/app/data/world-cup-fantasy';

export type EspnRedCardCounts = {
  homeRedCards: number;
  awayRedCards: number;
};

export type EspnParsedEvent = {
  homeTla: string;
  awayTla: string;
  homeGoals: number;
  awayGoals: number;
  period: string;
  homeRedCards: number;
  awayRedCards: number;
  homeWinner: boolean;
  awayWinner: boolean;
};

type EspnCompetitor = {
  homeAway?: string;
  team?: { id?: string; abbreviation?: string };
  score?: string | number;
  winner?: boolean;
};

type EspnDetail = {
  redCard?: boolean;
  team?: { id?: string };
};

type EspnCompetition = {
  competitors?: EspnCompetitor[];
  details?: EspnDetail[];
};

export function normalizeEspnAbbrevToTeamCode(abbrev: string): string {
  const upper = abbrev.trim().toUpperCase();
  if (WORLD_CUP_TEAM_BY_CODE[upper]) return upper;

  for (const meta of Object.values(WORLD_CUP_TEAM_BY_CODE)) {
    if (meta.aliases?.some((alias) => alias.toUpperCase() === upper)) {
      return meta.code;
    }
  }

  return upper;
}

function parseScore(value: string | number | undefined): number | null {
  if (value == null) return null;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function countRedCardsFromEspnCompetition(
  competition: EspnCompetition | undefined
): EspnRedCardCounts | null {
  const competitors = competition?.competitors;
  if (!Array.isArray(competitors) || competitors.length < 2) return null;

  const home = competitors.find((entry) => entry.homeAway === 'home');
  const away = competitors.find((entry) => entry.homeAway === 'away');
  const homeTeamId = home?.team?.id;
  const awayTeamId = away?.team?.id;

  if (homeTeamId == null || awayTeamId == null) return null;

  let homeRedCards = 0;
  let awayRedCards = 0;

  for (const detail of competition?.details ?? []) {
    if (!detail?.redCard) continue;

    if (detail.team?.id === homeTeamId) homeRedCards += 1;
    else if (detail.team?.id === awayTeamId) awayRedCards += 1;
  }

  return { homeRedCards, awayRedCards };
}

export function parseEspnScoreboardEvent(
  event: unknown,
  options?: { ignoreStatuses?: ReadonlySet<string> }
): EspnParsedEvent | null {
  if (!event || typeof event !== 'object') return null;

  const competition = (event as { competitions?: EspnCompetition[] }).competitions?.[0];
  if (!competition) return null;

  const competitors = competition.competitors;
  if (!Array.isArray(competitors) || competitors.length < 2) return null;

  const home = competitors.find((entry) => entry.homeAway === 'home');
  const away = competitors.find((entry) => entry.homeAway === 'away');

  const homeAbbrev = home?.team?.abbreviation;
  const awayAbbrev = away?.team?.abbreviation;
  const homeGoals = parseScore(home?.score);
  const awayGoals = parseScore(away?.score);
  const period =
    (event as { status?: { type?: { description?: string; shortDetail?: string } } }).status?.type
      ?.shortDetail ??
    (event as { status?: { type?: { description?: string } } }).status?.type?.description ??
    '';

  if (!homeAbbrev || !awayAbbrev || homeGoals == null || awayGoals == null) return null;

  const normalizedPeriod = period.trim().toLowerCase();
  if (options?.ignoreStatuses?.has(normalizedPeriod)) return null;

  const redCards = countRedCardsFromEspnCompetition(competition);

  return {
    homeTla: normalizeEspnAbbrevToTeamCode(homeAbbrev),
    awayTla: normalizeEspnAbbrevToTeamCode(awayAbbrev),
    homeGoals,
    awayGoals,
    period: period.trim() || 'In progress',
    homeRedCards: redCards?.homeRedCards ?? 0,
    awayRedCards: redCards?.awayRedCards ?? 0,
    homeWinner: home?.winner === true,
    awayWinner: away?.winner === true,
  };
}

export function parseEspnScoreboard(
  payload: unknown,
  options?: { ignoreStatuses?: ReadonlySet<string> }
): EspnParsedEvent[] {
  if (!payload || typeof payload !== 'object') return [];

  const events = (payload as { events?: unknown[] }).events;
  if (!Array.isArray(events)) return [];

  const parsed: EspnParsedEvent[] = [];
  for (const event of events) {
    const entry = parseEspnScoreboardEvent(event, options);
    if (entry) parsed.push(entry);
  }

  return parsed;
}

export function findEspnEventForFixture(
  events: readonly EspnParsedEvent[],
  homeTla: string,
  awayTla: string
): EspnParsedEvent | undefined {
  return events.find((event) => event.homeTla === homeTla && event.awayTla === awayTla);
}
