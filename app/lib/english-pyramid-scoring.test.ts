/** @jest-environment node */

import { describe, expect, it } from '@jest/globals';
import {
  ENGLISH_PYRAMID_DIVISIONS,
  ENGLISH_PYRAMID_FANTASY_PLAYERS,
  ENGLISH_PYRAMID_FIXTURES,
  ENGLISH_PYRAMID_MANUAL_MATCHES,
  ENGLISH_PYRAMID_TEAM_BY_CODE,
  formatPreSeasonTablePlace,
  formatTeamNameWithSeed,
  getDraftBand,
  getDraftDivisionId,
  getPreSeasonOddsRank,
  getPreSeasonTablePlace,
  sortTeamCodesByDraftDivision,
} from '@/app/data/english-pyramid-fantasy';
import { getMatchdaySchedule, manualMatchToResult, scoreTeamMatch, explainTeamMatchLines, explainMatchdayScoring, buildPlayerProgressSeries, buildPeriodProgress } from '@/app/lib/english-pyramid-scoring';

describe('english-pyramid draft fairness', () => {
  it('gives every manager two clubs from each draft division', () => {
    for (const player of ENGLISH_PYRAMID_FANTASY_PLAYERS) {
      const byDraftDiv = new Map<string, string[]>();
      for (const code of player.teams) {
        const draftDiv = getDraftDivisionId(code);
        expect(draftDiv).toBeTruthy();
        const list = byDraftDiv.get(draftDiv!) ?? [];
        list.push(code);
        byDraftDiv.set(draftDiv!, list);
      }
      for (const div of ENGLISH_PYRAMID_DIVISIONS) {
        expect(byDraftDiv.get(div.id)?.length ?? 0).toBe(2);
      }
      expect(player.teams).toHaveLength(14);
    }
  });

  it('pairs title rank k with survival rank k (relegation favourite with title favourite)', () => {
    const mod = (n: number) => ((n % 7) + 7) % 7;

    ENGLISH_PYRAMID_FANTASY_PLAYERS.forEach((player, playerIndex) => {
      const titleRanks: number[] = [];
      const survivalRanks: number[] = [];

      for (const [divisionIndex, div] of ENGLISH_PYRAMID_DIVISIONS.entries()) {
        const expectedRank = mod(playerIndex + divisionIndex) + 1;

        const inDiv = player.teams.filter((code) => getDraftDivisionId(code) === div.id);
        expect(inDiv).toHaveLength(2);

        const title = inDiv.find((code) => getDraftBand(code) === 'title');
        const survival = inDiv.find((code) => getDraftBand(code) === 'survival');
        expect(title).toBeTruthy();
        expect(survival).toBeTruthy();
        expect(getPreSeasonOddsRank(title!)).toBe(expectedRank);
        expect(getPreSeasonOddsRank(survival!)).toBe(expectedRank);

        titleRanks.push(expectedRank);
        survivalRanks.push(expectedRank);
      }

      expect([...titleRanks].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7]);
      expect([...survivalRanks].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
  });

  it('gives the PL title favourite the PL relegation favourite', () => {
    const ash = ENGLISH_PYRAMID_FANTASY_PLAYERS.find((p) => p.id === 'ash');
    expect(ash?.teams).toEqual(expect.arrayContaining(['ARS', 'HUL']));
    expect(getPreSeasonOddsRank('ARS')).toBe(1);
    expect(getPreSeasonOddsRank('HUL')).toBe(1);
    expect(getDraftBand('HUL')).toBe('survival');
  });

  it('formats start-of-season places as 1st / 20th for squad labels', () => {
    expect(getPreSeasonTablePlace('ARS')).toBe(1);
    expect(getPreSeasonTablePlace('HUL')).toBe(20);
    expect(formatPreSeasonTablePlace('ARS')).toBe('1st');
    expect(formatPreSeasonTablePlace('HUL')).toBe('20th');
    expect(formatTeamNameWithSeed('ARS')).toBe('Arsenal (1st)');
    expect(formatTeamNameWithSeed('HUL')).toBe('Hull City (20th)');
    // Championship survival R#1 → 24th
    expect(formatTeamNameWithSeed('LIN')).toBe('Lincoln City (24th)');
    // League One title #7 (Bolton drafted L1) → 7th
    expect(formatTeamNameWithSeed('BOL')).toBe('Bolton Wanderers (7th)');
  });

  it('groups squad codes by draft division with title before survival', () => {
    const ash = ENGLISH_PYRAMID_FANTASY_PLAYERS.find((p) => p.id === 'ash')!;
    expect(sortTeamCodesByDraftDivision(ash.teams).slice(0, 4)).toEqual([
      'ARS',
      'HUL',
      'WOL',
      'CHA',
    ]);
  });

  it('keeps promoted clubs on their draft rung while playing in the new division', () => {
    expect(ENGLISH_PYRAMID_TEAM_BY_CODE.BOL.divisionId).toBe('CH');
    expect(getDraftDivisionId('BOL')).toBe('L1');
    expect(getPreSeasonOddsRank('BOL')).toBe(7);

    expect(ENGLISH_PYRAMID_TEAM_BY_CODE.YOR.divisionId).toBe('L2');
    expect(getDraftDivisionId('YOR')).toBe('NL');
    expect(getPreSeasonOddsRank('YOR')).toBe(7);

    const scott = ENGLISH_PYRAMID_FANTASY_PLAYERS.find((p) => p.id === 'scott');
    expect(scott?.teams).toEqual(expect.arrayContaining(['BOL', 'NCO']));
    expect(scott?.teams.filter((c) => getDraftDivisionId(c) === 'L1')).toHaveLength(2);
  });
});

describe('english-pyramid matchday schedule', () => {
  it('opens on the first fixture date before the season starts', () => {
    const schedule = getMatchdaySchedule(
      ENGLISH_PYRAMID_FIXTURES,
      [],
      ENGLISH_PYRAMID_FANTASY_PLAYERS,
      new Date('2026-06-27T12:00:00Z')
    );

    expect(schedule.defaultDate).toBe('2026-08-08');
    expect(schedule.fixtureDates[0]).toBe('2026-08-08');
    expect(schedule.schedulesByDate['2026-08-08']).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          homeTeam: expect.objectContaining({ tla: 'BUX' }),
          awayTeam: expect.objectContaining({ tla: 'HER' }),
        }),
      ])
    );
  });

  it('carries recorded red cards onto finished matchday rows', () => {
    const schedule = getMatchdaySchedule(
      ENGLISH_PYRAMID_FIXTURES,
      ENGLISH_PYRAMID_MANUAL_MATCHES.map(manualMatchToResult),
      ENGLISH_PYRAMID_FANTASY_PLAYERS,
      new Date('2026-08-08T18:00:00Z')
    );

    expect(schedule.schedulesByDate['2026-08-08']).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: '2026-08-08-alt-std',
          status: 'finished',
          homeRedCards: 1,
          awayRedCards: 0,
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

describe('english-pyramid match scoring explanation', () => {
  it('shows a red-card point cancelled by conceding three', () => {
    const scored = scoreTeamMatch(0, 3, 1, false);
    expect(scored.total).toBe(0);
    expect(explainTeamMatchLines(scored, false)).toEqual([
      { label: 'Loss', points: 0 },
      { label: '3 goals conceded (3+)', points: -1 },
      { label: 'Red card', points: 1 },
    ]);
  });

  it('explains Newport 3-0 Rochdale with a Dale red', () => {
    const explanation = explainMatchdayScoring({
      id: '2026-08-15-nwp-rch',
      utcDate: '2026-08-15T11:30:00Z',
      status: 'finished',
      homeTeam: { name: 'Newport County', tla: 'NWP', flag: 'L2' },
      awayTeam: { name: 'Rochdale', tla: 'RCH', flag: 'L2' },
      homeManagers: [{ id: 'jon', name: 'Jon', teamName: 'Jon FC', teamCode: 'NWP' }],
      awayManagers: [],
      homeGoals: 3,
      awayGoals: 0,
      homeRedCards: 0,
      awayRedCards: 1,
    });

    expect(explanation?.sides[0]).toMatchObject({
      teamTla: 'NWP',
      inSweepstake: true,
      total: 5,
      lines: [
        { label: 'Home win', points: 3 },
        { label: 'Clean sheet', points: 1 },
        { label: '3 goals scored (3+)', points: 1 },
      ],
    });
    expect(explanation?.sides[1]).toMatchObject({
      teamTla: 'RCH',
      inSweepstake: false,
      total: 0,
      lines: [
        { label: 'Loss', points: 0 },
        { label: '3 goals conceded (3+)', points: -1 },
        { label: 'Red card', points: 1 },
      ],
    });
  });
});

describe('english-pyramid season progress series', () => {
  it('groups multiple same-day results into one chart point', () => {
    const players = [
      { id: 'jon', name: 'Jon', teamName: 'Jon FC', clubCrest: '/jon.png' },
      { id: 'ash', name: 'Ash', teamName: 'Ash FC', clubCrest: '/ash.png' },
    ];
    const match = (id: string, utcDate: string, byPlayer: Record<string, number>) => ({
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
    });

    const series = buildPlayerProgressSeries(
      players,
      [
        match('b', '2026-08-15T14:00:00Z', { jon: 3 }),
        match('a', '2026-08-15T11:30:00Z', { jon: 5, ash: 1 }),
        match('c', '2026-08-08T14:00:00Z', { ash: 4 }),
      ],
      { groupByDay: true }
    );

    const jon = series.find((row) => row.playerId === 'jon')!;
    expect(jon.points.map((point) => point.total)).toEqual([0, 0, 8]);
    expect(jon.currentTotal).toBe(8);
    const ash = series.find((row) => row.playerId === 'ash')!;
    expect(ash.points.map((point) => point.total)).toEqual([0, 4, 5]);
  });
});

describe('buildPeriodProgress', () => {
  const players = [
    { id: 'scott', name: 'Scott', teamName: 'Objection', clubCrest: '/s.png', points: 40 },
    { id: 'chris', name: 'Chris', teamName: 'Cajuicey', clubCrest: '/c.png', points: 30 },
  ];
  const match = (id: string, utcDate: string, byPlayer: Record<string, number>) => ({
    match: {
      id,
      utcDate,
      status: 'FINISHED' as const,
      homeTeam: { name: 'Home', tla: 'HOM' },
      awayTeam: { name: 'Away', tla: 'AWY' },
      homeGoals: 1,
      awayGoals: 0,
      homeRedCards: 0,
      awayRedCards: 0,
    },
    byPlayer,
  });

  it('flags a chaser who outscored the leader on the latest day', () => {
    const day = buildPeriodProgress(
      players,
      [
        match('old', '2026-08-15T14:00:00Z', { scott: 10, chris: 2 }),
        match('new', '2026-08-29T14:00:00Z', { scott: 4, chris: 12 }),
      ],
      'day'
    );
    expect(day?.label).toMatch(/29 Aug/);
    const chris = day?.rows.find((row) => row.playerId === 'chris');
    expect(chris?.catchingUp).toBe(true);
    expect(chris?.vsLeader).toBe(8);
    expect(day?.rows[0]?.playerId).toBe('chris');
  });

  it('sums a Monday to Sunday week', () => {
    const week = buildPeriodProgress(
      players,
      [
        match('sat', '2026-08-29T14:00:00Z', { scott: 6, chris: 3 }),
        match('sun', '2026-08-30T13:00:00Z', { scott: 2, chris: 8 }),
        match('old', '2026-08-22T14:00:00Z', { scott: 20 }),
      ],
      'week'
    );
    expect(week?.periodKey).toBe('2026-08-24');
    expect(week?.rows.find((row) => row.playerId === 'chris')?.points).toBe(11);
    expect(week?.rows.find((row) => row.playerId === 'scott')?.points).toBe(8);
  });

  it('sums the latest UK calendar month', () => {
    const month = buildPeriodProgress(
      players,
      [
        match('july', '2026-07-25T14:00:00Z', { scott: 20, chris: 4 }),
        match('aug1', '2026-08-08T14:00:00Z', { scott: 6, chris: 3 }),
        match('aug2', '2026-08-29T14:00:00Z', { scott: 2, chris: 10 }),
      ],
      'month'
    );
    expect(month?.periodKey).toBe('2026-08');
    expect(month?.label).toBe('August 2026');
    expect(month?.rows.find((row) => row.playerId === 'chris')?.points).toBe(13);
    expect(month?.rows.find((row) => row.playerId === 'scott')?.points).toBe(8);
  });
});
