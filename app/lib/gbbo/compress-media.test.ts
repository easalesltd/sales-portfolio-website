/** @jest-environment node */

import { compressPunishmentPhoto } from "./compress-media";

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
