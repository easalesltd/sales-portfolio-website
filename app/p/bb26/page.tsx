"use client";

import Link from "next/link";
import { CompanionPhoto } from "@/app/components/gbbo/CompanionPhoto";
import { SlutDropMark } from "@/app/components/gbbo/SlutDropMark";
import { Card, Empty, Pill, Points } from "@/app/components/gbbo/ui";
import { GBBO_LEAGUE_PATH } from "@/app/lib/gbbo-league-path";
import {
  bakerName,
  companionName,
  companionTotals,
  episodeScoringLines,
  scoreCompanionWeek,
  teamForWeek,
  teamSizeForWeek,
} from "@/app/lib/gbbo/league";
import { useGbboSession } from "@/app/lib/gbbo/session";
import { useLeague } from "@/app/lib/gbbo/store";
import { teamWindow } from "@/app/lib/gbbo/window";

export default function LeaguePage() {
  const { league, loaded } = useLeague();
  const { isChief, playerUnlocked } = useGbboSession();
  if (!loaded) return <p className="font-script text-3xl text-raspberry">Laying the tablecloth…</p>;

  const table = companionTotals(league);
  const published = league.episodes.filter((episode) => episode.published);
  const latest = published.at(-1);
  const gate = teamWindow(new Date(), league.totalWeeks);
  const size = teamSizeForWeek(league, gate.week);

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
              const companion = league.companions.find((item) => item.id === row.companionId);
              const name = companion?.name ?? companionName(league, row.companionId);
              const team = teamForWeek(league, row.companionId, gate.week);
              return (
                <li key={row.companionId} className="ticket flex items-center gap-3 rounded-[22px] px-4 py-3 sm:gap-4">
                  <span className="w-8 shrink-0 font-display text-3xl text-tent-dark sm:w-10">{index + 1}</span>
                  <CompanionPhoto name={name} photo={companion?.photo} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-2xl leading-tight">{name}</p>
                      <SlutDropMark companionId={row.companionId} />
                    </div>
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
          <Card eyebrow="This weekend" title={`Week ${gate.week}`}>
            <div className="space-y-3 text-sm">
              <p>Each companion plays <strong>{size} baker{size === 1 ? "" : "s"}</strong> this week. Last week's side stands unless they substitute one baker.</p>
              <p>{gate.summary}</p>
              <p>{latest ? `Last published: ${latest.title}.` : "No episode has been published yet."}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Pill tone="tent">Joker weeks 1–4</Pill>
                <Pill tone="butter">One sub a week</Pill>
                <Pill tone="raspberry">Beer baguette if late</Pill>
                <Pill tone="raspberry">Slut drop if last</Pill>
              </div>
              {isChief ? (
                <Link href={`${GBBO_LEAGUE_PATH}/score`} className="mt-4 inline-flex rounded-full bg-raspberry px-5 py-2.5 text-sm font-bold text-flour">
                  Score this episode
                </Link>
              ) : (
                <Link href={`${GBBO_LEAGUE_PATH}/teams`} className="mt-4 inline-flex rounded-full bg-tent px-5 py-2.5 text-sm font-bold text-flour">
                  {gate.open
                    ? playerUnlocked
                      ? "Set this week's bakers"
                      : "Enter your password at the top, then set your bakers"
                    : "See your locked side"}
                </Link>
              )}
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
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <CompanionPhoto name={companion.name} photo={companion.photo} />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-display text-2xl">{companion.name}</p>
                          <SlutDropMark companionId={companion.id} week={latest.week} />
                        </div>
                      </div>
                    </div>
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

      {published.length > 0 ? (
        <Card eyebrow="The ledger" title="How the weeks were scored">
          <div className="space-y-8">
            {[...published].reverse().map((episode) => {
              const lines = episodeScoringLines(league, episode);
              return (
                <section key={episode.week} className="border-t border-[#e7d3b4] pt-6 first:border-t-0 first:pt-0">
                  <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
                    <div>
                      <p className="font-script text-2xl text-raspberry">Week {episode.week}</p>
                      <h3 className="font-display text-3xl text-tent-dark">{episode.title}: {episode.theme}</h3>
                    </div>
                    <Pill tone="tent">Published</Pill>
                  </div>
                  {episode.justification ? (
                    <p className="max-w-3xl text-sm leading-7 text-chocolate/80">{episode.justification}</p>
                  ) : null}
                  <ul className="mt-3 space-y-1.5 text-sm leading-6 text-chocolate/75">
                    {lines.map((line) => (
                      <li key={line}>• {line}</li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
