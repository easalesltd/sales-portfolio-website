"use client";

import { useState } from "react";
import { BakerScoreSheet } from "@/app/components/gbbo/BakerScoreSheet";
import { Card, Pill, ScoreBadge } from "@/app/components/gbbo/ui";
import { gbboSlug } from "@/app/lib/gbbo/identity";
import { bakerEliminatedIn, companionsOwningBaker } from "@/app/lib/gbbo/league";
import { WEEK_THEMES } from "@/app/lib/gbbo/seed";
import { bakerLedger, bakerScoreSummary } from "@/app/lib/gbbo/stats";
import { useLeague } from "@/app/lib/gbbo/store";
import { teamWindow } from "@/app/lib/gbbo/window";
import type { Baker, LeagueState } from "@/app/lib/gbbo/types";

function officialProfile(name: string) {
  return `https://thegreatbritishbakeoff.co.uk/bakers/series-17-${gbboSlug(name)}/`;
}

function BakerCard({
  baker,
  week,
  owners,
  league,
}: {
  baker: Baker;
  week: number | null;
  owners: string[];
  league: LeagueState;
}) {
  const [open, setOpen] = useState(false);
  const out = Boolean(week);
  const theme = week ? WEEK_THEMES[week - 1] : null;
  const ledger = bakerLedger(league, baker.id);

  return (
    <article className={`paper-card overflow-hidden rounded-[28px] border border-[#e7d3b4] ${out ? "gbbo-baker-out" : ""}`}>
      <button
        type="button"
        className="relative aspect-square w-full bg-[#efe2c8] text-left"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={`${open ? "Hide" : "Show"} ${baker.name}'s scores`}
      >
        {baker.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={baker.photo} alt={baker.name} className="h-full w-full object-cover object-top" />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-6xl text-tent-dark/40">
            {baker.name.slice(0, 1)}
          </div>
        )}
        {out ? (
          <div className="pointer-events-none absolute inset-0 bg-[#2b2118]/25">
            <p className="gbbo-baker-stamp absolute left-1/2 top-1/2 w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#fffaf2]/80 px-3 py-2 text-center text-xs font-black uppercase">
              Left week {week}
              {theme ? <span className="mt-1 block tracking-normal">{theme} Week</span> : null}
            </p>
          </div>
        ) : (
          <span className="absolute left-3 top-3 rounded-full bg-tent px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-flour">
            Still baking
          </span>
        )}
      </button>
      <div className="space-y-3 p-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h2 className="min-w-0 font-display text-3xl leading-none text-tent-dark">{baker.name}</h2>
            <ScoreBadge value={ledger.points} className="shrink-0" />
          </div>
          <p className="mt-1 text-sm text-chocolate/70">
            {baker.age ? `${baker.age}, ` : ""}
            {baker.hometown}
          </p>
          <div className="mt-2">
            <Pill tone={out ? "raspberry" : "tent"}>{out ? "Eliminated" : baker.job}</Pill>
          </div>
        </div>
        <p className="text-sm leading-7 text-chocolate/80">{baker.bio}</p>
        {!open ? <p className="text-sm leading-7 text-chocolate/70">{bakerScoreSummary(ledger)}</p> : null}
        {owners.length ? (
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-chocolate/50">
            {out ? "Was in" : "In"}{" "}
            {owners.length === 1
              ? `${owners[0]}'s tent`
              : `${owners.slice(0, -1).join(", ")} and ${owners[owners.length - 1]}'s tents`}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="text-sm font-bold text-tent underline decoration-2 underline-offset-4"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
          >
            {open ? "Hide the numbers" : "How they scored"}
          </button>
          <a
            className="inline-block text-sm font-bold text-tent underline decoration-2 underline-offset-4"
            href={officialProfile(baker.name)}
            target="_blank"
            rel="noreferrer"
          >
            Official profile
          </a>
        </div>
        {open ? (
          <div className="border-t border-[#e7d3b4] pt-4">
            <BakerScoreSheet ledger={ledger} />
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function BakersPage() {
  const { league, loaded } = useLeague();
  if (!loaded) return <p className="font-script text-3xl text-raspberry">Counting the crumbs…</p>;
  const gate = teamWindow(new Date(), league.totalWeeks);
  const rows = [...league.bakers]
    .map((baker) => ({
      baker,
      week: bakerEliminatedIn(league, baker.id),
      owners: companionsOwningBaker(league, baker.id, gate.week).map((companion) => companion.name),
    }))
    .sort((a, b) => {
      if (Boolean(a.week) !== Boolean(b.week)) return a.week ? 1 : -1;
      if (a.week && b.week && a.week !== b.week) return a.week - b.week;
      return a.baker.name.localeCompare(b.baker.name);
    });
  const stillIn = rows.filter((row) => !row.week);
  const gone = rows.filter((row) => row.week);

  return (
    <div className="space-y-6">
      <Card eyebrow="Class of 2026" title="This year's bakers">
        <p className="max-w-3xl text-sm leading-7 text-chocolate/75">
          The twelve amateurs in the Series 17 tent. Tap <strong>How they scored</strong> on a baker
          to see the ledger: handshakes, technicals, drops, tears and the rest.
          When you score an elimination, their portrait greys out and gets a week stamp so the tent here matches the telly.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Pill tone="tent">{stillIn.length} still baking</Pill>
          <Pill tone="raspberry">{gone.length} left the tent</Pill>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stillIn.map((row) => (
          <BakerCard key={row.baker.id} baker={row.baker} week={row.week} owners={row.owners} league={league} />
        ))}
      </div>

      {gone.length ? (
        <>
          <Card eyebrow="Gone but not forgotten" title="Left the tent">
            <p className="text-sm leading-7 text-chocolate/75">
              Stamped in the week they were sent home.
            </p>
          </Card>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {gone.map((row) => (
              <BakerCard key={row.baker.id} baker={row.baker} week={row.week} owners={row.owners} league={league} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
