import {
  ENGLISH_PYRAMID_FANTASY_SCORING,
  ENGLISH_PYRAMID_TEAM_BY_CODE,
  ENGLISH_PYRAMID_DIVISIONS,
  teamCodeMatches,
  type EnglishPyramidFixture,
  type EnglishPyramidManualMatch,
  type EnglishPyramidFantasyPlayer,
} from '@/app/data/english-pyramid-fantasy';

const DIVISION_LABEL_BY_ID = Object.fromEntries(ENGLISH_PYRAMID_DIVISIONS.map((d) => [d.id, d.label]));

export type EnglishPyramidMatchResult = {
  id: string;
  utcDate: string;
  status: string;
  stage?: string;
  homeTeam: { name: string; tla: string };
  awayTeam: { name: string; tla: string };
  homeGoals: number | null;
  awayGoals: number | null;
  homeRedCards: number;
  awayRedCards: number;
};

export type TeamMatchScore = {
  points: number;
  bonus: number;
  cleanSheetBonus: number;
  redCardPenalty: number;
  concededPenalty: number;
  total: number;
  outcome: 'win' | 'draw' | 'loss';
  goalsFor: number;
  goalsAgainst: number;
  redCards: number;
};

export type TeamStanding = {
  code: string;
  name: string;
  flag: string;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  wins: number;
  draws: number;
  losses: number;
  bonusPoints: number;
  redCards: number;
  playedMatches: number;
};

export type PlayerStanding = {
  id: string;
  name: string;
  teamName: string | null;
  managerImage: string;
  clubCrest: string;
  teams: string[];
  teamCount: number;
  draftNote: string;
  teamBreakdown: TeamStanding[];
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  wins: number;
  draws: number;
  losses: number;
  bonusPoints: number;
  redCards: number;
  redCardPoints: number;
  playedMatches: number;
};

export type MatchPointsEntry = {
  match: EnglishPyramidMatchResult;
  byPlayer: Record<string, number>;
};

export type FixtureManager = {
  id: string;
  name: string;
  teamName: string | null;
  teamCode: string;
};

export type UpcomingFixtureEntry = {
  id: string;
  utcDate: string;
  homeTeam: { name: string; tla: string; flag: string };
  awayTeam: { name: string; tla: string; flag: string };
  homeManagers: FixtureManager[];
  awayManagers: FixtureManager[];
};

function compareByStandingsOrder(
  a: Pick<TeamStanding | PlayerStanding, 'points' | 'goalDifference' | 'bonusPoints' | 'name'>,
  b: Pick<TeamStanding | PlayerStanding, 'points' | 'goalDifference' | 'bonusPoints' | 'name'>
): number {
  return (
    b.points - a.points ||
    b.goalDifference - a.goalDifference ||
    b.bonusPoints - a.bonusPoints ||
    a.name.localeCompare(b.name)
  );
}

export function scoreTeamMatch(
  teamGoals: number,
  opponentGoals: number,
  redCards = 0
): TeamMatchScore {
  let outcome: TeamMatchScore['outcome'] = 'loss';
  let points: number = ENGLISH_PYRAMID_FANTASY_SCORING.loss;

  if (teamGoals > opponentGoals) {
    outcome = 'win';
    points = ENGLISH_PYRAMID_FANTASY_SCORING.win;
  } else if (teamGoals === opponentGoals) {
    outcome = 'draw';
    points = ENGLISH_PYRAMID_FANTASY_SCORING.draw;
  }

  const bonus =
    teamGoals >= ENGLISH_PYRAMID_FANTASY_SCORING.highScoringBonusMinGoals
      ? ENGLISH_PYRAMID_FANTASY_SCORING.highScoringBonus
      : 0;

  const cleanSheetBonus = opponentGoals === 0 ? ENGLISH_PYRAMID_FANTASY_SCORING.cleanSheetBonus : 0;

  const redCardPenalty = redCards * ENGLISH_PYRAMID_FANTASY_SCORING.redCardPenalty;

  const concededPenalty =
    opponentGoals >= ENGLISH_PYRAMID_FANTASY_SCORING.highConcededPenaltyMinGoals
      ? ENGLISH_PYRAMID_FANTASY_SCORING.highConcededPenalty
      : 0;

  return {
    points,
    bonus,
    cleanSheetBonus,
    redCardPenalty,
    concededPenalty,
    total: points + bonus + cleanSheetBonus + redCardPenalty + concededPenalty,
    outcome,
    goalsFor: teamGoals,
    goalsAgainst: opponentGoals,
    redCards,
  };
}

