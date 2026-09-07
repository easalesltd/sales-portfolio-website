import { NextResponse } from "next/server";
import { isGbboChiefRequest } from "@/app/lib/gbbo/chief";
import { isLeague, readGbboLeague, writeGbboLeague } from "@/app/lib/gbbo/persist";

export const runtime = "nodejs";

export async function GET() {
  const league = await readGbboLeague();
  return NextResponse.json(league);
}

export async function PUT(request: Request) {
  if (!(await isGbboChiefRequest(request))) {
    return NextResponse.json({ error: "Only the Chief Companion can change the full ledger." }, { status: 401 });
  }
  const league = (await request.json()) as unknown;
  if (!isLeague(league)) {
    return NextResponse.json({ error: "Invalid league ledger." }, { status: 400 });
  }
  await writeGbboLeague(league);
  return NextResponse.json({ ok: true });
}
