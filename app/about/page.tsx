import { getCspNonce } from '@/app/lib/csp-nonce';
import AboutPageClient from './AboutPageClient';

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': ['AboutPage', 'Person'],
  '@id': 'https://www.easalesltd.co.uk/about#person',
  name: 'Dave Langdon',
  alternateName: 'David Langdon',
  jobTitle: ['Greeting Card Sales Agent', 'Giftware Sales Agent', 'Sales Agent'],
  description:
    'Dave Langdon is a UK-based professional Greeting Card and Giftware Sales Agent based in Ipswich, Suffolk. With over a decade of experience, Dave serves retailers across East Anglia.',
  url: 'https://www.easalesltd.co.uk/about',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ipswich',
    addressRegion: 'Suffolk',
    addressCountry: 'GB',
  },
  worksFor: {
    '@type': 'Organization',
    '@id': 'https://www.easalesltd.co.uk/#organization',
    name: 'East Anglian Sales LTD',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '07709197915',
    email: 'dave@easalesltd.co.uk',
    contactType: 'sales',
  },
  sameAs: [
    'https://www.instagram.com/eastangliansalesltd/',
    'https://www.linkedin.com/in/dave-langdon-709a8547',
  ],
};

export default async function AboutPage() {
  const nonce = await getCspNonce();

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutSchema),
        }}
      />
      <AboutPageClient />
    </>
  );
}
