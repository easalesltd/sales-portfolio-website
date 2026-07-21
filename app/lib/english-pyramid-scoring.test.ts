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

    expect(schedule.defaultDate).toBe('2026-08-14');
    expect(schedule.fixtureDates[0]).toBe('2026-08-14');
    expect(schedule.schedulesByDate['2026-08-14']).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          homeTeam: expect.objectContaining({ tla: 'WOL' }),
          awayTeam: expect.objectContaining({ tla: 'BLK' }),
        }),
      ])
    );
  });
});

describe('english-pyramid scoreTeamMatch', () => {
  it('awards 3 for a home win', () => {
    expect(scoreTeamMatch(2, 1).total).toBe(3);
    expect(scoreTeamMatch(2, 1, 0, true).total).toBe(3);
  });

  it('awards 4 for an away win', () => {
    expect(scoreTeamMatch(2, 1, 0, false).total).toBe(4);
  });

  it('awards 1 for a draw', () => {
    expect(scoreTeamMatch(1, 1).total).toBe(1);
  });

  it('scores a boring 0-0 as flat -1 with no draw or clean-sheet points', () => {
    const scored = scoreTeamMatch(0, 0);
    expect(scored.points).toBe(0);
    expect(scored.cleanSheetBonus).toBe(0);
    expect(scored.boringMatchPenalty).toBe(-1);
    expect(scored.total).toBe(-1);
  });

  it('still awards clean sheet on a 1-0 win', () => {
    expect(scoreTeamMatch(1, 0, 0, true).total).toBe(4);
    expect(scoreTeamMatch(1, 0, 0, false).total).toBe(5);
  });

  it('leaves other draws unchanged', () => {
    expect(scoreTeamMatch(1, 1).total).toBe(1);
    expect(scoreTeamMatch(2, 2).boringMatchPenalty).toBe(0);
  });

  it('stacks clean sheet and 3+ goals scored', () => {
    expect(scoreTeamMatch(3, 0, 0, true).total).toBe(5);
    expect(scoreTeamMatch(3, 0, 0, false).total).toBe(6);
  });

  it('applies conceded penalty and red-card bonus', () => {
    // Draw 3-3: 1 + 3+ scored (+1) −3 conceded (−1) = 1
    expect(scoreTeamMatch(3, 3).total).toBe(1);
    // Home win 2-0 with a red: 3 + CS (+1) + red (+1) = 5
    expect(scoreTeamMatch(2, 0, 1, true).total).toBe(5);
    // Away win 2-0 with a red: 4 + CS (+1) + red (+1) = 6
    expect(scoreTeamMatch(2, 0, 1, false).total).toBe(6);
    // Loss 0-4 with two reds: 0 −3 conceded (−1) + 2 reds (+2) = 1
    expect(scoreTeamMatch(0, 4, 2).total).toBe(1);
  });
});
