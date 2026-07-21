'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { MatchdaySchedule } from '@/app/lib/english-pyramid-scoring';

const STORAGE_KEY = 'english-pyramid-live-alerts';

function readEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(STORAGE_KEY) === '1';
}

function playGoalPing() {
  if (typeof window === 'undefined') return;

  try {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.24);
    void ctx.close();
  } catch {
    // Audio blocked or unavailable — haptic only.
  }

  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate([35, 25, 35]);
  }
}

function liveScoreKey(entry: {
  id: string;
  liveHomeGoals?: number;
  liveAwayGoals?: number;
}): string | null {
  if (entry.liveHomeGoals == null || entry.liveAwayGoals == null) return null;
  return `${entry.liveHomeGoals}-${entry.liveAwayGoals}`;
}

export function useLiveGoalAlerts(schedule: MatchdaySchedule | null | undefined) {
  const [enabled, setEnabledState] = useState(false);
  const prevScoresRef = useRef<Map<string, string>>(new Map());
  const primedRef = useRef(false);

  useEffect(() => {
    setEnabledState(readEnabled());
  }, []);

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
    }
    if (!next) {
      primedRef.current = false;
      prevScoresRef.current = new Map();
    }
  }, []);

  useEffect(() => {
    if (!enabled || !schedule) return;

    const current = new Map<string, string>();
    for (const date of schedule.fixtureDates) {
      for (const entry of schedule.schedulesByDate[date] ?? []) {
        if (entry.status !== 'in-play') continue;
        const key = liveScoreKey(entry);
        if (key) current.set(entry.id, key);
      }
    }

    if (!primedRef.current) {
      primedRef.current = true;
      prevScoresRef.current = current;
      return;
    }

    for (const [id, score] of current) {
      const previous = prevScoresRef.current.get(id);
      if (previous != null && previous !== score) {
        playGoalPing();
        break;
      }
    }

    prevScoresRef.current = current;
  }, [enabled, schedule]);

  return { enabled, setEnabled };
}
