'use client';

import type { MatchdayEntry } from '@/app/lib/english-pyramid-scoring';
import { managerColorForPlayer } from '@/app/lib/sweepstake-manager-colors';
import { useSweepstakeTheme } from '../SweepstakeThemeContext';

type Props = {
  entries: MatchdayEntry[];
};

type Manager = MatchdayEntry['homeManagers'][number];

function managerLabel(manager: Manager): string {
  return manager.teamName ?? manager.name;
}

function scoreLabel(entry: MatchdayEntry): string {
  const home =
    entry.status === 'in-play' ? entry.liveHomeGoals : entry.homeGoals;
  const away =
    entry.status === 'in-play' ? entry.liveAwayGoals : entry.awayGoals;
  return home != null && away != null ? `${home}–${away}` : 'v';
}

function ManagerSide({
  managers,
  teamName,
  align,
}: {
  managers: Manager[];
  teamName: string;
  align: 'left' | 'right';
}) {
  const t = useSweepstakeTheme();
  const primaryColor = managers[0] ? managerColorForPlayer(managers[0].id, t.id) : undefined;

  return (
    <div className={`min-w-0 ${align === 'right' ? 'text-right' : 'text-left'}`}>
      <p className="truncate text-xs font-bold sm:text-sm">
        {managers.map((manager, index) => {
          const color = managerColorForPlayer(manager.id, t.id);
          return (
            <span key={`${manager.id}-${manager.teamCode}`}>
              {index > 0 ? <span className="text-neutral-600"> · </span> : null}
              <span style={color ? { color } : undefined}>{managerLabel(manager)}</span>
            </span>
          );
        })}
      </p>
      <p
        className={`mt-0.5 flex items-center gap-1.5 truncate text-[10px] text-neutral-300 sm:text-xs ${
          align === 'right' ? 'justify-end' : 'justify-start'
        }`}
      >
        {align === 'left' ? (
          <span
            className="inline-block h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: primaryColor ?? '#6b7280' }}
            aria-hidden
          />
        ) : null}
        <span className="truncate">{teamName}</span>
        {align === 'right' ? (
          <span
            className="inline-block h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: primaryColor ?? '#6b7280' }}
            aria-hidden
          />
        ) : null}
      </p>
    </div>
  );
}

export default function ManagerHeadToHead({ entries }: Props) {
  const clashes = entries.filter(
    (entry) =>
      entry.homeManagers.length > 0 &&
      entry.awayManagers.length > 0 &&
      entry.homeManagers.some((home) =>
        entry.awayManagers.some((away) => away.id !== home.id)
      )
  );

  if (clashes.length === 0) return null;

  return (
    <section
      className="mt-3 overflow-hidden rounded-lg border border-[#d4af37]/30 bg-[#141f38]/70 [background-image:linear-gradient(135deg,rgba(212,175,55,0.12)_0%,transparent_60%)]"
      aria-labelledby="manager-head-to-head-title"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 sm:px-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]/80">
            Rivalry radar
          </p>
          <h4 id="manager-head-to-head-title" className="text-sm font-bold text-white sm:text-base">
            Manager head-to-head
          </h4>
        </div>
        <span className="rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-2 py-0.5 text-[10px] font-bold text-[#f2d36b]">
          {clashes.length} clash{clashes.length === 1 ? '' : 'es'}
        </span>
      </div>

      <div className="grid gap-2 p-2 sm:grid-cols-2 sm:p-3">
        {clashes.map((entry) => (
          <article
            key={entry.id}
            className="rounded-md border border-white/10 bg-black/25 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
          >
            <div className="grid grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] items-center gap-2">
              <ManagerSide
                managers={entry.homeManagers}
                teamName={entry.homeTeam.name}
                align="right"
              />
              <div className="text-center">
                <p className="text-base font-black tabular-nums text-white">{scoreLabel(entry)}</p>
                <p className="text-[9px] uppercase tracking-wide text-neutral-500">
                  {entry.status === 'in-play' ? 'Live' : entry.status === 'finished' ? 'FT' : 'KO'}
                </p>
              </div>
              <ManagerSide
                managers={entry.awayManagers}
                teamName={entry.awayTeam.name}
                align="left"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
