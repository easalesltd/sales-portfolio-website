import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { gameLeaderboardRedis } from "@/app/lib/game-leaderboard-redis";
import { bakerIdForName, companionIdForName } from "./identity";
import { createEmptyLeague } from "./seed";
import type { LeagueState } from "./types";

const REDIS_KEY = "gbbo:companion-league:2026";
const DATA_PATH = join(process.cwd(), "data", "gbbo-league.json");

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

  for (const companion of league.companions) {
    const next = companionIdForName(companion.name);
    if (companion.id !== next) companionMap.set(companion.id, next);
    companion.id = next;
  }
  for (const baker of league.bakers) {
    const next = bakerIdForName(baker.name);
    if (baker.id !== next) bakerMap.set(baker.id, next);
    baker.id = next;
  }

  const nextRankings: LeagueState["draftRankings"] = {};
  for (const [companionId, bakerIds] of Object.entries(league.draftRankings)) {
    const nextCompanion = rewrite(companionMap, companionId);
    if (nextCompanion) {
      nextRankings[nextCompanion] = bakerIds.map((id) => rewrite(bakerMap, id) ?? id);
    }
  }
  league.draftRankings = nextRankings;

  for (const team of league.initialTeams) {
    team.companionId = rewrite(companionMap, team.companionId) ?? team.companionId;
    team.bakerIds = team.bakerIds.map((id) => rewrite(bakerMap, id) ?? id);
  }
  for (const sub of league.substitutions) {
    sub.companionId = rewrite(companionMap, sub.companionId) ?? sub.companionId;
    sub.outBakerId = rewrite(bakerMap, sub.outBakerId) ?? sub.outBakerId;
    sub.inBakerId = rewrite(bakerMap, sub.inBakerId);
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
  if (redis) {
    const stored = await redis.get<LeagueState>(REDIS_KEY);
    if (isLeague(stored)) return stabilizeLeague(stored);
  }
  const file = await readFromFile();
  return stabilizeLeague(file ?? createEmptyLeague());
}

export async function writeGbboLeague(league: LeagueState): Promise<void> {
  const next = stabilizeLeague(structuredClone(league));
  const redis = gameLeaderboardRedis();
  if (redis) {
    await redis.set(REDIS_KEY, next);
    return;
  }
  await writeToFile(next);
}