export function manualMatchToResult(match: EnglishPyramidManualMatch): EnglishPyramidMatchResult {
  return {
    id: match.id,
    utcDate: match.utcDate,
    status: 'FINISHED',
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    homeGoals: match.homeGoals,
    awayGoals: match.awayGoals,
    homeRedCards: match.homeRedCards ?? 0,
    awayRedCards: match.awayRedCards ?? 0,
  };
}

export function mergeWorldCupMatches(
  apiMatches: EnglishPyramidMatchResult[],
  manualMatches: EnglishPyramidMatchResult[]
): EnglishPyramidMatchResult[] {
  const byId = new Map<string, EnglishPyramidMatchResult>();
  for (const match of apiMatches) byId.set(match.id, match);
  for (const match of manualMatches) byId.set(match.id, match);
  return [...byId.values()]
    .map((match) => ({
      ...match,
      homeRedCards: match.homeRedCards ?? 0,
      awayRedCards: match.awayRedCards ?? 0,
    }))
    .sort((a, b) => a.utcDate.localeCompare(b.utcDate));
}

function utcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function managersForTeam(
  players: readonly EnglishPyramidFantasyPlayer[],
  teamCode: string
): FixtureManager[] {
  return players
    .filter((player) => player.teams.some((code) => teamCodeMatches(teamCode, code)))
    .map((player) => ({
      id: player.id,
      name: player.name,
      teamName: player.teamName ?? null,
      teamCode,
    }));
}

function fixtureTeamWithMeta(team: EnglishPyramidFixture['homeTeam']): UpcomingFixtureEntry['homeTeam'] {
  const meta = ENGLISH_PYRAMID_TEAM_BY_CODE[team.tla];
  return {
    ...team,
    flag: meta ? (DIVISION_LABEL_BY_ID[meta.divisionId]?.slice(0, 3).toUpperCase() ?? meta.divisionId) : '',
  };
}

function upcomingFixtureEntry(
  fixture: EnglishPyramidFixture,
  players: readonly EnglishPyramidFantasyPlayer[]
): UpcomingFixtureEntry {
  return {
    id: fixture.id,
    utcDate: fixture.utcDate,
    homeTeam: fixtureTeamWithMeta(fixture.homeTeam),
    awayTeam: fixtureTeamWithMeta(fixture.awayTeam),
    homeManagers: managersForTeam(players, fixture.homeTeam.tla),
    awayManagers: managersForTeam(players, fixture.awayTeam.tla),
  };
}

export function getUpcomingFixtures(
  fixtures: readonly EnglishPyramidFixture[],
  players: readonly EnglishPyramidFantasyPlayer[],
  now = new Date()
): UpcomingFixtureEntry[] {
  const today = utcDateKey(now);
  const nowMs = now.getTime();

  const futureFixtures = fixtures
    .filter((fixture) => Date.parse(fixture.utcDate) > nowMs)
    .sort((a, b) => a.utcDate.localeCompare(b.utcDate));

  const todayFixtures = futureFixtures.filter((fixture) => fixture.utcDate.slice(0, 10) === today);
  if (todayFixtures.length > 0) {
    return todayFixtures.map((fixture) => upcomingFixtureEntry(fixture, players));
  }

  const nextFixtureDate = futureFixtures[0]?.utcDate.slice(0, 10);
  if (!nextFixtureDate) return [];

  return futureFixtures
    .filter((fixture) => fixture.utcDate.slice(0, 10) === nextFixtureDate)
    .map((fixture) => upcomingFixtureEntry(fixture, players));
}

