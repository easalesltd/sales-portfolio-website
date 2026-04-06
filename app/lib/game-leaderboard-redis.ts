import { Redis } from '@upstash/redis';

/** Lazy singleton for serverless — reuse one client per isolate. */
let client: Redis | null = null;

type RestCreds = { url: string; token: string };

/**
 * Upstash REST credentials.
 * - Manual / docs: `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
 * - Vercel **KV** / Storage tab: `KV_REST_API_URL` + `KV_REST_API_TOKEN` (same REST API as @upstash/redis)
 */
function resolveRedisRestCredentials(): RestCreds | null {
  const pairs: RestCreds[] = [
    {
      url: process.env.UPSTASH_REDIS_REST_URL ?? '',
      token: process.env.UPSTASH_REDIS_REST_TOKEN ?? '',
    },
    {
      url: process.env.KV_REST_API_URL ?? '',
      token: process.env.KV_REST_API_TOKEN ?? '',
    },
  ];
  for (const p of pairs) {
    const url = p.url.trim();
    const token = p.token.trim();
    if (url && token) return { url, token };
  }
  return null;
}

export function gameLeaderboardRedis(): Redis | null {
  const creds = resolveRedisRestCredentials();
  if (!creds) return null;
  if (!client) client = new Redis({ url: creds.url, token: creds.token });
  return client;
}

export function gameLeaderboardRedisConfigured(): boolean {
  return resolveRedisRestCredentials() !== null;
}
