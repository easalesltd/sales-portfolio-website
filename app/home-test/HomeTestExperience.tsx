'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { HOME_TEST_SECTORS, HOME_TEST_SLIDES } from './home-test-sectors';
import {
  activeSectorIndex,
  clamp01,
  lastSlideHoldPx,
  shouldReleasePaging,
  slideIndexAfterSwipe,
  slideScrollTop,
  slideTravel,
} from './home-test-progress';
import './home-test.css';

const SLIDE_LOCK_MS = 780;

const RequestVisitForm = dynamic(() => import('../components/RequestVisitForm'));

const SLIDE_COUNT = HOME_TEST_SLIDES.length;

function Headline({ text, sizeClass }: { text: string; sizeClass: string }) {
  const words = text.replace(/\.$/, '').split(/\s+/);
  return (
    <h2 className={`home-test-statement${sizeClass}`}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="home-test-word">
          {word}
          {index === words.length - 1 ? '.' : ' '}
        </span>
      ))}
    </h2>
  );
}

function statementSizeClass(headline: string): string {
  if (headline.length > 28) return ' is-xl';
  if (headline.length > 16) return ' is-long';
  return '';
}

export default function HomeTestExperience({ nonce: _nonce }: { nonce?: string }) {
  const reduceMotion = usePrefersReducedMotion();
  const [visitOpen, setVisitOpen] = useState(false);

  return (
    <div className="home-test">
      <h1 className="sr-only">UK Greeting Card & Gift Sales Agent Covering East Anglia</h1>
      {reduceMotion ? <StaticSectors /> : <Campaign />}
      <Closer onRequestVisit={() => setVisitOpen(true)} />
      <RequestVisitForm isOpen={visitOpen} onClose={() => setVisitOpen(false)} />
    </div>
  );
}

