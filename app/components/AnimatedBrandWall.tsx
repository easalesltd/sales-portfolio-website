'use client';

import Image from 'next/image';
import Link from 'next/link';
import { companies } from '../data/companies';

type AnimatedBrandWallProps = {
  rowHeight?: number;
  gap?: number;
  speedSeconds?: number; // base speed per loop
};

function buildLogoList() {
  return companies.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    logoUrl: c.logoUrl,
  }));
}

export default function AnimatedBrandWall({
  rowHeight = 80,
  gap = 32,
  speedSeconds = 40,
}: AnimatedBrandWallProps) {
  const logos = buildLogoList();

  // Duplicate the list to create a continuous marquee
  const repeated = [...logos, ...logos, ...logos];

  return (
    <div className="w-full select-none">
      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      {/* Top row */}
      <div
        className="relative overflow-hidden"
        style={{ height: rowHeight }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none"
          aria-hidden
        />
        <div
          className="flex items-center"
          style={{
            gap,
            width: '200%', // two copies placed side-by-side
            animation: `marqueeLeft ${speedSeconds}s linear infinite`,
          }}
        >
          {[...repeated].map((logo, idx) => (
            <Link
              href={`/companies/${logo.slug}`}
              key={`top-${logo.id}-${idx}`}
              className="opacity-80 hover:opacity-100 transition-opacity"
              prefetch
            >
              <Image
                src={logo.logoUrl}
                alt={`${logo.name} logo`}
                width={160}
                height={rowHeight}
                style={{
                  height: rowHeight - 10,
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom row, opposite direction and slightly faster */}
      <div
        className="relative overflow-hidden mt-8"
        style={{ height: rowHeight }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none"
          aria-hidden
        />
        <div
          className="flex items-center"
          style={{
            gap,
            width: '200%',
            animation: `marqueeRight ${Math.max(20, speedSeconds - 6)}s linear infinite`,
          }}
        >
          {[...repeated].map((logo, idx) => (
            <Link
              href={`/companies/${logo.slug}`}
              key={`bottom-${logo.id}-${idx}`}
              className="opacity-80 hover:opacity-100 transition-opacity"
              prefetch
            >
              <Image
                src={logo.logoUrl}
                alt={`${logo.name} logo`}
                width={160}
                height={rowHeight}
                style={{
                  height: rowHeight - 10,
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


