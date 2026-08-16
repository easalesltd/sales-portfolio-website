import Link from 'next/link';
import { HOME_FAQS } from '@/app/data/business-faqs';
import { SERVICE_AREAS } from '@/app/data/business-entity';

export default function HomeFaqSection() {
  return (
    <section className="bg-neutral-50 py-16 dark:bg-neutral-900" aria-labelledby="home-faq-heading">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 id="home-faq-heading" className="text-3xl font-bold text-gray-900 dark:text-white">
          Greeting card sales agent — questions retailers ask
        </h2>
        <p className="mt-3 text-gray-600 dark:text-neutral-400">
          Direct answers for independent shops in East Anglia. Full list on the{' '}
          <Link href="/faq" className="text-teal-800 underline underline-offset-2 hover:no-underline dark:text-teal-400">
            FAQ page
          </Link>
          .
        </p>
        <dl className="mt-8 space-y-6">
          {HOME_FAQS.map((faq) => (
            <div key={faq.question}>
              <dt className="font-semibold text-gray-900 dark:text-white">{faq.question}</dt>
              <dd className="mt-1 leading-relaxed text-gray-700 dark:text-neutral-300">{faq.answer}</dd>
            </div>
          ))}
        </dl>
        <ul className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-teal-800 dark:text-teal-400">
          {SERVICE_AREAS.map((area) => (
            <li key={area.slug}>
              <Link href={`/${area.slug}`} className="underline underline-offset-2 hover:no-underline">
                {area.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
