/** @jest-environment node */

import { mkdtempSync, mkdirSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { beforeAll, describe, expect, it, jest } from "@jest/globals";

const dir = mkdtempSync(join(tmpdir(), "gbbo-videos-"));
jest.spyOn(process, "cwd").mockReturnValue(dir);
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.KV_REST_API_URL;

type Videos = typeof import("./videos");
type Route = typeof import("@/app/api/gbbo-league/video/route");
let videos: Videos;
let route: Route;

beforeAll(async () => {
  videos = await import("./videos");
  route = await import("@/app/api/gbbo-league/video/route");
});

function bytes(length: number, seed: number) {
  return Buffer.from(Array.from({ length }, (_, i) => (i * 31 + seed) % 251));
}

async function upload(id: string, file: Buffer) {
  const size = videos.VIDEO_CHUNK_BYTES;
  const total = Math.ceil(file.length / size);
  let record = null;
  for (let index = total - 1; index >= 0; index -= 1) {
    record = await videos.saveVideoChunk({ id, index, total, mime: "video/mp4", bytes: file.subarray(index * size, (index + 1) * size) });
  }
  return record;
}

describe("chunked punishment videos", () => {
  it("finishes only when every chunk is in, whatever the order", async () => {
    const file = bytes(videos.VIDEO_CHUNK_BYTES * 2 + 1234, 7);
    const record = await upload("vid_order", file);
    expect(record).toMatchObject({ size: file.length, chunks: 3, chunkBytes: videos.VIDEO_CHUNK_BYTES });
  });

  it("refuses a short chunk in the middle and anything past the limit", async () => {
    await expect(
      videos.saveVideoChunk({ id: "vid_bad", index: 0, total: 2, mime: "video/mp4", bytes: bytes(10, 1) }),
    ).rejects.toThrow("wrong size");
    await expect(
      videos.saveVideoChunk({ id: "vid_big", index: 0, total: videos.VIDEO_MAX_CHUNKS + 1, mime: "video/mp4", bytes: bytes(10, 1) }),
    ).rejects.toThrow("too large");
  });

  it("serves byte ranges that cross chunks, and the whole file as a stream", async () => {
    const file = bytes(videos.VIDEO_CHUNK_BYTES * 3 + 99, 3);
    await upload("vid_range", file);
    const start = videos.VIDEO_CHUNK_BYTES - 10;
    const end = videos.VIDEO_CHUNK_BYTES * 2 + 5;

    const partial = await route.GET(
      new Request("http://test/api/gbbo-league/video?id=vid_range", { headers: { range: `bytes=${start}-${end}` } }),
    );
    expect(partial.status).toBe(206);
    expect(partial.headers.get("content-range")).toBe(`bytes ${start}-${end}/${file.length}`);
    expect(Buffer.from(await partial.arrayBuffer()).equals(file.subarray(start, end + 1))).toBe(true);

    const tail = await route.GET(new Request("http://test/api/gbbo-league/video?id=vid_range", { headers: { range: "bytes=-50" } }));
    expect(Buffer.from(await tail.arrayBuffer()).equals(file.subarray(file.length - 50))).toBe(true);

    const whole = await route.GET(new Request("http://test/api/gbbo-league/video?id=vid_range"));
    expect(whole.status).toBe(200);
    expect(whole.headers.get("accept-ranges")).toBe("bytes");
    expect(Buffer.from(await whole.arrayBuffer()).equals(file)).toBe(true);
  });

  it("still reads videos saved with the old 400 KB chunks", async () => {
    const legacy = 400_000;
    const file = bytes(legacy * 2 + 10, 9);
    const store = join(dir, "data", "gbbo-videos");
    mkdirSync(store, { recursive: true });
    writeFileSync(join(store, "vid_old.0.bin"), file.subarray(0, legacy));
    writeFileSync(join(store, "vid_old.1.bin"), file.subarray(legacy, legacy * 2));
    writeFileSync(join(store, "vid_old.2.bin"), file.subarray(legacy * 2));
    writeFileSync(join(store, "vid_old.json"), JSON.stringify({ id: "vid_old", mime: "video/mp4", size: file.length, chunks: 3 }));

    const response = await route.GET(
      new Request("http://test/api/gbbo-league/video?id=vid_old", { headers: { range: `bytes=${legacy - 5}-${legacy + 5}` } }),
    );
    expect(Buffer.from(await response.arrayBuffer()).equals(file.subarray(legacy - 5, legacy + 6))).toBe(true);
  });
});
