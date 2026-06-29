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
  showDayNav?: boolean;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  onPreviousDay?: () => void;
  onNextDay?: () => void;
};

export default function MatchdayHeroStrip({
  schedule,
  selectedDate,
  showDayNav = false,
  canGoPrevious = false,
  canGoNext = false,
  onPreviousDay,
  onNextDay,
}: Props) {
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

  const navDateLabel = new Date(`${selectedDate}T12:00:00Z`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });

  const navButtonClass =
    'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#d4af37]/35 bg-[#1a2744]/80 text-sm font-semibold text-[#e8dfc8] transition hover:bg-[#d4af37]/15 disabled:cursor-not-allowed disabled:border-neutral-800 disabled:bg-[#0a0f1a]/40 disabled:text-neutral-600';

  return (
    <div className="mb-2 overflow-hidden rounded-lg border border-[#d4af37]/30 bg-[#1a2744]/60 px-3 py-2.5 sm:mb-3 sm:px-4 sm:py-3 [background-image:linear-gradient(135deg,rgba(212,175,55,0.1)_0%,transparent_55%)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]/80">
            Matchday
          </p>
          <h3 className="text-lg font-bold tracking-tight text-[#f5f5f0] sm:text-2xl">
            Gameweek {gameweek}
          </h3>
          {!showDayNav ? (
            <p className="mt-0.5 text-xs text-[#e8dfc8]/65">{dateLabel}</p>
          ) : null}
        </div>

        <dl className="flex shrink-0 items-center gap-2">
          <div className="rounded-md border border-[#d4af37]/25 bg-[#0a0f1a]/50 px-2 py-1 text-center sm:px-2.5">
            <dt className="text-[10px] text-[#e8dfc8]/50">Fixtures</dt>
            <dd className="text-sm font-bold leading-tight tabular-nums text-[#d4af37] sm:text-base">
              {fixtureCount}
            </dd>
          </div>
          {inPlayCount > 0 ? (
            <div className="rounded-md border border-emerald-500/30 bg-emerald-950/30 px-2 py-1 text-center sm:px-2.5">
              <dt className="text-[10px] text-emerald-400/80">Live</dt>
              <dd className="text-sm font-bold leading-tight tabular-nums text-emerald-300 sm:text-base">
                {inPlayCount}
              </dd>
            </div>
          ) : null}
        </dl>
      </div>

      {showDayNav ? (
        <div className="mt-2 flex items-center gap-1 rounded-md border border-[#d4af37]/25 bg-[#0a0f1a]/40 p-1 sm:mt-3 sm:inline-flex sm:gap-1.5 sm:px-2 sm:py-1">
          <button
            type="button"
            onClick={onPreviousDay}
            disabled={!canGoPrevious}
            aria-label="Previous matchday"
            className={navButtonClass}
          >
            ←
          </button>
          <span className="min-w-0 flex-1 truncate text-center text-xs font-medium text-[#e8dfc8] sm:min-w-[6.5rem] sm:flex-none">
            <span className="sm:hidden">{navDateLabel}</span>
            <span className="hidden sm:inline">{dateLabel}</span>
          </span>
          <button
            type="button"
            onClick={onNextDay}
            disabled={!canGoNext}
            aria-label="Next matchday"
            className={navButtonClass}
          >
            →
          </button>
        </div>
      ) : null}

      <p className="mt-2 text-[10px] leading-snug text-[#d4af37]/70 sm:text-xs">
        Kickoffs in GMT · scores after full time
      </p>
    </div>
  );
}
