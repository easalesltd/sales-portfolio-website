import { NextResponse } from 'next/server';
import { getRedis } from '@/app/lib/upstash-redis';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const REDIS_KEY = 'sales-agent-dash:leaderboard-v1';
const MAX_STORED = 200;
const MAX_RETURN = 25;
const MAX_SCORE = 1_000_000_000;
const NAME_MAX = 24;

export type LeaderboardEntry = {
  name: string;
  score: number;
  at: number;
};

function sanitizeName(raw: unknown): string {
  const s = String(raw ?? 'Anonymous').trim().replace(/\s+/g, ' ');
  const base = s.slice(0, NAME_MAX) || 'Anonymous';
  return base;
}

export async function GET() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ entries: [] as LeaderboardEntry[], server: false });
  }
  try {
    const raw = await redis.get<string>(REDIS_KEY);
    const entries: LeaderboardEntry[] = raw ? JSON.parse(raw) : [];
    const sorted = [...entries].sort((a, b) => b.score - a.score).slice(0, MAX_RETURN);
    return NextResponse.json({ entries: sorted, server: true });
  } catch (e) {
    console.error('[game-leaderboard] GET', e);
    return NextResponse.json({ entries: [] as LeaderboardEntry[], server: false });
  }
}

export async function POST(req: Request) {
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
  const name = sanitizeName(b.name);
  const score = Math.floor(Number(b.score));
  if (!Number.isFinite(score) || score < 0 || score > MAX_SCORE) {
    return NextResponse.json({ ok: false, error: 'invalid_score' }, { status: 400 });
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ ok: true, server: false });
  }

  try {
    const raw = await redis.get<string>(REDIS_KEY);
    const entries: LeaderboardEntry[] = raw ? JSON.parse(raw) : [];
    entries.push({ name, score, at: Date.now() });
    entries.sort((a, b) => b.score - a.score);
    await redis.set(REDIS_KEY, JSON.stringify(entries.slice(0, MAX_STORED)));
    return NextResponse.json({ ok: true, server: true });
  } catch (e) {
    console.error('[game-leaderboard] POST', e);
    return NextResponse.json({ ok: false, error: 'storage_failed' }, { status: 502 });
  }
}
