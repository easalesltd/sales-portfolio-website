import {
  HOME_PAGE_META_DESCRIPTION,
} from '@/app/lib/home-page-meta-description';
import { SITE_URL } from '@/app/data/business-entity';

/**
 * Homepage-only structured data (WebPage, WebSite, BreadcrumbList).
 * Kept out of the root layout so inner routes do not claim to be the homepage.
 * FAQPage lives on `/faq` only — the homepage has no FAQ UI.
 */
export function getHomePageJsonLd() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: 'East Anglian Sales LTD | Dave Langdon — UK Greeting Card Sales Agent | East Anglia',
      description: HOME_PAGE_META_DESCRIPTION,
      inLanguage: 'en-GB',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'East Anglian Sales LTD',
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/showcase/showcase1.jpeg`,
        contentUrl: `${SITE_URL}/images/showcase/showcase1.jpeg`,
        width: 1200,
        height: 630,
      },
      breadcrumb: {
        '@id': `${SITE_URL}/#breadcrumb`,
      },
      about: {
        '@id': `${SITE_URL}/#organization`,
      },
      mainEntity: {
        '@id': `${SITE_URL}/#organization`,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${SITE_URL}/#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_URL,
        },
      ],
    },
  ];
}
