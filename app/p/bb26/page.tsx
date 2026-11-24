"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CompanionPhoto } from "@/app/components/gbbo/CompanionPhoto";
import { MustBakeCallout } from "@/app/components/gbbo/MustBakeCallout";
import { OfficialStatement } from "@/app/components/gbbo/OfficialStatement";
import { BeerBaguetteMark } from "@/app/components/gbbo/BeerBaguetteMark";
import { requestUnwrappedFullscreen, SeasonUnwrapped } from "@/app/components/gbbo/SeasonUnwrapped";
import { SlutDropMark } from "@/app/components/gbbo/SlutDropMark";
import { Card, Empty, Pill, Points } from "@/app/components/gbbo/ui";
import { GBBO_LEAGUE_PATH } from "@/app/lib/gbbo-league-path";
import {
  bakerName,
  companionInDisgrace,
  companionName,
  companionPortrait,
  companionTotals,
  episodeScoringLines,
  isFinalWeek,
  outstandingBeerBaguettes,
  podiumBakerNames,
  punishmentExhibits,
  scoreCompanionWeek,
  sideSubmissionComplete,
  teamForWeek,
  teamSizeForWeek,
  technicalPodiumPrediction,
} from "@/app/lib/gbbo/league";
import { gbboSlug } from "@/app/lib/gbbo/identity";
import { canViewFinalPick, finalSecretsRevealed } from "@/app/lib/gbbo/season-unwrapped";
import { useGbboSession } from "@/app/lib/gbbo/session";
import { useLeague } from "@/app/lib/gbbo/store";
import { teamWindow } from "@/app/lib/gbbo/window";

const UNWRAPPED_SEEN_KEY = "gbbo-spongeify-wrapped-seen-2026";

