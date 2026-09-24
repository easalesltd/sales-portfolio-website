import { bakerLedger, bakerScoreSummary, type BakerLedger } from "@/app/lib/gbbo/stats";
import type { LeagueState } from "@/app/lib/gbbo/types";
import { FormBars, SignedBar } from "./StatBars";
import { Pill, Points, ScoreBadge } from "./ui";

export function TeamFormGuide({
  league,
  bakerIds,
}: {
  league: LeagueState;
  bakerIds: string[];
}) {
  const ledgers = bakerIds.filter(Boolean).map((bakerId) => bakerLedger(league, bakerId));
  if (ledgers.length === 0) {
    return (
      <p className="mt-5 text-sm text-chocolate/60">
        Pick bakers and their Cake Week numbers will appear here.
      </p>
    );
  }

  const max = Math.max(1, ...ledgers.map((row) => Math.abs(row.points)));
  const total = ledgers.reduce((sum, row) => sum + row.points, 0);
  const drops = ledgers.reduce((sum, row) => sum + row.drops, 0);
  const cries = ledgers.reduce((sum, row) => sum + row.cries, 0);

  return (
    <div className="mt-6 space-y-5 border-t border-[#e7d3b4] pt-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-script text-2xl text-raspberry">How they are doing</p>
          <h3 className="font-display text-2xl text-tent-dark">Your selected bakers</h3>
        </div>
        <Points value={total} />
      </div>
      <p className="text-sm leading-7 text-chocolate/75">
        Combined baker score so far, before any joker.{" "}
        {drops || cries
          ? `This lot have dropped ${drops} thing${drops === 1 ? "" : "s"} and cried ${cries} time${cries === 1 ? "" : "s"}.`
          : "No drops, no tears. Unnaturally tidy."}
      </p>
      <div className="space-y-3">
        {ledgers.map((ledger) => (
          <SignedBar key={ledger.bakerId} label={ledger.name} value={ledger.points} max={max} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {ledgers.map((ledger) => (
          <BakerMiniForm key={ledger.bakerId} ledger={ledger} />
        ))}
      </div>
    </div>
  );
}

function BakerMiniForm({ ledger }: { ledger: BakerLedger }) {
  return (
    <div className="rounded-2xl border border-[#e7d3b4] bg-flour/60 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-2xl text-tent-dark">{ledger.name}</p>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-chocolate/50">
            {ledger.eliminatedInWeek ? `Left week ${ledger.eliminatedInWeek}` : "Still baking"}
          </p>
        </div>
        <ScoreBadge value={ledger.points} className="shrink-0" />
      </div>
      <FormBars weeks={ledger.weeks} />
      <p className="mt-3 text-sm leading-6 text-chocolate/75">{bakerScoreSummary(ledger)}</p>
      <div className="mt-3 space-y-2">
        {ledger.weeks.flatMap((week) =>
          week.lines.map((line) => (
            <p key={`${week.week}-${line.label}`} className="flex items-start justify-between gap-3 text-sm">
              <span className="text-chocolate/80">{line.label}</span>
              <span className={`shrink-0 font-bold ${line.points < 0 ? "text-raspberry" : "text-tent"}`}>
                {line.points > 0 ? "+" : ""}
                {line.points}
              </span>
            </p>
          )),
        )}
        {ledger.weeks.every((week) => week.lines.length === 0) ? (
          <p className="text-sm text-chocolate/60">No scoring events yet.</p>
        ) : null}
      </div>
      {ledger.drops || ledger.cries ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {ledger.drops ? <Pill tone="raspberry">{ledger.drops} drop{ledger.drops === 1 ? "" : "s"}</Pill> : null}
          {ledger.cries ? <Pill tone="raspberry">{ledger.cries} cr{ledger.cries === 1 ? "y" : "ies"}</Pill> : null}
        </div>
      ) : null}
    </div>
  );
}