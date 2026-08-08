/** @jest-environment node */

import {
  matchFotMobEventToFixture,
  normalizeFotMobTeamName,
  parseFotMobNationalLeagueMatches,
} from '@/app/lib/english-pyramid-fotmob-live-scores';
import { mergeLiveScoreEvents } from '@/app/lib/english-pyramid-live-scores';

describe('english-pyramid-fotmob-live-scores', () => {
  const payload = {
    leagues: [
      {
        id: 940355,
        name: 'National League',
        matches: [
          {
            id: 5906358,
            home: { id: 9915, score: 1, name: 'Altrincham', longName: 'Altrincham' },
            away: { id: 8652, score: 0, name: 'Southend', longName: 'Southend United' },
            status: {
              started: true,
              finished: false,
              ongoing: true,
              numberOfHomeRedCards: 0,
              numberOfAwayRedCards: 1,
              liveTime: { short: '31′' },
            },
          },
        ],
      },
      {
        id: 47,
        name: 'Premier League',
        matches: [
          {
            id: 1,
            home: { score: 0, name: 'Arsenal' },
            away: { score: 0, name: 'Chelsea' },
            status: { started: true },
          },
        ],
      },
      {
        id: 940374,
        name: 'National League South',
        matches: [
          {
            id: 5907492,
            home: { id: 6432, score: 0, name: 'Slough Town' },
            away: { id: 9794, score: 0, name: 'Ebbsfleet United' },
            status: { cancelled: true, started: false, finished: false },
          },
        ],
      },
    ],
  };

  it('normalizes harmless club-name variations', () => {
    expect(normalizeFotMobTeamName('AFC Hornchurch')).toBe('hornchurch');
    expect(normalizeFotMobTeamName('Dagenham & Redbridge FC')).toBe(
      'dagenham and redbridge'
    );
    expect(normalizeFotMobTeamName('Hampton & Richmond Borough')).toBe(
      'hampton and richmond'
    );
    expect(normalizeFotMobTeamName('Billericay Town')).toBe('billericay');
  });

  it('parses only National League matches and maps a live score to the fixture', () => {
    const matches = parseFotMobNationalLeagueMatches(payload);
    expect(matches).toHaveLength(2);

    expect(
      matchFotMobEventToFixture(
        {
          homeTeam: { name: 'Altrincham', tla: 'ALT', flag: 'NL' },
          awayTeam: { name: 'Southend United', tla: 'STD', flag: 'NL' },
        },
        matches
      )
    ).toEqual({
      homeTla: 'ALT',
      awayTla: 'STD',
      homeGoals: 1,
      awayGoals: 0,
      period: '31′',
      homeRedCards: 0,
      awayRedCards: 1,
    });
  });

  it('marks postponed tier-six fixtures instead of leaving them falsely live', () => {
    const matches = parseFotMobNationalLeagueMatches(payload);
    expect(
      matchFotMobEventToFixture(
        {
          homeTeam: { name: 'Slough Town', tla: 'SLO', flag: 'NLS' },
          awayTeam: { name: 'Ebbsfleet United', tla: 'EBB', flag: 'NLS' },
        },
        matches
      )
    ).toEqual({
      homeTla: 'SLO',
      awayTla: 'EBB',
      homeGoals: 0,
      awayGoals: 0,
      period: 'Postponed',
      homeRedCards: 0,
      awayRedCards: 0,
      postponed: true,
    });
  });

  it('does not treat a day-feed final as verified full time', () => {
    const matches = parseFotMobNationalLeagueMatches({
      leagues: [
        {
          name: 'National League',
          matches: [
            {
              id: 1,
              home: { score: 2, longName: 'Altrincham' },
              away: { score: 1, longName: 'Southend United' },
              status: { started: true, finished: true },
            },
          ],
        },
      ],
    });

    expect(
      matchFotMobEventToFixture(
        {
          homeTeam: { name: 'Altrincham', tla: 'ALT', flag: 'NL' },
          awayTeam: { name: 'Southend United', tla: 'STD', flag: 'NL' },
        },
        matches
      )?.period
    ).toBe('Awaiting final verification');
  });

  it('supplements ESPN with richer red-card totals without replacing its live score', () => {
    expect(
      mergeLiveScoreEvents(
        [
          {
            homeTla: 'ALT',
            awayTla: 'STD',
            homeGoals: 2,
            awayGoals: 0,
            period: "32'",
            homeRedCards: 0,
            awayRedCards: 0,
          },
        ],
        [
          {
            homeTla: 'ALT',
            awayTla: 'STD',
            homeGoals: 1,
            awayGoals: 0,
            period: '31′',
            homeRedCards: 0,
            awayRedCards: 1,
          },
        ]
      )
    ).toEqual([
      {
        homeTla: 'ALT',
        awayTla: 'STD',
        homeGoals: 2,
        awayGoals: 0,
        period: "32'",
        homeRedCards: 0,
        awayRedCards: 1,
      },
    ]);
  });
});