export default function LeaguePage() {
  const { league, loaded } = useLeague();
  const { isChief, playerUnlocked, playerSlug } = useGbboSession();
  const [wrappedSeen, setWrappedSeen] = useState(false);
  const [wrappedReady, setWrappedReady] = useState(false);
  const [playingWrapped, setPlayingWrapped] = useState(false);

  useEffect(() => {
    try {
      setWrappedSeen(window.localStorage.getItem(UNWRAPPED_SEEN_KEY) === "1");
    } catch {
      setWrappedSeen(false);
    }
    setWrappedReady(true);
  }, []);

  if (!loaded || !wrappedReady) return <p className="font-script text-3xl text-raspberry">Laying the tablecloth…</p>;

  const revealed = finalSecretsRevealed(league);
  const table = companionTotals(league);
  const published = league.episodes.filter((episode) => episode.published);
  const latest = published.at(-1);
  const gate = teamWindow(new Date(), league.totalWeeks);
  const size = teamSizeForWeek(league, gate.week);
  const tapes = punishmentExhibits(league);
  const onTape = tapes.filter((item) => Boolean(item.src));
  const baguettesOwed = outstandingBeerBaguettes(league);
  const finalWeek = isFinalWeek(league, gate.week);

  if (league.companions.length === 0) {
    return (
      <Empty
        title="The tent is still empty"
        body="Add your companions and bakers in Setup, run the draft, then score each episode from the recap."
      />
    );
  }

  const startWrapped = () => {
    void requestUnwrappedFullscreen();
    setPlayingWrapped(true);
  };

  const finishWrapped = () => {
    try {
      window.localStorage.setItem(UNWRAPPED_SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    setWrappedSeen(true);
    setPlayingWrapped(false);
  };

  return (
    <div className="space-y-6">
      {playingWrapped ? (
        <SeasonUnwrapped fullscreen onFinished={finishWrapped} />
      ) : null}

      {revealed ? (
        <section
          className={`overflow-hidden rounded-[28px] border-2 px-5 py-6 sm:px-8 sm:py-8 ${
            wrappedSeen ? "border-[#e7d3b4] bg-[#fff8ea]" : "border-raspberry bg-raspberry/10"
          }`}
        >
          <p className="font-script text-3xl text-raspberry">
            {wrappedSeen ? "One more scroll?" : "The grand reveal"}
          </p>
          <h2 className="mt-1 font-display text-4xl text-tent-dark sm:text-5xl">Spongeify Wrapped</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-chocolate/80">
            {wrappedSeen
              ? "Rewatch the sealed Final votes, every punishment tape, then the champion and wooden spoon — fullscreen."
              : "Tap start for the fullscreen season reveal: every sealed 1-2-3 vote, who got +20, the weekly tapes, then back to the tent for who must bake."}
          </p>
          <button
            type="button"
            onClick={startWrapped}
            className="mt-5 rounded-full bg-tent px-6 py-3 font-display text-2xl text-flour shadow-[0_6px_0_rgba(0,0,0,0.18)] transition hover:translate-y-0.5 hover:shadow-[0_4px_0_rgba(0,0,0,0.18)]"
          >
            {wrappedSeen ? "Rewatch Wrapped" : "Start Spongeify Wrapped"}
          </button>
        </section>
      ) : finalWeek ? (
        <SeasonUnwrapped />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <Card eyebrow="The village fete" title="League table">
          {finalWeek ? (
            <p className="mb-4 text-sm leading-7 text-chocolate/75">
              Final baker picks and technical 1-2-3 votes are sealed until the Chief posts the results.
              You can still see your own lock-in once you unlock.
            </p>
          ) : null}
          <ol className="space-y-3">
            {table.map((row, index) => {
              const companion = league.companions.find((item) => item.id === row.companionId);
              const name = companion?.name ?? companionName(league, row.companionId);
              const team = teamForWeek(league, row.companionId, gate.week);
              const locked = sideSubmissionComplete(league, row.companionId, gate.week);
              const podium = technicalPodiumPrediction(league, row.companionId, gate.week);
              const ownRow = gbboSlug(name) === playerSlug;
              const canSeePick = !finalWeek || canViewFinalPick(league, row.companionId, { isChief, playerSlug });
              const showPodium = finalWeek && podium && canSeePick;
              return (
                <li key={row.companionId} className="ticket flex items-center gap-3 rounded-[22px] px-4 py-3 sm:gap-4">
                  <span className="w-8 shrink-0 font-display text-3xl text-tent-dark sm:w-10">{index + 1}</span>
                  <CompanionPhoto
                    name={name}
                    photo={companionPortrait(companion, companionInDisgrace(league, row.companionId))}
                    crop={companionInDisgrace(league, row.companionId) ? "scene" : "face"}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-2xl leading-tight">{name}</p>
                      {locked ? <Pill tone="tent">{finalWeek ? "Final locked" : "Team locked"}</Pill> : null}
                      {finalWeek && locked && !canSeePick ? <Pill tone="butter">Sealed</Pill> : null}
                      <BeerBaguetteMark companionId={row.companionId} />
                      <SlutDropMark companionId={row.companionId} />
                    </div>
                    <p className="text-sm text-chocolate/70">
                      {canSeePick
                        ? team.map((id) => bakerName(league, id)).join(" · ") || "No bakers yet"
                        : locked
                          ? "Sealed until the reveal"
                          : "No bakers yet"}
                    </p>
                    {showPodium && podium ? (
                      <p className="text-sm text-chocolate/60">
                        1-2-3: {podiumBakerNames(league, [podium.firstId, podium.secondId, podium.thirdId])}
                      </p>
                    ) : finalWeek && !podium && canSeePick && (gate.open || isChief) ? (
                      <p className="text-sm text-raspberry">Technical 1-2-3 still needed</p>
                    ) : null}
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
              <p>
                Each companion plays <strong>{size} baker{size === 1 ? "" : "s"}</strong> this week.
                {size === 1
                  ? " One baker each, for the rest of the competition."
                  : " Last week's side stands unless they substitute one baker."}
                {finalWeek
                  ? " Predict 1st, 2nd and 3rd in the technical as well. The exact order is worth 20 bonus points, and both picks lock at 8pm Tuesday. Votes stay secret until results are posted."
                  : ""}
              </p>
              <p>{gate.summary}</p>
              <p>{latest ? `Last published: ${latest.title}.` : "No episode has been published yet."}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Pill tone="tent">Joker weeks 1–4</Pill>
                <Pill tone="butter">One sub a week</Pill>
                {finalWeek ? <Pill tone="butter">+20 for the technical 1-2-3</Pill> : null}
                {finalWeek ? <Pill tone="raspberry">Picks sealed</Pill> : null}
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
                      ? finalWeek
                        ? "Set your baker and 1-2-3"
                        : "Set this week's bakers"
                      : "Enter your password at the top, then set your bakers"
                    : "See your locked side"}
                </Link>
              )}
            </div>
          </Card>

          <Card eyebrow="The tapes" title="Village Crimewatch">
            <p className="text-sm leading-7 text-chocolate/75">
              {onTape.length > 0
                ? `${onTape.length} punishment${onTape.length === 1 ? "" : "s"} already on tape${
                    baguettesOwed.length > 0
                      ? `, and ${baguettesOwed.length} beer baguette${baguettesOwed.length === 1 ? "" : "s"} still owed`
                      : ""
                  }.`
                : baguettesOwed.length > 0
                  ? `${baguettesOwed.length} beer baguette${baguettesOwed.length === 1 ? "" : "s"} still wanted. Uploads play on Crimewatch.`
                  : "Slut drops, beer baguettes, and technical bake photos all screen on Crimewatch."}
            </p>
            <Link
              href={`${GBBO_LEAGUE_PATH}/crimewatch`}
              className="mt-4 inline-flex rounded-full bg-raspberry px-5 py-2.5 text-sm font-bold text-flour"
            >
              {onTape.length > 0 ? "Watch Crimewatch" : "Open Crimewatch"}
            </Link>
          </Card>
        </div>
      </div>

      <OfficialStatement />

      <MustBakeCallout />

      {latest ? (
        <Card eyebrow="Latest weekend" title={`${latest.title}: ${latest.theme}`}>
          <div className="grid gap-4 md:grid-cols-2">
            {league.companions.map((companion) => {
              const week = scoreCompanionWeek(league, companion.id, latest.week);
              return (
                <div key={companion.id} className="rounded-[22px] bg-flour/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <CompanionPhoto
                        name={companion.name}
                        photo={companionPortrait(companion, companionInDisgrace(league, companion.id))}
                        crop={companionInDisgrace(league, companion.id) ? "scene" : "face"}
                      />
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
