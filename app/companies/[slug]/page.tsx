import { Metadata } from 'next'
import Image from 'next/image'
import { companies } from '../../data/companies'
import OrderForm from './OrderForm'
import VideoBackground from '../../components/VideoBackground'
import ImageGallery from '../../components/ImageGallery'
import { Company } from '@/app/lib/types'

// Add shuffle function at the top level
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface Props {
  params: {
    slug: string
  }
}

function generateCompanyMetadata(company: typeof companies[0]): Metadata {
  // Special handling for Global Journey
  if (company.slug === 'global-journey-gifts') {
    const baseTitle = `Global Journey Sales Agent | Coin Dispensers & Retail Display Solutions | East Anglia`;
    const baseDescription = `Official Global Journey sales agent and wholesale supplier in East Anglia. We supply coin dispenser machines, high-performance spinner units, and innovative retail display solutions for gift shops, garden centres, museums, and tourist attractions across Essex, Suffolk, Norfolk, and Cambridgeshire.`;
    
    const locationMetadata = ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire'].map(county => ({
      title: `Global Journey Sales Agent ${county} | Coin Dispensers & Retail Display Solutions in ${county}`,
      description: `Looking for a Global Journey sales agent in ${county}? We are the official supplier of coin dispenser machines, spinner units, and retail display solutions for gift shops, garden centres, and tourist attractions in ${county}. Contact us for trade prices and local delivery.`,
      keywords: [
        `Global Journey Sales Agent ${county}`,
        `Global Journey Agent ${county}`,
        `Global Journey ${county}`,
        `Global Journey ${county} wholesaler`,
        `coin dispenser machines ${county}`,
        `retail display solutions ${county}`,
        `spinner units ${county}`,
        `gift shop supplier ${county}`,
        `garden centre supplier ${county}`,
        `museum supplier ${county}`,
        `tourist attraction supplier ${county}`,
        `coin dispensers wholesale ${county}`,
        `display solutions ${county}`,
        `spinner solutions ${county}`,
        `gift shop solutions ${county}`,
        `garden centre solutions ${county}`,
        `museum solutions ${county}`,
        `tourist attraction solutions ${county}`,
        `coin dispensers trade prices ${county}`,
        `display solutions trade prices ${county}`,
        `spinner units trade prices ${county}`,
        `gift shop displays ${county}`,
        `garden centre displays ${county}`,
        `museum displays ${county}`,
        `tourist attraction displays ${county}`,
        `coin dispensers supplier ${county}`,
        `display solutions distributor ${county}`,
        `spinner units local supplier ${county}`,
        `gift shop local supplier ${county}`,
        `garden centre local supplier ${county}`,
        `museum local supplier ${county}`,
        `tourist attraction local supplier ${county}`
      ]
    }));

    return {
      title: baseTitle,
      description: baseDescription,
      keywords: [
        ...locationMetadata.flatMap(m => m.keywords),
        'Global Journey Sales Agent',
        'Global Journey Agent East Anglia',
        'Global Journey wholesale',
        'coin dispenser machines supplier',
        'retail display solutions wholesale',
        'spinner units supplier',
        'gift shop supplier',
        'garden centre supplier',
        'museum supplier',
        'tourist attraction supplier',
        'coin dispensers wholesale',
        'display solutions',
        'spinner solutions',
        'gift shop solutions',
        'garden centre solutions',
        'museum solutions',
        'tourist attraction solutions',
        'coin dispensers trade prices',
        'display solutions trade prices',
        'spinner units trade prices',
        'gift shop displays',
        'garden centre displays',
        'museum displays',
        'tourist attraction displays',
        'coin dispensers supplier',
        'display solutions distributor',
        'spinner units local supplier',
        'gift shop local supplier',
        'garden centre local supplier',
        'museum local supplier',
        'tourist attraction local supplier',
        'East Anglia coin dispensers',
        'East Anglia retail displays',
        'East Anglia spinner units',
        'East Anglia gift shops',
        'East Anglia garden centres',
        'East Anglia museums',
        'East Anglia tourist attractions'
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
            alt: 'Global Journey - Coin Dispensers & Retail Display Solutions'
          }
        ]
      },
      alternates: {
        canonical: `https://easalesltd.com/companies/global-journey-gifts`
      },
      robots: {
        index: true,
        follow: true
      }
    };
  }

  // Special handling for David Fischhoff
  if (company.slug === 'david-fischhoff') {
    const baseTitle = `David Fischhoff Sales Agent | Memorial & Graveside Products | East Anglia`;
    const baseDescription = `Official David Fischhoff sales agent and wholesale supplier in East Anglia. We supply high-quality memorial vases, urns, gravestone accessories, and graveside products to funeral directors, memorial masons, and retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.`;
    
    const locationMetadata = ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire'].map(county => ({
      title: `David Fischhoff Sales Agent ${county} | Memorial & Graveside Products in ${county}`,
      description: `Looking for a David Fischhoff sales agent in ${county}? We are the official supplier of memorial vases, urns, and gravestone accessories to funeral directors and memorial masons in ${county}. Contact us for trade prices and local delivery.`,
      keywords: [
        `David Fischhoff Sales Agent ${county}`,
        `David Fischhoff Agent ${county}`,
        `David Fischhoff ${county}`,
        `David Fischhoff ${county} wholesaler`,
        `memorial vases ${county}`,
        `gravestone accessories ${county}`,
        `memorial urns ${county}`,
        `graveside products ${county}`,
        `funeral director supplier ${county}`,
        `memorial mason supplier ${county}`,
        `memorial products wholesale ${county}`,
        `gravestone solutions ${county}`,
        `memorial solutions ${county}`,
        `funeral director solutions ${county}`,
        `memorial mason solutions ${county}`,
        `memorial products trade prices ${county}`,
        `gravestone accessories trade prices ${county}`,
        `memorial urns trade prices ${county}`,
        `graveside products wholesale ${county}`,
        `funeral director displays ${county}`,
        `memorial mason displays ${county}`,
        `memorial products supplier ${county}`,
        `gravestone accessories distributor ${county}`,
        `memorial urns local supplier ${county}`,
        `graveside products local supplier ${county}`,
        `funeral director local supplier ${county}`,
        `memorial mason local supplier ${county}`
      ]
    }));

    return {
      title: baseTitle,
      description: baseDescription,
      keywords: [
        ...locationMetadata.flatMap(m => m.keywords),
        'David Fischhoff Sales Agent',
        'David Fischhoff Agent East Anglia',
        'David Fischhoff wholesale',
        'memorial vases supplier',
        'gravestone accessories wholesale',
        'memorial urns supplier',
        'graveside products supplier',
        'funeral director supplier',
        'memorial mason supplier',
        'memorial products wholesale',
        'gravestone solutions',
        'memorial solutions',
        'funeral director solutions',
        'memorial mason solutions',
        'memorial products trade prices',
        'gravestone accessories trade prices',
        'memorial urns trade prices',
        'graveside products wholesale',
        'funeral director displays',
        'memorial mason displays',
        'memorial products supplier',
        'gravestone accessories distributor',
        'memorial urns local supplier',
        'graveside products local supplier',
        'funeral director local supplier',
        'memorial mason local supplier',
        'East Anglia memorial products',
        'East Anglia gravestone accessories',
        'East Anglia memorial urns',
        'East Anglia graveside products',
        'East Anglia funeral directors',
        'East Anglia memorial masons'
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
            alt: 'David Fischhoff - Memorial & Graveside Products'
          }
        ]
      },
      alternates: {
        canonical: `https://easalesltd.com/companies/david-fischhoff`
      },
      robots: {
        index: true,
        follow: true
      }
    };
  }

  // Special handling for Museums and Galleries
  if (company.slug === 'museums-and-galleries') {
    const baseTitle = `Museums and Galleries Sales Agent | Licensed Art Cards & Sale or Return Christmas Cards | East Anglia`;
    const baseDescription = `Official Museums and Galleries sales agent and wholesale supplier in East Anglia. We supply licensed art cards, charity Christmas cards, and sale or return greeting cards to gift shops, museums, galleries, and retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.`;
    
    const locationMetadata = ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire'].map(county => ({
      title: `Museums and Galleries Sales Agent ${county} | Licensed Art Cards & Sale or Return Cards in ${county}`,
      description: `Looking for a Museums and Galleries sales agent in ${county}? We are the official supplier of licensed art cards, sale or return Christmas cards, and museum stationery to gift shops, museums, and galleries in ${county}. Contact us for trade prices and local delivery.`,
      keywords: [
        `Museums and Galleries Sales Agent ${county}`,
        `Museums and Galleries Agent ${county}`,
        `Museums and Galleries ${county}`,
        `Museums and Galleries ${county} wholesaler`,
        `licensed art cards ${county}`,
        `museum stationery ${county}`,
        `sale or return Christmas cards ${county}`,
        `charity Christmas cards ${county}`,
        `museum gift shop supplier ${county}`,
        `gallery shop supplier ${county}`,
        `art cards wholesale ${county}`,
        `museum shop solutions ${county}`,
        `gallery shop solutions ${county}`,
        `licensed products ${county}`,
        `museum merchandise ${county}`,
        `gallery merchandise ${county}`,
        `art-inspired cards ${county}`,
        `museum shop displays ${county}`,
        `gallery shop displays ${county}`,
        `sale or return cards ${county}`,
        `charity cards wholesale ${county}`,
        `museum shop trade prices ${county}`,
        `gallery shop trade prices ${county}`,
        `licensed art trade prices ${county}`,
        `museum shop supplier ${county}`,
        `gallery shop supplier ${county}`,
        `art cards trade prices ${county}`,
        `museum shop wholesale ${county}`,
        `gallery shop wholesale ${county}`,
        `licensed products supplier ${county}`,
        `museum merchandise wholesale ${county}`,
        `gallery merchandise wholesale ${county}`,
        `art-inspired stationery ${county}`,
        `museum shop displays ${county}`,
        `gallery shop displays ${county}`,
        `sale or return solutions ${county}`,
        `charity cards supplier ${county}`,
        `museum shop distributor ${county}`,
        `gallery shop distributor ${county}`,
        `licensed art distributor ${county}`,
        `museum shop local supplier ${county}`,
        `gallery shop local supplier ${county}`
      ]
    }));

    return {
      title: baseTitle,
      description: baseDescription,
      keywords: [
        ...locationMetadata.flatMap(m => m.keywords),
        'Museums and Galleries Sales Agent',
        'Museums and Galleries Agent East Anglia',
        'Museums and Galleries wholesale',
        'licensed art cards supplier',
        'museum stationery wholesale',
        'sale or return Christmas cards',
        'charity Christmas cards wholesale',
        'museum gift shop supplier',
        'gallery shop supplier',
        'art cards wholesale',
        'museum shop solutions',
        'gallery shop solutions',
        'licensed products supplier',
        'museum merchandise wholesale',
        'gallery merchandise wholesale',
        'art-inspired cards supplier',
        'museum shop displays',
        'gallery shop displays',
        'sale or return cards supplier',
        'charity cards wholesale',
        'museum shop trade prices',
        'gallery shop trade prices',
        'licensed art trade prices',
        'museum shop supplier',
        'gallery shop supplier',
        'art cards trade prices',
        'museum shop wholesale',
        'gallery shop wholesale',
        'licensed products distributor',
        'museum merchandise supplier',
        'gallery merchandise supplier',
        'art-inspired stationery',
        'museum shop displays',
        'gallery shop displays',
        'sale or return solutions',
        'charity cards supplier',
        'museum shop distributor',
        'gallery shop distributor',
        'licensed art distributor',
        'museum shop local supplier',
        'gallery shop local supplier',
        'East Anglia museum shops',
        'East Anglia gallery shops',
        'East Anglia licensed art',
        'East Anglia museum merchandise',
        'East Anglia gallery merchandise',
        'East Anglia art cards',
        'East Anglia museum stationery',
        'East Anglia gallery stationery',
        'East Anglia sale or return',
        'East Anglia charity cards'
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
            alt: 'Museums and Galleries - Licensed Art Cards & Sale or Return Christmas Cards'
          }
        ]
      },
      alternates: {
        canonical: `https://easalesltd.com/companies/museums-and-galleries`
      },
      robots: {
        index: true,
        follow: true
      }
    };
  }

  // Special handling for Emotional Rescue
  if (company.slug === 'emotional-rescue') {
    const baseTitle = `Emotional Rescue Sales Agent | Alternative to Rosie Made A Thing | Wholesale Cards & Gifts`;
    const baseDescription = `Official Emotional Rescue sales agent and wholesale supplier in East Anglia. We supply unique, humorous greeting cards and gifts - a great alternative to Rosie Made A Thing. Available for retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.`;
    
    const locationMetadata = ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire'].map(county => ({
      title: `Emotional Rescue Sales Agent ${county} | Alternative to Rosie Made A Thing | Wholesale Cards in ${county}`,
      description: `Looking for an Emotional Rescue sales agent in ${county}? We are the official supplier of alternative greeting cards and gifts similar to Rosie Made A Thing. Contact us for trade prices and local delivery.`,
      keywords: [
        `Emotional Rescue Sales Agent ${county}`,
        `Emotional Rescue Agent ${county}`,
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
        'Emotional Rescue Sales Agent',
        'Emotional Rescue Agent East Anglia',
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
        canonical: `https://easalesltd.com/companies/emotional-rescue`
      },
      robots: {
        index: true,
        follow: true
      }
    };
  }

  // Special handling for Ohh Deer wholesale
  if (company.slug === 'ohh-deer-wholesale') {
    const baseTitle = `Ohh Deer Sales Agent | Laura Ashley, Cath Kidston & V&A Cards | Gift Wrap & Stationery`;
    const baseDescription = `Official Ohh Deer sales agent and wholesale supplier in East Anglia. We supply Laura Ashley greeting cards, gift bags, and wrapping paper, Cath Kidston greeting cards and stationery, V&A Museum licensed products, and A6 greeting card spinners to retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.`;
    
    const locationMetadata = ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire'].map(county => ({
      title: `Ohh Deer Sales Agent ${county} | Laura Ashley, Cath Kidston & V&A Cards in ${county}`,
      description: `Looking for an Ohh Deer sales agent in ${county}? We are the official supplier of Laura Ashley greeting cards, Cath Kidston stationery, V&A Museum licensed products, and card display solutions to gift shops and card shops in ${county}. Contact us for trade prices and local delivery.`,
      keywords: [
        `Ohh Deer Sales Agent ${county}`,
        `Ohh Deer Agent ${county}`,
        `Ohh Deer ${county}`,
        `Ohh Deer ${county} wholesaler`,
        `Laura Ashley cards ${county}`,
        `Cath Kidston stationery ${county}`,
        `V&A Museum products ${county}`,
        `gift wrap ${county}`,
        `greeting cards ${county}`,
        `card spinners ${county}`,
        `gift shop supplier ${county}`,
        `card shop supplier ${county}`,
        `Laura Ashley wholesale ${county}`,
        `Cath Kidston wholesale ${county}`,
        `V&A products wholesale ${county}`,
        `gift wrap solutions ${county}`,
        `greeting card solutions ${county}`,
        `card spinner solutions ${county}`,
        `gift shop solutions ${county}`,
        `card shop solutions ${county}`,
        `Laura Ashley trade prices ${county}`,
        `Cath Kidston trade prices ${county}`,
        `V&A products trade prices ${county}`,
        `gift wrap trade prices ${county}`,
        `greeting cards trade prices ${county}`,
        `card spinners trade prices ${county}`,
        `gift shop displays ${county}`,
        `card shop displays ${county}`,
        `Laura Ashley supplier ${county}`,
        `Cath Kidston distributor ${county}`,
        `V&A products local supplier ${county}`,
        `gift wrap local supplier ${county}`,
        `greeting cards local supplier ${county}`,
        `card spinners local supplier ${county}`,
        `gift shop local supplier ${county}`,
        `card shop local supplier ${county}`
      ]
    }));

    return {
      title: baseTitle,
      description: baseDescription,
      keywords: [
        ...locationMetadata.flatMap(m => m.keywords),
        'Ohh Deer Sales Agent',
        'Ohh Deer Agent East Anglia',
        'Ohh Deer wholesale',
        'Laura Ashley cards supplier',
        'Cath Kidston stationery wholesale',
        'V&A Museum products supplier',
        'gift wrap supplier',
        'greeting cards supplier',
        'card spinners supplier',
        'gift shop supplier',
        'card shop supplier',
        'Laura Ashley wholesale',
        'Cath Kidston wholesale',
        'V&A products wholesale',
        'gift wrap solutions',
        'greeting card solutions',
        'card spinner solutions',
        'gift shop solutions',
        'card shop solutions',
        'Laura Ashley trade prices',
        'Cath Kidston trade prices',
        'V&A products trade prices',
        'gift wrap trade prices',
        'greeting cards trade prices',
        'card spinners trade prices',
        'gift shop displays',
        'card shop displays',
        'Laura Ashley supplier',
        'Cath Kidston distributor',
        'V&A products local supplier',
        'gift wrap local supplier',
        'greeting cards local supplier',
        'card spinners local supplier',
        'gift shop local supplier',
        'card shop local supplier',
        'East Anglia Laura Ashley',
        'East Anglia Cath Kidston',
        'East Anglia V&A products',
        'East Anglia gift wrap',
        'East Anglia greeting cards',
        'East Anglia card spinners',
        'East Anglia gift shops',
        'East Anglia card shops'
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
            alt: 'Ohh Deer - Laura Ashley, Cath Kidston & V&A Cards, Gift Wrap & Stationery'
          }
        ]
      },
      alternates: {
        canonical: `https://easalesltd.com/companies/ohh-deer-wholesale`
      },
      robots: {
        index: true,
        follow: true
      }
    };
  }

  // Special handling for Peppermint Grove
  if (company.slug === 'peppermint-grove') {
    const baseTitle = `Peppermint Grove Sales Agent | Luxury Candles, Diffusers & Home Fragrance | East Anglia`;
    const baseDescription = `Official Peppermint Grove sales agent and wholesale supplier in East Anglia. We supply luxury candles, diffusers, room sprays, and premium home fragrance products to gift shops, homeware retailers, and spas across Essex, Suffolk, Norfolk, and Cambridgeshire.`;
    
    const locationMetadata = ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire'].map(county => ({
      title: `Peppermint Grove Sales Agent ${county} | Luxury Candles & Home Fragrance in ${county}`,
      description: `Looking for a Peppermint Grove sales agent in ${county}? We are the official supplier of luxury candles, diffusers, and premium home fragrance products to gift shops and homeware retailers in ${county}. Contact us for trade prices and local delivery.`,
      keywords: [
        `Peppermint Grove Sales Agent ${county}`,
        `Peppermint Grove Agent ${county}`,
        `Peppermint Grove ${county}`,
        `Peppermint Grove ${county} wholesaler`,
        `luxury candles ${county}`,
        `home fragrance ${county}`,
        `diffusers ${county}`,
        `room sprays ${county}`,
        `gift shop supplier ${county}`,
        `homeware retailer supplier ${county}`,
        `spa supplier ${county}`,
        `luxury candles wholesale ${county}`,
        `home fragrance solutions ${county}`,
        `diffuser solutions ${county}`,
        `room spray solutions ${county}`,
        `gift shop solutions ${county}`,
        `homeware retailer solutions ${county}`,
        `spa solutions ${county}`,
        `luxury candles trade prices ${county}`,
        `home fragrance trade prices ${county}`,
        `diffusers trade prices ${county}`,
        `room sprays trade prices ${county}`,
        `gift shop displays ${county}`,
        `homeware retailer displays ${county}`,
        `spa displays ${county}`,
        `luxury candles supplier ${county}`,
        `home fragrance distributor ${county}`,
        `diffusers local supplier ${county}`,
        `room sprays local supplier ${county}`,
        `gift shop local supplier ${county}`,
        `homeware retailer local supplier ${county}`,
        `spa local supplier ${county}`
      ]
    }));

    return {
      title: baseTitle,
      description: baseDescription,
      keywords: [
        ...locationMetadata.flatMap(m => m.keywords),
        'Peppermint Grove Sales Agent',
        'Peppermint Grove Agent East Anglia',
        'Peppermint Grove wholesale',
        'luxury candles supplier',
        'home fragrance wholesale',
        'diffusers supplier',
        'room sprays supplier',
        'gift shop supplier',
        'homeware retailer supplier',
        'spa supplier',
        'luxury candles wholesale',
        'home fragrance solutions',
        'diffuser solutions',
        'room spray solutions',
        'gift shop solutions',
        'homeware retailer solutions',
        'spa solutions',
        'luxury candles trade prices',
        'home fragrance trade prices',
        'diffusers trade prices',
        'room sprays trade prices',
        'gift shop displays',
        'homeware retailer displays',
        'spa displays',
        'luxury candles supplier',
        'home fragrance distributor',
        'diffusers local supplier',
        'room sprays local supplier',
        'gift shop local supplier',
        'homeware retailer local supplier',
        'spa local supplier',
        'East Anglia luxury candles',
        'East Anglia home fragrance',
        'East Anglia diffusers',
        'East Anglia room sprays',
        'East Anglia gift shops',
        'East Anglia homeware retailers',
        'East Anglia spas'
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
            alt: 'Peppermint Grove - Luxury Candles, Diffusers & Home Fragrance'
          }
        ]
      },
      alternates: {
        canonical: `https://easalesltd.com/companies/peppermint-grove`
      },
      robots: {
        index: true,
        follow: true
      }
    };
  }

  // Special handling for Star Editions
  if (company.slug === 'star-editions') {
    const baseTitle = `Star Editions Sales Agent | Richard Briggs & Dave Thompson Cards | Bespoke UK-Made Merchandise`;
    return {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'LocalBusiness', 'WholesaleStore', 'SalesAgent'],
      '@id': `https://www.easalesltd.co.uk/companies/star-editions#organization`,
      'name': 'Star Editions Sales Agent - Richard Briggs, Dave Thompson & Bespoke Products',
      'description': 'Official Star Editions sales agent and wholesale supplier in East Anglia. We supply Richard Briggs and Dave Thompson greeting cards and gifts, along with bespoke merchandise and custom branding services. All products are UK-made with 5-day turnaround, available for retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.',
      'url': 'https://www.easalesltd.co.uk/companies/star-editions',
      'logo': {
        '@type': 'ImageObject',
        'url': `https://www.easalesltd.co.uk${company.logoUrl}`,
        'width': '800',
        'height': '600'
      },
      'areaServed': ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire'].map(county => ({
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
        'name': 'Star Editions Sales Agent - Richard Briggs, Dave Thompson & Bespoke Products',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Richard Briggs Greeting Cards & Gifts',
              'description': 'Official Star Editions sales agent providing Richard Briggs greeting cards and gifts featuring unique and humorous designs.',
              'brand': {
                '@type': 'Brand',
                'name': 'Richard Briggs'
              },
              'category': ['Greeting Cards', 'Gifts', 'Humorous Cards', 'Unique Designs', 'Sales Agent Services'],
              'offers': {
                '@type': 'Offer',
                'availability': 'https://schema.org/InStock',
                'deliveryLeadTime': 'P5D',
                'areaServed': ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire'].map(county => ({
                  '@type': 'State',
                  'name': county
                }))
              }
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Dave Thompson Greeting Cards & Gifts',
              'description': 'Official Star Editions sales agent providing Dave Thompson greeting cards and gifts featuring unique and humorous designs.',
              'brand': {
                '@type': 'Brand',
                'name': 'Dave Thompson'
              },
              'category': ['Greeting Cards', 'Gifts', 'Humorous Cards', 'Unique Designs', 'Sales Agent Services'],
              'offers': {
                '@type': 'Offer',
                'availability': 'https://schema.org/InStock',
                'deliveryLeadTime': 'P5D',
                'areaServed': ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire'].map(county => ({
                  '@type': 'State',
                  'name': county
                }))
              }
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Bespoke Merchandise & Custom Branding',
              'description': 'Official Star Editions sales agent providing bespoke merchandise and custom branding services with 5-day turnaround. All products are UK-made for exceptional quality.',
              'brand': {
                '@type': 'Brand',
                'name': 'Star Editions'
              },
              'category': ['Custom Products', 'Bespoke Merchandise', 'Branding Services', 'UK Manufacturing', 'Sales Agent Services'],
              'offers': {
                '@type': 'Offer',
                'availability': 'https://schema.org/InStock',
                'deliveryLeadTime': 'P5D',
                'areaServed': ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire'].map(county => ({
                  '@type': 'State',
                  'name': county
                }))
              }
            }
          }
        ]
      }
    };
  }

  // Special handling for V&A Cards and Gifts
  if (company.slug === 'va-cards-and-gifts') {
    return {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'LocalBusiness', 'WholesaleStore', 'SalesAgent'],
      '@id': `https://www.easalesltd.co.uk/companies/va-cards-and-gifts#organization`,
      'name': 'V&A Cards and Gifts Sales Agent - Licensed Museum Art Cards & Stationery',
      'description': 'Official V&A Cards and Gifts sales agent and wholesale supplier in East Anglia. We supply licensed V&A Museum art cards, stationery, and gifts to retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.',
      'url': 'https://www.easalesltd.co.uk/companies/va-cards-and-gifts',
      'logo': {
        '@type': 'ImageObject',
        'url': `https://www.easalesltd.co.uk${company.logoUrl}`,
        'width': '800',
        'height': '600'
      },
      'areaServed': ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire'].map(county => ({
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
        'name': 'V&A Cards and Gifts Sales Agent - Licensed Museum Products',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'V&A Museum Licensed Art Cards',
              'description': 'Official V&A Cards and Gifts sales agent providing licensed V&A Museum art cards and stationery.',
              'brand': {
                '@type': 'Brand',
                'name': 'V&A Cards and Gifts'
              },
              'category': ['Greeting Cards', 'Licensed Products', 'Museum Products', 'Art Cards', 'Sales Agent Services']
            },
            'areaServed': ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire'].map(county => ({
              '@type': 'State',
              'name': county
            }))
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'V&A Museum Stationery',
              'description': 'Official V&A Cards and Gifts sales agent providing licensed V&A Museum stationery and art-inspired gifts.',
              'brand': {
                '@type': 'Brand',
                'name': 'V&A Cards and Gifts'
              },
              'category': ['Stationery', 'Licensed Products', 'Museum Products', 'Art Gifts', 'Sales Agent Services']
            },
            'areaServed': ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire'].map(county => ({
              '@type': 'State',
              'name': county
            }))
          }
        ]
      }
    };
  }

  // Default structured data for other companies
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'WholesaleStore', 'SalesAgent'],
    '@id': `https://www.easalesltd.co.uk/companies/${company.slug}#organization`,
    'name': `${company.name} Sales Agent - Wholesale Supplier`,
    'description': `Official ${company.name} sales agent and wholesale supplier in East Anglia. ${company.description}`,
    'url': `https://www.easalesltd.co.uk/companies/${company.slug}`,
    'logo': {
      '@type': 'ImageObject',
      'url': `https://www.easalesltd.co.uk${company.logoUrl}`,
      'width': '800',
      'height': '600'
    },
    'areaServed': ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire'].map(county => ({
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
      'name': `${company.name} Sales Agent - Product Catalog`,
      'itemListElement': {
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Product',
          'name': `${company.name} Products`,
          'description': `Official ${company.name} sales agent providing ${company.description}`,
          'brand': {
            '@type': 'Brand',
            'name': company.name
          },
          'category': ['Sales Agent Services', 'Wholesale Products', 'East Anglia Retail']
        },
        'areaServed': ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire'].map(county => ({
          '@type': 'State',
          'name': county
        }))
      }
    }
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const company = companies.find(c => c.slug === params.slug);
  if (!company) {
    return {
      title: 'Company Not Found',
      description: 'The requested company page could not be found.'
    };
  }

  // Generate metadata from company data if not present
  const title = `${company.name} Sales Agent | Wholesale Supplier in East Anglia`;
  const description = `Official ${company.name} sales agent and wholesale supplier in East Anglia. ${company.description}`;
  const keywords = `${company.name}, sales agent, wholesale supplier, East Anglia, ${company.name.toLowerCase()} cards, ${company.name.toLowerCase()} gifts`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  };
}

