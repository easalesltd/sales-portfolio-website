/** @jest-environment node */

import { describe, expect, it } from "@jest/globals";
import { correctWeekThemes } from "@/app/lib/gbbo/league";
import { GUESSED_WEEK_THEMES, createEmptyLeague } from "@/app/lib/gbbo/seed";
import { applySeriesThemes, parseSeriesThemes } from "@/app/lib/gbbo/themes";

describe("week themes", () => {
  it("reads aired themes from the series page headings", () => {
    const wikitext = "== Episodes ==\n=== Episode 1: Cake ===\ntext\n===Episode 2: [[Biscuit]]===\n=== Episode 3: Audience Choice ===\n";
    expect(parseSeriesThemes(wikitext)).toEqual({ 1: "Cake", 2: "Biscuit", 3: "Audience Choice" });
  });

  it("fills blank themes without overwriting the Chief's", () => {
    const league = createEmptyLeague();
    league.episodes[2].theme = "People's Choice";
    league.episodes[3].theme = "";
    expect(applySeriesThemes(league, { 3: "Audience Choice", 4: "Desserts" })).toEqual([4]);
    expect(league.episodes[2].theme).toBe("People's Choice");
    expect(league.episodes[3].theme).toBe("Desserts");
  });

  it("corrects week 3 and clears guessed themes from unaired weeks, once", () => {
    const league = createEmptyLeague();
    const guesses = ["Cake", "Biscuits", "Bread", "Desserts", "Pastry", "Botanical", "Caramel", "Pâtisserie", "Semi-final", "Final"];
    league.episodes.forEach((episode, index) => {
      episode.theme = guesses[index];
      episode.published = index < 3;
    });
    league.episodes[2].recapSource = "Chief companion, Bread Week";
    const fixes = { 3: { theme: "People's Choice", from: "Bread Week" } };

    expect(correctWeekThemes(league, "themes", fixes, GUESSED_WEEK_THEMES)).toBe(true);
    expect(league.episodes.map((episode) => episode.theme)).toEqual(
      ["Cake", "Biscuits", "People's Choice", "", "", "", "", "", "Semi-final", "Final"],
    );
    expect(league.episodes[2].recapSource).toBe("Chief companion, People's Choice");
    league.episodes[3].theme = "Desserts";
    expect(correctWeekThemes(league, "themes", fixes, GUESSED_WEEK_THEMES)).toBe(false);
    expect(league.episodes[3].theme).toBe("Desserts");
  });
});
