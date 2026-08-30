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

const WEEKDAY_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  timeZone: SWEEPSTAKE_DISPLAY_TIMEZONE,
};

/** e.g. Sat 29 Aug */
export function formatSweepstakeWeekdayDate(utcDate: string): string {
  return new Date(utcDate).toLocaleDateString('en-GB', WEEKDAY_DATE_FORMAT);
}

/** YYYY-MM-DD on the UK calendar, used to bucket a matchday. */
export function sweepstakeLondonDayKey(utcDate: string): string {
  return new Date(utcDate).toLocaleDateString('en-CA', {
    timeZone: SWEEPSTAKE_DISPLAY_TIMEZONE,
  });
}

/** Monday YYYY-MM-DD of the UK week that contains this kick-off. */
export function sweepstakeLondonWeekKey(utcDate: string): string {
  const dayKey = sweepstakeLondonDayKey(utcDate);
  const [year, month, day] = dayKey.split('-').map(Number);
  const noon = new Date(Date.UTC(year, month - 1, day, 12));
  const weekday = noon.getUTCDay();
  noon.setUTCDate(noon.getUTCDate() - (weekday === 0 ? 6 : weekday - 1));
  return noon.toISOString().slice(0, 10);
}

/** e.g. 24 Aug to 30 Aug */
export function formatSweepstakeWeekRange(mondayKey: string): string {
  const [year, month, day] = mondayKey.split('-').map(Number);
  const start = `${mondayKey}T12:00:00Z`;
  const end = new Date(Date.UTC(year, month - 1, day + 6, 12)).toISOString();
  const from = formatSweepstakeShortDate(start);
  const to = formatSweepstakeShortDate(end);
  return from === to ? from : `${from} to ${to}`;
}
