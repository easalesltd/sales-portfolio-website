import fs from 'node:fs';
import path from 'node:path';
import type { MetadataRoute } from 'next';
import { companies } from './data/companies';
import { getAllMagazineArticles } from './data/magazine-articles';
import { getAllRecipes } from './data/recipes';

const SITE_URL = 'https://www.easalesltd.co.uk';
const APP_DIR = path.join(process.cwd(), 'app');

type ChangeFrequency = MetadataRoute.Sitemap[number]['changeFrequency'];

type StaticRoute = {
  pathname: string;
  sourceFile: string;
  priority: number;
  changeFrequency: ChangeFrequency;
};

const STATIC_ROUTES: StaticRoute[] = [
  { pathname: '/', sourceFile: 'page.tsx', priority: 1.0, changeFrequency: 'weekly' },
  { pathname: '/about', sourceFile: 'about/page.tsx', priority: 0.8, changeFrequency: 'monthly' },
  { pathname: '/what-is-a-sales-agent', sourceFile: 'what-is-a-sales-agent/page.tsx', priority: 0.8, changeFrequency: 'monthly' },
  { pathname: '/temporary-rep-cover', sourceFile: 'temporary-rep-cover/page.tsx', priority: 0.9, changeFrequency: 'monthly' },
  { pathname: '/display-solutions', sourceFile: 'display-solutions/page.tsx', priority: 0.8, changeFrequency: 'monthly' },
  { pathname: '/display-solutions/bespoke-confectionery-displays', sourceFile: 'display-solutions/bespoke-confectionery-displays/page.tsx', priority: 0.8, changeFrequency: 'monthly' },
  { pathname: '/contact', sourceFile: 'contact/page.tsx', priority: 0.8, changeFrequency: 'monthly' },
  { pathname: '/privacy', sourceFile: 'privacy/page.tsx', priority: 0.3, changeFrequency: 'yearly' },
  { pathname: '/cookies', sourceFile: 'cookies/page.tsx', priority: 0.3, changeFrequency: 'yearly' },
  { pathname: '/site-index', sourceFile: 'site-index/page.tsx', priority: 0.4, changeFrequency: 'monthly' },
  { pathname: '/blog', sourceFile: 'blog/page.tsx', priority: 0.75, changeFrequency: 'monthly' },
  { pathname: '/recipes', sourceFile: 'recipes/page.tsx', priority: 0.7, changeFrequency: 'monthly' },
];

function getSourceMtime(sourceFile: string): Date {
  try {
    return fs.statSync(path.join(APP_DIR, sourceFile)).mtime;
  } catch {
    return new Date();
  }
}

function getPublicFileMtime(relativePublicPath: string): Date {
  try {
    return fs.statSync(path.join(process.cwd(), 'public', relativePublicPath)).mtime;
  } catch {
    return new Date();
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const urls = new Map<string, MetadataRoute.Sitemap[number]>();

  for (const route of STATIC_ROUTES) {
    urls.set(route.pathname, {
      url: `${SITE_URL}${route.pathname}`,
      lastModified: getSourceMtime(route.sourceFile),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    });
  }

  urls.set('/llms.txt', {
    url: `${SITE_URL}/llms.txt`,
    lastModified: getPublicFileMtime('llms.txt'),
    changeFrequency: 'monthly',
    priority: 0.5,
  });

  const companiesLastModified = getSourceMtime('data/companies.ts');
  for (const company of companies) {
    const pathname = `/companies/${company.slug}`;
    urls.set(pathname, {
      url: `${SITE_URL}${pathname}`,
      lastModified: companiesLastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  const recipesLastModified = getSourceMtime('data/recipes.ts');
  for (const recipe of getAllRecipes()) {
    const pathname = `/recipes/${recipe.slug}`;
    urls.set(pathname, {
      url: `${SITE_URL}${pathname}`,
      lastModified: recipesLastModified,
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
