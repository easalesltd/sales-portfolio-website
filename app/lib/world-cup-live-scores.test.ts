/** @jest-environment node */

import {
  matchLiveScoreForFixture,
  normalizeEspnAbbrevToTeamCode,
  parseEspnScoreboard,
} from '@/app/lib/world-cup-live-scores';

describe('world-cup-live-scores', () => {
  it('normalizes ESPN abbreviations to sweepstake team codes', () => {
    expect(normalizeEspnAbbrevToTeamCode('SWI')).toBe('SUI');
    expect(normalizeEspnAbbrevToTeamCode('MOR')).toBe('MAR');
    expect(normalizeEspnAbbrevToTeamCode('BIH')).toBe('BIH');
  });

  it('parses in-progress and finished ESPN events but skips scheduled fixtures', () => {
    const events = parseEspnScoreboard({
      events: [
        {
          status: { type: { description: 'First Half' } },
          competitions: [
            {
              competitors: [
                { homeAway: 'home', team: { abbreviation: 'SCO' }, score: '0' },
                { homeAway: 'away', team: { abbreviation: 'BRA' }, score: '1' },
              ],
            },
          ],
        },
        {
          status: { type: { description: 'Scheduled' } },
          competitions: [
            {
              competitors: [
                { homeAway: 'home', team: { abbreviation: 'CZE' }, score: '0' },
                { homeAway: 'away', team: { abbreviation: 'MEX' }, score: '0' },
              ],
            },
          ],
        },
      ],
    });

    expect(events).toEqual([
      {
        homeTla: 'SCO',
        awayTla: 'BRA',
        homeGoals: 0,
        awayGoals: 1,
        period: 'First Half',
      },
    ]);
  });

  it('matches live scores to in-play fixtures by team code', () => {
    const live = matchLiveScoreForFixture(
      {
        homeTeam: { name: 'Scotland', tla: 'SCO', flag: '🏴' },
        awayTeam: { name: 'Brazil', tla: 'BRA', flag: '🇧🇷' },
      },
      [
        {
          homeTla: 'SCO',
          awayTla: 'BRA',
          homeGoals: 0,
          awayGoals: 1,
          period: 'First Half',
        },
      ]
    );

    expect(live).toEqual({
      homeGoals: 0,
      awayGoals: 1,
      period: 'First Half',
    });
  });
});
