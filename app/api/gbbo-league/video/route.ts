import { NextResponse } from "next/server";
import { isGbboPlayerRequest } from "@/app/lib/gbbo/player-pins";
import { gbboSlug } from "@/app/lib/gbbo/identity";
import { owesSlutDrop, slutDropFor } from "@/app/lib/gbbo/league";
import { readGbboLeague, writeGbboLeague } from "@/app/lib/gbbo/persist";
import { newVideoId, saveVideoChunk, readVideo, VIDEO_MAX_BYTES } from "@/app/lib/gbbo/videos";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id")?.trim() ?? "";
  if (!id) return NextResponse.json({ error: "Missing video." }, { status: 400 });
  const video = await readVideo(id);
  if (!video) return NextResponse.json({ error: "That video is not on the ledger." }, { status: 404 });
  const body = Uint8Array.from(video.body);
  return new NextResponse(body, {
    headers: {
      "Content-Type": video.mime,
      "Content-Length": String(body.byteLength),
      "Cache-Control": "private, max-age=3600",
    },
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
    league.slutDrops = league.slutDrops ?? [];
    const existing = slutDropFor(league, companion.id, week);
    if (existing) {
      existing.completed = true;
      existing.completedAt = existing.completedAt ?? new Date().toISOString();
      existing.videoId = record.id;
    } else {
      league.slutDrops.push({
        week,
        companionId: companion.id,
        completed: true,
        completedAt: new Date().toISOString(),
        videoId: record.id,
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
