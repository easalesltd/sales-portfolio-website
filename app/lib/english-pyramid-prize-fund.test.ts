/** @jest-environment node */

import { pickYahooChartPrice } from '@/app/lib/english-pyramid-prize-fund';

describe('pickYahooChartPrice', () => {
  it('prefers Friday’s daily NAV when Yahoo’s live quote is still Thursday', () => {
    const thursday = Date.parse('2026-09-17T15:30:00Z') / 1000;
    const fridayOpen = Date.parse('2026-09-18T07:00:00Z') / 1000;
    const picked = pickYahooChartPrice({
      meta: {
        symbol: '0P00013P6I.L',
        currency: 'GBP',
        regularMarketPrice: 4.1327,
        chartPreviousClose: 4.1255,
        regularMarketTime: thursday,
      },
      timestamp: [Date.parse('2026-09-16T07:00:00Z') / 1000, thursday - 8.5 * 3600, fridayOpen],
      indicators: {
        quote: [{ close: [4.1147, 4.1327, 4.173] }],
      },
    });

    expect(picked.rawPrice).toBe(4.173);
    expect(picked.previousClose).toBe(4.1327);
    expect(picked.asOfMs).toBe(fridayOpen * 1000);
    expect(Math.round(33.88 * picked.rawPrice * 100) / 100).toBe(141.38);
  });

  it('keeps a live quote that is newer than the last daily bar', () => {
    const bar = Date.parse('2026-09-18T07:00:00Z') / 1000;
    const live = Date.parse('2026-09-21T15:30:00Z') / 1000;
    const picked = pickYahooChartPrice({
      meta: {
        regularMarketPrice: 4.18,
        regularMarketTime: live,
        chartPreviousClose: 4.173,
      },
      timestamp: [bar],
      indicators: {
        quote: [{ close: [4.173] }],
      },
    });

    expect(picked.rawPrice).toBe(4.18);
    expect(picked.previousClose).toBe(4.173);
  });
});
