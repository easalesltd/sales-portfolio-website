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
    league.technicalPodiumPredictions = [
      {
        companionId: companionIdForName("Dave"),
        week: 10,
        firstId: bakerIdForName("Mo"),
        secondId: bakerIdForName("Tom"),
        thirdId: bakerIdForName("Moyin"),
      },
      {
        companionId: companionIdForName("Nest"),
        week: 10,
        firstId: bakerIdForName("Tom"),
        secondId: bakerIdForName("Mo"),
        thirdId: bakerIdForName("Moyin"),
      },
    ];

    const model = buildSeasonUnwrapped(league);
    expect(model.ready).toBe(true);
    expect(model.actualPlaces).toEqual(["Mo", "Tom", "Moyin"]);
    expect(model.actualPodium).toContain("Mo");
    const dave = model.podiumRows.find((row) => row.name === "Dave");
    const nest = model.podiumRows.find((row) => row.name === "Nest");
    expect(dave?.hit).toBe(true);
    expect(dave?.guessedPlaces).toEqual(["Mo", "Tom", "Moyin"]);
    expect(nest?.hit).toBe(false);
    expect(nest?.guessedPlaces).toEqual(["Tom", "Mo", "Moyin"]);
    expect(model.podiumHits.map((row) => row.name)).toEqual(["Dave"]);
    expect(model.podiumRows[0]?.name).toBe("Dave");
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

  it("puts slut drops, beer baguettes and technical bakes on each week reel", () => {
    const league = createEmptyLeague();
    const cake = league.episodes.find((item) => item.week === 1)!;
    cake.published = true;
    cake.theme = "Cake";
    league.slutDrops = [
      {
        companionId: companionIdForName("Guns"),
        week: 1,
        completed: true,
        completedAt: "2026-01-01T00:00:00.000Z",
        videoId: "vid_guns_1",
        mediaType: "video",
        escalated: false,
      },
    ];
    league.penalties = [
      {
        id: "pen_tech_cowie_1",
        week: 1,
        companionId: companionIdForName("Cowie"),
        bakerId: bakerIdForName("Danni"),
        kind: "technical",
        deadline: "2026-01-08T00:00:00.000Z",
        completed: true,
        note: "technical bake",
        videoId: "photo_cowie_1",
      },
      {
        id: "pen_beer_shuker_1",
        week: 1,
        companionId: companionIdForName("Shuker"),
        bakerId: bakerIdForName("Danni"),
        kind: "beer_baguette",
        deadline: "2026-01-08T00:00:00.000Z",
        completed: false,
        note: "short side",
        videoId: null,
        cause: "short_side",
      },
    ];

    const week = buildSeasonUnwrapped(league, { preview: true }).weeks.find((item) => item.week === 1);
    expect(week?.crimewatch.map((item) => item.kind).sort()).toEqual([
      "beer_baguette",
      "slut_drop",
      "technical",
    ]);
    expect(week?.crimewatch.some((item) => item.kind === "slut_drop" && item.status === "on tape")).toBe(true);
    expect(week?.crimewatch.some((item) => item.kind === "technical" && item.status === "photo in")).toBe(true);
    expect(week?.crimewatch.some((item) => item.kind === "beer_baguette" && item.status === "owed")).toBe(true);
  });
});
