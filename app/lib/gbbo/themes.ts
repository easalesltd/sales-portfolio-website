import type { LeagueState } from "./types";

export const SERIES_THEMES_SOURCE =
  "https://en.wikipedia.org/w/api.php?action=parse&page=The_Great_British_Bake_Off_series_17&prop=wikitext&format=json";

/** Reads aired episode themes from "=== Episode 3: Theme ===" headings. */
export function parseSeriesThemes(wikitext: string): Record<number, string> {
  const themes: Record<number, string> = {};
  for (const match of wikitext.matchAll(/^=+\s*Episode\s+(\d+)\s*:\s*([^=]+?)\s*=+\s*$/gim)) {
    const theme = match[2].replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, "$1").replace(/'{2,}/g, "").trim();
    if (theme) themes[Number(match[1])] = theme;
  }
  return themes;
}

export async function fetchSeriesThemes(): Promise<Record<number, string>> {
  const response = await fetch(SERIES_THEMES_SOURCE, {
    headers: { "User-Agent": "GBBO Companion League/1.0", Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Could not read the series themes (${response.status}).`);
  const data = (await response.json()) as { parse?: { wikitext?: { "*"?: string } } };
  return parseSeriesThemes(data.parse?.wikitext?.["*"] ?? "");
}

/** Fills blank episode themes only, so a theme the Chief typed is never overwritten. */
export function applySeriesThemes(league: LeagueState, themes: Record<number, string>): number[] {
  const filled: number[] = [];
  for (const episode of league.episodes) {
    const theme = themes[episode.week];
    if (theme && !episode.theme.trim()) {
      episode.theme = theme;
      filled.push(episode.week);
    }
  }
  return filled;
}
