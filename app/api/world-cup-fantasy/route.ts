import { NextResponse } from 'next/server';
import {
  WORLD_CUP_FANTASY_PLAYERS,
  WORLD_CUP_FANTASY_SCORING,
  WORLD_CUP_SWEEPSTAKE_FAIRNESS,
  WORLD_CUP_SWEEPSTAKE_INTRO,
} from '@/app/data/world-cup-fantasy';
import { gameLeaderboardRedisConfigured } from '@/app/lib/game-leaderboard-redis';
import { footballDataApiConfigured } from '@/app/lib/world-cup-football-data';
import { syncWorldCupFantasyMatches } from '@/app/lib/world-cup-fantasy-sync';
import {
  computeStandings,
  type MatchPointsEntry,
  type PlayerStanding,
} from '@/app/lib/world-cup-scoring';

export const runtime = 'nodejs';

export type WorldCupFantasyResponse = {
  ok: true;
  redisConfigured: boolean;
  apiConfigured: boolean;
  lastSyncedAt: number | null;
  syncError: string | null;
  syncReason: 'manual' | 'schedule' | 'stale' | 'none';
  scoring: typeof WORLD_CUP_FANTASY_SCORING;
  sweepstakeIntro: string;
  sweepstakeFairness: string;
  standings: PlayerStanding[];
  recentScoringMatches: MatchPointsEntry[];
  finishedMatchCount: number;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const forceRefresh = url.searchParams.get('refresh') === '1';

  const { matches, lastSyncedAt, syncError, syncReason } = await syncWorldCupFantasyMatches({
    forceRefresh,
  });
  const { standings, recentScoringMatches } = computeStandings(WORLD_CUP_FANTASY_PLAYERS, matches);
  const finishedMatchCount = matches.filter((m) => m.status === 'FINISHED').length;

  const body: WorldCupFantasyResponse = {
    ok: true,
    redisConfigured: gameLeaderboardRedisConfigured(),
    apiConfigured: footballDataApiConfigured(),
    lastSyncedAt,
    syncError,
    syncReason,
    scoring: WORLD_CUP_FANTASY_SCORING,
    sweepstakeIntro: WORLD_CUP_SWEEPSTAKE_INTRO,
    sweepstakeFairness: WORLD_CUP_SWEEPSTAKE_FAIRNESS,
    standings,
    recentScoringMatches,
    finishedMatchCount,
  };

  return NextResponse.json(body);
}
