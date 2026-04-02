'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Company } from '../data/companies';
import { partnerBrandLogoAlt } from '../lib/partner-brand-logo-alt';

export default function PartnerBrandCard({
  company,
  hoverLift = true,
}: {
  company: Company;
  hoverLift?: boolean;
}) {
  const useDarkStrip = Boolean(company.logoUrlDark);
  const invertForStrip =
    useDarkStrip && company.id !== 'cambridge-confectionery-company';
  const logoSrc = company.logoUrlDark ?? company.logoUrl;

  return (
    <Link
      href={`/companies/${company.slug}`}
      prefetch
      className={`group flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-lg bg-white/90 shadow-lg ring-1 ring-black/5 backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
        hoverLift ? 'hover:-translate-y-1' : ''
      }`}
    >
      <div
        className={`relative aspect-[3/2] w-full shrink-0 overflow-hidden ${
          useDarkStrip ? 'bg-black' : 'bg-white'
        }`}
      >
        <Image
          src={logoSrc}
          alt={partnerBrandLogoAlt(company.name)}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 320px"
          className={`object-contain object-center p-5 transition-transform duration-300 group-hover:scale-[1.03] ${
            invertForStrip ? 'invert' : ''
          }`}
          quality={80}
        />
      </div>
      <div className="flex min-h-[140px] flex-grow flex-col justify-start bg-white/90 p-6 backdrop-blur-sm">
        <h3 className="mb-2 text-center text-xl font-semibold text-gray-900">{company.name}</h3>
        <p className="text-center text-sm leading-relaxed text-gray-700">{company.description}</p>
      </div>
    </Link>
  );
}
