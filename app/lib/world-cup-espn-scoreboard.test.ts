/** @jest-environment node */

import {
  countRedCardsFromEspnCompetition,
  findEspnEventForFixture,
  normalizeEspnAbbrevToTeamCode,
  parseEspnScoreboard,
} from '@/app/lib/world-cup-espn-scoreboard';

describe('world-cup-espn-scoreboard', () => {
  it('normalizes ESPN abbreviations to sweepstake team codes', () => {
    expect(normalizeEspnAbbrevToTeamCode('SWI')).toBe('SUI');
    expect(normalizeEspnAbbrevToTeamCode('MOR')).toBe('MAR');
  });

  it('counts red cards from ESPN competition details by team id', () => {
    const counts = countRedCardsFromEspnCompetition({
      competitors: [
        { homeAway: 'home', team: { id: '203', abbreviation: 'MEX' } },
        { homeAway: 'away', team: { id: '209', abbreviation: 'ECU' } },
      ],
      details: [
        { redCard: false, team: { id: '209' } },
        { redCard: true, team: { id: '209' } },
      ],
    });

    expect(counts).toEqual({ homeRedCards: 0, awayRedCards: 1 });
  });

  it('parses finished ESPN events with red-card tallies', () => {
    const events = parseEspnScoreboard({
      events: [
        {
          status: { type: { description: 'FT' } },
          competitions: [
            {
              competitors: [
                { homeAway: 'home', team: { id: '203', abbreviation: 'MEX' }, score: '2' },
                { homeAway: 'away', team: { id: '209', abbreviation: 'ECU' }, score: '0' },
              ],
              details: [{ redCard: true, team: { id: '209' } }],
            },
          ],
        },
      ],
    });

    expect(events).toEqual([
      {
        homeTla: 'MEX',
        awayTla: 'ECU',
        homeGoals: 2,
        awayGoals: 0,
        period: 'FT',
        homeRedCards: 0,
        awayRedCards: 1,
        homeWinner: false,
        awayWinner: false,
        utcDate: null,
        statusName: '',
        statusState: '',
      },
    ]);
  });

  it('finds fixtures by normalized team codes', () => {
    const events = parseEspnScoreboard({
      events: [
        {
          status: { type: { description: 'FT' } },
          competitions: [
            {
              competitors: [
                { homeAway: 'home', team: { id: '1', abbreviation: 'MOR' }, score: '1' },
                { homeAway: 'away', team: { id: '2', abbreviation: 'NED' }, score: '0' },
              ],
              details: [],
            },
          ],
        },
      ],
    });

    expect(findEspnEventForFixture(events, 'MAR', 'NED')).toEqual(events[0]);
  });
});
