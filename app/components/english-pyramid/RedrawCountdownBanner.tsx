'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  revealAtUtc: string;
  /** After this time the banner disappears entirely (ceremony retired). */
  ceremonyEndsAtUtc: string;
  headline: string;
  onOpenReveal: () => void;
  /** Fired once when the clock crosses the reveal time with the page open. */
  onGoLive?: () => void;
};

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  live: boolean;
  ceremonyOver: boolean;
};

function remainingFrom(revealAt: number, ceremonyEndsAt: number): Remaining {
  const now = Date.now();
  if (now >= ceremonyEndsAt) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, live: true, ceremonyOver: true };
  }
  const diff = revealAt - now;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, live: true, ceremonyOver: false };
  }
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    live: false,
    ceremonyOver: false,
  };
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export default function RedrawCountdownBanner({
  revealAtUtc,
  ceremonyEndsAtUtc,
  headline,
  onOpenReveal,
  onGoLive,
}: Props) {
  const revealAt = new Date(revealAtUtc).getTime();
  const ceremonyEndsAt = new Date(ceremonyEndsAtUtc).getTime();
  const [remaining, setRemaining] = useState<Remaining | null>(null);
  const wasLive = useRef<boolean | null>(null);
  const goLiveRef = useRef(onGoLive);
  goLiveRef.current = onGoLive;

  useEffect(() => {
    if (!Number.isFinite(revealAt) || !Number.isFinite(ceremonyEndsAt)) return;

    const tick = () => {
      const next = remainingFrom(revealAt, ceremonyEndsAt);
      setRemaining(next);
      if (wasLive.current === false && next.live && !next.ceremonyOver) {
        goLiveRef.current?.();
      }
      wasLive.current = next.live;
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [revealAt, ceremonyEndsAt]);

  if (!remaining || remaining.ceremonyOver) return null;

  const revealLabel = new Date(revealAt).toLocaleString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/London',
  });

  if (remaining.live) {
    return (
      <section
        className="overflow-hidden rounded-lg border border-emerald-400/40 bg-gradient-to-r from-emerald-950/70 via-[#141f38]/80 to-[#141f38]/60 px-4 py-3"
        aria-label="Redraw reveal available"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-300/85">
              Redraw complete
            </p>
            <p className="mt-1 text-base font-bold text-[#f5f5f0] sm:text-lg">
              The new squads are in. Nobody has seen them yet.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenReveal}
            className="shrink-0 rounded-full border border-[#d4af37]/55 bg-[#d4af37]/20 px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-[#f2d36b] transition hover:bg-[#d4af37]/30"
          >
            Play the reveal
          </button>
        </div>
      </section>
    );
  }

  const boxes = [
    { label: 'Days', value: remaining.days },
    { label: 'Hrs', value: remaining.hours },
    { label: 'Min', value: remaining.minutes },
    { label: 'Sec', value: remaining.seconds },
  ];

  return (
    <section
      className="overflow-hidden rounded-lg border border-[#d4af37]/40 bg-[#141f38]/75 px-4 py-3 [background-image:linear-gradient(135deg,rgba(212,175,55,0.16)_0%,transparent_60%)]"
      aria-label="Redraw countdown"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d4af37]/85">
            Redraw night
          </p>
          <p className="mt-1 text-base font-bold text-[#f5f5f0] sm:text-lg">{headline}</p>
          <p className="mt-0.5 text-xs text-[#e8dfc8]/60">Reveal goes live {revealLabel}</p>
        </div>

        <div className="grid w-full grid-cols-4 gap-1.5 tabular-nums sm:flex sm:w-auto sm:shrink-0">
          {boxes.map((box) => (
            <div
              key={box.label}
              className="min-w-0 rounded-md border border-[#d4af37]/30 bg-[#0a0f1a]/70 px-1.5 py-1.5 text-center sm:min-w-[3.1rem] sm:px-2"
            >
              <p className="text-base font-black leading-none text-[#f2d36b] sm:text-xl">
                {pad(box.value)}
              </p>
              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#e8dfc8]/55">
                {box.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
