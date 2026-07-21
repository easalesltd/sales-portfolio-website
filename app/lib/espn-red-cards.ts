/**
 * ESPN competition red-card counting (shared by pyramid / tournament sync).
 * Keep in sync with scripts/lib/espn-red-cards.cjs.
 */

export type EspnRedCardCounts = {
  homeRedCards: number;
  awayRedCards: number;
};

type EspnCompetitor = {
  homeAway?: string;
  team?: { id?: string };
};

type EspnDetail = {
  redCard?: boolean;
  team?: { id?: string };
};

type EspnCompetition = {
  competitors?: EspnCompetitor[];
  details?: EspnDetail[];
};

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
