#!/usr/bin/env node
/**
 * Compress oversized images under `public/images/` (keeps filenames/paths).
 *   npm run optimize:images
 *   npm run optimize:images -- --dry-run
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', 'public', 'images');

const aggressive = process.argv.includes('--aggressive');
const MIN_BYTES = Number(process.env.MIN_BYTES) || (aggressive ? 800_000 : 350_000);
const MAX_WIDTH = Number(process.env.MAX_WIDTH) || (aggressive ? 1600 : 1920);
const MAX_HEIGHT = Number(process.env.MAX_HEIGHT) || MAX_WIDTH;
const JPEG_QUALITY = Number(process.env.JPEG_QUALITY) || (aggressive ? 82 : 84);
const PNG_QUALITY = Number(process.env.PNG_QUALITY) || (aggressive ? 72 : 80);
const PNG_COMPRESSION = 9;
const dryRun = process.argv.includes('--dry-run');

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      walk(p, out);
      continue;
    }
    const ext = path.extname(name).toLowerCase();
    if (ext === '.heic' || ext === '.heif') {
      const jpg = p.replace(/\.(heic|heif)$/i, '.jpg');
      if (fs.existsSync(jpg)) continue;
    }
    if (['.jpg', '.jpeg', '.png', '.heic', '.heif'].includes(ext)) out.push(p);
  }
  return out;
}

async function optimizeFile(filePath) {
  const before = fs.statSync(filePath).size;
  if (before < MIN_BYTES) return null;

  const ext = path.extname(filePath).toLowerCase();
  const input = sharp(filePath, { failOn: 'none' }).rotate();
  const meta = await input.metadata();

  let pipeline = sharp(filePath, { failOn: 'none' }).rotate();
  if ((meta.width ?? 0) > MAX_WIDTH || (meta.height ?? 0) > MAX_HEIGHT) {
    pipeline = pipeline.resize(MAX_WIDTH, MAX_HEIGHT, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  let buffer;
  if (ext === '.heic' || ext === '.heif') {
    const jpgPath = filePath.replace(/\.(heic|heif)$/i, '.jpg');
    buffer = await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
    if (dryRun) return { before, after: buffer.length, outPath: jpgPath, note: 'heic→jpg' };
    await sharp(buffer).toFile(jpgPath);
    fs.unlinkSync(filePath);
    return { before, after: fs.statSync(jpgPath).size, outPath: jpgPath, note: 'heic→jpg' };
  }

  if (ext === '.png') {
    const opts = { compressionLevel: PNG_COMPRESSION, adaptiveFiltering: true };
    if (!meta.hasAlpha) {
      buffer = await pipeline
        .png({ ...opts, palette: true, quality: PNG_QUALITY, effort: 10 })
        .toBuffer();
    } else {
      buffer = await pipeline.png(opts).toBuffer();
    }
  } else {
    buffer = await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
  }

  if (dryRun) return { before, after: buffer.length, outPath: filePath };

  if (buffer.length >= before * 0.98) return null;

  const tmp = `${filePath}.opt.tmp`;
  fs.writeFileSync(tmp, buffer);
  fs.renameSync(tmp, filePath);
  return { before, after: fs.statSync(filePath).size, outPath: filePath };
}

async function main() {
  const files = walk(ROOT);
  let totalBefore = 0;
  let totalAfter = 0;
  let touched = 0;

  console.log(dryRun ? 'DRY RUN\n' : 'Optimizing…\n');

  for (const filePath of files) {
    try {
      const r = await optimizeFile(filePath);
      if (!r || r.note === 'skipped (<2% gain)') continue;
      if (r.before < MIN_BYTES) continue;
      touched++;
      totalBefore += r.before;
      totalAfter += r.after;
      const pct = Math.round((1 - r.after / r.before) * 100);
      console.log(
        `${path.relative(ROOT, r.outPath)}: ${Math.round(r.before / 1024)} → ${Math.round(r.after / 1024)} KiB (−${pct}%)${r.note ? ` ${r.note}` : ''}`
      );
    } catch (err) {
      console.error('ERR', path.relative(ROOT, filePath), err.message);
    }
  }

  console.log(
    `\n${touched} optimized; ${(totalBefore / 1024 / 1024).toFixed(1)} MiB → ${(totalAfter / 1024 / 1024).toFixed(1)} MiB`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
