"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { CompanionPhoto } from "@/app/components/gbbo/CompanionPhoto";
import { PunishmentPhoto } from "@/app/components/gbbo/PunishmentPhoto";
import { PunishmentVideo } from "@/app/components/gbbo/PunishmentVideo";
import { Pill, Points } from "@/app/components/gbbo/ui";
import { buildSeasonUnwrapped } from "@/app/lib/gbbo/season-unwrapped";
import { useLeague } from "@/app/lib/gbbo/store";

function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "Nobody";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
}

function Slide({
  eyebrow,
  title,
  children,
  tone = "paper",
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  tone?: "paper" | "raspberry" | "tent" | "butter";
}) {
  const tones = {
    paper: "bg-[#fff8ea] text-tent-dark",
    raspberry: "bg-raspberry text-flour",
    tent: "bg-tent text-flour",
    butter: "bg-butter text-chocolate",
  };
  return (
    <section
      className={`flex min-h-[100svh] snap-start snap-always flex-col justify-center px-4 py-16 sm:px-8 ${tones[tone]}`}
    >
      <div className="mx-auto w-full max-w-3xl">
        <p className={`font-script text-3xl ${tone === "paper" ? "text-raspberry" : "text-flour/90"}`}>{eyebrow}</p>
        <h2 className="mt-2 font-display text-4xl leading-tight sm:text-6xl">{title}</h2>
        <div className="mt-6 space-y-4 text-base leading-7 sm:text-lg">{children}</div>
      </div>
    </section>
  );
}

async function exitBrowserFullscreen() {
  if (typeof document === "undefined" || !document.fullscreenElement) return;
  try {
    await document.exitFullscreen();
  } catch {
    /* ignore */
  }
}

