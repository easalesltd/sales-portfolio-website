/** @jest-environment node */

import { unlink } from "fs/promises";
import { join } from "path";
import { describe, expect, it, jest } from "@jest/globals";

jest.mock("@/app/lib/game-leaderboard-redis", () => ({
  gameLeaderboardRedis: () => null,
}));

import { bakerIdForName, companionIdForName } from "@/app/lib/gbbo/identity";
import {
  companionsOwningBaker,
  scoreEpisodeForBaker,
  scoreTechnicalPodium,
  technicalField,
  technicalPenaltyTarget,
} from "@/app/lib/gbbo/league";
import { readGbboLeague } from "@/app/lib/gbbo/persist";
import { buildSeasonUnwrapped } from "@/app/lib/gbbo/season-unwrapped";
import type { LeagueState } from "@/app/lib/gbbo/types";

const DATA_PATH = join(process.cwd(), "data", "gbbo-league.json");

async function removeLeagueFile() {
  await unlink(DATA_PATH).catch(() => undefined);
}

function seedFinalPicks(league: LeagueState) {
  league.sideConfirmations = league.companions.map((companion) => ({
    companionId: companion.id,
    week: 10,
  }));
  league.technicalPodiumPredictions = [
    {
      companionId: companionIdForName("Dave"),
      week: 10,
      firstId: bakerIdForName("Mo"),
      secondId: bakerIdForName("Tom"),
      thirdId: bakerIdForName("Moyin"),
    },
    {
      companionId: companionIdForName("Guns"),
      week: 10,
      firstId: bakerIdForName("Tom"),
      secondId: bakerIdForName("Mo"),
      thirdId: bakerIdForName("Moyin"),
    },
    {
      companionId: companionIdForName("Lee"),
      week: 10,
      firstId: bakerIdForName("Tom"),
      secondId: bakerIdForName("Mo"),
      thirdId: bakerIdForName("Moyin"),
    },
  ];
}

describe("final week results", () => {
  it("publishes week 10 with Moyin champion, Tom drop, and technical Tom-Mo-Moyin", async () => {
    await removeLeagueFile();
    try {
      const league = await readGbboLeague();
      seedFinalPicks(league);
      const episode = league.episodes.find((item) => item.week === 10);
      expect(episode?.published).toBe(true);
      expect(episode?.theme).toBe("Final");
      expect(episode?.starBakerId).toBe(bakerIdForName("Moyin"));
      expect(episode?.eliminatedBakerId).toBeNull();
      expect(episode?.drops).toEqual({ [bakerIdForName("Tom")]: 1 });
      expect(episode && technicalField(league, episode)).toBe(3);
      expect(episode?.technical.map((row) => row.bakerId)).toEqual([
        bakerIdForName("Tom"),
        bakerIdForName("Mo"),
        bakerIdForName("Moyin"),
      ]);

      const points = (name: string) =>
        scoreEpisodeForBaker(league, episode!, bakerIdForName(name)).reduce((sum, line) => sum + line.points, 0);

      expect(points("Moyin")).toBe(3);
      expect(points("Mo")).toBe(0);
      expect(points("Tom")).toBe(-1);

      expect(scoreTechnicalPodium(league, companionIdForName("Guns"), 10)?.points).toBe(20);
      expect(scoreTechnicalPodium(league, companionIdForName("Lee"), 10)?.points).toBe(20);
      expect(scoreTechnicalPodium(league, companionIdForName("Dave"), 10)?.points).toBe(0);

      // Moyin finished last; whoever owned the lowest owned baker that week must bake.
      expect(episode?.technical.find((row) => row.place === 3)?.bakerId).toBe(bakerIdForName("Moyin"));
      expect(technicalPenaltyTarget(league, episode!)).not.toBeNull();
      expect(companionsOwningBaker(league, bakerIdForName("Moyin"), 10).length).toBeGreaterThanOrEqual(0);

      const model = buildSeasonUnwrapped(league);
      expect(model.ready).toBe(true);
      expect(model.actualPlaces).toEqual(["Tom", "Mo", "Moyin"]);
      expect(model.podiumHits.map((row) => row.name).sort()).toEqual(["Guns", "Lee"]);

      const again = await readGbboLeague();
      expect(again.episodes.find((item) => item.week === 10)?.starBakerId).toBe(bakerIdForName("Moyin"));
    } finally {
      await removeLeagueFile();
    }
  });
});
