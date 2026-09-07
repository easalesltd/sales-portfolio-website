"use client";

import { useMemo, useState } from "react";
import { Button, Card, Empty, Pill } from "@/app/components/gbbo/ui";
import { uid } from "@/app/lib/gbbo/ids";
import {
  bakerName,
  bakerStillIn,
  carriedTeam,
  jokerForCompanion,
  lineupChanges,
  selectableBakers,
  teamForWeek,
  teamSizeForWeek,
} from "@/app/lib/gbbo/league";
import { useLeague } from "@/app/lib/gbbo/store";

export default function TeamsPage() {
  const { league, update } = useLeague();
  const week = league.currentWeek;
  const size = teamSizeForWeek(league, week);
  const remaining = selectableBakers(league, week);
  const [picks, setPicks] = useState<Record<string, string[]>>({});

  const defaults = useMemo(() => {
    return Object.fromEntries(
      league.companions.map((companion) => {
        const carried = carriedTeam(league, companion.id, week);
        const current = teamForWeek(league, companion.id, week);
        const base = current.length >= carried.length ? current : carried;
        return [companion.id, padLineup(base, size)];
      }),
    );
  }, [league, week, size]);

  if (!league.draftComplete) {
    return <Empty title="Week 1 teams come from the draft" body="Each companion ranks the bakers, then their top three become this week's playing side. After that, last week's team rolls forward unless they substitute one baker." />;
  }

  function lineupOf(companionId: string): string[] {
    return picks[companionId] ?? defaults[companionId] ?? Array.from({ length: size }, () => "");
  }

  function setSlot(companionId: string, index: number, bakerId: string) {
    setPicks((current) => {
      const next = [...lineupOf(companionId)];
      next[index] = bakerId;
      return { ...current, [companionId]: next };
    });
  }

  return (
    <div className="space-y-6">
      <Card eyebrow="This weekend's sides" title={`Week ${week} playing bakers`}>
        <p className="max-w-3xl text-sm leading-7 text-chocolate/75">
          Each companion fields <strong>{size} baker{size === 1 ? "" : "s"}</strong> this week.
          Last week's team is kept unless a companion substitutes <strong>one</strong> baker.
          If the side has to shrink and nobody writes in, the Chief Companion chooses who sits out.
          More than one companion may play the same baker.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Pill tone="tent">{size} to play</Pill>
          <Pill tone="butter">One change from last week</Pill>
          <Pill tone="raspberry">No change keeps the old side</Pill>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {league.companions.map((companion) => {
          const lastWeek = week > 1 ? teamForWeek(league, companion.id, week - 1) : carriedTeam(league, companion.id, 1);
          const proposed = lineupOf(companion.id);
          const filled = proposed.filter(Boolean);
          const unique = new Set(filled);
          const changes = lineupChanges(
            lastWeek.filter((id) => bakerStillIn(league, id, week)),
            filled,
          );
          const shrinking = lastWeek.filter((id) => bakerStillIn(league, id, week)).length > size;
          const legal = unique.size === filled.length && filled.length === size && (week === 1 ? changes <= 3 : changes <= 1);
          const submitted = league.substitutions.some((sub) => sub.companionId === companion.id && sub.week === week);
          const joker = jokerForCompanion(league, companion.id);
          const canJoker = week <= 4 && !joker;

          return (
            <Card key={companion.id} title={companion.name} action={submitted ? <Pill tone="tent">Submitted</Pill> : <Pill>Rolled forward</Pill>}>
              <p className="mb-3 text-sm text-chocolate/65">
                Last week: {lastWeek.map((id) => bakerName(league, id)).join(" · ") || "No side yet"}
              </p>
              <div className="space-y-2">
                {proposed.map((bakerId, index) => (
                  <select
                    key={`${companion.id}-${index}`}
                    className="w-full rounded-2xl border border-[#e7d3b4] bg-flour px-4 py-2.5 outline-none ring-butter/70 focus:ring-4"
                    value={bakerId}
                    onChange={(event) => setSlot(companion.id, index, event.target.value)}
                  >
                    <option value="">{`Baker ${index + 1}`}</option>
                    {remaining.map((baker) => (
                      <option key={baker.id} value={baker.id}>{baker.name}</option>
                    ))}
                  </select>
                ))}
              </div>
              <p className={`mt-3 text-sm ${legal ? "text-chocolate/65" : "text-raspberry"}`}>
                {week === 1
                  ? "Week 1: choose three bakers still in the tent."
                  : changes === 0
                    ? shrinking
                      ? "This side is too big. Drop one baker, or leave it for the Chief Companion."
                      : "No change — last week's bakers will play again."
                    : changes === 1
                      ? "One substitution. That is the weekly limit."
                      : `${changes} bakers are different from last week. Only one substitution is allowed.`}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  disabled={!legal && !(shrinking && filled.length === size && unique.size === size && changes === 0)}
                  onClick={() => {
                    const previous = lastWeek.filter((id) => bakerStillIn(league, id, week));
                    const next = lineupOf(companion.id).filter(Boolean);
                    const outBakerId = previous.find((id) => !next.includes(id)) ?? previous[previous.length - 1] ?? "";
                    const inBakerId = next.find((id) => !previous.includes(id)) ?? null;
                    update((draft) => {
                      draft.substitutions = draft.substitutions.filter((sub) => !(sub.companionId === companion.id && sub.week === week));
                      if (outBakerId || inBakerId) {
                        draft.substitutions.push({
                          id: uid("sub"),
                          week,
                          companionId: companion.id,
                          outBakerId: outBakerId || next[0],
                          inBakerId,
                          autoByChief: shrinking && !inBakerId,
                        });
                      }
                    });
                  }}
                >
                  Submit this week's side
                </Button>
                <Button
                  tone="ghost"
                  onClick={() => {
                    setPicks((current) => ({ ...current, [companion.id]: padLineup(carriedTeam(league, companion.id, week), size) }));
                    update((draft) => {
                      draft.substitutions = draft.substitutions.filter((sub) => !(sub.companionId === companion.id && sub.week === week));
                    });
                  }}
                >
                  Keep last week
                </Button>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-sm text-chocolate/70">
                  {joker ? `Joker played in week ${joker.week}${joker.autoApplied ? " (auto)" : ""}` : "Joker still available"}
                </p>
                {canJoker ? (
                  <Button tone="butter" onClick={() => update((draft) => {
                    draft.jokers = draft.jokers.filter((item) => item.companionId !== companion.id);
                    draft.jokers.push({ companionId: companion.id, week, autoApplied: false });
                  })}>Play joker</Button>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function padLineup(bakerIds: string[], size: number): string[] {
  const next = bakerIds.slice(0, size);
  while (next.length < size) next.push("");
  return next;
}
