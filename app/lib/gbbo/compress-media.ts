import { spawn } from "child_process";
import { mkdtemp, readFile, rm, writeFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import sharp from "sharp";
import { VIDEO_COMPRESS_MIN_BYTES } from "./video-limits";

/** Shrink bake / slut-drop photos so they stop eating the Redis quota. */
export async function compressPunishmentPhoto(bytes: Buffer): Promise<{ bytes: Buffer; mime: string } | null> {
  try {
    const out = await sharp(bytes, { failOn: "none" })
      .rotate()
      .resize({
        width: 1600,
        height: 1600,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 72, mozjpeg: true })
      .toBuffer();
    if (out.length >= bytes.length) return null;
    return { bytes: out, mime: "image/jpeg" };
  } catch {
    return null;
  }
}

function inputExtension(mime: string): string {
  if (mime.includes("quicktime") || mime.includes("mov")) return ".mov";
  if (mime.includes("webm")) return ".webm";
  if (mime.includes("3gpp")) return ".3gp";
  return ".mp4";
}

async function runFfmpeg(bin: string, args: string[]): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
      if (stderr.length > 8000) stderr = stderr.slice(-4000);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr.trim() || `ffmpeg exited ${code}`));
    });
  });
}

/** Re-encode phone videos so Crimewatch keeps a small MP4 in Redis. */
export async function compressPunishmentVideo(
  bytes: Buffer,
  mime: string,
): Promise<{ bytes: Buffer; mime: string } | null> {
  if (bytes.length < VIDEO_COMPRESS_MIN_BYTES) return null;
  let ffmpegPath: string | null = null;
  try {
    ffmpegPath = (await import("ffmpeg-static")).default;
  } catch {
    return null;
  }
  if (!ffmpegPath) return null;

  const dir = await mkdtemp(join(tmpdir(), "gbbo-vid-"));
  const input = join(dir, `in${inputExtension(mime)}`);
  const output = join(dir, "out.mp4");
  try {
    await writeFile(input, bytes);
    await runFfmpeg(ffmpegPath, [
      "-y",
      "-i",
      input,
      "-vf",
      "scale=min(1280\\,iw):-2",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "28",
      "-c:a",
      "aac",
      "-b:a",
      "96k",
      "-movflags",
      "+faststart",
      output,
    ]);
    const out = await readFile(output);
    if (out.length < 1 || out.length >= bytes.length) return null;
    return { bytes: out, mime: "video/mp4" };
  } catch {
    return null;
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => undefined);
  }
}

export async function compressPunishmentMedia(
  bytes: Buffer,
  mime: string,
): Promise<{ bytes: Buffer; mime: string } | null> {
  if (mime.startsWith("image/")) return compressPunishmentPhoto(bytes);
  if (mime.startsWith("video/")) return compressPunishmentVideo(bytes, mime);
  return null;
}
