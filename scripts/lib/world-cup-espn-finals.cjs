/**
 * ESPN final-status and ledger score resolution for World Cup sync scripts.
 * Keep penalty winner logic in sync with app/lib/world-cup-espn-finals.ts.
 */

function isEspnFullTimePeriod(period) {
  const normalized = period.trim().toLowerCase();
  if (!normalized) return false;

  return (
    normalized === 'ft' ||
    normalized === 'full time' ||
    normalized === 'final' ||
    normalized.startsWith('status_full') ||
    /^full.?time\b/.test(normalized) ||
    /\bft\b/.test(normalized)
  );
}

function isEspnFinalPeriod(period) {
  const normalized = period.trim().toLowerCase();
  if (!normalized) return false;
  if (isEspnFullTimePeriod(period)) return true;

  return (
    normalized === 'ft-pens' ||
    normalized.includes('after pen') ||
    (normalized.includes('pen') &&
      (normalized.includes('ft') || normalized.includes('final') || normalized.includes('score')))
  );
}

/**
 * Map ESPN 90-minute / AET scores to ledger goals.
 * Knockout ties decided on pens use winner flags when regulation/AET is level.
 */
function resolveLedgerGoalsFromEspnMatch(espnMatch, isKnockout) {
  let homeGoals = espnMatch.homeGoals;
  let awayGoals = espnMatch.awayGoals;

  if (isKnockout && homeGoals === awayGoals) {
    const homeWinner = espnMatch.homeWinner === true;
    const awayWinner = espnMatch.awayWinner === true;

    if (homeWinner && !awayWinner) {
      homeGoals = awayGoals + 1;
    } else if (awayWinner && !homeWinner) {
      awayGoals = homeGoals + 1;
    } else {
      return null;
    }
  }

  if (isKnockout && homeGoals === awayGoals) {
    return null;
  }

  return { homeGoals, awayGoals };
}

module.exports = {
  isEspnFullTimePeriod,
  isEspnFinalPeriod,
  resolveLedgerGoalsFromEspnMatch,
};
