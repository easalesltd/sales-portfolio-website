/** @jest-environment node */

import {
  applyLiveScoresToSchedule,
  isEspnFullTimePeriod,
  matchLiveScoreForFixture,
  normalizeEspnAbbrevToTeamCode,
  parseEspnScoreboard,
} from '@/app/lib/world-cup-live-scores';
import type { MatchdaySchedule } from '@/app/lib/world-cup-scoring';

describe('world-cup-live-scores', () => {
  it('detects ESPN full-time period strings', () => {
    expect(isEspnFullTimePeriod('FT')).toBe(true);
    expect(isEspnFullTimePeriod('Full Time')).toBe(true);
    expect(isEspnFullTimePeriod('41\'')).toBe(false);
    expect(isEspnFullTimePeriod('HT')).toBe(false);
  });
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

  it('promotes in-play fixtures to finished with provisional matches when ESPN reports FT', () => {
    const schedule: MatchdaySchedule = {
      defaultDate: '2026-06-24',
      fixtureDates: ['2026-06-24'],
      schedulesByDate: {
        '2026-06-24': [
          {
            id: '2026-06-24-sco-bra',
            utcDate: '2026-06-24T19:00:00Z',
            status: 'in-play',
            homeTeam: { name: 'Scotland', tla: 'SCO', flag: '🏴' },
            awayTeam: { name: 'Brazil', tla: 'BRA', flag: '🇧🇷' },
            homeManagers: [],
            awayManagers: [],
          },
        ],
      },
    };

    const { schedule: enriched, provisionalMatches } = applyLiveScoresToSchedule(schedule, [
      {
        homeTla: 'SCO',
        awayTla: 'BRA',
        homeGoals: 0,
        awayGoals: 2,
        period: 'FT',
      },
    ]);

    expect(enriched.schedulesByDate['2026-06-24'][0]).toMatchObject({
      status: 'finished',
      homeGoals: 0,
      awayGoals: 2,
    });
    expect(provisionalMatches).toEqual([
      expect.objectContaining({
        id: '2026-06-24-sco-bra',
        status: 'FINISHED',
        homeGoals: 0,
        awayGoals: 2,
      }),
    ]);
  });
});
