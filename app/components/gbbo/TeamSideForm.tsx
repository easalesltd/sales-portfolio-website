"use client";

import { useMemo, useState } from "react";
import { bakerName, bakerStillIn, carriedTeam, jokerForCompanion, lineupChanges, selectableBakers, teamForWeek, teamSizeForWeek } from "@/app/lib/gbbo/league";
import { gbboSlug } from "@/app/lib/gbbo/identity";
import { useLeague } from "@/app/lib/gbbo/store";
import type { Companion } from "@/app/lib/gbbo/types";
import { Button, Card, Pill } from "./ui";

function padLineup(bakerIds: string[], size: number): string[] {
  const next = bakerIds.slice(0, size);
  while (next.length < size) next.push("");
  return next;
}

export function TeamSideForm({ companion }: { companion: Companion }) {
  const { league, submitSide } = useLeague();
  const week = league.currentWeek;
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
  const submitted = league.substitutions.some((sub) => sub.companionId === companion.id && sub.week === week);
  const joker = jokerForCompanion(league, companion.id);
  const canJoker = week <= 4 && !joker;

  function setSlot(index: number, bakerId: string) {
    setPicks((current) => {
      const next = [...(current ?? defaultLineup)];
      next[index] = bakerId;
      return next;
    });
  }

  return (
    <Card title={companion.name} action={submitted ? <Pill tone="tent">Submitted</Pill> : <Pill>Rolled forward</Pill>}>
      <p className="mb-3 text-sm text-chocolate/65">
        Last week: {lastWeek.map((id) => bakerName(league, id)).join(" · ") || "No side yet"}
      </p>
      <div className="space-y-2">
        {proposed.map((bakerId, index) => (
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
        ))}
      </div>
      <p className={`mt-3 text-sm ${legal ? "text-chocolate/65" : "text-raspberry"}`}>
        {week === 1
          ? "Week 1: choose three bakers still in the tent."
          : changes === 0
            ? shrinking
              ? "This side is too big. Drop one baker, or leave it for the Chief Companion."
              : "No change — last week's bakers will play again."
            : changes === 1
              ? "One substitution. That is the weekly limit."
              : `${changes} bakers are different from last week. Only one substitution is allowed.`}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          disabled={!legal && !(shrinking && filled.length === size && unique.size === size && changes === 0)}
          onClick={() => {
            void submitSide({ companionSlug: gbboSlug(companion.name), bakerIds: filled }).then((error) => {
              setMessage(error ?? "Saved. This week's side will be remembered.");
            });
          }}
        >
          Submit this week's side
        </Button>
        <Button
          tone="ghost"
          onClick={() => {
            setPicks(padLineup(carriedTeam(league, companion.id, week), size));
            void submitSide({ companionSlug: gbboSlug(companion.name), keepLastWeek: true }).then((error) => {
              setMessage(error ?? "Last week's bakers will play again.");
            });
          }}
        >
          Keep last week
        </Button>
        {canJoker ? (
          <Button tone="butter" onClick={() => {
            void submitSide({
              companionSlug: gbboSlug(companion.name),
              bakerIds: filled.length === size ? filled : undefined,
              keepLastWeek: filled.length !== size,
              playJoker: true,
            }).then((error) => {
              setMessage(error ?? "Joker played for this week.");
            });
          }}>Play joker</Button>
        ) : null}
      </div>
      <p className="mt-4 text-sm text-chocolate/70">
        {joker ? `Joker played in week ${joker.week}${joker.autoApplied ? " (auto)" : ""}` : "Joker still available in weeks 1–4"}
      </p>
      {message ? <p className="mt-2 text-sm font-bold text-tent">{message}</p> : null}
    </Card>
  );
}
