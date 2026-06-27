import { describe, expect, it } from '@jest/globals';
import {
  ENGLISH_PYRAMID_FANTASY_PLAYERS,
  ENGLISH_PYRAMID_FIXTURES,
} from '@/app/data/english-pyramid-fantasy';
import { getMatchdaySchedule, scoreTeamMatch } from '@/app/lib/english-pyramid-scoring';

describe('english-pyramid matchday schedule', () => {
  it('opens on the first fixture date before the season starts', () => {
    const schedule = getMatchdaySchedule(
      ENGLISH_PYRAMID_FIXTURES,
      [],
      ENGLISH_PYRAMID_FANTASY_PLAYERS,
      new Date('2026-06-27T12:00:00Z')
    );

    expect(schedule.defaultDate).toBe('2026-08-15');
    expect(schedule.fixtureDates[0]).toBe('2026-08-15');
    expect(schedule.schedulesByDate['2026-08-15']).toHaveLength(3);
  });
});

describe('english-pyramid scoreTeamMatch', () => {
  it('awards 3 for a win', () => {
    expect(scoreTeamMatch(2, 1).total).toBe(3);
  });

  it('awards 1 for a draw', () => {
    expect(scoreTeamMatch(1, 1).total).toBe(1);
  });

  it('adds a clean-sheet bonus', () => {
    expect(scoreTeamMatch(1, 0).total).toBe(4);
    expect(scoreTeamMatch(0, 0).total).toBe(2);
  });

  it('stacks clean sheet and 3+ goals scored', () => {
    expect(scoreTeamMatch(3, 0).total).toBe(5);
  });

  it('applies conceded and red-card penalties', () => {
    expect(scoreTeamMatch(3, 3).total).toBe(1);
    expect(scoreTeamMatch(2, 0, 1).total).toBe(3);
    expect(scoreTeamMatch(0, 4, 2).total).toBe(-3);
  });
});
