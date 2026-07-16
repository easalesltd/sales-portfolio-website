/** Keep in sync with app/lib/world-cup-knockout-bracket.ts WORLD_CUP_SWEEPSTAKE_FINAL_FIXTURE_ID */

const WORLD_CUP_SWEEPSTAKE_FINAL_FIXTURE_ID = '2026-07-19-final';

function isWorldCupSweepstakeComplete(manualMatches) {
  const final = manualMatches.find((match) => match.id === WORLD_CUP_SWEEPSTAKE_FINAL_FIXTURE_ID);
  if (!final) return false;
  return final.homeGoals != null && final.awayGoals != null;
}

module.exports = {
  WORLD_CUP_SWEEPSTAKE_FINAL_FIXTURE_ID,
  isWorldCupSweepstakeComplete,
};
