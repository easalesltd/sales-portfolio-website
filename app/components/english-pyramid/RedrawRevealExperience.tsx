'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ENGLISH_PYRAMID_DIVISIONS,
  formatPreSeasonTablePlace,
  formatTeamNameShort,
  getDraftBand,
  getDraftDivisionId,
} from '@/app/data/english-pyramid-fantasy';
import type { PlayerStanding } from '@/app/lib/english-pyramid-scoring';
import DivisionBadge from './DivisionBadge';

type Props = {
  players: PlayerStanding[];
  onClose: () => void;
};

type Phase = 'intro' | 'manager' | 'complete';

const AUTO_ADVANCE_MS = 9000;

function managerPhotoSrc(path: string): string {
  return `${path}?v=20260701`;
}

function clubsForBand(player: PlayerStanding, band: 'title' | 'survival') {
  return player.teams
    .filter((code) => getDraftBand(code) === band)
    .map((code) => ({
      code,
      name: formatTeamNameShort(code),
      place: formatPreSeasonTablePlace(code),
      divisionId: getDraftDivisionId(code) ?? '',
    }))
    .sort((a, b) => {
      const orderA = ENGLISH_PYRAMID_DIVISIONS.findIndex((d) => d.id === a.divisionId);
      const orderB = ENGLISH_PYRAMID_DIVISIONS.findIndex((d) => d.id === b.divisionId);
      return orderA - orderB;
    });
}

