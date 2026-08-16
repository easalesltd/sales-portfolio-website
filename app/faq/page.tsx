import type { Metadata } from 'next';
import Link from 'next/link';
import { getCspNonce } from '@/app/lib/csp-nonce';
import { BUSINESS, BUSINESS_ONE_LINER, SERVICE_AREAS, SITE_URL } from '@/app/data/business-entity';
import { BUSINESS_FAQS, faqJsonLd } from '@/app/data/business-faqs';
import HomeRequestVisitCTA from '@/app/components/home/HomeRequestVisitCTA';

const FAQ_DESCRIPTION =
  'Answers about East Anglian Sales LTD, Dave Langdon, greeting card sales agents, East Anglia territory, trade-only wholesale, and partner brands.';

export const metadata: Metadata = {
  title: 'FAQ | Greeting Card Sales Agent East Anglia',
  description: FAQ_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/faq` },
  openGraph: {
    title: 'FAQ | East Anglian Sales LTD',
    description: FAQ_DESCRIPTION,
    url: `${SITE_URL}/faq`,
    type: 'website',
  },
};

export default async function FaqPage() {
  const nonce = await getCspNonce();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        Greeting card sales agent FAQ
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-gray-700 dark:text-neutral-300">{BUSINESS_ONE_LINER}</p>
      <p className="mt-3 text-sm text-gray-600 dark:text-neutral-400">
        Trade customers: {BUSINESS.telephoneDisplay} · {BUSINESS.email}
      </p>

      <dl className="mt-10 space-y-8">
        {BUSINESS_FAQS.map((faq) => (
          <div key={faq.question}>
            <dt className="text-lg font-semibold text-gray-900 dark:text-white">{faq.question}</dt>
            <dd className="mt-2 text-gray-700 leading-relaxed dark:text-neutral-300">{faq.answer}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Counties covered</h2>
        <ul className="site-accent mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {SERVICE_AREAS.map((area) => (
            <li key={area.slug}>
              <Link href={`/${area.slug}`} className="underline underline-offset-2 hover:no-underline">
                {area.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10">
        <HomeRequestVisitCTA />
      </div>
    </div>
  );
}
