"use client";

import { useMemo, useState } from "react";
import { bakerName, bakerStillIn, carriedTeam, jokerForCompanion, lineupChanges, selectableBakers, sideConfirmed, teamForWeek, teamSizeForWeek } from "@/app/lib/gbbo/league";
import { gbboSlug } from "@/app/lib/gbbo/identity";
import { useLeague } from "@/app/lib/gbbo/store";
import type { Companion } from "@/app/lib/gbbo/types";
import { Button, Pill } from "./ui";

function padLineup(bakerIds: string[], size: number): string[] {
  const next = bakerIds.slice(0, size);
  while (next.length < size) next.push("");
  return next;
}

export function TeamSideForm({
  companion,
  week,
  locked,
  lockReason,
}: {
  companion: Companion;
  week: number;
  locked: boolean;
  lockReason?: string;
}) {
  const { league, submitSide } = useLeague();
  const size = teamSizeForWeek(league, week);
  const remaining = selectableBakers(league, week);
  const lastWeek = week > 1 ? teamForWeek(league, companion.id, week - 1) : carriedTeam(league, companion.id, 1);
  const defaultLineup = useMemo(() => {
    const carried = carriedTeam(league, companion.id, week);
    const current = teamForWeek(league, companion.id, week);
    return padLineup(current.length >= carried.length ? current : carried, size);
  }, [league, companion.id, week, size]);
  const [picks, setPicks] = useState<string[] | null>(null);
  const [message, setMessage] = useState("");
  const proposed = picks ?? defaultLineup;
  const filled = proposed.filter(Boolean);
  const unique = new Set(filled);
  const livingLast = lastWeek.filter((id) => bakerStillIn(league, id, week));
  const changes = lineupChanges(livingLast, filled);
  const shrinking = livingLast.length > size;
  const legal = unique.size === filled.length && filled.length === size && (week === 1 ? changes <= 3 : changes <= 1);
  const shrinkingOk = shrinking && filled.length === size && unique.size === size && changes === 0;
  const canSubmit = !locked && (legal || shrinkingOk);
  const submitted = sideConfirmed(league, companion.id, week);
  const joker = jokerForCompanion(league, companion.id);
  const canJoker = !locked && week <= 4 && !joker;
  const [whyOpen, setWhyOpen] = useState(false);

  const blockReason = locked
    ? (lockReason ?? "The change window is closed, so Submit is unavailable.")
    : unique.size !== filled.length
      ? "The same baker is in two slots. Each baker can only appear once."
      : filled.length !== size
        ? `Choose ${size} different bakers still in the tent before you can submit.`
        : week > 1 && changes > 1
          ? `${changes} bakers are different from last week. Only one substitution is allowed, so put one of last week's bakers back.`
          : null;

  function setSlot(index: number, bakerId: string) {
    setPicks((current) => {
      const next = [...(current ?? defaultLineup)];
      next[index] = bakerId;
      return next;
    });
  }

  return (
    <section className="paper-card overflow-hidden rounded-[28px] border border-[#e7d3b4]">
      {companion.photo ? (
        <div className="relative aspect-[4/3] bg-[#efe2c8] sm:aspect-[16/10]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={companion.photo}
            alt={companion.name}
            className="h-full w-full object-cover object-[center_18%]"
          />
        </div>
      ) : null}
      <div className="p-6">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {!companion.photo ? (
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-tent font-display text-2xl text-flour">
              {companion.name.slice(0, 1)}
            </span>
          ) : null}
          <h2 className="font-display text-3xl tracking-tight text-tent-dark">{companion.name}</h2>
        </div>
        {submitted ? <Pill tone="tent">Submitted</Pill> : <Pill>Rolled forward</Pill>}
      </header>
      <p className="mb-3 text-sm text-chocolate/65">
        Last week: {lastWeek.map((id) => bakerName(league, id)).join(" · ") || "No side yet"}
      </p>
      <div className="space-y-2">
        {proposed.map((bakerId, index) => (
          locked ? (
            <p key={`${companion.id}-${index}`} className="rounded-2xl border border-[#e7d3b4] bg-flour px-4 py-2.5">
              {bakerId ? bakerName(league, bakerId) : `Baker ${index + 1}`}
            </p>
          ) : (
            <select
              key={`${companion.id}-${index}`}
              className="w-full rounded-2xl border border-[#e7d3b4] bg-flour px-4 py-2.5 outline-none ring-butter/70 focus:ring-4"
              value={bakerId}
              onChange={(event) => setSlot(index, event.target.value)}
            >
              <option value="">{`Baker ${index + 1}`}</option>
              {remaining.map((baker) => (
                <option key={baker.id} value={baker.id}>{baker.name}</option>
              ))}
            </select>
          )
        ))}
      </div>
      <p className={`mt-3 text-sm ${blockReason ? "text-raspberry" : "text-chocolate/65"}`}>
        {blockReason
          ? blockReason
          : week === 1
            ? "Week 1: choose three bakers still in the tent."
            : changes === 0
              ? shrinking
                ? "This side is too big. Drop one baker, or leave it for the Chief Companion."
                : "No change — last week's bakers will play again."
              : "One substitution. That is the weekly limit."}
      </p>
      <div className="mt-4 flex min-w-0 flex-wrap items-center gap-2">
        <Button
          disabled={!canSubmit}
          title={blockReason ?? undefined}
          onClick={() => {
            void submitSide({ companionSlug: gbboSlug(companion.name), bakerIds: filled }).then((error) => {
              setMessage(error ?? "Saved. This week's side will be remembered.");
            });
          }}
        >
          Submit this week's side
        </Button>
        {blockReason ? (
          <Button tone="ghost" type="button" onClick={() => setWhyOpen((open) => !open)}>
            Why is this locked?
          </Button>
        ) : null}
        <Button
          tone="ghost"
          disabled={locked}
          title={locked ? (lockReason ?? "The change window is closed.") : undefined}
          onClick={() => {
            setPicks(padLineup(carriedTeam(league, companion.id, week), size));
            void submitSide({ companionSlug: gbboSlug(companion.name), keepLastWeek: true }).then((error) => {
              setMessage(error ?? "Last week's bakers will play again.");
            });
          }}
        >
          Keep last week
        </Button>
        {week <= 4 && !joker ? (
          <Button
            tone="butter"
            disabled={!canJoker}
            title={locked ? (lockReason ?? "The change window is closed.") : undefined}
            onClick={() => {
              void submitSide({
                companionSlug: gbboSlug(companion.name),
                bakerIds: filled.length === size ? filled : undefined,
                keepLastWeek: filled.length !== size,
                playJoker: true,
              }).then((error) => {
                setMessage(error ?? "Joker played for this week.");
              });
            }}
          >
            Play joker
          </Button>
        ) : null}
      </div>
      {whyOpen && blockReason ? (
        <div
          role="status"
          className="mt-3 w-full min-w-0 rounded-2xl border border-[#e7d3b4] bg-white px-4 py-3 text-sm leading-6 text-chocolate"
        >
          <strong className="block font-bold text-raspberry">Submit is unavailable</strong>
          {blockReason}
        </div>
      ) : null}
      <p className="mt-4 text-sm text-chocolate/70">
        {joker ? `Joker played in week ${joker.week}${joker.autoApplied ? " (auto)" : ""}` : "Joker still available in weeks 1–4"}
      </p>
      {message ? <p className="mt-2 text-sm font-bold text-tent">{message}</p> : null}
      </div>
    </section>
  );
}
