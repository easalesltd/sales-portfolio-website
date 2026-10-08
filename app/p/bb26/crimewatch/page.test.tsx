/** @jest-environment jsdom */

import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import CrimewatchPage from "./page";

jest.mock("@/app/lib/gbbo/store", () => {
  const { createEmptyLeague } = require("@/app/lib/gbbo/seed") as typeof import("@/app/lib/gbbo/seed");
  const { companionIdForName } = require("@/app/lib/gbbo/identity") as typeof import("@/app/lib/gbbo/identity");
  const league = createEmptyLeague();
  league.slutDrops = [{ week: 3, companionId: companionIdForName("Cowie"), completed: false, completedAt: null, videoId: null, escalated: false }];
  league.penalties = [
    { id: "tech-guns", week: 3, companionId: companionIdForName("Guns"), bakerId: "baker_molly", kind: "technical", deadline: "", completed: false, note: "Molly came 10th.", videoId: null },
  ];
  return { useLeague: () => ({ league, acceptLeague: jest.fn(), loaded: true }) };
});

jest.mock("@/app/lib/gbbo/session", () => ({
  useGbboSession: () => ({ isChief: false, playerSlug: null, playerUnlocked: false }),
}));

describe("Crimewatch punishment buttons", () => {
  it("shows one punishment at a time, starting with slut drops", () => {
    render(<CrimewatchPage />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((tab) => tab.textContent)).toEqual(["Slut drops1 owed", "Technicals1 owed", "Beer baguettes"]);
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    expect(screen.queryByText("Wanted")).not.toBeNull();
    expect(screen.queryByText("Technical challenges")).toBeNull();

    fireEvent.click(tabs[1]);
    expect(screen.queryByText("Technical challenges")).not.toBeNull();
    expect(screen.queryByText(/Molly came 10th/)).not.toBeNull();
    expect(screen.queryByText("Wanted")).toBeNull();

    fireEvent.click(tabs[2]);
    expect(screen.queryByText("No beer baguettes owed")).not.toBeNull();
  });
});
