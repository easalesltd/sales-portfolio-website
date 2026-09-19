"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bunting } from "./Bunting";
import { PlayerPicker } from "./PlayerPicker";
import { GBBO_LEAGUE_PATH } from "@/app/lib/gbbo-league-path";
import { gbboSlug } from "@/app/lib/gbbo/identity";
import { useGbboSession } from "@/app/lib/gbbo/session";
import { useLeague } from "@/app/lib/gbbo/store";

const PLAYER_NAV = [
  { href: GBBO_LEAGUE_PATH, label: "League", short: "League" },
  { href: `${GBBO_LEAGUE_PATH}/teams`, label: "My team", short: "Team" },
  { href: `${GBBO_LEAGUE_PATH}/penalties`, label: "Penalties", short: "Pens" },
  { href: `${GBBO_LEAGUE_PATH}/technical-recipes`, label: "Technical recipes", short: "Recipes" },
  { href: `${GBBO_LEAGUE_PATH}/rules`, label: "Rules", short: "Rules" },
  { href: `${GBBO_LEAGUE_PATH}/biggest-slut`, label: "Biggest slut", short: "Slut" },
];

const CHIEF_NAV = [
  { href: GBBO_LEAGUE_PATH, label: "League", short: "League" },
  { href: `${GBBO_LEAGUE_PATH}/teams`, label: "Teams", short: "Teams" },
  { href: `${GBBO_LEAGUE_PATH}/score`, label: "Score", short: "Score" },
  { href: `${GBBO_LEAGUE_PATH}/penalties`, label: "Penalties", short: "Pens" },
  { href: `${GBBO_LEAGUE_PATH}/technical-recipes`, label: "Technical recipes", short: "Recipes" },
  { href: `${GBBO_LEAGUE_PATH}/rules`, label: "Rules", short: "Rules" },
  { href: `${GBBO_LEAGUE_PATH}/biggest-slut`, label: "Biggest slut", short: "Slut" },
  { href: `${GBBO_LEAGUE_PATH}/setup`, label: "Setup", short: "Setup" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { league, loaded, saving } = useLeague();
  const { ready, isChief, playerSlug, lockChief } = useGbboSession();
  const player = league.companions.find((companion) => gbboSlug(companion.name) === playerSlug);
  const nav = isChief ? CHIEF_NAV : PLAYER_NAV;

  return (
    <div className="relative min-h-screen">
      <div className="sticky top-0 z-30 overflow-x-hidden bg-gradient-to-b from-[#fbf4e8] to-[#fbf4e8]/90 backdrop-blur-md">
        <Bunting />
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-5 pb-4">
          <Link href={GBBO_LEAGUE_PATH} className="block">
            <p className="font-script text-2xl text-raspberry">Great British Bake Off</p>
            <h1 className="font-display text-4xl leading-none text-tent-dark sm:text-5xl">{league.name}</h1>
          </Link>
          <div className="text-right text-sm text-chocolate/70">
            <p>Series {league.seriesYear} · Week {league.currentWeek} of {league.totalWeeks}</p>
            <p>
              {saving ? "Saving the ledger…" : !ready || !loaded ? "Warming the ovens…" : isChief ? "Chief Companion" : player ? `Playing as ${player.name}` : "Companion tent"}
            </p>
            {isChief ? (
              <button className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-raspberry" onClick={() => void lockChief()}>
                Leave the steward's desk
              </button>
            ) : null}
          </div>
        </div>
        <nav className={`mx-auto grid max-w-6xl gap-1.5 px-4 pb-3 sm:flex sm:flex-wrap sm:gap-2 sm:px-5 ${isChief ? "grid-cols-4" : "grid-cols-3"}`}>
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-1.5 py-2 text-center text-[11px] font-bold leading-none sm:px-4 sm:text-sm ${
                  active ? "bg-tent text-flour" : "bg-flour/80 text-chocolate hover:bg-white"
                }`}
              >
                <span className="sm:hidden">{item.short}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <PlayerPicker />
      </div>
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-6">{children}</main>
    </div>
  );
}
