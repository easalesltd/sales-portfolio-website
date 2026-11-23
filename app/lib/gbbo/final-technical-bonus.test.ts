/** @jest-environment node */

import { describe, expect, it } from "@jest/globals";
import { bakerIdForName, companionIdForName } from "@/app/lib/gbbo/identity";
import {
  FINAL_TECHNICAL_PODIUM_POINTS,
  episodeScoringLines,
  lowestScorersForWeek,
  parseTechnicalPodium,
  scoreCompanionWeek,
  sideSubmissionComplete,
} from "@/app/lib/gbbo/league";
import { createEmptyLeague } from "@/app/lib/gbbo/seed";
import { teamWindow } from "@/app/lib/gbbo/window";
import type { LeagueState } from "@/app/lib/gbbo/types";

function leagueForFinal(result: [string, string, string], picks: Record<string, [string, string, string] | null>): LeagueState {
  const league = createEmptyLeague();
  const episode = league.episodes.find((item) => item.week === 10);
  if (!episode) throw new Error("missing final");
  episode.published = true;
  episode.theme = "Final";
  episode.technical = [
    { bakerId: bakerIdForName(result[0]), place: 1 },
    { bakerId: bakerIdForName(result[1]), place: 2 },
    { bakerId: bakerIdForName(result[2]), place: 3 },
  ];
  league.technicalPodiumPredictions = Object.entries(picks)
    .filter((entry): entry is [string, [string, string, string]] => entry[1] !== null)
    .map(([name, podium]) => ({
      companionId: companionIdForName(name),
      week: 10,
      firstId: bakerIdForName(podium[0]),
      secondId: bakerIdForName(podium[1]),
      thirdId: bakerIdForName(podium[2]),
    }));
  return league;
}

describe("final technical 1-2-3 bonus", () => {
  it("awards 20 for the exact order and nothing for a miss or a blank", () => {
    const league = leagueForFinal(["Mo", "Tom", "Moyin"], {
      Dave: ["Mo", "Tom", "Moyin"],
      Cowie: ["Mo", "Moyin", "Tom"],
      Guns: null,
    });

    const dave = scoreCompanionWeek(league, companionIdForName("Dave"), 10);
    const cowie = scoreCompanionWeek(league, companionIdForName("Cowie"), 10);
    const guns = scoreCompanionWeek(league, companionIdForName("Guns"), 10);

    expect(dave.lines.some((line) => line.points === FINAL_TECHNICAL_PODIUM_POINTS)).toBe(true);
    expect(dave.points).toBe(FINAL_TECHNICAL_PODIUM_POINTS);
    expect(cowie.lines.some((line) => line.label.includes("missed") && line.points === 0)).toBe(true);
    expect(cowie.points).toBe(0);
    expect(guns.lines.some((line) => line.label.includes("No technical") && line.points === 0)).toBe(true);
    expect(guns.points).toBe(0);
  });

  it("does not double the bonus with a leftover joker", () => {
    const league = leagueForFinal(["Mo", "Tom", "Moyin"], { Dave: ["Mo", "Tom", "Moyin"] });
    league.jokers.push({ companionId: companionIdForName("Dave"), week: 10, autoApplied: false });
    const dave = scoreCompanionWeek(league, companionIdForName("Dave"), 10);
    expect(dave.joker).toBe(true);
    expect(dave.points).toBe(FINAL_TECHNICAL_PODIUM_POINTS);
  });

  it("does not score the bonus until the final is published", () => {
    const league = leagueForFinal(["Mo", "Tom", "Moyin"], { Dave: ["Mo", "Tom", "Moyin"] });
    league.episodes.find((item) => item.week === 10)!.published = false;
    expect(scoreCompanionWeek(league, companionIdForName("Dave"), 10).points).toBe(0);
  });

  it("ignores a podium predicted on a non-final week", () => {
    const league = createEmptyLeague();
    league.technicalPodiumPredictions = [{
      companionId: companionIdForName("Dave"),
      week: 9,
      firstId: bakerIdForName("Mo"),
      secondId: bakerIdForName("Tom"),
      thirdId: bakerIdForName("Moyin"),
    }];
    const episode = league.episodes.find((item) => item.week === 9)!;
    episode.published = true;
    episode.technical = [
      { bakerId: bakerIdForName("Mo"), place: 1 },
      { bakerId: bakerIdForName("Tom"), place: 2 },
      { bakerId: bakerIdForName("Moyin"), place: 3 },
    ];
    expect(scoreCompanionWeek(league, companionIdForName("Dave"), 9).points).toBe(0);
  });

  it("counts the bonus when deciding who owes the slut drop", () => {
    const league = leagueForFinal(["Mo", "Tom", "Moyin"], {
      Dave: ["Mo", "Tom", "Moyin"],
      Cowie: ["Tom", "Mo", "Moyin"],
    });
    const last = lowestScorersForWeek(league, 10);
    expect(last.some((row) => row.companionId === companionIdForName("Dave"))).toBe(false);
    expect(last.some((row) => row.companionId === companionIdForName("Cowie"))).toBe(true);
  });

  it("keeps the final pick open until baker and 1-2-3 are both in", () => {
    const league = createEmptyLeague();
    const dave = companionIdForName("Dave");
    expect(sideSubmissionComplete(league, dave, 10)).toBe(false);
    league.sideConfirmations.push({ companionId: dave, week: 10 });
    expect(sideSubmissionComplete(league, dave, 10)).toBe(false);
    league.technicalPodiumPredictions.push({
      companionId: dave,
      week: 10,
      firstId: bakerIdForName("Mo"),
      secondId: bakerIdForName("Tom"),
      thirdId: bakerIdForName("Moyin"),
    });
    expect(sideSubmissionComplete(league, dave, 10)).toBe(true);
    expect(sideSubmissionComplete(league, dave, 9)).toBe(false);
  });

  it("rejects a podium that repeats a baker", () => {
    expect(parseTechnicalPodium({
      firstId: bakerIdForName("Mo"),
      secondId: bakerIdForName("Mo"),
      thirdId: bakerIdForName("Tom"),
    })).toBeNull();
  });

  it("names the bonus on the published ledger", () => {
    const league = leagueForFinal(["Mo", "Tom", "Moyin"], {
      Dave: ["Mo", "Tom", "Moyin"],
      Cowie: ["Tom", "Mo", "Moyin"],
      Guns: null,
    });
    const lines = episodeScoringLines(league, league.episodes.find((item) => item.week === 10)!);
    expect(lines.some((line) => line.includes("Dave") && line.includes("+20"))).toBe(true);
    expect(lines.some((line) => line.includes("Cowie") && line.includes("missed"))).toBe(true);
    expect(lines.some((line) => line.includes("Guns") && line.includes("did not predict"))).toBe(true);
  });

  it("opens the final window with the 8pm Tuesday bonus deadline", () => {
    const gate = teamWindow(new Date("2026-11-23T18:00:00Z"), 10);
    expect(gate.week).toBe(10);
    expect(gate.open).toBe(true);
    expect(gate.summary).toContain("20 bonus points");
    expect(gate.summary).toContain("20:00");
    expect(teamWindow(new Date("2026-11-24T20:01:00Z"), 10).open).toBe(false);
  });
});
