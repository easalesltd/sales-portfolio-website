'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ENGLISH_PYRAMID_SWEEPSTAKE_PATH } from '@/app/lib/english-pyramid-sweepstake-path';

const SalesAgentDash = dynamic(() => import('./SalesAgentDash'), { ssr: false });

const DOUBLE_CLICK_MS = 340;
const TRIPLE_CLICK_MS = 520;
const TRIPLE_DECISION_MS = 380;
const NAV_DELAY_MS = 300;

export default function HeaderLogo() {
  const router = useRouter();
  const [dashOpen, setDashOpen] = useState(false);
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
        router.push(ENGLISH_PYRAMID_SWEEPSTAKE_PATH);
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

  return (
    <>
      <Link
        href="/"
        className="flex min-w-0 max-w-full flex-col items-start text-left select-none"
        onClick={onLogoClick}
        aria-label="East Anglian Sales LTD home. Greeting cards and gifts across the East."
      >
        <Image
          src="/images/logo-map.png"
          alt=""
          width={88}
          height={56}
          className="h-7 w-auto object-contain brightness-0 dark:invert md:h-8"
          priority
          sizes="88px"
          quality={90}
          draggable={false}
        />
        <span className="mt-1 whitespace-nowrap text-[0.5rem] font-semibold uppercase leading-none tracking-[0.06em] text-neutral-950 dark:text-white lg:text-[0.58rem]">
          East Anglian Sales LTD
        </span>
        <span className="mt-0.5 whitespace-nowrap text-[0.38rem] font-normal leading-none tracking-[0.01em] text-neutral-400 dark:text-neutral-500 lg:text-[0.45rem]">
          Greeting Cards &amp; Gifts Across the East
        </span>
      </Link>
      {dashOpen ? <SalesAgentDash onClose={() => setDashOpen(false)} /> : null}
    </>
  );
}
