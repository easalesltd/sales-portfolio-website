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

describe("caramel week results", () => {
  it("publishes week 8 with Moyin as Star Baker and Connie leaving", async () => {
    await removeLeagueFile();
    try {
      const league = await readGbboLeague();
      const episode = league.episodes.find((item) => item.week === 8);
      expect(episode?.published).toBe(true);
      expect(episode?.theme).toBe("Caramel");
      expect(episode?.starBakerId).toBe(bakerIdForName("Moyin"));
      expect(episode?.eliminatedBakerId).toBe(bakerIdForName("Connie"));
      expect(episode?.drops).toEqual({ [bakerIdForName("Connie")]: 1 });
      expect(episode?.cries).toEqual({ [bakerIdForName("Moyin")]: 2 });
      expect(episode && technicalField(league, episode)).toBe(5);
      expect(league.bakers.find((baker) => baker.name === "Connie")?.eliminatedInWeek).toBe(8);
      expect(league.currentWeek).toBe(9);

      const points = (name: string) =>
        scoreEpisodeForBaker(league, episode!, bakerIdForName(name)).reduce((sum, line) => sum + line.points, 0);

      expect(points("Tom")).toBe(3);
      expect(points("Moyin")).toBe(1);
      expect(points("Gabe")).toBe(0);
      expect(points("Connie")).toBe(-10);
      expect(points("Mo")).toBe(-3);

      const again = await readGbboLeague();
      expect(again.episodes.find((item) => item.week === 8)?.starBakerId).toBe(bakerIdForName("Moyin"));
      expect(again.bakers.find((baker) => baker.name === "Connie")?.eliminatedInWeek).toBe(8);
    } finally {
      await removeLeagueFile();
    }
  });
});
