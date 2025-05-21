import { Metadata } from 'next'
import Image from 'next/image'
import { companies } from '../../data/companies'
import OrderForm from './OrderForm'
import VideoBackground from '../../components/VideoBackground'
import ImageGallery from '../../components/ImageGallery'

interface Props {
  params: {
    slug: string
  }
}

const counties = ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire'] as const;
type County = typeof counties[number];

function generateCompanyMetadata(company: typeof companies[0]): Metadata {
  // Special handling for Global Journey
  if (company.slug === 'global-journey-gifts') {
    const baseTitle = `Global Journey Spinner Products & Coin Dispenser Machines | East Anglian Sales LTD`;
    const baseDescription = `Official Global Journey spinner products and coin dispenser machines supplier in East Anglia. We supply high-quality spinner displays, £1 coin machines, and interactive retail displays to retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.`;
    
    const locationMetadata = counties.map(county => ({
      title: `Global Journey ${county} Spinner Supplier | Coin Dispenser Machines in ${county}`,
      description: `Looking for Global Journey spinner products and coin dispenser machines in ${county}? We are the official supplier of interactive retail displays, £1 coin machines, and spinner units in ${county}. Contact us for trade prices and local delivery.`,
      keywords: [
        `Global Journey spinner ${county}`,
        `coin dispenser machines ${county}`,
        `£1 coin machines ${county}`,
        `spinner displays ${county}`,
        `interactive retail displays ${county}`,
        `${county} spinner supplier`,
        `coin vend machines ${county}`,
        `retail display solutions ${county}`,
        `spinner trade prices ${county}`,
        `${county} coin machine distributor`,
        `spinner local supplier ${county}`,
        `coin dispenser retailer supplier ${county}`,
        `spinner wholesale prices ${county}`,
        `coin machine trade account ${county}`,
        `spinner units wholesale ${county}`,
        `coin vend wholesale ${county}`,
        `retail display solutions wholesale ${county}`,
        `interactive displays ${county}`
      ]
    }));

    return {
      title: baseTitle,
      description: baseDescription,
      keywords: [
        ...locationMetadata.flatMap(m => m.keywords),
        'Global Journey spinner wholesale',
        'coin dispenser machines supplier',
        'spinner products distributor',
        'coin machine trade prices',
        'spinner wholesale prices',
        'interactive displays supplier',
        'East Anglia spinner wholesale',
        'East Anglian coin machine supplier',
        'local spinner supplier',
        '£1 coin machines wholesale',
        'spinner displays trade prices',
        'coin vend machines wholesale',
        'retail display solutions trade',
        'spinner products East Anglia',
        'coin dispenser wholesaler UK',
        'interactive retail displays supplier'
      ],
      openGraph: {
        title: baseTitle,
        description: baseDescription,
        type: 'website',
        locale: 'en_GB',
        siteName: 'East Anglian Sales LTD',
        images: [
          {
            url: company.logoUrl,
            width: 800,
            height: 600,
            alt: 'Global Journey spinner products and coin dispenser machines'
          }
        ]
      },
      alternates: {
        canonical: `https://www.easalesltd.co.uk/companies/global-journey-gifts`
      },
      robots: {
        index: true,
        follow: true
      }
    };
  }

  // Special handling for David Fischhoff
  if (company.slug === 'david-fischhoff') {
    const baseTitle = `David Fischhoff Memorial & Graveside Supplier | East Anglian Sales LTD`;
    const baseDescription = `Official David Fischhoff memorial and graveside supplier in East Anglia. We supply high-quality memorial vases, urns, and gravestone accessories to retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.`;
    
    const locationMetadata = counties.map(county => ({
      title: `David Fischhoff ${county} Memorial Supplier | Graveside Products in ${county}`,
      description: `Looking for David Fischhoff memorial products in ${county}? We are the official supplier of memorial vases, urns, and gravestone accessories in ${county}. Contact us for trade prices and local delivery.`,
      keywords: [
        `David Fischhoff memorial ${county}`,
        `David Fischhoff graveside ${county}`,
        `memorial vases ${county}`,
        `gravestone accessories ${county}`,
        `memorial urns ${county}`,
        `${county} memorial supplier`,
        `memorial wholesaler ${county}`,
        `graveside products ${county}`,
        `memorial trade prices ${county}`,
        `${county} memorial distributor`,
        `memorial local supplier ${county}`,
        `memorial retailer supplier ${county}`,
        `memorial wholesale prices ${county}`,
        `memorial trade account ${county}`,
        `mum gravestones ${county}`,
        `memorial vases wholesale ${county}`,
        `memorial urns wholesale ${county}`,
        `gravestone accessories wholesale ${county}`
      ]
    }));

    return {
      title: baseTitle,
      description: baseDescription,
      keywords: [
        ...locationMetadata.flatMap(m => m.keywords),
        'David Fischhoff memorial wholesale',
        'memorial vases supplier',
        'graveside products distributor',
        'memorial trade prices',
        'memorial wholesale prices',
        'memorial products supplier',
        'East Anglia memorial wholesale',
        'East Anglian memorial supplier',
        'local memorial supplier',
        'mum gravestones wholesale',
        'memorial vases trade prices',
        'memorial urns wholesale',
        'gravestone accessories trade',
        'memorial products East Anglia',
        'memorial wholesaler UK',
        'graveside products supplier'
      ],
      openGraph: {
        title: baseTitle,
        description: baseDescription,
        type: 'website',
        locale: 'en_GB',
        siteName: 'East Anglian Sales LTD',
        images: [
          {
            url: company.logoUrl,
            width: 800,
            height: 600,
            alt: 'David Fischhoff memorial and graveside products'
          }
        ]
      },
      alternates: {
        canonical: `https://www.easalesltd.co.uk/companies/david-fischhoff`
      },
      robots: {
        index: true,
        follow: true
      }
    };
  }

  // Special handling for Museums and Galleries
  if (company.slug === 'museums-and-galleries') {
    const baseTitle = `Museums and Galleries Sale or Return Christmas Cards | Charity Cards Wholesale`;
    const baseDescription = `Official Museums and Galleries sale or return Christmas cards supplier in East Anglia. We supply charity Christmas cards, licensed art cards, and sale or return greeting cards to retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.`;
    
    const locationMetadata = counties.map(county => ({
      title: `Museums and Galleries ${county} Sale or Return Cards | Charity Christmas Cards in ${county}`,
      description: `Looking for sale or return Christmas cards in ${county}? We are the official supplier of Museums and Galleries charity Christmas cards and licensed art cards in ${county}. Contact us for trade prices and local delivery.`,
      keywords: [
        `Museums and Galleries ${county}`,
        `Museums and Galleries ${county} wholesaler`,
        `sale or return Christmas cards ${county}`,
        `charity Christmas cards ${county}`,
        `licensed art cards ${county}`,
        `${county} Museums and Galleries distributor`,
        `Museums and Galleries local supplier ${county}`,
        `sale or return cards trade prices ${county}`,
        `${county} wholesale Museums and Galleries`,
        `charity cards retailer supplier ${county}`,
        `${county} Museums and Galleries wholesale prices`,
        `licensed art greeting cards ${county}`,
        `design-led stationery ${county}`,
        `art cards wholesale ${county}`,
        `Museums and Galleries trade account ${county}`,
        `sale or return greeting cards ${county}`,
        `charity Christmas cards wholesale ${county}`,
        `licensed art Christmas cards ${county}`,
        `sale or return cards distributor ${county}`,
        `charity cards trade prices ${county}`,
        `sale or return cards supplier ${county}`,
        `charity Christmas cards supplier ${county}`
      ]
    }));

    return {
      title: baseTitle,
      description: baseDescription,
      keywords: [
        ...locationMetadata.flatMap(m => m.keywords),
        'Museums and Galleries wholesale',
        'sale or return Christmas cards',
        'charity Christmas cards wholesale',
        'licensed art cards supplier',
        'Museums and Galleries distributor',
        'sale or return cards trade prices',
        'charity cards wholesale prices',
        'licensed greeting cards supplier',
        'East Anglia art cards wholesale',
        'East Anglian licensed art supplier',
        'local art cards wholesale supplier',
        'sale or return greeting cards',
        'charity Christmas cards supplier',
        'licensed art Christmas cards',
        'sale or return cards distributor',
        'charity cards trade prices',
        'sale or return cards supplier',
        'charity Christmas cards East Anglia',
        'sale or return cards UK',
        'charity cards wholesale UK'
      ],
      openGraph: {
        title: baseTitle,
        description: baseDescription,
        type: 'website',
        locale: 'en_GB',
        siteName: 'East Anglian Sales LTD',
        images: [
          {
            url: company.logoUrl,
            width: 800,
            height: 600,
            alt: 'Museums and Galleries sale or return and charity Christmas cards'
          }
        ]
      },
      alternates: {
        canonical: `https://www.easalesltd.co.uk/companies/museums-and-galleries`
      },
      robots: {
        index: true,
        follow: true
      }
    };
  }

  // Special handling for Emotional Rescue
  if (company.slug === 'emotional-rescue') {
    const baseTitle = `Emotional Rescue | Alternative to Rosie Made A Thing | Wholesale Cards & Gifts`;
    const baseDescription = `Official Emotional Rescue wholesale supplier in East Anglia. We supply unique, humorous greeting cards and gifts - a great alternative to Rosie Made A Thing. Available for retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.`;
    
    const locationMetadata = counties.map(county => ({
      title: `Emotional Rescue ${county} | Alternative to Rosie Made A Thing | Wholesale Cards in ${county}`,
      description: `Looking for unique greeting cards in ${county}? Emotional Rescue offers humorous cards and gifts similar to Rosie Made A Thing. We are the official supplier of alternative greeting cards in ${county}. Contact us for trade prices and local delivery.`,
      keywords: [
        `Emotional Rescue ${county}`,
        `Emotional Rescue ${county} wholesaler`,
        `alternative to Rosie Made A Thing ${county}`,
        `humorous greeting cards ${county}`,
        `unique greeting cards ${county}`,
        `${county} Emotional Rescue distributor`,
        `Emotional Rescue local supplier ${county}`,
        `humorous cards trade prices ${county}`,
        `${county} wholesale Emotional Rescue`,
        `alternative cards retailer supplier ${county}`,
        `${county} Emotional Rescue wholesale prices`,
        `humorous greeting cards ${county}`,
        `unique gift cards ${county}`,
        `alternative cards wholesale ${county}`,
        `Emotional Rescue trade account ${county}`,
        `similar to Rosie Made A Thing ${county}`,
        `alternative greeting cards ${county}`,
        `humorous cards wholesale ${county}`,
        `unique cards distributor ${county}`,
        `alternative cards trade prices ${county}`,
        `humorous cards supplier ${county}`,
        `unique greeting cards supplier ${county}`
      ]
    }));

    return {
      title: baseTitle,
      description: baseDescription,
      keywords: [
        ...locationMetadata.flatMap(m => m.keywords),
        'Emotional Rescue wholesale',
        'alternative to Rosie Made A Thing',
        'humorous greeting cards wholesale',
        'unique greeting cards supplier',
        'Emotional Rescue distributor',
        'humorous cards trade prices',
        'alternative cards wholesale prices',
        'unique greeting cards supplier',
        'East Anglia humorous cards wholesale',
        'East Anglian alternative cards supplier',
        'local humorous cards wholesale supplier',
        'alternative greeting cards',
        'humorous cards supplier',
        'unique greeting cards',
        'alternative cards distributor',
        'humorous cards trade prices',
        'unique cards supplier',
        'alternative greeting cards East Anglia',
        'humorous cards UK',
        'unique greeting cards wholesale UK',
        'similar to Rosie Made A Thing',
        'alternative to Rosie Made A Thing cards',
        'humorous cards like Rosie Made A Thing',
        'unique greeting cards alternative'
      ],
      openGraph: {
        title: baseTitle,
        description: baseDescription,
        type: 'website',
        locale: 'en_GB',
        siteName: 'East Anglian Sales LTD',
        images: [
          {
            url: company.logoUrl,
            width: 800,
            height: 600,
            alt: 'Emotional Rescue - Alternative to Rosie Made A Thing - Humorous Greeting Cards'
          }
        ]
      },
      alternates: {
        canonical: `https://www.easalesltd.co.uk/companies/emotional-rescue`
      },
      robots: {
        index: true,
        follow: true
      }
    };
  }

  // Special handling for Ohh Deer wholesale
  if (company.slug === 'ohh-deer-wholesale') {
    const baseTitle = `Ohh Deer A6 Greeting Card Spinners & Displays | Wholesale Card Solutions`;
    const baseDescription = `Official Ohh Deer wholesale supplier in East Anglia. We supply A6 greeting card spinners, display units, and card racks to retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.`;
    
    const locationMetadata = counties.map(county => ({
      title: `Ohh Deer ${county} A6 Card Spinners | Greeting Card Displays in ${county}`,
      description: `Looking for A6 greeting card spinners in ${county}? We are the official Ohh Deer supplier of card display units, spinners, and racks in ${county}. Contact us for trade prices and local delivery.`,
      keywords: [
        `Ohh Deer ${county}`,
        `Ohh Deer ${county} wholesaler`,
        `A6 greeting card spinners ${county}`,
        `card display units ${county}`,
        `greeting card racks ${county}`,
        `${county} Ohh Deer distributor`,
        `Ohh Deer local supplier ${county}`,
        `card spinner trade prices ${county}`,
        `${county} wholesale Ohh Deer`,
        `card display retailer supplier ${county}`,
        `${county} Ohh Deer wholesale prices`,
        `A6 card spinners ${county}`,
        `greeting card displays ${county}`,
        `card racks wholesale ${county}`,
        `Ohh Deer trade account ${county}`,
        `A6 card spinner units ${county}`,
        `greeting card display solutions ${county}`,
        `card spinner wholesale ${county}`,
        `A6 display units distributor ${county}`,
        `card rack trade prices ${county}`,
        `spinner display supplier ${county}`,
        `A6 greeting card racks supplier ${county}`
      ]
    }));

    return {
      title: baseTitle,
      description: baseDescription,
      keywords: [
        ...locationMetadata.flatMap(m => m.keywords),
        'Ohh Deer wholesale',
        'A6 greeting card spinners',
        'card display units wholesale',
        'greeting card racks supplier',
        'Ohh Deer distributor',
        'card spinner trade prices',
        'A6 display wholesale prices',
        'greeting card spinners supplier',
        'East Anglia card displays wholesale',
        'East Anglian spinner supplier',
        'local card display wholesale supplier',
        'A6 greeting card spinners',
        'card display units supplier',
        'greeting card racks',
        'A6 spinner distributor',
        'card display trade prices',
        'greeting card spinner supplier',
        'A6 card displays East Anglia',
        'card spinners UK',
        'greeting card racks wholesale UK',
        'A6 card spinner units',
        'greeting card display solutions',
        'card spinner wholesale',
        'A6 display units wholesale'
      ],
      openGraph: {
        title: baseTitle,
        description: baseDescription,
        type: 'website',
        locale: 'en_GB',
        siteName: 'East Anglian Sales LTD',
        images: [
          {
            url: company.logoUrl,
            width: 800,
            height: 600,
            alt: 'Ohh Deer A6 Greeting Card Spinners and Display Units'
          }
        ]
      },
      alternates: {
        canonical: `https://www.easalesltd.co.uk/companies/ohh-deer-wholesale`
      },
      robots: {
        index: true,
        follow: true
      }
    };
  }

  // Default metadata generation for other companies
  const baseTitle = `${company.name} Wholesale Supplier | East Anglian Sales LTD`;
  const baseDescription = `${company.name} wholesale products available across East Anglia. ${company.description}`;
  
  // Generate location-specific metadata
  const locationMetadata = counties.map(county => ({
    title: `${company.name} ${county} Wholesaler | Local Supplier in ${county}`,
    description: `Looking for ${company.name} wholesale products in ${county}? We supply ${company.name.toLowerCase()} to retailers across ${county}. ${company.description}`,
    keywords: [
      `${company.name} ${county}`,
      `${company.name} ${county} wholesaler`,
      `${company.name} ${county} supplier`,
      `${company.name} wholesale ${county}`,
      `${county} ${company.name} distributor`,
      `${company.name} local supplier ${county}`,
      `${company.name} trade prices ${county}`,
      `${county} wholesale ${company.name}`,
      `${company.name} retailer supplier ${county}`,
      `${county} ${company.name} wholesale prices`
    ]
  }));

  return {
    title: baseTitle,
    description: baseDescription,
    keywords: [
      ...locationMetadata.flatMap(m => m.keywords),
      `${company.name} wholesale`,
      `${company.name} supplier`,
      `${company.name} distributor`,
      `${company.name} trade prices`,
      `${company.name} wholesale prices`,
      `${company.name} retailer supplier`,
      'East Anglia wholesale',
      'East Anglian supplier',
      'local wholesale supplier'
    ],
    openGraph: {
      title: baseTitle,
      description: baseDescription,
      type: 'website',
      locale: 'en_GB',
      siteName: 'East Anglian Sales LTD',
      images: [
        {
          url: company.logoUrl,
          width: 800,
          height: 600,
          alt: `${company.name} logo`
        }
      ]
    },
    alternates: {
      canonical: `https://www.easalesltd.co.uk/companies/${company.slug}`
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

function generateStructuredData(company: typeof companies[0]) {
  const counties = ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire'];
  
  // Special handling for Global Journey
  if (company.slug === 'global-journey-gifts') {
    return {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'LocalBusiness', 'WholesaleStore'],
      '@id': `https://www.easalesltd.co.uk/companies/global-journey-gifts#organization`,
      'name': 'Global Journey Spinner Products & Coin Dispenser Machines',
      'description': 'Official Global Journey spinner products and coin dispenser machines supplier in East Anglia. We supply high-quality spinner displays, £1 coin machines, and interactive retail displays to retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.',
      'url': 'https://www.easalesltd.co.uk/companies/global-journey-gifts',
      'logo': {
        '@type': 'ImageObject',
        'url': `https://www.easalesltd.co.uk${company.logoUrl}`,
        'width': '800',
        'height': '600'
      },
      'areaServed': counties.map(county => ({
        '@type': 'State',
        'name': county,
        'address': {
          '@type': 'PostalAddress',
          'addressRegion': county,
          'addressCountry': 'GB'
        }
      })),
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name': 'Global Journey Retail Display Solutions',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Spinner Displays',
              'description': 'High-quality spinner displays for retail use.',
              'brand': {
                '@type': 'Brand',
                'name': 'Global Journey'
              },
              'category': ['Retail Displays', 'Spinner Products', 'Interactive Displays']
            },
            'areaServed': counties.map(county => ({
              '@type': 'State',
              'name': county
            }))
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Coin Dispenser Machines',
              'description': '£1 coin machines and coin vend units for retail.',
              'brand': {
                '@type': 'Brand',
                'name': 'Global Journey'
              },
              'category': ['Retail Displays', 'Coin Machines', 'Vending Solutions']
            },
            'areaServed': counties.map(county => ({
              '@type': 'State',
              'name': county
            }))
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Interactive Retail Displays',
              'description': 'Interactive display solutions for retail environments.',
              'brand': {
                '@type': 'Brand',
                'name': 'Global Journey'
              },
              'category': ['Retail Displays', 'Interactive Solutions', 'Display Units']
            },
            'areaServed': counties.map(county => ({
              '@type': 'State',
              'name': county
            }))
          }
        ],
        'availability': 'https://schema.org/InStock',
        'priceSpecification': {
          '@type': 'PriceSpecification',
          'priceType': 'https://schema.org/Wholesale'
        }
      },
      'makesOffer': counties.map(county => ({
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Product',
          'name': `Global Journey Retail Display Solutions in ${county}`,
          'description': `Official Global Journey spinner products and coin dispenser machines supplier in ${county}. Spinner displays, £1 coin machines, and interactive retail displays available for retailers.`
        },
        'areaServed': {
          '@type': 'State',
          'name': county
        }
      }))
    };
  }

  // Special handling for David Fischhoff
  if (company.slug === 'david-fischhoff') {
    return {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'LocalBusiness', 'WholesaleStore'],
      '@id': `https://www.easalesltd.co.uk/companies/david-fischhoff#organization`,
      'name': 'David Fischhoff Memorial & Graveside Supplier',
      'description': 'Official David Fischhoff memorial and graveside supplier in East Anglia. We supply high-quality memorial vases, urns, and gravestone accessories to retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.',
      'url': 'https://www.easalesltd.co.uk/companies/david-fischhoff',
      'logo': {
        '@type': 'ImageObject',
        'url': `https://www.easalesltd.co.uk${company.logoUrl}`,
        'width': '800',
        'height': '600'
      },
      'areaServed': counties.map(county => ({
        '@type': 'State',
        'name': county,
        'address': {
          '@type': 'PostalAddress',
          'addressRegion': county,
          'addressCountry': 'GB'
        }
      })),
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name': 'David Fischhoff Memorial Products',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Memorial Vases',
              'description': 'High-quality memorial vases for graveside use.',
              'brand': {
                '@type': 'Brand',
                'name': 'David Fischhoff'
              },
              'category': ['Memorial Products', 'Graveside Accessories', 'Vases']
            },
            'areaServed': counties.map(county => ({
              '@type': 'State',
              'name': county
            }))
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Memorial Urns',
              'description': 'Elegant memorial urns for graveside use.',
              'brand': {
                '@type': 'Brand',
                'name': 'David Fischhoff'
              },
              'category': ['Memorial Products', 'Graveside Accessories', 'Urns']
            },
            'areaServed': counties.map(county => ({
              '@type': 'State',
              'name': county
            }))
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Gravestone Accessories',
              'description': 'Quality gravestone accessories and memorial products.',
              'brand': {
                '@type': 'Brand',
                'name': 'David Fischhoff'
              },
              'category': ['Memorial Products', 'Graveside Accessories', 'Gravestone Products']
            },
            'areaServed': counties.map(county => ({
              '@type': 'State',
              'name': county
            }))
          }
        ],
        'availability': 'https://schema.org/InStock',
        'priceSpecification': {
          '@type': 'PriceSpecification',
          'priceType': 'https://schema.org/Wholesale'
        }
      },
      'makesOffer': counties.map(county => ({
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Product',
          'name': `David Fischhoff Memorial Products in ${county}`,
          'description': `Official David Fischhoff memorial and graveside supplier in ${county}. Memorial vases, urns, and gravestone accessories available for retailers.`
        },
        'areaServed': {
          '@type': 'State',
          'name': county
        }
      }))
    };
  }

  // Special handling for Museums and Galleries
  if (company.slug === 'museums-and-galleries') {
    return {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'LocalBusiness', 'WholesaleStore'],
      '@id': `https://www.easalesltd.co.uk/companies/museums-and-galleries#organization`,
      'name': 'Museums and Galleries Sale or Return Christmas Cards',
      'description': 'Official Museums and Galleries sale or return Christmas cards supplier in East Anglia. We supply charity Christmas cards, licensed art cards, and sale or return greeting cards to retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.',
      'url': 'https://www.easalesltd.co.uk/companies/museums-and-galleries',
      'logo': {
        '@type': 'ImageObject',
        'url': `https://www.easalesltd.co.uk${company.logoUrl}`,
        'width': '800',
        'height': '600'
      },
      'areaServed': counties.map(county => ({
        '@type': 'State',
        'name': county,
        'address': {
          '@type': 'PostalAddress',
          'addressRegion': county,
          'addressCountry': 'GB'
        }
      })),
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name': 'Museums and Galleries Christmas Cards',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Sale or Return Christmas Cards',
              'description': 'High-quality sale or return Christmas cards from Museums and Galleries.',
              'brand': {
                '@type': 'Brand',
                'name': 'Museums and Galleries'
              },
              'category': ['Greeting Cards', 'Christmas Cards', 'Sale or Return', 'Licensed Products']
            },
            'areaServed': counties.map(county => ({
              '@type': 'State',
              'name': county
            }))
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Charity Christmas Cards',
              'description': 'Charity Christmas cards and licensed art cards.',
              'brand': {
                '@type': 'Brand',
                'name': 'Museums and Galleries'
              },
              'category': ['Greeting Cards', 'Christmas Cards', 'Charity Cards', 'Licensed Products']
            },
            'areaServed': counties.map(county => ({
              '@type': 'State',
              'name': county
            }))
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Licensed Art Cards',
              'description': 'Licensed art and design-led greeting cards.',
              'brand': {
                '@type': 'Brand',
                'name': 'Museums and Galleries'
              },
              'category': ['Greeting Cards', 'Art Cards', 'Licensed Products', 'Design-led Stationery']
            },
            'areaServed': counties.map(county => ({
              '@type': 'State',
              'name': county
            }))
          }
        ],
        'availability': 'https://schema.org/InStock',
        'priceSpecification': {
          '@type': 'PriceSpecification',
          'priceType': 'https://schema.org/Wholesale'
        }
      },
      'makesOffer': counties.map(county => ({
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Product',
          'name': `Museums and Galleries Sale or Return Christmas Cards in ${county}`,
          'description': `Official Museums and Galleries sale or return Christmas cards supplier in ${county}. Charity Christmas cards and licensed art cards available for retailers.`
        },
        'areaServed': {
          '@type': 'State',
          'name': county
        }
      }))
    };
  }

  // Special handling for Emotional Rescue
  if (company.slug === 'emotional-rescue') {
    return {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'LocalBusiness', 'WholesaleStore'],
      '@id': `https://www.easalesltd.co.uk/companies/emotional-rescue#organization`,
      'name': 'Emotional Rescue - Alternative to Rosie Made A Thing',
      'description': 'Official Emotional Rescue wholesale supplier in East Anglia. We supply unique, humorous greeting cards and gifts - a great alternative to Rosie Made A Thing. Available for retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.',
      'url': 'https://www.easalesltd.co.uk/companies/emotional-rescue',
      'logo': {
        '@type': 'ImageObject',
        'url': `https://www.easalesltd.co.uk${company.logoUrl}`,
        'width': '800',
        'height': '600'
      },
      'areaServed': counties.map(county => ({
        '@type': 'State',
        'name': county,
        'address': {
          '@type': 'PostalAddress',
          'addressRegion': county,
          'addressCountry': 'GB'
        }
      })),
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name': 'Emotional Rescue Humorous Cards & Gifts',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Humorous Greeting Cards',
              'description': 'Unique and humorous greeting cards - a great alternative to Rosie Made A Thing.',
              'brand': {
                '@type': 'Brand',
                'name': 'Emotional Rescue'
              },
              'category': ['Greeting Cards', 'Humorous Cards', 'Alternative Cards', 'Gift Cards']
            },
            'areaServed': counties.map(county => ({
              '@type': 'State',
              'name': county
            }))
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Alternative Gift Cards',
              'description': 'Unique gift cards and humorous stationery.',
              'brand': {
                '@type': 'Brand',
                'name': 'Emotional Rescue'
              },
              'category': ['Greeting Cards', 'Gift Cards', 'Alternative Cards', 'Humorous Stationery']
            },
            'areaServed': counties.map(county => ({
              '@type': 'State',
              'name': county
            }))
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Unique Greeting Cards',
              'description': 'Alternative greeting cards and humorous designs.',
              'brand': {
                '@type': 'Brand',
                'name': 'Emotional Rescue'
              },
              'category': ['Greeting Cards', 'Alternative Cards', 'Unique Designs', 'Humorous Cards']
            },
            'areaServed': counties.map(county => ({
              '@type': 'State',
              'name': county
            }))
          }
        ],
        'availability': 'https://schema.org/InStock',
        'priceSpecification': {
          '@type': 'PriceSpecification',
          'priceType': 'https://schema.org/Wholesale'
        }
      },
      'makesOffer': counties.map(county => ({
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Product',
          'name': `Emotional Rescue Humorous Cards in ${county}`,
          'description': `Official Emotional Rescue wholesale supplier in ${county}. Alternative to Rosie Made A Thing - unique and humorous greeting cards available for retailers.`
        },
        'areaServed': {
          '@type': 'State',
          'name': county
        }
      }))
    };
  }

  // Special handling for Ohh Deer wholesale
  if (company.slug === 'ohh-deer-wholesale') {
    return {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'LocalBusiness', 'WholesaleStore'],
      '@id': `https://www.easalesltd.co.uk/companies/ohh-deer-wholesale#organization`,
      'name': 'Ohh Deer A6 Greeting Card Spinners & Displays',
      'description': 'Official Ohh Deer wholesale supplier in East Anglia. We supply A6 greeting card spinners, display units, and card racks to retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.',
      'url': 'https://www.easalesltd.co.uk/companies/ohh-deer-wholesale',
      'logo': {
        '@type': 'ImageObject',
        'url': `https://www.easalesltd.co.uk${company.logoUrl}`,
        'width': '800',
        'height': '600'
      },
      'areaServed': counties.map(county => ({
        '@type': 'State',
        'name': county,
        'address': {
          '@type': 'PostalAddress',
          'addressRegion': county,
          'addressCountry': 'GB'
        }
      })),
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name': 'Ohh Deer Card Display Solutions',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'A6 Greeting Card Spinners',
              'description': 'High-quality A6 greeting card spinners and display units.',
              'brand': {
                '@type': 'Brand',
                'name': 'Ohh Deer'
              },
              'category': ['Retail Displays', 'Card Spinners', 'A6 Displays', 'Greeting Card Solutions']
            },
            'areaServed': counties.map(county => ({
              '@type': 'State',
              'name': county
            }))
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Card Display Units',
              'description': 'Professional card display units and racks for retail.',
              'brand': {
                '@type': 'Brand',
                'name': 'Ohh Deer'
              },
              'category': ['Retail Displays', 'Card Racks', 'Display Units', 'Greeting Card Solutions']
            },
            'areaServed': counties.map(county => ({
              '@type': 'State',
              'name': county
            }))
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Greeting Card Racks',
              'description': 'Specialized greeting card racks and display solutions.',
              'brand': {
                '@type': 'Brand',
                'name': 'Ohh Deer'
              },
              'category': ['Retail Displays', 'Card Racks', 'Greeting Card Solutions', 'Display Units']
            },
            'areaServed': counties.map(county => ({
              '@type': 'State',
              'name': county
            }))
          }
        ],
        'availability': 'https://schema.org/InStock',
        'priceSpecification': {
          '@type': 'PriceSpecification',
          'priceType': 'https://schema.org/Wholesale'
        }
      },
      'makesOffer': counties.map(county => ({
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Product',
          'name': `Ohh Deer A6 Card Spinners in ${county}`,
          'description': `Official Ohh Deer wholesale supplier in ${county}. A6 greeting card spinners, display units, and card racks available for retailers.`
        },
        'areaServed': {
          '@type': 'State',
          'name': county
        }
      }))
    };
  }

  // Default structured data for other companies
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `https://www.easalesltd.co.uk/companies/${company.slug}#organization`,
    'name': `${company.name} Wholesale Supplier`,
    'description': `${company.name} wholesale products available across East Anglia. ${company.description}`,
    'url': `https://www.easalesltd.co.uk/companies/${company.slug}`,
    'logo': {
      '@type': 'ImageObject',
      'url': `https://www.easalesltd.co.uk${company.logoUrl}`,
      'width': '800',
      'height': '600'
    },
    'areaServed': counties.map(county => ({
      '@type': 'State',
      'name': county,
      'address': {
        '@type': 'PostalAddress',
        'addressRegion': county,
        'addressCountry': 'GB'
      }
    })),
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': `${company.name} Product Catalog`,
      'itemListElement': {
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Product',
          'name': company.name,
          'description': company.description,
          'brand': {
            '@type': 'Brand',
            'name': company.name
          }
        },
        'areaServed': counties.map(county => ({
          '@type': 'State',
          'name': county
        }))
      }
    }
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const company = companies.find((c) => c.slug === params.slug);
  if (!company) {
    return {
      title: 'Company Not Found',
      description: 'The requested company page could not be found.'
    };
  }
  return generateCompanyMetadata(company);
}

