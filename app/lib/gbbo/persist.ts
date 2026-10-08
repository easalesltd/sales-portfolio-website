import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { gameLeaderboardRedis } from "@/app/lib/game-leaderboard-redis";
import { bakerIdForName, companionIdForName, gbboSlug } from "./identity";
import {
  applyEpisodeResult,
  applySlutDropEscalations,
  applyTechnicalEscalations,
  assignTechnicalPenalties,
  ensureDemocracyBaguette,
  correctWeekThemes,
  resetVideolessSlutDrops,
  restoreDroppedBaker,
  resetWeekSidesAndJokers,
} from "./league";
import { GUESSED_WEEK_THEMES, SERIES_17_BAKERS, createCompanions, createEmptyLeague } from "./seed";
import type { LeagueState } from "./types";
import type { EpisodeResult } from "./league";

const REDIS_KEY = "gbbo:companion-league:2026";
const DATA_PATH = join(process.cwd(), "data", "gbbo-league.json");
const WEEK_3_SIDES_AND_JOKERS_RESET = { key: "2026-week-3-sides-and-jokers", week: 3 };
const LEE_WEEK_3_RESET = { key: "2026-week-3-lee-side-and-joker", week: 3, companion: "Lee" };
const WEEK_3_RESULT_KEY = "2026-week-3-bread-results";
const WEEK_3_TECHNICAL_FALLBACK_KEY = "2026-week-3-technical-fallback";
const GUNS_WEEK_3_CLARA_KEY = "2026-week-3-guns-clara-restored";
const REAL_WEEK_THEMES_KEY = "2026-real-week-themes";

function week3Result(): EpisodeResult {
  const id = bakerIdForName;
  return {
    starBakerId: id("Clara"),
    eliminatedBakerId: id("Shannon"),
    technical: [
      { bakerId: id("Gabe"), place: 1 },
      { bakerId: id("Mo"), place: 2 },
      { bakerId: id("Clara"), place: 3 },
      { bakerId: id("Yannis"), place: 9 },
      { bakerId: id("Molly"), place: 10 },
      { bakerId: id("Shannon"), place: 11 },
    ],
    handshakes: [id("Moyin")],
    innuendos: [],
    drops: { [id("Moyin")]: 1 },
    cries: { [id("Shannon")]: 1 },
    recapSource: "Chief companion, People's Choice",
    justification:
      "Clara was Star Baker. Shannon went home. In the technical Gabe was first, Mo second and Clara third. Shannon finished last (−3), Molly second last (−2) and Yannis third last (−1). Moyin received a Hollywood handshake (+5) but dropped something on the floor (−3). Shannon had a little cry (−3).",
  };
}

export function isLeague(value: unknown): value is LeagueState {
  return Boolean(value && typeof value === "object" && Array.isArray((value as LeagueState).companions));
}

function rewrite(map: Map<string, string>, id: string | null | undefined): string | null {
  if (!id) return id ?? null;
  return map.get(id) ?? id;
}

export function stabilizeLeague(league: LeagueState): LeagueState {
  const companionMap = new Map<string, string>();
  const bakerMap = new Map<string, string>();

  const seededCompanions = createCompanions();
  for (const companion of league.companions) {
    const next = companionIdForName(companion.name);
    if (companion.id !== next) companionMap.set(companion.id, next);
    companion.id = next;
    const seed = seededCompanions.find((item) => gbboSlug(item.name) === gbboSlug(companion.name));
    companion.photo = seed?.photo || companion.photo || "";
    companion.disgracePhoto = seed?.disgracePhoto || companion.disgracePhoto || "";
  }
  for (const baker of league.bakers) {
    const next = bakerIdForName(baker.name);
    if (baker.id !== next) bakerMap.set(baker.id, next);
    baker.id = next;
    const seed = SERIES_17_BAKERS.find((item) => gbboSlug(item.name) === gbboSlug(baker.name));
    if (seed) {
      baker.bio = seed.bio;
      baker.age = seed.age;
      baker.hometown = seed.hometown;
      baker.job = seed.job;
      baker.photo = seed.photo;
    } else {
      baker.hometown ??= "";
      baker.job ??= "";
      baker.photo ??= "";
    }
  }

  const nextRankings: LeagueState["draftRankings"] = {};
  for (const [companionId, bakerIds] of Object.entries(league.draftRankings)) {
    const nextCompanion = rewrite(companionMap, companionId);
    if (nextCompanion) {
      nextRankings[nextCompanion] = bakerIds.map((id) => rewrite(bakerMap, id) ?? id);
    }
  }
  league.draftRankings = nextRankings;

  if (!Array.isArray(league.sideConfirmations)) league.sideConfirmations = [];
  if (!Array.isArray(league.slutDrops)) league.slutDrops = [];
  if (!Array.isArray(league.technicalRecipes)) league.technicalRecipes = [];
  if (!Array.isArray(league.technicalCatalogue)) league.technicalCatalogue = [];
  for (const recipe of league.technicalRecipes) {
    recipe.photo ??= "";
  }

  for (const team of league.initialTeams) {
    team.companionId = rewrite(companionMap, team.companionId) ?? team.companionId;
    team.bakerIds = team.bakerIds.map((id) => rewrite(bakerMap, id) ?? id);
  }
  for (const sub of league.substitutions) {
    sub.companionId = rewrite(companionMap, sub.companionId) ?? sub.companionId;
    sub.outBakerId = rewrite(bakerMap, sub.outBakerId) ?? sub.outBakerId;
    sub.inBakerId = rewrite(bakerMap, sub.inBakerId);
  }
  for (const confirmation of league.sideConfirmations) {
    confirmation.companionId = rewrite(companionMap, confirmation.companionId) ?? confirmation.companionId;
  }
  for (const joker of league.jokers) {
    joker.companionId = rewrite(companionMap, joker.companionId) ?? joker.companionId;
  }
  for (const episode of league.episodes) {
    episode.starBakerId = rewrite(bakerMap, episode.starBakerId);
    episode.eliminatedBakerId = rewrite(bakerMap, episode.eliminatedBakerId);
    episode.handshakes = episode.handshakes.map((id) => rewrite(bakerMap, id) ?? id);
    episode.innuendos = episode.innuendos.map((id) => rewrite(bakerMap, id) ?? id);
    episode.technical = episode.technical.map((entry) => ({
      ...entry,
      bakerId: rewrite(bakerMap, entry.bakerId) ?? entry.bakerId,
    }));
    const drops: Record<string, number> = {};
    for (const [id, count] of Object.entries(episode.drops)) {
      drops[rewrite(bakerMap, id) ?? id] = count;
    }
    episode.drops = drops;
    const cries: Record<string, number> = {};
    for (const [id, count] of Object.entries(episode.cries)) {
      cries[rewrite(bakerMap, id) ?? id] = count;
    }
    episode.cries = cries;
    episode.adHoc = episode.adHoc.map((award) => ({
      ...award,
      bakerId: rewrite(bakerMap, award.bakerId) ?? award.bakerId,
    }));
    episode.justification ??= "";
  }
  for (const rule of league.adHocRules) {
    const votes: typeof rule.votes = {};
    for (const [id, vote] of Object.entries(rule.votes)) {
      votes[rewrite(companionMap, id) ?? id] = vote;
    }
    rule.votes = votes;
  }
  for (const penalty of league.penalties) {
    penalty.companionId = rewrite(companionMap, penalty.companionId) ?? penalty.companionId;
    penalty.bakerId = rewrite(bakerMap, penalty.bakerId) ?? penalty.bakerId;
    penalty.videoId ??= null;
    if (penalty.kind === "technical" && penalty.completed && !penalty.videoId) {
      penalty.completed = false;
    }
  }
  for (const drop of league.slutDrops) {
    drop.companionId = rewrite(companionMap, drop.companionId) ?? drop.companionId;
    drop.completed ??= false;
    drop.completedAt ??= null;
    drop.videoId ??= null;
    drop.escalated ??= false;
  }

  return league;
}

