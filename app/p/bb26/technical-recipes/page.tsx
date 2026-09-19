"use client";

import { useEffect, useState } from "react";
import { Button, Card, Empty, Pill } from "@/app/components/gbbo/ui";
import { bakerName, companionsOwningBaker, lowestTechnicalBaker } from "@/app/lib/gbbo/league";
import { OFFICIAL_TECHNICAL_INDEX } from "@/app/lib/gbbo/recipes";
import { useGbboSession } from "@/app/lib/gbbo/session";
import { useLeague } from "@/app/lib/gbbo/store";
import { WEEK_THEMES } from "@/app/lib/gbbo/seed";
import { episodeDoneAt, formatLondon, teamWindow } from "@/app/lib/gbbo/window";
import type { LeagueState } from "@/app/lib/gbbo/types";

export default function TechnicalRecipesPage() {
  const { league, replace } = useLeague();
  const { isChief } = useGbboSession();
  const [message, setMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const gate = teamWindow(new Date(), league.totalWeeks);

  async function refreshRecipes() {
    setRefreshing(true);
    setMessage("");
    try {
      const response = await fetch("/api/gbbo-technical-recipes", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = (await response.json()) as {
        league?: LeagueState;
        error?: string;
        seeded?: boolean;
        assignedWeeks?: number[];
      };
      if (!response.ok) throw new Error(data.error ?? "Could not refresh recipes.");
      if (data.league) replace(data.league);
      setMessage(
        data.seeded
          ? "Watching the official recipe list. New technicals will land here after each episode."
          : data.assignedWeeks?.length
            ? `Added week ${data.assignedWeeks.join(", ")} from the official site.`
            : "No new official technical yet.",
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not refresh recipes.");
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void refreshRecipes();
    // First visit snapshots the current official list so last year's recipes are not dumped into week 1.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <Card
        eyebrow="Penalty homework"
        title="Technical bake recipes"
        action={
          <Button tone="ghost" disabled={refreshing} onClick={() => void refreshRecipes()}>
            {refreshing ? "Checking the official site…" : "Check for this week's recipe"}
          </Button>
        }
      >
        <p className="max-w-3xl text-sm leading-7 text-chocolate/75">
          Whoever's baker finishes last in the technical has to bake it.
          After each Tuesday episode, this page pulls the new technical from the official
          {" "}
          <a className="font-bold underline" href={OFFICIAL_TECHNICAL_INDEX} target="_blank" rel="noreferrer">
            Bake Off recipes
          </a>
          {" "}
          list and keeps the link here. We send you to their page rather than copying the method.
        </p>
        {message ? <p className="mt-3 text-sm font-bold text-tent">{message}</p> : null}
      </Card>

      {Array.from({ length: league.totalWeeks }, (_, index) => index + 1).map((week) => {
        const episode = league.episodes.find((item) => item.week === week);
        const recipe = league.technicalRecipes.find((item) => item.week === week);
        const last = episode ? lowestTechnicalBaker(episode) : null;
        const owners = last ? companionsOwningBaker(league, last, week) : [];
        const aired = new Date() >= episodeDoneAt(week);
        const theme = episode?.theme || WEEK_THEMES[week - 1] || `Week ${week}`;

        return (
          <Card
            key={week}
            eyebrow={`Week ${week}`}
            title={theme}
            action={week === gate.week ? <Pill tone="tent">This week</Pill> : aired ? <Pill>Aired</Pill> : <Pill tone="butter">Not yet</Pill>}
          >
            {recipe ? (
              <p className="font-display text-2xl text-tent-dark">
                <a className="underline decoration-raspberry/40 underline-offset-4 hover:text-raspberry" href={recipe.url} target="_blank" rel="noreferrer">
                  {recipe.title}
                </a>
              </p>
            ) : (
              <Empty
                title={aired ? "Waiting for the official recipe" : "Episode has not finished yet"}
                body={
                  aired
                    ? "Check again after Love Productions post this week's technical on the official recipes page."
                    : `This week's technical appears after the episode finishes at ${formatLondon(episodeDoneAt(week))}.`
                }
              />
            )}
            {owners.length > 0 ? (
              <p className="mt-4 text-sm leading-7 text-chocolate/75">
                Must bake it: {owners.map((owner) => owner.name).join(", ")}
                {last ? `, because ${bakerName(league, last)} came last in the technical.` : "."}
              </p>
            ) : episode?.published ? (
              <p className="mt-4 text-sm text-chocolate/65">No last-place technical is on the ledger yet.</p>
            ) : (
              <p className="mt-4 text-sm text-chocolate/65">
                Once the week is scored, the companions who owned the last-place baker will show here.
              </p>
            )}
            {isChief && recipe ? (
              <p className="mt-2 text-xs text-chocolate/50">Pinned from {recipe.url}</p>
            ) : null}
          </Card>
        );
      })}
    </div>
  );
}
