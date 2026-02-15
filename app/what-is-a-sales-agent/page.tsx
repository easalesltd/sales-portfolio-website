import Link from 'next/link';
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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a sales agent?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A sales agent is a self-employed professional who represents multiple brands (principals) to retailers. They typically cover a specific region or territory and work on a commission-only basis. In the greeting card and gift sector, agents visit shops and garden centres to show ranges, take orders, and provide display support.',
      },
    },
    {
      '@type': 'Question',
      name: 'What territories does East Anglian Sales LTD cover?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dave Langdon at East Anglian Sales LTD covers East Anglia including Suffolk, Norfolk, Essex, Cambridgeshire, and Hertfordshire as a greeting card and gift sales agent.',
      },
    },
    {
      '@type': 'Question',
      name: 'What sectors does a greeting card sales agent work in?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sales agents in this sector work with greeting cards, stationery, giftware, and related products. They represent multiple brands to independent retailers, garden centres, and other trade outlets.',
      },
    },
  ],
};

export default function WhatIsASalesAgentPage() {
  return (
    <div className="min-h-screen py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          What is a Sales Agent?
        </h1>

        <div className="prose prose-lg text-gray-700 space-y-6">
          <p>
            A <strong>sales agent</strong> is a professional who works on a <strong>self-employed basis</strong>, 
            representing <strong>multiple brands</strong> (often referred to as principal, manufacturers or brands) to retailers. Rather 
            than being employed by one company, the agent acts for several brands at once, so one local contact 
            can bring a curated range of products to a shop&apos;s door.
          </p>

          <p>
            Agents tend to cover a <strong>specific region</strong>. Companies often divide the country into 
            territories and assign one agent (or a small team) to each area, so retailers get a dedicated 
            local contact who knows the patch.
          </p>

          <TerritoryImage />

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
            How does it work for greeting cards and gifts?
          </h2>
          <p>
            In the greeting card and gift industry, a sales agent visits 
            independent shops, garden centres, and other retailers in their area. Because they work for multiple 
            brands, they can show new ranges from several brands in a single visit, take orders, help with 
            display ideas, and provide one point of contact for many products. That makes it easier for shop 
            owners to stock a varied selection without managing lots of separate accounts and deliveries.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
            Commission-based work
          </h2>
          <p>
            Sales agents typically work on a <strong>commission-only basis</strong>. They are paid by the 
            manufacturers or suppliers they represent, based on the sales they generate, so there is no 
            extra cost to the retailer for using an agent. There are set industry standards for commission 
            levels, which helps keep arrangements fair and consistent across the trade.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
            Benefits of working with a sales agent
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>One visit can cover multiple brands and product categories</li>
            <li>Personal advice on what sells and how to display it</li>
            <li>Ongoing relationship and support rather than one-off transactions</li>
            <li>Trade terms and ordering through someone who knows your business</li>
            <li>Sales agents typically offer 30 days terms on commission</li>
            <li>Companies save money by not having to cover any of the sales agent&apos;s expenses, car costs, travel, national insurance, pension, and so on</li>
            <li>Display solutions and merchandising help</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
            Sectors and territories
          </h2>
          <p>
            In the <strong>greeting card and gift</strong> sector, sales agents like Dave Langdon work with 
            stationery, giftware, and card brands. They cover defined <strong>territories</strong> so that 
            retailers in each area have a dedicated contact. East Anglian Sales LTD serves the East Anglia 
            territory: <strong>Suffolk</strong>, <strong>Norfolk</strong>, <strong>Essex</strong>,{' '}
            <strong>Cambridgeshire</strong>, and <strong>Hertfordshire</strong>.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
            East Anglian Sales LTD
          </h2>
          <p>
            <Link href="/about" className="text-blue-600 hover:text-blue-800 underline">Dave Langdon</Link> at 
            East Anglian Sales LTD is a self-employed sales agent for greeting card and gift brands across 
            East Anglia. If you run a shop in Suffolk, Norfolk, Essex, Cambridgeshire, or Hertfordshire and 
            want to stock greeting cards, stationery, or gifts from trusted brands, you can{' '}
            <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">
              get in touch
            </Link>{' '}
            or{' '}
            <Link href="/about" className="text-blue-600 hover:text-blue-800 underline">
              find out more about Dave
            </Link>.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/about"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to About
          </Link>
        </div>
      </div>
    </div>
  );
}
