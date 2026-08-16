import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { companies } from '@/app/data/companies';
import {
  BUSINESS,
  SERVICE_AREAS,
  SITE_URL,
  serviceAreaBySlug,
  type ServiceArea,
} from '@/app/data/business-entity';
import { getCspNonce } from '@/app/lib/csp-nonce';
import HomeRequestVisitCTA from '@/app/components/home/HomeRequestVisitCTA';

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_AREAS.map((area) => ({ county: area.slug }));
}

function countyFaqs(area: ServiceArea) {
  return [
    {
      question: `Who is the greeting card sales agent in ${area.name}?`,
      answer: area.intro,
    },
    {
      question: `Does East Anglian Sales LTD visit shops in ${area.name}?`,
      answer: `Yes. Dave Langdon visits independent retailers, garden centres, farm shops, and gift shops in ${area.name}, including ${area.towns.slice(0, 5).join(', ')}, and surrounding towns.`,
    },
    {
      question: `How do I book a wholesale greeting card visit in ${area.name}?`,
      answer: `Request an agent visit on easalesltd.co.uk, call ${BUSINESS.telephoneDisplay}, or email ${BUSINESS.email}. East Anglian Sales LTD is trade-only — it does not sell cards to the public.`,
    },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ county: string }> | { county: string };
}): Promise<Metadata> {
  const { county } = await Promise.resolve(params);
  const area = serviceAreaBySlug(county);
  if (!area) return {};

  const title = `Greeting Card Sales Agent ${area.name} | Dave Langdon`;
  const description = area.intro;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${area.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${area.slug}`,
      type: 'website',
    },
  };
}

export default async function CountyPage({
  params,
}: {
  params: Promise<{ county: string }> | { county: string };
}) {
  const { county } = await Promise.resolve(params);
  const area = serviceAreaBySlug(county);
  if (!area) notFound();

  const nonce = await getCspNonce();
  const faqs = countyFaqs(area);
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${area.slug}#webpage`,
      url: `${SITE_URL}/${area.slug}`,
      name: `Greeting card and gift sales agent in ${area.name}`,
      description: area.intro,
      about: { '@id': `${SITE_URL}/#organization` },
      mainEntity: { '@id': `${SITE_URL}/#person` },
      isPartOf: { '@id': `${SITE_URL}/#website` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `Greeting card and gift sales agency in ${area.name}`,
      serviceType: 'Wholesale sales agent',
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: {
        '@type': 'AdministrativeArea',
        name: area.name,
        containedInPlace: { '@type': 'AdministrativeArea', name: area.regionLabel },
      },
      audience: { '@type': 'Audience', audienceType: 'Trade / wholesale retailers' },
    },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="text-sm font-medium uppercase tracking-wide text-teal-800 dark:text-teal-400">
        {area.regionLabel} · Trade only
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
        Greeting card &amp; gift sales agent in {area.name}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-gray-700 dark:text-neutral-300">{area.intro}</p>
      <p className="mt-4 leading-relaxed text-gray-700 dark:text-neutral-300">{area.localNote}</p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900 dark:text-white">
        Towns visited in {area.name}
      </h2>
      <p className="mt-3 text-gray-700 dark:text-neutral-300">
        Regular calls include {area.towns.join(', ')}, plus surrounding villages and garden centres.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900 dark:text-white">What the visit is for</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700 dark:text-neutral-300">
        <li>Wholesale greeting cards, stationery, gifts, and selected confectionery ranges</li>
        <li>One East Anglia agent instead of a separate rep for every publisher</li>
        <li>Display advice so the range sells through</li>
        <li>Trade customers only — not a shop for the public</li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold text-gray-900 dark:text-white">Brands on the territory</h2>
      <p className="mt-3 text-gray-700 dark:text-neutral-300">
        Dave Langdon is the {area.name} sales agent for{' '}
        {companies.map((company) => company.name).join(', ')}.
      </p>
      <p className="mt-2">
        <Link href="/#partner-brands" className="text-teal-800 underline underline-offset-2 hover:no-underline dark:text-teal-400">
          See partner brands
        </Link>
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900 dark:text-white">
        {area.name} greeting card agent FAQs
      </h2>
      <dl className="mt-4 space-y-6">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <dt className="font-semibold text-gray-900 dark:text-white">{faq.question}</dt>
            <dd className="mt-1 text-gray-700 dark:text-neutral-300">{faq.answer}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
        <HomeRequestVisitCTA />
        <Link
          href="/faq"
          className="inline-flex items-center justify-center px-6 py-3 min-h-[3rem] rounded-md font-medium border border-neutral-950 text-neutral-950 hover:bg-neutral-50 dark:border-white dark:text-white dark:hover:bg-neutral-900"
        >
          More FAQs
        </Link>
      </div>
    </article>
  );
}
