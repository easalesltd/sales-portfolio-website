import type { MetadataRoute } from 'next';
import { companies } from './data/companies';
import { getAllMagazineArticles } from './data/magazine-articles';
import { getAllRecipes } from './data/recipes';

const SITE_URL = 'https://www.easalesltd.co.uk';

/**
 * Avoid fs.statSync / process.cwd() here. Dynamic filesystem access makes Vercel’s
 * NFT tracer pull huge chunks of `app/` and `public/` into the sitemap function
 * (hundreds of MB) and exceeds the serverless size limit.
 */
type ChangeFrequency = MetadataRoute.Sitemap[number]['changeFrequency'];

type StaticRoute = {
  pathname: string;
  priority: number;
  changeFrequency: ChangeFrequency;
};

const STATIC_ROUTES: StaticRoute[] = [
  { pathname: '/', priority: 1.0, changeFrequency: 'weekly' },
  { pathname: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { pathname: '/what-is-a-sales-agent', priority: 0.8, changeFrequency: 'monthly' },
  { pathname: '/temporary-rep-cover', priority: 0.9, changeFrequency: 'monthly' },
  { pathname: '/display-solutions', priority: 0.8, changeFrequency: 'monthly' },
  { pathname: '/display-solutions/bespoke-confectionery-displays', priority: 0.8, changeFrequency: 'monthly' },
  { pathname: '/contact', priority: 0.8, changeFrequency: 'monthly' },
  { pathname: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { pathname: '/cookies', priority: 0.3, changeFrequency: 'yearly' },
  { pathname: '/site-index', priority: 0.4, changeFrequency: 'monthly' },
  { pathname: '/blog', priority: 0.75, changeFrequency: 'monthly' },
  { pathname: '/recipes', priority: 0.7, changeFrequency: 'monthly' },
  { pathname: '/llms.txt', priority: 0.5, changeFrequency: 'monthly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const urls = new Map<string, MetadataRoute.Sitemap[number]>();

  for (const route of STATIC_ROUTES) {
    urls.set(route.pathname, {
      url: `${SITE_URL}${route.pathname}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    });
  }

  for (const company of companies) {
    const pathname = `/companies/${company.slug}`;
    urls.set(pathname, {
      url: `${SITE_URL}${pathname}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  for (const recipe of getAllRecipes()) {
    const pathname = `/recipes/${recipe.slug}`;
    urls.set(pathname, {
      url: `${SITE_URL}${pathname}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  for (const article of getAllMagazineArticles()) {
    const pathname = `/blog/${article.slug}`;
    urls.set(pathname, {
      url: `${SITE_URL}${pathname}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.75,
    });
  }

  return Array.from(urls.values());
}
