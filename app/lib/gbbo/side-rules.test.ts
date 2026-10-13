/** @jest-environment node */

import { describe, expect, it } from "@jest/globals";
import { bakerIdForName, companionIdForName } from "@/app/lib/gbbo/identity";
import {
  applyShortSideEscalations,
  assignTechnicalPenalties,
  barredBakersForWeek,
  scoreCompanionWeek,
  teamForWeek,
} from "@/app/lib/gbbo/league";
import { createEmptyLeague } from "@/app/lib/gbbo/seed";
import { episodeStartsAt } from "@/app/lib/gbbo/window";
import type { LeagueState } from "@/app/lib/gbbo/types";

const SIDES: Record<string, string[]> = {
  Dave: ["Mo", "Tom", "Gabe"],
  Cowie: ["Mo", "Gary", "Tom"],
  Guns: ["Mo", "Clara", "Tom"],
  Shuker: ["Mo", "Gabe", "Molly"],
  Lee: ["Mo", "Moyin", "Clara"],
  Nest: ["Mo", "Gabe", "Nikki"],
};

function leagueWithSides(): LeagueState {
  const league = createEmptyLeague();
  league.initialTeams = Object.entries(SIDES).map(([name, bakers]) => ({
    companionId: companionIdForName(name),
    bakerIds: bakers.map(bakerIdForName),
  }));
  return league;
}

describe("common baker rule", () => {
  it("bars a baker everyone picked last week, from week 5 and not in the final", () => {
    const league = leagueWithSides();
    expect(barredBakersForWeek(league, 4)).toEqual([]);
    expect(barredBakersForWeek(league, 5)).toEqual([bakerIdForName("Mo")]);
    expect(teamForWeek(league, companionIdForName("Dave"), 5)).toEqual(["Tom", "Gabe"].map(bakerIdForName));
    expect(barredBakersForWeek(league, league.totalWeeks)).toEqual([]);
  });
});

describe("short side rule", () => {
  function leagueAfterTomLeaves() {
    const league = createEmptyLeague();
    league.initialTeams = Object.entries({
      Dave: ["Tom", "Gabe", "Shannon"],
      Cowie: ["Tom", "Gary", "Yannis"],
      Guns: ["Tom", "Clara", "Connie"],
      Shuker: ["Gabe", "Molly", "Mo"],
      Lee: ["Moyin", "Clara", "Mo"],
      Nest: ["Gabe", "Nikki", "Mo"],
    }).map(([name, bakers]) => ({ companionId: companionIdForName(name), bakerIds: bakers.map(bakerIdForName) }));
    const week4 = league.episodes.find((item) => item.week === 4);
    if (!week4) throw new Error("missing week 4");
    week4.published = true;
    week4.eliminatedBakerId = bakerIdForName("Tom");
    league.substitutions.push({
      id: "sub_cowie",
      week: 5,
      companionId: companionIdForName("Cowie"),
      outBakerId: null,
      inBakerId: bakerIdForName("Danni"),
      autoByChief: false,
    });
    return league;
  }

  it("waits for the deadline, then charges only the companions still short", () => {
    const league = leagueAfterTomLeaves();
    const before = new Date(episodeStartsAt(5).getTime() - 60_000);
    const after = new Date(episodeStartsAt(5).getTime() + 60_000);

    expect(applyShortSideEscalations(league, before)).toBe(false);
    expect(applyShortSideEscalations(league, after)).toBe(true);
    expect(applyShortSideEscalations(league, after)).toBe(false);

    const owed = league.penalties.filter((penalty) => penalty.cause === "short_side");
    expect(owed.map((penalty) => penalty.companionId).sort()).toEqual(
      ["Dave", "Guns"].map(companionIdForName).sort(),
    );
    expect(owed.every((penalty) => penalty.kind === "technical" && penalty.week === 5)).toBe(true);
  });

  it("takes 5 points once the week is published and survives the technical reassignment", () => {
    const league = leagueAfterTomLeaves();
    applyShortSideEscalations(league, new Date(episodeStartsAt(5).getTime() + 60_000));
    const week5 = league.episodes.find((item) => item.week === 5);
    if (!week5) throw new Error("missing week 5");
    week5.published = true;
    week5.technical = [{ bakerId: bakerIdForName("Gabe"), place: 10 }];

    const dave = scoreCompanionWeek(league, companionIdForName("Dave"), 5);
    const cowie = scoreCompanionWeek(league, companionIdForName("Cowie"), 5);
    expect(dave.lines.some((line) => line.points === -5 && line.bakerId === null)).toBe(true);
    expect(cowie.lines.some((line) => line.bakerId === null)).toBe(false);

    assignTechnicalPenalties(league, 5);
    expect(league.penalties.filter((penalty) => penalty.cause === "short_side")).toHaveLength(2);
    expect(league.penalties.some((penalty) => penalty.week === 5 && !penalty.cause && penalty.bakerId === bakerIdForName("Gabe"))).toBe(true);
  });
});
