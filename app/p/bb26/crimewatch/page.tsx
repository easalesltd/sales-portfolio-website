"use client";

import { CompanionPhoto } from "@/app/components/gbbo/CompanionPhoto";
import { LastInPointsBoard } from "@/app/components/gbbo/LastInPointsBoard";
import { PunishmentPhoto } from "@/app/components/gbbo/PunishmentPhoto";
import { PunishmentUpload } from "@/app/components/gbbo/PunishmentUpload";
import { PunishmentVideo } from "@/app/components/gbbo/PunishmentVideo";
import { SlutDropMark } from "@/app/components/gbbo/SlutDropMark";
import { TentRules } from "@/app/components/gbbo/TentRules";
import { Card, Empty, Pill } from "@/app/components/gbbo/ui";
import { gbboSlug } from "@/app/lib/gbbo/identity";
import {
  bakerName,
  companionName,
  companionPortrait,
  episodeTheme,
  punishmentExhibits,
  technicalDeadlineAt,
  technicalDeadlineLabel,
  technicalIsComplete,
  type PunishmentExhibit,
} from "@/app/lib/gbbo/league";
import { useGbboSession } from "@/app/lib/gbbo/session";
import { useLeague } from "@/app/lib/gbbo/store";
import type { LeagueState, Penalty } from "@/app/lib/gbbo/types";

const KIND_ORDER: Record<PunishmentExhibit["kind"], number> = {
  slut_drop: 0,
  beer_baguette: 1,
  technical: 2,
};

const KIND_LABEL: Record<PunishmentExhibit["kind"], string> = {
  slut_drop: "Slut drop",
  beer_baguette: "Beer baguette",
  technical: "Technical",
};

function Exhibit({ item }: { item: PunishmentExhibit }) {
  const { league, acceptLeague } = useLeague();
  const { isChief, playerSlug, playerUnlocked } = useGbboSession();
  const companion = league.companions.find((row) => row.id === item.companionId);
  const name = companion?.name ?? companionName(league, item.companionId);
  const penalty = league.penalties.find((row) => row.id === item.id);
  const canUpload = isChief || (playerUnlocked && playerSlug === gbboSlug(name));
  const label = `${name} · week ${item.week} ${KIND_LABEL[item.kind].toLowerCase()}`;
  const onTape = Boolean(item.src);
  const bakeDone = penalty ? technicalIsComplete(penalty) : false;
  const missedBake = penalty?.kind === "technical" && !bakeDone && new Date() >= technicalDeadlineAt(penalty.week);

  return (
    <article className="paper-card rounded-[28px] p-5">
      <div className="mb-4 flex items-start gap-3">
        <CompanionPhoto name={name} photo={companionPortrait(companion, true)} size="md" crop="scene" />
        <div className="min-w-0">
          <p className="font-display text-3xl text-tent-dark">{name}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            <Pill tone={item.kind === "technical" ? "tent" : "raspberry"}>{KIND_LABEL[item.kind]}</Pill>
            {onTape || bakeDone ? <Pill tone="butter">On tape</Pill> : <Pill tone="raspberry">Still owed</Pill>}
            {item.escalated ? <Pill tone="raspberry">Beer baguette also owed</Pill> : null}
            {missedBake ? <Pill tone="raspberry">Deadline passed</Pill> : null}
          </div>
          <ExhibitNote item={item} penalty={penalty} name={name} />
        </div>
      </div>
      {item.photo ? <PunishmentPhoto src={item.src} label={label} /> : <PunishmentVideo src={item.src} label={label} />}
      <ExhibitUpload item={item} penalty={penalty} canUpload={canUpload} onUploaded={(next) => acceptLeague(next)} />
    </article>
  );
}

function ExhibitNote({
  item,
  penalty,
  name,
}: {
  item: PunishmentExhibit;
  penalty: Penalty | undefined;
  name: string;
}) {
  const { league } = useLeague();
  if (item.kind === "slut_drop") {
    return (
      <p className="mt-2 text-sm text-chocolate/70">
        {item.src ? "Caught on tape." : `Owes a slut drop photo or video · ${episodeTheme(league, item.week)}`}
      </p>
    );
  }
  if (!penalty) return null;
  return (
    <div className="mt-2 space-y-1 text-sm text-chocolate/70">
      <p>
        {penalty.bakerId ? `After ${bakerName(league, penalty.bakerId)}. ` : ""}
        {penalty.note}
      </p>
      {penalty.kind === "technical" ? (
        <p className="font-bold text-tent-dark">
          {technicalIsComplete(penalty)
            ? "Bake photo uploaded."
            : `${name} must bake this week. Upload a photo before ${technicalDeadlineLabel(penalty.week)}.`}
        </p>
      ) : null}
    </div>
  );
}

function ExhibitUpload({
  item,
  penalty,
  canUpload,
  onUploaded,
}: {
  item: PunishmentExhibit;
  penalty: Penalty | undefined;
  canUpload: boolean;
  onUploaded: (next: LeagueState) => void;
}) {
  if (item.kind === "slut_drop" && !item.src) {
    return (
      <div className="mt-3">
        <SlutDropMark companionId={item.companionId} week={item.week} />
      </div>
    );
  }
  if (!penalty || !canUpload || item.src) return null;
  if (penalty.kind === "technical" && technicalIsComplete(penalty)) return null;
  return (
    <div className="mt-3">
      <PunishmentUpload
        kind={penalty.kind}
        companionId={penalty.companionId}
        week={penalty.week}
        penaltyId={penalty.id}
        label={penalty.kind === "technical" ? "Upload bake photo" : "Upload beer baguette"}
        onUploaded={(next) => onUploaded(next as LeagueState)}
      />
    </div>
  );
}

export default function CrimewatchPage() {
  const { league } = useLeague();
  const exhibits = [...punishmentExhibits(league)].sort(
    (a, b) => a.week - b.week || KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || a.companionId.localeCompare(b.companionId),
  );
  const weeks = [...new Set(exhibits.map((item) => item.week))];

  return (
    <div className="space-y-8">
      <Card eyebrow="Have you seen this companion?" title="Village Crimewatch">
        <p className="max-w-2xl text-sm leading-7 text-chocolate/75">
          The tape runs in order. Scroll down and each week plays that week’s slut drops, then its beer baguettes,
          then the technical bakes. If a frame is missing, the accused is still at large.
        </p>
      </Card>

      {exhibits.length === 0 ? (
        <Empty
          title="Nothing on the tape"
          body="The village CCTV is still empty. When the first slut drop or beer baguette is uploaded, it shows here, week by week."
        />
      ) : (
        weeks.map((week) => {
          const episode = league.episodes.find((row) => row.week === week);
          const theme = episode?.theme.trim();
          const subtitle = [episode?.title, theme].filter(Boolean).join(" · ");
          const items = exhibits.filter((item) => item.week === week);
          return (
            <section key={week} aria-label={`Week ${week}`} className="mx-auto max-w-md space-y-4">
              <header className="border-b border-[#e7d3b4] pb-3">
                <p className="font-script text-2xl text-raspberry">{subtitle || episodeTheme(league, week)}</p>
                <h2 className="font-display text-4xl text-tent-dark">Week {week}</h2>
              </header>
              <div className="flex flex-col gap-5">
                {items.map((item) => (
                  <Exhibit key={item.id} item={item} />
                ))}
              </div>
            </section>
          );
        })
      )}

      <LastInPointsBoard />
      <TentRules />
    </div>
  );
}
