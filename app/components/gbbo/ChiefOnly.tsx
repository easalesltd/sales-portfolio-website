"use client";

import Link from "next/link";
import { GBBO_LEAGUE_PATH } from "@/app/lib/gbbo-league-path";
import { useGbboSession } from "@/app/lib/gbbo/session";
import { Empty } from "./ui";

export function ChiefOnly({ children }: { children: React.ReactNode }) {
  const { ready, isChief } = useGbboSession();
  if (!ready) return <p className="font-script text-3xl text-raspberry">Checking the steward's key…</p>;
  if (!isChief) {
    return (
      <Empty
        title="Steward's desk only"
        body="Scoring, the draft and Setup stay with the Chief Companion. Companions pick their weekly side from My team."
      />
    );
  }
  return (
    <div>
      {children}
      <p className="mt-8 text-center text-xs text-chocolate/50">
        <Link href={`${GBBO_LEAGUE_PATH}/chief`} className="underline">Chief door</Link>
      </p>
    </div>
  );
}
