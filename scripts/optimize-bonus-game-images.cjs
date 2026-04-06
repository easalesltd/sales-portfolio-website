/**
 * Resize + WebP-compress bonus collectibles (displayed tiny in-game).
 * Reads PNG/JPEG in `public/images/Game/Bonus Game/`, writes `.webp` beside them, deletes sources.
 *
 *   node scripts/optimize-bonus-game-images.cjs
 *
 * After adding new PNGs, run this and update `app/data/bonus-game-collectibles.ts` extensions to `.webp`.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const MAX_EDGE = 240;
const WEBP_QUALITY = 80;

async function main() {
  const dir = path.join(__dirname, '..', 'public', 'images', 'Game', 'Bonus Game');
  if (!fs.existsSync(dir)) {
    console.error('Missing folder:', dir);
    process.exit(1);
  }
  const entries = fs.readdirSync(dir);
  let totalIn = 0;
  let totalOut = 0;
  for (const f of entries) {
    if (!/\.(png|jpe?g)$/i.test(f)) continue;
    const inPath = path.join(dir, f);
    const stat = fs.statSync(inPath);
    if (!stat.isFile()) continue;
    const base = f.replace(/\.(png|jpe?g)$/i, '');
    const outPath = path.join(dir, `${base}.webp`);
    await sharp(inPath)
      .rotate()
      .resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 6 })
      .toFile(outPath);
    totalIn += stat.size;
    const outSz = fs.statSync(outPath).size;
    totalOut += outSz;
    fs.unlinkSync(inPath);
    console.log(
      `${f} → ${base}.webp (${Math.round(stat.size / 1024)} KiB → ${Math.round(outSz / 1024)} KiB)`
    );
  }
  console.log(
    `\nTotal: ${Math.round(totalIn / 1024)} KiB → ${Math.round(totalOut / 1024)} KiB (${Math.round((1 - totalOut / totalIn) * 100)}% smaller)`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
