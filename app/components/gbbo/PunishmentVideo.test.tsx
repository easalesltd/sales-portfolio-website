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

  it("defers the media element until the tape is near the viewport when lazy", () => {
    const Original = window.IntersectionObserver;
    window.IntersectionObserver = class {
      readonly root = null;
      readonly rootMargin = "";
      readonly thresholds = [];
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    } as typeof IntersectionObserver;

    const { container } = render(
      <PunishmentVideo src="/api/gbbo-league/video?id=vid_demo" label="Nest · slut drop" lazy />,
    );
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("button")?.textContent).toMatch(/tap to load tape/i);

    window.IntersectionObserver = Original;
  });
});
