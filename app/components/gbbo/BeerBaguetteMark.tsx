"use client";

import { outstandingBeerBaguettes } from "@/app/lib/gbbo/league";
import { useLeague } from "@/app/lib/gbbo/store";
import { Pill } from "./ui";

export function BeerBaguetteMark({ companionId }: { companionId: string }) {
  const { league } = useLeague();
  const owed = outstandingBeerBaguettes(league).some((penalty) => penalty.companionId === companionId);
  if (!owed) return null;
  return <Pill tone="raspberry">Beer baguette owed</Pill>;
}
