/**
 * ESPN red-card counting shared by World Cup and English pyramid validate scripts.
 * Keep in sync with app/lib/espn-red-cards.ts countRedCardsFromEspnCompetition.
 */

function parseNonNegativeInteger(value) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

function isEspnRedCardDetail(detail) {
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

function redCardsFromCompetitorStatistics(competitor) {
  for (const statistic of competitor?.statistics ?? []) {
    const name = `${statistic.name ?? ''} ${statistic.abbreviation ?? ''}`.toLowerCase();
    if (!/(?:^|\s)red[- ]?cards?(?:\s|$)/.test(name) && name !== 'redcards') continue;
    const parsed = parseNonNegativeInteger(statistic.value ?? statistic.displayValue);
    if (parsed != null) return parsed;
  }
  return 0;
}

function countRedCardsFromEspnCompetition(competition) {
  const competitors = competition?.competitors;
  if (!Array.isArray(competitors) || competitors.length < 2) return null;

  const home = competitors.find((entry) => entry.homeAway === 'home');
  const away = competitors.find((entry) => entry.homeAway === 'away');
  const homeTeamId = home?.team?.id;
  const awayTeamId = away?.team?.id;

  if (homeTeamId == null || awayTeamId == null) return null;

  let homeRedCards = 0;
  let awayRedCards = 0;

  for (const detail of competition.details ?? []) {
    if (!isEspnRedCardDetail(detail)) continue;
    if (detail.team?.id === homeTeamId) homeRedCards += 1;
    else if (detail.team?.id === awayTeamId) awayRedCards += 1;
  }

  return {
    homeRedCards: Math.max(homeRedCards, redCardsFromCompetitorStatistics(home)),
    awayRedCards: Math.max(awayRedCards, redCardsFromCompetitorStatistics(away)),
  };
}

module.exports = {
  countRedCardsFromEspnCompetition,
  isEspnRedCardDetail,
};
