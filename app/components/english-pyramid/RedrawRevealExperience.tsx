'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ENGLISH_PYRAMID_DIVISIONS,
  ENGLISH_PYRAMID_TEAM_BY_CODE,
  formatPreSeasonTablePlace,
  formatTeamNameShort,
  getDraftBand,
  getDraftDivisionId,
} from '@/app/data/english-pyramid-fantasy';
import type { PlayerStanding } from '@/app/lib/english-pyramid-scoring';
import DivisionBadge from './DivisionBadge';

type Props = {
  players: PlayerStanding[];
  squadsHidden?: boolean;
  onClose: () => void;
};

type Phase = 'intro' | 'shuffle' | 'manager' | 'complete';

type RevealClub = {
  code: string;
  name: string;
  place: string | null;
  divisionId: string;
};

const CLUB_SETTLE_MS = 230;
const HOLD_AFTER_SETTLE_MS = 3200;
const SHUFFLE_PHASE_MS = 2600;
const REEL_TICK_MS = 70;

const ALL_CLUB_NAMES = Object.values(ENGLISH_PYRAMID_TEAM_BY_CODE).map((team) => team.name);

function randomClubName(): string {
  return ALL_CLUB_NAMES[Math.floor(Math.random() * ALL_CLUB_NAMES.length)] ?? '—';
}

function managerPhotoSrc(path: string): string {
  return `${path}?v=20260701`;
}

function clubsForBand(player: PlayerStanding, band: 'title' | 'survival'): RevealClub[] {
  return player.teams
    .filter((code) => getDraftBand(code) === band)
    .map((code) => ({
      code,
      name: formatTeamNameShort(code),
      place: formatPreSeasonTablePlace(code),
      divisionId: getDraftDivisionId(code) ?? '',
    }))
    .sort(
      (a, b) =>
        ENGLISH_PYRAMID_DIVISIONS.findIndex((d) => d.id === a.divisionId) -
        ENGLISH_PYRAMID_DIVISIONS.findIndex((d) => d.id === b.divisionId)
    );
}

/** Slot-machine reel: cycles random club names until its slot settles. */
function ClubReel({ finalName, settled }: { finalName: string; settled: boolean }) {
  const [display, setDisplay] = useState(finalName);

  useEffect(() => {
    if (settled) {
      setDisplay(finalName);
      return;
    }
    setDisplay(randomClubName());
    const interval = window.setInterval(() => setDisplay(randomClubName()), REEL_TICK_MS);
    return () => window.clearInterval(interval);
  }, [finalName, settled]);

  return (
    <span
      className={`truncate transition-all duration-200 ${
        settled
          ? 'font-bold text-[#f5f5f0]'
          : 'font-medium text-[#e8dfc8]/45 blur-[1.2px] motion-safe:animate-pulse'
      }`}
    >
      {display}
    </span>
  );
}

