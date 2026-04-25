import { getCspNonce } from '@/app/lib/csp-nonce';
import DisplaySolutionsClient from './DisplaySolutionsClient';

const displayBrand = {
  '@type': 'Brand',
  name: 'East Anglian Sales LTD',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness', 'WholesaleStore'],
  '@id': 'https://www.easalesltd.co.uk/display-solutions#organization',
  name: 'East Anglian Sales LTD - Greeting Card Display Solutions',
  description:
    'Professional greeting card display solutions including FREE greeting card spinners, affordable display units, and bespoke wall displays. Expert retail solutions for greeting cards serving Suffolk, Norfolk, Essex, and Cambridgeshire.',
  url: 'https://www.easalesltd.co.uk/display-solutions',
  areaServed: ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire'].map((county) => ({
    '@type': 'State',
    name: county,
    address: {
      '@type': 'PostalAddress',
      addressRegion: county,
      addressCountry: 'GB',
    },
  })),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Greeting Card Display Solutions',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Free Greeting Card Spinners',
          sku: 'eas-display-card-spinner-free',
          image: 'https://www.easalesltd.co.uk/images/display-solutions/Paper Salad Greeting Card FSDU.png',
          brand: displayBrand,
          description:
            'Complimentary greeting card spinners and display units for retailers. Professional quality displays at no cost to qualifying retailers.',
          category: ['Retail Displays', 'Card Spinners', 'Free Displays', 'Greeting Card Solutions'],
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'GBP',
            availability: 'https://schema.org/InStock',
            priceValidUntil: '2027-12-31',
            description: 'Free of charge greeting card spinners for qualifying retailers',
          },
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Affordable Greeting Card Displays',
          sku: 'eas-display-affordable-range',
          image: 'https://www.easalesltd.co.uk/images/display-solutions/Mint Publishing CDU.png',
          brand: displayBrand,
          description:
            'Cost-effective greeting card display solutions for retailers. Quality displays at competitive prices.',
          category: ['Retail Displays', 'Card Spinners', 'Affordable Displays', 'Greeting Card Solutions'],
          offers: {
            '@type': 'Offer',
            priceSpecification: {
              '@type': 'PriceSpecification',
              price: '50',
              priceCurrency: 'GBP',
              minPrice: '50',
              maxPrice: '200',
              priceValidUntil: '2027-12-31',
            },
            availability: 'https://schema.org/InStock',
            description: 'Affordable greeting card display solutions starting from £50',
          },
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Bespoke Greeting Card Wall Displays',
          sku: 'eas-display-bespoke-wall',
          image:
            'https://www.easalesltd.co.uk/images/display-solutions/Ohh Deer Card Wall Display.png',
          brand: displayBrand,
          description:
            'Custom-designed wall displays for greeting cards. Tailored solutions to maximize your retail space and showcase your products effectively.',
          category: ['Retail Displays', 'Wall Displays', 'Bespoke Solutions', 'Greeting Card Solutions'],
          offers: {
            '@type': 'Offer',
            priceSpecification: {
              '@type': 'PriceSpecification',
              price: '200',
              priceCurrency: 'GBP',
              minPrice: '200',
              maxPrice: '1000',
              priceValidUntil: '2027-12-31',
            },
            availability: 'https://schema.org/InStock',
            description:
              'Custom-designed wall displays for greeting cards, tailored to your specific requirements',
          },
        },
      },
    ],
  },
  serviceType: [
    'Greeting Card Display Solutions',
    'Free Card Spinners',
    'Affordable Display Units',
    'Bespoke Wall Displays',
  ],
  makesOffer: [
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Free Greeting Card Display Solutions',
        description: 'Complimentary greeting card spinners and display units for qualifying retailers',
      },
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Affordable Greeting Card Displays',
        description: 'Cost-effective display solutions for greeting cards',
      },
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Bespoke Greeting Card Wall Displays',
        description: 'Custom-designed wall displays for greeting cards',
      },
    },
  ],
};

export default async function DisplaySolutionsPage() {
  const nonce = await getCspNonce();

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <DisplaySolutionsClient />
    </>
  );
}
