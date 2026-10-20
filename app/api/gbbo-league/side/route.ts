import { NextResponse } from "next/server";
import { isGbboChiefRequest } from "@/app/lib/gbbo/chief";
import { isGbboPlayerRequest } from "@/app/lib/gbbo/player-pins";
import { uid } from "@/app/lib/gbbo/ids";
import { gbboSlug } from "@/app/lib/gbbo/identity";
import {
  bakerName,
  bakerStillIn,
  barredBakersForWeek,
  carriedTeam,
  lineupChanges,
  sideSubstitution,
  sideConfirmed,
  teamForWeek,
  teamSizeForWeek,
} from "@/app/lib/gbbo/league";
import { readGbboLeague, writeGbboLeague } from "@/app/lib/gbbo/persist";
import { teamWindow } from "@/app/lib/gbbo/window";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    companionSlug?: string;
    bakerIds?: string[];
    playJoker?: boolean;
    keepLastWeek?: boolean;
    jokerOnly?: boolean;
  };

  const slug = gbboSlug(body.companionSlug ?? "");
  const league = await readGbboLeague();
  const companion = league.companions.find((item) => gbboSlug(item.name) === slug);
  if (!companion) {
    return NextResponse.json({ error: "That companion is not in the tent." }, { status: 404 });
  }

  if (!(await isGbboPlayerRequest(slug, request))) {
    return NextResponse.json({ error: "Enter your password first." }, { status: 401 });
  }

  const gate = teamWindow(new Date(), league.totalWeeks);
  if (!gate.open && !(await isGbboChiefRequest(request))) {
    return NextResponse.json({ error: gate.summary }, { status: 403 });
  }

  const week = gate.week;
  const chief = await isGbboChiefRequest(request);
  if (body.jokerOnly) {
    if (week > 4) {
      return NextResponse.json({ error: "The joker can only be played in weeks 1 to 4." }, { status: 400 });
    }
    if (league.jokers.some((joker) => joker.companionId === companion.id)) {
      return NextResponse.json({ error: "Your joker has already been played." }, { status: 400 });
    }
    league.jokers.push({ companionId: companion.id, week, autoApplied: false });
    await writeGbboLeague(league);
    return NextResponse.json(await readGbboLeague());
  }
  if (sideConfirmed(league, companion.id, week) && !chief) {
    return NextResponse.json({ error: "Your week is locked. You have already submitted this side." }, { status: 403 });
  }
  const size = teamSizeForWeek(league, week);
  const barred = barredBakersForWeek(league, week);
  const lastWeek = week > 1 ? teamForWeek(league, companion.id, week - 1) : carriedTeam(league, companion.id, 1);
  const previous = lastWeek.filter((id) => bakerStillIn(league, id, week) && !barred.includes(id));
  const barredNames = barred.map((id) => bakerName(league, id)).join(" and ");

  const barredOnLastWeek = lastWeek.some((id) => barred.includes(id));
  if (body.keepLastWeek && barredOnLastWeek && previous.length < size) {
    return NextResponse.json(
      { error: `${barredNames} cannot be picked this week. Use your substitution to replace them.` },
      { status: 400 },
    );
  }

  league.substitutions = league.substitutions.filter((sub) => !(sub.companionId === companion.id && sub.week === week));

  if (body.keepLastWeek && previous.length < size) {
    return NextResponse.json(
      { error: `Only ${previous.length} of last week's bakers are still in the tent. Pick a replacement so you have ${size}.` },
      { status: 400 },
    );
  }

  if (!body.keepLastWeek) {
    const next = (body.bakerIds ?? []).filter(Boolean);
    const unique = new Set(next);
    if (unique.size !== next.length || next.length !== size) {
      return NextResponse.json({ error: `Choose ${size} different bakers still in the tent.` }, { status: 400 });
    }
    if (next.some((id) => !bakerStillIn(league, id, week))) {
      return NextResponse.json({ error: "One of those bakers has already left the tent." }, { status: 400 });
    }
    if (next.some((id) => barred.includes(id))) {
      return NextResponse.json(
        { error: `Every companion picked ${barredNames} last week, so they cannot be picked this week.` },
        { status: 400 },
      );
    }
    const changes = lineupChanges(previous, next);
    const addsAllowed = Math.max(0, size - previous.length);
    if (week > 1 && barredOnLastWeek && addsAllowed > 0 && (changes > addsAllowed || previous.some((id) => !next.includes(id)))) {
      return NextResponse.json(
        { error: `${barredNames} coming off uses your substitution, so you cannot change anyone else.` },
        { status: 400 },
      );
    }
    if (week > 1 && changes > 1) {
      return NextResponse.json({ error: "Only one substitution is allowed each week." }, { status: 400 });
    }
    const swap = sideSubstitution(previous, next);
    if (swap) {
      league.substitutions.push({ id: uid("sub"), week, companionId: companion.id, ...swap, autoByChief: false });
    }
    const saved = teamForWeek(league, companion.id, week);
    if (week > 1 && (saved.length !== size || next.some((id) => !saved.includes(id)))) {
      return NextResponse.json(
        { error: "That side could not be saved exactly as picked, so nothing was changed. Try again or tell the Chief." },
        { status: 500 },
      );
    }
  }

  if (body.playJoker && week <= 4 && !league.jokers.some((joker) => joker.companionId === companion.id)) {
    league.jokers.push({ companionId: companion.id, week, autoApplied: false });
  }

  league.sideConfirmations = (league.sideConfirmations ?? []).filter(
    (item) => !(item.companionId === companion.id && item.week === week),
  );
  league.sideConfirmations.push({ companionId: companion.id, week });

  await writeGbboLeague(league);
  return NextResponse.json(await readGbboLeague());
}
