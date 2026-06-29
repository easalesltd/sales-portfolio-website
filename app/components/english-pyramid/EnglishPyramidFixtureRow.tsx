'use client';

import type { ReactNode } from 'react';
import type { MatchdayEntry } from '@/app/lib/world-cup-scoring';
import DivisionBadge from './DivisionBadge';

type FixtureSideProps = {
  teamName: string;
  divisionId: string;
  managersLabel: ReactNode;
  isPlaceholder: boolean;
  align: 'left' | 'right';
  compact?: boolean;
};

function FixtureSide({
  teamName,
  divisionId,
  managersLabel,
  isPlaceholder,
  align,
  compact = false,
}: FixtureSideProps) {
  const alignClass = align === 'right' ? 'items-end text-right' : 'items-start text-left';

  return (
    <div className={`flex w-full min-w-0 flex-col gap-0.5 ${alignClass}`}>
      <div
        className={`flex w-full min-w-0 items-center gap-1 ${
          align === 'right' ? 'justify-end' : 'justify-start'
        }`}
      >
        {align === 'left' ? <DivisionBadge divisionId={divisionId} /> : null}
        <span
          className={`min-w-0 font-medium leading-snug ${
            compact ? 'text-xs sm:text-sm' : 'text-sm'
          } ${isPlaceholder ? 'italic text-neutral-400' : 'text-neutral-100'}`}
        >
          {teamName}
        </span>
        {align === 'right' ? <DivisionBadge divisionId={divisionId} /> : null}
      </div>
      {managersLabel ? (
        <p className={`leading-snug text-neutral-400 ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
          {managersLabel}
        </p>
      ) : null}
    </div>
  );
}

type Props = {
  entry: MatchdayEntry;
  kickoff: ReactNode;
  statusBadge: ReactNode;
  score: ReactNode;
  homeManagersLabel: ReactNode;
  awayManagersLabel: ReactNode;
  pointsLine?: ReactNode;
  roundLabel?: ReactNode;
  winnerPathLabel?: ReactNode;
};

export default function EnglishPyramidFixtureRow({
  entry,
  kickoff,
  statusBadge,
  score,
  homeManagersLabel,
  awayManagersLabel,
  pointsLine,
  roundLabel,
  winnerPathLabel,
}: Props) {
  const homeIsPlaceholder = entry.placeholderSide === 'home' || entry.placeholderSide === 'both';
  const awayIsPlaceholder = entry.placeholderSide === 'away' || entry.placeholderSide === 'both';

  return (
    <div className="min-w-0">
      {roundLabel}

      {/* Mobile: kickoff header + compact 3-column match row */}
      <div className="sm:hidden">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <div className="min-w-0">{kickoff}</div>
          {statusBadge}
        </div>
        <div className="grid w-full grid-cols-[minmax(0,1fr)_2.25rem_minmax(0,1fr)] items-start gap-x-2">
          <FixtureSide
            teamName={entry.homeTeam.name}
            divisionId={entry.homeTeam.flag}
            managersLabel={homeManagersLabel}
            isPlaceholder={homeIsPlaceholder}
            align="right"
            compact
          />
          <div className="flex justify-center self-start pt-0.5 [&_span]:mx-0">{score}</div>
          <FixtureSide
            teamName={entry.awayTeam.name}
            divisionId={entry.awayTeam.flag}
            managersLabel={awayManagersLabel}
            isPlaceholder={awayIsPlaceholder}
            align="right"
            compact
          />
        </div>
      </div>

      {/* Desktop: full grid with kickoff column */}
      <div className="hidden gap-x-3 sm:grid sm:grid-cols-[6.75rem_minmax(0,1fr)_4rem_minmax(0,1fr)] sm:items-center">
        <div className="shrink-0">
          {kickoff}
          {statusBadge}
        </div>
        <FixtureSide
          teamName={entry.homeTeam.name}
          divisionId={entry.homeTeam.flag}
          managersLabel={homeManagersLabel}
          isPlaceholder={homeIsPlaceholder}
          align="right"
        />
        <div className="flex items-center justify-center">{score}</div>
        <FixtureSide
          teamName={entry.awayTeam.name}
          divisionId={entry.awayTeam.flag}
          managersLabel={awayManagersLabel}
          isPlaceholder={awayIsPlaceholder}
          align="left"
        />
      </div>

      {winnerPathLabel}
      {pointsLine}
    </div>
  );
}
