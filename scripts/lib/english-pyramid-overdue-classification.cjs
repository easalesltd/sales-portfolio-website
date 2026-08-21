/**
 * Clock + ESPN status for unrecorded pyramid fixtures.
 * Added time and slow feeds should not fail CI; a posted full-time should.
 */

const { isEspnFinalPeriod } = require('./world-cup-espn-finals.cjs');

const DEFAULT_HARD_OVERDUE_MINUTES = 240;

function isEspnMatchInPlay(espnMatch) {
  return Boolean(espnMatch) && !isEspnFinalPeriod(espnMatch.period, espnMatch);
}

function classifyUnrecordedFixtureOverdue({
  minutesSinceKickoff,
  bufferMinutes,
  hardOverdueMinutes = DEFAULT_HARD_OVERDUE_MINUTES,
  espnMatch = null,
  espnLookupFailed = false,
}) {
  if (minutesSinceKickoff < bufferMinutes) {
    return { overdue: false, reason: 'within-buffer' };
  }

  const inPlay = isEspnMatchInPlay(espnMatch);

  if (minutesSinceKickoff >= hardOverdueMinutes) {
    return {
      overdue: true,
      reason: inPlay ? 'still-in-play-too-long' : 'hard-overdue',
    };
  }

  if (espnLookupFailed) {
    return { overdue: false, reason: 'espn-unavailable' };
  }

  if (inPlay) {
    return { overdue: false, reason: 'in-play' };
  }

  if (espnMatch && isEspnFinalPeriod(espnMatch.period, espnMatch)) {
    return { overdue: true, reason: 'espn-final-missing-from-ledger' };
  }

  return { overdue: false, reason: 'source-not-final' };
}

function dueFixtureNeedsFollowUp(fixture) {
  const espnMatch = fixture.kickoff?.espnMatch;
  if (isEspnMatchInPlay(espnMatch)) return false;
  return true;
}

module.exports = {
  DEFAULT_HARD_OVERDUE_MINUTES,
  classifyUnrecordedFixtureOverdue,
  dueFixtureNeedsFollowUp,
  isEspnMatchInPlay,
};
