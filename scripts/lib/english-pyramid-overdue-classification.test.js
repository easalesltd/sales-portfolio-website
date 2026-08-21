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

  it('waits when the score feed has not listed the fixture yet', () => {
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
