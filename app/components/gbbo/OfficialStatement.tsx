"use client";

import { GBBO_OFFICIAL_STATEMENT } from "@/app/lib/gbbo/statement";
import { useLeague } from "@/app/lib/gbbo/store";
import { Card, Pill } from "./ui";

export function OfficialStatement() {
  const { league } = useLeague();
  const statement = GBBO_OFFICIAL_STATEMENT;
  if (!statement) return null;
  if (league.episodes.some((episode) => episode.week === statement.showUntilWeekPublished && episode.published)) return null;

  return (
    <Card eyebrow="Official statement" title={statement.headline} action={<Pill tone="raspberry">{statement.issuedOn}</Pill>}>
      <div className="space-y-3 text-sm leading-7 text-chocolate/85">
        {statement.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="font-bold text-tent-dark">Resolutions</p>
        <ul className="list-disc space-y-1 pl-5">
          {statement.resolutions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="font-script text-2xl text-raspberry">{statement.signOff}</p>
      </div>
    </Card>
  );
}
