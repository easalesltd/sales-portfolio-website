"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bunting } from "./Bunting";
import { PlayerPicker } from "./PlayerPicker";
import { GBBO_LEAGUE_PATH } from "@/app/lib/gbbo-league-path";
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
  const { league } = useLeague();
  const { isChief, lockChief } = useGbboSession();
  const nav = isChief ? CHIEF_NAV : PLAYER_NAV;

  return (
    <div className="relative min-h-screen">
      <div className="overflow-x-hidden">
        <div className="hidden sm:block">
          <Bunting />
        </div>
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-3 px-4 py-2 sm:px-5 sm:pb-4">
          <Link href={GBBO_LEAGUE_PATH} className="min-w-0">
            <p className="hidden font-script text-2xl text-raspberry sm:block">Great British Bake Off</p>
            <h1 className="truncate font-display text-2xl leading-none text-tent-dark sm:text-5xl">{league.name}</h1>
          </Link>
          <div className="shrink-0 text-right text-[11px] leading-tight text-chocolate/70 sm:text-sm">
            <p>Week {league.currentWeek}/{league.totalWeeks}</p>
            {isChief ? (
              <button className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-raspberry sm:text-xs" onClick={() => void lockChief()}>
                Leave desk
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <div className="sticky top-0 z-30 overflow-x-hidden bg-[#fbf4e8]/95 py-2 backdrop-blur-md">
        <nav className={`mx-auto grid max-w-6xl gap-1.5 px-4 sm:flex sm:flex-wrap sm:gap-2 sm:px-5 ${isChief ? "grid-cols-4" : "grid-cols-3"}`}>
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
      </div>
      <PlayerPicker />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-3 sm:px-5 sm:pt-6">{children}</main>
    </div>
  );
}
