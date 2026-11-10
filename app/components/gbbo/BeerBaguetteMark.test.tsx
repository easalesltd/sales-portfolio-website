/** @jest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { BeerBaguetteMark } from "./BeerBaguetteMark";

const leeId = "comp_lee";
const nestId = "comp_nest";

jest.mock("@/app/lib/gbbo/store", () => {
  const { createEmptyLeague } = require("@/app/lib/gbbo/seed") as typeof import("@/app/lib/gbbo/seed");
  const { companionIdForName } = require("@/app/lib/gbbo/identity") as typeof import("@/app/lib/gbbo/identity");
  const league = createEmptyLeague();
  league.penalties = [
    {
      id: "pen_lee_bag_1",
      week: 3,
      companionId: companionIdForName("Lee"),
      bakerId: "",
      kind: "beer_baguette",
      deadline: "",
      completed: false,
      videoId: null,
      note: "Lee owes a beer baguette.",
    },
    {
      id: "pen_lee_bag_2",
      week: 5,
      companionId: companionIdForName("Lee"),
      bakerId: "",
      kind: "beer_baguette",
      deadline: "",
      completed: false,
      videoId: null,
      note: "Lee owes another beer baguette.",
    },
    {
      id: "pen_nest_done",
      week: 2,
      companionId: companionIdForName("Nest"),
      bakerId: "",
      kind: "beer_baguette",
      deadline: "",
      completed: true,
      videoId: "vid_done",
      note: "Already filmed.",
    },
  ];
  return {
    useLeague: () => ({ league, loaded: true, acceptLeague: () => undefined, notify: () => undefined }),
  };
});

jest.mock("@/app/lib/gbbo/session", () => ({
  useGbboSession: () => ({
    isChief: false,
    playerSlug: "lee",
    playerUnlocked: true,
  }),
}));

describe("BeerBaguetteMark", () => {
  it("shows an upload button for each outstanding beer baguette", () => {
    render(<BeerBaguetteMark companionId={leeId} />);

    expect(screen.getByText(/Beer baguette owed · week 5/)).toBeTruthy();
    expect(screen.getByText(/Beer baguette owed · week 3/)).toBeTruthy();
    expect(screen.getByRole("button", { name: /Upload week 5 beer baguette/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Upload week 3 beer baguette/i })).toBeTruthy();
  });

  it("hides when no beer baguette is owed", () => {
    const { container } = render(<BeerBaguetteMark companionId={nestId} />);
    expect(container.textContent).toBe("");
  });
});
