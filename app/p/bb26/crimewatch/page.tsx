"use client";

import { CompanionPhoto } from "@/app/components/gbbo/CompanionPhoto";
import { PunishmentVideo } from "@/app/components/gbbo/PunishmentVideo";
import { SlutDropMark } from "@/app/components/gbbo/SlutDropMark";
import { Card, Empty, Pill } from "@/app/components/gbbo/ui";
import {
  companionInDisgrace,
  companionName,
  companionPortrait,
  punishmentExhibits,
} from "@/app/lib/gbbo/league";
import { useLeague } from "@/app/lib/gbbo/store";

export default function CrimewatchPage() {
  const { league } = useLeague();
  const exhibits = punishmentExhibits(league);
  const onTape = exhibits.filter((item) => item.src);
  const atLarge = exhibits.filter((item) => !item.src);

  return (
    <div className="space-y-6">
      <Card eyebrow="Have you seen this companion?" title="Village Crimewatch">
        <p className="max-w-2xl text-sm leading-7 text-chocolate/75">
          The official screening room. Every slut drop and beer baguette is shown to the whole tent
          once it is uploaded. If the CCTV is blank, the accused is still at large.
        </p>
      </Card>

      {exhibits.length === 0 ? (
        <Empty
          title="No crimes on tape"
          body="The village CCTV is still empty. When the first slut drop or beer baguette is uploaded, it plays here for everyone."
        />
      ) : null}

      {onTape.length > 0 ? (
        <Card eyebrow="Exhibit A, B and so on" title="Caught on tape">
          <div className="grid gap-5 sm:grid-cols-2">
            {onTape.map((item) => {
              const companion = league.companions.find((row) => row.id === item.companionId);
              const name = companion?.name ?? companionName(league, item.companionId);
              const disgrace = companionInDisgrace(league, item.companionId);
              const episode = league.episodes.find((row) => row.week === item.week);
              return (
                <article key={item.id} className="rounded-[22px] bg-flour/80 p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <CompanionPhoto
                      name={name}
                      photo={companionPortrait(companion, disgrace)}
                      size="md"
                      crop={disgrace ? "scene" : "face"}
                    />
                    <div className="min-w-0">
                      <p className="font-display text-2xl text-tent-dark">{name}</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <Pill tone="raspberry">
                          {item.kind === "slut_drop" ? "Slut drop" : "Beer baguette"}
                        </Pill>
                        <Pill>Week {item.week}</Pill>
                      </div>
                      <p className="mt-1 text-sm text-chocolate/65">
                        {episode ? `${episode.title}: ${episode.theme}` : `Week ${item.week}`}
                      </p>
                    </div>
                  </div>
                  <PunishmentVideo
                    src={item.src}
                    label={`${name} · week ${item.week} ${item.kind === "slut_drop" ? "slut drop" : "beer baguette"}`}
                  />
                </article>
              );
            })}
          </div>
        </Card>
      ) : null}

      {atLarge.length > 0 ? (
        <Card eyebrow="Still at large" title="Wanted">
          <ul className="space-y-3">
            {atLarge.map((item) => {
              const companion = league.companions.find((row) => row.id === item.companionId);
              const name = companion?.name ?? companionName(league, item.companionId);
              const episode = league.episodes.find((row) => row.week === item.week);
              return (
                <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] bg-raspberry/10 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <CompanionPhoto
                      name={name}
                      photo={companionPortrait(companion, true)}
                      crop="scene"
                    />
                    <div className="min-w-0">
                      <p className="font-display text-2xl text-tent-dark">{name}</p>
                      <p className="text-sm text-chocolate/70">
                        {item.kind === "slut_drop" ? "Owes a filmed slut drop" : "Owes a filmed beer baguette"}
                        {episode ? ` · ${episode.theme}` : ` · week ${item.week}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {item.kind === "slut_drop" ? (
                      <SlutDropMark companionId={item.companionId} week={item.week} />
                    ) : (
                      <Pill tone="raspberry">Beer baguette owed</Pill>
                    )}
                    {item.escalated ? <Pill tone="raspberry">Beer baguette also owed</Pill> : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
