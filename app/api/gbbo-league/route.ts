import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { NextResponse } from 'next/server';
import { gameLeaderboardRedis } from '@/app/lib/game-leaderboard-redis';
import { createEmptyLeague } from '@/app/lib/gbbo/seed';
import type { LeagueState } from '@/app/lib/gbbo/types';

export const runtime = 'nodejs';

const REDIS_KEY = 'gbbo:companion-league:2026';
const DATA_PATH = join(process.cwd(), 'data', 'gbbo-league.json');

function isLeague(value: unknown): value is LeagueState {
  return Boolean(value && typeof value === 'object' && Array.isArray((value as LeagueState).companions));
}

async function readFromFile(): Promise<LeagueState | null> {
  if (!existsSync(DATA_PATH)) return null;
  const raw = await readFile(DATA_PATH, 'utf8');
  const parsed = JSON.parse(raw) as unknown;
  return isLeague(parsed) ? parsed : null;
}

async function writeToFile(league: LeagueState) {
  await mkdir(dirname(DATA_PATH), { recursive: true });
  await writeFile(DATA_PATH, JSON.stringify(league, null, 2));
}

async function readLeague(): Promise<LeagueState> {
  const redis = gameLeaderboardRedis();
  if (redis) {
    const stored = await redis.get<LeagueState>(REDIS_KEY);
    if (isLeague(stored)) return stored;
  }
  return (await readFromFile()) ?? createEmptyLeague();
}

export async function GET() {
  const league = await readLeague();
  return NextResponse.json(league);
}

export async function PUT(request: Request) {
  const league = (await request.json()) as LeagueState;
  if (!isLeague(league)) {
    return NextResponse.json({ error: 'Invalid league ledger.' }, { status: 400 });
  }

  const redis = gameLeaderboardRedis();
  if (redis) {
    await redis.set(REDIS_KEY, league);
  } else {
    await writeToFile(league);
  }

  return NextResponse.json({ ok: true });
}
