"use client";

import { FormBars, SignedBar } from "@/app/components/gbbo/StatBars";
import { Card, Empty, Pill, Points } from "@/app/components/gbbo/ui";
import {
  bakerLedgers,
  chargeSheet,
  companionForm,
  funnyLeagueStats,
} from "@/app/lib/gbbo/stats";
import { useLeague } from "@/app/lib/gbbo/store";

export default function WeighInPage() {
  const { league, loaded } = useLeague();
  if (!loaded) return <p className="font-script text-3xl text-raspberry">Weighing the sponges…</p>;

  const ledgers = bakerLedgers(league);
  const awards = funnyLeagueStats(league);
  const companions = companionForm(league);
  const sheet = chargeSheet(league);
  const glory = sheet.filter((row) => row.points > 0).sort((a, b) => b.points - a.points);
  const crimes = sheet.filter((row) => row.points < 0).sort((a, b) => a.points - b.points);
  const bakerMax = Math.max(1, ...ledgers.map((row) => Math.abs(row.points)));
  const companionMax = Math.max(1, ...companions.map((row) => Math.abs(row.total)));
  const published = league.episodes.filter((episode) => episode.published);
  const dropKings = [...ledgers].sort((a, b) => b.drops - a.drops || a.name.localeCompare(b.name));
  const cryKings = [...ledgers].sort((a, b) => b.cries - a.cries || a.name.localeCompare(b.name));
  const gloryPoints = ledgers.reduce((sum, row) => sum + row.plus, 0);
  const disasterPoints = ledgers.reduce((sum, row) => sum + row.minus, 0);
  const totalDrops = ledgers.reduce((sum, row) => sum + row.drops, 0);
  const totalCries = ledgers.reduce((sum, row) => sum + row.cries, 0);
  const totalHandshakes = ledgers.reduce((sum, row) => sum + row.handshakes, 0);

  if (published.length === 0) {
    return (
      <Empty
        title="The scales are still empty"
        body="Once Cake Week is published, this page will become unreasonably interested in every crumb."
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card eyebrow="The Spreadsheet of Shame" title="The Weigh-In">
        <p className="max-w-3xl text-sm leading-7 text-chocolate/75">
          Every published point, tear, drop and handshake, weighed like a slightly dry Madeira.
          If a baker is scoring well, this page will flatter them. If they are scoring badly,
          it will name the crime.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Pill tone="tent">{published.length} week{published.length === 1 ? "" : "s"} scored</Pill>
          <Pill tone="butter">{gloryPoints > 0 ? "+" : ""}{gloryPoints} from glory</Pill>
          <Pill tone="raspberry">{disasterPoints} from disaster</Pill>
          <Pill>{totalDrops} things on the floor</Pill>
          <Pill>{totalCries} crying fits</Pill>
          <Pill>{totalHandshakes} Hollywood handshake{totalHandshakes === 1 ? "" : "s"}</Pill>
        </div>
      </Card>

      {awards.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {awards.map((award) => (
            <article key={award.id} className="paper-card rounded-[28px] border border-[#e7d3b4] p-5">
              <p className="font-script text-2xl text-raspberry">{award.eyebrow}</p>
              <div className="mt-1 flex items-end justify-between gap-3">
                <h2 className="font-display text-3xl leading-none text-tent-dark">{award.title}</h2>
                <span className="shrink-0 font-display text-2xl text-chocolate">{award.value}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-chocolate/75">{award.body}</p>
            </article>
          ))}
        </div>
      ) : null}

      <Card eyebrow="The baker table" title="Who is actually any good">
        <p className="mb-5 text-sm leading-7 text-chocolate/75">
          Total fantasy points from published weeks, with the mess that got them there.
        </p>
        <div className="space-y-4">
          {ledgers.map((ledger) => (
            <div key={ledger.bakerId}>
              <SignedBar label={ledger.name} value={ledger.points} max={bakerMax} />
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-chocolate/45">
                {ledger.drops ? `${ledger.drops} drop${ledger.drops === 1 ? "" : "s"} · ` : ""}
                {ledger.cries ? `${ledger.cries} cr${ledger.cries === 1 ? "y" : "ies"} · ` : ""}
                {ledger.handshakes ? `${ledger.handshakes} handshake${ledger.handshakes === 1 ? "" : "s"} · ` : ""}
                {ledger.eliminatedInWeek ? `left week ${ledger.eliminatedInWeek}` : "still in"}
                {ledger.owners.length ? ` · owned by ${ledger.owners.join(", ")}` : ""}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card eyebrow="Companion form" title="Who drafted the mess">
        <p className="mb-5 text-sm leading-7 text-chocolate/75">
          Week-by-week companion scores, including any joker. This is the same table as the league,
          drawn as if it were a very serious sport.
        </p>
        <div className="space-y-4">
          {companions.map((row) => (
            <SignedBar key={row.companionId} label={row.name} value={row.total} max={companionMax} />
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {companions.map((row) => (
            <div key={`${row.companionId}-form`} className="rounded-2xl border border-[#e7d3b4] bg-flour/60 p-4">
              <div className="mb-3 flex items-end justify-between">
                <p className="font-display text-2xl text-tent-dark">{row.name}</p>
                <Points value={row.total} />
              </div>
              <FormBars weeks={row.weeks} />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card eyebrow="Honours board" title="The good stuff">
          {glory.length ? (
            <ul className="space-y-2">
              {glory.map((row) => (
                <li key={`${row.week}-${row.label}`} className="flex items-start justify-between gap-3 text-sm">
                  <span className="text-chocolate/80">
                    <span className="font-bold text-chocolate">{row.baker}</span>
                    {` · W${row.week} ${row.theme} · ${row.label}`}
                  </span>
                  <span className="shrink-0 font-bold text-tent">+{row.points}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-chocolate/60">Nobody has done anything Hollywood would shake hands over.</p>
          )}
        </Card>
        <Card eyebrow="The charge sheet" title="Drops, tears and other crimes">
          {crimes.length ? (
            <ul className="space-y-2">
              {crimes.map((row) => (
                <li key={`${row.week}-${row.label}`} className="flex items-start justify-between gap-3 text-sm">
                  <span className="text-chocolate/80">
                    <span className="font-bold text-chocolate">{row.baker}</span>
                    {` · W${row.week} ${row.theme} · ${row.label}`}
                  </span>
                  <span className="shrink-0 font-bold text-raspberry">{row.points}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-chocolate/60">A suspiciously clean tent. Someone is lying.</p>
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card eyebrow="Health and safety" title="Things sent to the floor">
          <ul className="space-y-2">
            {dropKings.map((ledger) => (
              <li key={ledger.bakerId} className="flex items-center justify-between gap-3 text-sm">
                <span className="font-bold text-chocolate">{ledger.name}</span>
                <span className={ledger.drops ? "font-bold text-raspberry" : "text-chocolate/45"}>
                  {ledger.drops} drop{ledger.drops === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card eyebrow="Bring a tissue" title="The waterworks table">
          <ul className="space-y-2">
            {cryKings.map((ledger) => (
              <li key={ledger.bakerId} className="flex items-center justify-between gap-3 text-sm">
                <span className="font-bold text-chocolate">{ledger.name}</span>
                <span className={ledger.cries ? "font-bold text-raspberry" : "text-chocolate/45"}>
                  {ledger.cries} cr{ledger.cries === 1 ? "y" : "ies"}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}