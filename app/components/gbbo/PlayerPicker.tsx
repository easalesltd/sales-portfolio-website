"use client";

import { gbboSlug } from "@/app/lib/gbbo/identity";
import { useGbboSession } from "@/app/lib/gbbo/session";
import { useLeague } from "@/app/lib/gbbo/store";

export function PlayerPicker() {
  const { league } = useLeague();
  const { ready, playerSlug, setPlayer } = useGbboSession();
  if (!ready || league.companions.length === 0) return null;

  const player = league.companions.find((companion) => gbboSlug(companion.name) === playerSlug);

  return (
    <div className={`mx-auto max-w-6xl px-5 pb-4 ${player ? "" : "rounded-[22px]"}`}>
      <div className={`rounded-[22px] px-4 py-3 ${player ? "bg-flour/80" : "bg-raspberry text-flour"}`}>
        <p className={`font-display text-xl leading-tight ${player ? "text-tent-dark" : "text-flour"}`}>
          {player ? `Playing as ${player.name} — tap another name to switch` : "Tap your name to play"}
        </p>
        <p className={`mt-1 text-sm ${player ? "text-chocolate/70" : "text-flour/85"}`}>
          The site remembers you on this phone or laptop.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {league.companions.map((companion) => {
            const active = gbboSlug(companion.name) === playerSlug;
            return (
              <button
                key={companion.id}
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  active
                    ? "bg-tent text-flour"
                    : player
                      ? "bg-white text-chocolate"
                      : "bg-flour text-tent-dark"
                }`}
                onClick={() => setPlayer(companion.name)}
              >
                {companion.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
