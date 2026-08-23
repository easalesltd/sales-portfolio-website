import { getCspNonce } from '@/app/lib/csp-nonce';
import { FACEBOOK_PAGE_URL } from '@/app/data/business-entity';
import ContactPageClient from './ContactPageClient';

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': 'https://www.easalesltd.co.uk/contact#contactpage',
  name: 'Contact East Anglian Sales LTD',
  description:
    'Contact Dave Langdon, your Greeting Card and Giftware Sales Agent. Get in touch via phone, email, or request an agent visit.',
  url: 'https://www.easalesltd.co.uk/contact',
  mainEntity: {
    '@type': 'Organization',
    '@id': 'https://www.easalesltd.co.uk/#organization',
    name: 'East Anglian Sales LTD',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '07709197915',
        email: 'dave@easalesltd.co.uk',
        contactType: 'sales',
        areaServed: ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire', 'Hertfordshire'],
        availableLanguage: 'English',
      },
    ],
    sameAs: [
      FACEBOOK_PAGE_URL,
      'https://www.instagram.com/eastangliansalesltd/',
      'https://www.linkedin.com/in/dave-langdon-709a8547',
    ],
  },
};

export default async function ContactPage() {
  const nonce = await getCspNonce();

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactSchema),
        }}
      />
      <ContactPageClient />
    </>
  );
}
