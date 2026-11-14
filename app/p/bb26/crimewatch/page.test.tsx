/** @jest-environment jsdom */

import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import CrimewatchPage from "./page";

jest.mock("@/app/lib/gbbo/store", () => {
  const { createEmptyLeague } = require("@/app/lib/gbbo/seed") as typeof import("@/app/lib/gbbo/seed");
  const { companionIdForName } = require("@/app/lib/gbbo/identity") as typeof import("@/app/lib/gbbo/identity");
  const league = createEmptyLeague();
  const cowie = companionIdForName("Cowie");
  const guns = companionIdForName("Guns");
  const nest = companionIdForName("Nest");
  league.slutDrops = [
    { week: 5, companionId: cowie, completed: false, completedAt: null, videoId: null, escalated: false },
    { week: 3, companionId: cowie, completed: false, completedAt: null, videoId: null, escalated: false },
  ];
  league.penalties = [
    { id: "tech-guns", week: 3, companionId: guns, bakerId: "baker_molly", kind: "technical", deadline: "", completed: false, note: "Molly came 10th.", videoId: null },
    { id: "bag-week-1", week: 1, companionId: guns, bakerId: "", kind: "beer_baguette", deadline: "", completed: false, note: "Week one baguette.", videoId: null },
    {
      id: "pen_false_accusation_nest",
      week: 6,
      companionId: nest,
      bakerId: "",
      kind: "beer_baguette",
      deadline: "",
      completed: true,
      note: "Nest made a false accusation that the website was not working.",
      videoId: "vid_nest_baguette",
    },
    // Newer non-baguette tapes must not push Nest out of the fresh jump list.
    ...Array.from({ length: 8 }, (_, index) => ({
      id: `tech-fill-${index}`,
      week: 7 + (index % 2),
      companionId: guns,
      bakerId: "baker_molly",
      kind: "technical" as const,
      deadline: "",
      completed: true,
      note: `Filler bake ${index}.`,
      videoId: `vid_fill_${index}`,
    })),
  ];
  return { useLeague: () => ({ league, acceptLeague: jest.fn(), loaded: true }) };
});

jest.mock("@/app/lib/gbbo/session", () => ({
  useGbboSession: () => ({ isChief: false, playerSlug: null, playerUnlocked: false }),
}));

describe("Crimewatch punishment tape", () => {
  it("shows every punishment newest week first, with Nest on the fresh tape", () => {
    render(<CrimewatchPage />);

    const tape = screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent);
    expect(tape[0]).toBe("Village Crimewatch");
    expect(tape[1]).toBe("Just on the tape");
    expect(tape).toContain("Beer baguettes wanted");
    expect(tape).toContain("Week 6");
    expect(tape).toContain("Week 5");
    expect(tape).toContain("Week 3");
    expect(tape).toContain("Week 1");

    const fresh = screen.getByRole("heading", { name: "Just on the tape" }).closest("section");
    expect(fresh).toBeTruthy();
    const freshLinks = Array.from(fresh!.querySelectorAll("a")).map((link) => link.textContent ?? "");
    expect(freshLinks[0]).toMatch(/Nest/);
    expect(freshLinks[0]).toMatch(/Beer baguette/);
    expect(screen.getByRole("link", { name: /Nest.*Week 6.*Beer baguette/i }).getAttribute("href")).toBe(
      "#exhibit-pen_false_accusation_nest",
    );
    expect(screen.getByRole("region", { name: "Week 6" }).textContent).toContain("false accusation");

    const week3 = screen.getByRole("region", { name: "Week 3" }).textContent ?? "";
    expect(week3.indexOf("Slut drop")).toBeLessThan(week3.indexOf("Technical"));
    expect(week3).toContain("Molly came 10th.");
    expect(screen.getByRole("region", { name: "Week 1" }).textContent).toContain("Week one baguette.");
    expect(screen.getByText("Owes a slut drop photo or video · Week 5")).toBeTruthy();
    expect(screen.getByText(/uses the week's substitution, so no other tactical change is allowed/)).toBeTruthy();
    expect(screen.getByText(/lose 5 points for being lazy/)).toBeTruthy();
    expect(screen.getByText(/lowest-placed baker still bake it as well/)).toBeTruthy();
  });

  it("filters the tape to beer baguettes", () => {
    render(<CrimewatchPage />);

    fireEvent.click(screen.getByRole("tab", { name: /Beer baguettes/i }));
    expect(screen.queryByRole("region", { name: "Week 5" })).toBeNull();
    expect(screen.getByRole("region", { name: "Week 6" }).textContent).toContain("Nest");
    expect(screen.getByRole("region", { name: "Week 1" }).textContent).toContain("Week one baguette.");
  });
});
