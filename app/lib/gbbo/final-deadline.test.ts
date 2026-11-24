/** @jest-environment node */

import { describe, expect, it } from "@jest/globals";
import { companionIdForName } from "@/app/lib/gbbo/identity";
import {
  applyTechnicalEscalations,
  clearFalseFinalTechnicalBaguettes,
  technicalDeadlineAt,
} from "@/app/lib/gbbo/league";
import { createEmptyLeague } from "@/app/lib/gbbo/seed";
import { episodeStartsAt } from "@/app/lib/gbbo/window";

describe("final technical deadline", () => {
  it("gives the Final a week to bake instead of wrapping to Cake Week", () => {
    const finalDue = technicalDeadlineAt(10);
    const cakeWeek = episodeStartsAt(1);
    const finalStart = episodeStartsAt(10);
    expect(finalDue.getTime()).toBe(finalStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    expect(finalDue.getTime()).not.toBe(cakeWeek.getTime());
  });

  it("does not escalate a fresh Final technical into a beer baguette", () => {
    const league = createEmptyLeague();
    league.penalties.push({
      id: "pen_guns_final_tech",
      week: 10,
      companionId: companionIdForName("Guns"),
      bakerId: "",
      kind: "technical",
      deadline: episodeStartsAt(1).toISOString(),
      completed: false,
      videoId: null,
      note: "Guns must bake this week's technical because nobody had Moyin, so it passes to Mo (2nd).",
    });
    league.penalties.push({
      id: "pen_guns_false_baguette",
      week: 10,
      companionId: companionIdForName("Guns"),
      bakerId: "",
      kind: "beer_baguette",
      deadline: "",
      completed: false,
      videoId: null,
      note: "Guns missed the technical bake before the next episode, so a filmed Beer Baguette is now also owed.",
    });

    expect(clearFalseFinalTechnicalBaguettes(league)).toBe(true);
    expect(league.penalties.some((penalty) => penalty.kind === "beer_baguette")).toBe(false);
    expect(league.penalties.find((penalty) => penalty.id === "pen_guns_final_tech")?.deadline).toBe(
      technicalDeadlineAt(10).toISOString(),
    );
    expect(applyTechnicalEscalations(league, new Date())).toBe(false);
  });
});
