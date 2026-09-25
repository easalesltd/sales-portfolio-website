export function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

/** Horizontal offset of an n-panel reel as a percentage of the full row width. */
export function reelOffsetPercent(progress: number, count: number): number {
  if (count <= 1) return 0;
  return clamp01(progress) * ((count - 1) / count) * 100;
}

export function activeSectorIndex(progress: number, count: number): number {
  if (count <= 1) return 0;
  return Math.min(count - 1, Math.round(clamp01(progress) * (count - 1)));
}

export function sectorLocalProgress(progress: number, index: number, count: number): number {
  if (count <= 1) return 1;
  const x = clamp01(progress) * (count - 1);
  return 1 - Math.min(1, Math.abs(x - index));
}

export function progressForSector(index: number, count: number): number {
  if (count <= 1 || index <= 0) return 0;
  return Math.min(1, index / (count - 1));
}
