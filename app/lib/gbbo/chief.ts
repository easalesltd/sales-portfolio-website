import { cookies } from "next/headers";

export const GBBO_CHIEF_COOKIE = "gbbo_chief";

export function gbboChiefPin(): string {
  return process.env.GBBO_CHIEF_KEY?.trim() || "beer-baguette-chief";
}

export async function isGbboChiefRequest(request?: Request): Promise<boolean> {
  const pin = gbboChiefPin();
  const header = request?.headers.get("x-gbbo-chief")?.trim();
  if (header && header === pin) return true;

  const jar = await cookies();
  return jar.get(GBBO_CHIEF_COOKIE)?.value === pin;
}
