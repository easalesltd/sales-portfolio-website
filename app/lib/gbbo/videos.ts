import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { gameLeaderboardRedis } from "@/app/lib/game-leaderboard-redis";
import { uid } from "./ids";

export const VIDEO_CHUNK_BYTES = 400_000;
export const VIDEO_MAX_CHUNKS = 24;
export const VIDEO_MAX_BYTES = VIDEO_CHUNK_BYTES * VIDEO_MAX_CHUNKS;

const PREFIX = "gbbo:companion-league:2026:vid";
const DATA_DIR = join(process.cwd(), "data", "gbbo-videos");

export type VideoRecord = {
  id: string;
  mime: string;
  size: number;
  chunks: number;
};

function metaKey(id: string) {
  return `${PREFIX}:meta:${id}`;
}

function chunkKey(id: string, index: number) {
  return `${PREFIX}:${id}:${index}`;
}

function fileMetaPath(id: string) {
  return join(DATA_DIR, `${id}.json`);
}

function fileChunkPath(id: string, index: number) {
  return join(DATA_DIR, `${id}.${index}.bin`);
}

export function newVideoId() {
  return uid("vid");
}

export async function saveVideoChunk(input: {
  id: string;
  index: number;
  total: number;
  mime: string;
  bytes: Buffer;
}): Promise<VideoRecord | null> {
  if (input.total < 1 || input.total > VIDEO_MAX_CHUNKS) {
    throw new Error("That file is too large. Use a shorter clip or a smaller photo.");
  }
  if (input.index < 0 || input.index >= input.total) {
    throw new Error("That video chunk is out of range.");
  }
  if (input.bytes.length > VIDEO_CHUNK_BYTES + 8_000) {
    throw new Error("That video chunk is too large.");
  }

  const redis = gameLeaderboardRedis();
  if (redis) {
    await redis.set(chunkKey(input.id, input.index), input.bytes.toString("base64"));
    const have: string[] = [];
    for (let i = 0; i < input.total; i += 1) {
      const chunk = await redis.get<string>(chunkKey(input.id, i));
      if (chunk) have.push(chunk);
    }
    if (have.length < input.total) return null;
    const body = Buffer.concat(have.map((chunk) => Buffer.from(chunk, "base64")));
    const record: VideoRecord = { id: input.id, mime: input.mime, size: body.length, chunks: input.total };
    await redis.set(metaKey(input.id), record);
    return record;
  }

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(fileChunkPath(input.id, input.index), input.bytes);
  const have: Buffer[] = [];
  for (let i = 0; i < input.total; i += 1) {
    const path = fileChunkPath(input.id, i);
    if (!existsSync(path)) return null;
    have.push(await readFile(path));
  }
  const record: VideoRecord = {
    id: input.id,
    mime: input.mime,
    size: have.reduce((sum, chunk) => sum + chunk.length, 0),
    chunks: input.total,
  };
  await writeFile(fileMetaPath(input.id), JSON.stringify(record));
  return record;
}

export async function readVideo(id: string): Promise<{ mime: string; body: Buffer } | null> {
  const redis = gameLeaderboardRedis();
  if (redis) {
    const record = await redis.get<VideoRecord>(metaKey(id));
    if (!record?.chunks) return null;
    const parts: Buffer[] = [];
    for (let i = 0; i < record.chunks; i += 1) {
      const chunk = await redis.get<string>(chunkKey(id, i));
      if (!chunk) return null;
      parts.push(Buffer.from(chunk, "base64"));
    }
    return { mime: record.mime || "video/mp4", body: Buffer.concat(parts) };
  }

  const metaPath = fileMetaPath(id);
  if (!existsSync(metaPath)) return null;
  const record = JSON.parse(await readFile(metaPath, "utf8")) as VideoRecord;
  const parts: Buffer[] = [];
  for (let i = 0; i < record.chunks; i += 1) {
    const path = fileChunkPath(id, i);
    if (!existsSync(path)) return null;
    parts.push(await readFile(path));
  }
  return { mime: record.mime || "video/mp4", body: Buffer.concat(parts) };
}
