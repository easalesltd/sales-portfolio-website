"use client";

import { useState } from "react";
import { gbboSlug } from "@/app/lib/gbbo/identity";
import {
  latestSlutDropWeek,
  outstandingSlutDropWeek,
  owesSlutDrop,
  slutDropFor,
} from "@/app/lib/gbbo/league";
import { useGbboSession } from "@/app/lib/gbbo/session";
import { useLeague } from "@/app/lib/gbbo/store";
import { Pill } from "./ui";

export function SlutDropMark({
  companionId,
  week,
}: {
  companionId: string;
  week?: number;
}) {
  const { league, completeSlutDrop } = useLeague();
  const { isChief, playerSlug, playerUnlocked } = useGbboSession();
  const companion = league.companions.find((item) => item.id === companionId);
  const targetWeek = week ?? outstandingSlutDropWeek(league, companionId) ?? latestSlutDropWeek(league, companionId);
  const [thanks, setThanks] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!companion || targetWeek == null) return null;
  if (week && !owesSlutDrop(league, companionId, week)) return null;

  const dropWeek = targetWeek;
  const completed = Boolean(slutDropFor(league, companionId, dropWeek)?.completed);
  const owed = owesSlutDrop(league, companionId, dropWeek) && !completed;
  if (!owed && !completed && !thanks) return null;

  const canPress = owed && (isChief || (playerUnlocked && playerSlug === gbboSlug(companion.name)));

  async function markDone() {
    if (!canPress) return;
    setBusy(true);
    setError("");
    const message = await completeSlutDrop(companionId, dropWeek);
    setBusy(false);
    if (message) {
      setError(message);
      return;
    }
    setThanks(true);
    window.setTimeout(() => setThanks(false), 4000);
  }

  if (thanks) {
    return (
      <p className="max-w-[16rem] font-script text-xl leading-tight text-raspberry">
        Thank you, {companion.name}. Your slut drop is complete.
      </p>
    );
  }

  if (completed) {
    return <Pill tone="butter">Slut drop complete</Pill>;
  }

  if (!canPress) {
    return <Pill tone="raspberry">Slut Drop Owed</Pill>;
  }

  return (
    <span className="inline-flex min-w-0 flex-col items-start gap-1">
      <button
        type="button"
        disabled={busy}
        onClick={() => void markDone()}
        className="rounded-full bg-raspberry px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-flour hover:bg-[#a82f4b] disabled:opacity-50"
      >
        {busy ? "Saving…" : "Slut Drop Owed"}
      </button>
      {error ? <span className="text-xs text-raspberry">{error}</span> : null}
    </span>
  );
}
