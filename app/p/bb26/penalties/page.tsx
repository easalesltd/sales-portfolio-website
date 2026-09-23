"use client";

import { CompanionPhoto } from "@/app/components/gbbo/CompanionPhoto";
import { PunishmentUpload } from "@/app/components/gbbo/PunishmentUpload";
import { PunishmentVideo } from "@/app/components/gbbo/PunishmentVideo";
import { Button, Card, Empty, Pill } from "@/app/components/gbbo/ui";
import { gbboSlug } from "@/app/lib/gbbo/identity";
import { bakerName, companionInDisgrace, companionName, companionPortrait, penaltyVideoSrc } from "@/app/lib/gbbo/league";
import { uid } from "@/app/lib/gbbo/ids";
import { useGbboSession } from "@/app/lib/gbbo/session";
import { useLeague } from "@/app/lib/gbbo/store";
import type { LeagueState } from "@/app/lib/gbbo/types";

export default function PenaltiesPage() {
  const { league, update, acceptLeague } = useLeague();
  const { isChief, playerSlug, playerUnlocked } = useGbboSession();

  if (league.penalties.length === 0) {
    return <Empty title="No penalties yet" body="The companion whose baker finishes last in the technical must bake it before the deadline. Miss that, and it is beer baguette time." />;
  }

  return (
    <div className="space-y-6">
      <Card eyebrow="Consequences" title="Technical challenges and beer baguettes">
        <p className="text-sm leading-7 text-chocolate/75">
          A Beer Baguette is a beer drunk through a baguette, or other bread, in a single motion.
          It must be filmed and uploaded here or it does not count. Creativity is acceptable.
          Miss a slut drop before the next episode and a filmed Beer Baguette is added to the debt.
          A loverly treat awaits the eventual winner. The official technical recipe for each week lives on
          Technical recipes once Love Productions post it.
        </p>
      </Card>
      <div className="grid gap-4">
        {league.penalties.map((penalty) => (
          <div key={penalty.id} className="paper-card flex flex-wrap items-center justify-between gap-4 rounded-[28px] p-5">
            <div className="flex min-w-0 items-start gap-3">
              <CompanionPhoto
                name={companionName(league, penalty.companionId)}
                photo={companionPortrait(
                  league.companions.find((item) => item.id === penalty.companionId),
                  companionInDisgrace(league, penalty.companionId),
                )}
                size="md"
                crop={companionInDisgrace(league, penalty.companionId) ? "scene" : "face"}
              />
              <div>
              <div className="flex flex-wrap gap-2">
                <Pill tone={penalty.kind === "beer_baguette" ? "raspberry" : "tent"}>
                  {penalty.kind === "beer_baguette" ? "Beer baguette" : "Technical"}
                </Pill>
                <Pill>Week {penalty.week}</Pill>
                {penalty.completed && (penalty.kind !== "beer_baguette" || penalty.videoId) ? (
                  <Pill tone="butter">Done</Pill>
                ) : (
                  <Pill tone="raspberry">Outstanding</Pill>
                )}
              </div>
              <p className="mt-2 font-display text-3xl text-tent-dark">
                {companionName(league, penalty.companionId)}
                {penalty.kind === "technical" && !penalty.completed ? " must bake this" : ""}
              </p>
              <p className="text-sm text-chocolate/70">
                {penalty.bakerId ? `After ${bakerName(league, penalty.bakerId)}. ` : ""}
                {penalty.note}
                {penalty.deadline ? ` Deadline: ${penalty.deadline.replace("T", " ")}.` : ""}
              </p>
              <PunishmentVideo
                src={penaltyVideoSrc(penalty)}
                label={`${companionName(league, penalty.companionId)}'s week ${penalty.week} beer baguette`}
              />
              </div>
            </div>
            <div className="flex flex-wrap items-start gap-2">
              {penalty.kind === "beer_baguette" && !penalty.videoId && (
                isChief || (playerUnlocked && playerSlug === gbboSlug(companionName(league, penalty.companionId)))
              ) ? (
                <PunishmentUpload
                  kind="beer_baguette"
                  companionId={penalty.companionId}
                  week={penalty.week}
                  penaltyId={penalty.id}
                  label="Upload beer baguette"
                  onUploaded={(next) => acceptLeague(next as LeagueState)}
                />
              ) : null}
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
                    videoId: null,
                  });
                })}>Missed the deadline</Button>
              ) : null}
              {penalty.kind === "technical" ? (
                <Button tone={penalty.completed ? "ghost" : "tent"} onClick={() => update((draft) => {
                  const row = draft.penalties.find((item) => item.id === penalty.id);
                  if (row) row.completed = !row.completed;
                })}>
                  {penalty.completed ? "Mark outstanding" : "Mark completed"}
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
