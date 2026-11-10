import sharp from "sharp";

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
