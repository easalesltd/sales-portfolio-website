"use client";

import { useState } from "react";
import { gbboSlug } from "@/app/lib/gbbo/identity";
import {
  latestSlutDropWeek,
  outstandingSlutDropWeek,
  owesSlutDrop,
  slutDropFor,
  slutDropVideoSrc,
} from "@/app/lib/gbbo/league";
import { useGbboSession } from "@/app/lib/gbbo/session";
import { useLeague } from "@/app/lib/gbbo/store";
import type { LeagueState } from "@/app/lib/gbbo/types";
import { PunishmentUpload } from "./PunishmentUpload";
import { PunishmentVideo } from "./PunishmentVideo";
import { Pill } from "./ui";

export function SlutDropMark({
  companionId,
  week,
}: {
  companionId: string;
  week?: number;
}) {
  const { league, acceptLeague } = useLeague();
  const { isChief, playerSlug, playerUnlocked } = useGbboSession();
  const companion = league.companions.find((item) => item.id === companionId);
  const targetWeek = week ?? outstandingSlutDropWeek(league, companionId) ?? latestSlutDropWeek(league, companionId);
  const [thanks, setThanks] = useState(false);

  if (!companion || targetWeek == null) return null;
  if (week && !owesSlutDrop(league, companionId, week)) return null;

  const dropWeek = targetWeek;
  const drop = slutDropFor(league, companionId, dropWeek);
  const videoSrc = drop ? slutDropVideoSrc(drop) : null;
  const completed = Boolean(drop?.completed && drop.videoId);
  const owed = owesSlutDrop(league, companionId, dropWeek) && !completed;
  if (!owed && !completed && !thanks) return null;

  const canUpload = owed && (isChief || (playerUnlocked && playerSlug === gbboSlug(companion.name)));

  if (thanks) {
    return (
      <p className="max-w-[16rem] font-script text-xl leading-tight text-raspberry">
        Thank you, {companion.name}. Your slut drop is on the tape.
      </p>
    );
  }

  return (
    <span className="inline-flex min-w-0 flex-col items-start gap-2">
      <span className="inline-flex flex-wrap items-center gap-2">
        {completed ? <Pill tone="butter">Slut drop on tape</Pill> : <Pill tone="raspberry">Slut Drop Owed</Pill>}
        {drop?.escalated ? <Pill tone="raspberry">Beer baguette also owed</Pill> : null}
        {canUpload ? (
          <PunishmentUpload
            kind="slut_drop"
            companionId={companionId}
            week={dropWeek}
            label="Upload slut drop"
            onUploaded={(next) => {
              acceptLeague(next as LeagueState);
              setThanks(true);
              window.setTimeout(() => setThanks(false), 4000);
            }}
          />
        ) : null}
      </span>
      {videoSrc ? <PunishmentVideo src={videoSrc} label={`${companion.name}'s week ${dropWeek} slut drop`} compact /> : null}
    </span>
  );
}
