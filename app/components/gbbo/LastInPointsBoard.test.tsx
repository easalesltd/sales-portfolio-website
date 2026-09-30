/** @jest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { LastInPointsBoard } from "./LastInPointsBoard";

jest.mock("@/app/lib/gbbo/store", () => {
  const { createEmptyLeague } = require("@/app/lib/gbbo/seed") as typeof import("@/app/lib/gbbo/seed");
  const { bakerIdForName, companionIdForName } = require("@/app/lib/gbbo/identity") as typeof import("@/app/lib/gbbo/identity");
  const league = createEmptyLeague();
  const cake = league.episodes[0];
  cake.published = true;
  cake.eliminatedBakerId = null;
  const biscuits = league.episodes[1];
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

  return {
    useLeague: () => ({ league, loaded: true, acceptLeague: () => undefined }),
  };
});

jest.mock("@/app/lib/gbbo/session", () => ({
  useGbboSession: () => ({
    isChief: false,
    playerSlug: null,
    playerUnlocked: false,
  }),
}));

describe("LastInPointsBoard", () => {
  it("puts the latest week's lowest scorer in a last-in-points banner and lists every week", () => {
    render(<LastInPointsBoard />);

    expect(screen.getByRole("region", { name: "Last in points each week" })).toBeTruthy();
    expect(screen.getByText("Last in points")).toBeTruthy();
    expect(screen.getByText("Who came last")).toBeTruthy();
    expect(screen.getAllByText("Guns").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("-14").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("-17")).toBeTruthy();
    expect(screen.getAllByText(/Week 2 · Biscuits/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Week 1 · Cake/)).toBeTruthy();
    expect(screen.getAllByText("Last").length).toBeGreaterThanOrEqual(2);
  });
});
