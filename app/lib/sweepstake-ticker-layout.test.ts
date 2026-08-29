/** @jest-environment node */

import { describe, expect, it } from '@jest/globals';
import {
  englishPyramidFantasyTheme,
  worldCupFantasyTheme,
} from '@/app/lib/sweepstake-fantasy-theme';
import {
  LATEST_RESULT_MOBILE_SLOT,
  LATEST_RESULT_MOBILE_STACK,
  TICKER_CARD_SIZE,
  tickerCardFillsMobileColumn,
} from '@/app/lib/sweepstake-ticker-layout';

describe('sweepstake ticker layout', () => {
  it('pins phone cards to the content column so stacked results cannot shift the board', () => {
    expect(tickerCardFillsMobileColumn(TICKER_CARD_SIZE)).toBe(true);
    expect(tickerCardFillsMobileColumn(worldCupFantasyTheme.c.tickerCard)).toBe(true);
    expect(tickerCardFillsMobileColumn(englishPyramidFantasyTheme.c.tickerCard)).toBe(true);
  });

  it('does not keep an unconstrained min-width on mobile ticker cards', () => {
    expect(TICKER_CARD_SIZE).not.toMatch(/(?:^|\s)min-w-\[17rem\]/);
    expect(TICKER_CARD_SIZE).not.toMatch(/(?:^|\s)shrink-0(?:\s|$)/);
  });

  it('keeps the desktop marquee cards compact', () => {
    expect(TICKER_CARD_SIZE).toContain('sm:min-w-[17rem]');
    expect(TICKER_CARD_SIZE).toContain('sm:shrink-0');
    expect(TICKER_CARD_SIZE).toContain('md:min-w-[21rem]');
  });

  it('stretches the mobile rotator across the same column as the roast', () => {
    expect(LATEST_RESULT_MOBILE_STACK.split(/\s+/)).toEqual(
      expect.arrayContaining(['grid', 'w-full', 'min-w-0', 'justify-items-stretch', 'overflow-x-clip']),
    );
    expect(LATEST_RESULT_MOBILE_SLOT.split(/\s+/)).toEqual(
      expect.arrayContaining(['w-full', 'min-w-0', 'max-w-full', 'col-start-1', 'row-start-1']),
    );
  });
});
