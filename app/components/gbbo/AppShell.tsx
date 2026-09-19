"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bunting } from "./Bunting";
import { PlayerPicker } from "./PlayerPicker";
import { GBBO_LEAGUE_PATH } from "@/app/lib/gbbo-league-path";
import { useGbboSession } from "@/app/lib/gbbo/session";
import { useLeague } from "@/app/lib/gbbo/store";

const PLAYER_NAV = [
  { href: GBBO_LEAGUE_PATH, label: "League" },
  { href: `${GBBO_LEAGUE_PATH}/teams`, label: "My team" },
  { href: `${GBBO_LEAGUE_PATH}/penalties`, label: "Penalties" },
  { href: `${GBBO_LEAGUE_PATH}/technical-recipes`, label: "Technical recipes" },
  { href: `${GBBO_LEAGUE_PATH}/rules`, label: "Rules" },
  { href: `${GBBO_LEAGUE_PATH}/biggest-slut`, label: "Biggest slut" },
];

const CHIEF_NAV = [
  { href: GBBO_LEAGUE_PATH, label: "League" },
  { href: `${GBBO_LEAGUE_PATH}/teams`, label: "Teams" },
  { href: `${GBBO_LEAGUE_PATH}/score`, label: "Score" },
  { href: `${GBBO_LEAGUE_PATH}/penalties`, label: "Penalties" },
  { href: `${GBBO_LEAGUE_PATH}/technical-recipes`, label: "Technical recipes" },
  { href: `${GBBO_LEAGUE_PATH}/rules`, label: "Rules" },
  { href: `${GBBO_LEAGUE_PATH}/biggest-slut`, label: "Biggest slut" },
  { href: `${GBBO_LEAGUE_PATH}/setup`, label: "Setup" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { league } = useLeague();
  const { isChief, lockChief } = useGbboSession();
  const nav = isChief ? CHIEF_NAV : PLAYER_NAV;
  const [menuOpen, setMenuOpen] = useState(false);
  const current = nav.find((item) => item.href === pathname)?.label ?? "League";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="relative min-h-screen">
      <div className="hidden sm:block">
        <Bunting />
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-3 px-5 pb-4">
          <Link href={GBBO_LEAGUE_PATH}>
            <p className="font-script text-2xl text-raspberry">Great British Bake Off</p>
            <h1 className="font-display text-5xl leading-none text-tent-dark">{league.name}</h1>
          </Link>
          <div className="text-right text-sm text-chocolate/70">
            <p>Week {league.currentWeek}/{league.totalWeeks}</p>
            {isChief ? (
              <button className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-raspberry" onClick={() => void lockChief()}>
                Leave desk
              </button>
            ) : null}
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl flex-wrap gap-2 px-5 pb-3">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  active ? "bg-tent text-flour" : "bg-flour/80 text-chocolate hover:bg-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="sticky top-0 z-30 bg-[#fbf4e8]/95 backdrop-blur-md sm:hidden">
        <div className="flex items-center gap-3 px-4 py-2">
          <Link href={GBBO_LEAGUE_PATH} className="min-w-0 flex-1">
            <h1 className="truncate font-display text-xl leading-none text-tent-dark">{current}</h1>
            <p className="text-[11px] text-chocolate/65">Week {league.currentWeek}/{league.totalWeeks}</p>
          </Link>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl bg-[#0d1f1a] text-flour"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={`block h-0.5 w-5 bg-flour transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-flour transition ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-flour transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
        {menuOpen ? (
          <nav className="bg-[#0d1f1a] px-4 py-3">
            <div className="grid gap-2">
              {nav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-2xl px-4 py-3 text-sm font-bold ${
                      active ? "bg-butter text-chocolate" : "bg-[#1a3a31] text-flour"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        ) : null}
      </div>

      <PlayerPicker />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-3 sm:px-5 sm:pt-6">{children}</main>
    </div>
  );
}
