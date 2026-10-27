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

describe("pastry week results", () => {
  it("publishes week 6 with Tom star baker, a handshake, and Clara leaving", async () => {
    await removeLeagueFile();
    try {
      const league = await readGbboLeague();
      const episode = league.episodes.find((item) => item.week === 6);
      expect(episode?.published).toBe(true);
      expect(episode?.theme).toBe("Pastry");
      expect(episode?.starBakerId).toBe(bakerIdForName("Tom"));
      expect(episode?.eliminatedBakerId).toBe(bakerIdForName("Clara"));
      expect(episode?.handshakes).toEqual([bakerIdForName("Tom")]);
      expect(episode && technicalField(league, episode)).toBe(7);
      expect(league.bakers.find((baker) => baker.name === "Clara")?.eliminatedInWeek).toBe(6);

      const points = (name: string) =>
        scoreEpisodeForBaker(league, episode!, bakerIdForName(name)).reduce((sum, line) => sum + line.points, 0);

      expect(points("Moyin")).toBe(3);
      expect(points("Tom")).toBe(12);
      expect(points("Gabe")).toBe(1);
      expect(points("Gary")).toBe(0);
      expect(points("Mo")).toBe(-1);
      expect(points("Connie")).toBe(-2);
      expect(points("Clara")).toBe(-8);

      const again = await readGbboLeague();
      const replay = again.episodes.find((item) => item.week === 6);
      expect(replay?.starBakerId).toBe(bakerIdForName("Tom"));
      expect(replay?.eliminatedBakerId).toBe(bakerIdForName("Clara"));
      expect(again.bakers.find((baker) => baker.name === "Clara")?.eliminatedInWeek).toBe(6);
    } finally {
      await removeLeagueFile();
    }
  });
});
