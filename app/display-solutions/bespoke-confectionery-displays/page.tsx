import type { Metadata } from 'next';
import BespokeConfectioneryDisplaysClient from './BespokeConfectioneryDisplaysClient';

const PAGE_URL =
  'https://www.easalesltd.co.uk/display-solutions/bespoke-confectionery-displays';

const CCCO_NAME = 'The Cambridge Confectionery Company';

const plasticFreeServiceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Plastic free bespoke confectionery displays and impulse sweet till supply',
  provider: {
    '@type': 'Organization',
    name: CCCO_NAME,
  },
  serviceOperator: {
    '@type': 'Organization',
    name: 'East Anglian Sales LTD',
    url: 'https://www.easalesltd.co.uk',
  },
  areaServed: ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire', 'East Anglia'],
  description:
    'The Cambridge Confectionery Company supplies plastic free impulse sweet till and pick-and-mix displays for attractions and gift shops. Bespoke compostable labels on wood pulp pick-up bags — 50 sweet varieties, compostable in soil. Available in East Anglia through East Anglian Sales LTD.',
  serviceType: [
    'Plastic free confectionery supplier',
    'Impulse sweet till',
    'Pick and mix display',
    'Bespoke confectionery displays',
  ],
  url: PAGE_URL,
};

const plasticFreeFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Are your confectionery pick-up bags plastic free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Sweets are supplied in plastic free wood pulp pick-up bags. They look like conventional plastic but are made from wood pulp and compost in soil.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you supply impulse sweet till displays?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The Cambridge Confectionery Company supplies impulse sweet till and pick-and-mix displays with plastic free bags and bespoke or Cambridge branded labelling, available across East Anglia through East Anglian Sales LTD.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many sweet varieties are available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Cambridge Confectionery Company offers 50 varieties of sweets in plastic free pick-up bags, with bespoke compostable labels or faster Cambridge branded options.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where do you supply plastic free confectionery displays?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Cambridge Confectionery Company supplies the range; East Anglian Sales LTD is the agent covering Suffolk, Norfolk, Essex and Cambridgeshire for museums, heritage sites, visitor attractions, garden centres and destination retail.',
      },
    },
  ],
};

export const metadata: Metadata = {
  title:
    'Plastic Free Bespoke Confectionery Displays & Impulse Sweet Tills | East Anglian Sales LTD',
  description:
    'Bespoke and Cambridge branded confectionery displays from The Cambridge Confectionery Company — plastic free wood pulp bags, compostable labels, impulse sweet tills. Sold in East Anglia via East Anglian Sales LTD.',
  alternates: {
    canonical: 'https://www.easalesltd.co.uk/display-solutions/bespoke-confectionery-displays',
  },
  openGraph: {
    title:
      'Plastic Free Bespoke Confectionery & Impulse Sweet Tills | East Anglian Sales LTD',
    description:
      'The Cambridge Confectionery Company — plastic free impulse sweet till displays, compostable wood pulp bags and bespoke labelling. East Anglia agent: East Anglian Sales LTD.',
    url: 'https://www.easalesltd.co.uk/display-solutions/bespoke-confectionery-displays',
    type: 'article',
    locale: 'en_GB',
    siteName: 'East Anglian Sales LTD',
    images: [
      {
        url: 'https://www.easalesltd.co.uk/images/display-solutions/recent-installs/ely-cathedral-bespoke-sweet-stand.jpg',
        width: 1600,
        height: 1200,
        alt: 'Bespoke sweet display stand installed at Ely Cathedral',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plastic Free Confectionery Displays & Impulse Sweet Tills',
    description:
      'Plastic free pick-up bags, compostable bespoke labels and impulse sweet till displays for East Anglian attractions and gift shops.',
    images: [
      'https://www.easalesltd.co.uk/images/display-solutions/recent-installs/ely-cathedral-bespoke-sweet-stand.jpg',
    ],
  },
};

export default function BespokeConfectioneryDisplaysPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(plasticFreeServiceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(plasticFreeFaqJsonLd) }}
      />
      <BespokeConfectioneryDisplaysClient />
    </>
  );
}