function Campaign() {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [dir, setDir] = useState<'next' | 'prev'>('next');
  const slide = HOME_TEST_SLIDES[active];
  const nearby = new Set(
    [active - 1, active, active + 1, leaving].filter(
      (index): index is number => index != null && index >= 0 && index < SLIDE_COUNT,
    ),
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let locked = false;
    let lockTimer = 0;
    let leavingTimer = 0;
    let wheelAcc = 0;
    let wheelReset = 0;
    let snapTimer = 0;
    let touchY = 0;
    let touchOn = false;

    const headerBottom = () => document.querySelector('header')?.getBoundingClientRect().bottom ?? 0;
    const holdPx = () => lastSlideHoldPx(window.innerHeight);
    const travel = () => slideTravel(track.offsetHeight, window.innerHeight, holdPx());

    const topFor = (index: number) =>
      slideScrollTop(window.scrollY + track.getBoundingClientRect().top, travel(), index, SLIDE_COUNT);

    const pastReel = () => shouldReleasePaging(window.scrollY, topFor(SLIDE_COUNT - 1), holdPx());
    const holdingLast = (deltaY: number) =>
      deltaY > 0 && activeRef.current >= SLIDE_COUNT - 1 && !pastReel();

    const inReel = () => {
      if (pastReel()) return false;
      const stage = track.querySelector('.home-test-stage');
      if (!stage) return false;
      const header = headerBottom();
      const stageRect = stage.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();
      const visible = stageRect.bottom > header + 40 && stageRect.top < window.innerHeight;
      const pastCloser = trackRect.bottom <= header + 24;
      return visible && !pastCloser;
    };

    const applySlide = (next: number) => {
      const current = activeRef.current;
      if (next === current) return;
      setDir(next > current ? 'next' : 'prev');
      setLeaving(current);
      setActive(next);
      activeRef.current = next;
      locked = true;
      window.scrollTo({ top: topFor(next), behavior: 'auto' });
      window.clearTimeout(lockTimer);
      window.clearTimeout(leavingTimer);
      lockTimer = window.setTimeout(() => {
        locked = false;
      }, SLIDE_LOCK_MS);
      leavingTimer = window.setTimeout(() => {
        setLeaving(null);
      }, SLIDE_LOCK_MS + 40);
    };

    const releaseToCloser = () => {
      locked = true;
      window.scrollTo({ top: topFor(SLIDE_COUNT - 1) + holdPx(), behavior: 'auto' });
      window.clearTimeout(lockTimer);
      lockTimer = window.setTimeout(() => {
        locked = false;
      }, SLIDE_LOCK_MS);
    };

    const pageBy = (deltaY: number, threshold = 40) => {
      if (locked) return false;
      const next = slideIndexAfterSwipe(activeRef.current, deltaY, SLIDE_COUNT, threshold);
      if (next !== null) {
        applySlide(next);
        return true;
      }
      if (holdingLast(deltaY)) {
        releaseToCloser();
        return true;
      }
      return false;
    };

    const canPage = (deltaY: number) =>
      slideIndexAfterSwipe(activeRef.current, Math.sign(deltaY) * 80, SLIDE_COUNT) !== null;

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      if (pastReel()) return;
      if (!inReel() && !locked) return;
      if (!locked && !canPage(event.deltaY) && !holdingLast(event.deltaY)) return;
      event.preventDefault();
      if (locked) return;
      wheelAcc += event.deltaY;
      window.clearTimeout(wheelReset);
      wheelReset = window.setTimeout(() => {
        wheelAcc = 0;
      }, 140);
      if (Math.abs(wheelAcc) < 48) return;
      pageBy(wheelAcc, 1);
      wheelAcc = 0;
    };

    const onTouchStart = (event: TouchEvent) => {
      if (!inReel()) return;
      touchOn = true;
      touchY = event.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!touchOn) return;
      const currentY = event.touches[0]?.clientY ?? touchY;
      const deltaY = touchY - currentY;
      if (pastReel()) return;
      if (locked || canPage(deltaY) || holdingLast(deltaY)) event.preventDefault();
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (!touchOn) return;
      touchOn = false;
      if (pastReel()) return;
      const endY = event.changedTouches[0]?.clientY ?? touchY;
      pageBy(touchY - endY);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!inReel()) return;
      if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') {
        if (pageBy(80)) event.preventDefault();
      } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        if (pageBy(-80)) event.preventDefault();
      }
    };

    const nearestFromScroll = () => {
      const span = travel();
      const progress = span <= 0 ? 0 : clamp01(-track.getBoundingClientRect().top / span);
      return activeSectorIndex(progress, SLIDE_COUNT);
    };

    const onScroll = () => {
      if (locked) return;
      window.clearTimeout(snapTimer);
      snapTimer = window.setTimeout(() => {
        if (locked || pastReel() || !inReel()) return;
        const nearest = nearestFromScroll();
        if (nearest !== activeRef.current) applySlide(nearest);
      }, 90);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(lockTimer);
      window.clearTimeout(leavingTimer);
      window.clearTimeout(wheelReset);
      window.clearTimeout(snapTimer);
    };
  }, []);

  return (
    <section ref={trackRef} className="home-test-track" style={{ height: `${(SLIDE_COUNT + 1) * 100}vh` }}>
      <div className="home-test-stage" data-ink={slide.ink} data-dir={dir} data-slide={slide.id}>
        {HOME_TEST_SLIDES.map((item, index) => (
          <article
            key={item.id}
            className={`home-test-slide${index === active ? ' is-active' : ''}${
              index === leaving ? ' is-leaving' : ''
            }`}
            data-id={item.id}
            data-ink={item.ink}
            aria-hidden={index === active ? undefined : true}
          >
            {nearby.has(index) ? (
              <div className="home-test-hero">
                <img src={item.hero.src} alt={index === active ? item.hero.alt : ''} />
              </div>
            ) : (
              <div className="home-test-hero" />
            )}
            <div className="home-test-veil" />
            <p className="home-test-brands">
              <Link href={item.href}>{item.headline.replace(/\.$/, '')}</Link>
            </p>
          </article>
        ))}
        <div className="home-test-ticker" aria-hidden>
          <div className="home-test-ticker-track">
            {[0, 1].map((copy) => (
              <span key={`${slide.sectorId}-${copy}`}>
                {HOME_TEST_SECTORS.find((entry) => entry.id === slide.sectorId)
                  ?.slides.map((entry) => entry.statement.replace(/\.$/, ''))
                  .join('  ·  ')}
              </span>
            ))}
          </div>
        </div>
        <div className="home-test-copy">
          <p className="home-test-kicker" key={slide.sectorId}>
            {slide.sectorTitle}
          </p>
          <div className="home-test-headlines">
            {HOME_TEST_SLIDES.map((item, index) => (
              <div
                key={item.id}
                className={index === active ? 'is-active' : undefined}
                aria-hidden={index === active ? undefined : true}
              >
                <Headline text={item.headline} sizeClass={statementSizeClass(item.headline)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StaticSectors() {
  return (
    <div>
      {HOME_TEST_SLIDES.map((slide) => (
        <section key={slide.id} className="home-test-static-slide is-active" data-id={slide.id} data-ink={slide.ink}>
          <div className="home-test-hero">
            <img src={slide.hero.src} alt={slide.hero.alt} />
          </div>
          <div className="home-test-veil" />
          <div className="home-test-copy">
            <p className="home-test-kicker">{slide.sectorTitle}</p>
            <Headline text={slide.headline} sizeClass={statementSizeClass(slide.headline)} />
          </div>
          <p className="home-test-brands">
            <Link href={slide.href}>{slide.headline.replace(/\.$/, '')}</Link>
          </p>
        </section>
      ))}
    </div>
  );
}

function Closer({ onRequestVisit }: { onRequestVisit: () => void }) {
  return (
    <section className="home-test-close">
      <div className="home-test-close-inner">
        <h2>East Anglia. Cards, gifts, scent, confectionery.</h2>
        <p className="home-test-close-sub">for the wholesale trade</p>
        <p>
          Supplying independent shops, garden centres and farm shops across Suffolk, Norfolk,
          Essex, Cambridgeshire and Hertfordshire.
        </p>
        <div className="home-test-actions">
          <button type="button" onClick={onRequestVisit}>
            Request an agent visit
          </button>
          <Link href="/about">About Dave</Link>
        </div>
      </div>
    </section>
  );
}

function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduce(media.matches);
    media.addEventListener('change', sync);
    sync();
    return () => media.removeEventListener('change', sync);
  }, []);

  return reduce;
}
