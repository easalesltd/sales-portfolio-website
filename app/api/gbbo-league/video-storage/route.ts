import { NextResponse } from "next/server";
import { isGbboChiefRequest } from "@/app/lib/gbbo/chief";
import { compressPunishmentPhoto } from "@/app/lib/gbbo/compress-media";
import { readGbboLeague } from "@/app/lib/gbbo/persist";
import {
  deleteVideo,
  listIncompleteUploadIds,
  listVideoRecords,
  purgeIncompleteUploads,
  readVideoBytes,
  writeVideoBytes,
} from "@/app/lib/gbbo/videos";

export const runtime = "nodejs";
export const maxDuration = 60;

function referencedVideoIds(league: Awaited<ReturnType<typeof readGbboLeague>>): Set<string> {
  const ids = new Set<string>();
  for (const drop of league.slutDrops ?? []) {
    if (drop.videoId) ids.add(drop.videoId);
  }
  for (const penalty of league.penalties ?? []) {
    if (penalty.videoId) ids.add(penalty.videoId);
  }
  return ids;
}

function approxRedisBytes(size: number) {
  return Math.ceil(size * (4 / 3));
}

async function inventory() {
  const league = await readGbboLeague();
  const referenced = referencedVideoIds(league);
  const records = await listVideoRecords();
  const incomplete = await listIncompleteUploadIds();
  const videos = records.map((record) => ({
    id: record.id,
    mime: record.mime,
    size: record.size,
    approxRedisBytes: approxRedisBytes(record.size),
    chunks: record.chunks,
    referenced: referenced.has(record.id),
    photo: record.mime.startsWith("image/"),
  }));
  const orphanIds = videos.filter((item) => !item.referenced).map((item) => item.id);
  const decodedBytes = videos.reduce((sum, item) => sum + item.size, 0);
  return {
    count: videos.length,
    incompleteUploadIds: incomplete,
    orphanIds,
    decodedBytes,
    approxRedisBytes: approxRedisBytes(decodedBytes),
    videos,
  };
}

async function purgeOrphans() {
  const snap = await inventory();
  const deleted: Array<{ id: string; keysRemoved: number }> = [];
  for (const id of snap.orphanIds) {
    deleted.push({ id, keysRemoved: await deleteVideo(id) });
  }
  return { deleted, incomplete: await purgeIncompleteUploads() };
}

async function recompressPhotos() {
  const league = await readGbboLeague();
  const referenced = referencedVideoIds(league);
  const records = (await listVideoRecords())
    .filter((record) => record.mime.startsWith("image/") && referenced.has(record.id))
    .sort((a, b) => b.size - a.size);

  const results: Array<{
    id: string;
    before: number;
    after: number;
    saved: number;
    skipped?: string;
  }> = [];

  for (const record of records) {
    const original = await readVideoBytes(record);
    if (!original) {
      results.push({ id: record.id, before: record.size, after: record.size, saved: 0, skipped: "missing" });
      continue;
    }
    const compressed = await compressPunishmentPhoto(original);
    if (!compressed) {
      results.push({ id: record.id, before: record.size, after: record.size, saved: 0, skipped: "no smaller" });
      continue;
    }
    // writeVideoBytes deletes first so a full Redis can accept the smaller rewrite.
    const next = await writeVideoBytes(record.id, compressed.mime, compressed.bytes);
    results.push({
      id: record.id,
      before: record.size,
      after: next.size,
      saved: record.size - next.size,
    });
  }

  return {
    results,
    savedBytes: results.reduce((sum, row) => sum + row.saved, 0),
  };
}

export async function GET(request: Request) {
  if (!(await isGbboChiefRequest(request))) {
    return NextResponse.json({ error: "Only the Chief Companion can inspect video storage." }, { status: 401 });
  }
  return NextResponse.json(await inventory());
}

export async function POST(request: Request) {
  if (!(await isGbboChiefRequest(request))) {
    return NextResponse.json({ error: "Only the Chief Companion can change video storage." }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const action = String(form.get("action") ?? "");
    if (action !== "replace") {
      return NextResponse.json({ error: "Unknown multipart action." }, { status: 400 });
    }
    const id = String(form.get("id") ?? "").trim();
    const mime = String(form.get("mime") ?? "") || "video/mp4";
    const file = form.get("file");
    if (!id || !(file instanceof File)) {
      return NextResponse.json({ error: "Need an id and a file." }, { status: 400 });
    }
    const before = await listVideoRecords().then((rows) => rows.find((row) => row.id === id) ?? null);
    const bytes = Buffer.from(await file.arrayBuffer());
    const record = await writeVideoBytes(id, mime, bytes);
    return NextResponse.json({
      ok: true,
      id,
      before: before?.size ?? null,
      after: record.size,
      saved: (before?.size ?? record.size) - record.size,
      record,
    });
  }

  const body = (await request.json().catch(() => ({}))) as { action?: string; id?: string };
  const action = body.action ?? "";

  if (action === "purge_incomplete") {
    return NextResponse.json({ ok: true, ...(await purgeIncompleteUploads()) });
  }
  if (action === "purge_orphans") {
    return NextResponse.json({ ok: true, ...(await purgeOrphans()) });
  }
  if (action === "recompress_photos") {
    return NextResponse.json({ ok: true, ...(await recompressPhotos()) });
  }
  if (action === "delete") {
    const id = body.id?.trim() ?? "";
    if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
    const keysRemoved = await deleteVideo(id);
    return NextResponse.json({ ok: true, id, keysRemoved });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
