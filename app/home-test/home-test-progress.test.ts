import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from '@jest/globals';
import { firstSlideIndexForSector, HOME_TEST_SECTORS, HOME_TEST_SLIDES, sectorIndexForSlide } from './home-test-sectors';
import {
  activeSectorIndex,
  clamp01,
  isPastLastSlide,
  lastSlideHoldPx,
  progressForSector,
  reelOffsetPercent,
  sectorLocalProgress,
  shouldReleasePaging,
  slideIndexAfterSwipe,
  slideScrollTop,
  slideTravel,
} from './home-test-progress';

describe('home-test scroll mapping', () => {
  it('clamps progress into 0–1', () => {
    expect(clamp01(-2)).toBe(0);
    expect(clamp01(0.4)).toBe(0.4);
    expect(clamp01(3)).toBe(1);
  });

  it('slides a four-panel reel from 0% to 75%', () => {
    expect(reelOffsetPercent(0, 4)).toBe(0);
    expect(reelOffsetPercent(1, 4)).toBe(75);
    expect(reelOffsetPercent(0.5, 4)).toBe(37.5);
  });

  it('picks the nearest sector', () => {
    expect(activeSectorIndex(0, 4)).toBe(0);
    expect(activeSectorIndex(0.34, 4)).toBe(1);
    expect(activeSectorIndex(1, 4)).toBe(3);
  });

  it('peaks local progress when that sector is centred', () => {
    expect(sectorLocalProgress(0, 0, 4)).toBe(1);
    expect(sectorLocalProgress(1, 3, 4)).toBe(1);
    expect(sectorLocalProgress(0, 2, 4)).toBe(0);
  });

  it('maps a sector index back to reel progress', () => {
    expect(progressForSector(0, 4)).toBe(0);
    expect(progressForSector(3, 4)).toBe(1);
    expect(progressForSector(1, 4)).toBeCloseTo(1 / 3);
  });

  it('finds the first slide of each chapter', () => {
    expect(firstSlideIndexForSector(0)).toBe(0);
    expect(firstSlideIndexForSector(1)).toBe(4);
    expect(firstSlideIndexForSector(2)).toBe(10);
    expect(firstSlideIndexForSector(3)).toBe(13);
    expect(firstSlideIndexForSector(4)).toBe(16);
    expect(firstSlideIndexForSector(5)).toBe(18);
    expect(sectorIndexForSlide(0)).toBe(0);
    expect(sectorIndexForSlide(3)).toBe(0);
    expect(sectorIndexForSlide(4)).toBe(1);
    expect(sectorIndexForSlide(9)).toBe(1);
    expect(sectorIndexForSlide(10)).toBe(2);
    expect(sectorIndexForSlide(12)).toBe(2);
    expect(sectorIndexForSlide(13)).toBe(3);
    expect(sectorIndexForSlide(15)).toBe(3);
    expect(sectorIndexForSlide(16)).toBe(4);
    expect(sectorIndexForSlide(18)).toBe(5);
    expect(HOME_TEST_SLIDES).toHaveLength(19);
    const confectionery = HOME_TEST_SECTORS.find((sector) => sector.id === 'confectionery');
    expect(confectionery?.slides.map((slide) => slide.id)).toEqual(['buttons']);
    expect(confectionery?.slides[0]?.hero.src).toContain('buttons.png');
  });

  it('advances only one slide per swipe and releases at the ends', () => {
    expect(slideIndexAfterSwipe(4, 80, 24)).toBe(5);
    expect(slideIndexAfterSwipe(4, -80, 24)).toBe(3);
    expect(slideIndexAfterSwipe(4, 12, 24)).toBeNull();
    expect(slideIndexAfterSwipe(0, -80, 24)).toBeNull();
    expect(slideIndexAfterSwipe(23, 80, 24)).toBeNull();
  });

  it('keeps the headline above the photo', () => {
    const css = readFileSync(join(__dirname, 'home-test.css'), 'utf8');
    const copy = Number(css.match(/\.home-test-copy\s*\{[^}]*z-index:\s*(\d+)/)?.[1]);
    const activeSlide = Number(css.match(/\.home-test-slide\.is-active\s*\{[^}]*z-index:\s*(\d+)/)?.[1]);
    expect(copy).toBeGreaterThan(activeSlide);
  });

  it('maps each company to one equal step of the track', () => {
    expect(slideScrollTop(100, 2300, 0, 24)).toBe(100);
    expect(slideScrollTop(100, 2300, 23, 24)).toBe(2400);
    expect(slideScrollTop(100, 2300, 1, 24)).toBeCloseTo(100 + 2300 / 23);
  });

  it('holds the last company before the closer can take over', () => {
    expect(lastSlideHoldPx(800)).toBe(800);
    expect(slideTravel(16000, 800, 800)).toBe(14400);
    const lastTop = slideScrollTop(100, 14400, 18, 19);
    expect(isPastLastSlide(lastTop, lastTop)).toBe(false);
    expect(shouldReleasePaging(lastTop, lastTop, 800)).toBe(false);
    expect(shouldReleasePaging(lastTop + 679, lastTop, 800)).toBe(false);
    expect(shouldReleasePaging(lastTop + 681, lastTop, 800)).toBe(true);
  });
});
