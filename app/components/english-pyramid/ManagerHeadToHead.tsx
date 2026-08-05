'use client';

import type { MatchdayEntry } from '@/app/lib/english-pyramid-scoring';

type Props = {
  entries: MatchdayEntry[];
};

function managerLabel(manager: MatchdayEntry['homeManagers'][number]): string {
  return manager.teamName ?? manager.name;
}

function scoreLabel(entry: MatchdayEntry): string {
  const home =
    entry.status === 'in-play' ? entry.liveHomeGoals : entry.homeGoals;
  const away =
    entry.status === 'in-play' ? entry.liveAwayGoals : entry.awayGoals;
  return home != null && away != null ? `${home}–${away}` : 'v';
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
      className="mt-3 overflow-hidden rounded-lg border border-fuchsia-400/30 bg-gradient-to-br from-fuchsia-950/35 via-[#141f38]/80 to-cyan-950/25"
      aria-labelledby="manager-head-to-head-title"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 sm:px-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fuchsia-300/80">
            Rivalry radar
          </p>
          <h4 id="manager-head-to-head-title" className="text-sm font-bold text-white sm:text-base">
            Manager head-to-head
          </h4>
        </div>
        <span className="rounded-full border border-fuchsia-300/25 bg-fuchsia-400/10 px-2 py-0.5 text-[10px] font-bold text-fuchsia-200">
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
              <div className="min-w-0 text-right">
                <p className="truncate text-xs font-bold text-fuchsia-200 sm:text-sm">
                  {entry.homeManagers.map(managerLabel).join(' · ')}
                </p>
                <p className="truncate text-[10px] text-neutral-300 sm:text-xs">{entry.homeTeam.name}</p>
              </div>
              <div className="text-center">
                <p className="text-base font-black tabular-nums text-white">{scoreLabel(entry)}</p>
                <p className="text-[9px] uppercase tracking-wide text-neutral-500">
                  {entry.status === 'in-play' ? 'Live' : entry.status === 'finished' ? 'FT' : 'KO'}
                </p>
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-cyan-200 sm:text-sm">
                  {entry.awayManagers.map(managerLabel).join(' · ')}
                </p>
                <p className="truncate text-[10px] text-neutral-300 sm:text-xs">{entry.awayTeam.name}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
