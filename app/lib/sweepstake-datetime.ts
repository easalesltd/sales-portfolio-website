/** Display timezone for sweepstake kick-offs and match dates (England-based game). */
export const SWEEPSTAKE_DISPLAY_TIMEZONE = 'Europe/London';

const KICKOFF_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: SWEEPSTAKE_DISPLAY_TIMEZONE,
};

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  timeZone: SWEEPSTAKE_DISPLAY_TIMEZONE,
};

const SHORT_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  timeZone: SWEEPSTAKE_DISPLAY_TIMEZONE,
};

/** e.g. Sat 15 Aug, 15:00 — UK wall clock, including BST. */
export function formatFixtureKickoff(utcDate: string): string {
  return new Date(utcDate).toLocaleString('en-GB', KICKOFF_FORMAT);
}

/** e.g. 15 Aug */
export function formatSweepstakeDate(utcDate: string): string {
  return new Date(utcDate).toLocaleDateString('en-GB', DATE_FORMAT);
}

/** e.g. 15 Aug — used on progress-chart point labels. */
export function formatSweepstakeShortDate(utcDate: string): string {
  return new Date(utcDate).toLocaleDateString('en-GB', SHORT_DATE_FORMAT);
}
