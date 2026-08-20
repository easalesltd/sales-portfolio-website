'use client';

import { useMemo } from 'react';
import type { PlayerStanding } from '@/app/lib/english-pyramid-scoring';
import {
  buildDraftOverachievement,
  formatPpg,
} from '@/app/lib/english-pyramid-overachievement';
import { useSweepstakeTheme } from '../SweepstakeThemeContext';

const TITLE_FILL = '#d4af37';
const SURVIVAL_FILL = '#c45c4a';
const DOGS_FILL = '#34d399';
const CHART_HEIGHT = 168;
const PAD = { top: 12, right: 8, bottom: 28, left: 28 };

type Props = {
  standings: PlayerStanding[];
};

export default function DraftOverachievementChart({ standings }: Props) {
  const t = useSweepstakeTheme();
  const stats = useMemo(() => buildDraftOverachievement(standings), [standings]);

  if (!stats.playedAny) {
    return (
      <p className="mt-2 text-sm text-neutral-400">
        The dogs-vs-favourites chart fills in once the first results are recorded.
      </p>
    );
  }

  const maxPpg = Math.max(...stats.slots.map((slot) => slot.avgPpg), stats.titlePpg, 0.5);
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
          Bars are average fantasy points per game at each draft seed. Left is title #1; right is
          relegation favourite (R1). Green survival bars sit above the title average — those seeds
          are punching up.
        </p>
      </div>

      <div className={t.c.chartWrap}>
        <svg
          role="img"
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
            return (
              <g key={slot.slotLabel}>
                <rect
                  x={x}
                  y={yFor(slot.avgPpg)}
                  width={barW}
                  height={h}
                  rx={2}
                  fill={fill}
                  opacity={slot.played > 0 ? 1 : 0.25}
                />
                <text
                  x={x + barW / 2}
                  y={CHART_HEIGHT - 8}
                  textAnchor="middle"
                  className="fill-neutral-400 text-[9px] font-semibold"
                >
                  {slot.slotLabel}
                </text>
              </g>
            );
          })}
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
        <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-[#d4af37]/15 px-3 py-2 text-[10px] text-neutral-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: TITLE_FILL }} />
            Title seeds
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: SURVIVAL_FILL }} />
            Survival seeds
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
          const max = Math.max(row.titlePpg, row.survivalPpg, 0.01);
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
                <SeedBar label="Title" value={row.titlePpg} max={max} color={TITLE_FILL} />
                <SeedBar label="Dogs" value={row.survivalPpg} max={max} color={row.dogsAhead ? DOGS_FILL : SURVIVAL_FILL} />
              </div>
            </li>
          );
        })}
      </ul>

      {stats.punchingUp.length > 0 ? (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#d4af37]/80">
            Survival clubs beating the title average
          </p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {stats.punchingUp.slice(0, 10).map((club) => (
              <li
                key={`${club.managerId}-${club.code}`}
                className="rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-0.5 text-[11px] text-emerald-200"
              >
                {club.name} · {formatPpg(club.ppg)} ppg
                <span className="text-emerald-200/60"> · {club.managerName}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-xs text-neutral-500">No survival club is beating the title-pick average yet.</p>
      )}
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
  const width = Math.max(4, (value / max) * 100);
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
