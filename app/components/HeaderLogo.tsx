'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';

const PostmanGame = dynamic(() => import('./PostmanGame'), { ssr: false });

const DOUBLE_CLICK_MS = 340;
const NAV_DELAY_MS = 300;

export default function HeaderLogo() {
  const router = useRouter();
  const [gameOpen, setGameOpen] = useState(false);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastDownRef = useRef(0);

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

      if (now - lastDownRef.current < DOUBLE_CLICK_MS) {
        lastDownRef.current = 0;
        setGameOpen(true);
        return;
      }

      lastDownRef.current = now;
      navTimerRef.current = setTimeout(() => {
        navTimerRef.current = null;
        lastDownRef.current = 0;
        router.push('/');
      }, NAV_DELAY_MS);
    },
    [router]
  );

  return (
    <>
      <Link
        href="/"
        className="flex items-center select-none"
        onClick={onLogoClick}
        title="Home (double-click quickly for a hidden game)"
      >
        <Image
          src="/images/logo.webp"
          alt="East Anglian Sales LTD Logo"
          width={100}
          height={67}
          className="object-contain brightness-0 dark:invert"
          priority
          sizes="100px"
          quality={85}
          draggable={false}
        />
      </Link>
      {gameOpen ? <PostmanGame onClose={() => setGameOpen(false)} /> : null}
    </>
  );
}
