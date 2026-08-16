import {
  HOME_PAGE_META_DESCRIPTION,
} from '@/app/lib/home-page-meta-description';
import { HOME_FAQS, faqJsonLd } from '@/app/data/business-faqs';
import { SITE_URL } from '@/app/data/business-entity';

/**
 * Homepage-only structured data (WebPage, WebSite, BreadcrumbList, FAQPage).
 * FAQ copy must match the visible questions in HomeFaqSection.
 */
export function getHomePageJsonLd() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: 'East Anglian Sales LTD | Dave Langdon — Greeting Card & Gift Sales Agent',
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
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['#home-faq-heading', 'h1'],
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
    faqJsonLd(HOME_FAQS, `${SITE_URL}/#faq`),
  ];
}