export function SeasonUnwrapped({
  onFinished,
  fullscreen = false,
}: {
  onFinished?: () => void;
  /** Full-viewport overlay experience (started from a click). */
  fullscreen?: boolean;
}) {
  const { league } = useLeague();
  const model = useMemo(() => buildSeasonUnwrapped(league), [league]);
  const shellRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const onFinishedRef = useRef(onFinished);
  onFinishedRef.current = onFinished;

  const finish = () => {
    void exitBrowserFullscreen().finally(() => onFinishedRef.current?.());
  };

  useEffect(() => {
    if (!fullscreen || !model.ready) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    scrollerRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      void exitBrowserFullscreen().finally(() => onFinishedRef.current?.());
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [fullscreen, model.ready]);

  if (!model.ready) {
    return (
      <section className="overflow-hidden rounded-[28px] border-2 border-raspberry bg-raspberry/10 p-6 sm:p-8">
        <p className="font-script text-3xl text-raspberry">Tonight&apos;s grand reveal</p>
        <h2 className="mt-1 font-display text-4xl text-tent-dark sm:text-5xl">Spongeify Wrapped</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-chocolate/80">
          Final baker picks and technical 1-2-3 votes stay sealed from each other. When the Chief posts the Final results,
          Spongeify Wrapped opens with every companion&apos;s locked 1st / 2nd / 3rd, who nailed the exact order for +20,
          then the season tapes, champion, and wooden spoon.
        </p>
      </section>
    );
  }

  const swingers = model.podiumRows.filter((row) => row.swungTable);

  const shell = (
    <div
      ref={shellRef}
      className={
        fullscreen
          ? "fixed inset-0 z-[200] bg-tent text-flour"
          : "-mx-4 sm:-mx-5"
      }
    >
      <div
        ref={scrollerRef}
        tabIndex={fullscreen ? 0 : undefined}
        className={`${fullscreen ? "h-dvh" : "max-h-[100svh]"} snap-y snap-mandatory overflow-y-auto scroll-smooth outline-none`}
      >
        <Slide eyebrow="Spongeify Wrapped" title="Your year in flour" tone="tent">
          <p>
            Ten weeks. One village. Not Spotify — Spongeify. First up: the sealed Final technical votes —
            who each companion put 1st, 2nd and 3rd, and who got the exact order. Then every bake and
            punishment tape, and finally who took the cake and who took the wooden spoon.
          </p>
          <p className="text-sm uppercase tracking-[0.18em] text-flour/70">Scroll to begin</p>
        </Slide>

        <Slide eyebrow="The sealed votes" title="Who called the technical?" tone="butter">
          <p>
            Nobody saw each other&apos;s 1-2-3 until now. Exact order paid +20.
          </p>
          {model.actualPlaces ? (
            <div className="rounded-[22px] bg-tent px-4 py-4 text-flour sm:px-5">
              <p className="font-script text-2xl text-flour/85">The real finish</p>
              <ol className="mt-2 space-y-1 font-display text-2xl sm:text-3xl">
                <li>1st — {model.actualPlaces[0]}</li>
                <li>2nd — {model.actualPlaces[1]}</li>
                <li>3rd — {model.actualPlaces[2]}</li>
              </ol>
            </div>
          ) : null}
          <div className="rounded-[22px] bg-white/80 px-4 py-4 text-chocolate">
            <p className="font-script text-2xl text-raspberry">Who got it right</p>
            {model.podiumHits.length > 0 ? (
              <p className="mt-1 font-display text-3xl leading-tight sm:text-4xl">
                {joinNames(model.podiumHits.map((row) => row.name))}
                <span className="ml-2 align-middle text-base font-sans font-bold text-tent">+20</span>
              </p>
            ) : (
              <p className="mt-1 font-display text-3xl leading-tight">Nobody. The village blanked it.</p>
            )}
          </div>
          <ul className="space-y-4">
            {model.podiumRows.map((row) => (
              <li key={row.companionId} className="rounded-[22px] bg-white/70 p-4 text-chocolate">
                <div className="flex items-start gap-3">
                  <CompanionPhoto name={row.name} photo={row.photo} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-3xl leading-none">{row.name}</p>
                      {row.hit ? <Pill tone="tent">Nailed it · +20</Pill> : <Pill tone="raspberry">Miss</Pill>}
                      {row.swungTable ? <Pill tone="butter">Moved the table</Pill> : null}
                    </div>
                    <p className="mt-2 text-sm">Final baker: <strong>{row.bakerPick}</strong></p>
                    {row.guessedPlaces ? (
                      <ol className="mt-2 space-y-0.5 text-sm sm:text-base">
                        <li>
                          <span className="font-bold text-tent">1st</span> {row.guessedPlaces[0]}
                        </li>
                        <li>
                          <span className="font-bold text-tent">2nd</span> {row.guessedPlaces[1]}
                        </li>
                        <li>
                          <span className="font-bold text-tent">3rd</span> {row.guessedPlaces[2]}
                        </li>
                      </ol>
                    ) : (
                      <p className="mt-2 text-sm text-chocolate/70">No 1-2-3 locked in.</p>
                    )}
                    <p className="mt-2 text-sm text-chocolate/70">
                      Rank {row.rankWithoutBonus} without the bonus → {row.rankWithBonus} with it.
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {swingers.length > 0 ? (
            <p className="font-bold">
              The bonus changed places for {joinNames(swingers.map((row) => row.name))}.
            </p>
          ) : (
            <p>The +20 did not reorder the table — but it still decided bragging rights.</p>
          )}
        </Slide>

        {model.weeks.map((week) => (
          <Slide
            key={week.week}
            eyebrow={`Week ${week.week}`}
            title={week.theme || week.title}
            tone={week.week % 2 === 0 ? "paper" : "raspberry"}
          >
            <p>
              {week.starBaker ? `Star Baker: ${week.starBaker}. ` : "No Star Baker. "}
              {week.eliminated ? `${week.eliminated} left the tent.` : "Nobody went home."}
            </p>
            {week.woodenSpoon.length > 0 ? (
              <p>
                Wooden spoon: {joinNames(week.woodenSpoon)} on {week.woodenPoints > 0 ? "+" : ""}
                {week.woodenPoints}.
              </p>
            ) : null}
            {week.mustBake.length > 0 ? <p>Had to bake the technical: {joinNames(week.mustBake)}.</p> : null}
            {week.punishments.length > 0 ? (
              <ul className="space-y-1 text-sm sm:text-base">
                {week.punishments.map((line) => (
                  <li key={line}>• {line}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm opacity-80">No punishments on the tape this week.</p>
            )}
            {week.tapes.length > 0 ? (
              <div className="flex flex-wrap gap-3 pt-2">
                {week.tapes.map((tape) =>
                  tape.photo ? (
                    <PunishmentPhoto key={tape.id} src={tape.src} label={tape.label} />
                  ) : (
                    <PunishmentVideo key={tape.id} src={tape.src} label={tape.label} compact />
                  ),
                )}
              </div>
            ) : null}
          </Slide>
        ))}

        {model.funny.length > 0 ? (
          <Slide eyebrow="Season awards" title="The silly stats" tone="paper">
            <ul className="grid gap-3 sm:grid-cols-2">
              {model.funny.map((stat) => (
                <li key={stat.id} className="rounded-[22px] border border-[#e7d3b4] bg-flour/80 p-4">
                  <p className="font-script text-2xl text-raspberry">{stat.eyebrow}</p>
                  <p className="font-display text-3xl leading-none">{stat.title}</p>
                  <p className="mt-2 text-sm text-chocolate/75">{stat.body}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-tent">{stat.value}</p>
                </li>
              ))}
            </ul>
          </Slide>
        ) : null}

        <Slide eyebrow="The village champion" title={model.champion?.companion.name ?? "Champion"} tone="tent">
          {model.champion ? (
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="h-48 w-48 overflow-hidden rounded-full border-4 border-flour shadow-[0_12px_0_rgba(0,0,0,0.15)] sm:h-64 sm:w-64">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={model.champion.photo}
                  alt={model.champion.companion.name}
                  className="h-full w-full object-cover object-[center_18%]"
                />
              </div>
              <p className="font-display text-5xl sm:text-7xl">{model.champion.companion.name}</p>
              <p className="text-lg">Wins the tent on {model.champion.points > 0 ? "+" : ""}{model.champion.points}.</p>
              <p className="max-w-xl text-flour/85">
                Happy picture. Hollywood handshake energy. Do not let them near the washing up.
              </p>
            </div>
          ) : null}
        </Slide>

        <Slide eyebrow="The wooden spoon" title={model.woodenSpoon?.companion.name ?? "Wooden spoon"} tone="raspberry">
          {model.woodenSpoon ? (
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="h-48 w-48 overflow-hidden rounded-full border-4 border-flour/40 shadow-[0_12px_0_rgba(0,0,0,0.2)] sm:h-64 sm:w-64">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={model.woodenSpoon.photo}
                  alt={model.woodenSpoon.companion.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <p className="font-display text-5xl sm:text-7xl">{model.woodenSpoon.companion.name}</p>
              <p className="text-lg">
                Bottom of the table on {model.woodenSpoon.points > 0 ? "+" : ""}
                {model.woodenSpoon.points}.
              </p>
              <p className="max-w-xl text-flour/85">
                Sad picture. Crimewatch regular. The floor was part of their strategy.
              </p>
            </div>
          ) : null}
        </Slide>

        <Slide eyebrow="Final table" title="How the village finished" tone="paper">
          <ol className="space-y-3">
            {model.table.map((row) => (
              <li key={row.companionId} className="ticket flex items-center gap-3 rounded-[22px] px-4 py-3">
                <span className="w-8 font-display text-3xl">{row.place}</span>
                <CompanionPhoto
                  name={row.name}
                  photo={row.photo}
                  crop={row.place === model.table.length ? "scene" : "face"}
                />
                <p className="min-w-0 flex-1 font-display text-3xl leading-none">{row.name}</p>
                <Points value={row.points} />
              </li>
            ))}
          </ol>
          {onFinished ? (
            <div className="pt-6">
              <button
                type="button"
                onClick={finish}
                className="rounded-full bg-tent px-6 py-3 font-display text-2xl text-flour shadow-[0_6px_0_rgba(0,0,0,0.18)] transition hover:translate-y-0.5 hover:shadow-[0_4px_0_rgba(0,0,0,0.18)]"
              >
                Back to the tent
              </button>
              <p className="mt-3 text-sm text-chocolate/70">
                Returns you to the league table, Crimewatch, and who must bake this week&apos;s technical.
              </p>
            </div>
          ) : null}
        </Slide>
      </div>
      {fullscreen ? (
        <button
          type="button"
          onClick={finish}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/35 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-flour backdrop-blur sm:right-5 sm:top-5"
        >
          Close
        </button>
      ) : null}
    </div>
  );

  return shell;
}

/** Start browser fullscreen from a click (gesture-safe). Falls back quietly on phones that block it. */
export async function requestUnwrappedFullscreen(target?: HTMLElement | null) {
  const node = target ?? document.documentElement;
  if (!node?.requestFullscreen) return;
  try {
    await node.requestFullscreen();
  } catch {
    /* iOS / denied — CSS overlay still covers the viewport */
  }
}
