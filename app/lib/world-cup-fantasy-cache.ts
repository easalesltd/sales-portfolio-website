import { gameLeaderboardRedis } from '@/app/lib/game-leaderboard-redis';
import type { WorldCupMatchResult } from '@/app/lib/world-cup-scoring';

const MATCHES_CACHE_KEY = 'world-cup-fantasy:matches:v1';
const SYNCED_AT_KEY = 'world-cup-fantasy:synced-at:v1';
export const WORLD_CUP_FANTASY_CACHE_TTL_MS = 15 * 60 * 1000;

export async function readCachedWorldCupMatches(): Promise<{
  matches: WorldCupMatchResult[];
  syncedAt: number | null;
}> {
  const redis = gameLeaderboardRedis();
  if (!redis) return { matches: [], syncedAt: null };

  const [rawMatches, rawSyncedAt] = await Promise.all([
    redis.get<WorldCupMatchResult[]>(MATCHES_CACHE_KEY),
    redis.get<number | string>(SYNCED_AT_KEY),
  ]);

  const syncedAt =
    rawSyncedAt == null
      ? null
      : Number(typeof rawSyncedAt === 'string' ? rawSyncedAt : rawSyncedAt);

  return {
    matches: Array.isArray(rawMatches) ? rawMatches : [],
    syncedAt: Number.isFinite(syncedAt) ? syncedAt : null,
  };
}

export async function writeCachedWorldCupMatches(
  matches: WorldCupMatchResult[],
  syncedAt: number
): Promise<void> {
  const redis = gameLeaderboardRedis();
  if (!redis) return;
  await redis.set(MATCHES_CACHE_KEY, matches);
  await redis.set(SYNCED_AT_KEY, String(syncedAt));
}
