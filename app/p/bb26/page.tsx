"use client";

import Link from "next/link";
import { Card, Empty, Pill, Points } from "@/app/components/gbbo/ui";
import {
  bakerName,
  companionName,
  companionTotals,
  scoreCompanionWeek,
  teamForWeek,
  teamSizeForWeek,
} from "@/app/lib/gbbo/league";
import { useLeague } from "@/app/lib/gbbo/store";

export default function LeaguePage() {
  const { league, loaded } = useLeague();
  if (!loaded) return <p className="font-script text-3xl text-raspberry">Laying the tablecloth…</p>;

  const table = companionTotals(league);
  const published = league.episodes.filter((episode) => episode.published);
  const latest = published.at(-1);
  const size = teamSizeForWeek(league, league.currentWeek);

  if (league.companions.length === 0) {
    return (
      <Empty
        title="The tent is still empty"
        body="Add your companions and bakers in Setup, run the draft, then score each episode from the recap."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <Card eyebrow="The village fete" title="League table">
          <ol className="space-y-3">
            {table.map((row, index) => {
              const companion = companionName(league, row.companionId);
              const team = teamForWeek(league, row.companionId, league.currentWeek);
              return (
                <li key={row.companionId} className="ticket flex items-center gap-4 rounded-[22px] px-4 py-3">
                  <span className="font-display text-3xl text-tent-dark w-10">{index + 1}</span>
                  <div className="flex-1">
                    <p className="font-display text-2xl leading-tight">{companion}</p>
                    <p className="text-sm text-chocolate/70">
                      {team.map((id) => bakerName(league, id)).join(" · ") || "No bakers yet"}
                    </p>
                  </div>
                  <Points value={row.points} />
                </li>
              );
            })}
          </ol>
        </Card>

        <div className="space-y-6">
          <Card eyebrow="This weekend" title={`Week ${league.currentWeek}`}>
            <div className="space-y-3 text-sm">
              <p>Each companion plays <strong>{size} baker{size === 1 ? "" : "s"}</strong> this week. Last week's side stands unless they substitute one baker.</p>
              <p>{league.draftComplete ? "The draft is complete." : "The draft still needs running."}</p>
              <p>{latest ? `Last published: ${latest.title}.` : "No episode has been published yet."}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Pill tone="tent">Joker weeks 1–4</Pill>
                <Pill tone="butter">One sub a week</Pill>
                <Pill tone="raspberry">Beer baguette if late</Pill>
              </div>
              <Link href="/p/bb26/score" className="mt-4 inline-flex rounded-full bg-raspberry px-5 py-2.5 text-sm font-bold text-flour">
                Score this episode
              </Link>
            </div>
          </Card>
          <Card eyebrow="How this works" title="Recaps, then a human eye">
            <p className="text-sm leading-7 text-chocolate/80">
              After each episode, paste a recap or ask me to read one. Official results — Star Baker,
              elimination, technical places — usually come through cleanly. Handshakes, drops, tears
              and Nigella innuendos need someone who actually watched the tent.
            </p>
          </Card>
        </div>
      </div>

      {latest ? (
        <Card eyebrow="Latest weekend" title={`${latest.title}: ${latest.theme}`}>
          <div className="grid gap-4 md:grid-cols-2">
            {league.companions.map((companion) => {
              const week = scoreCompanionWeek(league, companion.id, latest.week);
              return (
                <div key={companion.id} className="rounded-[22px] bg-flour/80 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-2xl">{companion.name}</p>
                    <div className="flex items-center gap-2">
                      {week.joker ? <Pill tone="butter">Joker</Pill> : null}
                      <Points value={week.points} />
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1 text-sm text-chocolate/75">
                    {week.lines.length === 0 ? <li>No scoring events for this team.</li> : null}
                    {week.lines.map((line, index) => (
                      <li key={`${line.label}-${index}`} className="flex justify-between gap-3">
                        <span>{line.label}</span>
                        <span className={line.points < 0 ? "text-raspberry" : "text-tent"}>{line.points > 0 ? "+" : ""}{line.points}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
