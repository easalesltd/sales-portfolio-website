/** @jest-environment node */

import {
  applyLiveScoresToSchedule,
  matchLiveScoreForFixture,
  normalizeEspnAbbrevToTeamCode,
  parseEspnScoreboard,
  scoreboardFetchKeysForInPlayEntries,
} from '@/app/lib/english-pyramid-live-scores';
import type { MatchdaySchedule } from '@/app/lib/english-pyramid-scoring';

describe('english-pyramid-live-scores', () => {
  it('normalizes ESPN abbreviations to sweepstake team codes per league', () => {
    expect(normalizeEspnAbbrevToTeamCode('eng.1', 'MNC')).toBe('MCI');
    expect(normalizeEspnAbbrevToTeamCode('eng.4', 'CHES')).toBe('CHS');
    expect(normalizeEspnAbbrevToTeamCode('eng.5', 'BOR')).toBe('BORE');
  });

  it('parses in-progress ESPN events but skips scheduled fixtures', () => {
    const events = parseEspnScoreboard('eng.2', {
      events: [
        {
          status: { type: { description: 'First Half' } },
          competitions: [
            {
              competitors: [
                { homeAway: 'home', team: { abbreviation: 'SHU' }, score: '1' },
                { homeAway: 'away', team: { abbreviation: 'BIR' }, score: '0' },
              ],
            },
          ],
        },
        {
          status: { type: { description: 'Scheduled' } },
          competitions: [
            {
              competitors: [
                { homeAway: 'home', team: { abbreviation: 'MID' }, score: '0' },
                { homeAway: 'away', team: { abbreviation: 'SOU' }, score: '0' },
              ],
            },
          ],
        },
      ],
    });

    expect(events).toEqual([
      {
        homeTla: 'SHU',
        awayTla: 'BIR',
        homeGoals: 1,
        awayGoals: 0,
        period: 'First Half',
      },
    ]);
  });

  it('matches live scores to in-play fixtures by team code', () => {
    const live = matchLiveScoreForFixture(
      {
        homeTeam: { name: 'Sheffield United', tla: 'SHU', flag: '🛡️' },
        awayTeam: { name: 'Birmingham City', tla: 'BIR', flag: '🛡️' },
      },
      [
        {
          homeTla: 'SHU',
          awayTla: 'BIR',
          homeGoals: 1,
          awayGoals: 0,
          period: 'Second Half',
        },
      ]
    );

    expect(live).toEqual({
      homeGoals: 1,
      awayGoals: 0,
      period: 'Second Half',
    });
  });

  it('builds ESPN fetch keys from in-play fixture dates and divisions', () => {
    const keys = scoreboardFetchKeysForInPlayEntries([
      {
        id: '2026-08-15-shu-bir',
        utcDate: '2026-08-15T14:00:00Z',
        status: 'in-play',
        homeTeam: { name: 'Sheffield United', tla: 'SHU', flag: '🛡️' },
        awayTeam: { name: 'Birmingham City', tla: 'BIR', flag: '🛡️' },
        homeManagers: [],
        awayManagers: [],
      },
    ]);

    expect(keys).toEqual([{ slug: 'eng.2', ymd: '20260815' }]);
  });

  it('promotes in-play fixtures to finished with provisional matches when ESPN reports FT', () => {
    const schedule: MatchdaySchedule = {
      defaultDate: '2026-08-15',
      fixtureDates: ['2026-08-15'],
      schedulesByDate: {
        '2026-08-15': [
          {
            id: '2026-08-15-shu-bir',
            utcDate: '2026-08-15T14:00:00Z',
            status: 'in-play',
            homeTeam: { name: 'Sheffield United', tla: 'SHU', flag: '🛡️' },
            awayTeam: { name: 'Birmingham City', tla: 'BIR', flag: '🛡️' },
            homeManagers: [],
            awayManagers: [],
          },
        ],
      },
    };

    const { schedule: enriched, provisionalMatches } = applyLiveScoresToSchedule(schedule, [
      {
        homeTla: 'SHU',
        awayTla: 'BIR',
        homeGoals: 2,
        awayGoals: 1,
        period: 'FT',
      },
    ]);

    expect(enriched.schedulesByDate['2026-08-15'][0]).toMatchObject({
      status: 'finished',
      homeGoals: 2,
      awayGoals: 1,
    });
    expect(provisionalMatches).toEqual([
      expect.objectContaining({
        id: '2026-08-15-shu-bir',
        status: 'FINISHED',
        homeGoals: 2,
        awayGoals: 1,
      }),
    ]);
  });
});
