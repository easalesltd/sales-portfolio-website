'use client';

import type { AwardedRedCard } from '@/app/lib/english-pyramid-scoring';
import {
  awardedRedCardTotals,
  describeAwardedRedCard,
} from '@/app/lib/english-pyramid-scoring';
import { formatSweepstakeWeekdayDate, sweepstakeLondonDayKey } from '@/app/lib/sweepstake-datetime';
import { managerColorForPlayer } from '@/app/lib/sweepstake-manager-colors';
import TeamRedCardMarker from './TeamRedCardMarker';

type Props = {
  awards: readonly AwardedRedCard[];
};

function groupByLondonDay(awards: readonly AwardedRedCard[]): {
  dayKey: string;
  label: string;
  awards: AwardedRedCard[];
}[] {
  const groups: { dayKey: string; label: string; awards: AwardedRedCard[] }[] = [];
  const indexByDay = new Map<string, number>();

  for (const award of awards) {
    const dayKey = sweepstakeLondonDayKey(award.utcDate);
    const existing = indexByDay.get(dayKey);
    if (existing == null) {
      indexByDay.set(dayKey, groups.length);
      groups.push({
        dayKey,
        label: formatSweepstakeWeekdayDate(award.utcDate),
        awards: [award],
      });
    } else {
      groups[existing].awards.push(award);
    }
  }

  return groups;
}

export default function OfficialStatementRedCards({ awards }: Props) {
  if (awards.length === 0) return null;

  const totals = awardedRedCardTotals(awards);
  const matchLabel = totals.matches === 1 ? '1 match' : `${totals.matches} matches`;
  const dismissalLabel =
    totals.dismissals === 1 ? '1 dismissal' : `${totals.dismissals} dismissals`;
  const pointLabel =
    totals.scoringPoints === 1 ? '1 point' : `${totals.scoringPoints} points`;

  return (
    <div className="mt-3 border-t border-[#d4af37]/25 pt-3">
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#d4af37]">
        Red cards awarded
      </h4>
      <p className="mt-1.5 text-sm leading-relaxed text-neutral-100">
        Every dismissal in the ledger. Sweepstake clubs score plus 1 each. Clubs with no manager
        do not score. Unverified lower-league reds are marked.
      </p>
      <p className="mt-1 text-xs text-neutral-400">
        {dismissalLabel} in {matchLabel}. Sweepstake clubs have {pointLabel} from reds.
      </p>
      <div className="mt-2.5 space-y-3">
        {groupByLondonDay(awards).map((group) => (
          <section key={group.dayKey} aria-label={group.label}>
            <h5 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#e8dfc8]/80">
              {group.label}
            </h5>
            <ul className="mt-1 space-y-1.5">
              {group.awards.map((award) => {
                const manager = award.managers[0];
                const managerColor = manager
                  ? managerColorForPlayer(manager.id, 'english-pyramid')
                  : undefined;
                return (
                  <li
                    key={`${award.matchId}-${award.team.tla}`}
                    className="rounded-md border border-white/10 bg-[#0a0f1a]/60 px-2.5 py-1.5 text-sm leading-snug text-neutral-100"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p>{describeAwardedRedCard(award)}</p>
                      <TeamRedCardMarker count={award.redCards} className="mt-0.5" />
                    </div>
                    <p className="mt-0.5 text-[11px] text-neutral-400">
                      {manager ? (
                        <span style={managerColor ? { color: managerColor } : undefined}>
                          {manager.name}
                        </span>
                      ) : (
                        'No manager'
                      )}
                      {' · '}
                      {award.points > 0 ? `plus ${award.points}` : 'does not score'}
                      {award.redsUnchecked ? ' · reds unchecked' : ''}
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
