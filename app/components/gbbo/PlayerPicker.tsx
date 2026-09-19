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
  const {
    ready,
    isChief,
    playerSlug,
    playerUnlocked,
    pendingSlug,
    setPendingPlayer,
    setPlayer,
    lockPlayer,
  } = useGbboSession();
  const player = league.companions.find((companion) => gbboSlug(companion.name) === playerSlug);
  const pending = league.companions.find((companion) => gbboSlug(companion.name) === pendingSlug);
  const [open, setOpen] = useState(!player || (!isChief && !playerUnlocked));
  if (!ready || league.companions.length === 0) return null;

  const week = teamWindow(new Date(), league.totalWeeks).week;
  const signedIn = Boolean(isChief || (player && playerUnlocked));

  return (
    <div className="mx-auto mt-3 max-w-6xl px-4 pb-3 sm:mt-0 sm:px-5">
      <div className={`rounded-2xl px-3 py-2 sm:rounded-[22px] sm:px-4 sm:py-3 ${signedIn ? "bg-flour/80" : "bg-raspberry text-flour"}`}>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 text-left"
          onClick={() => setOpen((value) => !value)}
        >
          <span className={`font-display text-lg leading-tight sm:text-xl ${signedIn ? "text-tent-dark" : "text-flour"}`}>
            {signedIn && player
              ? `Playing as ${player.name}`
              : pending
                ? `Unlock ${pending.name}'s peg`
                : "Tap your name, then enter your key"}
          </span>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${signedIn ? "bg-white text-chocolate" : "bg-flour text-tent-dark"}`}>
            {open ? "Hide" : "Change"}
          </span>
        </button>
        {open ? (
          <>
            <div className="mt-2 grid grid-cols-3 gap-1.5 sm:mt-3 sm:flex sm:flex-wrap sm:gap-2">
              {league.companions.map((companion) => {
                const slug = gbboSlug(companion.name);
                const active = slug === playerSlug && (isChief || playerUnlocked);
                const waiting = slug === pendingSlug && !active;
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
                          : waiting
                            ? "bg-butter text-chocolate"
                            : signedIn
                              ? "bg-white text-chocolate"
                              : "bg-flour text-tent-dark"
                    }`}
                    onClick={() => {
                      if (isChief || (playerUnlocked && slug === playerSlug)) {
                        setPlayer(companion.name);
                        setPendingPlayer(null);
                        setOpen(false);
                        return;
                      }
                      setPendingPlayer(slug);
                    }}
                  >
                    {done ? `${companion.name} ✓` : companion.name}
                  </button>
                );
              })}
            </div>
            {pending && !isChief && !(playerUnlocked && pendingSlug === playerSlug) ? (
              <div className="mt-3 rounded-2xl bg-flour px-3 py-3 text-chocolate">
                <PlayerUnlockForm
                  slug={gbboSlug(pending.name)}
                  name={pending.name}
                  onUnlocked={() => setOpen(false)}
                />
              </div>
            ) : null}
            {playerUnlocked ? (
              <button
                type="button"
                className="mt-3 text-xs font-bold underline decoration-2 underline-offset-4"
                onClick={() => {
                  void lockPlayer().then(() => setOpen(true));
                }}
              >
                Lock my peg
              </button>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
