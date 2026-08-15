'use client';

import type { MatchdayEntry } from '@/app/lib/english-pyramid-scoring';
import { explainMatchdayScoring } from '@/app/lib/english-pyramid-scoring';
import { managerColorForPlayer } from '@/app/lib/sweepstake-manager-colors';
import { useSweepstakeTheme } from '../SweepstakeThemeContext';

function signedPoints(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

function pointsClass(value: number, positive: string, negative: string): string {
  if (value > 0) return positive;
  if (value < 0) return negative;
  return 'text-neutral-400';
}

type Props = {
  entry: MatchdayEntry;
};

export default function MatchScoringExplainPanel({ entry }: Props) {
  const t = useSweepstakeTheme();
  const explanation = explainMatchdayScoring(entry);

  if (!explanation) {
    if (entry.status === 'postponed') {
      return <p className="mt-2 text-xs text-neutral-400">Postponed — no points from this fixture.</p>;
    }
    return (
      <p className="mt-2 text-xs text-neutral-400">
        Not kicked off yet. Points land at full time: 3 home win, 4 away win, 1 draw, −1 for a 0–0,
        plus clean sheet / 3+ scored / reds, minus 3+ conceded.
      </p>
    );
  }

  return (
    <div className="mt-2 space-y-2 rounded-md border border-[#d4af37]/20 bg-[#0a0f1a]/70 px-2.5 py-2 sm:px-3">
      {explanation.live ? (
        <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-400/90">
          Live snapshot — totals lock at full time
        </p>
      ) : (
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#d4af37]/80">
          How this score breaks down
        </p>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        {explanation.sides.map((side) => {
          const managerColor = side.managerIds[0]
            ? managerColorForPlayer(side.managerIds[0], t.id)
            : undefined;
          return (
            <article
              key={side.teamTla}
              className={`min-w-0 ${side.managerLabels.length === 0 ? 'opacity-70' : ''}`}
            >
              <p className="truncate text-xs font-semibold text-neutral-100">
                {side.isHome ? 'Home' : 'Away'} · {side.teamName}
              </p>
              <p className="text-[11px] leading-snug text-neutral-400">
                {side.managerLabels.length > 0 ? (
                  <span style={managerColor ? { color: managerColor } : undefined}>
                    {side.managerLabels.join(' · ')}
                  </span>
                ) : (
                  'No manager — this result doesn't score for anyone'
                )}
              </p>
              <ul className="mt-1 space-y-0.5">
                {side.lines.map((line) => (
                  <li
                    key={`${side.teamTla}-${line.label}`}
                    className="flex items-baseline justify-between gap-3 text-[11px] sm:text-xs"
                  >
                    <span className="min-w-0 text-neutral-300">{line.label}</span>
                    <span
                      className={`shrink-0 font-semibold tabular-nums ${pointsClass(line.points, t.c.positive, t.c.negative)}`}
                    >
                      {signedPoints(line.points)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-1 flex items-baseline justify-between gap-3 border-t border-white/10 pt-1 text-xs font-semibold">
                <span className="text-neutral-200">
                  {side.managerLabels.length > 0 ? 'Total' : 'Would have been'}
                </span>
                <span className={`tabular-nums ${pointsClass(side.total, t.c.positive, t.c.negative)}`}>
                  {side.managerLabels.length > 0
                    ? `${signedPoints(side.total)} pts`
                    : `${signedPoints(side.total)} · doesn't count`}
                </span>
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
