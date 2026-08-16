'use client';

import Link from 'next/link';
import FadeInOnScroll from '../FadeInOnScroll';
import HomeRequestVisitCTA from './HomeRequestVisitCTA';
import { SERVICE_AREAS } from '@/app/data/business-entity';

/** Intro + CTAs with scroll-in motion (client-only for Framer Motion). */
export default function HomeAboutSection() {
  return (
    <div className="bg-white py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-left">
        <FadeInOnScroll>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            UK Greeting Card & Gift Sales Agent Covering East Anglia
          </h1>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.2}>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Hi I&apos;m Dave Langdon, a greeting card and gift sales agent based in Ipswich, Suffolk, and I&apos;ve
            been helping retailers across East Anglia build ranges that actually sell for over 11 years.
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.3}>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            I work with a carefully chosen set of publishers and gift suppliers, covering Suffolk, Norfolk, Essex,
            Cambridgeshire, and Hertfordshire, visiting regularly, not just dropping off stock and disappearing. Whether you run an
            independent shop, garden centre, farm shop, or retail store, I can help you find the right ranges, get
            your display working harder, and keep things fresh with new designs as they come through.
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.4}>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            If you&apos;d like a visit to see the latest ranges, I&apos;d love to come and have a chat.
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.48}>
          <p className="text-sm text-gray-600 mb-6">
            Territory:{' '}
            {SERVICE_AREAS.map((area, index) => (
              <span key={area.slug}>
                {index > 0 ? ' · ' : ''}
                <Link href={`/${area.slug}`} className="site-link">
                  {area.name}
                </Link>
              </span>
            ))}
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.55}>
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-stretch sm:items-center gap-3 sm:gap-6 w-full max-w-xl sm:max-w-none mx-auto">
            <HomeRequestVisitCTA />
            <Link
              href="/about"
              prefetch
              className="w-full sm:w-auto inline-flex items-center justify-center text-center px-6 py-3 min-h-[3rem] rounded-md font-medium border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 transition-all duration-300 sm:hover:-translate-y-0.5 sm:hover:shadow-lg active:translate-y-0 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              About Dave
            </Link>
            <Link
              href="/contact"
              prefetch
              className="w-full sm:w-auto inline-flex items-center justify-center text-center px-6 py-3 min-h-[3rem] rounded-md font-medium border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 transition-all duration-300 sm:hover:-translate-y-0.5 sm:hover:shadow-lg active:translate-y-0 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              Get In Touch
            </Link>
          </div>
        </FadeInOnScroll>
      </div>
    </div>
  );
}
