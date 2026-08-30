/** @jest-environment node */

import { describe, expect, it } from '@jest/globals';
import {
  buildDeadClubs,
  buildDivisionHeatmap,
  buildGapToFirst,
  buildSeedForm,
} from '@/app/lib/english-pyramid-catch-up';
import type { MatchPointsEntry, PlayerStanding, TeamStanding } from '@/app/lib/english-pyramid-scoring';

function team(overrides: Partial<TeamStanding> & Pick<TeamStanding, 'code' | 'name'>): TeamStanding {
  return {
    flag: 'PL',
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    bonusPoints: 0,
    redCards: 0,
    playedMatches: 0,
    ...overrides,
  };
}

function standing(
  overrides: Partial<PlayerStanding> & Pick<PlayerStanding, 'id' | 'name' | 'teams' | 'teamBreakdown'>
): PlayerStanding {
  return {
    teamName: overrides.teamName ?? overrides.name,
    managerImage: '',
    clubCrest: '',
    teamCount: overrides.teams.length,
    draftNote: '',
    points: overrides.points ?? 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    bonusPoints: 0,
    redCards: 0,
    redCardPoints: 0,
    playedMatches: 0,
    ...overrides,
  };
}

function match(id: string, utcDate: string, byPlayer: Record<string, number>): MatchPointsEntry {
  return {
    match: {
      id,
      utcDate,
      status: 'FINISHED',
      homeTeam: { name: 'Home', tla: 'HOM' },
      awayTeam: { name: 'Away', tla: 'AWY' },
      homeGoals: 1,
      awayGoals: 0,
      homeRedCards: 0,
      awayRedCards: 0,
    },
    byPlayer,
  };
}

describe('buildDeadClubs', () => {
  it('names the two lowest-scoring sides that have played', () => {
    const rows = buildDeadClubs([
      standing({
        id: 'dave',
        name: 'Dave',
        teams: ['ARS', 'WOL', 'LUT'],
        teamBreakdown: [
          team({ code: 'ARS', name: 'Arsenal', points: 12, playedMatches: 3, flag: 'PL' }),
          team({ code: 'WOL', name: 'Wolves', points: 1, playedMatches: 3, flag: 'CH' }),
          team({ code: 'LUT', name: 'Luton Town', points: 0, playedMatches: 2, flag: 'L1' }),
        ],
      }),
    ]);
    expect(rows[0]?.clubs.map((club) => club.code)).toEqual(['LUT', 'WOL']);
  });
});

describe('buildDivisionHeatmap', () => {
  it('averages PPG by draft division for each manager', () => {
    const map = buildDivisionHeatmap([
      standing({
        id: 'scott',
        name: 'Scott',
        teams: ['ARS', 'WOL'],
        teamBreakdown: [
          team({ code: 'ARS', name: 'Arsenal', points: 10, playedMatches: 2, flag: 'PL' }),
          team({ code: 'WOL', name: 'Wolves', points: 2, playedMatches: 2, flag: 'CH' }),
        ],
      }),
    ]);
    const pl = map.rows[0]?.cells.find((cell) => cell.divisionId === 'PL');
    const ch = map.rows[0]?.cells.find((cell) => cell.divisionId === 'CH');
    expect(pl?.ppg).toBe(5);
    expect(ch?.ppg).toBe(1);
    expect(map.maxPpg).toBe(5);
  });
});

describe('buildGapToFirst', () => {
  it('converts the points gap into typical matchdays', () => {
    const gap = buildGapToFirst(
      [
        standing({ id: 'scott', name: 'Scott', teams: [], teamBreakdown: [], points: 40 }),
        standing({ id: 'chris', name: 'Chris', teams: [], teamBreakdown: [], points: 20 }),
      ],
      [
        match('a', '2026-08-08T14:00:00Z', { scott: 10, chris: 5 }),
        match('b', '2026-08-15T14:00:00Z', { scott: 10, chris: 5 }),
      ]
    );
    expect(gap?.typicalMatchday).toBe(15);
    expect(gap?.rows.find((row) => row.managerId === 'chris')?.matchdaysBehind).toBeCloseTo(20 / 15);
    expect(gap?.rows.find((row) => row.managerId === 'scott')?.leading).toBe(true);
  });
});

describe('buildSeedForm', () => {
  it('flags clubs above and below their draft-seed average', () => {
    const form = buildSeedForm([
      standing({
        id: 'dave',
        name: 'Dave',
        teams: ['ARS'],
        teamBreakdown: [team({ code: 'ARS', name: 'Arsenal', points: 12, playedMatches: 3, flag: 'PL' })],
      }),
      standing({
        id: 'ben',
        name: 'Ben',
        teams: ['WHU'],
        teamBreakdown: [team({ code: 'WHU', name: 'West Ham', points: 3, playedMatches: 3, flag: 'CH' })],
      }),
    ]);
    expect(form.over[0]?.code).toBe('ARS');
    expect(form.under[0]?.code).toBe('WHU');
    expect(form.over[0]?.delta).toBeGreaterThan(0);
  });
});