export default function RedrawRevealExperience({ players, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [managerIndex, setManagerIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [visibleClubs, setVisibleClubs] = useState(0);

  const current = players[managerIndex] ?? null;
  const titleClubs = useMemo(
    () => (current ? clubsForBand(current, 'title') : []),
    [current]
  );
  const survivalClubs = useMemo(
    () => (current ? clubsForBand(current, 'survival') : []),
    [current]
  );
  const totalClubs = titleClubs.length + survivalClubs.length;

  const goNext = useCallback(() => {
    if (phase === 'intro') {
      setPhase('manager');
      setManagerIndex(0);
      setVisibleClubs(0);
      return;
    }
    if (phase === 'manager') {
      if (managerIndex >= players.length - 1) {
        setPhase('complete');
        return;
      }
      setManagerIndex((index) => index + 1);
      setVisibleClubs(0);
    }
  }, [managerIndex, phase, players.length]);

  const goPrevious = useCallback(() => {
    if (phase === 'complete') {
      setPhase('manager');
      setManagerIndex(Math.max(0, players.length - 1));
      setVisibleClubs(14);
      return;
    }
    if (phase === 'manager' && managerIndex > 0) {
      setManagerIndex((index) => index - 1);
      setVisibleClubs(14);
      return;
    }
    if (phase === 'manager' && managerIndex === 0) {
      setPhase('intro');
      setVisibleClubs(0);
    }
  }, [managerIndex, phase, players.length]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        goNext();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrevious();
      }
      if (event.key.toLowerCase() === 'p') setAutoPlay((value) => !value);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrevious, onClose]);

  useEffect(() => {
    if (phase !== 'manager' || !current) return;
    setVisibleClubs(0);
    let shown = 0;
    const interval = window.setInterval(() => {
      shown += 1;
      setVisibleClubs(shown);
      if (shown >= totalClubs) window.clearInterval(interval);
    }, 220);
    return () => window.clearInterval(interval);
  }, [current, phase, totalClubs]);

  useEffect(() => {
    if (!autoPlay || phase === 'complete') return;
    const timeout = window.setTimeout(goNext, AUTO_ADVANCE_MS);
    return () => window.clearTimeout(timeout);
  }, [autoPlay, goNext, managerIndex, phase]);

  return (
    <div
      className="fixed inset-0 z-[320] flex flex-col bg-[#05070d] text-[#f5f5f0]"
      role="dialog"
      aria-modal="true"
      aria-label="English Pyramid redraw reveal"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.18),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.12),transparent_35%)]" />

      <header className="relative z-10 flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d4af37]/80">
            Record mode · Friday redraw
          </p>
          <h2 className="text-lg font-black tracking-tight sm:text-xl">Squad reveal night</h2>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setAutoPlay((value) => !value)}
            className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold"
          >
            {autoPlay ? 'Pause auto' : 'Auto play'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold"
          >
            Exit
          </button>
        </div>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6 sm:px-8">
        {phase === 'intro' ? (
          <div className="max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d4af37]">
              7 August 2026
            </p>
            <h3 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">
              The redraw is locked.
            </h3>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#e8dfc8]/75 sm:text-lg">
              Same fairness formula. Fresh odds. Fourteen clubs each — one title pick and one survival
              pick from every rung of the pyramid. Hit play, start recording, and walk the room through
              every manager.
            </p>
            <button
              type="button"
              onClick={goNext}
              className="mt-8 rounded-full border border-[#d4af37]/50 bg-[#d4af37]/15 px-8 py-3 text-sm font-black uppercase tracking-[0.2em] text-[#f2d36b]"
            >
              Start reveal
            </button>
          </div>
        ) : null}

        {phase === 'manager' && current ? (
          <div className="flex w-full max-w-6xl flex-col gap-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <img
                  src={managerPhotoSrc(current.managerImage)}
                  alt=""
                  className="h-24 w-24 rounded-xl border border-[#d4af37]/45 object-cover shadow-[0_0_40px_rgba(212,175,55,0.2)] sm:h-32 sm:w-32"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#d4af37]/80">
                    Manager {managerIndex + 1} of {players.length}
                  </p>
                  <h3 className="truncate text-3xl font-black tracking-tight sm:text-5xl">
                    {current.teamName ?? current.name}
                  </h3>
                  <p className="mt-1 text-lg font-semibold text-[#e8dfc8]/75">{current.name}</p>
                </div>
              </div>
              <img
                src={current.clubCrest}
                alt=""
                className="h-20 w-20 object-contain sm:h-28 sm:w-28"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <SquadBand
                title="Title picks"
                tone="gold"
                clubs={titleClubs}
                visibleCount={Math.min(visibleClubs, titleClubs.length)}
              />
              <SquadBand
                title="Survival picks"
                tone="danger"
                clubs={survivalClubs}
                visibleCount={Math.max(0, visibleClubs - titleClubs.length)}
              />
            </div>

            {current.draftNote ? (
              <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed text-[#e8dfc8]/8">
                {current.draftNote}
              </p>
            ) : null}
          </div>
        ) : null}

        {phase === 'complete' ? (
          <div className="max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">
              All seven locked
            </p>
            <h3 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">
              Season starts Saturday.
            </h3>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#e8dfc8]/75 sm:text-lg">
              Ninety-eight clubs. One fairness ladder. Stop recording whenever you like — or jump back
              through any manager with the arrow keys.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setPhase('intro');
                  setManagerIndex(0);
                  setVisibleClubs(0);
                  setAutoPlay(true);
                }}
                className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold"
              >
                Replay from top
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-[#d4af37]/50 bg-[#d4af37]/15 px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#f2d36b]"
              >
                Back to league
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <footer className="relative z-10 flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3 text-xs text-[#e8dfc8]/65 sm:px-6">
        <p>Space / → next · ← previous · P pause · Esc exit</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={goPrevious}
            className="rounded-md border border-white/15 px-3 py-1.5 font-semibold text-[#f5f5f0]"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={phase === 'complete'}
            className="rounded-md border border-[#d4af37]/40 bg-[#d4af37]/15 px-3 py-1.5 font-semibold text-[#f2d36b] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </footer>
    </div>
  );
}

function SquadBand({
  title,
  tone,
  clubs,
  visibleCount,
}: {
  title: string;
  tone: 'gold' | 'danger';
  clubs: Array<{ code: string; name: string; place: string | null; divisionId: string }>;
  visibleCount: number;
}) {
  const toneClass =
    tone === 'gold'
      ? 'border-[#d4af37]/30 from-[#d4af37]/10'
      : 'border-rose-400/30 from-rose-500/10';

  return (
    <section className={`rounded-2xl border bg-gradient-to-br ${toneClass} to-transparent p-4`}>
      <h4 className="text-xs font-bold uppercase tracking-[0.22em] text-[#e8dfc8]/75">{title}</h4>
      <ul className="mt-3 space-y-2">
        {clubs.map((club, index) => {
          const visible = index < visibleCount;
          return (
            <li
              key={club.code}
              className={`flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/25 px-3 py-2 transition duration-300 ${
                visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              }`}
            >
              <span className="flex min-w-0 items-center gap-2">
                <DivisionBadge divisionId={club.divisionId} />
                <span className="truncate font-semibold">{club.name}</span>
              </span>
              <span className="shrink-0 text-xs font-bold tabular-nums text-[#d4af37]">
                {club.place ?? '—'}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
