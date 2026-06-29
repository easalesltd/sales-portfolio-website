import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What is a Sales Agent? | East Anglian Sales',
  description:
    'What is a sales agent? Greeting card reps, territories & brands — Dave Langdon, East Anglia: Suffolk, Norfolk, Essex, Cambridgeshire & Hertfordshire. Plain guide.',
  openGraph: {
    title: 'What is a Sales Agent? | East Anglian Sales',
    description:
      'What is a sales agent? Greeting card reps, territories & brands — Dave Langdon, East Anglia: Suffolk, Norfolk, Essex, Cambridgeshire & Hertfordshire. Plain guide.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'East Anglian Sales LTD',
    url: 'https://www.easalesltd.co.uk/what-is-a-sales-agent',
    images: [
      {
        url: 'https://www.easalesltd.co.uk/images/showcase/showcase1.jpeg',
        width: 1200,
        height: 630,
        alt: 'What is a Sales Agent - Greeting Card & Gift Sales | East Anglia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What is a Sales Agent? | East Anglian Sales',
    description:
      'What is a sales agent? Greeting card reps, territories & brands — Dave Langdon, East Anglia: Suffolk, Norfolk, Essex, Cambridgeshire & Hertfordshire. Plain guide.',
    images: ['https://www.easalesltd.co.uk/images/showcase/showcase1.jpeg'],
  },
  alternates: {
    canonical: 'https://www.easalesltd.co.uk/what-is-a-sales-agent',
  },
  other: {
    'geo.region': 'GB-ENG',
    'geo.placename': 'Ipswich, Suffolk',
    'geo.position': '52.2333;0.7167',
    'ICBM': '52.2333, 0.7167',
  },
};
