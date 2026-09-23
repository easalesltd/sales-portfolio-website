"use client";

import { CompanionPhoto } from "@/app/components/gbbo/CompanionPhoto";
import { bakerName, companionPortrait, companionsOwningBaker, lowestTechnicalBaker, penaltyVideoSrc, technicalDeadlineLabel, technicalIsComplete } from "@/app/lib/gbbo/league";
import { PunishmentPhoto } from "./PunishmentPhoto";
import { useLeague } from "@/app/lib/gbbo/store";
import { Pill } from "./ui";

export function MustBakeCallout({ week }: { week?: number }) {
  const { league } = useLeague();
  const published = league.episodes.filter((episode) => episode.published);
  const episode = week
    ? league.episodes.find((item) => item.week === week)
    : published.at(-1);
  if (!episode?.published) return null;

  const last = lowestTechnicalBaker(episode);
  const owners = last ? companionsOwningBaker(league, last, episode.week) : [];
  if (owners.length === 0) return null;

  const recipe = (league.technicalRecipes ?? []).find((item) => item.week === episode.week);
  const technicals = (league.penalties ?? []).filter(
    (penalty) => penalty.week === episode.week && penalty.kind === "technical",
  );
  const outstanding = owners.filter((owner) =>
    technicals.some((penalty) => penalty.companionId === owner.id && !technicalIsComplete(penalty)),
  );
  const names = owners.map((owner) => owner.name).join(" and ");

  return (
    <section className="overflow-hidden rounded-[28px] border-2 border-raspberry bg-raspberry/10">
      {recipe?.photo ? (
        <a href={recipe.url} target="_blank" rel="noreferrer" className="block bg-[#efe2c8]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={recipe.photo} alt={recipe.title} className="aspect-[16/8] w-full object-cover sm:aspect-[21/8]" />
        </a>
      ) : null}
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-script text-2xl text-raspberry">Must bake</p>
          <Pill tone="raspberry">Week {episode.week} technical</Pill>
        </div>
        <h2 className="mt-1 font-display text-3xl leading-tight text-tent-dark sm:text-4xl">
          {names} {owners.length === 1 ? "has" : "have"} to bake this
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-chocolate/80">
          {bakerName(league, last)} came last in the {episode.theme} technical.
          {outstanding.length > 0
            ? ` Still outstanding: ${outstanding.map((owner) => owner.name).join(" and ")}. Upload a photo of the bake before ${technicalDeadlineLabel(episode.week)}.`
            : " Bake photos are in. The technical is done."}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          {owners.map((owner) => (
            <div key={owner.id} className="flex items-center gap-3">
              <CompanionPhoto
                name={owner.name}
                photo={companionPortrait(owner, true)}
                size="md"
                crop="scene"
              />
              <p className="font-display text-2xl text-tent-dark">{owner.name}</p>
            </div>
          ))}
        </div>
        {technicals.some((penalty) => penalty.videoId) ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {technicals.map((penalty) => (
              <PunishmentPhoto
                key={penalty.id}
                src={penaltyVideoSrc(penalty)}
                label={`${owners.find((owner) => owner.id === penalty.companionId)?.name ?? "Bake"}'s technical`}
              />
            ))}
          </div>
        ) : null}
        {recipe ? (
          <p className="mt-4 font-display text-2xl text-tent-dark">
            <a
              className="underline decoration-raspberry/40 underline-offset-4 hover:text-raspberry"
              href={recipe.url}
              target="_blank"
              rel="noreferrer"
            >
              {recipe.title}
            </a>
          </p>
        ) : (
          <p className="mt-4 text-sm text-chocolate/70">The official recipe will appear here once it is pinned.</p>
        )}
      </div>
    </section>
  );
}
