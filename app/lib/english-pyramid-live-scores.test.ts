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
    expect(normalizeEspnAbbrevToTeamCode('eng.4', 'YORK')).toBe('YOR');
    expect(normalizeEspnAbbrevToTeamCode('eng.5', 'HAR', '323')).toBe('HPL');
    expect(normalizeEspnAbbrevToTeamCode('eng.5', 'HAR', '19262')).toBe('HAR');
    expect(normalizeEspnAbbrevToTeamCode('eng.4', 'NEW')).toBe('NEW');
    expect(normalizeEspnAbbrevToTeamCode('eng.1', 'NEW')).toBe('NEW');
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
        homeRedCards: 0,
        awayRedCards: 0,
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
          homeRedCards: 0,
          awayRedCards: 0,
        },
      ]
    );

    expect(live).toEqual({
      homeGoals: 1,
      awayGoals: 0,
      period: 'Second Half',
      homeRedCards: 0,
      awayRedCards: 0,
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
        homeRedCards: 1,
        awayRedCards: 0,
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
        homeRedCards: 1,
        awayRedCards: 0,
      }),
    ]);
  });

  it('counts red cards from ESPN competition details', () => {
    const events = parseEspnScoreboard('eng.2', {
      events: [
        {
          status: { type: { description: 'FT' } },
          competitions: [
            {
              competitors: [
                { homeAway: 'home', team: { id: '1', abbreviation: 'SHU' }, score: '2' },
                { homeAway: 'away', team: { id: '2', abbreviation: 'BIR' }, score: '1' },
              ],
              details: [{ redCard: true, team: { id: '1' } }],
            },
          ],
        },
      ],
    });

    expect(events[0]?.homeRedCards).toBe(1);
    expect(events[0]?.awayRedCards).toBe(0);
  });
});
