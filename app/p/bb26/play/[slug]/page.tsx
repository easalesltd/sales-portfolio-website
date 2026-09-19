"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { GBBO_LEAGUE_PATH } from "@/app/lib/gbbo-league-path";
import { gbboSlug } from "@/app/lib/gbbo/identity";
import { useGbboSession } from "@/app/lib/gbbo/session";

export default function PlayAsPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { setPendingPlayer } = useGbboSession();

  useEffect(() => {
    const slug = gbboSlug(params.slug ?? "");
    if (slug) setPendingPlayer(slug);
    router.replace(slug ? `${GBBO_LEAGUE_PATH}/teams?as=${slug}` : `${GBBO_LEAGUE_PATH}/teams`);
  }, [params.slug, router, setPendingPlayer]);

  return <p className="font-script text-3xl text-raspberry">Opening your team…</p>;
}
