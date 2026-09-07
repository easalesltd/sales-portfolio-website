import type { Metadata, Viewport } from 'next';
import { Caveat, Fraunces, Nunito } from 'next/font/google';
import { GBBO_LEAGUE_PATH } from '@/app/lib/gbbo-league-path';
import { GbboFrame } from './GbboFrame';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
});

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
});

export const metadata: Metadata = {
  title: { absolute: "The Companions' Tent" },
  description: 'Private Great British Bake Off fantasy league.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  alternates: { canonical: GBBO_LEAGUE_PATH },
};

export const viewport: Viewport = {
  themeColor: '#f6efe2',
};

export default function GbboLeagueLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${fraunces.variable} ${nunito.variable} ${caveat.variable} font-gbbo`}>
      <GbboFrame>{children}</GbboFrame>
    </div>
  );
}
