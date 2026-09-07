import { NextResponse } from "next/server";
import { uid } from "@/app/lib/gbbo/ids";
import { gbboSlug } from "@/app/lib/gbbo/identity";
import {
  bakerStillIn,
  carriedTeam,
  lineupChanges,
  teamForWeek,
  teamSizeForWeek,
} from "@/app/lib/gbbo/league";
import { readGbboLeague, writeGbboLeague } from "@/app/lib/gbbo/persist";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    companionSlug?: string;
    bakerIds?: string[];
    playJoker?: boolean;
    keepLastWeek?: boolean;
  };

  const slug = gbboSlug(body.companionSlug ?? "");
  const league = await readGbboLeague();
  const companion = league.companions.find((item) => gbboSlug(item.name) === slug);
  if (!companion) {
    return NextResponse.json({ error: "That companion is not in the tent." }, { status: 404 });
  }

  const week = league.currentWeek;
  const size = teamSizeForWeek(league, week);
  const previous = (week > 1 ? teamForWeek(league, companion.id, week - 1) : carriedTeam(league, companion.id, 1))
    .filter((id) => bakerStillIn(league, id, week));

  league.substitutions = league.substitutions.filter((sub) => !(sub.companionId === companion.id && sub.week === week));

  if (!body.keepLastWeek) {
    const next = (body.bakerIds ?? []).filter(Boolean);
    const unique = new Set(next);
    if (unique.size !== next.length || next.length !== size) {
      return NextResponse.json({ error: `Choose ${size} different bakers still in the tent.` }, { status: 400 });
    }
    if (next.some((id) => !bakerStillIn(league, id, week))) {
      return NextResponse.json({ error: "One of those bakers has already left the tent." }, { status: 400 });
    }
    const changes = lineupChanges(previous, next);
    if (week > 1 && changes > 1) {
      return NextResponse.json({ error: "Only one substitution is allowed each week." }, { status: 400 });
    }
    const outBakerId = previous.find((id) => !next.includes(id)) ?? previous[previous.length - 1] ?? next[0];
    const inBakerId = next.find((id) => !previous.includes(id)) ?? null;
    if (outBakerId || inBakerId) {
      league.substitutions.push({
        id: uid("sub"),
        week,
        companionId: companion.id,
        outBakerId: outBakerId || next[0],
        inBakerId,
        autoByChief: false,
      });
    }
  }

  if (body.playJoker && week <= 4 && !league.jokers.some((joker) => joker.companionId === companion.id)) {
    league.jokers.push({ companionId: companion.id, week, autoApplied: false });
  }

  await writeGbboLeague(league);
  return NextResponse.json(await readGbboLeague());
}
