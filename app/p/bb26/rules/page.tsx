"use client";

import { Button, Card, Field, Pill, inputClass } from "@/app/components/gbbo/ui";
import { uid } from "@/app/lib/gbbo/ids";
import { ruleApproved } from "@/app/lib/gbbo/league";
import { useLeague } from "@/app/lib/gbbo/store";

const STANDING = [
  ["+5", "Hollywood handshake"],
  ["+5", "Naughty innuendo with Nigella Lawson"],
  ["+5", "Star Baker"],
  ["+3 / +2 / +1", "Technical first, second and third"],
  ["−3 / −2 / −1", "Technical last, second last and third last"],
  ["−5", "Eliminated"],
  ["−3 each", "Dropping food, utensils or any other item on the floor"],
  ["−3 each", "Crying during the episode"],
];

export default function RulesPage() {
  const { league, update } = useLeague();

  return (
    <div className="space-y-6">
      <Card eyebrow="Official rules" title="How the tent is scored">
        <div className="grid gap-2">
          {STANDING.map(([points, rule]) => (
            <div key={rule} className="flex items-center justify-between gap-4 rounded-[18px] bg-flour/80 px-4 py-3">
              <span>{rule}</span>
              <span className="font-display text-xl text-tent-dark">{points}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-3 text-sm leading-7 text-chocolate/80">
          <p>A team is three bakers, then two when six bakers remain, then one for the final two weeks. Last week's team is the default. Companions do not pick a brand-new side every week — they may substitute one baker, or leave the previous side in place.</p>
          <p>If nobody writes in when the team must shrink, the Chief Companion chooses who leaves. The same baker may be played by more than one companion.</p>
          <p>A joker doubles one weekend and must be played in the first four weeks. If it is still sitting in the drawer, the Chief Companion applies it automatically in week four.</p>
          <p>The companion whose baker finishes last in the technical must complete that technical before the deadline. Fail, and a filmed Beer Baguette is required.</p>
          <p>Ad hoc rules may be added from the weekly theme. They need a two-thirds majority of companions.</p>
        </div>
      </Card>

      <Card
        eyebrow="This week's extra"
        title="Ad hoc rules"
        action={
          <Button onClick={() => update((draft) => {
            draft.adHocRules.push({
              id: uid("rule"),
              week: draft.currentWeek,
              description: "New theme rule",
              points: 3,
              votes: {},
            });
          })}>Propose a rule</Button>
        }
      >
        <div className="space-y-4">
          {league.adHocRules.length === 0 ? (
            <p className="text-sm text-chocolate/70">No extra rules yet. Wait until the theme is known, then put it to the companions.</p>
          ) : null}
          {league.adHocRules.map((rule) => {
            const yes = Object.values(rule.votes).filter((vote) => vote === "yes").length;
            const approved = ruleApproved(league, rule.id);
            return (
              <div key={rule.id} className="rounded-[22px] bg-flour/80 p-4">
                <div className="grid gap-3 md:grid-cols-[1fr_110px_auto]">
                  <Field label="Rule">
                    <input className={inputClass()} value={rule.description} onChange={(event) => update((draft) => {
                      const row = draft.adHocRules.find((item) => item.id === rule.id);
                      if (row) row.description = event.target.value;
                    })} />
                  </Field>
                  <Field label="Points">
                    <input className={inputClass()} type="number" value={rule.points} onChange={(event) => update((draft) => {
                      const row = draft.adHocRules.find((item) => item.id === rule.id);
                      if (row) row.points = Number(event.target.value);
                    })} />
                  </Field>
                  <div className="flex items-end">
                    <Pill tone={approved ? "tent" : "raspberry"}>{approved ? "Carried" : `${yes}/${league.companions.length} yes`}</Pill>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {league.companions.map((companion) => {
                    const vote = rule.votes[companion.id];
                    return (
                      <button
                        key={companion.id}
                        className={`rounded-full px-3 py-1 text-sm font-bold ${
                          vote === "yes" ? "bg-tent text-flour" : vote === "no" ? "bg-raspberry text-flour" : "bg-canvas"
                        }`}
                        onClick={() => update((draft) => {
                          const row = draft.adHocRules.find((item) => item.id === rule.id);
                          if (!row) return;
                          row.votes[companion.id] = vote === "yes" ? "no" : "yes";
                        })}
                      >
                        {companion.name} {vote ?? "undecided"}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
