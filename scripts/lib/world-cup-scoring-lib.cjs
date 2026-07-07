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

const WORLD_CUP_R32_FIXTURE_IDS = new Set([
  '2026-06-13-qat-sui',
  '2026-06-28-rsa-can',
  '2026-06-29-bra-jpn',
  '2026-06-29-ger-par',
  '2026-06-30-ned-mar',
  '2026-06-30-civ-nor',
  '2026-06-30-fra-swe',
  '2026-07-01-mex-ecu',
  '2026-07-01-eng-cod',
  '2026-07-01-bel-sen',
  '2026-07-02-usa-bih',
  '2026-07-02-esp-aut',
  '2026-07-02-por-cro',
  '2026-07-03-sui-alg',
  '2026-07-03-aus-egy',
  '2026-07-03-arg-cpv',
  '2026-07-04-col-gha',
]);

function isKnockoutMatchId(id, knockoutFixtureIds) {
  if (knockoutFixtureIds.has(id)) return true;
  if (WORLD_CUP_R32_FIXTURE_IDS.has(id)) return true;
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
