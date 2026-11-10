"use client";

import { useState } from "react";
import { gbboSlug } from "@/app/lib/gbbo/identity";
import { outstandingBeerBaguettes } from "@/app/lib/gbbo/league";
import { useGbboSession } from "@/app/lib/gbbo/session";
import { useLeague } from "@/app/lib/gbbo/store";
import type { LeagueState } from "@/app/lib/gbbo/types";
import { PunishmentUpload } from "./PunishmentUpload";
import { Pill } from "./ui";

export function BeerBaguetteMark({ companionId }: { companionId: string }) {
  const { league, acceptLeague } = useLeague();
  const { isChief, playerSlug, playerUnlocked } = useGbboSession();
  const companion = league.companions.find((item) => item.id === companionId);
  const owed = outstandingBeerBaguettes(league).filter((penalty) => penalty.companionId === companionId);
  const [thanksName, setThanksName] = useState<string | null>(null);

  if (!companion) return null;
  if (owed.length === 0) {
    if (!thanksName) return null;
    return (
      <p className="max-w-[16rem] font-script text-xl leading-tight text-raspberry">
        Thank you, {thanksName}. That beer baguette is on the tape.
      </p>
    );
  }

  const canUpload = isChief || (playerUnlocked && playerSlug === gbboSlug(companion.name));
  const multiple = owed.length > 1;

  return (
    <span className="inline-flex min-w-0 flex-wrap items-center gap-2">
      {owed.map((penalty) => (
        <span key={penalty.id} className="inline-flex min-w-0 flex-wrap items-center gap-2">
          <Pill tone="raspberry">
            {multiple ? `Beer baguette owed · week ${penalty.week}` : "Beer baguette owed"}
          </Pill>
          {canUpload ? (
            <PunishmentUpload
              kind="beer_baguette"
              companionId={companionId}
              week={penalty.week}
              penaltyId={penalty.id}
              label={multiple ? `Upload week ${penalty.week} beer baguette` : "Upload beer baguette"}
              onUploaded={(next) => {
                acceptLeague(next as LeagueState);
                setThanksName(companion.name);
                window.setTimeout(() => setThanksName(null), 4000);
              }}
            />
          ) : null}
        </span>
      ))}
    </span>
  );
}
