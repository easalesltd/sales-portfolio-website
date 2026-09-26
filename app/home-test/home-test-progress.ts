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

/** Extra viewport after the last company so Cambridge can settle before the closer. */
export function lastSlideHoldPx(viewportHeight: number): number {
  return Math.max(0, viewportHeight);
}

export function slideTravel(trackHeight: number, viewportHeight: number, holdPx: number): number {
  return Math.max(0, trackHeight - viewportHeight - holdPx);
}

/** Past most of the last-photo hold — the closer should stay in view. */
export function isPastLastSlide(scrollY: number, lastSlideTop: number, slop = 48): boolean {
  return scrollY > lastSlideTop + slop;
}

/** Only release after Cambridge has had its hold, not on the landing swipe. */
export function shouldReleasePaging(scrollY: number, lastSlideTop: number, holdPx: number): boolean {
  return isPastLastSlide(scrollY, lastSlideTop, Math.max(48, holdPx * 0.85));
}

/** Pin the closer just under the sticky header so the wholesale copy fills the screen. */
export function closerPageTop(closerDocumentTop: number, headerBottom: number): number {
  return Math.max(0, closerDocumentTop - Math.max(0, headerBottom));
}

export function easeOutQuint(progress: number): number {
  const t = clamp01(progress);
  return 1 - (1 - t) ** 5;
}
