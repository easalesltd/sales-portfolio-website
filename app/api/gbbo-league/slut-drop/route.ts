import { NextResponse } from "next/server";
import { isGbboChiefRequest } from "@/app/lib/gbbo/chief";
import { gbboSlug } from "@/app/lib/gbbo/identity";
import { owesSlutDrop, slutDropFor } from "@/app/lib/gbbo/league";
import { isGbboPlayerRequest } from "@/app/lib/gbbo/player-pins";
import { readGbboLeague, writeGbboLeague } from "@/app/lib/gbbo/persist";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { companionId?: string; week?: number };
  const week = Number(body.week);
  const league = await readGbboLeague();
  const companion = league.companions.find((item) => item.id === body.companionId);
  if (!companion || !Number.isInteger(week) || week < 1) {
    return NextResponse.json({ error: "That slut drop is not on the ledger." }, { status: 400 });
  }

  if (!(await isGbboPlayerRequest(gbboSlug(companion.name), request))) {
    return NextResponse.json({ error: "Only that companion, or the Chief, can mark the slut drop done." }, { status: 401 });
  }

  if (!owesSlutDrop(league, companion.id, week)) {
    return NextResponse.json({ error: "That companion does not owe a slut drop this week." }, { status: 403 });
  }

  league.slutDrops = league.slutDrops ?? [];
  const existing = slutDropFor(league, companion.id, week);
  if (existing) {
    existing.completed = true;
    existing.completedAt = existing.completedAt ?? new Date().toISOString();
  } else {
    league.slutDrops.push({
      week,
      companionId: companion.id,
      completed: true,
      completedAt: new Date().toISOString(),
    });
  }

  await writeGbboLeague(league);
  return NextResponse.json(await readGbboLeague());
}
