/** @jest-environment node */

const {
  classifyUnrecordedFixtureOverdue,
  dueFixtureNeedsFollowUp,
} = require('./english-pyramid-overdue-classification.cjs');

describe('classifyUnrecordedFixtureOverdue', () => {
  it('does not fail a match that has only just passed the buffer while ESPN is still in play', () => {
    expect(
      classifyUnrecordedFixtureOverdue({
        minutesSinceKickoff: 112,
        bufferMinutes: 110,
        espnMatch: { period: '90+4', statusState: 'in' },
      }),
    ).toEqual({ overdue: false, reason: 'in-play' });
  });

  it('fails once ESPN has posted full-time and the ledger is still empty', () => {
    expect(
      classifyUnrecordedFixtureOverdue({
        minutesSinceKickoff: 118,
        bufferMinutes: 115,
        espnMatch: { period: 'FT', statusState: 'post', statusName: 'STATUS_FULL_TIME' },
      }),
    ).toEqual({ overdue: true, reason: 'espn-final-missing-from-ledger' });
  });

  it('fails when ESPN loaded that date and the match is still missing after the grace period', () => {
    expect(
      classifyUnrecordedFixtureOverdue({
        minutesSinceKickoff: 25,
        bufferMinutes: 115,
        espnMatch: null,
        espnLookupFailed: false,
        espnApplicable: true,
      }),
    ).toEqual({ overdue: true, reason: 'stale-listing' });
  });

  it('does not treat a just-kicked-off ESPN blank as stale during the short grace', () => {
    expect(
      classifyUnrecordedFixtureOverdue({
        minutesSinceKickoff: 8,
        bufferMinutes: 115,
        espnMatch: null,
        espnLookupFailed: false,
        espnApplicable: true,
      }),
    ).toEqual({ overdue: false, reason: 'within-buffer' });
  });

  it('waits when the score feed has not listed a non-ESPN fixture yet', () => {
    expect(
      classifyUnrecordedFixtureOverdue({
        minutesSinceKickoff: 120,
        bufferMinutes: 115,
        espnMatch: null,
      }),
    ).toEqual({ overdue: false, reason: 'source-not-final' });
  });

  it('fails after the hard cap even if ESPN is still in play', () => {
    expect(
      classifyUnrecordedFixtureOverdue({
        minutesSinceKickoff: 241,
        bufferMinutes: 115,
        espnMatch: { period: '2nd', statusState: 'in' },
      }),
    ).toEqual({ overdue: true, reason: 'still-in-play-too-long' });
  });
});

describe('dueFixtureNeedsFollowUp', () => {
  it('does not summon the follow-up agent while ESPN is still in play', () => {
    expect(
      dueFixtureNeedsFollowUp({
        kickoff: { espnMatch: { period: '90+2', statusState: 'in' } },
      }),
    ).toBe(false);
  });

  it('does summon the agent when ESPN is final or missing', () => {
    expect(
      dueFixtureNeedsFollowUp({
        kickoff: { espnMatch: { period: 'FT', statusState: 'post' } },
      }),
    ).toBe(true);
    expect(dueFixtureNeedsFollowUp({ kickoff: { espnMatch: null } })).toBe(true);
  });
});
