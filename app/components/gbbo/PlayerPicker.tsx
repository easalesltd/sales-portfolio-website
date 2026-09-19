"use client";

import { useState } from "react";
import { gbboSlug } from "@/app/lib/gbbo/identity";
import { sideConfirmed } from "@/app/lib/gbbo/league";
import { useGbboSession } from "@/app/lib/gbbo/session";
import { useLeague } from "@/app/lib/gbbo/store";
import { teamWindow } from "@/app/lib/gbbo/window";
import { PlayerUnlockForm } from "./PlayerUnlockForm";

export function PlayerPicker() {
  const { league } = useLeague();
  const { ready, isChief, playerSlug, playerUnlocked, pendingSlug, setPendingPlayer } = useGbboSession();
  const player = league.companions.find((companion) => gbboSlug(companion.name) === playerSlug);
  const pending = league.companions.find((companion) => gbboSlug(companion.name) === pendingSlug);
  const [open, setOpen] = useState(true);
  if (!ready || league.companions.length === 0) return null;

  const week = teamWindow(new Date(), league.totalWeeks).week;

  if (playerUnlocked && player && !isChief) {
    return (
      <div className="mx-auto mt-3 max-w-6xl px-4 pb-3 sm:mt-0 sm:px-5">
        <div className="rounded-2xl bg-flour/80 px-3 py-2 sm:rounded-[22px] sm:px-4 sm:py-3">
          <p className="font-display text-lg leading-tight text-tent-dark sm:text-xl">Playing as {player.name}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-3 max-w-6xl px-4 pb-3 sm:mt-0 sm:px-5">
      <div className={`rounded-2xl px-3 py-2 sm:rounded-[22px] sm:px-4 sm:py-3 ${isChief ? "bg-flour/80" : "bg-raspberry text-flour"}`}>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 text-left"
          onClick={() => setOpen((value) => !value)}
        >
          <span className={`font-display text-lg leading-tight sm:text-xl ${isChief ? "text-tent-dark" : "text-flour"}`}>
            {isChief
              ? "Chief desk — who has submitted"
              : pending
                ? `Unlock ${pending.name}'s peg`
                : "Tap your name, then enter your key"}
          </span>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${isChief ? "bg-white text-chocolate" : "bg-flour text-tent-dark"}`}>
            {open ? "Hide" : "Show"}
          </span>
        </button>
        {open ? (
          <>
            <div className="mt-2 grid grid-cols-3 gap-1.5 sm:mt-3 sm:flex sm:flex-wrap sm:gap-2">
              {league.companions.map((companion) => {
                const slug = gbboSlug(companion.name);
                const waiting = !isChief && slug === pendingSlug;
                const done = sideConfirmed(league, companion.id, week);
                return (
                  <button
                    key={companion.id}
                    type="button"
                    disabled={isChief}
                    className={`rounded-full px-2 py-2 text-xs font-bold sm:px-4 sm:text-sm ${
                      done
                        ? "bg-emerald-600 text-white"
                        : waiting
                          ? "bg-butter text-chocolate"
                          : isChief
                            ? "bg-white text-chocolate"
                            : "bg-flour text-tent-dark"
                    } ${isChief ? "cursor-default" : ""}`}
                    onClick={() => {
                      if (isChief) return;
                      setPendingPlayer(slug);
                    }}
                  >
                    {done ? `${companion.name} ✓` : companion.name}
                  </button>
                );
              })}
            </div>
            {pending && !isChief ? (
              <div className="mt-3 rounded-2xl bg-flour px-3 py-3 text-chocolate">
                <PlayerUnlockForm slug={gbboSlug(pending.name)} name={pending.name} />
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
