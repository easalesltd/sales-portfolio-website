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
    expect(normalizeEspnAbbrevToTeamCode('eng.4', 'NEW')).toBe('NWP');
    expect(normalizeEspnAbbrevToTeamCode('eng.1', 'NEW')).toBe('NEW');
    expect(normalizeEspnAbbrevToTeamCode('eng.2', 'LCN')).toBe('LIN');
    expect(normalizeEspnAbbrevToTeamCode('eng.2', 'CAR')).toBe('CDF');
    expect(normalizeEspnAbbrevToTeamCode('eng.5', 'CAR')).toBe('CAR');
    expect(normalizeEspnAbbrevToTeamCode('eng.3', 'BRT')).toBe('BTN');
    expect(normalizeEspnAbbrevToTeamCode('eng.3', 'BAR')).toBe('BSL');
    expect(normalizeEspnAbbrevToTeamCode('eng.4', 'BAR')).toBe('BAR');
    expect(normalizeEspnAbbrevToTeamCode('eng.4', 'CHL')).toBe('CHT');
    expect(normalizeEspnAbbrevToTeamCode('eng.5', 'HOR')).toBe('HRN');
  });

  it('remaps League One Barnsley (ESPN BAR) onto fixture code BSL', () => {
    const events = parseEspnScoreboard('eng.3', {
      events: [
        {
          status: { type: { description: 'Second Half', shortDetail: "76'" } },
          competitions: [
            {
              competitors: [
                { homeAway: 'home', team: { abbreviation: 'BAR' }, score: '0' },
                { homeAway: 'away', team: { abbreviation: 'BRO' }, score: '1' },
              ],
            },
          ],
        },
      ],
    });

    expect(events[0]).toMatchObject({
      homeTla: 'BSL',
      awayTla: 'BRO',
      homeGoals: 0,
      awayGoals: 1,
    });

    expect(
      matchLiveScoreForFixture(
        {
          homeTeam: { name: 'Barnsley', tla: 'BSL', flag: 'L1' },
          awayTeam: { name: 'Bromley', tla: 'BRO', flag: 'L1' },
        },
        events
      )
    ).toMatchObject({
      homeGoals: 0,
      awayGoals: 1,
      period: "76'",
    });
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

  it('builds a fetch key when the drafted club is the away side', () => {
    const keys = scoreboardFetchKeysForInPlayEntries([
      {
        id: '2026-08-15-bost-ald',
        utcDate: '2026-08-15T14:00:00Z',
        status: 'in-play',
        homeTeam: { name: 'Boston United', tla: 'BOST', flag: 'NL' },
        awayTeam: { name: 'Aldershot Town', tla: 'ALD', flag: 'NL' },
        homeManagers: [],
        awayManagers: [],
      },
    ]);

    expect(keys).toEqual([{ slug: 'eng.5', ymd: '20260815' }]);
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
      homeRedCards: 1,
      awayRedCards: 0,
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

  it('copies live red cards onto in-play matchday rows', () => {
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

    const { schedule: enriched } = applyLiveScoresToSchedule(schedule, [
      {
        homeTla: 'SHU',
        awayTla: 'BIR',
        homeGoals: 1,
        awayGoals: 0,
        period: 'Second Half',
        homeRedCards: 0,
        awayRedCards: 1,
      },
    ]);

    expect(enriched.schedulesByDate['2026-08-15'][0]).toMatchObject({
      status: 'in-play',
      liveHomeGoals: 1,
      liveAwayGoals: 0,
      homeRedCards: 0,
      awayRedCards: 1,
    });
  });

  it('overrides a stale postponed fixture when a live source has the score', () => {
    const schedule: MatchdaySchedule = {
      defaultDate: '2026-08-29',
      fixtureDates: ['2026-08-29'],
      schedulesByDate: {
        '2026-08-29': [
          {
            id: '2026-08-29-hor-fnh',
            utcDate: '2026-08-29T14:00:00Z',
            status: 'postponed',
            livePeriod: 'Postponed',
            homeTeam: { name: 'Horsham', tla: 'HOR', flag: 'NLS' },
            awayTeam: { name: 'Farnham Town', tla: 'FNH', flag: 'NLS' },
            homeManagers: [],
            awayManagers: [],
          },
        ],
      },
    };

    const { schedule: enriched, provisionalMatches } = applyLiveScoresToSchedule(schedule, [
      {
        homeTla: 'HOR',
        awayTla: 'FNH',
        homeGoals: 1,
        awayGoals: 2,
        period: 'FT',
        homeRedCards: 0,
        awayRedCards: 0,
      },
    ]);

    expect(enriched.schedulesByDate['2026-08-29'][0]).toMatchObject({
      status: 'finished',
      homeGoals: 1,
      awayGoals: 2,
    });
    expect(provisionalMatches).toEqual([
      expect.objectContaining({
        id: '2026-08-29-hor-fnh',
        homeGoals: 1,
        awayGoals: 2,
      }),
    ]);
  });

  it('never drops a live red once the fixture is recorded as finished', () => {
    const schedule: MatchdaySchedule = {
      defaultDate: '2026-08-31',
      fixtureDates: ['2026-08-31'],
      schedulesByDate: {
        '2026-08-31': [
          {
            id: '2026-08-31-wrk-oxc',
            utcDate: '2026-08-31T14:00:00Z',
            status: 'finished',
            homeGoals: 0,
            awayGoals: 1,
            homeRedCards: 0,
            awayRedCards: 0,
            homeTeam: { name: 'Worksop Town', tla: 'WRK', flag: 'NLN' },
            awayTeam: { name: 'Oxford City', tla: 'OXC', flag: 'NLN' },
            homeManagers: [],
            awayManagers: [],
          },
        ],
      },
    };

    const { schedule: enriched, provisionalMatches } = applyLiveScoresToSchedule(schedule, [
      {
        homeTla: 'WRK',
        awayTla: 'OXC',
        homeGoals: 0,
        awayGoals: 1,
        period: 'FT',
        homeRedCards: 0,
        awayRedCards: 1,
      },
    ]);

    expect(enriched.schedulesByDate['2026-08-31'][0]).toMatchObject({
      status: 'finished',
      homeGoals: 0,
      awayGoals: 1,
      homeRedCards: 0,
      awayRedCards: 1,
    });
    expect(provisionalMatches).toEqual([]);
  });

  it('keeps a stored red-card floor when the live feed later reports zero', () => {
    const schedule: MatchdaySchedule = {
      defaultDate: '2026-08-31',
      fixtureDates: ['2026-08-31'],
      schedulesByDate: {
        '2026-08-31': [
          {
            id: '2026-08-31-dag-slo',
            utcDate: '2026-08-31T14:00:00Z',
            status: 'in-play',
            homeTeam: { name: 'Dagenham & Redbridge', tla: 'DAG', flag: 'NLS' },
            awayTeam: { name: 'Slough Town', tla: 'SLO', flag: 'NLS' },
            homeManagers: [],
            awayManagers: [],
          },
        ],
      },
    };

    const { schedule: enriched } = applyLiveScoresToSchedule(
      schedule,
      [
        {
          homeTla: 'DAG',
          awayTla: 'SLO',
          homeGoals: 1,
          awayGoals: 0,
          period: 'FT',
          homeRedCards: 0,
          awayRedCards: 0,
        },
      ],
      {
        redCardFloors: new Map([['2026-08-31-dag-slo', { homeRedCards: 1, awayRedCards: 0 }]]),
      }
    );

    expect(enriched.schedulesByDate['2026-08-31'][0]).toMatchObject({
      status: 'finished',
      homeRedCards: 1,
      awayRedCards: 0,
    });
  });
});
