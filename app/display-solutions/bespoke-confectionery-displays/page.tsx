import type { Metadata } from 'next';
import BespokeConfectioneryDisplaysClient from './BespokeConfectioneryDisplaysClient';

export const metadata: Metadata = {
  title:
    'Bespoke Confectionery Displays for Attractions Retailers in East Anglia | East Anglian Sales LTD',
  description:
    'Bespoke confectionery displays and custom-labelled sweets for attractions-style retailers in East Anglia. Choose bespoke labelling or Cambridge branded off-the-shelf display solutions.',
  keywords: [
    'bespoke confectionery displays',
    'custom sweet displays',
    'attractions retail confectionery',
    'attraction gift shop sweets',
    'museum gift shop confectionery displays',
    'zoo gift shop confectionery displays',
    'heritage site gift shop displays',
    'visitor attraction retail displays',
    'East Anglia confectionery displays',
    'Suffolk bespoke confectionery displays',
    'Norfolk bespoke confectionery displays',
    'Essex bespoke confectionery displays',
    'Cambridgeshire confectionery displays',
    'compostable bespoke labels sweets',
    'Cambridge confectionery branded display',
  ],
  alternates: {
    canonical: 'https://www.easalesltd.co.uk/display-solutions/bespoke-confectionery-displays',
  },
  openGraph: {
    title:
      'Bespoke Confectionery Displays for Attractions Retailers in East Anglia | East Anglian Sales LTD',
    description:
      'The go-to bespoke confectionery and display service for attractions-style retailers across East Anglia.',
    url: 'https://www.easalesltd.co.uk/display-solutions/bespoke-confectionery-displays',
    type: 'article',
    locale: 'en_GB',
    siteName: 'East Anglian Sales LTD',
    images: [
      {
        url: 'https://www.easalesltd.co.uk/images/display-solutions/bespoke-confectionery/page-23-asset-1.jpeg',
        width: 1024,
        height: 648,
        alt: 'Bespoke labelling and display options',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bespoke Confectionery Displays | East Anglian Sales LTD',
    description:
      'Bespoke confectionery displays for attractions-style retailers in East Anglia, with bespoke or off-the-shelf routes.',
    images: ['https://www.easalesltd.co.uk/images/display-solutions/bespoke-confectionery/page-23-asset-1.jpeg'],
  },
};

export default function BespokeConfectioneryDisplaysPage() {
  return <BespokeConfectioneryDisplaysClient />;
}
