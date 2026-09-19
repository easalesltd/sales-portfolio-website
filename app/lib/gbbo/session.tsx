"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { GBBO_LEAGUE_PATH } from "@/app/lib/gbbo-league-path";
import { gbboSlug } from "./identity";

const PLAYER_KEY = "gbbo-player-slug";
const CHIEF_FLAG = "gbbo-chief-unlocked";

type SessionValue = {
  ready: boolean;
  isChief: boolean;
  playerSlug: string | null;
  playerUnlocked: boolean;
  pendingSlug: string | null;
  setPendingPlayer: (slug: string | null) => void;
  setPlayer: (slug: string | null) => void;
  unlockPlayer: (slug: string, pin: string) => Promise<string | null>;
  lockPlayer: () => Promise<void>;
  unlockChief: (pin: string) => Promise<string | null>;
  lockChief: () => Promise<void>;
};

const SessionContext = createContext<SessionValue | null>(null);

export function GbboSessionProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [isChief, setIsChief] = useState(false);
  const [playerSlug, setPlayerSlug] = useState<string | null>(null);
  const [playerUnlocked, setPlayerUnlocked] = useState(false);
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get("as");
    const stored = window.localStorage.getItem(PLAYER_KEY);
    setIsChief(window.localStorage.getItem(CHIEF_FLAG) === "1");

    void fetch("/api/gbbo-player", { credentials: "include" })
      .then((response) => response.json())
      .then((data: { slug?: string | null }) => {
        const cookieSlug = gbboSlug(data.slug ?? "");
        if (cookieSlug) {
          setPlayerSlug(cookieSlug);
          setPlayerUnlocked(true);
          setPendingSlug(null);
          window.localStorage.setItem(PLAYER_KEY, cookieSlug);
          return;
        }
        setPlayerSlug(null);
        setPlayerUnlocked(false);
        setPendingSlug(gbboSlug(fromQuery || stored || "") || null);
      })
      .catch(() => {
        setPlayerSlug(null);
        setPlayerUnlocked(false);
        setPendingSlug(gbboSlug(fromQuery || stored || "") || null);
      })
      .finally(() => setReady(true));
  }, []);

  const setPendingPlayer = useCallback((slug: string | null) => {
    setPendingSlug(slug ? gbboSlug(slug) : null);
  }, []);

  const setPlayer = useCallback((slug: string | null) => {
    const next = slug ? gbboSlug(slug) : "";
    setPlayerSlug(next || null);
    if (next) window.localStorage.setItem(PLAYER_KEY, next);
    else window.localStorage.removeItem(PLAYER_KEY);
  }, []);

  const unlockPlayer = useCallback(async (slug: string, pin: string) => {
    const next = gbboSlug(slug);
    const response = await fetch("/api/gbbo-player", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: next, pin }),
    });
    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      return data?.error ?? "That key did not work.";
    }
    window.localStorage.setItem(PLAYER_KEY, next);
    setPlayerSlug(next);
    setPlayerUnlocked(true);
    setPendingSlug(null);
    return null;
  }, []);

  const lockPlayer = useCallback(async () => {
    await fetch("/api/gbbo-player", { method: "DELETE", credentials: "include" });
    window.localStorage.removeItem(PLAYER_KEY);
    setPlayerSlug(null);
    setPlayerUnlocked(false);
    setPendingSlug(null);
  }, []);

  const unlockChief = useCallback(async (pin: string) => {
    const response = await fetch("/api/gbbo-chief", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      return data?.error ?? "That key did not work.";
    }
    window.localStorage.setItem(CHIEF_FLAG, "1");
    setIsChief(true);
    return null;
  }, []);

  const lockChief = useCallback(async () => {
    await fetch("/api/gbbo-chief", { method: "DELETE" });
    window.localStorage.removeItem(CHIEF_FLAG);
    setIsChief(false);
    window.location.href = GBBO_LEAGUE_PATH;
  }, []);

  const value = useMemo(
    () => ({
      ready,
      isChief,
      playerSlug,
      playerUnlocked,
      pendingSlug,
      setPendingPlayer,
      setPlayer,
      unlockPlayer,
      lockPlayer,
      unlockChief,
      lockChief,
    }),
    [
      ready,
      isChief,
      playerSlug,
      playerUnlocked,
      pendingSlug,
      setPendingPlayer,
      setPlayer,
      unlockPlayer,
      lockPlayer,
      unlockChief,
      lockChief,
    ],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useGbboSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useGbboSession must be used within GbboSessionProvider");
  return value;
}
