import { describe, expect, it } from '@jest/globals';
import {
  buildPlayerProgressSeries,
  computeStandings,
  getTeamMatchDisplay,
  getMatchdaySchedule,
  getUpcomingFixtures,
  resolveManagerImageForStandings,
  type WorldCupMatchResult,
} from '@/app/lib/world-cup-scoring';
import {
  getWorldCupTeamSearchTerms,
  WORLD_CUP_FANTASY_FIXTURES,
  WORLD_CUP_FANTASY_MANUAL_MATCHES,
  WORLD_CUP_FANTASY_PLAYERS,
  WORLD_CUP_TEAM_BY_CODE,
  type WorldCupFantasyPlayer,
} from '@/app/data/world-cup-fantasy';

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

describe('resolveManagerImageForStandings', () => {
  const player = { id: 'jon', managerImage: '/images/world-cup-fantasy/managers/jon.png' };

  it('uses top image for first place', () => {
    expect(resolveManagerImageForStandings(player, 0, 6)).toBe(
      '/images/world-cup-fantasy/managers/jon-top.png'
    );
  });

  it('uses bottom image for last place', () => {
    expect(resolveManagerImageForStandings(player, 5, 6)).toBe(
      '/images/world-cup-fantasy/managers/jon-bottom.png'
    );
  });

  it('uses default image for middle positions', () => {
    expect(resolveManagerImageForStandings(player, 2, 6)).toBe(player.managerImage);
  });
});

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

  it('has metadata for every assigned sweepstake team', () => {
    const assignedCodes = new Set(WORLD_CUP_FANTASY_PLAYERS.flatMap((player) => player.teams));

    for (const code of assignedCodes) {
      expect(WORLD_CUP_TEAM_BY_CODE[code]).toBeDefined();
    }
  });

  it('lists common source spellings for manual score checks', () => {
    expect(getWorldCupTeamSearchTerms('CIV')).toEqual(
      expect.arrayContaining(['CIV', 'Ivory Coast', "Côte d'Ivoire", "Cote d'Ivoire"])
    );
    expect(getWorldCupTeamSearchTerms('CPV')).toEqual(
      expect.arrayContaining(['CPV', 'Cape Verde', 'Cabo Verde'])
    );
    expect(getWorldCupTeamSearchTerms('TUR')).toEqual(
      expect.arrayContaining(['TUR', 'Turkey', 'Türkiye', 'Turkiye'])
    );
    expect(getWorldCupTeamSearchTerms('KOR')).toEqual(
      expect.arrayContaining(['KOR', 'South Korea', 'Korea Republic'])
    );
  });

  it("returns today's upcoming fixtures with involved managers", () => {
    const fixtures = getUpcomingFixtures(
      WORLD_CUP_FANTASY_FIXTURES,
      WORLD_CUP_FANTASY_PLAYERS,
      new Date('2026-06-15T20:58:00Z')
    );

    expect(fixtures.map((fixture) => fixture.id)).toEqual(['2026-06-15-ksa-uru']);
    expect(fixtures[0]).toMatchObject({
      homeTeam: { tla: 'KSA', name: 'Saudi Arabia' },
      awayTeam: { tla: 'URU', name: 'Uruguay' },
      homeManagers: [{ id: 'nest', teamCode: 'KSA' }],
      awayManagers: [{ id: 'scott', teamCode: 'URU' }],
    });
  });

  it("rolls over to the next fixture date once today's fixtures have passed", () => {
    const fixtures = getUpcomingFixtures(
      WORLD_CUP_FANTASY_FIXTURES,
      WORLD_CUP_FANTASY_PLAYERS,
      new Date('2026-06-15T22:30:00Z')
    );

    expect(fixtures.map((fixture) => fixture.id)).toEqual([
      '2026-06-16-irn-nzl',
      '2026-06-16-fra-sen',
      '2026-06-16-irq-nor',
    ]);
    expect(fixtures[0]).toMatchObject({
      homeTeam: { tla: 'IRN', name: 'Iran' },
      awayTeam: { tla: 'NZL', name: 'New Zealand' },
      homeManagers: [{ id: 'dave', teamCode: 'IRN' }],
      awayManagers: [{ id: 'ash', teamCode: 'NZL' }],
    });
  });

  it('keeps started fixtures visible as in-play until a result is recorded', () => {
    const recordedMatches = WORLD_CUP_FANTASY_MANUAL_MATCHES.filter(
      (match) => match.id !== '2026-06-24-sui-can' && match.id !== '2026-06-24-bih-qat'
    ).map((match) => ({
      id: match.id,
      utcDate: match.utcDate,
      status: 'FINISHED',
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeGoals: match.homeGoals,
      awayGoals: match.awayGoals,
      homeRedCards: match.homeRedCards,
      awayRedCards: match.awayRedCards,
    }));

    const schedule = getMatchdaySchedule(
      WORLD_CUP_FANTASY_FIXTURES,
      recordedMatches,
      WORLD_CUP_FANTASY_PLAYERS,
      new Date('2026-06-24T20:30:00Z')
    );

    expect(schedule.defaultDate).toBe('2026-06-24');
    expect(schedule.schedulesByDate['2026-06-24'].find((entry) => entry.id === '2026-06-24-sui-can')).toMatchObject({
      status: 'in-play',
    });
    expect(schedule.schedulesByDate['2026-06-24'].find((entry) => entry.id === '2026-06-24-bih-qat')).toMatchObject({
      status: 'in-play',
    });
    expect(schedule.schedulesByDate['2026-06-24'].find((entry) => entry.id === '2026-06-24-col-cod')).toMatchObject({
      status: 'finished',
      homeGoals: 1,
      awayGoals: 0,
    });
  });

  it('combines upcoming, in-play, and finished fixtures on one matchday list', () => {
    const recordedMatches = WORLD_CUP_FANTASY_MANUAL_MATCHES.map((match) => ({
      id: match.id,
      utcDate: match.utcDate,
      status: 'FINISHED',
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeGoals: match.homeGoals,
      awayGoals: match.awayGoals,
      homeRedCards: match.homeRedCards,
      awayRedCards: match.awayRedCards,
    }));

    const schedule = getMatchdaySchedule(
      WORLD_CUP_FANTASY_FIXTURES,
      recordedMatches,
      WORLD_CUP_FANTASY_PLAYERS,
      new Date('2026-06-24T21:30:00Z')
    );

    expect(schedule.schedulesByDate['2026-06-24'].map((entry) => entry.status)).toEqual([
      'finished',
      'finished',
      'finished',
      'upcoming',
      'upcoming',
    ]);
  });

  it('lists only fixture dates that have sweepstake matches scheduled', () => {
    const schedule = getMatchdaySchedule(
      WORLD_CUP_FANTASY_FIXTURES,
      [],
      WORLD_CUP_FANTASY_PLAYERS,
      new Date('2026-06-24T12:00:00Z')
    );

    expect(schedule.fixtureDates.length).toBeGreaterThan(1);
    expect(schedule.fixtureDates).toEqual([...schedule.fixtureDates].sort());
    for (const date of schedule.fixtureDates) {
      expect(schedule.schedulesByDate[date]?.length).toBeGreaterThan(0);
    }
  });

  it('builds per-team match summaries for result panels', () => {
    const match = matches[0];
    const display = getTeamMatchDisplay(match, 'MEX');

    expect(display).toMatchObject({
      opponentTla: 'RSA',
      goalsFor: 1,
      goalsAgainst: 0,
      points: 3,
    });
    expect(getTeamMatchDisplay(match, 'BRA')).toBeNull();
  });
});

describe('buildPlayerProgressSeries', () => {
  it('builds cumulative totals in chronological order', () => {
    const { allScoringMatches } = computeStandings(players, matches);
    const series = buildPlayerProgressSeries(players, allScoringMatches);

    expect(series).toHaveLength(2);
    const chris = series.find((row) => row.playerId === 'saka-potatoes');
    const higherGd = series.find((row) => row.playerId === 'higher-gd');

    expect(chris?.points.map((point) => point.total)).toEqual([0, 3, 3]);
    expect(higherGd?.points.map((point) => point.total)).toEqual([0, 0, 3]);
    expect(chris?.currentTotal).toBe(3);
    expect(higherGd?.currentTotal).toBe(3);
  });
});
