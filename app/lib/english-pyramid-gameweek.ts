/** Gameweek = chronological index of a fixture date in the season calendar (1-based). */
export function getGameweekNumber(fixtureDates: readonly string[], date: string): number {
  const index = fixtureDates.indexOf(date);
  return index >= 0 ? index + 1 : 1;
}

export function countFixturesForDate(
  schedulesByDate: Record<string, unknown[] | undefined>,
  date: string
): number {
  return schedulesByDate[date]?.length ?? 0;
}

export function countInPlayFixtures(
  entries: readonly { status?: string }[] | undefined
): number {
  return entries?.filter((entry) => entry.status === 'in-play').length ?? 0;
}
