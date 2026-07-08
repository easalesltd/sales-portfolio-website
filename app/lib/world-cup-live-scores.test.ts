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
    expect(isEspnFullTimePeriod('FT-Pens')).toBe(true);
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
        homeRedCards: 0,
        awayRedCards: 0,
        homeWinner: false,
        awayWinner: false,
        utcDate: null,
        statusName: '',
        statusState: '',
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
          homeRedCards: 0,
          awayRedCards: 0,
        },
      ]
    );

    expect(live).toEqual({
      homeGoals: 0,
      awayGoals: 1,
      period: 'First Half',
      homeRedCards: 0,
      awayRedCards: 0,
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
        homeRedCards: 0,
        awayRedCards: 1,
        homeWinner: false,
        awayWinner: true,
        utcDate: '2026-06-24T19:00:00Z',
        statusName: 'STATUS_FULL_TIME',
        statusState: 'post',
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
        homeRedCards: 0,
        awayRedCards: 1,
      }),
    ]);
  });

  it('converts ESPN penalty winners into non-level provisional knockout scores', () => {
    const schedule: MatchdaySchedule = {
      defaultDate: '2026-07-07',
      fixtureDates: ['2026-07-07'],
      schedulesByDate: {
        '2026-07-07': [
          {
            id: '2026-07-07-r16-8',
            utcDate: '2026-07-07T20:00:00Z',
            status: 'in-play',
            stage: 'knockout',
            homeTeam: { name: 'Switzerland', tla: 'SUI', flag: '🇨🇭' },
            awayTeam: { name: 'Colombia', tla: 'COL', flag: '🇨🇴' },
            homeManagers: [],
            awayManagers: [],
          },
        ],
      },
    };

    const { schedule: enriched, provisionalMatches } = applyLiveScoresToSchedule(schedule, [
      {
        homeTla: 'SUI',
        awayTla: 'COL',
        homeGoals: 0,
        awayGoals: 0,
        period: 'FT-Pens',
        homeRedCards: 0,
        awayRedCards: 0,
        homeWinner: true,
        awayWinner: false,
        utcDate: '2026-07-07T20:00:00Z',
        statusName: 'STATUS_FULL_TIME',
        statusState: 'post',
      },
    ]);

    expect(enriched.schedulesByDate['2026-07-07'][0]).toMatchObject({
      status: 'finished',
      homeGoals: 1,
      awayGoals: 0,
    });
    expect(provisionalMatches).toEqual([
      expect.objectContaining({
        id: '2026-07-07-r16-8',
        status: 'FINISHED',
        homeGoals: 1,
        awayGoals: 0,
      }),
    ]);
  });
});
