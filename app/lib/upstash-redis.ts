import { Redis } from '@upstash/redis';

let cached: Redis | null | undefined;

/**
 * Shared Redis for the game leaderboard. Without these env vars, scores stay
 * on each browser only.
 *
 * Set on Vercel: Project → Settings → Environment Variables, then redeploy.
 * - Upstash: https://console.upstash.com → Redis → REST API → copy URL + token
 * - Or Vercel: Storage → Create Database → Redis (Upstash) → Connect to project
 *
 * Supports legacy Vercel KV names after migration (`KV_REST_API_*`).
 */
export function getRedis(): Redis | null {
  if (cached !== undefined) return cached;
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '';
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';
  if (!url || !token) {
    cached = null;
    return null;
  }
  cached = new Redis({ url, token });
  return cached;
}
