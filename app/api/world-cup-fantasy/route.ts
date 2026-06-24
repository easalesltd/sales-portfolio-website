import { NextResponse } from 'next/server';
import {
  WORLD_CUP_FANTASY_DAILY_UPDATE,
  WORLD_CUP_FANTASY_FIXTURES,
  WORLD_CUP_FANTASY_MANUAL_MATCHES,
  WORLD_CUP_FANTASY_PLAYERS,
  WORLD_CUP_FANTASY_SCORING,
} from '@/app/data/world-cup-fantasy';
import {
  computeStandings,
  getTodaysResults,
  getUpcomingFixtures,
  manualMatchToResult,
  type MatchPointsEntry,
  type PlayerStanding,
  type TodaysResultEntry,
  type UpcomingFixtureEntry,
} from '@/app/lib/world-cup-scoring';

export const runtime = 'nodejs';

export type WorldCupFantasyResponse = {
  ok: true;
  scoring: typeof WORLD_CUP_FANTASY_SCORING;
  dailyUpdate: string;
  standings: PlayerStanding[];
  upcomingFixtures: UpcomingFixtureEntry[];
  todaysResults: TodaysResultEntry[];
  allScoringMatches: MatchPointsEntry[];
  recentScoringMatches: MatchPointsEntry[];
  finishedMatchCount: number;
};

export async function GET() {
  const matches = WORLD_CUP_FANTASY_MANUAL_MATCHES.map(manualMatchToResult);
  const { standings, allScoringMatches, recentScoringMatches } = computeStandings(
    WORLD_CUP_FANTASY_PLAYERS,
    matches
  );
  const upcomingFixtures = getUpcomingFixtures(WORLD_CUP_FANTASY_FIXTURES, WORLD_CUP_FANTASY_PLAYERS);
  const todaysResults = getTodaysResults(allScoringMatches, WORLD_CUP_FANTASY_PLAYERS);
  const finishedMatchCount = matches.filter(
    (m) => m.status === 'FINISHED' && m.homeGoals != null && m.awayGoals != null
  ).length;

  const body: WorldCupFantasyResponse = {
    ok: true,
    scoring: WORLD_CUP_FANTASY_SCORING,
    dailyUpdate: WORLD_CUP_FANTASY_DAILY_UPDATE,
    standings,
    upcomingFixtures,
    todaysResults,
    allScoringMatches,
    recentScoringMatches,
    finishedMatchCount,
  };

  return NextResponse.json(body);
}
