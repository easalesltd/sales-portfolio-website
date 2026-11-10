/** @jest-environment node */

import { spawnSync } from "child_process";
import { mkdtempSync, readFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { compressPunishmentMedia, compressPunishmentPhoto, compressPunishmentVideo } from "./compress-media";

describe("compressPunishmentPhoto", () => {
  it("shrinks a large jpeg", async () => {
    const sharp = require("sharp") as typeof import("sharp");
    const original = await sharp({
      create: {
        width: 2400,
        height: 1800,
        channels: 3,
        background: { r: 180, g: 90, b: 40 },
      },
    })
      .jpeg({ quality: 95 })
      .toBuffer();

    const compressed = await compressPunishmentPhoto(original);
    expect(compressed).not.toBeNull();
    expect(compressed!.mime).toBe("image/jpeg");
    expect(compressed!.bytes.length).toBeLessThan(original.length);
  });
});

describe("compressPunishmentVideo", () => {
  it("re-encodes a bulky mp4 into a smaller file", async () => {
    const ffmpegPath = require("ffmpeg-static") as string | null;
    if (!ffmpegPath) return;

    const dir = mkdtempSync(join(tmpdir(), "gbbo-compress-test-"));
    const input = join(dir, "big.mp4");
    try {
      const made = spawnSync(
        ffmpegPath,
        [
          "-y",
          "-f",
          "lavfi",
          "-i",
          "testsrc=size=1920x1080:rate=30:duration=8",
          "-f",
          "lavfi",
          "-i",
          "sine=frequency=440:duration=8",
          "-c:v",
          "libx264",
          "-pix_fmt",
          "yuv420p",
          "-preset",
          "ultrafast",
          "-crf",
          "0",
          "-c:a",
          "aac",
          "-shortest",
          input,
        ],
        { encoding: "utf8" },
      );
      expect(made.status).toBe(0);

      const original = readFileSync(input);
      expect(original.length).toBeGreaterThan(2 * 1024 * 1024);

      const compressed = await compressPunishmentVideo(original, "video/mp4");
      expect(compressed).not.toBeNull();
      expect(compressed!.mime).toBe("video/mp4");
      expect(compressed!.bytes.length).toBeLessThan(original.length);
      expect(compressed!.bytes.length).toBeGreaterThan(1000);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, 60000);

  it("routes image mimes through compressPunishmentMedia", async () => {
    const sharp = require("sharp") as typeof import("sharp");
    const photo = await sharp({
      create: { width: 1200, height: 900, channels: 3, background: { r: 10, g: 20, b: 30 } },
    })
      .jpeg({ quality: 90 })
      .toBuffer();
    const out = await compressPunishmentMedia(photo, "image/jpeg");
    expect(out?.mime).toBe("image/jpeg");
  });
});
