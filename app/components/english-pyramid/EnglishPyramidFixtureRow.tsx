'use client';

import type { ReactNode } from 'react';
import type { MatchdayEntry } from '@/app/lib/english-pyramid-scoring';
import DivisionBadge from './DivisionBadge';
import TeamRedCardMarker from './TeamRedCardMarker';

type FixtureSideProps = {
  teamName: string;
  divisionId: string;
  managersLabel: ReactNode;
  isPlaceholder: boolean;
  align: 'left' | 'right';
  compact?: boolean;
  redCards?: number;
};

function FixtureSide({
  teamName,
  divisionId,
  managersLabel,
  isPlaceholder,
  align,
  compact = false,
  redCards = 0,
}: FixtureSideProps) {
  const alignClass = align === 'right' ? 'items-end text-right' : 'items-start text-left';
  const nameAlignClass = align === 'right' ? 'text-right' : 'text-left';
  const rowAlignClass =
    align === 'right' ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex w-full min-w-0 flex-col gap-0.5 ${alignClass}`}>
      <div
        className={`flex w-full min-w-0 ${
          compact
            ? `flex-wrap items-end gap-x-1 gap-y-0.5 ${rowAlignClass}`
            : `items-center gap-1 ${rowAlignClass}`
        }`}
      >
        {!compact && align === 'left' ? <DivisionBadge divisionId={divisionId} /> : null}
        <span
          className={`inline-flex min-w-0 items-center gap-1 font-medium leading-snug ${
            compact ? `basis-full ${nameAlignClass} ${rowAlignClass}` : ''
          } ${
            compact ? 'text-xs sm:text-sm' : 'text-sm'
          } ${isPlaceholder ? 'italic text-neutral-400' : 'text-neutral-100'}`}
        >
          {compact && align === 'right' ? <TeamRedCardMarker count={redCards} /> : null}
          <span className="min-w-0">{teamName}</span>
          {compact && align === 'left' ? <TeamRedCardMarker count={redCards} /> : null}
        </span>
        {(!compact && align === 'right') || compact ? (
          <DivisionBadge divisionId={divisionId} className={compact ? 'mr-0' : ''} />
        ) : null}
      </div>
      {compact ? null : <TeamRedCardMarker count={redCards} />}
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
        <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-x-2">
          <FixtureSide
            teamName={entry.homeTeam.name}
            divisionId={entry.homeTeam.flag}
            managersLabel={homeManagersLabel}
            isPlaceholder={homeIsPlaceholder}
            align="right"
            compact
            redCards={entry.homeRedCards}
          />
          <div className="flex min-w-[2.75rem] justify-center self-start whitespace-nowrap pt-0.5 [&_span]:mx-0">
            {score}
          </div>
          <FixtureSide
            teamName={entry.awayTeam.name}
            divisionId={entry.awayTeam.flag}
            managersLabel={awayManagersLabel}
            isPlaceholder={awayIsPlaceholder}
            align="left"
            compact
            redCards={entry.awayRedCards}
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
          redCards={entry.homeRedCards}
        />
        <div className="flex items-center justify-center">{score}</div>
        <FixtureSide
          teamName={entry.awayTeam.name}
          divisionId={entry.awayTeam.flag}
          managersLabel={awayManagersLabel}
          isPlaceholder={awayIsPlaceholder}
          align="left"
          redCards={entry.awayRedCards}
        />
      </div>

      {winnerPathLabel}
      {pointsLine}
    </div>
  );
}
