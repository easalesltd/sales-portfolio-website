import { describe, expect, it } from '@jest/globals';
import { computeStandings, type WorldCupMatchResult } from '@/app/lib/world-cup-scoring';
import type { WorldCupFantasyPlayer } from '@/app/data/world-cup-fantasy';

const players: readonly WorldCupFantasyPlayer[] = [
  {
    id: 'saka-potatoes',
    name: 'Chris',
    teamName: 'Saka Potatoes',
    managerImage: '',
    clubCrest: '',
    teams: ['MEX'],
    draftNote: '',
  },
  {
    id: 'higher-gd',
    name: 'Higher GD',
    teamName: 'Higher GD FC',
    managerImage: '',
    clubCrest: '',
    teams: ['KOR'],
    draftNote: '',
  },
];

const teamTablePlayers: readonly WorldCupFantasyPlayer[] = [
  {
    id: 'saka-potatoes',
    name: 'Chris',
    teamName: 'Saka Potatoes',
    managerImage: '',
    clubCrest: '',
    teams: ['MEX', 'KOR', 'BRA'],
    draftNote: '',
  },
];

const matches: WorldCupMatchResult[] = [
  {
    id: 'mex-win',
    utcDate: '2026-06-12T12:00:00Z',
    status: 'FINISHED',
    homeTeam: { name: 'Mexico', tla: 'MEX' },
    awayTeam: { name: 'South Africa', tla: 'RSA' },
    homeGoals: 1,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    id: 'kor-win',
    utcDate: '2026-06-12T15:00:00Z',
    status: 'FINISHED',
    homeTeam: { name: 'South Korea', tla: 'KOR' },
    awayTeam: { name: 'Czechia', tla: 'CZE' },
    homeGoals: 2,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
];

const teamTableMatches: WorldCupMatchResult[] = [
  ...matches,
  {
    id: 'bra-draw',
    utcDate: '2026-06-12T18:00:00Z',
    status: 'FINISHED',
    homeTeam: { name: 'Brazil', tla: 'BRA' },
    awayTeam: { name: 'Morocco', tla: 'MAR' },
    homeGoals: 3,
    awayGoals: 3,
    homeRedCards: 0,
    awayRedCards: 0,
  },
];

describe('computeStandings', () => {
  it('uses goal difference to order players tied on points', () => {
    const { standings } = computeStandings(players, matches);

    expect(standings.map((row) => row.id)).toEqual(['higher-gd', 'saka-potatoes']);
    expect(standings[0]).toMatchObject({
      points: 3,
      goalsFor: 2,
      goalsAgainst: 0,
      goalDifference: 2,
    });
    expect(standings[1]).toMatchObject({
      points: 3,
      goalsFor: 1,
      goalsAgainst: 0,
      goalDifference: 1,
    });
  });

  it('orders each player team table by points and goal difference', () => {
    const { standings } = computeStandings(teamTablePlayers, teamTableMatches);
    const chris = standings.find((row) => row.id === 'saka-potatoes');

    expect(chris?.teamBreakdown.map((team) => team.code)).toEqual(['KOR', 'MEX', 'BRA']);
    expect(chris?.teamBreakdown.map((team) => team.points)).toEqual([3, 3, 1]);
    expect(chris?.teamBreakdown.map((team) => team.goalDifference)).toEqual([2, 1, 0]);
  });
});
