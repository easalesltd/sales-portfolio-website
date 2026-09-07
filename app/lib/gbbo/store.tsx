"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createEmptyLeague } from "./seed";
import type { LeagueState } from "./types";

type LeagueContextValue = {
  league: LeagueState;
  loaded: boolean;
  saving: boolean;
  update: (recipe: (draft: LeagueState) => void) => void;
  replace: (next: LeagueState) => void;
  refresh: () => Promise<void>;
  submitSide: (input: {
    companionSlug: string;
    bakerIds?: string[];
    playJoker?: boolean;
    keepLastWeek?: boolean;
  }) => Promise<string | null>;
};

const LeagueContext = createContext<LeagueContextValue | null>(null);

function clone<T>(value: T): T {
  return structuredClone(value);
}

function chiefUnlocked() {
  return typeof window !== "undefined" && window.localStorage.getItem("gbbo-chief-unlocked") === "1";
}

export function LeagueProvider({ children }: { children: React.ReactNode }) {
  const [league, setLeague] = useState<LeagueState>(createEmptyLeague);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const skipSave = useRef(true);

  const refresh = useCallback(async () => {
    const response = await fetch("/api/gbbo-league", { credentials: "include" });
    if (!response.ok) return;
    const data = (await response.json()) as LeagueState;
    if (data?.companions) {
      skipSave.current = true;
      setLeague(data);
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!loaded || !chiefUnlocked()) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    const timer = window.setTimeout(() => {
      setSaving(true);
      void fetch("/api/gbbo-league", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(league),
      }).finally(() => setSaving(false));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [league, loaded]);

  const update = useCallback((recipe: (draft: LeagueState) => void) => {
    setLeague((current) => {
      const next = clone(current);
      recipe(next);
      return next;
    });
  }, []);

  const replace = useCallback((next: LeagueState) => {
    setLeague(clone(next));
  }, []);

  const submitSide = useCallback(async (input: {
    companionSlug: string;
    bakerIds?: string[];
    playJoker?: boolean;
    keepLastWeek?: boolean;
  }) => {
    const response = await fetch("/api/gbbo-league/side", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = (await response.json()) as LeagueState & { error?: string };
    if (!response.ok) return data.error ?? "That side could not be saved.";
    skipSave.current = true;
    setLeague(data);
    return null;
  }, []);

  const value = useMemo(
    () => ({ league, loaded, saving, update, replace, refresh, submitSide }),
    [league, loaded, saving, update, replace, refresh, submitSide],
  );

  return <LeagueContext.Provider value={value}>{children}</LeagueContext.Provider>;
}

export function useLeague() {
  const value = useContext(LeagueContext);
  if (!value) throw new Error("useLeague must be used within LeagueProvider");
  return value;
}
