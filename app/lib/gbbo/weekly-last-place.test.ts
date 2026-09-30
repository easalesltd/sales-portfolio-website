/** @jest-environment node */

import { describe, expect, it } from "@jest/globals";
import { bakerIdForName, companionIdForName } from "@/app/lib/gbbo/identity";
import { companionName, scoreCompanionWeek, weeklyLastPlace } from "@/app/lib/gbbo/league";
import { createEmptyLeague } from "@/app/lib/gbbo/seed";
import { companionForm } from "@/app/lib/gbbo/stats";
import type { EpisodeScore, LeagueState } from "@/app/lib/gbbo/types";

function episode(league: LeagueState, week: number): EpisodeScore {
  const row = league.episodes.find((item) => item.week === week);
  if (!row) throw new Error(`missing week ${week}`);
  return row;
}

describe("weeklyLastPlace", () => {
  it("names the unique lowest scorer and skips unpublished weeks", () => {
    const league = createEmptyLeague();
    const cake = episode(league, 1);
    cake.published = true;
    cake.eliminatedBakerId = bakerIdForName("Danni");

    const rows = weeklyLastPlace(league);

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ week: 1, theme: "Cake", points: -5 });
    expect(rows[0].holders.map((score) => companionName(league, score.companionId))).toEqual(["Guns"]);
    expect(weeklyLastPlace({ ...league, episodes: league.episodes.map((item) => ({ ...item, published: false })) })).toEqual([]);
  });

  it("keeps every companion who ties for the fewest points", () => {
    const league = createEmptyLeague();
    const biscuits = episode(league, 2);
    biscuits.published = true;
    biscuits.cries = { [bakerIdForName("Molly")]: 1 };
    const danni = league.bakers.find((baker) => baker.name === "Danni");
    if (danni) danni.eliminatedInWeek = 1;

    const holders = weeklyLastPlace(league)[0]?.holders.map((score) => companionName(league, score.companionId));

    expect(holders).toEqual(["Cowie", "Guns"]);
    expect(weeklyLastPlace(league)[0]?.points).toBe(-3);
  });

  it("doubles a joker's week before deciding who is last", () => {
    const league = createEmptyLeague();
    const cake = episode(league, 1);
    cake.published = true;
    cake.cries = { [bakerIdForName("Molly")]: 1 };
    league.jokers.push({ companionId: companionIdForName("Guns"), week: 1, autoApplied: false });

    const guns = scoreCompanionWeek(league, companionIdForName("Guns"), 1);
    const cowie = scoreCompanionWeek(league, companionIdForName("Cowie"), 1);

    expect(guns.points).toBe(-6);
    expect(cowie.points).toBe(-3);
    expect(weeklyLastPlace(league)[0]?.holders.map((score) => score.companionId)).toEqual([
      companionIdForName("Guns"),
    ]);
  });

  it("puts Guns last in the published Cake and Biscuits weeks", () => {
    const league = createEmptyLeague();
    const cake = episode(league, 1);
    cake.published = true;
    cake.starBakerId = bakerIdForName("Mo");
    cake.technical = [
      { bakerId: bakerIdForName("Tom"), place: 1 },
      { bakerId: bakerIdForName("Gary"), place: 2 },
      { bakerId: bakerIdForName("Gabe"), place: 3 },
      { bakerId: bakerIdForName("Shannon"), place: 10 },
      { bakerId: bakerIdForName("Danni"), place: 11 },
      { bakerId: bakerIdForName("Molly"), place: 12 },
    ];
    cake.innuendos = [bakerIdForName("Tom")];
    cake.drops = { [bakerIdForName("Molly")]: 1, [bakerIdForName("Danni")]: 1 };
    cake.cries = { [bakerIdForName("Molly")]: 1, [bakerIdForName("Danni")]: 1 };

    const biscuits = episode(league, 2);
    biscuits.published = true;
    biscuits.starBakerId = bakerIdForName("Tom");
    biscuits.eliminatedBakerId = bakerIdForName("Danni");
    biscuits.technical = [
      { bakerId: bakerIdForName("Connie"), place: 1 },
      { bakerId: bakerIdForName("Mo"), place: 2 },
      { bakerId: bakerIdForName("Tom"), place: 3 },
      { bakerId: bakerIdForName("Clara"), place: 10 },
      { bakerId: bakerIdForName("Danni"), place: 11 },
      { bakerId: bakerIdForName("Gary"), place: 12 },
    ];
    biscuits.cries = {
      [bakerIdForName("Connie")]: 1,
      [bakerIdForName("Tom")]: 2,
      [bakerIdForName("Danni")]: 1,
      [bakerIdForName("Clara")]: 1,
      [bakerIdForName("Shannon")]: 1,
    };
    const danni = league.bakers.find((baker) => baker.name === "Danni");
    if (danni) danni.eliminatedInWeek = 2;

    league.substitutions = [
      { id: "lee-2", week: 2, companionId: companionIdForName("Lee"), outBakerId: bakerIdForName("Tom"), inBakerId: bakerIdForName("Mo"), autoByChief: false },
      { id: "dave-2", week: 2, companionId: companionIdForName("Dave"), outBakerId: bakerIdForName("Shannon"), inBakerId: bakerIdForName("Gary"), autoByChief: false },
      { id: "nest-2", week: 2, companionId: companionIdForName("Nest"), outBakerId: bakerIdForName("Nikki"), inBakerId: bakerIdForName("Tom"), autoByChief: false },
      { id: "shuker-2", week: 2, companionId: companionIdForName("Shuker"), outBakerId: bakerIdForName("Connie"), inBakerId: bakerIdForName("Gary"), autoByChief: false },
      { id: "cowie-2", week: 2, companionId: companionIdForName("Cowie"), outBakerId: bakerIdForName("Molly"), inBakerId: bakerIdForName("Gary"), autoByChief: false },
    ];

    const table = (week: number) =>
      league.companions
        .map((companion) => ({
          name: companion.name,
          points: scoreCompanionWeek(league, companion.id, week).points,
        }))
        .sort((a, b) => a.points - b.points || a.name.localeCompare(b.name));

    expect(table(1)).toEqual([
      { name: "Guns", points: -17 },
      { name: "Cowie", points: -9 },
      { name: "Nest", points: 3 },
      { name: "Dave", points: 4 },
      { name: "Lee", points: 8 },
      { name: "Shuker", points: 9 },
    ]);
    expect(table(2)).toEqual([
      { name: "Guns", points: -14 },
      { name: "Cowie", points: -7 },
      { name: "Nest", points: -3 },
      { name: "Shuker", points: -3 },
      { name: "Dave", points: -1 },
      { name: "Lee", points: 2 },
    ]);

    expect(weeklyLastPlace(league).map((row) => ({
      week: row.week,
      theme: row.theme,
      points: row.points,
      names: row.holders.map((score) => companionName(league, score.companionId)),
    }))).toEqual([
      { week: 1, theme: "Cake", points: -17, names: ["Guns"] },
      { week: 2, theme: "Biscuits", points: -14, names: ["Guns"] },
    ]);

    const form = companionForm(league);
    expect(form.find((row) => row.name === "Guns")?.weeks.map((week) => week.last)).toEqual([true, true]);
    expect(form.find((row) => row.name === "Lee")?.weeks.every((week) => !week.last)).toBe(true);
  });
});
