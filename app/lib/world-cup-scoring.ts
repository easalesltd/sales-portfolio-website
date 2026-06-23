import {
  WORLD_CUP_FANTASY_SCORING,
  WORLD_CUP_TEAM_BY_CODE,
  teamCodeMatches,
  type WorldCupFantasyFixture,
  type WorldCupFantasyManualMatch,
  type WorldCupFantasyPlayer,
} from '@/app/data/world-cup-fantasy';

export type WorldCupMatchResult = {
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
  match: WorldCupMatchResult;
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
  let points: number = WORLD_CUP_FANTASY_SCORING.loss;

  if (teamGoals > opponentGoals) {
    outcome = 'win';
    points = WORLD_CUP_FANTASY_SCORING.win;
  } else if (teamGoals === opponentGoals) {
    outcome = 'draw';
    points = WORLD_CUP_FANTASY_SCORING.draw;
  }

  const bonus =
    teamGoals >= WORLD_CUP_FANTASY_SCORING.highScoringBonusMinGoals
      ? WORLD_CUP_FANTASY_SCORING.highScoringBonus
      : 0;

  const redCardPenalty = redCards * WORLD_CUP_FANTASY_SCORING.redCardPenalty;

  const concededPenalty =
    opponentGoals >= WORLD_CUP_FANTASY_SCORING.highConcededPenaltyMinGoals
      ? WORLD_CUP_FANTASY_SCORING.highConcededPenalty
      : 0;

  return {
    points,
    bonus,
    redCardPenalty,
    concededPenalty,
    total: points + bonus + redCardPenalty + concededPenalty,
    outcome,
    goalsFor: teamGoals,
    goalsAgainst: opponentGoals,
    redCards,
  };
}

export function manualMatchToResult(match: WorldCupFantasyManualMatch): WorldCupMatchResult {
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
  apiMatches: WorldCupMatchResult[],
  manualMatches: WorldCupMatchResult[]
): WorldCupMatchResult[] {
  const byId = new Map<string, WorldCupMatchResult>();
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
  players: readonly WorldCupFantasyPlayer[],
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

function fixtureTeamWithFlag(team: WorldCupFantasyFixture['homeTeam']): UpcomingFixtureEntry['homeTeam'] {
  return {
    ...team,
    flag: WORLD_CUP_TEAM_BY_CODE[team.tla]?.flag ?? '',
  };
}

function upcomingFixtureEntry(
  fixture: WorldCupFantasyFixture,
  players: readonly WorldCupFantasyPlayer[]
): UpcomingFixtureEntry {
  return {
    id: fixture.id,
    utcDate: fixture.utcDate,
    homeTeam: fixtureTeamWithFlag(fixture.homeTeam),
    awayTeam: fixtureTeamWithFlag(fixture.awayTeam),
    homeManagers: managersForTeam(players, fixture.homeTeam.tla),
    awayManagers: managersForTeam(players, fixture.awayTeam.tla),
  };
}

export function getUpcomingFixtures(
  fixtures: readonly WorldCupFantasyFixture[],
  players: readonly WorldCupFantasyPlayer[],
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

function resolvePlayerTeamInMatch(match: WorldCupMatchResult, playerTeamCode: string): {
  isHome: boolean;
} | null {
  if (teamCodeMatches(match.homeTeam.tla, playerTeamCode)) return { isHome: true };
  if (teamCodeMatches(match.awayTeam.tla, playerTeamCode)) return { isHome: false };
  return null;
}

export function teamPointsInMatch(match: WorldCupMatchResult, playerTeamCode: string): number {
  if (match.homeGoals == null || match.awayGoals == null) return 0;
  const side = resolvePlayerTeamInMatch(match, playerTeamCode);
  if (!side) return 0;

  const goalsFor = side.isHome ? match.homeGoals : match.awayGoals;
  const goalsAgainst = side.isHome ? match.awayGoals : match.homeGoals;
  const redCards = side.isHome ? match.homeRedCards : match.awayRedCards;
  return scoreTeamMatch(goalsFor, goalsAgainst, redCards).total;
}

export function matchInvolvesTeam(match: WorldCupMatchResult, teamCode: string): boolean {
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
  /** Optional breakdown, e.g. "3 + CS + 3+" for English pyramid. */
  pointsBreakdown?: string;
  /** +1 when the team scores 3+ goals. */
  scoringBonus?: number;
  /** +1 clean sheet bonus (English pyramid). */
  cleanSheetBonus?: number;
  /** −1 when the team concedes 3+ goals. */
  concededPenalty?: number;
  redCards: number;
  isHome: boolean;
};

export function getTeamMatchDisplay(match: WorldCupMatchResult, teamCode: string): TeamMatchDisplay | null {
  if (match.homeGoals == null || match.awayGoals == null) return null;

  const side = resolvePlayerTeamInMatch(match, teamCode);
  if (!side) return null;

  const goalsFor = side.isHome ? match.homeGoals : match.awayGoals;
  const goalsAgainst = side.isHome ? match.awayGoals : match.homeGoals;
  const redCards = side.isHome ? match.homeRedCards : match.awayRedCards;
  const opponent = side.isHome ? match.awayTeam : match.homeTeam;
  const opponentMeta = WORLD_CUP_TEAM_BY_CODE[opponent.tla];
  const scored = scoreTeamMatch(goalsFor, goalsAgainst, redCards);

  return {
    matchId: match.id,
    utcDate: match.utcDate,
    opponentName: opponent.name,
    opponentTla: opponent.tla,
    opponentFlag: opponentMeta?.flag ?? '',
    goalsFor,
    goalsAgainst,
    points: scored.total,
    scoringBonus: scored.bonus > 0 ? scored.bonus : undefined,
    concededPenalty: scored.concededPenalty < 0 ? scored.concededPenalty : undefined,
    redCards,
    isHome: side.isHome,
  };
}

export function buildScoringMatchEntries(
  players: readonly WorldCupFantasyPlayer[],
  matches: WorldCupMatchResult[]
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
  player: Pick<WorldCupFantasyPlayer, 'id' | 'managerImage'>,
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
  players: readonly WorldCupFantasyPlayer[],
  matches: WorldCupMatchResult[]
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
      const meta = WORLD_CUP_TEAM_BY_CODE[code];
      return {
        code,
        name: meta?.name ?? code,
        flag: meta?.flag ?? '',
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
        row.bonusPoints += scored.bonus;
        teamRow.bonusPoints += scored.bonus;
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
