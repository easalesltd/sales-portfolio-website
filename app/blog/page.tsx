import Link from 'next/link';
import type { Metadata } from 'next';
import BlogCoverImage from '../components/BlogCoverImage';
import { getAllMagazineArticles } from '../data/magazine-articles';

const BLOG_DESCRIPTION =
  'Articles and trade press features by Dave Langdon — columns in Greetings Today and Progressive Greetings covering the greeting card industry and life on the road in East Anglia.';

export const metadata: Metadata = {
  title: 'Blog / Press',
  description: BLOG_DESCRIPTION,
  keywords: [
    'Dave Langdon',
    'Greetings Today',
    'Progressive Greetings',
    'greeting card sales agent',
    'trade press',
    'East Anglia wholesale',
    'blog',
    'press',
  ],
  openGraph: {
    type: 'website',
    title: 'Blog / Press | Dave Langdon',
    description: BLOG_DESCRIPTION,
    url: 'https://www.easalesltd.co.uk/blog',
  },
  twitter: {
    card: 'summary',
    title: 'Blog / Press | Dave Langdon',
    description: BLOG_DESCRIPTION,
  },
  alternates: {
    canonical: 'https://www.easalesltd.co.uk/blog',
  },
};

function formatDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function BlogIndexPage() {
  const articles = getAllMagazineArticles();

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': 'https://www.easalesltd.co.uk/blog#collection',
    name: 'Blog / Press — Dave Langdon',
    description: BLOG_DESCRIPTION,
    url: 'https://www.easalesltd.co.uk/blog',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: articles.map((a, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Article',
          '@id': `https://www.easalesltd.co.uk/blog/${a.slug}`,
          name: a.title,
          description: a.excerpt,
          datePublished: a.publishedAt,
          url: `https://www.easalesltd.co.uk/blog/${a.slug}`,
          ...(a.coverImage
            ? { image: `https://www.easalesltd.co.uk${a.coverImage}` }
            : {}),
        },
      })),
    },
    author: {
      '@type': 'Person',
      name: 'Dave Langdon',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <p className="text-sm font-medium text-teal-700 dark:text-teal-400 mb-2">
          Writing
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          Blog / Press
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-neutral-300 leading-relaxed">
          Pieces I&apos;ve written for the trade press and magazines — stories from the road,
          retail, and the greeting card industry.
        </p>

        {articles.length === 0 ? (
          <div className="mt-12 rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50/80 dark:bg-neutral-900/50 px-6 py-10 text-center">
            <p className="text-gray-700 dark:text-neutral-300 leading-relaxed">
              New articles will appear here soon. To publish one, add an entry to{' '}
              <code className="text-sm bg-white dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-neutral-700">
                app/data/magazine-articles.ts
              </code>
              .
            </p>
          </div>
        ) : (
          <ul className="mt-12 space-y-10">
            {articles.map((article) => (
              <li key={article.slug}>
                <article className="group rounded-xl border border-gray-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900/40 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-neutral-700 transition-all">
                  {article.coverImage ? (
                    <BlogCoverImage
                      src={article.coverImage}
                      alt={article.title}
                      sizes="(max-width: 768px) 100vw, 42rem"
                    />
                  ) : null}
                  <Link
                    href={`/blog/${article.slug}`}
                    className="block p-6 sm:p-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500"
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-neutral-400">
                      <time dateTime={article.publishedAt}>
                        {formatDate(article.publishedAt)}
                      </time>
                      {article.publication ? (
                        <>
                          <span aria-hidden className="text-gray-300 dark:text-neutral-600">
                            ·
                          </span>
                          <span>{article.publication}</span>
                        </>
                      ) : null}
                    </div>
                    <h2 className="mt-3 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                      {article.title}
                    </h2>
                    <p className="mt-3 text-gray-600 dark:text-neutral-300 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <span className="mt-4 inline-flex text-sm font-medium text-teal-700 dark:text-teal-400">
                      Read article
                      <span className="ml-1 group-hover:translate-x-0.5 transition-transform" aria-hidden>
                        →
                      </span>
                    </span>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
