import { NextResponse } from "next/server";
import { GBBO_CHIEF_COOKIE, gbboChiefPin } from "@/app/lib/gbbo/chief";

export async function POST(request: Request) {
  const body = (await request.json()) as { pin?: string };
  const pin = body.pin?.trim() ?? "";
  if (pin !== gbboChiefPin()) {
    return NextResponse.json({ error: "That is not the Chief Companion key." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: GBBO_CHIEF_COOKIE,
    value: pin,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: GBBO_CHIEF_COOKIE,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
