'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Company } from '../data/companies';
import { partnerBrandLogoAlt } from '../lib/partner-brand-logo-alt';

/** Homepage partner grid only — opaque tile so video backdrop never shows through the logo strip. */
export default function PartnerBrandCard({
  company,
  withHoverLift = true,
}: {
  company: Company;
  withHoverLift?: boolean;
}) {
  const cambridge = company.id === 'cambridge-confectionery-company';
  const stripBg = cambridge ? 'bg-neutral-950' : 'bg-white';

  return (
    <Link
      href={`/companies/${company.slug}`}
      prefetch
      className={`group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:shadow-xl ${
        withHoverLift ? 'hover:-translate-y-1' : ''
      }`}
    >
      <div className={`relative aspect-[3/2] w-full shrink-0 overflow-hidden ${stripBg}`}>
        <Image
          src={company.logoUrl}
          alt={partnerBrandLogoAlt(company.name)}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 320px"
          className="object-contain object-center p-6 transition-transform duration-300 group-hover:scale-[1.02]"
          quality={80}
        />
      </div>
      <div className="flex min-h-[140px] flex-grow flex-col justify-start border-t border-gray-100 bg-white p-6">
        <h3 className="mb-2 text-center text-xl font-semibold text-gray-900">{company.name}</h3>
        <p className="text-center text-sm leading-relaxed text-gray-700">{company.description}</p>
      </div>
    </Link>
  );
}
