'use client';

import { useMemo, useState } from 'react';
import type { PlayerStanding } from '@/app/lib/english-pyramid-scoring';
import {
  buildDraftOverachievement,
  draftSlotPlainLabel,
  formatPpg,
  managerBandChartMax,
  type DraftSlotAverage,
} from '@/app/lib/english-pyramid-overachievement';
import { useSweepstakeTheme } from '../SweepstakeThemeContext';

const TITLE_FILL = '#d4af37';
const SURVIVAL_FILL = '#c45c4a';
const DOGS_FILL = '#34d399';
const CHART_HEIGHT = 188;
const PAD = { top: 24, right: 8, bottom: 36, left: 28 };

type Props = {
  standings: PlayerStanding[];
};

function managerLabel(teamName: string | null, name: string): string {
  return teamName ? `${teamName} (${name})` : name;
}

export default function DraftOverachievementChart({ standings }: Props) {
  const t = useSweepstakeTheme();
  const stats = useMemo(() => buildDraftOverachievement(standings), [standings]);
  const [pinnedSlot, setPinnedSlot] = useState<number | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  const selectedSlot = hoveredSlot ?? pinnedSlot;

  if (!stats.playedAny) {
    return (
      <p className="mt-2 text-sm text-neutral-400">
        The dogs-vs-favourites chart fills in once the first results are recorded.
      </p>
    );
  }

  const maxPpg = Math.max(...stats.slots.map((slot) => slot.avgPpg), stats.titlePpg, 0.5);
  const barMax = managerBandChartMax(stats.managers);
  const yMax = maxPpg * 1.15;
  const plotW = 640;
  const plotH = CHART_HEIGHT - PAD.top - PAD.bottom;
  const barGap = 4;
  const barW = (plotW - PAD.left - PAD.right - barGap * 13) / 14;
  const yFor = (ppg: number) => PAD.top + plotH - (ppg / yMax) * plotH;
  const titleLineY = yFor(stats.titlePpg);

  const verdict = stats.dogsOverachieving
    ? `Survival picks are averaging ${formatPpg(stats.survivalPpg)} pts/game against ${formatPpg(stats.titlePpg)} for title picks. The worse teams are overachieving.`
    : `Title picks still lead at ${formatPpg(stats.titlePpg)} pts/game against ${formatPpg(stats.survivalPpg)} for survival picks. The dogs are not overachieving — yet.`;

  return (
    <div className="mt-8 space-y-3">
      <div>
        <h3 className={`mb-1 ${t.c.sectionHeading}`}>Dogs vs favourites</h3>
        <p className="text-sm leading-relaxed text-[#e8dfc8]/90">{verdict}</p>
        <p className="mt-1 text-xs text-neutral-500">
          Each bar is the average fantasy points per game for that draft rank. Title 1 is the
          strongest title favourite. Dog 1 on the far right is the biggest relegation favourite.
          Green bars are dogs beating the title average. Hover or tap a bar to see the seven clubs
          at that rank. Manager Title/Dogs bars below share one scale.
        </p>
      </div>

      <div className={t.c.chartWrap}>
        <svg
          role="group"
          aria-label={verdict}
          viewBox={`0 0 ${plotW} ${CHART_HEIGHT}`}
          className="block h-auto w-full"
        >
          {[0, 0.5, 1].map((frac) => {
            const value = yMax * frac;
            const y = yFor(value);
            return (
              <g key={frac}>
                <line
                  x1={PAD.left}
                  x2={plotW - PAD.right}
                  y1={y}
                  y2={y}
                  stroke="rgba(115,115,115,0.22)"
                  strokeDasharray="4 4"
                />
                <text x={PAD.left - 6} y={y + 3} textAnchor="end" className="fill-neutral-500 text-[9px]">
                  {formatPpg(value)}
                </text>
              </g>
            );
          })}
          {stats.slots.map((slot, index) => {
            const x = PAD.left + index * (barW + barGap);
            const h = Math.max(0, ((slot.avgPpg / yMax) * plotH) || 0);
            const punching = slot.band === 'survival' && slot.avgPpg > stats.titlePpg && slot.played > 0;
            const fill =
              slot.band === 'title' ? TITLE_FILL : punching ? DOGS_FILL : SURVIVAL_FILL;
            const selected = selectedSlot === slot.slotIndex;
            const label = draftSlotPlainLabel(slot.band, slot.rank);
            return (
              <g
                key={slot.slotLabel}
                role="button"
                tabIndex={0}
                aria-pressed={selected}
                aria-label={`${label}, ${formatPpg(slot.avgPpg)} points per game. Hover or tap to see the managers.`}
                className="cursor-pointer"
                onPointerEnter={(event) => {
                  if (event.pointerType === 'mouse') setHoveredSlot(slot.slotIndex);
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType === 'mouse') setHoveredSlot(null);
                }}
                onClick={() =>
                  setPinnedSlot((current) => (current === slot.slotIndex ? null : slot.slotIndex))
                }
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' && event.key !== ' ') return;
                  event.preventDefault();
                  setPinnedSlot((current) => (current === slot.slotIndex ? null : slot.slotIndex));
                }}
              >
                <rect
                  x={x - 1}
                  y={PAD.top}
                  width={barW + 2}
                  height={plotH}
                  fill="transparent"
                />
                <rect
                  x={x}
                  y={yFor(slot.avgPpg)}
                  width={barW}
                  height={h}
                  rx={2}
                  fill={fill}
                  opacity={slot.played > 0 ? 1 : 0.25}
                  stroke={selected ? '#f5e2a3' : 'transparent'}
                  strokeWidth={selected ? 1.5 : 0}
                />
                <text
                  x={x + barW / 2}
                  y={CHART_HEIGHT - 8}
                  textAnchor="middle"
                  className={`text-[9px] font-semibold ${selected ? 'fill-[#f5e2a3]' : 'fill-neutral-400'}`}
                >
                  {slot.rank}
                </text>
              </g>
            );
          })}
          <text
            x={PAD.left + (7 * (barW + barGap) - barGap) / 2}
            y={14}
            textAnchor="middle"
            className="fill-[#d4af37] text-[9px] font-semibold"
          >
            Title picks
          </text>
          <text
            x={PAD.left + 7 * (barW + barGap) + (7 * (barW + barGap) - barGap) / 2}
            y={14}
            textAnchor="middle"
            className="fill-[#34d399] text-[9px] font-semibold"
          >
            Relegation dogs
          </text>
          <line
            x1={PAD.left + 7 * (barW + barGap) - barGap / 2}
            x2={PAD.left + 7 * (barW + barGap) - barGap / 2}
            y1={PAD.top}
            y2={PAD.top + plotH}
            stroke="rgba(232,223,200,0.18)"
          />
          <line
            x1={PAD.left}
            x2={plotW - PAD.right}
            y1={titleLineY}
            y2={titleLineY}
            stroke="rgba(212,175,55,0.7)"
            strokeDasharray="5 4"
          />
          <text
            x={PAD.left + 4}
            y={titleLineY - 4}
            className="fill-[#d4af37]/85 text-[9px]"
          >
            Title avg {formatPpg(stats.titlePpg)}
          </text>
        </svg>
        <SlotBreakdown
          slot={selectedSlot == null ? null : stats.slots[selectedSlot] ?? null}
          titlePpg={stats.titlePpg}
        />
        <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-[#d4af37]/15 px-3 py-2 text-[10px] text-neutral-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: TITLE_FILL }} />
            Title picks (1 = strongest favourite)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: SURVIVAL_FILL }} />
            Relegation dogs (1 = most likely down)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: DOGS_FILL }} />
            Survival beating title average
          </span>
        </div>
      </div>

      <ul className="grid gap-1.5 sm:grid-cols-2">
        {stats.managers.map((row) => {
          const label = row.teamName ? `${row.teamName} (${row.managerName})` : row.managerName;
          return (
            <li
              key={row.managerId}
              className="rounded-md border border-[#d4af37]/15 bg-[#0a0f1a]/40 px-2.5 py-2"
            >
              <div className="flex items-baseline justify-between gap-2 text-[11px]">
                <span className="truncate font-medium text-[#e8dfc8]">{label}</span>
                {row.dogsAhead ? (
                  <span className="shrink-0 font-semibold text-emerald-400">Dogs ahead</span>
                ) : (
                  <span className="shrink-0 text-neutral-500">Title ahead</span>
                )}
              </div>
              <div className="mt-1.5 space-y-1">
                <SeedBar label="Title" value={row.titlePpg} max={barMax} color={TITLE_FILL} />
                <SeedBar label="Dogs" value={row.survivalPpg} max={barMax} color={row.dogsAhead ? DOGS_FILL : SURVIVAL_FILL} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SlotBreakdown({
  slot,
  titlePpg,
}: {
  slot: DraftSlotAverage | null;
  titlePpg: number;
}) {
  if (!slot) {
    return (
      <p className="border-t border-[#d4af37]/15 px-3 py-2 text-[11px] text-neutral-500">
        Hover or tap a bar to see the managers and clubs at that rank.
      </p>
    );
  }

  const punching = slot.band === 'survival' && slot.avgPpg > titlePpg && slot.played > 0;
  return (
    <div className="border-t border-[#d4af37]/15 px-3 py-2.5">
      <p className="text-xs font-semibold text-[#f5e2a3]">
        {draftSlotPlainLabel(slot.band, slot.rank)}
        <span className="ml-1.5 font-normal text-neutral-400">
          {formatPpg(slot.avgPpg)} pts/game
          {punching ? ' · beating the title average' : ''}
        </span>
      </p>
      <ul className="mt-1.5 space-y-1">
        {slot.clubRows.map((club) => (
          <li
            key={`${club.managerId}-${club.code}`}
            className="flex items-baseline justify-between gap-2 text-[11px] text-neutral-100"
          >
            <span className="min-w-0 truncate">
              <span className="font-medium text-[#e8dfc8]">{managerLabel(club.teamName, club.managerName)}</span>
              <span className="text-neutral-400"> · {club.name}</span>
            </span>
            <span className="shrink-0 tabular-nums text-neutral-300">{formatPpg(club.ppg)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SeedBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const width = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="w-10 shrink-0 text-[10px] uppercase tracking-wide text-neutral-500">{label}</span>
      <div className="h-1.5 min-w-0 flex-1 rounded-full bg-neutral-800">
        <div className="h-1.5 rounded-full" style={{ width: `${width}%`, backgroundColor: color }} />
      </div>
      <span className="w-10 shrink-0 text-right text-[10px] tabular-nums text-neutral-300">
        {formatPpg(value)}
      </span>
    </div>
  );
}
