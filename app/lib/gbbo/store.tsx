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
};

const LeagueContext = createContext<LeagueContextValue | null>(null);

function clone<T>(value: T): T {
  return structuredClone(value);
}

export function LeagueProvider({ children }: { children: React.ReactNode }) {
  const [league, setLeague] = useState<LeagueState>(createEmptyLeague);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const skipSave = useRef(true);

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      try {
        const response = await fetch("/api/gbbo-league");
        if (response.ok) {
          const data = (await response.json()) as LeagueState;
          if (!cancelled && data?.companions) {
            setLeague(data);
            skipSave.current = true;
            setLoaded(true);
            return;
          }
        }
      } catch {
        /* fall through to a fresh tent */
      }
      if (!cancelled) setLoaded(true);
    }
    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    const timer = window.setTimeout(() => {
      setSaving(true);
      void fetch("/api/gbbo-league", {
        method: "PUT",
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

  const value = useMemo(
    () => ({ league, loaded, saving, update, replace }),
    [league, loaded, saving, update, replace],
  );

  return <LeagueContext.Provider value={value}>{children}</LeagueContext.Provider>;
}

export function useLeague() {
  const value = useContext(LeagueContext);
  if (!value) throw new Error("useLeague must be used within LeagueProvider");
  return value;
}
