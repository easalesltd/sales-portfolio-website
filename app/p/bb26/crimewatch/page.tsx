"use client";

import { useMemo, useState } from "react";
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
  outstandingBeerBaguettes,
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

type TapeFilter = "all" | "on_tape" | "owed" | "beer_baguette";

function exhibitOnTape(item: PunishmentExhibit, penalty: Penalty | undefined): boolean {
  if (item.kind === "technical") return penalty ? technicalIsComplete(penalty) : Boolean(item.src);
  return Boolean(item.src);
}

function Exhibit({ item }: { item: PunishmentExhibit }) {
  const { league, acceptLeague } = useLeague();
  const { isChief, playerSlug, playerUnlocked } = useGbboSession();
  const companion = league.companions.find((row) => row.id === item.companionId);
  const name = companion?.name ?? companionName(league, item.companionId);
  const penalty = league.penalties.find((row) => row.id === item.id);
  const canUpload = isChief || (playerUnlocked && playerSlug === gbboSlug(name));
  const label = `${name} · week ${item.week} ${KIND_LABEL[item.kind].toLowerCase()}`;
  const onTape = exhibitOnTape(item, penalty);
  const bakeDone = penalty ? technicalIsComplete(penalty) : false;
  const missedBake = penalty?.kind === "technical" && !bakeDone && new Date() >= technicalDeadlineAt(penalty.week);

  return (
    <article id={`exhibit-${item.id}`} className="paper-card scroll-mt-24 rounded-[28px] p-5 sm:scroll-mt-8">
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

function filterExhibits(
  exhibits: PunishmentExhibit[],
  league: LeagueState,
  filter: TapeFilter,
): PunishmentExhibit[] {
  return exhibits.filter((item) => {
    const penalty = league.penalties.find((row) => row.id === item.id);
    const onTape = exhibitOnTape(item, penalty);
    if (filter === "on_tape") return onTape;
    if (filter === "owed") return !onTape;
    if (filter === "beer_baguette") return item.kind === "beer_baguette";
    return true;
  });
}

export default function CrimewatchPage() {
  const { league } = useLeague();
  const exhibits = useMemo(
    () =>
      [...punishmentExhibits(league)].sort(
        (a, b) => b.week - a.week || KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || a.companionId.localeCompare(b.companionId),
      ),
    [league],
  );
  const baguettesAtLarge = outstandingBeerBaguettes(league);
  const onTape = exhibits.filter((item) =>
    exhibitOnTape(
      item,
      league.penalties.find((row) => row.id === item.id),
    ),
  );
  // Beer baguettes first so Nest (and Lee) stay visible above a long slut-drop / technical queue.
  const freshTape = useMemo(() => {
    const bags = onTape.filter((item) => item.kind === "beer_baguette");
    const rest = onTape.filter((item) => item.kind !== "beer_baguette");
    return [...bags, ...rest].slice(0, Math.max(8, bags.length));
  }, [onTape]);
  const defaultFilter: TapeFilter = baguettesAtLarge.length > 0 && onTape.length === 0 ? "beer_baguette" : "all";
  const [filter, setFilter] = useState<TapeFilter>(defaultFilter);
  const visible = filterExhibits(exhibits, league, filter);
  const weeks = [...new Set(visible.map((item) => item.week))];

  const filters: { id: TapeFilter; label: string; count: number }[] = [
    { id: "all", label: "Full tape", count: exhibits.length },
    { id: "on_tape", label: "On tape", count: onTape.length },
    {
      id: "owed",
      label: "Still owed",
      count: exhibits.length - onTape.length,
    },
    { id: "beer_baguette", label: "Beer baguettes", count: exhibits.filter((item) => item.kind === "beer_baguette").length },
  ];

  return (
    <div className="space-y-8">
      <Card eyebrow="Have you seen this companion?" title="Village Crimewatch">
        <p className="max-w-2xl text-sm leading-7 text-chocolate/75">
          Nest&apos;s beer baguette, every slut drop, and the technical bake photos all land here. Newest week first.
          Jump a week below, or filter to On tape when someone has just uploaded.
        </p>
        <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Crimewatch filters">
          {filters.map((item) => {
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  active ? "bg-tent text-flour" : "bg-flour/80 text-chocolate hover:bg-white"
                }`}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
                <span className={`ml-2 text-xs ${active ? "text-flour/80" : "text-chocolate/55"}`}>{item.count}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {onTape.length > 0 && filter !== "owed" ? (
        <Card eyebrow="Freshly booked" title="Just on the tape">
          <p className="mb-4 max-w-2xl text-sm leading-7 text-chocolate/75">
            Beer baguettes lead this list, then the newest slut drops and technicals. Tap a name to jump to the clip.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {freshTape.map((item) => {
              const companion = league.companions.find((row) => row.id === item.companionId);
              const name = companion?.name ?? companionName(league, item.companionId);
              const portrait = companionPortrait(companion, true);
              return (
                <li key={`fresh-${item.id}`}>
                  <a
                    href={`#exhibit-${item.id}`}
                    className="flex items-center gap-3 rounded-[22px] bg-butter/40 px-4 py-3 transition hover:bg-butter/70"
                  >
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#efe2c8] ring-2 ring-white">
                      {portrait ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={portrait} alt="" className="h-full w-full object-cover object-center" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center font-display text-lg text-flour">
                          {name.slice(0, 1)}
                        </span>
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="font-display text-2xl leading-tight text-tent-dark">{name}</p>
                      <p className="text-sm text-chocolate/70">
                        Week {item.week} · {KIND_LABEL[item.kind]}
                      </p>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </Card>
      ) : null}

      {baguettesAtLarge.length > 0 && (filter === "all" || filter === "owed" || filter === "beer_baguette") ? (
        <Card eyebrow="Still at large" title="Beer baguettes wanted">
          <ul className="space-y-3">
            {baguettesAtLarge.map((penalty) => {
              const companion = league.companions.find((row) => row.id === penalty.companionId);
              const name = companion?.name ?? companionName(league, penalty.companionId);
              return (
                <li
                  key={penalty.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] bg-raspberry/10 px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <CompanionPhoto name={name} photo={companionPortrait(companion, true)} crop="scene" />
                    <div className="min-w-0">
                      <p className="font-display text-2xl text-tent-dark">{name}</p>
                      <p className="text-sm text-chocolate/70">{penalty.note}</p>
                    </div>
                  </div>
                  <Pill tone="raspberry">Beer baguette owed</Pill>
                </li>
              );
            })}
          </ul>
        </Card>
      ) : null}

      {visible.length === 0 ? (
        <Empty
          title={exhibits.length === 0 ? "Nothing on the tape" : "Nothing in this filter"}
          body={
            exhibits.length === 0
              ? "The village CCTV is still empty. When the first slut drop or beer baguette is uploaded, it shows here, week by week."
              : "Try Full tape, or wait for the next upload."
          }
        />
      ) : (
        <>
          {weeks.length > 1 ? (
            <nav
              aria-label="Jump to week"
              className="sticky top-[3.25rem] z-20 -mx-1 flex gap-2 overflow-x-auto bg-[#fbf4e8]/92 px-1 py-2 backdrop-blur-md sm:top-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {weeks.map((week) => (
                <a
                  key={`jump-${week}`}
                  href={`#crimewatch-week-${week}`}
                  className="shrink-0 rounded-full bg-flour/90 px-4 py-2 text-sm font-bold text-chocolate ring-1 ring-[#e7d3b4] hover:bg-white"
                >
                  Week {week}
                </a>
              ))}
            </nav>
          ) : null}

          {weeks.map((week) => {
            const episode = league.episodes.find((row) => row.week === week);
            const theme = episode?.theme.trim();
            const subtitle = [episode?.title, theme].filter(Boolean).join(" · ");
            const items = visible.filter((item) => item.week === week);
            return (
              <section
                key={week}
                id={`crimewatch-week-${week}`}
                aria-label={`Week ${week}`}
                className="mx-auto max-w-md scroll-mt-28 space-y-4 sm:scroll-mt-16"
              >
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
          })}
        </>
      )}

      <LastInPointsBoard />
      <TentRules />
    </div>
  );
}
