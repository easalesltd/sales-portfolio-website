"use client";

import { Button, Card, Empty, Pill } from "@/app/components/gbbo/ui";
import { bakerName, companionName } from "@/app/lib/gbbo/league";
import { uid } from "@/app/lib/gbbo/ids";
import { useLeague } from "@/app/lib/gbbo/store";

export default function PenaltiesPage() {
  const { league, update } = useLeague();

  if (league.penalties.length === 0) {
    return <Empty title="No penalties yet" body="The companion whose baker finishes last in the technical must bake it before the deadline. Miss that, and it is beer baguette time." />;
  }

  return (
    <div className="space-y-6">
      <Card eyebrow="Consequences" title="Technical challenges and beer baguettes">
        <p className="text-sm leading-7 text-chocolate/75">
          A Beer Baguette is a beer drunk through a baguette, or other bread, in a single motion.
          It must be videoed and shared with the companions or it does not count. Creativity is acceptable.
          A loverly treat awaits the eventual winner.
        </p>
      </Card>
      <div className="grid gap-4">
        {league.penalties.map((penalty) => (
          <div key={penalty.id} className="paper-card flex flex-wrap items-center justify-between gap-4 rounded-[28px] p-5">
            <div>
              <div className="flex flex-wrap gap-2">
                <Pill tone={penalty.kind === "beer_baguette" ? "raspberry" : "tent"}>
                  {penalty.kind === "beer_baguette" ? "Beer baguette" : "Technical"}
                </Pill>
                <Pill>Week {penalty.week}</Pill>
                {penalty.completed ? <Pill tone="butter">Done</Pill> : <Pill tone="raspberry">Outstanding</Pill>}
              </div>
              <p className="mt-2 font-display text-2xl">{companionName(league, penalty.companionId)}</p>
              <p className="text-sm text-chocolate/70">
                After {bakerName(league, penalty.bakerId)}. {penalty.note}
                {penalty.deadline ? ` Deadline: ${penalty.deadline.replace("T", " ")}.` : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {!penalty.completed && penalty.kind === "technical" ? (
                <Button tone="raspberry" onClick={() => update((draft) => {
                  const row = draft.penalties.find((item) => item.id === penalty.id);
                  if (!row) return;
                  row.completed = false;
                  draft.penalties.push({
                    ...row,
                    id: uid("pen"),
                    kind: "beer_baguette",
                    note: `${companionName(draft, row.companionId)} missed the technical deadline.`,
                    completed: false,
                  });
                })}>Missed the deadline</Button>
              ) : null}
              <Button tone={penalty.completed ? "ghost" : "tent"} onClick={() => update((draft) => {
                const row = draft.penalties.find((item) => item.id === penalty.id);
                if (row) row.completed = !row.completed;
              })}>
                {penalty.completed ? "Mark outstanding" : "Mark completed"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
