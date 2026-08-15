import { describe, expect, it } from '@jest/globals';
import type { MatchPointsEntry, PlayerStanding } from '@/app/lib/english-pyramid-scoring';
import {
  awardWinnerLabel,
  computeSweepstakeAwards,
  SWEEPSTAKE_AWARDS_CONFIG,
} from '@/app/lib/english-pyramid-awards';

function standing(
  overrides: Partial<PlayerStanding> & Pick<PlayerStanding, 'id' | 'name' | 'teams'>
): PlayerStanding {
  return {
    teamName: overrides.teamName ?? overrides.name,
    managerImage: '',
    clubCrest: '',
    teamCount: overrides.teams.length,
    draftNote: '',
    teamBreakdown: [],
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

function match(partial: {
  id: string;
  home: string;
  away: string;
  hg: number | null;
  ag: number | null;
}): MatchPointsEntry {
  return {
    byPlayer: {},
    match: {
      id: partial.id,
      utcDate: '2026-08-15T14:00:00Z',
      status: 'FINISHED',
      homeTeam: { name: partial.home, tla: partial.home },
      awayTeam: { name: partial.away, tla: partial.away },
      homeGoals: partial.hg,
      awayGoals: partial.ag,
      homeRedCards: 0,
      awayRedCards: 0,
    },
  };
}

const dan = standing({ id: 'dan', name: 'Dan', teams: ['ARS'], redCards: 3, losses: 1, draws: 2, goalsFor: 8, goalsAgainst: 4 });
const tom = standing({ id: 'tom', name: 'Tom', teams: ['CHE'], redCards: 1, losses: 4, draws: 2, goalsFor: 3, goalsAgainst: 11 });
const alex = standing({ id: 'alex', name: 'Alex', teamName: 'Alex FC', teams: ['LIV'], redCards: 0, losses: 4, draws: 5, goalsFor: 8, goalsAgainst: 11 });

describe('computeSweepstakeAwards', () => {
  it('returns one result per award config', () => {
    const awards = computeSweepstakeAwards([dan, tom, alex], []);
    expect(awards.map((award) => award.id)).toEqual(SWEEPSTAKE_AWARDS_CONFIG.map((award) => award.id));
  });

  it('leaves awards empty when every stat is zero', () => {
    const blank = standing({ id: 'a', name: 'A', teams: ['ARS'] });
    const awards = computeSweepstakeAwards([blank], []);
    for (const award of awards) {
      expect(award.winners).toEqual([]);
      expect(award.value).toBe(0);
    }
  });

  it('uses standings totals for reds, losses, draws, and goals', () => {
    const awards = computeSweepstakeAwards([dan, tom, alex], []);
    const byId = Object.fromEntries(awards.map((award) => [award.id, award]));

    expect(byId['red-cards'].winners.map((w) => w.id)).toEqual(['dan']);
    expect(byId['red-cards'].value).toBe(3);
    expect(byId.losses.winners.map((w) => w.id)).toEqual(['tom', 'alex']);
    expect(byId.losses.value).toBe(4);
    expect(byId.draws.winners.map((w) => w.id)).toEqual(['alex']);
    expect(byId.draws.value).toBe(5);
    expect(byId['goals-for'].winners.map((w) => w.id)).toEqual(['dan', 'alex']);
    expect(byId['goals-for'].value).toBe(8);
    expect(byId['goals-against'].winners.map((w) => w.id)).toEqual(['tom', 'alex']);
    expect(byId['goals-against'].value).toBe(11);
  });

  it('counts 0-0s as sleep merchant, not clean sheets', () => {
    const awards = computeSweepstakeAwards(
      [dan, tom],
      [match({ id: 'm1', home: 'ARS', away: 'CHE', hg: 0, ag: 0 })]
    );
    const byId = Object.fromEntries(awards.map((award) => [award.id, award]));
    expect(byId['boring-draws'].value).toBe(1);
    expect(byId['boring-draws'].winners.map((w) => w.id)).toEqual(['dan', 'tom']);
    expect(byId['clean-sheets'].winners).toEqual([]);
  });

  it('awards clean sheets only when the side also scored', () => {
    const awards = computeSweepstakeAwards(
      [dan, tom],
      [match({ id: 'm1', home: 'ARS', away: 'CHE', hg: 2, ag: 0 })]
    );
    const byId = Object.fromEntries(awards.map((award) => [award.id, award]));
    expect(byId['clean-sheets'].winners.map((w) => w.id)).toEqual(['dan']);
    expect(byId['clean-sheets'].value).toBe(1);
  });

  it('splits 3+ scored and 3+ conceded from the same match', () => {
    const awards = computeSweepstakeAwards(
      [dan, tom],
      [match({ id: 'm1', home: 'ARS', away: 'CHE', hg: 4, ag: 1 })]
    );
    const byId = Object.fromEntries(awards.map((award) => [award.id, award]));
    expect(byId['goals-scored-3plus'].winners.map((w) => w.id)).toEqual(['dan']);
    expect(byId['goals-conceded-3plus'].winners.map((w) => w.id)).toEqual(['tom']);
  });

  it('ignores unfinished matches', () => {
    const awards = computeSweepstakeAwards(
      [dan, tom],
      [match({ id: 'm1', home: 'ARS', away: 'CHE', hg: null, ag: null })]
    );
    const byId = Object.fromEntries(awards.map((award) => [award.id, award]));
    expect(byId['boring-draws'].winners).toEqual([]);
    expect(byId['clean-sheets'].winners).toEqual([]);
  });
});

describe('awardWinnerLabel', () => {
  it('joins team names, falling back to manager name', () => {
    expect(awardWinnerLabel([dan, alex])).toBe('Dan & Alex FC');
  });
});