async function readFromFile(): Promise<LeagueState | null> {
  if (!existsSync(DATA_PATH)) return null;
  const raw = await readFile(DATA_PATH, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  return isLeague(parsed) ? parsed : null;
}

async function writeToFile(league: LeagueState) {
  await mkdir(dirname(DATA_PATH), { recursive: true });
  await writeFile(DATA_PATH, JSON.stringify(league, null, 2));
}

export async function readGbboLeague(): Promise<LeagueState> {
  const redis = gameLeaderboardRedis();
  let league: LeagueState;
  if (redis) {
    const stored = await redis.get<LeagueState>(REDIS_KEY);
    league = stabilizeLeague(isLeague(stored) ? stored : createEmptyLeague());
  } else {
    const file = await readFromFile();
    league = stabilizeLeague(file ?? createEmptyLeague());
  }
  const sidesReset = resetWeekSidesAndJokers(league, WEEK_3_SIDES_AND_JOKERS_RESET.key, WEEK_3_SIDES_AND_JOKERS_RESET.week);
  const leeReset = resetWeekSidesAndJokers(
    league,
    LEE_WEEK_3_RESET.key,
    LEE_WEEK_3_RESET.week,
    companionIdForName(LEE_WEEK_3_RESET.companion),
  );
  const week3Published = applyEpisodeResult(league, WEEK_3_RESULT_KEY, 3, week3Result());
  league.resetsApplied = league.resetsApplied ?? [];
  const week3Technical =
    !league.resetsApplied.includes(WEEK_3_TECHNICAL_FALLBACK_KEY) &&
    Boolean(league.episodes.find((item) => item.week === 3)?.published);
  if (week3Technical) {
    assignTechnicalPenalties(league, 3);
    league.resetsApplied.push(WEEK_3_TECHNICAL_FALLBACK_KEY);
  }
  const gunsRestored = restoreDroppedBaker(league, GUNS_WEEK_3_CLARA_KEY, companionIdForName("Guns"), 3, bakerIdForName("Clara"));
  const themesFixed = correctWeekThemes(
    league,
    REAL_WEEK_THEMES_KEY,
    { 3: { theme: "People's Choice", from: "Bread Week" } },
    GUESSED_WEEK_THEMES,
  );
  const reset = resetVideolessSlutDrops(league);
  const slutEscalated = applySlutDropEscalations(league);
  const bakeEscalated = applyTechnicalEscalations(league);
  const democracy = ensureDemocracyBaguette(league);
  if (sidesReset || leeReset || week3Published || week3Technical || gunsRestored || themesFixed || reset || slutEscalated || bakeEscalated || democracy) {
    await writeGbboLeague(league);
  }
  return league;
}

export async function writeGbboLeague(league: LeagueState): Promise<void> {
  const next = stabilizeLeague(structuredClone(league));
  resetVideolessSlutDrops(next);
  applySlutDropEscalations(next);
  applyTechnicalEscalations(next);
  ensureDemocracyBaguette(next);
  const redis = gameLeaderboardRedis();
  if (redis) {
    await redis.set(REDIS_KEY, next);
    return;
  }
  await writeToFile(next);
}