function resolvePlayerTeamInMatch(match: EnglishPyramidMatchResult, playerTeamCode: string): {
  isHome: boolean;
} | null {
  if (teamCodeMatches(match.homeTeam.tla, playerTeamCode)) return { isHome: true };
  if (teamCodeMatches(match.awayTeam.tla, playerTeamCode)) return { isHome: false };
  return null;
}

export function teamPointsInMatch(match: EnglishPyramidMatchResult, playerTeamCode: string): number {
  if (match.homeGoals == null || match.awayGoals == null) return 0;
  const side = resolvePlayerTeamInMatch(match, playerTeamCode);
  if (!side) return 0;

  const goalsFor = side.isHome ? match.homeGoals : match.awayGoals;
  const goalsAgainst = side.isHome ? match.awayGoals : match.homeGoals;
  const redCards = side.isHome ? match.homeRedCards : match.awayRedCards;
  return scoreTeamMatch(goalsFor, goalsAgainst, redCards).total;
}

export function matchInvolvesTeam(match: EnglishPyramidMatchResult, teamCode: string): boolean {
  return resolvePlayerTeamInMatch(match, teamCode) != null;
}

export type TeamMatchDisplay = {
  matchId: string;
  utcDate: string;
  opponentName: string;
  opponentTla: string;
  opponentFlag: string;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  pointsBreakdown?: string;
  redCards: number;
  isHome: boolean;
};

function formatEnglishPyramidPointsBreakdown(scored: TeamMatchScore): string {
  const parts = [`${scored.points}`];
  if (scored.cleanSheetBonus > 0) parts.push('CS');
  if (scored.bonus > 0) parts.push('3+');
  if (scored.concededPenalty < 0) parts.push('−conc');
  if (scored.redCardPenalty < 0) parts.push(`${scored.redCardPenalty} red`);
  return parts.join(' · ');
}

export function getTeamMatchDisplay(match: EnglishPyramidMatchResult, teamCode: string): TeamMatchDisplay | null {
  if (match.homeGoals == null || match.awayGoals == null) return null;

  const side = resolvePlayerTeamInMatch(match, teamCode);
  if (!side) return null;

  const goalsFor = side.isHome ? match.homeGoals : match.awayGoals;
  const goalsAgainst = side.isHome ? match.awayGoals : match.homeGoals;
  const redCards = side.isHome ? match.homeRedCards : match.awayRedCards;
  const opponent = side.isHome ? match.awayTeam : match.homeTeam;
  const opponentMeta = ENGLISH_PYRAMID_TEAM_BY_CODE[opponent.tla];
  const scored = scoreTeamMatch(goalsFor, goalsAgainst, redCards);

  return {
    matchId: match.id,
    utcDate: match.utcDate,
    opponentName: opponent.name,
    opponentTla: opponent.tla,
    opponentFlag: opponentMeta ? (DIVISION_LABEL_BY_ID[opponentMeta.divisionId] ?? '') : '',
    goalsFor,
    goalsAgainst,
    points: scored.total,
    pointsBreakdown: formatEnglishPyramidPointsBreakdown(scored),
    redCards,
    isHome: side.isHome,
  };
}

export function buildScoringMatchEntries(
  players: readonly EnglishPyramidFantasyPlayer[],
  matches: EnglishPyramidMatchResult[]
): MatchPointsEntry[] {
  const finished = matches.filter(
    (m) => m.status === 'FINISHED' && m.homeGoals != null && m.awayGoals != null
  );

  return finished
    .slice()
    .reverse()
    .map((match) => {
      const byPlayer: Record<string, number> = {};
      for (const player of players) {
        const pts = player.teams.reduce((sum, team) => sum + teamPointsInMatch(match, team), 0);
        if (pts !== 0) byPlayer[player.id] = pts;
      }
      return { match, byPlayer };
    });
}

