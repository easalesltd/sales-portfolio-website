/** @jest-environment node */

import {
  formatFixtureKickoff,
  formatSweepstakeDate,
  formatSweepstakeShortDate,
  formatSweepstakeMonth,
  formatSweepstakeWeekdayDate,
  sweepstakeLondonDayKey,
  sweepstakeLondonMonthKey,
} from '@/app/lib/sweepstake-datetime';

describe('sweepstake datetime (Europe/London)', () => {
  it('shows Saturday 15:00 UK kick-offs as 15:00 during BST, not 14:00 UTC', () => {
    expect(formatFixtureKickoff('2026-08-15T14:00:00Z')).toBe('Sat 15 Aug, 15:00');
  });

  it('shows 12:30 UK early kick-offs stored as 11:30Z', () => {
    expect(formatFixtureKickoff('2026-08-15T11:30:00Z')).toBe('Sat 15 Aug, 12:30');
  });

  it('shows 19:45 UK midweek kick-offs stored as 18:45Z', () => {
    expect(formatFixtureKickoff('2026-08-18T18:45:00Z')).toBe('Tue 18 Aug, 19:45');
  });

  it('keeps winter (GMT) 15:00 UK kick-offs at 15:00', () => {
    expect(formatFixtureKickoff('2026-12-26T15:00:00Z')).toBe('Sat 26 Dec, 15:00');
  });

  it('formats match dates on the UK calendar day', () => {
    expect(formatSweepstakeDate('2026-08-15T14:00:00Z')).toBe('15 Aug');
    expect(formatSweepstakeShortDate('2026-08-15T14:00:00Z')).toBe('15 Aug');
    expect(formatSweepstakeWeekdayDate('2026-08-15T14:00:00Z')).toBe('Sat 15 Aug');
    expect(sweepstakeLondonDayKey('2026-08-15T14:00:00Z')).toBe('2026-08-15');
    expect(sweepstakeLondonMonthKey('2026-08-15T14:00:00Z')).toBe('2026-08');
    expect(formatSweepstakeMonth('2026-08')).toBe('August 2026');
  });
});
