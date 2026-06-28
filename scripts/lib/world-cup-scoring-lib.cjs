function parseKnockoutMatchIds(fixturesSource) {
  const ids = new Set();
  const blockPattern = /\{\s*id: '([^']+)',[\s\S]*?\n\s{2}\}/g;

  for (const block of fixturesSource.matchAll(blockPattern)) {
    if (/stage: 'knockout'/.test(block[0])) {
      ids.add(block[1]);
    }
  }

  return ids;
}

function isKnockoutMatchId(id, knockoutFixtureIds) {
  if (knockoutFixtureIds.has(id)) return true;
  return /-(?:r16|qf|sf|final|3p)(?:-|$)/.test(id);
}

function scoreTeamMatch(goalsFor, goalsAgainst, redCards, isKnockout = false) {
  let total = goalsFor > goalsAgainst ? 3 : goalsFor === goalsAgainst ? (isKnockout ? 0 : 1) : 0;
  if (goalsFor >= 3) total += 1;
  if (goalsAgainst >= 3) total -= 1;
  total -= redCards;
  return total;
}

module.exports = {
  parseKnockoutMatchIds,
  isKnockoutMatchId,
  scoreTeamMatch,
};
