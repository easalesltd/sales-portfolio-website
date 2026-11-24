import { isGbboChiefRequest } from "./chief";
import { redactFinalSecrets } from "./final-secrets";
import { unlockedPlayerSlug } from "./player-pins";
import type { LeagueState } from "./types";

/** League JSON safe to send to the browser for this request. */
export async function leaguePayloadForRequest(league: LeagueState, request?: Request): Promise<LeagueState> {
  if (await isGbboChiefRequest(request)) return league;
  const slug = await unlockedPlayerSlug(request);
  return redactFinalSecrets(league, slug);
}
