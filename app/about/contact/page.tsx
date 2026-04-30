import { getCspNonce } from '@/app/lib/csp-nonce';
import AboutContactClient from './AboutContactClient';

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': 'https://www.easalesltd.co.uk/contact#contactpage',
  name: 'Contact Dave Langdon',
  description:
    'Direct contact details for Dave Langdon, sales agent for East Anglian Sales LTD.',
  url: 'https://www.easalesltd.co.uk/contact',
  mainEntity: {
    '@type': 'Person',
    name: 'Dave Langdon',
    alternateName: 'David Langdon',
    telephone: '+447709197915',
    email: 'dave@easalesltd.co.uk',
    sameAs: [
      'https://www.instagram.com/eastangliansalesltd/',
      'https://www.linkedin.com/in/dave-langdon-709a8547',
    ],
  },
};

export default async function AboutContactPage() {
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
      <AboutContactClient />
    </>
  );
}
