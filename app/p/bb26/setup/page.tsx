"use client";

import { Button, Card, Field, inputClass } from "@/app/components/gbbo/ui";
import { uid } from "@/app/lib/gbbo/ids";
import { createEmptyLeague, emptyEpisode } from "@/app/lib/gbbo/seed";
import { useLeague } from "@/app/lib/gbbo/store";

export default function SetupPage() {
  const { league, update, replace } = useLeague();

  return (
    <div className="space-y-6">
      <Card eyebrow="Chief Companion" title="League setup" action={
            <div className="flex gap-2">
          <Button tone="ghost" onClick={() => replace(createEmptyLeague())}>Restore the six companions</Button>
        </div>
      }>
        <div className="grid gap-4 md:grid-cols-4">
          <Field label="League name">
            <input className={inputClass()} value={league.name} onChange={(event) => update((draft) => { draft.name = event.target.value; })} />
          </Field>
          <Field label="Series year">
            <input className={inputClass()} type="number" value={league.seriesYear} onChange={(event) => update((draft) => { draft.seriesYear = Number(event.target.value); })} />
          </Field>
          <Field label="Current week">
            <input className={inputClass()} type="number" min={1} max={league.totalWeeks} value={league.currentWeek} onChange={(event) => update((draft) => { draft.currentWeek = Number(event.target.value); })} />
          </Field>
          <Field label="Total weeks">
            <input
              className={inputClass()}
              type="number"
              min={3}
              max={13}
              value={league.totalWeeks}
              onChange={(event) => update((draft) => {
                draft.totalWeeks = Number(event.target.value);
                while (draft.episodes.length < draft.totalWeeks) {
                  draft.episodes.push(emptyEpisode(draft.episodes.length + 1, draft.totalWeeks));
                }
                draft.episodes = draft.episodes.slice(0, draft.totalWeeks);
              })}
            />
          </Field>
        </div>
      </Card>

      <Card eyebrow="The companions" title="Players">
        <div className="space-y-3">
          {league.companions.map((companion) => (
            <div key={companion.id} className="grid gap-3 rounded-[22px] bg-flour/80 p-4 md:grid-cols-[1.3fr_0.5fr_auto_auto_auto]">
              <input className={inputClass()} value={companion.name} onChange={(event) => update((draft) => {
                const row = draft.companions.find((item) => item.id === companion.id);
                if (row) row.name = event.target.value;
              })} />
              <Field label="Last year place">
                <input className={inputClass()} type="number" min={1} value={companion.lastYearPlace} onChange={(event) => update((draft) => {
                  const row = draft.companions.find((item) => item.id === companion.id);
                  if (row) row.lastYearPlace = Number(event.target.value);
                })} />
              </Field>
              <label className="flex items-center gap-2 text-sm font-bold">
                <input type="checkbox" checked={companion.isChief} onChange={(event) => update((draft) => {
                  draft.companions.forEach((item) => { item.isChief = item.id === companion.id ? event.target.checked : false; });
                })} />
                Chief
              </label>
              <label className="flex items-center gap-2 text-sm font-bold">
                <input type="checkbox" checked={companion.isDraftMaster} onChange={(event) => update((draft) => {
                  const row = draft.companions.find((item) => item.id === companion.id);
                  if (row) row.isDraftMaster = event.target.checked;
                })} />
                Draft Master
              </label>
              <Button tone="ghost" onClick={() => update((draft) => {
                draft.companions = draft.companions.filter((item) => item.id !== companion.id);
                delete draft.draftRankings[companion.id];
                draft.initialTeams = draft.initialTeams.filter((team) => team.companionId !== companion.id);
              })}>Remove</Button>
            </div>
          ))}
          <Button onClick={() => update((draft) => {
            draft.companions.push({
              id: uid("comp"),
              name: `Companion ${draft.companions.length + 1}`,
              lastYearPlace: draft.companions.length + 1,
              isChief: draft.companions.length === 0,
              isDraftMaster: draft.companions.length === 0,
            });
          })}>Add a companion</Button>
        </div>
      </Card>

      <Card eyebrow="In the tent" title="Bakers">
        <p className="mb-4 text-sm text-chocolate/70">
          Series 17 names are loaded as a starting twelve. Edit anything that is wrong, or add late arrivals.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {league.bakers.map((baker) => (
            <div key={baker.id} className="grid gap-2 rounded-[22px] bg-flour/80 p-4">
              <div className="grid grid-cols-[1fr_90px] gap-2">
                <input className={inputClass()} value={baker.name} onChange={(event) => update((draft) => {
                  const row = draft.bakers.find((item) => item.id === baker.id);
                  if (row) row.name = event.target.value;
                })} />
                <input className={inputClass()} type="number" placeholder="Age" value={baker.age ?? ""} onChange={(event) => update((draft) => {
                  const row = draft.bakers.find((item) => item.id === baker.id);
                  if (row) row.age = event.target.value ? Number(event.target.value) : null;
                })} />
              </div>
              <input className={inputClass()} value={baker.bio} onChange={(event) => update((draft) => {
                const row = draft.bakers.find((item) => item.id === baker.id);
                if (row) row.bio = event.target.value;
              })} />
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.14em] text-chocolate/50">
                  {baker.eliminatedInWeek ? `Left in week ${baker.eliminatedInWeek}` : "Still in the tent"}
                </p>
                <Button tone="ghost" onClick={() => update((draft) => {
                  draft.bakers = draft.bakers.filter((item) => item.id !== baker.id);
                })}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
        <Button className="mt-4" onClick={() => update((draft) => {
          draft.bakers.push({ id: uid("baker"), name: "New baker", bio: "", age: null, eliminatedInWeek: null });
        })}>Add a baker</Button>
      </Card>
    </div>
  );
}
