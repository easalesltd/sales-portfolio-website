'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';

const SalesAgentDash = dynamic(() => import('./SalesAgentDash'), { ssr: false });
const EnglishPyramidFantasy = dynamic(() => import('./EnglishPyramidFantasy'), { ssr: false });

const DOUBLE_CLICK_MS = 340;
const TRIPLE_CLICK_MS = 520;
const TRIPLE_DECISION_MS = 380;
const NAV_DELAY_MS = 300;

export default function HeaderLogo() {
  const router = useRouter();
  const [dashOpen, setDashOpen] = useState(false);
  const [pyramidOpen, setPyramidOpen] = useState(false);
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
        setPyramidOpen(true);
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
      {pyramidOpen ? <EnglishPyramidFantasy onClose={() => setPyramidOpen(false)} /> : null}
    </>
  );
}
