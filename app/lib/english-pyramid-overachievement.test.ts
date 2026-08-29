/** @jest-environment node */

import { describe, expect, it } from '@jest/globals';
import type { PlayerStanding, TeamStanding } from '@/app/lib/english-pyramid-scoring';
import {
  buildDraftOverachievement,
  draftSlotLabel,
  draftStrengthSlotIndex,
  managerBandChartMax,
} from '@/app/lib/english-pyramid-overachievement';

function team(overrides: Partial<TeamStanding> & Pick<TeamStanding, 'code' | 'name'>): TeamStanding {
  return {
    flag: '',
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
    points: 0,
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

describe('draftStrengthSlotIndex', () => {
  it('puts title favourites on the left and relegation dogs on the right', () => {
    expect(draftStrengthSlotIndex('title', 1)).toBe(0);
    expect(draftStrengthSlotIndex('title', 7)).toBe(6);
    expect(draftStrengthSlotIndex('survival', 7)).toBe(7);
    expect(draftStrengthSlotIndex('survival', 1)).toBe(13);
    expect(draftSlotLabel('title', 1)).toBe('T1');
    expect(draftSlotLabel('survival', 1)).toBe('R1');
  });
});

describe('buildDraftOverachievement', () => {
  it('flags dogs as overachieving when survival PPG beats title PPG', () => {
    const dave = standing({
      id: 'dave',
      name: 'Dave',
      teams: ['ARS', 'HUL'],
      teamBreakdown: [
        team({ code: 'ARS', name: 'Arsenal', points: 3, playedMatches: 3 }),
        team({ code: 'HUL', name: 'Hull City', points: 12, playedMatches: 3 }),
      ],
    });
    const stats = buildDraftOverachievement([dave]);
    expect(stats.titlePpg).toBe(1);
    expect(stats.survivalPpg).toBe(4);
    expect(stats.dogsOverachieving).toBe(true);
    expect(stats.punchingUp.map((row) => row.code)).toEqual(['HUL']);
    expect(stats.managers[0]?.dogsAhead).toBe(true);
    expect(stats.slots[0]?.avgPpg).toBe(1);
    expect(stats.slots[13]?.avgPpg).toBe(4);
  });

  it('does not flag dogs when title picks still score more per game', () => {
    const dave = standing({
      id: 'dave',
      name: 'Dave',
      teams: ['ARS', 'HUL'],
      teamBreakdown: [
        team({ code: 'ARS', name: 'Arsenal', points: 12, playedMatches: 3 }),
        team({ code: 'HUL', name: 'Hull City', points: 3, playedMatches: 3 }),
      ],
    });
    const stats = buildDraftOverachievement([dave]);
    expect(stats.dogsOverachieving).toBe(false);
    expect(stats.punchingUp).toEqual([]);
  });
});

describe('managerBandChartMax', () => {
  it('uses the highest title or dogs PPG across every manager', () => {
    expect(
      managerBandChartMax([
        {
          managerId: 'dave',
          managerName: 'Dave',
          teamName: 'Creamers',
          titlePpg: 1.3,
          survivalPpg: 2.21,
          titlePoints: 0,
          survivalPoints: 0,
          dogsAhead: true,
        },
        {
          managerId: 'scott',
          managerName: 'Scott',
          teamName: 'Objection',
          titlePpg: 2.53,
          survivalPpg: 2.4,
          titlePoints: 0,
          survivalPoints: 0,
          dogsAhead: false,
        },
      ]),
    ).toBe(2.53);
  });
});
