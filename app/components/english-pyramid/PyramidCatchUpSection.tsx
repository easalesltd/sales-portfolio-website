'use client';

import { useMemo, useState } from 'react';
import type { MatchPointsEntry, PlayerStanding } from '@/app/lib/english-pyramid-scoring';
import {
  buildPeriodProgress,
  periodProgressBarMax,
  type PeriodProgressPeriod,
} from '@/app/lib/english-pyramid-scoring';
import {
  buildDeadClubs,
  buildDivisionHeatmap,
  buildGapToFirst,
  buildSeedForm,
  formatPpg,
  formatSignedPoints,
  heatmapCellTone,
} from '@/app/lib/english-pyramid-catch-up';
import { draftSlotPlainLabel } from '@/app/lib/english-pyramid-overachievement';
import { managerColorForPlayer } from '@/app/lib/sweepstake-manager-colors';
import { useSweepstakeTheme } from '../SweepstakeThemeContext';
import DivisionBadge from './DivisionBadge';

type Props = {
  standings: PlayerStanding[];
  scoringMatches: MatchPointsEntry[];
};

function managerLabel(teamName: string | null, name: string): string {
  return teamName ? `${teamName} (${name})` : name;
}

function signedClass(value: number, positive: string, negative: string): string {
  if (value > 0) return positive;
  if (value < 0) return negative;
  return 'text-neutral-400';
}

