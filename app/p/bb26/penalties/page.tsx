"use client";

import { CompanionPhoto } from "@/app/components/gbbo/CompanionPhoto";
import { PunishmentPhoto } from "@/app/components/gbbo/PunishmentPhoto";
import { PunishmentUpload } from "@/app/components/gbbo/PunishmentUpload";
import { PunishmentVideo } from "@/app/components/gbbo/PunishmentVideo";
import { Card, Empty, Pill } from "@/app/components/gbbo/ui";
import { gbboSlug } from "@/app/lib/gbbo/identity";
import {
  bakerName,
  companionName,
  companionPortrait,
  penaltyVideoSrc,
  technicalDeadlineAt,
  technicalDeadlineLabel,
  technicalIsComplete,
} from "@/app/lib/gbbo/league";
import { useGbboSession } from "@/app/lib/gbbo/session";
import { useLeague } from "@/app/lib/gbbo/store";
import type { LeagueState } from "@/app/lib/gbbo/types";

export default function PenaltiesPage() {
  const { league, acceptLeague } = useLeague();
  const { isChief, playerSlug, playerUnlocked } = useGbboSession();

  if (league.penalties.length === 0) {
    return (
      <Empty
        title="No penalties yet"
        body="The companion whose baker finishes last in the technical must bake it and upload a photo before the next episode. Miss that, and a filmed beer baguette is added."
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card eyebrow="Consequences" title="Technical challenges and beer baguettes">
        <p className="text-sm leading-7 text-chocolate/75">
          If your baker comes last in the technical, you bake that recipe and upload a photo here before the next
          episode starts. That photo is the proof. Miss the deadline and a filmed Beer Baguette is added as well.
          A Beer Baguette is a beer drunk through a baguette, or other bread, in a single motion. It must be filmed
          and uploaded or it does not count.
        </p>
      </Card>
      <div className="grid gap-4">
        {league.penalties.map((penalty) => {
          const companion = league.companions.find((item) => item.id === penalty.companionId);
          const name = companionName(league, penalty.companionId);
          const canUpload = isChief || (playerUnlocked && playerSlug === gbboSlug(name));
          const bakeDone = technicalIsComplete(penalty);
          const baguetteDone = penalty.kind === "beer_baguette" && Boolean(penalty.videoId);
          const done = penalty.kind === "technical" ? bakeDone : baguetteDone;
          const due = technicalDeadlineAt(penalty.week);
          const missedBake = penalty.kind === "technical" && !bakeDone && new Date() >= due;

          return (
            <div key={penalty.id} className="paper-card flex flex-wrap items-center justify-between gap-4 rounded-[28px] p-5">
              <div className="flex min-w-0 items-start gap-3">
                <CompanionPhoto
                  name={name}
                  photo={companion?.disgracePhoto || companionPortrait(companion, true)}
                  size="md"
                  crop="scene"
                />
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Pill tone={penalty.kind === "beer_baguette" ? "raspberry" : "tent"}>
                      {penalty.kind === "beer_baguette" ? "Beer baguette" : "Technical"}
                    </Pill>
                    <Pill>Week {penalty.week}</Pill>
                    {done ? <Pill tone="butter">Done</Pill> : <Pill tone="raspberry">Outstanding</Pill>}
                    {missedBake ? <Pill tone="raspberry">Deadline passed</Pill> : null}
                  </div>
                  <p className="mt-2 font-display text-3xl text-tent-dark">
                    {name}
                    {penalty.kind === "technical" && !bakeDone ? " must bake this" : ""}
                  </p>
                  <p className="text-sm text-chocolate/70">
                    {penalty.bakerId ? `After ${bakerName(league, penalty.bakerId)}. ` : ""}
                    {penalty.note}
                  </p>
                  {penalty.kind === "technical" ? (
                    <p className="mt-1 text-sm font-bold text-tent-dark">
                      {bakeDone
                        ? "Bake photo uploaded."
                        : `Upload a photo of the bake before ${technicalDeadlineLabel(penalty.week)}.`}
                    </p>
                  ) : null}
                  {penalty.kind === "technical" ? (
                    <PunishmentPhoto src={penaltyVideoSrc(penalty)} label={`${name}'s week ${penalty.week} technical bake`} />
                  ) : (
                    <PunishmentVideo src={penaltyVideoSrc(penalty)} label={`${name}'s week ${penalty.week} beer baguette`} />
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-start gap-2">
                {penalty.kind === "technical" && !bakeDone && canUpload ? (
                  <PunishmentUpload
                    kind="technical"
                    companionId={penalty.companionId}
                    week={penalty.week}
                    penaltyId={penalty.id}
                    label="Upload bake photo"
                    onUploaded={(next) => acceptLeague(next as LeagueState)}
                  />
                ) : null}
                {penalty.kind === "beer_baguette" && !penalty.videoId && canUpload ? (
                  <PunishmentUpload
                    kind="beer_baguette"
                    companionId={penalty.companionId}
                    week={penalty.week}
                    penaltyId={penalty.id}
                    label="Upload beer baguette"
                    onUploaded={(next) => acceptLeague(next as LeagueState)}
                  />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
