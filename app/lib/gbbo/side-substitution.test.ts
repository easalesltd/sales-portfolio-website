/** @jest-environment node */

import { describe, expect, it } from "@jest/globals";
import { sideSubstitution, teamForWeek } from "@/app/lib/gbbo/league";
import { createEmptyLeague } from "@/app/lib/gbbo/seed";

describe("sideSubstitution", () => {
  it("fills a sent-home baker's slot without dropping anyone else", () => {
    const league = createEmptyLeague();
    const companion = league.companions[0];
    const [gone, keepA, keepB, newcomer] = league.bakers.map((baker) => baker.id);
    league.initialTeams = [{ companionId: companion.id, bakerIds: [gone, keepA, keepB] }];
    league.bakers.find((baker) => baker.id === gone)!.eliminatedInWeek = 1;

    const swap = sideSubstitution([keepA, keepB], [keepA, keepB, newcomer]);
    expect(swap).toEqual({ outBakerId: null, inBakerId: newcomer });
    league.substitutions.push({ id: "sub", week: 2, companionId: companion.id, ...swap!, autoByChief: false });

    expect(teamForWeek(league, companion.id, 2).sort()).toEqual([keepA, keepB, newcomer].sort());
  });

  it("records a normal one-for-one swap", () => {
    expect(sideSubstitution(["a", "b", "c"], ["a", "b", "d"])).toEqual({ outBakerId: "c", inBakerId: "d" });
    expect(sideSubstitution(["a", "b", "c"], ["a", "b", "c"])).toBeNull();
  });
});