export default function RedrawRevealExperience({ players, squadsHidden = false, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [managerIndex, setManagerIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [settledCount, setSettledCount] = useState(0);

  const current = players[managerIndex] ?? null;
  const titleClubs = useMemo(() => (current ? clubsForBand(current, 'title') : []), [current]);
  const survivalClubs = useMemo(
    () => (current ? clubsForBand(current, 'survival') : []),
    [current]
  );
  const totalClubs = titleClubs.length + survivalClubs.length;
  const allSettled = totalClubs > 0 && settledCount >= totalClubs;

  const goNext = useCallback(() => {
    setPhase((phaseNow) => {
      if (phaseNow === 'intro') return 'shuffle';
      if (phaseNow === 'shuffle') {
        setManagerIndex(0);
        setSettledCount(0);
        return 'manager';
      }
      if (phaseNow === 'manager') {
        let done = false;
        setManagerIndex((index) => {
          if (index >= players.length - 1) {
            done = true;
            return index;
          }
          return index + 1;
        });
        setSettledCount(0);
        return done ? 'complete' : 'manager';
      }
      return phaseNow;
    });
  }, [players.length]);

  const goPrevious = useCallback(() => {
    if (phase === 'complete') {
      setManagerIndex(Math.max(0, players.length - 1));
      setSettledCount(totalClubs || 14);
      setPhase('manager');
      return;
    }
    if (phase === 'manager' && managerIndex > 0) {
      setManagerIndex((index) => index - 1);
      setSettledCount(14);
      return;
    }
    if (phase === 'manager') setPhase('shuffle');
    else if (phase === 'shuffle') setPhase('intro');
  }, [managerIndex, phase, players.length, totalClubs]);

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
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Settle each club slot in turn once a manager is on screen.
  useEffect(() => {
    if (phase !== 'manager' || totalClubs === 0) return;
    setSettledCount(0);
    let shown = 0;
    const interval = window.setInterval(() => {
      shown += 1;
      setSettledCount(shown);
      if (shown >= totalClubs) window.clearInterval(interval);
    }, CLUB_SETTLE_MS);
    return () => window.clearInterval(interval);
  }, [managerIndex, phase, totalClubs]);

  useEffect(() => {
    if (!autoPlay) return;
    if (phase === 'shuffle') {
      const timeout = window.setTimeout(goNext, SHUFFLE_PHASE_MS);
      return () => window.clearTimeout(timeout);
    }
    if (phase === 'manager' && allSettled) {
      const timeout = window.setTimeout(goNext, HOLD_AFTER_SETTLE_MS);
      return () => window.clearTimeout(timeout);
    }
  }, [allSettled, autoPlay, goNext, managerIndex, phase]);

  const controlClass =
    'rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-[11px] font-semibold text-[#f5f5f0] transition hover:bg-white/10 sm:px-3 sm:text-xs';

  return (
    <div
      className="fixed inset-0 z-[320] flex h-[100dvh] flex-col overflow-hidden bg-[#05070d] text-[#f5f5f0]"
      role="dialog"
      aria-modal="true"
      aria-label="English Pyramid redraw reveal"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.2),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.14),transparent_38%)]" />

      <header className="relative z-10 flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-3 py-2 sm:px-6 sm:py-3">
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#d4af37]/80 sm:text-[10px]">
            Record mode · Redraw night
          </p>
          <h2 className="truncate text-sm font-black tracking-tight sm:text-xl">
            Squad reveal
            {phase === 'manager' ? ` · ${managerIndex + 1}/${players.length}` : ''}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button type="button" onClick={() => setAutoPlay((value) => !value)} className={controlClass}>
            {autoPlay ? 'Pause' : 'Auto'}
          </button>
          <button type="button" onClick={onClose} className={controlClass}>
            Exit
          </button>
        </div>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-3 py-3 sm:px-6 sm:py-5">
        {squadsHidden ? (
          <div className="text-center">
            <h3 className="text-2xl font-black sm:text-4xl">Squads are still sealed.</h3>
            <p className="mt-3 text-sm text-[#e8dfc8]/70 sm:text-base">
              The reveal unlocks automatically at 7pm on redraw night.
            </p>
          </div>
        ) : phase === 'intro' ? (
          <div className="max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#d4af37] sm:text-sm">
              The redraw is locked in
            </p>
            <h3 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-6xl">
              Fourteen clubs each.
              <br />
              Nobody knows yet.
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#e8dfc8]/70 sm:text-lg">
              One title pick and one survival pick from every rung of the pyramid, drawn on the latest
              betting odds. Start recording, then hit the button.
            </p>
            <button
              type="button"
              onClick={goNext}
              className="mt-6 rounded-full border border-[#d4af37]/55 bg-[#d4af37]/15 px-7 py-3 text-xs font-black uppercase tracking-[0.2em] text-[#f2d36b] transition hover:bg-[#d4af37]/25 sm:text-sm"
            >
              Start the draw
            </button>
          </div>
        ) : phase === 'shuffle' ? (
          <div className="w-full max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#d4af37] sm:text-sm">
              Drawing squads
            </p>
            <div className="mt-5 space-y-2">
              {[0, 1, 2, 3, 4].map((row) => (
                <div
                  key={row}
                  className="overflow-hidden rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-lg font-bold sm:text-3xl"
                  style={{ opacity: 1 - row * 0.16 }}
                >
                  <ClubReel finalName="" settled={false} />
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-[#e8dfc8]/55 sm:text-sm">
              98 clubs · 7 managers · same fairness ladder
            </p>
          </div>
        ) : phase === 'manager' && current ? (
          <div className="flex w-full max-w-6xl flex-col gap-2.5 sm:gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <img
                  src={managerPhotoSrc(current.managerImage)}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-lg border border-[#d4af37]/45 object-cover shadow-[0_0_30px_rgba(212,175,55,0.22)] sm:h-24 sm:w-24 sm:rounded-xl"
                />
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#d4af37]/80 sm:text-[11px]">
                    Manager {managerIndex + 1} of {players.length}
                  </p>
                  <h3 className="truncate text-xl font-black tracking-tight sm:text-4xl">
                    {current.teamName ?? current.name}
                  </h3>
                  <p className="truncate text-xs font-semibold text-[#e8dfc8]/70 sm:text-lg">
                    {current.name}
                  </p>
                </div>
              </div>
              <img
                src={current.clubCrest}
                alt=""
                className="h-14 w-14 shrink-0 object-contain sm:h-24 sm:w-24"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <SquadBand
                title="Title picks"
                tone="gold"
                clubs={titleClubs}
                settledCount={Math.min(settledCount, titleClubs.length)}
              />
              <SquadBand
                title="Survival picks"
                tone="danger"
                clubs={survivalClubs}
                settledCount={Math.max(0, settledCount - titleClubs.length)}
              />
            </div>

            {current.draftNote && allSettled ? (
              <p className="hidden rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs leading-relaxed text-[#e8dfc8]/75 sm:block">
                {current.draftNote}
              </p>
            ) : null}
          </div>
        ) : (
          <div className="max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-emerald-300 sm:text-sm">
              All seven locked
            </p>
            <h3 className="mt-3 text-3xl font-black tracking-tight sm:text-6xl">
              Season starts Saturday.
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#e8dfc8]/70 sm:text-lg">
              Ninety-eight clubs, one fairness ladder, no excuses. Stop recording whenever you like.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setManagerIndex(0);
                  setSettledCount(0);
                  setAutoPlay(true);
                  setPhase('intro');
                }}
                className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-bold sm:text-sm"
              >
                Replay from top
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-[#d4af37]/55 bg-[#d4af37]/15 px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-[#f2d36b] sm:text-sm"
              >
                Back to league
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 flex shrink-0 items-center justify-between gap-2 border-t border-white/10 px-3 py-2 text-[10px] text-[#e8dfc8]/60 sm:px-6 sm:py-3 sm:text-xs">
        <p className="truncate">
          <span className="hidden sm:inline">Space / → next · ← back · P pause · Esc exit</span>
          <span className="sm:hidden">Tap next to advance</span>
        </p>
        <div className="flex shrink-0 gap-1.5 sm:gap-2">
          <button type="button" onClick={goPrevious} className={controlClass}>
            Back
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={phase === 'complete'}
            className="rounded-md border border-[#d4af37]/45 bg-[#d4af37]/15 px-3 py-1.5 text-[11px] font-bold text-[#f2d36b] transition hover:bg-[#d4af37]/25 disabled:opacity-40 sm:text-xs"
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
  settledCount,
}: {
  title: string;
  tone: 'gold' | 'danger';
  clubs: RevealClub[];
  settledCount: number;
}) {
  const toneClass =
    tone === 'gold' ? 'border-[#d4af37]/35 from-[#d4af37]/12' : 'border-rose-400/35 from-rose-500/12';

  return (
    <section
      className={`min-w-0 rounded-xl border bg-gradient-to-br ${toneClass} to-transparent p-2 sm:p-3`}
    >
      <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#e8dfc8]/70 sm:text-xs">
        {title}
      </h4>
      <ul className="mt-1.5 space-y-1 sm:mt-2.5 sm:space-y-1.5">
        {clubs.map((club, index) => {
          const settled = index < settledCount;
          return (
            <li
              key={club.code}
              className={`flex items-center justify-between gap-1.5 rounded-md border px-1.5 py-1 text-[11px] transition-colors duration-300 sm:px-2.5 sm:py-1.5 sm:text-sm ${
                settled
                  ? 'border-white/15 bg-black/35'
                  : 'border-white/5 bg-black/15'
              }`}
            >
              <span className="flex min-w-0 items-center">
                <DivisionBadge divisionId={club.divisionId} />
                <ClubReel finalName={club.name} settled={settled} />
              </span>
              <span
                className={`shrink-0 text-[10px] font-bold tabular-nums sm:text-xs ${
                  settled ? 'text-[#d4af37]' : 'text-transparent'
                }`}
              >
                {club.place ?? '—'}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
