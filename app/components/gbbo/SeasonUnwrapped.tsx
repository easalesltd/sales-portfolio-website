"use client";

import { useMemo, type ReactNode } from "react";
import { CompanionPhoto } from "@/app/components/gbbo/CompanionPhoto";
import { PunishmentPhoto } from "@/app/components/gbbo/PunishmentPhoto";
import { PunishmentVideo } from "@/app/components/gbbo/PunishmentVideo";
import { Pill, Points } from "@/app/components/gbbo/ui";
import {
  buildSeasonUnwrapped,
  type SeasonUnwrappedModel,
  type WeekPunishment,
  type WeekReel,
} from "@/app/lib/gbbo/season-unwrapped";
import { useLeague } from "@/app/lib/gbbo/store";

function finalSecretsLive(model: SeasonUnwrappedModel): boolean {
  return model.actualPodium !== null;
}

function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "Nobody";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
}

const CRIMEWATCH_SECTIONS: Array<{ kind: WeekPunishment["kind"]; title: string }> = [
  { kind: "slut_drop", title: "Slut drops" },
  { kind: "beer_baguette", title: "Beer baguettes" },
  { kind: "technical", title: "Technical bakes" },
];

function CrimewatchWeek({ week }: { week: WeekReel }) {
  return (
    <div className="space-y-4">
      {week.mustBake.length > 0 ? (
        <p>Had to bake the technical: {joinNames(week.mustBake)}.</p>
      ) : null}
      {week.crimewatch.length === 0 ? (
        <p className="text-sm opacity-80">Clean sheet — nobody owed Crimewatch this week.</p>
      ) : (
        CRIMEWATCH_SECTIONS.map((section) => {
          const rows = week.crimewatch.filter((item) => item.kind === section.kind);
          if (rows.length === 0) return null;
          return (
            <div key={section.kind} className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.16em] opacity-80">{section.title}</p>
              <ul className="space-y-3">
                {rows.map((row) => (
                  <li key={row.id} className="rounded-[18px] bg-black/5 p-3 sm:bg-white/25">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold">{row.companionName}</span>
                      <Pill tone={row.status === "owed" ? "raspberry" : "tent"}>
                        {row.status === "owed" ? "Still owed" : row.status === "photo in" ? "Photo in" : "On tape"}
                      </Pill>
                    </div>
                    {row.tape ? (
                      <div className="mt-3">
                        {row.tape.photo ? (
                          <PunishmentPhoto src={row.tape.src} label={row.tape.label} />
                        ) : (
                          <PunishmentVideo src={row.tape.src} label={row.tape.label} compact />
                        )}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          );
        })
      )}
    </div>
  );
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

export function SeasonUnwrapped({ preview = false }: { preview?: boolean }) {
  const { league } = useLeague();
  const model = useMemo(() => buildSeasonUnwrapped(league, { preview }), [league, preview]);

  if (!model.ready) {
    return (
      <section className="overflow-hidden rounded-[28px] border-2 border-raspberry bg-raspberry/10 p-6 sm:p-8">
        <p className="font-script text-3xl text-raspberry">Tonight&apos;s grand reveal</p>
        <h2 className="mt-1 font-display text-4xl text-tent-dark sm:text-5xl">Spongeify Wrapped</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-chocolate/80">
          Final baker picks and technical 1-2-3 votes are sealed. When the Chief posts the Final results,
          this page becomes your Spongeify Wrapped: every week, every punishment tape, then the champion and the wooden spoon.
        </p>
        <p className="mt-3 text-sm text-chocolate/70">
          Rehearse any time with <code className="rounded bg-flour px-1.5 py-0.5">?spongeify=1</code> on this page.
        </p>
      </section>
    );
  }

  const swingers = model.podiumRows.filter((row) => row.swungTable);

  return (
    <div className="-mx-4 sm:-mx-5">
      {preview && !finalSecretsLive(model) ? (
        <p className="mb-3 rounded-2xl bg-butter px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.16em] text-chocolate">
          Spongeify rehearsal — Final not published yet, so podium hits are a dress rehearsal
        </p>
      ) : null}
      <div className="max-h-[100svh] snap-y snap-mandatory overflow-y-auto scroll-smooth">
        <Slide eyebrow="Spongeify Wrapped" title="Your year in flour" tone="tent">
          <p>
            Ten weeks. One village. Not Spotify — Spongeify. Scroll the season: first the secret Final votes,
            then every bake and punishment tape, and finally who took the cake and who took the wooden spoon.
          </p>
          <p className="text-sm uppercase tracking-[0.18em] text-flour/70">Scroll to begin</p>
        </Slide>

        <Slide eyebrow="The sealed votes" title="Technical 1-2-3" tone="butter">
          <p>
            Everyone locked a baker and a podium. Exact order paid +20.
            {model.actualPodium ? ` The real finish was ${model.actualPodium}.` : ""}
          </p>
          <ul className="space-y-4">
            {model.podiumRows.map((row) => (
              <li key={row.companionId} className="rounded-[22px] bg-white/70 p-4 text-chocolate">
                <div className="flex items-start gap-3">
                  <CompanionPhoto name={row.name} photo={row.photo} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-3xl leading-none">{row.name}</p>
                      {row.hit ? <Pill tone="tent">+20 hit</Pill> : <Pill tone="raspberry">Miss</Pill>}
                      {row.swungTable ? <Pill tone="butter">Moved the table</Pill> : null}
                    </div>
                    <p className="mt-2 text-sm">Final baker: <strong>{row.bakerPick}</strong></p>
                    <p className="text-sm">
                      1-2-3: <strong>{row.guessed ?? "No prediction"}</strong>
                    </p>
                    <p className="mt-1 text-sm text-chocolate/70">
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
            <CrimewatchWeek week={week} />
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
        </Slide>
      </div>
    </div>
  );
}
