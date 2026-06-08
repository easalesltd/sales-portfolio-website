import type { Metadata } from 'next';
import Link from 'next/link';
import { companies } from '@/app/data/companies';
import { getAllMagazineArticles } from '@/app/data/magazine-articles';
import { getAllRecipes } from '@/app/data/recipes';

const SITE_INDEX_DESCRIPTION =
  'A crawl-friendly index of pages on East Anglian Sales LTD, including partner brands, articles, recipes, and core service pages.';

export const metadata: Metadata = {
  title: 'Site Index',
  description: SITE_INDEX_DESCRIPTION,
  alternates: {
    canonical: 'https://www.easalesltd.co.uk/site-index',
  },
  openGraph: {
    title: 'Site Index | East Anglian Sales LTD',
    description: SITE_INDEX_DESCRIPTION,
    url: 'https://www.easalesltd.co.uk/site-index',
    type: 'website',
  },
};

const corePages = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Dave' },
  { href: '/what-is-a-sales-agent', label: 'What Is a Sales Agent?' },
  { href: '/display-solutions', label: 'Display Solutions' },
  { href: '/display-solutions/bespoke-confectionery-displays', label: 'Bespoke Confectionery Displays' },
  { href: '/temporary-rep-cover', label: 'Temporary Rep Cover' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/cookies', label: 'Cookie Policy' },
  { href: '/blog', label: 'Blog / Press' },
  { href: '/recipes', label: 'Recipes' },
] as const;

export default function SiteIndexPage() {
  const articles = getAllMagazineArticles();
  const recipes = getAllRecipes();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Site Index</h1>
      <p className="mt-3 max-w-3xl text-gray-600 dark:text-neutral-300">
        Browse all key pages, partner brands, articles, and recipes.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Core Pages</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {corePages.map((page) => (
            <li key={page.href}>
              <Link href={page.href} className="text-teal-700 hover:underline dark:text-teal-400">
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Partner Brands</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {companies.map((company) => (
            <li key={company.id}>
              <Link
                href={`/companies/${company.slug}`}
                className="text-teal-700 hover:underline dark:text-teal-400"
              >
                {company.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {articles.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Blog / Press Articles</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {articles.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/blog/${article.slug}`}
                  className="text-teal-700 hover:underline dark:text-teal-400"
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {recipes.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recipes</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {recipes.map((recipe) => (
              <li key={recipe.slug}>
                <Link
                  href={`/recipes/${recipe.slug}`}
                  className="text-teal-700 hover:underline dark:text-teal-400"
                >
                  {recipe.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
