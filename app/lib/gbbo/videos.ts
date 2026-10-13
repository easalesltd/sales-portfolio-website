import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { gameLeaderboardRedis } from "@/app/lib/game-leaderboard-redis";
import { uid } from "./ids";
import { VIDEO_CHUNK_BYTES, VIDEO_MAX_BYTES, VIDEO_MAX_CHUNKS } from "./video-limits";

export { VIDEO_CHUNK_BYTES, VIDEO_MAX_BYTES, VIDEO_MAX_CHUNKS };

/** Chunk size used before uploads were raised to the current limit. */
const LEGACY_CHUNK_BYTES = 400_000;
const READ_BATCH = 4;

const PREFIX = "gbbo:companion-league:2026:vid";
const DATA_DIR = join(process.cwd(), "data", "gbbo-videos");

export type VideoRecord = {
  id: string;
  mime: string;
  size: number;
  chunks: number;
  chunkBytes?: number;
};

function metaKey(id: string) {
  return `${PREFIX}:meta:${id}`;
}

function chunkKey(id: string, index: number) {
  return `${PREFIX}:${id}:${index}`;
}

function receivedKey(id: string) {
  return `${PREFIX}:recv:${id}`;
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

function chunkBytesOf(record: VideoRecord) {
  return record.chunkBytes ?? LEGACY_CHUNK_BYTES;
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
  if (!Number.isInteger(input.index) || input.index < 0 || input.index >= input.total) {
    throw new Error("That video chunk is out of range.");
  }
  const last = input.index === input.total - 1;
  if (input.bytes.length > VIDEO_CHUNK_BYTES || (!last && input.bytes.length !== VIDEO_CHUNK_BYTES)) {
    throw new Error("That video chunk is the wrong size. Try uploading again.");
  }

  const redis = gameLeaderboardRedis();
  if (redis) {
    const finished = await redis.get<VideoRecord>(metaKey(input.id));
    if (finished?.chunks) return finished;
    await redis.set(chunkKey(input.id, input.index), input.bytes.toString("base64"));
    await redis.hset(receivedKey(input.id), { [String(input.index)]: input.bytes.length });
    const received = await redis.hgetall<Record<string, number>>(receivedKey(input.id));
    const lengths = Object.values(received ?? {}).map(Number);
    if (lengths.length < input.total) return null;
    const record: VideoRecord = {
      id: input.id,
      mime: input.mime,
      size: lengths.reduce((sum, length) => sum + length, 0),
      chunks: input.total,
      chunkBytes: VIDEO_CHUNK_BYTES,
    };
    await redis.set(metaKey(input.id), record);
    await redis.del(receivedKey(input.id));
    return record;
  }

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(fileChunkPath(input.id, input.index), input.bytes);
  let size = 0;
  for (let i = 0; i < input.total; i += 1) {
    const path = fileChunkPath(input.id, i);
    if (!existsSync(path)) return null;
    size += (await readFile(path)).length;
  }
  const record: VideoRecord = { id: input.id, mime: input.mime, size, chunks: input.total, chunkBytes: VIDEO_CHUNK_BYTES };
  await writeFile(fileMetaPath(input.id), JSON.stringify(record));
  return record;
}

export async function readVideoRecord(id: string): Promise<VideoRecord | null> {
  const redis = gameLeaderboardRedis();
  if (redis) {
    const record = await redis.get<VideoRecord>(metaKey(id));
    return record?.chunks ? record : null;
  }
  const metaPath = fileMetaPath(id);
  if (!existsSync(metaPath)) return null;
  return JSON.parse(await readFile(metaPath, "utf8")) as VideoRecord;
}

async function readChunks(id: string, indexes: number[]): Promise<Buffer[] | null> {
  const redis = gameLeaderboardRedis();
  if (redis) {
    const parts: Buffer[] = [];
    for (let i = 0; i < indexes.length; i += READ_BATCH) {
      const keys = indexes.slice(i, i + READ_BATCH).map((index) => chunkKey(id, index));
      const values = await redis.mget<(string | null)[]>(...keys);
      if (values.some((value) => !value)) return null;
      parts.push(...values.map((value) => Buffer.from(value as string, "base64")));
    }
    return parts;
  }
  const parts: Buffer[] = [];
  for (const index of indexes) {
    const path = fileChunkPath(id, index);
    if (!existsSync(path)) return null;
    parts.push(await readFile(path));
  }
  return parts;
}

/** Bytes `start` to `end` inclusive, reading only the chunks that cover them. */
export async function readVideoRange(record: VideoRecord, start: number, end: number): Promise<Buffer | null> {
  const chunkBytes = chunkBytesOf(record);
  const first = Math.floor(start / chunkBytes);
  const last = Math.min(record.chunks - 1, Math.floor(end / chunkBytes));
  const indexes = Array.from({ length: last - first + 1 }, (_, offset) => first + offset);
  const parts = await readChunks(record.id, indexes);
  if (!parts) return null;
  const body = Buffer.concat(parts);
  const offset = start - first * chunkBytes;
  return body.subarray(offset, offset + (end - start + 1));
}

/** The whole file, streamed a few chunks at a time. */
export function streamVideo(record: VideoRecord): ReadableStream<Uint8Array> {
  let next = 0;
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (next >= record.chunks) {
        controller.close();
        return;
      }
      const indexes = Array.from({ length: Math.min(READ_BATCH, record.chunks - next) }, (_, offset) => next + offset);
      next += indexes.length;
      const parts = await readChunks(record.id, indexes);
      if (!parts) {
        controller.error(new Error("That video is missing a chunk."));
        return;
      }
      for (const part of parts) controller.enqueue(new Uint8Array(part));
    },
  });
}
