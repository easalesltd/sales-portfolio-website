import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import {
  gameLeaderboardRedis,
  gameLeaderboardRedisConfigured,
} from '@/app/lib/game-leaderboard-redis';

export const runtime = 'nodejs';

const ZKEY = 'sales-agent-dash:lb:z:v1';
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

export async function GET() {
  if (!gameLeaderboardRedisConfigured()) {
    return NextResponse.json({
      ok: true as const,
      configured: false as const,
      entries: [] as GameLeaderboardRow[],
    });
  }

  const r = gameLeaderboardRedis();
  if (!r) {
    return NextResponse.json({
      ok: true as const,
      configured: false as const,
      entries: [] as GameLeaderboardRow[],
    });
  }

  try {
    const raw = await r.zrange(ZKEY, 0, TOP_RETURN - 1, { rev: true, withScores: true });
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
        name: name.slice(0, NAME_MAX),
        submittedAt: Number.isFinite(submittedAt) ? submittedAt : 0,
      });
    }

    return NextResponse.json({
      ok: true as const,
      configured: true as const,
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
  const score = Math.floor(Number(b.score));
  if (!Number.isFinite(score) || score < 0 || score > MAX_SCORE) {
    return NextResponse.json({ ok: false, error: 'invalid_score' }, { status: 400 });
  }

  const name = sanitizeName(String(b.displayName ?? ''));
  const id = randomUUID();
  const submittedAt = Date.now();

  try {
    await r.zadd(ZKEY, { score, member: id });
    await r.hset(`${EPREFIX}${id}`, {
      name,
      submittedAt: String(submittedAt),
    });

    const count = await r.zcard(ZKEY);
    if (count > MAX_STORED) {
      const removeLow = count - MAX_STORED;
      await r.zremrangebyrank(ZKEY, 0, removeLow - 1);
    }

    return NextResponse.json({ ok: true as const, id });
  } catch (e) {
    console.error('game-leaderboard POST', e);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
