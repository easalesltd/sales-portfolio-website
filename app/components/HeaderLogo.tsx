'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';

const SalesAgentDash = dynamic(() => import('./SalesAgentDash'), { ssr: false });
const WorldCupFantasy = dynamic(() => import('./WorldCupFantasy'), { ssr: false });
const EnglishPyramidFantasy = dynamic(() => import('./EnglishPyramidFantasy'), { ssr: false });

const DOUBLE_CLICK_MS = 340;
const TRIPLE_CLICK_MS = 520;
const TRIPLE_DECISION_MS = 380;
const NAV_DELAY_MS = 300;

type ActiveGame = 'world-cup' | 'english-pyramid';

export default function HeaderLogo() {
  const router = useRouter();
  const [dashOpen, setDashOpen] = useState(false);
  const [gamePickerOpen, setGamePickerOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<ActiveGame | null>(null);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickTimesRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  const onLogoClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const now = Date.now();

      if (navTimerRef.current) {
        clearTimeout(navTimerRef.current);
        navTimerRef.current = null;
      }

      clickTimesRef.current = clickTimesRef.current.filter((t) => now - t < TRIPLE_CLICK_MS);
      clickTimesRef.current.push(now);
      const times = clickTimesRef.current;

      if (times.length >= 3) {
        clickTimesRef.current = [];
        setGamePickerOpen(true);
        return;
      }

      if (times.length === 2 && times[1] - times[0] < DOUBLE_CLICK_MS) {
        navTimerRef.current = setTimeout(() => {
          navTimerRef.current = null;
          if (clickTimesRef.current.length === 2) {
            clickTimesRef.current = [];
            setDashOpen(true);
          }
        }, TRIPLE_DECISION_MS);
        return;
      }

      if (times.length === 1) {
        navTimerRef.current = setTimeout(() => {
          navTimerRef.current = null;
          if (clickTimesRef.current.length === 1) {
            clickTimesRef.current = [];
            router.push('/');
          }
        }, NAV_DELAY_MS);
      }
    },
    [router]
  );

  const openGame = (game: ActiveGame) => {
    setGamePickerOpen(false);
    setActiveGame(game);
  };

  return (
    <>
      <Link href="/" className="flex items-center select-none" onClick={onLogoClick} aria-label="East Anglian Sales LTD home">
        <Image
          src="/images/logo.webp"
          alt="East Anglian Sales LTD"
          width={100}
          height={67}
          className="object-contain brightness-0 dark:invert"
          priority
          sizes="100px"
          quality={85}
          draggable={false}
        />
      </Link>
      {dashOpen ? <SalesAgentDash onClose={() => setDashOpen(false)} /> : null}
      {gamePickerOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sweepstake-picker-title"
        >
          <div className="w-full max-w-sm rounded-xl border border-neutral-600 bg-neutral-900 p-5 shadow-2xl">
            <h2 id="sweepstake-picker-title" className="text-lg font-bold text-white">
              Choose sweepstake
            </h2>
            <p className="mt-2 text-sm text-neutral-400">Pick which secret league table to open.</p>
            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => openGame('world-cup')}
                className="w-full rounded-lg border border-teal-700/60 bg-teal-950/30 px-4 py-3 text-left text-sm font-medium text-white transition hover:border-teal-500 hover:bg-teal-950/50"
              >
                World Cup Sweepstake 2026
              </button>
              <button
                type="button"
                onClick={() => openGame('english-pyramid')}
                className="w-full rounded-lg border border-sky-700/60 bg-sky-950/30 px-4 py-3 text-left text-sm font-medium text-white transition hover:border-sky-500 hover:bg-sky-950/50"
              >
                English Pyramid Sweepstake 2026/27
              </button>
            </div>
            <button
              type="button"
              onClick={() => setGamePickerOpen(false)}
              className="mt-4 w-full rounded-lg border border-white/20 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
      {activeGame === 'world-cup' ? <WorldCupFantasy onClose={() => setActiveGame(null)} /> : null}
      {activeGame === 'english-pyramid' ? (
        <EnglishPyramidFantasy onClose={() => setActiveGame(null)} />
      ) : null}
    </>
  );
}
