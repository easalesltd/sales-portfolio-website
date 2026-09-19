const LONDON = "Europe/London";
const EPISODE_START_HOUR = 20;
const EPISODE_DONE_HOUR = 22;

/** Series 17 Tuesdays, Cake week through the final. */
export const SERIES_17_AIR_DATES = [
  { year: 2026, month: 9, day: 22 },
  { year: 2026, month: 9, day: 29 },
  { year: 2026, month: 10, day: 6 },
  { year: 2026, month: 10, day: 13 },
  { year: 2026, month: 10, day: 20 },
  { year: 2026, month: 10, day: 27 },
  { year: 2026, month: 11, day: 3 },
  { year: 2026, month: 11, day: 10 },
  { year: 2026, month: 11, day: 17 },
  { year: 2026, month: 11, day: 24 },
] as const;

export type TeamWindow = {
  week: number;
  open: boolean;
  opensAt: Date | null;
  closesAt: Date | null;
  summary: string;
};

function tzOffsetMs(timeZone: string, date: Date): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );
  const hour = Number(parts.hour) === 24 ? 0 : Number(parts.hour);
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    hour,
    Number(parts.minute),
    Number(parts.second),
  );
  return asUtc - date.getTime();
}

function instantInLondon(year: number, month: number, day: number, hour: number, minute = 0): Date {
  let guess = Date.UTC(year, month - 1, day, hour, minute, 0);
  for (let i = 0; i < 3; i += 1) {
    const offset = tzOffsetMs(LONDON, new Date(guess));
    const next = Date.UTC(year, month - 1, day, hour, minute, 0) - offset;
    if (next === guess) break;
    guess = next;
  }
  return new Date(guess);
}

export function episodeStartsAt(week: number): Date {
  const date = SERIES_17_AIR_DATES[week - 1] ?? SERIES_17_AIR_DATES[0];
  return instantInLondon(date.year, date.month, date.day, EPISODE_START_HOUR);
}

export function episodeDoneAt(week: number): Date {
  const date = SERIES_17_AIR_DATES[week - 1] ?? SERIES_17_AIR_DATES[0];
  return instantInLondon(date.year, date.month, date.day, EPISODE_DONE_HOUR);
}

export function formatLondon(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: LONDON,
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function teamWindow(now: Date = new Date(), totalWeeks = SERIES_17_AIR_DATES.length): TeamWindow {
  const firstDone = episodeDoneAt(1);
  if (now < firstDone) {
    return {
      week: 1,
      open: false,
      opensAt: firstDone,
      closesAt: episodeStartsAt(2),
      summary: `Week 1 sides are locked until Cake Week finishes at ${formatLondon(firstDone)}. After that you can change one baker for week 2.`,
    };
  }

  for (let week = 2; week <= totalWeeks; week += 1) {
    const opensAt = episodeDoneAt(week - 1);
    const closesAt = episodeStartsAt(week);
    const locksUntil = episodeDoneAt(week);
    if (now < closesAt) {
      return {
        week,
        open: true,
        opensAt,
        closesAt,
        summary: `Week ${week} is open. You may substitute one baker before ${formatLondon(closesAt)}.`,
      };
    }
    if (now < locksUntil) {
      return {
        week,
        open: false,
        opensAt: locksUntil,
        closesAt: week < totalWeeks ? episodeStartsAt(week + 1) : null,
        summary: `Week ${week} is locked while the episode is on. ${
          week < totalWeeks
            ? `The next change window opens at ${formatLondon(locksUntil)}.`
            : "The final sides stay as they are."
        }`,
      };
    }
  }

  return {
    week: totalWeeks,
    open: false,
    opensAt: null,
    closesAt: null,
    summary: "The series is over. Sides stay as they finished.",
  };
}
