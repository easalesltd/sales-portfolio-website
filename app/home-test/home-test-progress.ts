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

/**
 * One swipe, one company. `deltaY` is startY − endY (positive = swipe up = next).
 * Returns null when the gesture should not be captured (tap, or leaving the reel).
 */
export function slideIndexAfterSwipe(
  current: number,
  deltaY: number,
  count: number,
  threshold = 40,
): number | null {
  if (count <= 1 || Math.abs(deltaY) < threshold) return null;
  const step = deltaY > 0 ? 1 : -1;
  const next = current + step;
  if (next < 0 || next >= count) return null;
  return next;
}

export function slideScrollTop(
  trackDocumentTop: number,
  travel: number,
  index: number,
  count: number,
): number {
  return trackDocumentTop + progressForSector(index, count) * Math.max(0, travel);
}