export function resolveManagerImageForStandings(
  player: Pick<EnglishPyramidFantasyPlayer, 'id' | 'managerImage'>,
  rankIndex: number,
  playerCount: number
): string {
  if (playerCount > 1 && rankIndex === 0) {
    return `/images/world-cup-fantasy/managers/${player.id}-top.png`;
  }
  if (playerCount > 1 && rankIndex === playerCount - 1) {
    return `/images/world-cup-fantasy/managers/${player.id}-bottom.png`;
  }
  return player.managerImage;
}

export function computeStandings(
  players: readonly EnglishPyramidFantasyPlayer[],
  matches: EnglishPyramidMatchResult[]
): {
  standings: PlayerStanding[];
  allScoringMatches: MatchPointsEntry[];
  recentScoringMatches: MatchPointsEntry[];
} {
  const finished = matches.filter(
    (m) => m.status === 'FINISHED' && m.homeGoals != null && m.awayGoals != null
  );

  const standings: PlayerStanding[] = players.map((player) => ({
    id: player.id,
    name: player.name,
    teamName: player.teamName ?? null,
    managerImage: player.managerImage,
    clubCrest: player.clubCrest,
    teams: [...player.teams],
    teamCount: player.teams.length,
    draftNote: player.draftNote,
    teamBreakdown: player.teams.map((code) => {
      const meta = ENGLISH_PYRAMID_TEAM_BY_CODE[code];
      return {
        code,
        name: meta?.name ?? code,
        flag: meta?.divisionId ?? '',
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
      };
    }),
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
  }));

  const byId = new Map(standings.map((row) => [row.id, row]));

  for (const match of finished) {
    for (const player of players) {
      const row = byId.get(player.id);
      if (!row) continue;

      const teamRows = new Map(row.teamBreakdown.map((team) => [team.code, team]));

      for (const teamCode of player.teams) {
        const side = resolvePlayerTeamInMatch(match, teamCode);
        if (!side) continue;

        const goalsFor = side.isHome ? match.homeGoals! : match.awayGoals!;
        const goalsAgainst = side.isHome ? match.awayGoals! : match.homeGoals!;
        const redCards = side.isHome ? match.homeRedCards : match.awayRedCards;
        const scored = scoreTeamMatch(goalsFor, goalsAgainst, redCards);
        const teamRow = teamRows.get(teamCode);
        if (!teamRow) continue;

        row.points += scored.total;
        teamRow.points += scored.total;
        row.goalsFor += scored.goalsFor;
        teamRow.goalsFor += scored.goalsFor;
        row.goalsAgainst += scored.goalsAgainst;
        teamRow.goalsAgainst += scored.goalsAgainst;
        row.goalDifference = row.goalsFor - row.goalsAgainst;
        teamRow.goalDifference = teamRow.goalsFor - teamRow.goalsAgainst;
        row.bonusPoints += scored.bonus + scored.cleanSheetBonus;
        teamRow.bonusPoints += scored.bonus + scored.cleanSheetBonus;
        row.redCards += scored.redCards;
        teamRow.redCards += scored.redCards;
        row.redCardPoints += scored.redCardPenalty;
        row.playedMatches += 1;
        teamRow.playedMatches += 1;
        if (scored.outcome === 'win') {
          row.wins += 1;
          teamRow.wins += 1;
        } else if (scored.outcome === 'draw') {
          row.draws += 1;
          teamRow.draws += 1;
        } else {
          row.losses += 1;
          teamRow.losses += 1;
        }
      }
    }
  }

  for (const row of standings) {
    row.teamBreakdown.sort(compareByStandingsOrder);
  }

  standings.sort(compareByStandingsOrder);

  const playerById = new Map(players.map((player) => [player.id, player]));
  standings.forEach((row, index) => {
    const player = playerById.get(row.id);
    if (player) {
      row.managerImage = resolveManagerImageForStandings(player, index, standings.length);
    }
  });

  const allScoringMatches = buildScoringMatchEntries(players, finished);
  const recentScoringMatches = allScoringMatches.slice(0, 12);

  return { standings, allScoringMatches, recentScoringMatches };
}
