/** @jest-environment node */

import { resolveEffectiveKickoff } from '@/app/lib/espn-kickoff';

describe('espn-kickoff', () => {
  it('uses ESPN kick-off when a fixture starts late', () => {
    const kickoff = resolveEffectiveKickoff('2026-07-06T00:00:00Z', {
      utcDate: '2026-07-06T01:00:00Z',
      statusName: 'STATUS_SCHEDULED',
      statusState: 'pre',
    });

    expect(kickoff.isDelayed).toBe(true);
    expect(kickoff.delayMinutes).toBe(60);
    expect(kickoff.effectiveUtcDate).toBe('2026-07-06T01:00:00Z');
  });

  it('keeps the scheduled kick-off when ESPN matches the fixture', () => {
    const kickoff = resolveEffectiveKickoff('2026-07-05T20:00:00Z', {
      utcDate: '2026-07-05T20:00:00Z',
      statusName: 'STATUS_FULL_TIME',
      statusState: 'post',
    });

    expect(kickoff.isDelayed).toBe(false);
    expect(kickoff.effectiveUtcDate).toBe('2026-07-05T20:00:00Z');
  });
});
