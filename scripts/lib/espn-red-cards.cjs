/**
 * ESPN red-card counting shared by World Cup and English pyramid validate scripts.
 * Keep in sync with app/lib/world-cup-espn-scoreboard.ts countRedCardsFromEspnCompetition.
 */

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
    if (!detail?.redCard) continue;
    if (detail.team?.id === homeTeamId) homeRedCards += 1;
    else if (detail.team?.id === awayTeamId) awayRedCards += 1;
  }

  return { homeRedCards, awayRedCards };
}

module.exports = {
  countRedCardsFromEspnCompetition,
};
