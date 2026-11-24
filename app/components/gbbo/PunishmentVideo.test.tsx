/** @jest-environment jsdom */

import { render } from "@testing-library/react";
import { PunishmentVideo } from "./PunishmentVideo";

describe("PunishmentVideo", () => {
  it("requests a first-frame preview so the player is not a blank slab", () => {
    const { container } = render(
      <PunishmentVideo src="/api/gbbo-league/video?id=vid_demo" label="Lee · slut drop" />,
    );
    const video = container.querySelector("video");
    expect(video).toBeTruthy();
    expect(video?.getAttribute("src")).toBe("/api/gbbo-league/video?id=vid_demo#t=0.001");
    expect(video?.getAttribute("preload")).toBe("metadata");
  });
});
