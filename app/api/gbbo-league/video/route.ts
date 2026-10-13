import { NextResponse } from "next/server";
import { isGbboPlayerRequest } from "@/app/lib/gbbo/player-pins";
import { gbboSlug } from "@/app/lib/gbbo/identity";
import { owesSlutDrop, slutDropFor } from "@/app/lib/gbbo/league";
import { readGbboLeague, writeGbboLeague } from "@/app/lib/gbbo/persist";
import { newVideoId, readVideoRange, readVideoRecord, saveVideoChunk, streamVideo, VIDEO_MAX_BYTES } from "@/app/lib/gbbo/videos";

export const runtime = "nodejs";

const MAX_RANGE_BYTES = 4 * 1024 * 1024;

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id")?.trim() ?? "";
  if (!id) return NextResponse.json({ error: "Missing video." }, { status: 400 });
  const record = await readVideoRecord(id);
  if (!record) return NextResponse.json({ error: "That video is not on the ledger." }, { status: 404 });
  const headers = {
    "Content-Type": record.mime || "video/mp4",
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, max-age=3600",
  };

  const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get("range")?.trim() ?? "");
  if (range && (range[1] || range[2])) {
    let start: number;
    let end: number;
    if (range[1]) {
      start = Number(range[1]);
      end = range[2] ? Number(range[2]) : record.size - 1;
    } else {
      start = Math.max(0, record.size - Number(range[2]));
      end = record.size - 1;
    }
    end = Math.min(end, record.size - 1, start + MAX_RANGE_BYTES - 1);
    if (start >= record.size || start > end) {
      return new NextResponse(null, { status: 416, headers: { ...headers, "Content-Range": `bytes */${record.size}` } });
    }
    const body = await readVideoRange(record, start, end);
    if (!body) return NextResponse.json({ error: "That video is missing a piece." }, { status: 404 });
    return new NextResponse(Uint8Array.from(body), {
      status: 206,
      headers: {
        ...headers,
        "Content-Range": `bytes ${start}-${end}/${record.size}`,
        "Content-Length": String(body.byteLength),
      },
    });
  }

  return new NextResponse(streamVideo(record), {
    headers: { ...headers, "Content-Length": String(record.size) },
  });
}

export async function POST(request: Request) {
  const form = await request.formData();
  const kind = String(form.get("kind") ?? "");
  const companionId = String(form.get("companionId") ?? "");
  const week = Number(form.get("week"));
  const penaltyId = String(form.get("penaltyId") ?? "");
  const uploadId = String(form.get("uploadId") ?? newVideoId());
  const index = Number(form.get("index") ?? 0);
  const total = Number(form.get("total") ?? 1);
  const mime = String(form.get("mime") ?? "") || (kind === "technical" ? "image/jpeg" : "video/mp4");
  const chunk = form.get("chunk");

  if (!(chunk instanceof File)) {
    return NextResponse.json({ error: "Choose a file first." }, { status: 400 });
  }
  if (kind === "technical") {
    if (mime && !mime.startsWith("image/")) {
      return NextResponse.json({ error: "That file is not a photo of the bake." }, { status: 400 });
    }
  } else if (kind === "slut_drop") {
    if (!mime.startsWith("video/") && !mime.startsWith("image/")) {
      return NextResponse.json({ error: "That file is not a photo or video." }, { status: 400 });
    }
  } else if (!mime.startsWith("video/")) {
    return NextResponse.json({ error: "That file is not a video." }, { status: 400 });
  }

  const league = await readGbboLeague();
  const companion = league.companions.find((item) => item.id === companionId);
  if (!companion || !Number.isInteger(week) || week < 1) {
    return NextResponse.json({ error: "That punishment is not on the ledger." }, { status: 400 });
  }
  if (!(await isGbboPlayerRequest(gbboSlug(companion.name), request))) {
    return NextResponse.json({ error: "Only that companion, or the Chief, can upload this video." }, { status: 401 });
  }

  if (kind === "slut_drop") {
    if (!owesSlutDrop(league, companion.id, week)) {
      return NextResponse.json({ error: "That companion does not owe a slut drop this week." }, { status: 403 });
    }
  } else if (kind === "beer_baguette" || kind === "technical") {
    const penalty = league.penalties.find((item) => item.id === penaltyId && item.companionId === companion.id);
    if (!penalty || penalty.kind !== kind) {
      return NextResponse.json({ error: "That punishment is not on the ledger." }, { status: 403 });
    }
  } else {
    return NextResponse.json({ error: "Unknown punishment." }, { status: 400 });
  }

  const bytes = Buffer.from(await chunk.arrayBuffer());
  let record;
  try {
    record = await saveVideoChunk({ id: uploadId, index, total, mime, bytes });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not save that video." }, { status: 400 });
  }

  if (!record) {
    return NextResponse.json({ ok: true, uploadId, complete: false });
  }
  if (record.size > VIDEO_MAX_BYTES) {
    return NextResponse.json({ error: "That file is too large. Use a shorter clip or a smaller photo." }, { status: 400 });
  }

  if (kind === "slut_drop") {
    const mediaType = mime.startsWith("image/") ? "photo" : "video";
    league.slutDrops = league.slutDrops ?? [];
    const existing = slutDropFor(league, companion.id, week);
    if (existing) {
      existing.completed = true;
      existing.completedAt = existing.completedAt ?? new Date().toISOString();
      existing.videoId = record.id;
      existing.mediaType = mediaType;
    } else {
      league.slutDrops.push({
        week,
        companionId: companion.id,
        completed: true,
        completedAt: new Date().toISOString(),
        videoId: record.id,
        mediaType,
        escalated: false,
      });
    }
  } else {
    const penalty = league.penalties.find((item) => item.id === penaltyId);
    if (penalty) {
      penalty.videoId = record.id;
      penalty.completed = true;
    }
  }

  await writeGbboLeague(league);
  return NextResponse.json({ ok: true, uploadId: record.id, complete: true, league: await readGbboLeague() });
}
