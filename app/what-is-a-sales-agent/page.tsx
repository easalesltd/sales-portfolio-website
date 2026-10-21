import Link from 'next/link';
import { getCspNonce } from '@/app/lib/csp-nonce';
import TerritoryImage from './TerritoryImage';

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'What is a Sales Agent?',
  description: 'How greeting card and gift sales agents work: self-employed, commission-only, covering specific territories. Serving East Anglia including Suffolk, Norfolk, Essex, and Cambridgeshire.',
  url: 'https://www.easalesltd.co.uk/what-is-a-sales-agent',
  author: {
    '@type': 'Person',
    name: 'Dave Langdon',
    url: 'https://www.easalesltd.co.uk/about',
  },
  publisher: {
    '@type': 'Organization',
    name: 'East Anglian Sales LTD',
    url: 'https://www.easalesltd.co.uk',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://www.easalesltd.co.uk/what-is-a-sales-agent',
  },
  about: [
    { '@type': 'Thing', name: 'Sales agent' },
    { '@type': 'Thing', name: 'Greeting card sales' },
    { '@type': 'Thing', name: 'Giftware sales' },
    { '@type': 'Place', name: 'East Anglia' },
    { '@type': 'Place', name: 'Suffolk' },
    { '@type': 'Place', name: 'Norfolk' },
    { '@type': 'Place', name: 'Essex' },
    { '@type': 'Place', name: 'Cambridgeshire' },
    { '@type': 'Place', name: 'Hertfordshire' },
  ],
};

export default async function WhatIsASalesAgentPage() {
  const nonce = await getCspNonce();
  return (
    <div className="min-h-screen py-12">
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          What is a Sales Agent?
        </h1>

        <div className="prose prose-lg text-gray-700 space-y-6">
          <p>
            A <strong>sales agent</strong> is a <strong>self-employed</strong> professional who sells on
            behalf of <strong>several brands</strong> at once, rather than working for a single company. For
            a shop owner, that means one person can show you ranges from a number of suppliers in a single
            visit, instead of you dealing with a different rep from each one.
          </p>

          <p>
            Most agents cover a <strong>defined patch</strong>. Brands usually split the country into
            territories and appoint an agent to each, so the person calling on you knows your area, your
            type of shop and your customers.
          </p>

          <TerritoryImage />

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
            How it works in greeting cards and gifts
          </h2>
          <p>
            I visit independent card shops, gift shops, garden centres and farm shops across East Anglia.
            On each visit I show new ranges, take orders, and help with display and merchandising. You can
            stock a varied selection without managing a dozen separate reps, accounts and sales calls.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
            Does it cost retailers anything?
          </h2>
          <p>
            No. Agents are paid <strong>commission</strong> by the brands they represent, so ordering
            through an agent doesn&apos;t add anything to your costs. Commission rates follow
            well-established trade norms.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
            Why shops like working with an agent
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>One regular, local contact for several brands</li>
            <li>Honest advice on what&apos;s selling and how to display it</li>
            <li>Help with display solutions and merchandising</li>
            <li>Ordering and trade terms handled by someone who knows your business</li>
            <li>A continuing relationship, not one-off transactions</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
            Why brands use agents
          </h2>
          <p>
            Taking on an agent is a low-risk way for a brand to cover a region. The brand doesn&apos;t pay
            for a salary, car, travel, National Insurance or pension, and only pays commission on sales
            actually made. If a brand is looking for coverage in the East of England,{' '}
            <Link
              href="/contact"
              className="text-neutral-900 hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-300 underline"
            >
              get in touch
            </Link>.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
            Who I am and where I work
          </h2>
          <p>
            I&apos;m Dave Langdon, a self-employed sales agent for greeting card, stationery and gift
            brands, and the director of East Anglian Sales Ltd. I cover Suffolk, Norfolk, Essex,
            Cambridgeshire and Hertfordshire, and I&apos;m a member of the UK Greeting Card Association.
          </p>
          <p>
            If you run a shop in that area and want to stock cards, stationery or gifts from brands I
            represent,{' '}
            <Link
              href="/contact"
              className="text-neutral-900 hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-300 underline"
            >
              get in touch
            </Link>{' '}
            or{' '}
            <Link
              href="/about"
              className="text-neutral-900 hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-300 underline"
            >
              read more about me
            </Link>.
          </p>

          <p>
            Want to see what a day on the road is like? Double click/tap the <strong>Black East Anglia</strong> logo
            (top left).
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/about"
            className="text-neutral-900 hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-300 font-medium"
          >
            ← Back to About Dave
          </Link>
        </div>
      </div>
    </div>
  );
}
