"use client";

import { companionName, companionPortrait, weeklyLastPlace } from "@/app/lib/gbbo/league";
import { useLeague } from "@/app/lib/gbbo/store";
import { CompanionPhoto } from "./CompanionPhoto";
import { SlutDropMark } from "./SlutDropMark";
import { Card } from "./ui";

function formatPoints(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

export function LastInPointsBoard() {
  const { league } = useLeague();
  const weeks = weeklyLastPlace(league);
  const latest = weeks.at(-1);
  if (!latest) return null;

  const latestNames = latest.holders.map((score) => companionName(league, score.companionId));

  return (
    <section className="space-y-4" aria-label="Last in points each week">
      <div className="overflow-hidden rounded-[28px] border-4 border-[#7a1830] bg-raspberry text-flour shadow-[0_10px_0_#7a1830]">
        <div className="bg-[#7a1830] px-5 py-2 text-center">
          <p className="font-display text-sm font-bold uppercase tracking-[0.32em]">Last in points</p>
        </div>
        <div className="px-5 py-6 sm:px-8">
          <p className="font-script text-3xl text-butter">
            {latest.holders.length > 1 ? "Joint wooden spoon" : "Wooden spoon"}
          </p>
          <p className="mt-1 text-sm font-bold uppercase tracking-[0.18em] text-flour/80">
            Week {latest.week}
            {latest.theme ? ` · ${latest.theme}` : ""}
            {" · "}
            {latest.title}
          </p>
          <ul className="mt-5 space-y-5">
            {latest.holders.map((score) => {
              const companion = league.companions.find((item) => item.id === score.companionId);
              const name = companion?.name ?? companionName(league, score.companionId);
              return (
                <li key={score.companionId} className="flex flex-wrap items-center gap-4">
                  <CompanionPhoto
                    name={name}
                    photo={companionPortrait(companion, true)}
                    size="lg"
                    crop="scene"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-5xl leading-none sm:text-7xl">{name}</p>
                    <p className="mt-2 max-w-md text-sm leading-6 text-flour/85">
                      Fewest points in the tent this week
                      {latest.holders.length > 1 ? ", tied on the bottom" : ""}.
                    </p>
                    <div className="mt-2">
                      <SlutDropMark companionId={score.companionId} week={latest.week} />
                    </div>
                  </div>
                  <p className="font-display text-6xl leading-none sm:text-8xl">{formatPoints(score.points)}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <Card eyebrow="Every published week" title="Who came last">
        <p className="mb-4 text-sm leading-7 text-chocolate/75">
          {latestNames.join(" and ")} {latest.holders.length > 1 ? "are" : "is"} last in week {latest.week}.
          The companion on the fewest points each week is marked below. A tie means every name on that line.
        </p>
        <ol className="space-y-3">
          {[...weeks].reverse().map((week) => {
            const current = week.week === latest.week;
            return (
              <li
                key={week.week}
                className={`rounded-[22px] px-4 py-4 ${current ? "bg-raspberry text-flour" : "bg-raspberry/10 text-tent-dark"}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className={`text-xs font-bold uppercase tracking-[0.16em] ${current ? "text-flour/80" : "text-raspberry"}`}>
                    {current ? "This week · " : ""}
                    Week {week.week}
                    {week.theme ? ` · ${week.theme}` : ""}
                  </p>
                  <p className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${current ? "bg-flour text-raspberry" : "bg-raspberry text-flour"}`}>
                    Last
                  </p>
                </div>
                <div className="mt-3 space-y-3">
                  {week.holders.map((score) => {
                    const companion = league.companions.find((item) => item.id === score.companionId);
                    const name = companion?.name ?? companionName(league, score.companionId);
                    return (
                      <div key={score.companionId} className="flex items-center gap-3">
                        <CompanionPhoto
                          name={name}
                          photo={companionPortrait(companion, true)}
                          size="md"
                          crop="scene"
                        />
                        <p className="min-w-0 flex-1 font-display text-4xl leading-none">{name}</p>
                        <p className={`font-display text-4xl leading-none ${current ? "text-flour" : "text-raspberry"}`}>
                          {formatPoints(score.points)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ol>
      </Card>
    </section>
  );
}