export async function generateStaticParams() {
  return companies.map((company) => ({
    slug: company.slug,
  }))
}

export default async function CompanyPage({ params }: Props) {
  const company = companies.find((c) => c.slug === params.slug)

  if (!company) {
    return <div>Company not found</div>
  }

  // Add structured data script
  const structuredData = generateStructuredData(company);

  const hasVideoBackground = [
    'museums-and-galleries', 
    'paper-salad', 
    'ohh-deer-wholesale',
    'boxer-gifts',
    'emotional-rescue',
    'peppermint-grove',
    'mint-publishing'
  ].includes(params.slug);

  const paperSaladImages = params.slug === 'paper-salad' ? [
    '/images/companies/paper-salad/IMG_0670_copy_bdc70bf1-59fc-476e-9c6d-bf96f508ee40_1500x.jpeg',
    '/images/companies/paper-salad/43a8e5ac-f223-4213-a4ca-c0c7d53aed48_1500x.jpeg',
    '/images/companies/paper-salad/Birthday_Collection_copy_1500x.jpeg'
  ] : [];

  const emotionalRescueImages = params.slug === 'emotional-rescue' ? [
    '/images/companies/emotional-rescue/336207-IMG_3646-copy.jpeg',
    '/images/companies/emotional-rescue/emo_web.jpeg',
    '/images/companies/emotional-rescue/81J8YSOEzoL.jpeg',
    '/images/companies/emotional-rescue/519NuytaJ1L.jpeg',
    '/images/companies/emotional-rescue/613nPYonKsL.jpeg',
    '/images/companies/emotional-rescue/EMZFPW11768_600x.jpeg',
    '/images/companies/emotional-rescue/EMZFPW11770_600x.jpeg'
  ] : [];

  const museumsAndGalleriesImages = params.slug === 'museums-and-galleries' ? [
    '/images/companies/museums-and-galleries/7d55e712-89d5-448b-aa75-f4cec8b7cf87.jpeg',
    '/images/companies/museums-and-galleries/6c27d66e-3695-49a1-b4a4-d7967106679b.jpeg',
    '/images/companies/museums-and-galleries/cc0ff00f-b373-4a7f-ae5c-fa1e61f846fa.jpeg',
    '/images/companies/museums-and-galleries/ed555a28-c3ea-4cd8-b056-3a0dfebb2890.jpeg',
    '/images/companies/museums-and-galleries/4a44abec-ce62-4e46-878b-8cbad6b03da2.jpeg',
    '/images/companies/museums-and-galleries/f13f19a1-1349-4e84-89d5-e6ffe231f308.jpeg',
    '/images/companies/museums-and-galleries/1b4833b0-54b9-4457-95fb-7b94df0b0389.jpeg',
    '/images/companies/museums-and-galleries/59a26b7f-162c-454e-9efd-c483fae2ecfa.jpeg'
  ] : [];

  const starEditionsImages = params.slug === 'star-editions' ? [
    '/images/companies/star-editions/Stephen-Millership.jpeg',
    '/images/companies/star-editions/stick_man.jpeg',
    '/images/companies/star-editions/ZOG011.jpeg',
    '/images/companies/star-editions/jimmy_medium.jpeg',
    '/images/companies/star-editions/BRIGGS_DESKTOP.jpeg'
  ] : [];

  const peppermintGroveImages = params.slug === 'peppermint-grove' ? [
    '/images/companies/peppermint-grove/PGA_Uk_Diffuser_Category_d8e301ee-42b8-4ef0-9d68-5221f68c83b3.jpeg',
    '/images/companies/peppermint-grove/PGA_Uk_Candle_engraving_14e985bb-cf2d-43af-917f-773eea41e718.jpeg',
    '/images/companies/peppermint-grove/PGA_UK_Bath_Category_8c6ce571-33e1-42dc-b009-dd680a331094.jpeg',
    '/images/companies/peppermint-grove/LargeCandle370g-Oceania.png',
    '/images/companies/peppermint-grove/LargeCandle370g-Gardenia_4beb7369-9a18-4fcb-ad6a-4bdb7ac5c45e.png',
    '/images/companies/peppermint-grove/LargeDiffuser350ml-Camellia_WhiteLotus.png',
    '/images/companies/peppermint-grove/PGA_CoreMarch2024_51000x1000_3bf423a2-0ab0-4355-8797-fd0fe31961fb_400x.jpeg',
    '/images/companies/peppermint-grove/PGACore6_2059e7fb-a309-4078-a054-f9118e8a4a93_400x.jpeg',
    '/images/companies/peppermint-grove/New_Arrivals_65e95d71-0d66-43a3-abf2-f1eff2913b3f.jpg'
  ] : [];

  const boxerGiftsImages = params.slug === 'boxer-gifts' ? [
    '/images/companies/boxer-gifts/OT2075_a70b.webp',
    '/images/companies/boxer-gifts/CO1012___MR_GOOD_LOOKIN__APRON___34_49a0.webp',
    '/images/companies/boxer-gifts/MU3131_4d24.webp',
    '/images/companies/boxer-gifts/YHU0838_Grumpy_Git_9b56.webp',
    '/images/companies/boxer-gifts/Untitled_550_550_px_4_.png'
  ] : [];

  const davidFischhoffImages = params.slug === 'david-fischhoff' ? [
    '/images/companies/david-fischhoff/36.jpeg',
    '/images/companies/david-fischhoff/695.jpeg',
    '/images/companies/david-fischhoff/68.jpeg',
    '/images/companies/david-fischhoff/13.jpeg',
    '/images/companies/david-fischhoff/67.jpeg'
  ] : [];

  const ohhDeerImages = params.slug === 'ohh-deer-wholesale' ? [
    '/images/companies/ohh-deer-wholesale/Assortment-2_3e4a487e-7b88-468e-bd2d-943c8543cafb.jpeg',
    '/images/companies/ohh-deer-wholesale/OD-DJ-3924-A5_OhhDeer_2023_June_DailyPlanners_Desk_Lifestyle__WebRes_1x1_sRGB__Ref.1722.jpeg',
    '/images/companies/ohh-deer-wholesale/ODGBL11789-Hoping-You-Don_t-Like-It-Large-Gift-Bag.jpeg',
    '/images/companies/ohh-deer-wholesale/CATHGC11510-Best-Birthday-Ponies_RGB_WEB.jpeg',
    '/images/companies/ohh-deer-wholesale/TP-GC-4065-A6_Silly_Sausage.jpeg',
    '/images/companies/ohh-deer-wholesale/A6_Card_Spinner_Single_Page.jpeg',
    '/images/companies/ohh-deer-wholesale/NDLFLEXNB9187---Volcanic-Abstract-Web.jpeg'
  ] : [];

  const globalJourneyImages = params.slug === 'global-journey-gifts' ? [
    '/images/companies/global-journey/Screenshot 2025-05-17 at 08.34.04.png',
    '/images/companies/global-journey/Screenshot 2025-05-17 at 08.33.54.png',
    '/images/companies/global-journey/Screenshot 2025-05-17 at 08.33.48.png',
    '/images/companies/global-journey/Screenshot 2025-05-17 at 08.33.35.png',
    '/images/companies/global-journey/Screenshot 2025-05-17 at 08.33.13.png',
    '/images/companies/global-journey/Screenshot 2025-05-17 at 08.33.00.png'
  ] : [];

  const wplGiftsImages = params.slug === 'wpl-gifts' ? [
    '/images/companies/wpl-gifts/Screenshot 2025-05-17 at 08.36.34.png',
    '/images/companies/wpl-gifts/Screenshot 2025-05-17 at 08.36.28.png',
    '/images/companies/wpl-gifts/Screenshot 2025-05-17 at 08.36.21.png'
  ] : [];

  const mintPublishingImages = params.slug === 'mint-publishing' ? [
    '/images/companies/mint-publishing/1-1-27.jpeg',
    '/images/companies/mint-publishing/1-1-26.jpeg',
    '/images/companies/mint-publishing/1-1-29.jpeg',
    '/images/companies/mint-publishing/1-1-25.jpeg',
    '/images/companies/mint-publishing/1-19.jpeg',
    '/images/companies/mint-publishing/1-30.jpeg'
  ] : [];

  const gnawChocolateImages = params.slug === 'gnaw-chocolate' ? [
    '/images/companies/gnaw-chocolate/gnaw-milk-peppermint-chocolate-bar-002-gpn0005-1024x1024-72dpi.jpeg',
    '/images/companies/gnaw-chocolate/GNAW-Popcorn_Peanut-Snack-Bar-GPN0028-CBG-02.jpeg',
    '/images/companies/gnaw-chocolate/GNAW-Milk-Chocolate-Buttons-GPN0066-CBG-02.jpeg',
    '/images/companies/gnaw-chocolate/GNAW-Easter-Egg-Chocolate-Curls-GPN0069.png',
    '/images/companies/gnaw-chocolate/gnaw-mochamelt-salted-caramel-cbg-01.jpeg',
    '/images/companies/gnaw-chocolate/gnaw-taste-adventure-hot-choc-spoon-gift-gpn0052-lfs-01.jpeg',
    '/images/companies/gnaw-chocolate/GNAW-Caramel-Chocolate-Buttons-GPN0067-CBG-02.png'
  ] : [];

  const content = (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Company Information */}
            <div className={`${hasVideoBackground ? 'bg-white/90 backdrop-blur-md' : ''} rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl`}>
              <div className="h-60 relative mb-8 group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/10 group-hover:to-gray-50/20 transition-all duration-300" />
                <Image
                  src={company.logoUrl}
                  alt={`${company.name} logo`}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="space-y-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-4 relative">
                  {company.name}
                  <div className="h-1 w-20 bg-blue-600 mt-2" />
                </h1>
                <p className="text-xl leading-relaxed text-gray-600">{company.description}</p>
                
                <div className="mt-12">
                  {params.slug === 'paper-salad' && (
                    <div className="mb-8">
                      <ImageGallery images={paperSaladImages} interval={6000} />
                    </div>
                  )}
                  {params.slug === 'emotional-rescue' && (
                    <div className="mb-8">
                      <ImageGallery images={emotionalRescueImages} interval={5000} />
                    </div>
                  )}
                  {params.slug === 'museums-and-galleries' && (
                    <div className="mb-8">
                      <ImageGallery images={museumsAndGalleriesImages} interval={5500} />
                    </div>
                  )}
                  {params.slug === 'star-editions' && (
                    <div className="mb-8">
                      <ImageGallery images={starEditionsImages} interval={5000} />
                    </div>
                  )}
                  {params.slug === 'peppermint-grove' && (
                    <div className="mb-8">
                      <ImageGallery images={peppermintGroveImages} interval={5500} />
                    </div>
                  )}
                  {params.slug === 'boxer-gifts' && (
                    <div className="mb-8">
                      <ImageGallery images={boxerGiftsImages} interval={5000} />
                    </div>
                  )}
                  {params.slug === 'david-fischhoff' && (
                    <div className="mb-8">
                      <ImageGallery images={davidFischhoffImages} interval={5000} />
                    </div>
                  )}
                  {params.slug === 'ohh-deer-wholesale' && (
                    <div className="mb-8">
                      <ImageGallery images={ohhDeerImages} interval={5500} />
                    </div>
                  )}
                  {params.slug === 'global-journey-gifts' && (
                    <div className="mb-8">
                      <ImageGallery images={globalJourneyImages} interval={5500} />
                    </div>
                  )}
                  {params.slug === 'wpl-gifts' && (
                    <div className="mb-8">
                      <ImageGallery images={wplGiftsImages} interval={5000} />
                    </div>
                  )}
                  {params.slug === 'mint-publishing' && (
                    <div className="mb-8">
                      <ImageGallery images={mintPublishingImages} interval={5000} />
                    </div>
                  )}
                  {params.slug === 'gnaw-chocolate' && (
                    <div className="mb-8">
                      <ImageGallery images={gnawChocolateImages} interval={5000} />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                  <a
                    href={company.catalogueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <svg 
                      className="mr-2 -ml-1 h-5 w-5" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    Download Catalogue
                  </a>
                </div>
              </div>
            </div>

            {/* Order Form */}
            <div className={`${hasVideoBackground ? 'bg-white/80 backdrop-blur-sm' : 'bg-white'} rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl`}>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 relative">
                Place an Order
                <div className="h-1 w-16 bg-blue-600 mt-2" />
              </h2>
              <OrderForm companyName={company.name} />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (hasVideoBackground) {
    const videoPath = `/videos/companies/${params.slug}/background.mp4`;
    
    return (
      <VideoBackground videoUrl={videoPath}>
        {content}
      </VideoBackground>
    );
  }

  return content;
}