/** @jest-environment node */

import { unlink } from "fs/promises";
import { join } from "path";
import { describe, expect, it, jest } from "@jest/globals";

jest.mock("@/app/lib/game-leaderboard-redis", () => ({
  gameLeaderboardRedis: () => null,
}));

import { bakerIdForName } from "@/app/lib/gbbo/identity";
import { scoreEpisodeForBaker, technicalField } from "@/app/lib/gbbo/league";
import { readGbboLeague } from "@/app/lib/gbbo/persist";

const DATA_PATH = join(process.cwd(), "data", "gbbo-league.json");

async function removeLeagueFile() {
  await unlink(DATA_PATH).catch(() => undefined);
}

describe("free from party week results", () => {
  it("publishes week 7 with Mo's handshake and Gary leaving", async () => {
    await removeLeagueFile();
    try {
      const league = await readGbboLeague();
      const episode = league.episodes.find((item) => item.week === 7);
      expect(episode?.published).toBe(true);
      expect(episode?.theme).toBe("Free From Party");
      expect(episode?.starBakerId).toBeNull();
      expect(episode?.eliminatedBakerId).toBe(bakerIdForName("Gary"));
      expect(episode?.handshakes).toEqual([bakerIdForName("Mo")]);
      expect(episode && technicalField(league, episode)).toBe(6);
      expect(league.bakers.find((baker) => baker.name === "Gary")?.eliminatedInWeek).toBe(7);
      expect(league.technicalRecipes.find((recipe) => recipe.week === 7)?.url).toContain("chocolate-axolotl-cake");

      const points = (name: string) =>
        scoreEpisodeForBaker(league, episode!, bakerIdForName(name)).reduce((sum, line) => sum + line.points, 0);

      expect(points("Tom")).toBe(3);
      expect(points("Gabe")).toBe(2);
      expect(points("Moyin")).toBe(1);
      expect(points("Mo")).toBe(4);
      expect(points("Gary")).toBe(-7);
      expect(points("Connie")).toBe(-3);

      const again = await readGbboLeague();
      expect(again.episodes.find((item) => item.week === 7)?.eliminatedBakerId).toBe(bakerIdForName("Gary"));
      expect(again.bakers.find((baker) => baker.name === "Gary")?.eliminatedInWeek).toBe(7);
    } finally {
      await removeLeagueFile();
    }
  });
});
