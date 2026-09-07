"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { GBBO_LEAGUE_PATH } from "@/app/lib/gbbo-league-path";
import { gbboSlug } from "@/app/lib/gbbo/identity";
import { useGbboSession } from "@/app/lib/gbbo/session";

export default function PlayAsPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { setPlayer } = useGbboSession();

  useEffect(() => {
    const slug = gbboSlug(params.slug ?? "");
    if (slug) setPlayer(slug);
    router.replace(`${GBBO_LEAGUE_PATH}/teams`);
  }, [params.slug, router, setPlayer]);

  return <p className="font-script text-3xl text-raspberry">Putting your peg on the board…</p>;
}
