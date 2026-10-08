"use client";

import { useState } from "react";
import { CompanionPhoto } from "@/app/components/gbbo/CompanionPhoto";
import { LastInPointsBoard } from "@/app/components/gbbo/LastInPointsBoard";
import { PenaltyBoard } from "@/app/components/gbbo/PenaltyBoard";
import { PunishmentPhoto } from "@/app/components/gbbo/PunishmentPhoto";
import { PunishmentVideo } from "@/app/components/gbbo/PunishmentVideo";
import { SlutDropMark } from "@/app/components/gbbo/SlutDropMark";
import { TentRules } from "@/app/components/gbbo/TentRules";
import { Card, Empty, Pill } from "@/app/components/gbbo/ui";
import {
  companionName,
  companionPortrait,
  episodeTheme,
  punishmentExhibits,
  technicalIsComplete,
} from "@/app/lib/gbbo/league";
import { useLeague } from "@/app/lib/gbbo/store";

type Punishment = "slut_drop" | "technical" | "beer_baguette";

const PUNISHMENTS: { id: Punishment; label: string }[] = [
  { id: "slut_drop", label: "Slut drops" },
  { id: "technical", label: "Technicals" },
  { id: "beer_baguette", label: "Beer baguettes" },
];

export default function CrimewatchPage() {
  const { league } = useLeague();
  const [shown, setShown] = useState<Punishment>("slut_drop");
  const slutDrops = punishmentExhibits(league).filter((item) => item.kind === "slut_drop");
  const onTape = slutDrops.filter((item) => item.src);
  const atLarge = slutDrops.filter((item) => !item.src);
  const owed: Record<Punishment, number> = {
    slut_drop: atLarge.length,
    technical: league.penalties.filter((penalty) => penalty.kind === "technical" && !technicalIsComplete(penalty)).length,
    beer_baguette: league.penalties.filter((penalty) => penalty.kind === "beer_baguette" && !penalty.videoId).length,
  };

  return (
    <div className="space-y-6">
      <Card eyebrow="Have you seen this companion?" title="Village Crimewatch">
        <p className="max-w-2xl text-sm leading-7 text-chocolate/75">
          The official screening room. Slut drops, beer baguettes and technical bake photos
          are shown to the whole tent once they are uploaded. If the CCTV is blank, the accused is still at large.
        </p>
        <div role="tablist" aria-label="Punishments" className="mt-5 flex flex-wrap gap-2">
          {PUNISHMENTS.map((punishment) => {
            const active = shown === punishment.id;
            return (
              <button
                key={punishment.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setShown(punishment.id)}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold tracking-wide transition ${
                  active ? "bg-raspberry text-flour" : "border border-[#e7d3b4] bg-flour/70 text-chocolate hover:bg-white"
                }`}
              >
                {punishment.label}
                {owed[punishment.id] > 0 ? (
                  <span className={`rounded-full px-2 py-0.5 text-xs ${active ? "bg-flour text-raspberry" : "bg-raspberry text-flour"}`}>
                    {owed[punishment.id]} owed
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </Card>

      {shown === "technical" ? <PenaltyBoard kind="technical" /> : null}
      {shown === "beer_baguette" ? <PenaltyBoard kind="beer_baguette" /> : null}

      {shown === "slut_drop" ? (
        <>
          <LastInPointsBoard />

          {slutDrops.length === 0 ? (
            <Empty
              title="No slut drops on tape"
              body="The village CCTV is still empty. When the first slut drop is uploaded, it shows here for everyone."
            />
          ) : null}

          {atLarge.length > 0 ? (
            <Card eyebrow="Still at large" title="Wanted">
              <ul className="space-y-3">
                {atLarge.map((item) => {
                  const companion = league.companions.find((row) => row.id === item.companionId);
                  const name = companion?.name ?? companionName(league, item.companionId);
                  return (
                    <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] bg-raspberry/10 px-4 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <CompanionPhoto name={name} photo={companionPortrait(companion, true)} crop="scene" />
                        <div className="min-w-0">
                          <p className="font-display text-2xl text-tent-dark">{name}</p>
                          <p className="text-sm text-chocolate/70">
                            Owes a slut drop photo or video · {episodeTheme(league, item.week)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <SlutDropMark companionId={item.companionId} week={item.week} />
                        {item.escalated ? <Pill tone="raspberry">Beer baguette also owed</Pill> : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ) : null}

          {onTape.length > 0 ? (
            <Card eyebrow="Exhibit A, B and so on" title="Caught on tape">
              <div className="grid gap-5 sm:grid-cols-2">
                {onTape.map((item) => {
                  const companion = league.companions.find((row) => row.id === item.companionId);
                  const name = companion?.name ?? companionName(league, item.companionId);
                  const episode = league.episodes.find((row) => row.week === item.week);
                  const label = `${name} · week ${item.week} slut drop`;
                  return (
                    <article key={item.id} className="rounded-[22px] bg-flour/80 p-4">
                      <div className="mb-3 flex items-center gap-3">
                        <CompanionPhoto name={name} photo={companionPortrait(companion, true)} size="md" crop="scene" />
                        <div className="min-w-0">
                          <p className="font-display text-2xl text-tent-dark">{name}</p>
                          <div className="mt-1 flex flex-wrap gap-2">
                            <Pill tone="raspberry">Slut drop</Pill>
                            <Pill>Week {item.week}</Pill>
                          </div>
                          <p className="mt-1 text-sm text-chocolate/65">
                            {episode ? `${episode.title}: ${episodeTheme(league, item.week)}` : `Week ${item.week}`}
                          </p>
                        </div>
                      </div>
                      {item.photo ? <PunishmentPhoto src={item.src} label={label} /> : <PunishmentVideo src={item.src} label={label} />}
                    </article>
                  );
                })}
              </div>
            </Card>
          ) : null}
        </>
      ) : null}

      <TentRules />
    </div>
  );
}
