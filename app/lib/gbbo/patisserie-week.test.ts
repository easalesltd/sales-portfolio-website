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

describe("patisserie week results", () => {
  it("publishes week 9 with Mo as Star Baker, Gabe leaving, and stacked Nigella innuendos", async () => {
    await removeLeagueFile();
    try {
      const league = await readGbboLeague();
      const episode = league.episodes.find((item) => item.week === 9);
      expect(episode?.published).toBe(true);
      expect(episode?.theme).toBe("Patisserie");
      expect(episode?.starBakerId).toBe(bakerIdForName("Mo"));
      expect(episode?.eliminatedBakerId).toBe(bakerIdForName("Gabe"));
      expect(episode?.handshakes).toEqual([bakerIdForName("Gabe")]);
      expect(episode?.cries).toEqual({ [bakerIdForName("Tom")]: 1 });
      expect(episode?.innuendos.filter((id) => id === bakerIdForName("Moyin"))).toHaveLength(1);
      expect(episode?.innuendos.filter((id) => id === bakerIdForName("Gabe"))).toHaveLength(3);
      expect(episode && technicalField(league, episode)).toBe(4);
      expect(league.bakers.find((baker) => baker.name === "Gabe")?.eliminatedInWeek).toBe(9);
      expect(league.currentWeek).toBe(10);

      const points = (name: string) =>
        scoreEpisodeForBaker(league, episode!, bakerIdForName(name)).reduce((sum, line) => sum + line.points, 0);

      expect(points("Mo")).toBe(8);
      expect(points("Tom")).toBe(-2);
      expect(points("Gabe")).toBe(14);
      expect(points("Moyin")).toBe(2);

      const again = await readGbboLeague();
      expect(again.episodes.find((item) => item.week === 9)?.eliminatedBakerId).toBe(bakerIdForName("Gabe"));
      expect(again.bakers.find((baker) => baker.name === "Gabe")?.eliminatedInWeek).toBe(9);
    } finally {
      await removeLeagueFile();
    }
  });
});
