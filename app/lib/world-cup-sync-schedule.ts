import type { WorldCupMatchResult } from '@/app/lib/world-cup-scoring';

/** World Cup 2026 — first match day through day after the final. */
export const WORLD_CUP_TOURNAMENT_START = Date.parse('2026-06-11T00:00:00.000Z');
export const WORLD_CUP_TOURNAMENT_END = Date.parse('2026-07-20T23:59:59.999Z');

/** Kickoff → expected full-time whistle (90 min + half-time + stoppage). */
const REGULAR_MATCH_DURATION_MS = 110 * 60 * 1000;

/** Extra buffer for knockouts (extra time / slow API updates). */
const KNOCKOUT_EXTRA_DURATION_MS = 35 * 60 * 1000;

/** Keep trying to sync for this long after each estimated full-time. */
const POST_MATCH_SYNC_WINDOW_MS = 45 * 60 * 1000;

const KNOCKOUT_STAGES = new Set([
  'LAST_32',
  'LAST_16',
  'QUARTER_FINALS',
  'SEMI_FINALS',
  'THIRD_PLACE',
  'FINAL',
  'PLAYOFFS',
  'PLAYOFF_ROUND_1',
  'PLAYOFF_ROUND_2',
]);

export function isWorldCupTournamentActive(now = Date.now()): boolean {
  return now >= WORLD_CUP_TOURNAMENT_START && now <= WORLD_CUP_TOURNAMENT_END;
}

function estimatedMatchEndMs(match: Pick<WorldCupMatchResult, 'utcDate' | 'stage'>): number {
  const kickoff = Date.parse(match.utcDate);
  if (!Number.isFinite(kickoff)) return Number.NaN;
  const knockoutExtra =
    match.stage && KNOCKOUT_STAGES.has(match.stage) ? KNOCKOUT_EXTRA_DURATION_MS : 0;
  return kickoff + REGULAR_MATCH_DURATION_MS + knockoutExtra;
}

/**
 * True when `now` falls in the post-match sync window for a scheduled/in-play game
 * and we have not synced since that match should have finished.
 */
export function shouldForceSyncForMatchSchedule(
  matches: readonly WorldCupMatchResult[],
  lastSyncedAt: number | null,
  now = Date.now()
): boolean {
  if (!isWorldCupTournamentActive(now) || matches.length === 0) return false;

  for (const match of matches) {
    if (match.status === 'FINISHED' || match.status === 'POSTPONED' || match.status === 'CANCELLED') {
      continue;
    }

    const estimatedEnd = estimatedMatchEndMs(match);
    if (!Number.isFinite(estimatedEnd)) continue;

    const windowStart = estimatedEnd;
    const windowEnd = estimatedEnd + POST_MATCH_SYNC_WINDOW_MS;

    if (now >= windowStart && now <= windowEnd) {
      if (lastSyncedAt == null || lastSyncedAt < windowStart) {
        return true;
      }
    }
  }

  return false;
}

export function describeEstimatedMatchEnd(match: Pick<WorldCupMatchResult, 'utcDate' | 'stage'>): Date | null {
  const endMs = estimatedMatchEndMs(match);
  return Number.isFinite(endMs) ? new Date(endMs) : null;
}
