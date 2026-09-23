import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    { error: "A slut drop only counts once the video is uploaded." },
    { status: 400 },
  );
}
