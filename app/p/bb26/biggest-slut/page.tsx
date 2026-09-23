"use client";

import Link from "next/link";
import { CompanionPhoto } from "@/app/components/gbbo/CompanionPhoto";
import { SlutDropMark } from "@/app/components/gbbo/SlutDropMark";
import { Card, Empty, Pill, Points } from "@/app/components/gbbo/ui";
import { GBBO_LEAGUE_PATH } from "@/app/lib/gbbo-league-path";
import { bakerName, companionName, companionPortrait, lowestScorersForWeek, scoreCompanionWeek } from "@/app/lib/gbbo/league";
import { useLeague } from "@/app/lib/gbbo/store";

export default function BiggestSlutPage() {
  const { league } = useLeague();
  const published = league.episodes.filter((episode) => episode.published);
  const latest = published.at(-1);

  if (!latest) {
    return (
      <Empty
        title="No sluts yet"
        body="This crown goes to whoever scores the fewest points in a published week. Cake Week has to be scored first."
      />
    );
  }

  const holders = lowestScorersForWeek(league, latest.week);
  const table = league.companions
    .map((companion) => scoreCompanionWeek(league, companion.id, latest.week))
    .sort((a, b) => a.points - b.points || companionName(league, a.companionId).localeCompare(companionName(league, b.companionId)));

  return (
    <div className="space-y-6">
      <Card
        eyebrow="Village disgrace"
        title={holders.length > 1 ? "Joint biggest sluts" : "Biggest slut"}
        action={<Pill tone="raspberry">Week {latest.week}</Pill>}
      >
        <p className="max-w-2xl text-sm leading-7 text-chocolate/75">
          The companion with the fewest points in {latest.title}: {latest.theme}.
          {holders.length > 1 ? " The bottom of the table is a tie." : ""}
        </p>
        <div className="mt-5 grid gap-4">
          {holders.map((score) => {
            const companion = league.companions.find((item) => item.id === score.companionId);
            const name = companion?.name ?? companionName(league, score.companionId);
            return (
            <div key={score.companionId} className="rounded-[22px] bg-raspberry/10 px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <CompanionPhoto name={name} photo={companionPortrait(companion, true)} size="md" crop="scene" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-3xl text-tent-dark">{name}</p>
                      <SlutDropMark companionId={score.companionId} week={latest.week} />
                    </div>
                  </div>
                </div>
                <Points value={score.points} />
              </div>
              <p className="mt-1 text-sm text-chocolate/70">
                {score.bakerIds.map((id) => bakerName(league, id)).join(" · ") || "No bakers"}
                {score.joker ? " · joker" : ""}
              </p>
            </div>
            );
          })}
        </div>
      </Card>

      <Card eyebrow="This week" title="From the bottom">
        <ol className="space-y-3">
          {table.map((score, index) => {
            const crowned = holders.some((holder) => holder.companionId === score.companionId);
            const companion = league.companions.find((item) => item.id === score.companionId);
            const name = companion?.name ?? companionName(league, score.companionId);
            return (
              <li
                key={score.companionId}
                className={`ticket flex items-center gap-3 rounded-[22px] px-4 py-3 sm:gap-4 ${crowned ? "ring-2 ring-raspberry" : ""}`}
              >
                <span className="w-8 shrink-0 font-display text-3xl text-tent-dark sm:w-10">{index + 1}</span>
                <CompanionPhoto name={name} photo={companionPortrait(companion, crowned)} crop={crowned ? "scene" : "face"} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-2xl leading-tight">{name}</p>
                    <SlutDropMark companionId={score.companionId} week={latest.week} />
                  </div>
                  {crowned ? <p className="text-sm text-raspberry">This week's biggest slut</p> : null}
                </div>
                <Points value={score.points} />
              </li>
            );
          })}
        </ol>
      </Card>

      <Card eyebrow="The tapes" title="Village Crimewatch">
        <p className="max-w-2xl text-sm leading-7 text-chocolate/75">
          The screening room for every slut drop and beer baguette lives on Crimewatch.
          If someone is still at large, they are wanted there too.
        </p>
        <Link
          href={`${GBBO_LEAGUE_PATH}/crimewatch`}
          className="mt-4 inline-flex rounded-full bg-raspberry px-5 py-2.5 text-sm font-bold text-flour"
        >
          Open Crimewatch
        </Link>
      </Card>

      {published.length > 1 ? (
        <Card eyebrow="Previous disgraces" title="Past weeks">
          <ul className="space-y-3 text-sm text-chocolate/80">
            {published.slice(0, -1).reverse().map((episode) => {
              const weekHolders = lowestScorersForWeek(league, episode.week);
              return (
                <li key={episode.week} className="flex flex-wrap items-center justify-between gap-2 rounded-[18px] bg-flour/80 px-4 py-3">
                  <span>Week {episode.week} · {episode.theme}</span>
                  <span className="flex flex-wrap items-center justify-end gap-2 font-bold">
                    {weekHolders.map((score) => (
                      <span key={score.companionId} className="inline-flex flex-wrap items-center gap-2">
                        {companionName(league, score.companionId)}
                        <SlutDropMark companionId={score.companionId} week={episode.week} />
                      </span>
                    ))}
                    <span>{weekHolders[0] ? `${weekHolders[0].points} pts` : ""}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
