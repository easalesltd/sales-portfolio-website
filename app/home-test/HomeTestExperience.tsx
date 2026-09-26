'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  HOME_TEST_SECTORS,
  HOME_TEST_SLIDES,
  firstSlideIndexForSector,
  sectorIndexForSlide,
} from './home-test-sectors';
import { activeSectorIndex, clamp01, progressForSector } from './home-test-progress';
import './home-test.css';

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
  const [active, setActive] = useState(0);
  const slide = HOME_TEST_SLIDES[active];
  const sectorIndex = sectorIndexForSlide(active);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const update = () => {
      const total = track.offsetHeight - window.innerHeight;
      const progress = total <= 0 ? 0 : clamp01(-track.getBoundingClientRect().top / total);
      setActive(activeSectorIndex(progress, SLIDE_COUNT));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const goToSector = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const total = track.offsetHeight - window.innerHeight;
    const start = window.scrollY + track.getBoundingClientRect().top;
    window.scrollTo({
      top: start + progressForSector(firstSlideIndexForSector(index), SLIDE_COUNT) * total,
      behavior: 'smooth',
    });
  };

  return (
    <section ref={trackRef} className="home-test-track">
      <div className="home-test-stage" data-ink={slide.ink}>
        {HOME_TEST_SLIDES.map((item, index) => (
          <article
            key={item.id}
            className={`home-test-slide${index === active ? ' is-active' : ''}`}
            data-id={item.id}
            data-ink={item.ink}
            aria-hidden={index === active ? undefined : true}
          >
            <div className="home-test-hero">
              <img src={item.hero.src} alt={index === active ? item.hero.alt : ''} />
            </div>
            <div className="home-test-veil" />
            <div className="home-test-copy">
              <p className="home-test-kicker">{item.sectorTitle}</p>
              <Headline text={item.headline} sizeClass={statementSizeClass(item.headline)} />
            </div>
            <div className="home-test-ticker" aria-hidden>
              <div className="home-test-ticker-track">
                {[0, 1].map((copy) => (
                  <span key={copy}>
                    {HOME_TEST_SECTORS.find((entry) => entry.id === item.sectorId)
                      ?.slides.map((entry) => entry.statement.replace(/\.$/, ''))
                      .join('  ·  ')}
                  </span>
                ))}
              </div>
            </div>
            <p className="home-test-brands">
              <Link href={item.href}>{item.headline.replace(/\.$/, '')}</Link>
            </p>
          </article>
        ))}
        <div className="home-test-bar">
          <nav className="home-test-nav" aria-label="Ranges">
            {HOME_TEST_SECTORS.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                className={itemIndex === sectorIndex ? 'is-active' : undefined}
                aria-current={itemIndex === sectorIndex ? 'true' : undefined}
                onClick={() => goToSector(itemIndex)}
              >
                {item.title}
              </button>
            ))}
          </nav>
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
