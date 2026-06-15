import { NextResponse } from 'next/server';
import {
  WORLD_CUP_FANTASY_DAILY_UPDATE,
  WORLD_CUP_FANTASY_FIXTURES,
  WORLD_CUP_FANTASY_MANUAL_MATCHES,
  WORLD_CUP_FANTASY_PLAYERS,
  WORLD_CUP_FANTASY_SCORING,
  WORLD_CUP_SWEEPSTAKE_FAIRNESS,
  WORLD_CUP_SWEEPSTAKE_INTRO,
} from '@/app/data/world-cup-fantasy';
import {
  computeStandings,
  getTodayUpcomingFixtures,
  manualMatchToResult,
  type MatchPointsEntry,
  type PlayerStanding,
  type UpcomingFixtureEntry,
} from '@/app/lib/world-cup-scoring';

export const runtime = 'nodejs';

export type WorldCupFantasyResponse = {
  ok: true;
  scoring: typeof WORLD_CUP_FANTASY_SCORING;
  dailyUpdate: string;
  sweepstakeIntro: string;
  sweepstakeFairness: string;
  standings: PlayerStanding[];
  upcomingFixtures: UpcomingFixtureEntry[];
  recentScoringMatches: MatchPointsEntry[];
  finishedMatchCount: number;
};

export async function GET() {
  const matches = WORLD_CUP_FANTASY_MANUAL_MATCHES.map(manualMatchToResult);
  const { standings, recentScoringMatches } = computeStandings(WORLD_CUP_FANTASY_PLAYERS, matches);
  const upcomingFixtures = getTodayUpcomingFixtures(WORLD_CUP_FANTASY_FIXTURES, WORLD_CUP_FANTASY_PLAYERS);
  const finishedMatchCount = matches.filter(
    (m) => m.status === 'FINISHED' && m.homeGoals != null && m.awayGoals != null
  ).length;

  const body: WorldCupFantasyResponse = {
    ok: true,
    scoring: WORLD_CUP_FANTASY_SCORING,
    dailyUpdate: WORLD_CUP_FANTASY_DAILY_UPDATE,
    sweepstakeIntro: WORLD_CUP_SWEEPSTAKE_INTRO,
    sweepstakeFairness: WORLD_CUP_SWEEPSTAKE_FAIRNESS,
    standings,
    upcomingFixtures,
    recentScoringMatches,
    finishedMatchCount,
  };

  return NextResponse.json(body);
}
