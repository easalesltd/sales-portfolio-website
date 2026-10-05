/** @jest-environment node */

import { describe, expect, it } from "@jest/globals";
import { bakerIdForName, companionIdForName } from "@/app/lib/gbbo/identity";
import { resetWeekSidesAndJokers } from "@/app/lib/gbbo/league";
import { createEmptyLeague } from "@/app/lib/gbbo/seed";

describe("resetWeekSidesAndJokers", () => {
  it("clears one week's picks and every joker exactly once", () => {
    const league = createEmptyLeague();
    const lee = companionIdForName("Lee");
    const dave = companionIdForName("Dave");
    league.substitutions = [
      { id: "lee-2", week: 2, companionId: lee, outBakerId: bakerIdForName("Tom"), inBakerId: bakerIdForName("Mo"), autoByChief: false },
      { id: "dave-3", week: 3, companionId: dave, outBakerId: bakerIdForName("Gary"), inBakerId: bakerIdForName("Tom"), autoByChief: false },
      { id: "auto-3", week: 3, companionId: lee, outBakerId: bakerIdForName("Mo"), inBakerId: null, autoByChief: true },
    ];
    league.sideConfirmations = [
      { companionId: lee, week: 2 },
      { companionId: dave, week: 3 },
    ];
    league.jokers = [{ companionId: lee, week: 3, autoApplied: false }];

    expect(resetWeekSidesAndJokers(league, "test-reset", 3)).toBe(true);
    expect(league.substitutions.map((sub) => sub.id)).toEqual(["lee-2", "auto-3"]);
    expect(league.sideConfirmations).toEqual([{ companionId: lee, week: 2 }]);
    expect(league.jokers).toEqual([]);

    league.jokers.push({ companionId: dave, week: 3, autoApplied: false });
    league.sideConfirmations.push({ companionId: dave, week: 3 });
    expect(resetWeekSidesAndJokers(league, "test-reset", 3)).toBe(false);
    expect(league.jokers).toHaveLength(1);
    expect(league.sideConfirmations).toHaveLength(2);
  });
});
