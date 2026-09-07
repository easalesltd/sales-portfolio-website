"use client";

import { TeamSideForm } from "@/app/components/gbbo/TeamSideForm";
import { Card, Empty, Pill } from "@/app/components/gbbo/ui";
import { gbboSlug } from "@/app/lib/gbbo/identity";
import { teamSizeForWeek } from "@/app/lib/gbbo/league";
import { useGbboSession } from "@/app/lib/gbbo/session";
import { useLeague } from "@/app/lib/gbbo/store";

export default function TeamsPage() {
  const { league } = useLeague();
  const { ready, isChief, playerSlug } = useGbboSession();
  const week = league.currentWeek;
  const size = teamSizeForWeek(league, week);
  const player = league.companions.find((companion) => gbboSlug(companion.name) === playerSlug);
  const visible = isChief ? league.companions : player ? [player] : [];

  if (!ready) return <p className="font-script text-3xl text-raspberry">Finding your peg…</p>;

  if (!league.draftComplete) {
    return <Empty title="Week 1 teams come from the draft" body="The Chief Companion will run the preference lists first. After that, you can change one baker a week here and the site will remember it." />;
  }

  if (!isChief && !player) {
    return <Empty title="Say who you are first" body="Go back to League and tap your name. The site will remember you on this phone or laptop." />;
  }

  return (
    <div className="space-y-6">
      <Card eyebrow="This weekend's sides" title={isChief ? `Week ${week} playing bakers` : `Your week ${week} side`}>
        <p className="max-w-3xl text-sm leading-7 text-chocolate/75">
          Field <strong>{size} baker{size === 1 ? "" : "s"}</strong> this week.
          Last week's team is kept unless you substitute <strong>one</strong> baker.
          Submit here and it is stored for the whole tent — you do not need to tell the Chief Companion separately.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Pill tone="tent">{size} to play</Pill>
          <Pill tone="butter">One change from last week</Pill>
          <Pill tone="raspberry">No change keeps the old side</Pill>
        </div>
      </Card>
      <div className={`grid gap-4 ${isChief ? "md:grid-cols-2" : ""}`}>
        {visible.map((companion) => (
          <TeamSideForm key={companion.id} companion={companion} />
        ))}
      </div>
    </div>
  );
}
