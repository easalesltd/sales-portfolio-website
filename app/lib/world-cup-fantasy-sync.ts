import { WORLD_CUP_FANTASY_MANUAL_MATCHES } from '@/app/data/world-cup-fantasy';
import { gameLeaderboardRedisConfigured } from '@/app/lib/game-leaderboard-redis';
import {
  readCachedWorldCupMatches,
  writeCachedWorldCupMatches,
  WORLD_CUP_FANTASY_CACHE_TTL_MS,
} from '@/app/lib/world-cup-fantasy-cache';
import {
  footballDataApiConfigured,
  fetchWorldCupMatchesFromFootballData,
} from '@/app/lib/world-cup-football-data';
import { shouldForceSyncForMatchSchedule } from '@/app/lib/world-cup-sync-schedule';
import { manualMatchToResult, mergeWorldCupMatches } from '@/app/lib/world-cup-scoring';

export type WorldCupFantasySyncResult = {
  matches: ReturnType<typeof mergeWorldCupMatches>;
  lastSyncedAt: number | null;
  syncError: string | null;
  didSync: boolean;
  syncReason: 'manual' | 'schedule' | 'stale' | 'none';
};

export async function syncWorldCupFantasyMatches(options: {
  forceRefresh?: boolean;
  now?: number;
} = {}): Promise<WorldCupFantasySyncResult> {
  const now = options.now ?? Date.now();
  const manual = WORLD_CUP_FANTASY_MANUAL_MATCHES.map(manualMatchToResult);
  let apiMatches: Awaited<ReturnType<typeof fetchWorldCupMatchesFromFootballData>> = [];
  let lastSyncedAt: number | null = null;
  let syncError: string | null = null;
  let didSync = false;
  let syncReason: WorldCupFantasySyncResult['syncReason'] = 'none';

  const cached = await readCachedWorldCupMatches();
  apiMatches = cached.matches;
  lastSyncedAt = cached.syncedAt;

  const scheduleForce = shouldForceSyncForMatchSchedule(apiMatches, lastSyncedAt, now);
  const cacheStale =
    lastSyncedAt == null || now - lastSyncedAt > WORLD_CUP_FANTASY_CACHE_TTL_MS;

  const shouldFetch =
    footballDataApiConfigured() &&
    (options.forceRefresh === true || scheduleForce || cacheStale);

  if (options.forceRefresh) syncReason = 'manual';
  else if (scheduleForce) syncReason = 'schedule';
  else if (cacheStale && shouldFetch) syncReason = 'stale';

  if (shouldFetch) {
    try {
      apiMatches = await fetchWorldCupMatchesFromFootballData();
      lastSyncedAt = Date.now();
      didSync = true;
      if (gameLeaderboardRedisConfigured()) {
        await writeCachedWorldCupMatches(apiMatches, lastSyncedAt);
      }
    } catch (error) {
      syncError = error instanceof Error ? error.message : 'sync_failed';
    }
  }

  return {
    matches: mergeWorldCupMatches(apiMatches, manual),
    lastSyncedAt,
    syncError,
    didSync,
    syncReason,
  };
}
