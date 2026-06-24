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
  getMatchdaySchedule,
  manualMatchToResult,
  type MatchPointsEntry,
  type MatchdaySchedule,
  type PlayerStanding,
} from '@/app/lib/world-cup-scoring';
import { enrichMatchdayScheduleWithLiveScores } from '@/app/lib/world-cup-live-scores';

export const runtime = 'nodejs';

export type WorldCupFantasyResponse = {
  ok: true;
  scoring: typeof WORLD_CUP_FANTASY_SCORING;
  dailyUpdate: string;
  standings: PlayerStanding[];
  matchdaySchedule: MatchdaySchedule;
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
  const matchdaySchedule = await enrichMatchdayScheduleWithLiveScores(
    getMatchdaySchedule(WORLD_CUP_FANTASY_FIXTURES, matches, WORLD_CUP_FANTASY_PLAYERS)
  );
  const finishedMatchCount = matches.filter(
    (m) => m.status === 'FINISHED' && m.homeGoals != null && m.awayGoals != null
  ).length;

  const body: WorldCupFantasyResponse = {
    ok: true,
    scoring: WORLD_CUP_FANTASY_SCORING,
    dailyUpdate: WORLD_CUP_FANTASY_DAILY_UPDATE,
    standings,
    matchdaySchedule,
    allScoringMatches,
    recentScoringMatches,
    finishedMatchCount,
  };

  return NextResponse.json(body);
}
