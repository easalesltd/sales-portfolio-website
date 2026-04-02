'use client';

import Link from 'next/link';
import type { Company } from '../data/companies';
import { partnerBrandLogoAlt } from '../lib/partner-brand-logo-alt';

/**
 * Partner grid tile: native img + flex centering avoids next/image fill sizing edge cases.
 * Same Cambridge dark strip / invert rules as historic grid.
 */
export default function PartnerBrandTile({ company }: { company: Company }) {
  const useLightMarkOnDarkTile = Boolean(company.logoUrlDark);
  const invertLightMarkOnDarkTile =
    useLightMarkOnDarkTile && company.id !== 'cambridge-confectionery-company';
  const logoSrc = company.logoUrlDark ?? company.logoUrl;

  return (
    <Link
      href={`/companies/${company.slug}`}
      prefetch
      className="group flex h-full min-h-0 w-full flex-col overflow-hidden rounded-lg bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div
        className={`flex aspect-[3/2] w-full shrink-0 items-center justify-center overflow-hidden p-6 ${
          useLightMarkOnDarkTile ? 'bg-black' : 'bg-white'
        }`}
      >
        <img
          src={logoSrc}
          alt={partnerBrandLogoAlt(company.name)}
          loading="lazy"
          decoding="async"
          className={`max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105 ${
            invertLightMarkOnDarkTile ? 'invert' : ''
          }`}
        />
      </div>
      <div className="flex min-h-[140px] flex-grow flex-col justify-start bg-white/90 p-6 backdrop-blur-sm">
        <h3 className="mb-2 text-center text-xl font-semibold text-gray-900">{company.name}</h3>
        <p className="text-center text-sm leading-relaxed text-gray-700">{company.description}</p>
      </div>
    </Link>
  );
}
