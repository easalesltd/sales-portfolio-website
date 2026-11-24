/** @jest-environment node */

import { describe, expect, it } from "@jest/globals";
import { bakerIdForName, companionIdForName } from "@/app/lib/gbbo/identity";
import { finalSecretsRevealed, redactFinalSecrets } from "@/app/lib/gbbo/final-secrets";
import { createEmptyLeague } from "@/app/lib/gbbo/seed";
import { buildSeasonUnwrapped, canViewFinalPick } from "@/app/lib/gbbo/season-unwrapped";

describe("final secrets", () => {
  it("stays sealed until the Final episode is published", () => {
    const league = createEmptyLeague();
    expect(finalSecretsRevealed(league)).toBe(false);
    league.episodes.find((item) => item.week === 10)!.published = true;
    expect(finalSecretsRevealed(league)).toBe(true);
  });

  it("redacts other companions' Final baker swaps and 1-2-3 from the public payload", () => {
    const league = createEmptyLeague();
    const dave = companionIdForName("Dave");
    const nest = companionIdForName("Nest");
    league.substitutions.push(
      {
        id: "dave-10",
        week: 10,
        companionId: dave,
        outBakerId: bakerIdForName("Tom"),
        inBakerId: bakerIdForName("Mo"),
        autoByChief: false,
      },
      {
        id: "nest-10",
        week: 10,
        companionId: nest,
        outBakerId: bakerIdForName("Gabe"),
        inBakerId: bakerIdForName("Tom"),
        autoByChief: false,
      },
    );
    league.technicalPodiumPredictions = [
      {
        companionId: dave,
        week: 10,
        firstId: bakerIdForName("Mo"),
        secondId: bakerIdForName("Tom"),
        thirdId: bakerIdForName("Moyin"),
      },
      {
        companionId: nest,
        week: 10,
        firstId: bakerIdForName("Tom"),
        secondId: bakerIdForName("Mo"),
        thirdId: bakerIdForName("Moyin"),
      },
    ];

    const publicLeague = redactFinalSecrets(league, "dave");
    expect(publicLeague.substitutions.filter((item) => item.week === 10).map((item) => item.companionId)).toEqual([dave]);
    expect(publicLeague.technicalPodiumPredictions?.map((item) => item.companionId)).toEqual([dave]);
    expect(canViewFinalPick(league, dave, { isChief: false, playerSlug: "dave" })).toBe(true);
    expect(canViewFinalPick(league, nest, { isChief: false, playerSlug: "dave" })).toBe(false);
    expect(canViewFinalPick(league, nest, { isChief: true, playerSlug: null })).toBe(true);
  });

  it("builds an unwrapped model once the Final is published", () => {
    const league = createEmptyLeague();
    const episode = league.episodes.find((item) => item.week === 10)!;
    episode.published = true;
    episode.theme = "Final";
    episode.technical = [
      { bakerId: bakerIdForName("Mo"), place: 1 },
      { bakerId: bakerIdForName("Tom"), place: 2 },
      { bakerId: bakerIdForName("Moyin"), place: 3 },
    ];
    league.sideConfirmations.push({ companionId: companionIdForName("Dave"), week: 10 });
    league.technicalPodiumPredictions = [{
      companionId: companionIdForName("Dave"),
      week: 10,
      firstId: bakerIdForName("Mo"),
      secondId: bakerIdForName("Tom"),
      thirdId: bakerIdForName("Moyin"),
    }];

    const model = buildSeasonUnwrapped(league);
    expect(model.ready).toBe(true);
    expect(model.actualPodium).toContain("Mo");
    expect(model.podiumRows.some((row) => row.name === "Dave" && row.hit)).toBe(true);
    expect(model.champion).not.toBeNull();
    expect(model.woodenSpoon).not.toBeNull();
  });

  it("lets Spongeify rehearse before the Final is published", () => {
    const league = createEmptyLeague();
    expect(buildSeasonUnwrapped(league).ready).toBe(false);
    const preview = buildSeasonUnwrapped(league, { preview: true });
    expect(preview.ready).toBe(true);
    expect(preview.actualPodium).toBeNull();
    expect(preview.champion).not.toBeNull();
    expect(preview.woodenSpoon).not.toBeNull();
  });
});