export async function generateStaticParams() {
  return companies.map((company) => ({
    slug: company.slug,
  }))
}

export default function CompanyPage({ params }: { params: { slug: string } }) {
  const company = companies.find(c => c.slug === params.slug);
  if (!company) {
    return <div>Company not found</div>;
  }

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

  // Define base image arrays
  const paperSaladBaseImages = params.slug === 'paper-salad' ? [
    '/images/companies/paper-salad/IMG_0670_copy_bdc70bf1-59fc-476e-9c6d-bf96f508ee40_1500x.jpeg',
    '/images/companies/paper-salad/43a8e5ac-f223-4213-a4ca-c0c7d53aed48_1500x.jpeg',
    '/images/companies/paper-salad/Birthday_Collection_copy_1500x.jpeg'
  ] : [];

  const emotionalRescueBaseImages = params.slug === 'emotional-rescue' ? [
    '/images/companies/emotional-rescue/336207-IMG_3646-copy.jpeg',
    '/images/companies/emotional-rescue/emo_web.jpeg',
    '/images/companies/emotional-rescue/81J8YSOEzoL.jpeg',
    '/images/companies/emotional-rescue/519NuytaJ1L.jpeg',
    '/images/companies/emotional-rescue/613nPYonKsL.jpeg',
    '/images/companies/emotional-rescue/EMZFPW11768_600x.jpeg',
    '/images/companies/emotional-rescue/EMZFPW11770_600x.jpeg'
  ] : [];

  const museumsAndGalleriesBaseImages = params.slug === 'museums-and-galleries' ? [
    '/images/companies/museums-and-galleries/7d55e712-89d5-448b-aa75-f4cec8b7cf87.jpeg',
    '/images/companies/museums-and-galleries/6c27d66e-3695-49a1-b4a4-d7967106679b.jpeg',
    '/images/companies/museums-and-galleries/cc0ff00f-b373-4a7f-ae5c-fa1e61f846fa.jpeg',
    '/images/companies/museums-and-galleries/ed555a28-c3ea-4cd8-b056-3a0dfebb2890.jpeg',
    '/images/companies/museums-and-galleries/4a44abec-ce62-4e46-878b-8cbad6b03da2.jpeg',
    '/images/companies/museums-and-galleries/f13f19a1-1349-4e84-89d5-e6ffe231f308.jpeg',
    '/images/companies/museums-and-galleries/1b4833b0-54b9-4457-95fb-7b94df0b0389.jpeg',
    '/images/companies/museums-and-galleries/59a26b7f-162c-454e-9efd-c483fae2ecfa.jpeg'
  ] : [];

  const starEditionsBaseImages = params.slug === 'star-editions' ? [
    '/images/companies/star-editions/E6EDAD48-3745-4C0D-B057-1C2EB79CF436.JPG',
    '/images/companies/star-editions/IMG_0562.jpg',
    '/images/companies/star-editions/IMG_0558.jpeg',
    '/images/companies/star-editions/IMG-20240510-WA0007.jpg',
    '/images/companies/star-editions/IMG-20240906-WA0024.jpg',
    '/images/companies/star-editions/IMG-20250217-WA0001.jpg',
    '/images/companies/star-editions/IMG-20240713-WA0013.jpg',
    '/images/companies/star-editions/IMG-20250228-WA0016.jpg',
    '/images/companies/star-editions/IMG-20250124-WA0007.jpg',
    '/images/companies/star-editions/Stephen-Millership.jpeg',
    '/images/companies/star-editions/stick_man.jpeg',
    '/images/companies/star-editions/ZOG011.jpeg',
    '/images/companies/star-editions/miffy_logo.png',
    '/images/companies/star-editions/BRIGGS_DESKTOP.jpeg'
  ] : [];

  const peppermintGroveBaseImages = params.slug === 'peppermint-grove' ? [
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

  const boxerGiftsBaseImages = params.slug === 'boxer-gifts' ? [
    '/images/companies/boxer-gifts/OT2075_a70b.webp',
    '/images/companies/boxer-gifts/CO1012___MR_GOOD_LOOKIN__APRON___34_49a0.webp',
    '/images/companies/boxer-gifts/MU3131_4d24.webp',
    '/images/companies/boxer-gifts/YHU0838_Grumpy_Git_9b56.webp',
    '/images/companies/boxer-gifts/Untitled_550_550_px_4_.png'
  ] : [];

  const davidFischhoffBaseImages = params.slug === 'david-fischhoff' ? [
    '/images/companies/david-fischhoff/36.jpeg',
    '/images/companies/david-fischhoff/695.jpeg',
    '/images/companies/david-fischhoff/68.jpeg',
    '/images/companies/david-fischhoff/13.jpeg',
    '/images/companies/david-fischhoff/67.jpeg'
  ] : [];

  const ohhDeerBaseImages = params.slug === 'ohh-deer-wholesale' ? [
    '/images/companies/ohh-deer-wholesale/Tiny-Notebooks-Web-Square.jpg',
    '/images/companies/ohh-deer-wholesale/Cath-Kidston-Web-Asset-Square.jpg',
    '/images/companies/ohh-deer-wholesale/Beth-Evans-Web-Asset-Square.jpg',
    '/images/companies/ohh-deer-wholesale/Daily-Planners-Web-Asset-Square.jpg',
    '/images/companies/ohh-deer-wholesale/Laura-Ashley-Web-Asset-Square.jpg'
  ] : [];

  const globalJourneyBaseImages = params.slug === 'global-journey-gifts' ? [
    '/images/companies/global-journey/Screenshot 2025-05-17 at 08.34.04.png',
    '/images/companies/global-journey/Screenshot 2025-05-17 at 08.33.54.png',
    '/images/companies/global-journey/Screenshot 2025-05-17 at 08.33.48.png',
    '/images/companies/global-journey/Screenshot 2025-05-17 at 08.33.35.png',
    '/images/companies/global-journey/Screenshot 2025-05-17 at 08.33.13.png',
    '/images/companies/global-journey/Screenshot 2025-05-17 at 08.33.00.png'
  ] : [];

  const wplGiftsBaseImages = params.slug === 'wpl-gifts' ? [
    '/images/companies/wpl-gifts/Screenshot 2025-05-17 at 08.36.34.png',
    '/images/companies/wpl-gifts/Screenshot 2025-05-17 at 08.36.28.png',
    '/images/companies/wpl-gifts/Screenshot 2025-05-17 at 08.36.21.png'
  ] : [];

  const mintPublishingBaseImages = params.slug === 'mint-publishing' ? [
    '/images/companies/mint-publishing/1-1-27.jpeg',
    '/images/companies/mint-publishing/1-1-26.jpeg',
    '/images/companies/mint-publishing/1-1-29.jpeg',
    '/images/companies/mint-publishing/1-1-25.jpeg',
    '/images/companies/mint-publishing/1-19.jpeg',
    '/images/companies/mint-publishing/1-30.jpeg'
  ] : [];

  const gnawChocolateBaseImages = params.slug === 'gnaw-chocolate' ? [
    '/images/companies/gnaw-chocolate/gnaw-milk-peppermint-chocolate-bar-002-gpn0005-1024x1024-72dpi.jpeg',
    '/images/companies/gnaw-chocolate/GNAW-Popcorn_Peanut-Snack-Bar-GPN0028-CBG-02.jpeg',
    '/images/companies/gnaw-chocolate/GNAW-Milk-Chocolate-Buttons-GPN0066-CBG-02.jpeg',
    '/images/companies/gnaw-chocolate/GNAW-Easter-Egg-Chocolate-Curls-GPN0069.png',
    '/images/companies/gnaw-chocolate/gnaw-mochamelt-salted-caramel-cbg-01.jpeg',
    '/images/companies/gnaw-chocolate/gnaw-taste-adventure-hot-choc-spoon-gift-gpn0052-lfs-01.jpeg',
    '/images/companies/gnaw-chocolate/GNAW-Caramel-Chocolate-Buttons-GPN0067-CBG-02.png'
  ] : [];

  // Shuffle all image arrays
  const paperSaladImages = shuffleArray(paperSaladBaseImages);
  const emotionalRescueImages = shuffleArray(emotionalRescueBaseImages);
  const museumsAndGalleriesImages = shuffleArray(museumsAndGalleriesBaseImages);
  const starEditionsImages = shuffleArray(starEditionsBaseImages);
  const peppermintGroveImages = shuffleArray(peppermintGroveBaseImages);
  const boxerGiftsImages = shuffleArray(boxerGiftsBaseImages);
  const davidFischhoffImages = shuffleArray(davidFischhoffBaseImages);
  const ohhDeerImages = shuffleArray(ohhDeerBaseImages);
  const globalJourneyImages = shuffleArray(globalJourneyBaseImages);
  const wplGiftsImages = shuffleArray(wplGiftsBaseImages);
  const mintPublishingImages = shuffleArray(mintPublishingBaseImages);
  const gnawChocolateImages = shuffleArray(gnawChocolateBaseImages);

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

function generateStructuredData(company: Company) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'WholesaleStore', 'SalesAgent'],
    '@id': `https://www.easalesltd.co.uk/companies/${company.slug}#organization`,
    'name': `${company.name} Sales Agent - Wholesale Supplier in East Anglia`,
    'description': `Official ${company.name} sales agent and wholesale supplier in East Anglia. ${company.description}`,
    'url': `https://www.easalesltd.co.uk/companies/${company.slug}`,
    'logo': {
      '@type': 'ImageObject',
      'url': `https://www.easalesltd.co.uk${company.logoUrl}`,
      'width': '800',
      'height': '600'
    },
    'areaServed': ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire'].map(county => ({
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
      'name': `${company.name} Sales Agent - Wholesale Products`,
      'itemListElement': [
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Product',
            'name': `${company.name} Products`,
            'description': company.description,
            'brand': {
              '@type': 'Brand',
              'name': company.name
            },
            'category': ['Sales Agent Services', 'Wholesale Products', 'East Anglia Retail']
          },
          'areaServed': ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire'].map(county => ({
            '@type': 'State',
            'name': county
          }))
        }
      ]
    }
  };
}