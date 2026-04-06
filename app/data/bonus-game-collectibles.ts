/**
 * Filenames under `public/images/Game/Bonus Game/` — WebP, max ~240px (see `scripts/optimize-bonus-game-images.cjs`).
 */
export const BONUS_GAME_COLLECTIBLE_FILES = [
  'Screenshot 2026-04-06 at 20.06.42-Photoroom.webp',
  'Screenshot 2026-04-06 at 20.07.15-Photoroom.webp',
  'Screenshot 2026-04-06 at 20.08.08-Photoroom.webp',
  'Screenshot 2026-04-06 at 20.08.39-Photoroom.webp',
  'Screenshot 2026-04-06 at 20.10.30.webp',
  'Screenshot 2026-04-06 at 20.10.56-Photoroom.webp',
  'Screenshot 2026-04-06 at 20.11.07-Photoroom.webp',
  'Screenshot 2026-04-06 at 20.11.35-Photoroom.webp',
  'Screenshot 2026-04-06 at 20.14.30-Photoroom.webp',
  'Screenshot 2026-04-06 at 20.15.27-Photoroom.webp',
  'Screenshot 2026-04-06 at 20.15.41-Photoroom.webp',
  'Screenshot 2026-04-06 at 20.16.22-Photoroom.webp',
  'Screenshot 2026-04-06 at 20.16.40-Photoroom.webp',
  'Screenshot 2026-04-06 at 20.16.51-Photoroom.webp',
  'Screenshot 2026-04-06 at 20.17.11-Photoroom.webp',
  'Screenshot 2026-04-06 at 20.17.47-Photoroom.webp',
  'Screenshot 2026-04-06 at 20.17.55-Photoroom.webp',
  'Screenshot 2026-04-06 at 20.18.25-Photoroom.webp',
  'Screenshot 2026-04-06 at 20.20.34-Photoroom.webp',
  'Screenshot 2026-04-06 at 20.21.26.webp',
  'Screenshot 2026-04-06 at 20.22.43.webp',
  'Screenshot 2026-04-06 at 20.24.59.webp',
  'Screenshot 2026-04-06 at 20.26.47.webp',
  'Screenshot 2026-04-06 at 20.27.21.webp',
  'Screenshot 2026-04-06 at 21.15.07-Photoroom.webp',
  'Screenshot 2026-04-06 at 21.15.36-Photoroom.webp',
  'Screenshot 2026-04-06 at 21.15.58-Photoroom.webp',
  'Screenshot 2026-04-06 at 21.16.16-Photoroom.webp',
  'Screenshot 2026-04-06 at 21.17.49.webp',
  'Screenshot 2026-04-06 at 21.20.58.webp',
  'Screenshot 2026-04-06 at 21.21.27-Photoroom.webp',
  'Screenshot 2026-04-06 at 21.21.53.webp',
] as const;

const BONUS_GAME_PREFIX = '/images/Game/Bonus Game/';

export const BONUS_COLLECTIBLE_SRCS: readonly string[] = BONUS_GAME_COLLECTIBLE_FILES.map((f) =>
  encodeURI(`${BONUS_GAME_PREFIX}${f}`)
);
