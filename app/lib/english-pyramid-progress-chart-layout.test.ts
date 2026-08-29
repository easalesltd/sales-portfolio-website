/** @jest-environment node */

import { describe, expect, it } from '@jest/globals';
import {
  PYRAMID_MOBILE_PROGRESS_MIN_HEIGHT,
  pyramidMobileProgressChartHeight,
} from '@/app/lib/english-pyramid-progress-chart-layout';

describe('pyramidMobileProgressChartHeight', () => {
  it('leaves room for crest header and jump nav on an iPhone 17 Pro Max Safari viewport', () => {
    const height = pyramidMobileProgressChartHeight({
      viewportHeight: 754,
      overlayPadTop: 0,
      overlayPadBottom: 0,
      headerHeight: 145,
      navHeight: 56,
    });
    expect(height).toBe(405);
    expect(145 + 56 + 148 + height).toBe(754);
  });

  it('does not shrink below the readable floor on a short viewport', () => {
    expect(
      pyramidMobileProgressChartHeight({
        viewportHeight: 500,
        overlayPadTop: 47,
        overlayPadBottom: 34,
        headerHeight: 145,
        navHeight: 56,
      }),
    ).toBe(PYRAMID_MOBILE_PROGRESS_MIN_HEIGHT);
  });
});
