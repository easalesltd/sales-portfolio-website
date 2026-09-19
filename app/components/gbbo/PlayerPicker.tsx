"use client";

import { useState } from "react";
import { gbboSlug } from "@/app/lib/gbbo/identity";
import { sideConfirmed } from "@/app/lib/gbbo/league";
import { useGbboSession } from "@/app/lib/gbbo/session";
import { useLeague } from "@/app/lib/gbbo/store";
import { teamWindow } from "@/app/lib/gbbo/window";

export function PlayerPicker() {
  const { league } = useLeague();
  const { ready, playerSlug, setPlayer } = useGbboSession();
  const player = league.companions.find((companion) => gbboSlug(companion.name) === playerSlug);
  const [open, setOpen] = useState(!player);
  if (!ready || league.companions.length === 0) return null;

  const week = teamWindow(new Date(), league.totalWeeks).week;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-3 sm:px-5">
      <div className={`rounded-2xl px-3 py-2 sm:rounded-[22px] sm:px-4 sm:py-3 ${player ? "bg-flour/80" : "bg-raspberry text-flour"}`}>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 text-left"
          onClick={() => setOpen((value) => !value)}
        >
          <span className={`font-display text-lg leading-tight sm:text-xl ${player ? "text-tent-dark" : "text-flour"}`}>
            {player ? `Playing as ${player.name}` : "Tap your name to play"}
          </span>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${player ? "bg-white text-chocolate" : "bg-flour text-tent-dark"}`}>
            {open ? "Hide" : "Change"}
          </span>
        </button>
        {open ? (
          <div className="mt-2 grid grid-cols-3 gap-1.5 sm:mt-3 sm:flex sm:flex-wrap sm:gap-2">
            {league.companions.map((companion) => {
              const active = gbboSlug(companion.name) === playerSlug;
              const done = sideConfirmed(league, companion.id, week);
              return (
                <button
                  key={companion.id}
                  type="button"
                  className={`rounded-full px-2 py-2 text-xs font-bold sm:px-4 sm:text-sm ${
                    done
                      ? "bg-emerald-600 text-white"
                      : active
                        ? "bg-tent text-flour"
                        : player
                          ? "bg-white text-chocolate"
                          : "bg-flour text-tent-dark"
                  }`}
                  onClick={() => {
                    setPlayer(companion.name);
                    setOpen(false);
                  }}
                >
                  {done ? `${companion.name} ✓` : companion.name}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
