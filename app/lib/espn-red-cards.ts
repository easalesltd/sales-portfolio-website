/**
 * ESPN competition red-card counting (shared by pyramid / tournament sync).
 * Keep in sync with scripts/lib/espn-red-cards.cjs.
 *
 * Live scoreboard payloads often set `redCard: true` on a detail. After FT that
 * flag (or the whole details array) can disappear even though type id 93/95 or
 * competitor `redCards` statistics still record the dismissal.
 */

export type EspnRedCardCounts = {
  homeRedCards: number;
  awayRedCards: number;
};

type EspnStatistic = {
  name?: string;
  abbreviation?: string;
  displayValue?: string | number;
  value?: string | number;
};

type EspnCompetitor = {
  homeAway?: string;
  team?: { id?: string };
  statistics?: EspnStatistic[];
};

type EspnDetail = {
  redCard?: boolean;
  yellowRedCard?: boolean;
  team?: { id?: string };
  type?: { id?: string | number; text?: string };
};

type EspnCompetition = {
  competitors?: EspnCompetitor[];
  details?: EspnDetail[];
};

function parseNonNegativeInteger(value: unknown): number | null {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

export function isEspnRedCardDetail(detail: EspnDetail | undefined): boolean {
  if (!detail) return false;
  if (detail.redCard === true || detail.yellowRedCard === true) return true;

  const typeId = String(detail.type?.id ?? '');
  if (typeId === '93' || typeId === '95') return true;

  const text = String(detail.type?.text ?? '')
    .trim()
    .toLowerCase();
  if (!text || text === 'yellow card') return false;
  return (
    text === 'red card' ||
    text === 'yellow red' ||
    text === 'yellow-red' ||
    text === 'second yellow' ||
    text === 'second yellow card' ||
    text.includes('second yellow')
  );
}

function redCardsFromCompetitorStatistics(competitor: EspnCompetitor | undefined): number {
  for (const statistic of competitor?.statistics ?? []) {
    const name = `${statistic.name ?? ''} ${statistic.abbreviation ?? ''}`.toLowerCase();
    if (!/(?:^|\s)red[- ]?cards?(?:\s|$)/.test(name) && name !== 'redcards') continue;
    const parsed = parseNonNegativeInteger(statistic.value ?? statistic.displayValue);
    if (parsed != null) return parsed;
  }
  return 0;
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
    if (!isEspnRedCardDetail(detail)) continue;

    if (detail.team?.id === homeTeamId) homeRedCards += 1;
    else if (detail.team?.id === awayTeamId) awayRedCards += 1;
  }

  return {
    homeRedCards: Math.max(homeRedCards, redCardsFromCompetitorStatistics(home)),
    awayRedCards: Math.max(awayRedCards, redCardsFromCompetitorStatistics(away)),
  };
}
