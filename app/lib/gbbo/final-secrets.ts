import { gbboSlug } from "./identity";
import type { LeagueState } from "./types";

/** Final baker picks and technical 1-2-3 stay sealed until the Chief publishes the Final. */
export function finalSecretsRevealed(league: LeagueState): boolean {
  return Boolean(league.episodes.find((episode) => episode.week === league.totalWeeks)?.published);
}

/**
 * Public payload for anyone who is not the Chief.
 * Keeps the viewer's own Final baker + 1-2-3 so they can confirm what they locked in.
 * Everyone else's Final picks are stripped so the API cannot leak them before the reveal.
 */
export function redactFinalSecrets(league: LeagueState, viewerSlug: string | null): LeagueState {
  if (finalSecretsRevealed(league)) return league;
  const week = league.totalWeeks;
  const ownId =
    viewerSlug
      ? league.companions.find((companion) => gbboSlug(companion.name) === gbboSlug(viewerSlug))?.id ?? null
      : null;

  const next = structuredClone(league);
  next.technicalPodiumPredictions = (next.technicalPodiumPredictions ?? []).filter(
    (item) => item.week !== week || item.companionId === ownId,
  );
  next.substitutions = next.substitutions.filter(
    (item) => item.week !== week || item.companionId === ownId,
  );
  return next;
}
