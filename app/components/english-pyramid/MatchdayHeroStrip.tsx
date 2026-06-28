'use client';

import {
  countFixturesForDate,
  countInPlayFixtures,
  getGameweekNumber,
} from '@/app/lib/english-pyramid-gameweek';
import type { MatchdaySchedule } from '@/app/lib/world-cup-scoring';

type Props = {
  schedule: MatchdaySchedule;
  selectedDate: string;
};

export default function MatchdayHeroStrip({ schedule, selectedDate }: Props) {
  const gameweek = getGameweekNumber(schedule.fixtureDates, selectedDate);
  const entries = schedule.schedulesByDate[selectedDate] ?? [];
  const fixtureCount = countFixturesForDate(schedule.schedulesByDate, selectedDate);
  const inPlayCount = countInPlayFixtures(entries);

  const dateLabel = new Date(`${selectedDate}T12:00:00Z`).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });

  return (
    <div className="mb-3 overflow-hidden rounded-lg border border-[#d4af37]/30 bg-[#1a2744]/60 px-4 py-3 [background-image:linear-gradient(135deg,rgba(212,175,55,0.1)_0%,transparent_55%)]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]/80">
            Matchday
          </p>
          <h3 className="text-xl font-bold tracking-tight text-[#f5f5f0] sm:text-2xl">
            Gameweek {gameweek}
          </h3>
          <p className="mt-0.5 text-xs text-[#e8dfc8]/65">{dateLabel}</p>
        </div>
        <dl className="flex gap-4 text-right text-xs">
          <div>
            <dt className="text-[#e8dfc8]/50">Fixtures</dt>
            <dd className="text-lg font-bold tabular-nums text-[#d4af37]">{fixtureCount}</dd>
          </div>
          {inPlayCount > 0 ? (
            <div>
              <dt className="text-emerald-400/80">Live now</dt>
              <dd className="text-lg font-bold tabular-nums text-emerald-300">{inPlayCount}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </div>
  );
}
