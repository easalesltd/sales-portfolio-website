/** @jest-environment node */

import { describe, expect, it } from "@jest/globals";
import { bakerIdForName } from "@/app/lib/gbbo/identity";
import { applyEpisodeResult } from "@/app/lib/gbbo/league";
import { createEmptyLeague } from "@/app/lib/gbbo/seed";

describe("applyEpisodeResult", () => {
  it("records and publishes a week once", () => {
    const league = createEmptyLeague();
    const id = bakerIdForName;
    const result = {
      starBakerId: id("Clara"),
      eliminatedBakerId: id("Shannon"),
      technical: [
        { bakerId: id("Gabe"), place: 1 },
        { bakerId: id("Shannon"), place: 12 },
      ],
      handshakes: [id("Moyin")],
      innuendos: [],
      drops: { [id("Moyin")]: 1 },
      cries: { [id("Shannon")]: 1 },
      recapSource: "test",
      justification: "test",
    };

    expect(applyEpisodeResult(league, "week-1-test", 1, result)).toBe(true);
    const episode = league.episodes.find((item) => item.week === 1);
    expect(episode?.published).toBe(true);
    expect(episode?.starBakerId).toBe(id("Clara"));
    expect(league.bakers.find((baker) => baker.id === id("Shannon"))?.eliminatedInWeek).toBe(1);
    expect(league.currentWeek).toBe(2);
    expect(league.penalties.some((penalty) => penalty.kind === "technical" && penalty.bakerId === id("Shannon"))).toBe(true);

    episode!.starBakerId = null;
    expect(applyEpisodeResult(league, "week-1-test", 1, result)).toBe(false);
    expect(episode?.starBakerId).toBeNull();
  });
});
