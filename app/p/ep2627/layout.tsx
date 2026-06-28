import type { Metadata, Viewport } from 'next';
import { ENGLISH_PYRAMID_SWEEPSTAKE_PATH } from '@/app/lib/english-pyramid-sweepstake-path';

const assetBase = ENGLISH_PYRAMID_SWEEPSTAKE_PATH;

export const metadata: Metadata = {
  title: 'English Pyramid Sweepstake',
  description: 'Private league standings for players.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  icons: {
    icon: [{ url: `${assetBase}/icon-192.png`, sizes: '192x192', type: 'image/png' }],
    apple: [{ url: `${assetBase}/apple-touch-icon.png`, sizes: '180x180', type: 'image/png' }],
  },
  manifest: `${assetBase}/manifest.webmanifest`,
  appleWebApp: {
    capable: true,
    title: 'Pyramid Sweepstake',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
};

export default function EnglishPyramidSweepstakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
