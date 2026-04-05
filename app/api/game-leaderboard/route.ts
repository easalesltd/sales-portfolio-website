import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import type { Redis } from '@upstash/redis';
import {
  gameLeaderboardRedis,
  gameLeaderboardRedisConfigured,
} from '@/app/lib/game-leaderboard-redis';
import { redactLeaderboardDisplayName } from '@/app/lib/game-leaderboard-profanity';
import { isGameLevelId, type GameLevelId } from '@/app/lib/game-levels';

export const runtime = 'nodejs';

/** Per-level sorted sets (v2). */
function zKeyForLevel(level: GameLevelId): string {
  return `sales-agent-dash:lb:z:v2:${level}`;
}

/** Original single global board — merged into On the Road once, then removed. */
const ZKEY_LEGACY = 'sales-agent-dash:lb:z:v1';

/**
 * Copies all legacy global scores into the road leaderboard, then deletes the legacy key.
 * Safe to call repeatedly until legacy is empty (idempotent).
 */
async function mergeLegacyGlobalBoardIntoRoad(r: Redis): Promise<void> {
  const legacyCount = await r.zcard(ZKEY_LEGACY);
  if (legacyCount === 0) return;

  const raw = await r.zrange(ZKEY_LEGACY, 0, -1, { withScores: true });
  const roadKey = zKeyForLevel('road');
  const pipe = r.pipeline();
  if (raw && raw.length >= 2) {
    for (let i = 0; i < raw.length; i += 2) {
      const id = String(raw[i]);
      const score = Number(raw[i + 1]);
      if (id && Number.isFinite(score)) {
        pipe.zadd(roadKey, { score, member: id });
      }
    }
  }
  if (pipe.length() > 0) {
    await pipe.exec();
  }
  await r.del(ZKEY_LEGACY);

  const count = await r.zcard(roadKey);
  if (count > MAX_STORED) {
    const removeLow = count - MAX_STORED;
    await r.zremrangebyrank(roadKey, 0, removeLow - 1);
  }
}

const EPREFIX = 'sales-agent-dash:lb:e:v1:';
const MAX_SCORE = 99_999_999;
const TOP_RETURN = 40;
const MAX_STORED = 500;
const NAME_MAX = 24;

export type GameLeaderboardRow = {
  rank: number;
  score: number;
  name: string;
  submittedAt: number;
};

function sanitizeName(raw: string): string {
  const t = raw.trim().slice(0, NAME_MAX);
  if (!t) return 'Anonymous';
  const cleaned = t.replace(/[^\p{L}\p{N}\s._-]/gu, '').trim();
  return cleaned || 'Anonymous';
}

function parseLevelParam(req: Request): GameLevelId | null {
  const url = new URL(req.url);
  const raw = url.searchParams.get('level')?.trim() ?? '';
  if (raw === '') return 'road';
  return isGameLevelId(raw) ? raw : null;
}

export async function GET(req: Request) {
  const level = parseLevelParam(req);
  if (!level) {
    return NextResponse.json({ ok: false, error: 'invalid_level' }, { status: 400 });
  }

  if (!gameLeaderboardRedisConfigured()) {
    return NextResponse.json({
      ok: true as const,
      configured: false as const,
      level,
      entries: [] as GameLeaderboardRow[],
    });
  }

  const r = gameLeaderboardRedis();
  if (!r) {
    return NextResponse.json({
      ok: true as const,
      configured: false as const,
      level,
      entries: [] as GameLeaderboardRow[],
    });
  }

  const zkey = zKeyForLevel(level);

  try {
    if (level === 'road') {
      await mergeLegacyGlobalBoardIntoRoad(r);
    }

    const raw = await r.zrange(zkey, 0, TOP_RETURN - 1, { rev: true, withScores: true });
    const pairs: { id: string; score: number }[] = [];
    if (raw && raw.length >= 2) {
      for (let i = 0; i < raw.length; i += 2) {
        const id = String(raw[i]);
        const score = Number(raw[i + 1]);
        if (id && Number.isFinite(score)) pairs.push({ id, score });
      }
    }

    const entries: GameLeaderboardRow[] = [];
    let rank = 1;
    for (const p of pairs) {
      const meta = await r.hgetall(`${EPREFIX}${p.id}`);
      const name =
        meta && typeof meta.name === 'string' && meta.name.length > 0 ? meta.name : 'Anonymous';
      const submittedAt = meta?.submittedAt != null ? Number(meta.submittedAt) : 0;
      entries.push({
        rank: rank++,
        score: Math.floor(p.score),
        name: redactLeaderboardDisplayName(name, NAME_MAX),
        submittedAt: Number.isFinite(submittedAt) ? submittedAt : 0,
      });
    }

    return NextResponse.json({
      ok: true as const,
      configured: true as const,
      level,
      entries,
    });
  } catch (e) {
    console.error('game-leaderboard GET', e);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const r = gameLeaderboardRedis();
  if (!r) {
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const levelRaw = typeof b.level === 'string' ? b.level.trim() : '';
  if (!isGameLevelId(levelRaw)) {
    return NextResponse.json({ ok: false, error: 'invalid_level' }, { status: 400 });
  }
  const level = levelRaw;

  const score = Math.floor(Number(b.score));
  if (!Number.isFinite(score) || score < 0 || score > MAX_SCORE) {
    return NextResponse.json({ ok: false, error: 'invalid_score' }, { status: 400 });
  }

  const name = redactLeaderboardDisplayName(sanitizeName(String(b.displayName ?? '')), NAME_MAX);
  const id = randomUUID();
  const submittedAt = Date.now();
  const zkey = zKeyForLevel(level);

  try {
    if (level === 'road') {
      await mergeLegacyGlobalBoardIntoRoad(r);
    }

    await r.zadd(zkey, { score, member: id });
    await r.hset(`${EPREFIX}${id}`, {
      name,
      submittedAt: String(submittedAt),
    });

    const count = await r.zcard(zkey);
    if (count > MAX_STORED) {
      const removeLow = count - MAX_STORED;
      await r.zremrangebyrank(zkey, 0, removeLow - 1);
    }

    return NextResponse.json({ ok: true as const, id, level });
  } catch (e) {
    console.error('game-leaderboard POST', e);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
