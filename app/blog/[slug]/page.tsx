import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import BlogCoverImage from '../../components/BlogCoverImage';
import {
  getAllMagazineArticleSlugs,
  getMagazineArticleBySlug,
} from '../../data/magazine-articles';

export async function generateStaticParams() {
  return getAllMagazineArticleSlugs().map((slug) => ({ slug }));
}

function metaDescriptionFallback(article: {
  excerpt: string;
  publication?: string;
}): string {
  const base = article.excerpt.trim();
  if (base.length <= 160) return base;
  const cut = base.slice(0, 157).replace(/\s+\S*$/, '');
  return cut.endsWith('.') ? cut : `${cut}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getMagazineArticleBySlug(slug);
  if (!article) {
    return { title: 'Article not found' };
  }
  const url = `https://www.easalesltd.co.uk/blog/${article.slug}`;
  const docTitle = article.metaTitle ?? article.title;
  const docDescription =
    article.metaDescription ?? metaDescriptionFallback(article);
  const keywords = [
    'Dave Langdon',
    'East Anglia',
    'greeting card sales agent',
    'greeting cards wholesale',
    article.publication ?? '',
    article.title.split(/[|,\u2014]/)[0]?.trim() ?? '',
  ].filter(Boolean);

  return {
    title: { absolute: docTitle },
    description: docDescription,
    keywords,
    openGraph: {
      title: docTitle,
      description: docDescription,
      url,
      type: 'article',
      publishedTime: article.publishedAt,
      ...(article.coverImage
        ? { images: [`https://www.easalesltd.co.uk${article.coverImage}`] }
        : {}),
    },
    twitter: {
      card: article.coverImage ? 'summary_large_image' : 'summary',
      title: docTitle,
      description: docDescription,
      ...(article.coverImage
        ? { images: [`https://www.easalesltd.co.uk${article.coverImage}`] }
        : {}),
    },
    alternates: { canonical: url },
  };
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getMagazineArticleBySlug(slug);
  if (!article) notFound();

  const pageUrl = `https://www.easalesltd.co.uk/blog/${article.slug}`;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription ?? article.excerpt,
    articleSection: 'Blog / Press',
    datePublished: article.publishedAt,
    ...(article.paragraphs.length > 0
      ? { articleBody: article.paragraphs.join('\n\n') }
      : {}),
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
      '@id': pageUrl,
    },
    ...(article.coverImage
      ? { image: [`https://www.easalesltd.co.uk${article.coverImage}`] }
      : {}),
    ...(article.sourceUrl ? { isBasedOn: article.sourceUrl } : {}),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.easalesltd.co.uk/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog / Press',
        item: 'https://www.easalesltd.co.uk/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <Link
          href="/blog"
          className="inline-flex text-sm font-medium text-teal-700 dark:text-teal-400 hover:underline mb-8"
        >
          ← Blog / Press
        </Link>

        <header>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-neutral-400">
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            {article.publication ? (
              <>
                <span aria-hidden className="text-gray-300 dark:text-neutral-600">
                  ·
                </span>
                <span>{article.publication}</span>
              </>
            ) : null}
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
            {article.title}
          </h1>
        </header>

        {article.coverImage ? (
          <div className="mt-10 rounded-xl overflow-hidden">
            <BlogCoverImage
              src={article.coverImage}
              alt={article.title}
              sizes="(max-width: 768px) 100vw, 42rem"
              priority
              className="rounded-xl"
            />
          </div>
        ) : null}

        {article.paragraphs.length > 0 ? (
          <div className="mt-10 space-y-5 text-base sm:text-lg text-gray-700 dark:text-neutral-300 leading-relaxed">
            {article.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ) : null}

        {article.sourceUrl ? (
          <p className="mt-10 text-sm text-gray-600 dark:text-neutral-400">
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-teal-700 dark:text-teal-400 hover:underline"
            >
              View original piece
            </a>
          </p>
        ) : null}
      </article>
    </>
  );
}
