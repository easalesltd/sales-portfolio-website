import { createHash } from "crypto";
import { cookies } from "next/headers";
import { gbboSlug } from "./identity";
import { isGbboChiefRequest } from "./chief";

export const GBBO_PLAYER_COOKIE = "gbbo_player";

const SALT = "gbbo-companion-tent-2026";

const PIN_HASHES: Record<string, string> = {
  dave: "7231416cea59b3c6b21ed3887ed27ede91720f61351577de198505d06d171a75",
  cowie: "d3037d9d7ebd2c21de541bfd1922101f4aeebcf54eb94f5f6493cacd10766f76",
  guns: "654f272bfeb0d3ddc1edfe31691d96191d043cb4389da55e7a9f6afda5659836",
  shuker: "b5c85b836ebac4980618e2a177c4cbcce4c83654ca2d205e9400e6924940f30a",
  lee: "31902b297b611c71758dfdecb9ade348c26d69928d6b0ec512756fdb0bd6bbd6",
  nest: "89e1f5cb9244401fd19f674b16c12388390a7909396bdef19e410d4b5a09d0d6",
};

export function normalizePlayerPin(pin: string): string {
  return pin.trim().toLowerCase().replace(/\s+/g, "");
}

export function hashPlayerPin(slug: string, pin: string): string {
  return createHash("sha256").update(`${SALT}:${gbboSlug(slug)}:${normalizePlayerPin(pin)}`).digest("hex");
}

function expectedHash(slug: string): string | null {
  const key = gbboSlug(slug);
  const extras = process.env.GBBO_PLAYER_PINS?.trim();
  if (extras) {
    try {
      const parsed = JSON.parse(extras) as Record<string, string>;
      const pin = parsed[key];
      if (pin) return hashPlayerPin(key, pin);
    } catch {
      // Fall back to the built-in hashes.
    }
  }
  return PIN_HASHES[key] ?? null;
}

export function playerPinMatches(slug: string, pin: string): boolean {
  const expected = expectedHash(slug);
  if (!expected) return false;
  return hashPlayerPin(slug, pin) === expected;
}

export function parsePlayerCookie(value?: string | null): { slug: string; pin: string } | null {
  if (!value || !value.includes(":")) return null;
  const slug = gbboSlug(value.slice(0, value.indexOf(":")));
  const pin = value.slice(value.indexOf(":") + 1);
  if (!slug || !pin) return null;
  return { slug, pin };
}

export async function unlockedPlayerSlug(request?: Request): Promise<string | null> {
  const header = request?.headers.get("x-gbbo-player")?.trim();
  if (header) {
    const parsed = parsePlayerCookie(header);
    if (parsed && playerPinMatches(parsed.slug, parsed.pin)) return parsed.slug;
  }
  const jar = await cookies();
  const parsed = parsePlayerCookie(jar.get(GBBO_PLAYER_COOKIE)?.value);
  if (parsed && playerPinMatches(parsed.slug, parsed.pin)) return parsed.slug;
  return null;
}

export async function isGbboPlayerRequest(slug: string, request?: Request): Promise<boolean> {
  if (await isGbboChiefRequest(request)) return true;
  const unlocked = await unlockedPlayerSlug(request);
  return unlocked === gbboSlug(slug);
}