export default function PyramidCatchUpSection({ standings, scoringMatches }: Props) {
  const t = useSweepstakeTheme();
  const [period, setPeriod] = useState<PeriodProgressPeriod>('day');

  const board = useMemo(
    () => buildPeriodProgress(standings, scoringMatches, period),
    [standings, scoringMatches, period]
  );
  const gap = useMemo(() => buildGapToFirst(standings, scoringMatches), [standings, scoringMatches]);
  const dead = useMemo(() => buildDeadClubs(standings), [standings]);
  const heat = useMemo(() => buildDivisionHeatmap(standings), [standings]);
  const seed = useMemo(() => buildSeedForm(standings), [standings]);
  const barMax = board ? periodProgressBarMax(board.rows) : 1;

  return (
    <div className="mb-8 space-y-6">
      <section className="overflow-hidden rounded-lg border border-[#d4af37]/25 bg-[#0a0f1a]/50">
        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#d4af37]/15 px-3 py-2.5 sm:px-4">
          <div className="min-w-0">
            <h3 className={t.c.sectionHeading}>Catch up board</h3>
            <p className="mt-1 text-xs text-neutral-400">
              {board
                ? `Points earned ${board.label}. Green rows closed the gap on the leader.`
                : 'Fills in after the first results.'}
            </p>
          </div>
          <div className="inline-flex shrink-0 rounded-md border border-[#d4af37]/35 p-0.5">
            {(['day', 'week', 'month'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setPeriod(option)}
                className={`min-h-8 rounded px-2.5 text-[11px] font-semibold capitalize ${
                  period === option
                    ? 'bg-[#d4af37]/20 text-[#f5e2a3]'
                    : 'text-neutral-400 hover:text-[#e8dfc8]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {board ? (
          <ul className="divide-y divide-[#d4af37]/10 px-3 py-2 text-neutral-100 sm:px-4">
            {board.rows.map((row) => {
              const color = managerColorForPlayer(row.playerId, 'english-pyramid') ?? '#d4af37';
              const width = (Math.abs(row.points) / barMax) * 100;
              return (
                <li
                  key={row.playerId}
                  className={`py-1.5 ${row.catchingUp ? 'bg-emerald-950/25' : row.leading ? 'bg-[#d4af37]/5' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <img src={row.crest} alt="" className="h-5 w-5 shrink-0 object-contain" />
                    <span className="min-w-0 flex-1 truncate text-xs font-medium">{managerLabel(row.teamName, row.managerName)}</span>
                    <span className={`w-10 shrink-0 text-right text-xs font-semibold tabular-nums ${signedClass(row.points, t.c.positive, t.c.negative)}`}>
                      {formatSignedPoints(row.points)}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-neutral-800">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${width}%`,
                        backgroundColor: row.points < 0 ? '#c45c4a' : color,
                      }}
                    />
                  </div>
                  <p className="mt-0.5 text-[10px] text-neutral-500">
                    {row.leading
                      ? 'Season leader (Bell End)'
                      : row.catchingUp
                        ? `Catching up · ${formatSignedPoints(row.vsLeader)} vs the leader this ${period}`
                        : `${row.seasonGap} behind overall`}
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="px-3 py-3 text-sm text-neutral-400 sm:px-4">No finished matches yet.</p>
        )}

        {gap ? (
          <div className="border-t border-[#d4af37]/15 px-3 py-2.5 sm:px-4">
            <h4 className="text-[10px] font-semibold uppercase tracking-wide text-[#d4af37]/80">Gap to first</h4>
            <p className="mt-0.5 text-[11px] text-neutral-500">
              A typical matchday is {gap.typicalMatchday.toFixed(1)} pts. That is how many Saturdays it takes to catch the leader at par.
            </p>
            <ul className="mt-2 space-y-1 text-xs text-neutral-100">
              {gap.rows.map((row) => (
                <li key={row.managerId} className="flex items-baseline justify-between gap-2">
                  <span className="min-w-0 truncate">{row.managerName}</span>
                  <span className="shrink-0 tabular-nums text-neutral-400">
                    {row.leading
                      ? 'Leading (Bell End)'
                      : `${row.seasonGap} pts · ${row.matchdaysBehind?.toFixed(1)} matchdays`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="border-t border-[#d4af37]/15 px-3 py-2.5 sm:px-4">
          <h4 className="text-[10px] font-semibold uppercase tracking-wide text-[#d4af37]/80">Dead clubs</h4>
          <p className="mt-0.5 text-[11px] text-neutral-500">The two sides dragging each squad.</p>
          <ul className="mt-2 space-y-2">
            {dead.map((row) => (
              <li key={row.managerId} className="text-xs text-neutral-100">
                <p className="font-medium text-[#e8dfc8]">{managerLabel(row.teamName, row.managerName)}</p>
                {row.clubs.length === 0 ? (
                  <p className="text-neutral-500">No passengers yet.</p>
                ) : (
                  <p className="mt-0.5 text-neutral-400">
                    {row.clubs.map((club, index) => (
                      <span key={club.code}>
                        {index > 0 ? ' · ' : null}
                        {club.divisionId ? <DivisionBadge divisionId={club.divisionId} /> : null}
                        {club.name} {club.points} pts
                      </span>
                    ))}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h3 className={`mb-1 ${t.c.sectionHeading}`}>Division heat map</h3>
        <p className="mb-2 text-xs text-neutral-500">
          Fantasy points per game in each draft division. Gold is hot. Red is a problem.
        </p>
        <div className="overflow-x-clip">
          <div className="grid grid-cols-[3.25rem_repeat(7,minmax(0,1fr))] gap-px text-[9px]">
            <span />
            {heat.divisions.map((division) => (
              <span key={division.id} className="text-center font-semibold uppercase text-neutral-500">
                {division.label}
              </span>
            ))}
            {heat.rows.map((row) => (
              <div key={row.managerId} className="contents">
                <span className="truncate pr-1 text-[10px] font-medium leading-6 text-neutral-100">
                  {row.managerName}
                </span>
                {row.cells.map((cell) => (
                  <span
                    key={cell.divisionId}
                    title={`${row.managerName} ${cell.divisionId}: ${cell.played > 0 ? formatPpg(cell.ppg) : 'no games'}`}
                    className={`flex h-6 items-center justify-center rounded-sm tabular-nums ${heatmapCellTone(cell.ppg, heat.minPpg, heat.maxPpg, cell.played)}`}
                  >
                    {cell.played > 0 ? formatPpg(cell.ppg) : '-'}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h3 className={`mb-1 ${t.c.sectionHeading}`}>Form vs draft seed</h3>
        <p className="mb-2 text-xs text-neutral-500">
          Club PPG against the average for that draft seed. Punching up or below weight.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-wide text-emerald-400">Punching up</h4>
            <ul className="mt-1 space-y-1 text-xs text-neutral-100">
              {seed.over.length === 0 ? (
                <li className="text-neutral-500">Nobody yet.</li>
              ) : (
                seed.over.map((club) => (
                  <li key={club.code} className="flex justify-between gap-2">
                    <span className="min-w-0 truncate">
                      {club.name}{' '}
                      <span className="text-neutral-500">
                        {draftSlotPlainLabel(club.band, club.rank)} · {club.managerName}
                      </span>
                    </span>
                    <span className="shrink-0 tabular-nums text-emerald-400">{formatSignedPoints(Number(club.delta.toFixed(2)))}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-wide text-red-400">Below weight</h4>
            <ul className="mt-1 space-y-1 text-xs text-neutral-100">
              {seed.under.length === 0 ? (
                <li className="text-neutral-500">Nobody yet.</li>
              ) : (
                seed.under.map((club) => (
                  <li key={club.code} className="flex justify-between gap-2">
                    <span className="min-w-0 truncate">
                      {club.name}{' '}
                      <span className="text-neutral-500">
                        {draftSlotPlainLabel(club.band, club.rank)} · {club.managerName}
                      </span>
                    </span>
                    <span className="shrink-0 tabular-nums text-red-400">{club.delta.toFixed(2)}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
