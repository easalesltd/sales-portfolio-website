/** @jest-environment jsdom */

import { describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import CrimewatchPage from "./page";

jest.mock("@/app/lib/gbbo/store", () => {
  const { createEmptyLeague } = require("@/app/lib/gbbo/seed") as typeof import("@/app/lib/gbbo/seed");
  const { companionIdForName } = require("@/app/lib/gbbo/identity") as typeof import("@/app/lib/gbbo/identity");
  const league = createEmptyLeague();
  const cowie = companionIdForName("Cowie");
  const guns = companionIdForName("Guns");
  league.slutDrops = [
    { week: 5, companionId: cowie, completed: false, completedAt: null, videoId: null, escalated: false },
    { week: 3, companionId: cowie, completed: false, completedAt: null, videoId: null, escalated: false },
  ];
  league.penalties = [
    { id: "tech-guns", week: 3, companionId: guns, bakerId: "baker_molly", kind: "technical", deadline: "", completed: false, note: "Molly came 10th.", videoId: null },
    { id: "bag-week-1", week: 1, companionId: guns, bakerId: "", kind: "beer_baguette", deadline: "", completed: false, note: "Week one baguette.", videoId: null },
  ];
  return { useLeague: () => ({ league, acceptLeague: jest.fn(), loaded: true }) };
});

jest.mock("@/app/lib/gbbo/session", () => ({
  useGbboSession: () => ({ isChief: false, playerSlug: null, playerUnlocked: false }),
}));

describe("Crimewatch punishment tape", () => {
  it("shows every punishment in week order as one scroll", () => {
    render(<CrimewatchPage />);
    expect(screen.queryAllByRole("tab")).toEqual([]);

    const tape = screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent);
    expect(tape).toEqual([
      "Village Crimewatch",
      "Week 1",
      "Week 3",
      "Week 5",
      "How the tent is scored",
      "Ad hoc rules",
    ]);

    const week3 = screen.getByRole("region", { name: "Week 3" }).textContent ?? "";
    expect(week3.indexOf("Slut drop")).toBeLessThan(week3.indexOf("Technical"));
    expect(week3).toContain("Molly came 10th.");
    expect(screen.getByRole("region", { name: "Week 1" }).textContent).toContain("Week one baguette.");
    expect(screen.getByText("Owes a slut drop photo or video · Week 5")).toBeTruthy();
    expect(screen.getByText(/uses the week's substitution, so no other tactical change is allowed/)).toBeTruthy();
    expect(screen.getByText(/lose 5 points for being lazy/)).toBeTruthy();
    expect(screen.getByText(/lowest-placed baker still bake it as well/)).toBeTruthy();
  });
});
