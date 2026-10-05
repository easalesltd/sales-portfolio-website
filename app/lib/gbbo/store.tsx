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
  completeSlutDrop: (companionId: string, week: number) => Promise<string | null>;
  acceptLeague: (next: LeagueState) => void;
  notify: (message: string) => void;
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
  const [notice, setNotice] = useState<{ id: number; message: string } | null>(null);

  const notify = useCallback((message: string) => {
    setNotice({ id: Date.now(), message });
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 6000);
    return () => window.clearTimeout(timer);
  }, [notice]);

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

  const acceptLeague = useCallback((next: LeagueState) => {
    skipSave.current = true;
    setLeague(clone(next));
  }, []);

  const completeSlutDrop = useCallback(async (companionId: string, week: number) => {
    const response = await fetch("/api/gbbo-league/slut-drop", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companionId, week }),
    });
    const data = (await response.json()) as LeagueState & { error?: string };
    if (!response.ok) return data.error ?? "Upload a photo or video of the slut drop. A button press is not enough.";
    acceptLeague(data);
    return null;
  }, [acceptLeague]);

  const value = useMemo(
    () => ({ league, loaded, saving, update, replace, refresh, submitSide, completeSlutDrop, acceptLeague, notify }),
    [league, loaded, saving, update, replace, refresh, submitSide, completeSlutDrop, acceptLeague, notify],
  );

  return (
    <LeagueContext.Provider value={value}>
      {children}
      {notice ? (
        <div
          key={notice.id}
          role="status"
          aria-live="polite"
          className="fixed inset-x-4 bottom-6 z-50 mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl bg-tent-dark px-5 py-4 text-flour shadow-xl"
        >
          <p className="text-sm font-semibold leading-snug">{notice.message}</p>
          <button
            type="button"
            className="shrink-0 text-xs uppercase tracking-[0.12em] text-flour/70 hover:text-flour"
            onClick={() => setNotice(null)}
          >
            Close
          </button>
        </div>
      ) : null}
    </LeagueContext.Provider>
  );
}

export function useLeague() {
  const value = useContext(LeagueContext);
  if (!value) throw new Error("useLeague must be used within LeagueProvider");
  return value;
}
