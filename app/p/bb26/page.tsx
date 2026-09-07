"use client";

import Link from "next/link";
import { Card, Empty, Pill, Points } from "@/app/components/gbbo/ui";
import { GBBO_LEAGUE_PATH } from "@/app/lib/gbbo-league-path";
import { gbboSlug } from "@/app/lib/gbbo/identity";
import {
  bakerName,
  companionName,
  companionTotals,
  scoreCompanionWeek,
  teamForWeek,
  teamSizeForWeek,
} from "@/app/lib/gbbo/league";
import { useGbboSession } from "@/app/lib/gbbo/session";
import { useLeague } from "@/app/lib/gbbo/store";

export default function LeaguePage() {
  const { league, loaded } = useLeague();
  const { isChief, playerSlug, setPlayer } = useGbboSession();
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
              <p>{league.draftComplete ? "The draft is complete." : "Waiting for the Chief Companion to run the draft."}</p>
              <p>{latest ? `Last published: ${latest.title}.` : "No episode has been published yet."}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Pill tone="tent">Joker weeks 1–4</Pill>
                <Pill tone="butter">One sub a week</Pill>
                <Pill tone="raspberry">Beer baguette if late</Pill>
              </div>
              {isChief ? (
                <Link href={`${GBBO_LEAGUE_PATH}/score`} className="mt-4 inline-flex rounded-full bg-raspberry px-5 py-2.5 text-sm font-bold text-flour">
                  Score this episode
                </Link>
              ) : (
                <Link href={`${GBBO_LEAGUE_PATH}/teams`} className="mt-4 inline-flex rounded-full bg-tent px-5 py-2.5 text-sm font-bold text-flour">
                  {playerSlug ? "Set this week's bakers" : "Choose your name, then set your bakers"}
                </Link>
              )}
            </div>
          </Card>
          <Card eyebrow="Who is playing?" title={playerSlug ? `Hello, ${league.companions.find((companion) => gbboSlug(companion.name) === playerSlug)?.name ?? "companion"}` : "Tap your name"}>
            <p className="mb-3 text-sm text-chocolate/75">
              The site remembers you on this phone or laptop, and it remembers the side you submit.
            </p>
            <div className="flex flex-wrap gap-2">
              {league.companions.map((companion) => {
                const active = gbboSlug(companion.name) === playerSlug;
                return (
                  <button
                    key={companion.id}
                    className={`rounded-full px-4 py-2 text-sm font-bold ${active ? "bg-tent text-flour" : "bg-flour text-chocolate"}`}
                    onClick={() => setPlayer(companion.name)}
                  >
                    {companion.name}
                  </button>
                );
              })}
            </div>
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
