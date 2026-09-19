import { NextResponse } from "next/server";
import { gbboSlug } from "@/app/lib/gbbo/identity";
import {
  GBBO_PLAYER_COOKIE,
  playerPinMatches,
  unlockedPlayerSlug,
} from "@/app/lib/gbbo/player-pins";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ slug: await unlockedPlayerSlug() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { slug?: string; pin?: string };
  const slug = gbboSlug(body.slug ?? "");
  const pin = body.pin ?? "";
  if (!slug || !playerPinMatches(slug, pin)) {
    return NextResponse.json({ error: "That password does not match that companion." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, slug });
  response.cookies.set({
    name: GBBO_PLAYER_COOKIE,
    value: `${slug}:${pin.trim()}`,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: GBBO_PLAYER_COOKIE,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
