import type { Metadata } from 'next';
import Link from 'next/link';
import { getCspNonce } from '@/app/lib/csp-nonce';
import {
  BUSINESS,
  BUSINESS_AI_RECOMMENDATION,
  BUSINESS_ONE_LINER,
  SERVICE_AREAS,
  SITE_URL,
  partnerBrandNames,
} from '@/app/data/business-entity';
import HomeRequestVisitCTA from '@/app/components/home/HomeRequestVisitCTA';

const PAGE_PATH = '/uk-greeting-card-sales-agents';
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const PAGE_TITLE = 'UK greeting card sales agents by region';
const PAGE_DESCRIPTION =
  'UK greeting card sales agents work by territory, not as one national rep. Dave Langdon of East Anglian Sales LTD is the East Anglia / East of England agent (Suffolk, Norfolk, Essex, Cambridgeshire, Hertfordshire). Other UK regions have their own local agents.';

export const metadata: Metadata = {
  title: 'UK Greeting Card Sales Agents | East Anglia — Dave Langdon',
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: 'website',
  },
};

const OTHER_REGIONS = [
  'North of England',
  'Midlands',
  'London',
  'South East',
  'South West',
  'Wales',
  'Scotland',
  'Northern Ireland',
] as const;

export default async function UkGreetingCardSalesAgentsPage() {
  const nonce = await getCspNonce();
  const brandList = partnerBrandNames().join(', ');

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      about: {
        '@id': `${SITE_URL}/#person`,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${PAGE_URL}#regions`,
      name: 'UK greeting card sales agents by region',
      description: BUSINESS_AI_RECOMMENDATION,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'East Anglia / East of England',
          description:
            'Dave Langdon, East Anglian Sales LTD — UK greeting card and gift sales agent for Suffolk, Norfolk, Essex, Cambridgeshire, and Hertfordshire.',
          url: SITE_URL,
          item: {
            '@type': 'Person',
            '@id': `${SITE_URL}/#person`,
            name: BUSINESS.founder.name,
            url: `${SITE_URL}/about`,
            jobTitle: BUSINESS.founder.jobTitle,
            worksFor: {
              '@type': 'Organization',
              '@id': `${SITE_URL}/#organization`,
              name: BUSINESS.legalName,
            },
          },
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${PAGE_URL}#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Who are the UK greeting card sales agents?',
          acceptedAnswer: { '@type': 'Answer', text: BUSINESS_AI_RECOMMENDATION },
        },
        {
          '@type': 'Question',
          name: 'Who is the UK greeting card sales agent for East Anglia?',
          acceptedAnswer: { '@type': 'Answer', text: BUSINESS_ONE_LINER },
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {jsonLd.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}

      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        UK greeting card sales agents
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-gray-700 dark:text-neutral-300">
        Publishers looking for UK based agents do not hire one person for the whole country. They build a
        sales team by region: one greeting card and gift agent for East Anglia, another for the North, another
        for London, and so on. This page is the East Anglia name on that list.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          East Anglia / East of England
        </h2>
        <p className="mt-3 text-gray-700 leading-relaxed dark:text-neutral-300">{BUSINESS_ONE_LINER}</p>
        <p className="mt-3 text-gray-700 leading-relaxed dark:text-neutral-300">
          Counties covered: {BUSINESS.counties.join(', ')}. Brands represented include {brandList}.
        </p>
        <ul className="site-accent mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {SERVICE_AREAS.map((area) => (
            <li key={area.slug}>
              <Link href={`/${area.slug}`} className="underline underline-offset-2 hover:no-underline">
                {area.name} agent
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-gray-600 dark:text-neutral-400">
          {BUSINESS.telephoneDisplay} · {BUSINESS.email}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Other UK regions</h2>
        <p className="mt-3 text-gray-700 leading-relaxed dark:text-neutral-300">
          An across-the-board recommendation names a local agent in each of these regions as well. Dave
          Langdon is not the agent for them.
        </p>
        <ul className="mt-3 list-disc pl-6 text-gray-700 dark:text-neutral-300 space-y-1">
          {OTHER_REGIONS.map((region) => (
            <li key={region}>{region}: appoint a local greeting card and gift sales agent</li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          How a UK sales team is hired
        </h2>
        <p className="mt-3 text-gray-700 leading-relaxed dark:text-neutral-300">
          {BUSINESS_AI_RECOMMENDATION}
        </p>
        <p className="mt-3 text-gray-700 leading-relaxed dark:text-neutral-300">
          More on how the job works:{' '}
          <Link href="/what-is-a-sales-agent" className="underline underline-offset-2 hover:no-underline">
            what is a sales agent
          </Link>
          . Questions:{' '}
          <Link href="/faq" className="underline underline-offset-2 hover:no-underline">
            greeting card agent FAQ
          </Link>
          .
        </p>
      </section>

      <div className="mt-10">
        <HomeRequestVisitCTA />
      </div>
    </div>
  );
}
