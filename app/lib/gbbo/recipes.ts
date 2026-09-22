import type { LeagueState, TechnicalCatalogueEntry } from "./types";
import { episodeDoneAt } from "./window";

export const OFFICIAL_TECHNICAL_INDEX =
  "https://thegreatbritishbakeoff.co.uk/recipes/collection/technical-bakes/";

export type OfficialRecipe = {
  title: string;
  url: string;
};

function decode(text: string): string {
  return text
    .replace(/&#8217;/g, "’")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseOfficialTechnicalListing(html: string): OfficialRecipe[] {
  const recipes: OfficialRecipe[] = [];
  const seen = new Set<string>();
  const pattern =
    /class="recipes-loop__item[\s\S]*?href="((?:https:\/\/thegreatbritishbakeoff\.co\.uk)?\/recipes\/all\/[^"]+)"[\s\S]*?<h5>([\s\S]*?)<\/h5>/gi;

  for (const match of html.matchAll(pattern)) {
    const rawUrl = match[1].startsWith("http")
      ? match[1]
      : `https://thegreatbritishbakeoff.co.uk${match[1]}`;
    const url = rawUrl.split("?")[0].replace(/\/$/, "") + "/";
    const title = decode(match[2].replace(/<[^>]+>/g, ""));
    if (!title || seen.has(url)) continue;
    seen.add(url);
    recipes.push({ title, url });
  }

  return recipes;
}

export async function fetchOfficialTechnicals(): Promise<OfficialRecipe[]> {
  const response = await fetch(OFFICIAL_TECHNICAL_INDEX, {
    headers: {
      "User-Agent": "GBBO Companion League/1.0",
      Accept: "text/html",
    },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Could not read the official recipe list (${response.status}).`);
  }
  return parseOfficialTechnicalListing(await response.text());
}

export function applyTechnicalListing(
  league: LeagueState,
  listing: OfficialRecipe[],
  now = new Date(),
): { seeded: boolean; assignedWeeks: number[] } {
  if (!Array.isArray(league.technicalCatalogue)) league.technicalCatalogue = [];
  if (!Array.isArray(league.technicalRecipes)) league.technicalRecipes = [];

  const known = new Set(league.technicalCatalogue.map((item) => item.url));
  const newcomers = listing.filter((recipe) => !known.has(recipe.url));
  const stamp = now.toISOString();

  if (league.technicalCatalogue.length === 0) {
    league.technicalCatalogue = listing.map((recipe) => ({
      title: recipe.title,
      url: recipe.url,
      firstSeen: stamp,
    }));
    return { seeded: true, assignedWeeks: [] };
  }

  for (const recipe of newcomers) {
    const row: TechnicalCatalogueEntry = { title: recipe.title, url: recipe.url, firstSeen: stamp };
    league.technicalCatalogue.unshift(row);
  }

  const taken = new Set(league.technicalRecipes.map((item) => item.week));
  const assignedUrls = new Set(league.technicalRecipes.map((item) => item.url));
  const weeksNeeding = Array.from({ length: league.totalWeeks }, (_, index) => index + 1).filter(
    (week) => !taken.has(week) && now >= episodeDoneAt(week),
  );
  const seedStamp = [...league.technicalCatalogue].sort((a, b) => a.firstSeen.localeCompare(b.firstSeen))[0]?.firstSeen;
  const pending = league.technicalCatalogue.filter((item) => {
    if (assignedUrls.has(item.url)) return false;
    if (newcomers.some((recipe) => recipe.url === item.url)) return true;
    return Boolean(seedStamp && item.firstSeen !== seedStamp);
  });

  const assignedWeeks: number[] = [];
  for (const recipe of pending) {
    const week = weeksNeeding.shift();
    if (!week) break;
    league.technicalRecipes.push({
      week,
      title: decode(recipe.title),
      url: recipe.url,
      fetchedAt: stamp,
    });
    assignedUrls.add(recipe.url);
    assignedWeeks.push(week);
  }

  league.technicalRecipes.sort((a, b) => a.week - b.week);
  return { seeded: false, assignedWeeks };
}

export function pinTechnicalRecipe(league: LeagueState, week: number, recipe: OfficialRecipe, now = new Date()) {
  league.technicalRecipes = (league.technicalRecipes ?? []).filter((item) => item.week !== week);
  league.technicalRecipes.push({
    week,
    title: decode(recipe.title),
    url: recipe.url,
    fetchedAt: now.toISOString(),
  });
  league.technicalRecipes.sort((a, b) => a.week - b.week);
  if (!(league.technicalCatalogue ?? []).some((item) => item.url === recipe.url)) {
    league.technicalCatalogue = [
      { title: recipe.title, url: recipe.url, firstSeen: now.toISOString() },
      ...(league.technicalCatalogue ?? []),
    ];
  }
}
