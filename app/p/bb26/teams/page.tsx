"use client";

import { TeamSideForm } from "@/app/components/gbbo/TeamSideForm";
import { Card, Empty, Pill } from "@/app/components/gbbo/ui";
import { gbboSlug } from "@/app/lib/gbbo/identity";
import { sideConfirmed, teamSizeForWeek } from "@/app/lib/gbbo/league";
import { useGbboSession } from "@/app/lib/gbbo/session";
import { useLeague } from "@/app/lib/gbbo/store";
import { teamWindow } from "@/app/lib/gbbo/window";

export default function TeamsPage() {
  const { league } = useLeague();
  const { ready, isChief, playerSlug } = useGbboSession();
  const gate = teamWindow(new Date(), league.totalWeeks);
  const week = gate.week;
  const size = teamSizeForWeek(league, week);
  const player = league.companions.find((companion) => gbboSlug(companion.name) === playerSlug);
  const visible = isChief ? league.companions : player ? [player] : [];
  const locked = !gate.open && !isChief;

  if (!ready) return <p className="font-script text-3xl text-raspberry">Finding your peg…</p>;

  if (!league.draftComplete) {
    return <Empty title="Week 1 teams come from the draft" body="Opening sides are set by the Chief Companion first." />;
  }

  if (!isChief && !player) {
    return <Empty title="Say who you are first" body="Go back to League and tap your name. The site will remember you on this phone or laptop." />;
  }

  return (
    <div className="space-y-6">
      <Card eyebrow="This weekend's sides" title={isChief ? `Week ${week} playing bakers` : `Your week ${week} side`}>
        <p className="max-w-3xl text-sm leading-7 text-chocolate/75">
          {gate.summary}
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-chocolate/75">
          Field <strong>{size} baker{size === 1 ? "" : "s"}</strong> this week.
          Last week's team is kept unless you substitute <strong>one</strong> baker.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Pill tone={gate.open || isChief ? "tent" : "raspberry"}>{gate.open || isChief ? "Window open" : "Window locked"}</Pill>
          <Pill tone="tent">{size} to play</Pill>
          <Pill tone="butter">One change from last week</Pill>
        </div>
      </Card>
      <div className={`grid gap-4 ${isChief ? "md:grid-cols-2" : ""}`}>
        {visible.map((companion) => {
          const confirmed = sideConfirmed(league, companion.id, week);
          const formLocked = locked || (confirmed && !isChief);
          const reason = confirmed && !isChief
            ? "Your week is locked. You have already submitted this side."
            : gate.summary;
          return (
            <TeamSideForm
              key={companion.id}
              companion={companion}
              week={week}
              locked={formLocked}
              lockReason={reason}
            />
          );
        })}
      </div>
    </div>
  );
}
