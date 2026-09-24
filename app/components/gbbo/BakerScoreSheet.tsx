import { bakerCategoryBars, bakerScoreSummary, type BakerLedger } from "@/app/lib/gbbo/stats";
import { FormBars, SignedBar } from "./StatBars";
import { Pill, Points } from "./ui";

export function BakerScoreSheet({ ledger, compact = false }: { ledger: BakerLedger; compact?: boolean }) {
  const categories = bakerCategoryBars(ledger);
  const categoryMax = Math.max(1, ...categories.map((row) => Math.abs(row.points)));
  const hasScores = ledger.weeks.some((week) => week.lines.length > 0 || week.points !== 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-xl text-sm leading-7 text-chocolate/80">{bakerScoreSummary(ledger)}</p>
        <Points value={ledger.points} />
      </div>

      {hasScores ? (
        <>
          {!compact ? <FormBars weeks={ledger.weeks} /> : null}
          {categories.length ? (
            <div className="space-y-3">
              {categories.map((row) => (
                <SignedBar key={row.label} label={row.label} value={row.points} max={categoryMax} />
              ))}
            </div>
          ) : null}
          <div className="space-y-3">
            {ledger.weeks.map((week) => (
              <div key={week.week}>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-chocolate/50">
                  Week {week.week} · {week.theme}
                </p>
                {week.lines.length ? (
                  <ul className="space-y-1">
                    {week.lines.map((line) => (
                      <li key={`${week.week}-${line.label}`} className="flex items-start justify-between gap-3 text-sm">
                        <span className="text-chocolate/80">{line.label}</span>
                        <span className={`shrink-0 font-bold ${line.points < 0 ? "text-raspberry" : "text-tent"}`}>
                          {line.points > 0 ? "+" : ""}
                          {line.points}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-chocolate/60">Did nothing the scorers care about.</p>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-chocolate/60">No published scores yet. The ledger starts once a week is in.</p>
      )}

      <div className="flex flex-wrap gap-2">
        {ledger.starBaker ? <Pill tone="butter">Star Baker ×{ledger.starBaker}</Pill> : null}
        {ledger.handshakes ? <Pill tone="tent">Handshake ×{ledger.handshakes}</Pill> : null}
        {ledger.innuendos ? <Pill tone="butter">Nigella ×{ledger.innuendos}</Pill> : null}
        {ledger.drops ? <Pill tone="raspberry">Drops ×{ledger.drops}</Pill> : null}
        {ledger.cries ? <Pill tone="raspberry">Cries ×{ledger.cries}</Pill> : null}
        {ledger.technicalLast ? <Pill tone="raspberry">Last in technical ×{ledger.technicalLast}</Pill> : null}
        {ledger.technicalFirst ? <Pill tone="tent">Won technical ×{ledger.technicalFirst}</Pill> : null}
      </div>
    </div>
  );
}