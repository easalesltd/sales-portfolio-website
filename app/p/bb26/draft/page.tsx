"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Card, Empty, Pill } from "@/app/components/gbbo/ui";
import { bakerName, companionName, draftOrder, runDraft } from "@/app/lib/gbbo/league";
import { useLeague } from "@/app/lib/gbbo/store";

export default function DraftPage() {
  const { league, update } = useLeague();
  const [notes, setNotes] = useState<string[]>([]);
  const order = useMemo(() => draftOrder(league.companions), [league.companions]);
  const [activeId, setActiveId] = useState(league.companions[0]?.id ?? "");

  const active = league.companions.find((companion) => companion.id === activeId) ?? league.companions[0];
  const ranking = active ? (league.draftRankings[active.id] ?? league.bakers.map((baker) => baker.id)) : [];

  useEffect(() => {
    if (!active || league.draftRankings[active.id] || league.bakers.length === 0) return;
    update((draft) => {
      if (!draft.draftRankings[active.id]) {
        draft.draftRankings[active.id] = draft.bakers.map((baker) => baker.id);
      }
    });
  }, [active, league.bakers.length, league.draftRankings, update]);

  function move(bakerId: string, direction: -1 | 1) {
    if (!active) return;
    update((draft) => {
      const current = draft.draftRankings[active.id] ?? draft.bakers.map((baker) => baker.id);
      const index = current.indexOf(bakerId);
      const next = index + direction;
      if (index < 0 || next < 0 || next >= current.length) return;
      const copy = [...current];
      [copy[index], copy[next]] = [copy[next], copy[index]];
      draft.draftRankings[active.id] = copy;
    });
  }

  function completeDraft() {
    const result = runDraft(league);
    update((draft) => {
      draft.initialTeams = result.teams;
      draft.draftComplete = true;
    });
    setNotes(result.leftoverNotes);
  }

  if (league.companions.length === 0) {
    return <Empty title="No companions yet" body="Add last year's finishing order in Setup so the draft can run in reverse." />;
  }

  return (
    <div className="space-y-6">
      <Card
        eyebrow="Draft Master"
        title="Week 1 preference lists"
        action={<Button onClick={completeDraft} disabled={league.bakers.length === 0}>Run the draft</Button>}
      >
        <p className="max-w-3xl text-sm leading-7 text-chocolate/75">
          Each companion ranks the twelve bakers. Their top three become the week 1 playing side.
          After that, last week's team is kept unless they substitute one baker. With six companions,
          the same baker may be picked by more than one tent.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {order.map((companion, index) => (
            <Pill key={companion.id} tone={index === 0 ? "tent" : "cream"}>
              {index + 1}. {companion.name}
            </Pill>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <Card title="Rank for">
          <div className="space-y-2">
            {league.companions.map((companion) => (
              <button
                key={companion.id}
                onClick={() => setActiveId(companion.id)}
                className={`block w-full rounded-2xl px-4 py-3 text-left font-bold ${
                  companion.id === active?.id ? "bg-tent text-flour" : "bg-flour"
                }`}
              >
                {companion.name}
              </button>
            ))}
          </div>
        </Card>

        <Card eyebrow="First is most wanted" title={`${active?.name ?? "Companion"}'s list`}>
          <ol className="space-y-2">
            {ranking.map((bakerId, index) => (
              <li key={bakerId} className="flex items-center gap-3 rounded-[18px] bg-flour/80 px-4 py-2">
                <span className="w-8 font-display text-2xl text-tent-dark">{index + 1}</span>
                <span className="flex-1">{bakerName(league, bakerId)}</span>
                <Button tone="ghost" onClick={() => move(bakerId, -1)}>Up</Button>
                <Button tone="ghost" onClick={() => move(bakerId, 1)}>Down</Button>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {league.draftComplete ? (
        <Card eyebrow="Allocated" title="Opening teams">
          <div className="grid gap-4 md:grid-cols-2">
            {league.initialTeams.map((team) => (
              <div key={team.companionId} className="rounded-[22px] bg-flour/80 p-4">
                <p className="font-display text-2xl">{companionName(league, team.companionId)}</p>
                <p className="mt-2 text-sm text-chocolate/75">
                  {team.bakerIds.map((id) => bakerName(league, id)).join(" · ")}
                </p>
              </div>
            ))}
          </div>
          {notes.length > 0 ? (
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-chocolate/70">
              {notes.map((note) => <li key={note}>{note}</li>)}
            </ul>
          ) : null}
        </Card>
      ) : null}
    </div>
  );
}
