import { Metadata } from 'next'
import Image from 'next/image'
import { companies } from '../../data/companies'
import OrderForm from './OrderForm'
import VideoBackground from '../../components/VideoBackground'
import ImageGallery from '../../components/ImageGallery'

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

const counties = ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire'] as const;
type County = typeof counties[number];

function generateCompanyMetadata(company: typeof companies[0]): Metadata {
  // Special handling for Global Journey
  if (company.slug === 'global-journey-gifts') {
    const baseTitle = `Global Journey Sales Agent | Coin Dispensers & Retail Display Solutions for Tourist Attractions in East Anglia`;
    const baseDescription = `Official Global Journey sales agent and wholesale supplier for gift shops, garden centres, museums, and tourist attractions in East Anglia. We provide high-quality coin dispenser machines, innovative retail display solutions, interactive gift products, and high-performance spinner units with local delivery and personal support across Essex, Suffolk, Norfolk, and Cambridgeshire.`;
    
    const locationMetadata = counties.map(county => ({
      title: `Global Journey Sales Agent ${county} | Coin Dispensers & Display Solutions for Tourist Attractions in ${county}`,
      description: `Looking for a Global Journey sales agent in ${county}? We are the official supplier of coin dispenser machines, high-performance spinner units, and interactive gift solutions for gift shops, garden centres, museums, and tourist attractions in ${county}. Local sales agent with personal support and same-day delivery.`,
      keywords: [
        `Global Journey Sales Agent ${county}`,
        `Global Journey Agent ${county}`,
        `coin dispenser machines ${county}`,
        `coin dispensers ${county}`,
        `coin machines ${county}`,
        `gift shop displays ${county}`,
        `garden centre displays ${county}`,
        `museum shop solutions ${county}`,
        `tourist attraction displays ${county}`,
        `visitor centre displays ${county}`,
        `theme park retail ${county}`,
        `greeting card shop displays ${county}`,
        `retail spinner units ${county}`,
        `interactive displays ${county}`,
        `retail display support ${county}`,
        `spinner solutions ${county}`,
        `gift shop innovation ${county}`,
        `retail technology ${county}`,
        `customer engagement ${county}`,
        `retail display quality ${county}`,
        `interactive retail ${county}`,
        `spinner performance ${county}`,
        `retail innovation ${county}`,
        `gift display solutions ${county}`,
        `retail support ${county}`,
        `${county} local supplier`,
        `independent retailer support ${county}`,
        `same day delivery ${county}`,
        `personal retail support ${county}`,
        `garden centre retail ${county}`,
        `museum shop displays ${county}`,
        `tourist attraction retail ${county}`,
        `visitor centre solutions ${county}`,
        `theme park displays ${county}`,
        `coin machine supplier ${county}`,
        `coin dispenser trade prices ${county}`,
        `coin machine wholesale ${county}`,
        `coin dispenser solutions ${county}`,
        `East Anglia gift shops`,
        `East Anglia garden centres`,
        `East Anglia museums`,
        `East Anglia tourist attractions`,
        `East Anglia visitor centres`,
        `East Anglia theme parks`,
        `East Anglia greeting card shops`,
        `East Anglia coin dispensers`
      ]
    }));

    return {
      title: baseTitle,
      description: baseDescription,
      keywords: [
        ...locationMetadata.flatMap(m => m.keywords),
        'Global Journey Sales Agent',
        'Global Journey Agent East Anglia',
        'Global Journey East Anglia',
        'coin dispenser machines East Anglia',
        'coin dispensers wholesale',
        'coin machines supplier',
        'gift shop displays East Anglia',
        'garden centre displays East Anglia',
        'museum shop solutions East Anglia',
        'tourist attraction displays East Anglia',
        'visitor centre displays East Anglia',
        'theme park retail East Anglia',
        'greeting card shop displays East Anglia',
        'retail spinner units East Anglia',
        'interactive displays East Anglia',
        'retail display support East Anglia',
        'spinner solutions East Anglia',
        'gift shop innovation East Anglia',
        'retail technology East Anglia',
        'customer engagement East Anglia',
        'retail display quality East Anglia',
        'interactive retail East Anglia',
        'spinner performance East Anglia',
        'retail innovation East Anglia',
        'gift display solutions East Anglia',
        'retail support East Anglia',
        'local supplier East Anglia',
        'independent retailer support East Anglia',
        'same day delivery East Anglia',
        'personal retail support East Anglia',
        'garden centre retail East Anglia',
        'museum shop displays East Anglia',
        'tourist attraction retail East Anglia',
        'visitor centre solutions East Anglia',
        'theme park displays East Anglia',
        'coin machine supplier East Anglia',
        'coin dispenser trade prices',
        'coin machine wholesale',
        'coin dispenser solutions',
        'East Anglia gift shops',
        'East Anglia garden centres',
        'East Anglia museums',
        'East Anglia tourist attractions',
        'East Anglia visitor centres',
        'East Anglia theme parks',
        'East Anglia greeting card shops',
        'East Anglia coin dispensers'
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
            alt: 'Global Journey - Coin Dispensers & Retail Display Solutions for Tourist Attractions in East Anglia'
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
    const baseTitle = `Museums and Galleries Sales Agent | V&A Museum Cards & Sale or Return Christmas Cards | Wholesale Supplier`;
    const baseDescription = `Official Museums and Galleries sales agent and supplier in East Anglia. We supply V&A Museum licensed art cards, charity Christmas cards, and sale or return greeting cards to retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.`;
    
    const locationMetadata = counties.map(county => ({
      title: `Museums and Galleries Sales Agent ${county} | V&A Museum Cards & Sale or Return Cards in ${county}`,
      description: `Looking for a Museums and Galleries sales agent in ${county}? We are the official supplier of V&A Museum licensed art cards, sale or return Christmas cards, and licensed art cards in ${county}. Contact us for trade prices and local delivery.`,
      keywords: [
        `Museums and Galleries Sales Agent ${county}`,
        `Museums and Galleries Agent ${county}`,
        `Museums and Galleries ${county}`,
        `Museums and Galleries ${county} wholesaler`,
        `V&A Museum cards ${county}`,
        `V&A licensed art cards ${county}`,
        `sale or return Christmas cards ${county}`,
        `charity Christmas cards ${county}`,
        `licensed art cards ${county}`,
        `${county} Museums and Galleries distributor`,
        `Museums and Galleries local supplier ${county}`,
        `V&A cards trade prices ${county}`,
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
        `V&A Museum licensed products ${county}`,
        `art-inspired cards ${county}`,
        `museum stationery ${county}`,
        `V&A Museum gifts ${county}`,
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
        'Museums and Galleries Sales Agent',
        'Museums and Galleries Agent East Anglia',
        'Museums and Galleries wholesale',
        'V&A Museum cards wholesale',
        'V&A licensed art cards supplier',
        'sale or return Christmas cards',
        'charity Christmas cards wholesale',
        'licensed art cards supplier',
        'Museums and Galleries distributor',
        'V&A cards trade prices',
        'sale or return cards trade prices',
        'charity cards wholesale prices',
        'licensed greeting cards supplier',
        'East Anglia art cards wholesale',
        'East Anglian licensed art supplier',
        'local art cards wholesale supplier',
        'V&A Museum licensed products',
        'art-inspired cards supplier',
        'museum stationery distributor',
        'V&A Museum gifts supplier',
        'sale or return greeting cards',
        'charity Christmas cards supplier',
        'licensed art Christmas cards',
        'sale or return cards distributor',
        'charity cards trade prices',
        'sale or return cards supplier',
        'charity Christmas cards East Anglia',
        'sale or return cards UK',
        'charity cards wholesale UK',
        'V&A Museum products wholesale',
        'art-inspired stationery supplier',
        'museum licensed products'
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
            alt: 'Museums and Galleries - V&A Museum Cards, Sale or Return & Charity Christmas Cards'
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
    
    const locationMetadata = counties.map(county => ({
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
    
    const locationMetadata = counties.map(county => ({
      title: `Ohh Deer Sales Agent ${county} | Laura Ashley, Cath Kidston & V&A Cards in ${county}`,
      description: `Looking for an Ohh Deer sales agent in ${county}? We are the official supplier of Laura Ashley greeting cards, gift bags, and wrapping paper, Cath Kidston greeting cards and stationery, V&A Museum licensed products, and card display units in ${county}. Contact us for trade prices and local delivery.`,
      keywords: [
        `Ohh Deer Sales Agent ${county}`,
        `Ohh Deer Agent ${county}`,
        `Ohh Deer ${county}`,
        `Ohh Deer ${county} wholesaler`,
        `Laura Ashley cards ${county}`,
        `Laura Ashley gift bags ${county}`,
        `Laura Ashley wrapping paper ${county}`,
        `Cath Kidston cards ${county}`,
        `Cath Kidston stationery ${county}`,
        `V&A Museum cards ${county}`,
        `V&A licensed products ${county}`,
        `A6 greeting card spinners ${county}`,
        `card display units ${county}`,
        `greeting card racks ${county}`,
        `${county} Ohh Deer distributor`,
        `Ohh Deer local supplier ${county}`,
        `Laura Ashley trade prices ${county}`,
        `Cath Kidston trade prices ${county}`,
        `V&A cards trade prices ${county}`,
        `${county} wholesale Ohh Deer`,
        `card display retailer supplier ${county}`,
        `${county} Ohh Deer wholesale prices`,
        `Laura Ashley greeting cards ${county}`,
        `Laura Ashley gift wrap ${county}`,
        `Cath Kidston greeting cards ${county}`,
        `V&A Museum licensed art cards ${county}`,
        `vintage-inspired stationery ${county}`,
        `floral cards wholesale ${county}`,
        `art-inspired cards ${county}`,
        `Ohh Deer trade account ${county}`,
        `Laura Ashley stationery ${county}`,
        `Cath Kidston A6 cards ${county}`,
        `V&A Museum stationery ${county}`,
        `greeting card display solutions ${county}`,
        `card spinner wholesale ${county}`,
        `A6 display units distributor ${county}`,
        `card rack trade prices ${county}`,
        `spinner display supplier ${county}`,
        `Laura Ashley wholesale ${county}`,
        `Cath Kidston stationery wholesale ${county}`,
        `vintage cards supplier ${county}`,
        `floral stationery distributor ${county}`,
        `Laura Ashley gift bags wholesale ${county}`,
        `Laura Ashley wrapping paper trade ${county}`
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
        'Laura Ashley cards wholesale',
        'Laura Ashley gift bags supplier',
        'Laura Ashley wrapping paper wholesale',
        'Cath Kidston cards wholesale',
        'Cath Kidston stationery supplier',
        'A6 greeting card spinners',
        'card display units wholesale',
        'greeting card racks supplier',
        'Ohh Deer distributor',
        'Laura Ashley trade prices',
        'Cath Kidston trade prices',
        'A6 display wholesale prices',
        'greeting card spinners supplier',
        'East Anglia card displays wholesale',
        'East Anglian spinner supplier',
        'local card display wholesale supplier',
        'Laura Ashley greeting cards',
        'Laura Ashley gift wrap wholesale',
        'Laura Ashley stationery supplier',
        'Cath Kidston greeting cards',
        'vintage-inspired stationery',
        'floral cards wholesale',
        'A6 card spinner units',
        'greeting card display solutions',
        'card spinner wholesale',
        'A6 display units wholesale',
        'Laura Ashley wholesale supplier',
        'Cath Kidston stationery wholesale',
        'vintage cards supplier',
        'floral stationery distributor',
        'Laura Ashley gift bags trade',
        'Laura Ashley wrapping paper supplier',
        'Cath Kidston A6 cards',
        'vintage-inspired greeting cards',
        'floral stationery wholesale',
        'Laura Ashley display solutions',
        'Cath Kidston display solutions',
        'vintage card racks',
        'floral stationery supplier',
        'Laura Ashley gift wrap trade',
        'Laura Ashley stationery wholesale'
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
            alt: 'Ohh Deer - Laura Ashley & Cath Kidston Cards, Gift Wrap & Stationery'
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
    const baseTitle = `Peppermint Grove Sales Agent | Luxury Candles & Diffusers | Home Fragrance Wholesale`;
    const baseDescription = `Official Peppermint Grove sales agent and wholesale supplier in East Anglia. We supply luxury candles, diffusers, and home fragrance products to retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.`;
    
    const locationMetadata = counties.map(county => ({
      title: `Peppermint Grove Sales Agent ${county} | Luxury Candles & Diffusers in ${county}`,
      description: `Looking for a Peppermint Grove sales agent in ${county}? We are the official supplier of luxury candles, diffusers, and home fragrance products in ${county}. Contact us for trade prices and local delivery.`,
      keywords: [
        `Peppermint Grove Sales Agent ${county}`,
        `Peppermint Grove Agent ${county}`,
        `Peppermint Grove ${county}`,
        `Peppermint Grove ${county} wholesaler`,
        `luxury candles ${county}`,
        `home fragrance ${county}`,
        `diffusers wholesale ${county}`,
        `${county} Peppermint Grove distributor`,
        `Peppermint Grove local supplier ${county}`,
        `candles trade prices ${county}`,
        `${county} wholesale Peppermint Grove`,
        `diffusers retailer supplier ${county}`,
        `${county} Peppermint Grove wholesale prices`,
        `luxury home fragrance ${county}`,
        `room sprays ${county}`,
        `candles wholesale ${county}`,
        `Peppermint Grove trade account ${county}`,
        `home fragrance products ${county}`,
        `luxury candles wholesale ${county}`,
        `diffusers trade prices ${county}`,
        `room sprays wholesale ${county}`,
        `home fragrance supplier ${county}`,
        `luxury candles supplier ${county}`,
        `diffusers supplier ${county}`
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
        'diffusers trade prices',
        'Peppermint Grove distributor',
        'candles wholesale prices',
        'home fragrance supplier',
        'East Anglia candles wholesale',
        'East Anglian diffuser supplier',
        'local home fragrance supplier',
        'luxury candles wholesale',
        'diffusers supplier',
        'room sprays wholesale',
        'home fragrance products',
        'luxury candles East Anglia',
        'diffusers UK',
        'home fragrance wholesale UK',
        'Peppermint Grove candles',
        'luxury home fragrance',
        'diffusers wholesale',
        'room sprays supplier'
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
            alt: 'Peppermint Grove luxury candles and diffusers'
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
    const baseDescription = `Official Star Editions sales agent and wholesale supplier in East Anglia. We supply Richard Briggs and Dave Thompson greeting cards and gifts, along with bespoke merchandise and custom branding services. All products are UK-made with 5-day turnaround, available for retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.`;
    
    const locationMetadata = counties.map(county => ({
      title: `Star Editions Sales Agent ${county} | Richard Briggs & Dave Thompson Cards in ${county}`,
      description: `Looking for a Star Editions sales agent in ${county}? We are the official supplier of Richard Briggs and Dave Thompson greeting cards and gifts, plus bespoke merchandise and custom branding services. Low minimum orders with local delivery in ${county}.`,
      keywords: [
        `Star Editions Sales Agent ${county}`,
        `Star Editions Agent ${county}`,
        `Star Editions ${county}`,
        `Richard Briggs cards ${county}`,
        `Dave Thompson cards ${county}`,
        `Richard Briggs gifts ${county}`,
        `Dave Thompson gifts ${county}`,
        `bespoke merchandise ${county}`,
        `custom branding ${county}`,
        `UK made products ${county}`,
        `low volume manufacturing ${county}`,
        `quick turnaround ${county}`,
        `5 day delivery ${county}`,
        `custom products ${county}`,
        `branded merchandise ${county}`,
        `UK manufacturing ${county}`,
        `small batch production ${county}`,
        `custom design ${county}`,
        `bespoke gifts ${county}`,
        `branded gifts ${county}`,
        `custom packaging ${county}`,
        `local delivery ${county}`,
        `trade supplier ${county}`,
        `wholesale merchandise ${county}`,
        `custom products supplier ${county}`,
        `bespoke manufacturing ${county}`,
        `UK made gifts ${county}`,
        `quick production ${county}`,
        `custom branding service ${county}`,
        `bespoke product design ${county}`,
        `Richard Briggs trade prices ${county}`,
        `Dave Thompson trade prices ${county}`,
        `humorous cards ${county}`,
        `unique greeting cards ${county}`,
        `Richard Briggs wholesale ${county}`,
        `Dave Thompson wholesale ${county}`
      ]
    }));

    return {
      title: baseTitle,
      description: baseDescription,
      keywords: [
        ...locationMetadata.flatMap(m => m.keywords),
        'Star Editions Sales Agent',
        'Star Editions Agent East Anglia',
        'Star Editions wholesale',
        'Richard Briggs cards wholesale',
        'Dave Thompson cards wholesale',
        'Richard Briggs gifts supplier',
        'Dave Thompson gifts supplier',
        'bespoke merchandise UK',
        'custom branding service',
        'UK made products',
        'low volume manufacturing',
        'quick turnaround manufacturing',
        '5 day delivery UK',
        'custom products supplier',
        'branded merchandise wholesale',
        'UK manufacturing service',
        'small batch production',
        'custom design service',
        'bespoke gifts wholesale',
        'branded gifts supplier',
        'custom packaging service',
        'local delivery East Anglia',
        'trade supplier UK',
        'wholesale merchandise',
        'custom products East Anglia',
        'bespoke manufacturing UK',
        'UK made gifts wholesale',
        'quick production service',
        'custom branding East Anglia',
        'Richard Briggs trade prices',
        'Dave Thompson trade prices',
        'humorous cards wholesale',
        'unique greeting cards supplier',
        'Richard Briggs wholesale prices',
        'Dave Thompson wholesale prices',
        'East Anglia Richard Briggs cards',
        'East Anglia Dave Thompson cards',
        'East Anglia bespoke merchandise',
        'East Anglia custom branding'
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
            alt: 'Star Editions - Richard Briggs & Dave Thompson Cards, Bespoke UK-Made Merchandise'
          }
        ]
      },
      alternates: {
        canonical: `https://easalesltd.com/companies/star-editions`
      },
      robots: {
        index: true,
        follow: true
      }
    };
  }

  // Special handling for V&A Cards and Gifts
  if (company.slug === 'va-cards-and-gifts') {
    const baseTitle = `V&A Cards and Gifts Sales Agent | Licensed Museum Art Cards & Stationery | Wholesale Supplier`;
    const baseDescription = `Official V&A Cards and Gifts sales agent and wholesale supplier in East Anglia. We supply licensed V&A Museum art cards, stationery, and gifts to retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.`;
    
    const locationMetadata = counties.map(county => ({
      title: `V&A Cards and Gifts Sales Agent ${county} | Licensed Museum Art Cards & Stationery in ${county}`,
      description: `Looking for a V&A Cards and Gifts sales agent in ${county}? We are the official supplier of licensed V&A Museum art cards, stationery, and gifts in ${county}. Contact us for trade prices and local delivery.`,
      keywords: [
        `V&A Cards and Gifts Sales Agent ${county}`,
        `V&A Cards and Gifts Agent ${county}`,
        `V&A Cards and Gifts ${county}`,
        `V&A Cards and Gifts ${county} wholesaler`,
        `V&A Museum cards ${county}`,
        `licensed art cards ${county}`,
        `museum stationery ${county}`,
        `art-inspired gifts ${county}`,
        `${county} V&A Cards and Gifts distributor`,
        `V&A Cards and Gifts local supplier ${county}`,
        `museum cards trade prices ${county}`,
        `${county} wholesale V&A Cards and Gifts`,
        `art cards retailer supplier ${county}`,
        `${county} V&A Cards and Gifts wholesale prices`,
        `licensed museum cards ${county}`,
        `art stationery ${county}`,
        `museum gifts wholesale ${county}`,
        `V&A Cards and Gifts trade account ${county}`,
        `licensed art greeting cards ${county}`,
        `museum stationery wholesale ${county}`,
        `art-inspired cards distributor ${county}`,
        `museum cards trade prices ${county}`,
        `licensed art cards supplier ${county}`,
        `V&A Museum gifts supplier ${county}`
      ]
    }));

    return {
      title: baseTitle,
      description: baseDescription,
      keywords: [
        ...locationMetadata.flatMap(m => m.keywords),
        'V&A Cards and Gifts Sales Agent',
        'V&A Cards and Gifts Agent East Anglia',
        'V&A Cards and Gifts wholesale',
        'V&A Museum cards wholesale',
        'licensed art cards supplier',
        'museum stationery wholesale',
        'V&A Cards and Gifts distributor',
        'museum cards trade prices',
        'art cards wholesale prices',
        'licensed greeting cards supplier',
        'East Anglia museum cards wholesale',
        'East Anglian licensed art supplier',
        'local museum cards wholesale supplier',
        'V&A Museum licensed products',
        'art-inspired cards supplier',
        'museum stationery distributor',
        'licensed art cards trade prices',
        'V&A Museum gifts supplier',
        'museum cards East Anglia',
        'licensed art cards UK',
        'V&A Museum products wholesale UK'
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
            alt: 'V&A Cards and Gifts - Licensed Museum Art Cards & Stationery'
          }
        ]
      },
      alternates: {
        canonical: `https://easalesltd.com/companies/va-cards-and-gifts`
      },
      robots: {
        index: true,
        follow: true
      }
    };
  }

  // Default metadata generation for other companies
  const baseTitle = `${company.name} Sales Agent | Wholesale Supplier | East Anglian Sales LTD`;
  const baseDescription = `Official ${company.name} sales agent and wholesale supplier in East Anglia. ${company.description}`;
  
  // Generate location-specific metadata
  const locationMetadata = counties.map(county => ({
    title: `${company.name} Sales Agent ${county} | Local Supplier in ${county}`,
    description: `Looking for a ${company.name} sales agent in ${county}? We are the official supplier of ${company.name.toLowerCase()} products to retailers across ${county}. ${company.description}`,
    keywords: [
      `${company.name} Sales Agent ${county}`,
      `${company.name} Agent ${county}`,
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
      `${company.name} Sales Agent`,
      `${company.name} Agent East Anglia`,
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
      canonical: `https://easalesltd.com/companies/${company.slug}`
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
      '@type': ['Organization', 'LocalBusiness', 'WholesaleStore', 'SalesAgent'],
      '@id': `https://www.easalesltd.co.uk/companies/global-journey-gifts#organization`,
      'name': 'Global Journey Sales Agent - Retail Display Solutions for Tourist & Retail Attractions',
      'description': 'Official Global Journey sales agent and wholesale supplier of innovative retail display solutions and interactive gift products for gift shops, garden centres, museums, and tourist attractions in East Anglia. We provide high-performance spinner units, local delivery, and personal support across Essex, Suffolk, Norfolk, and Cambridgeshire.',
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
        'name': 'Global Journey Sales Agent - Retail Solutions for Tourist & Retail Attractions',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Gift Shop & Garden Centre Display Solutions',
              'description': 'Official Global Journey sales agent providing high-performance spinner units and interactive display solutions for gift shops and garden centres in East Anglia. Includes local delivery and personal support.',
              'brand': {
                '@type': 'Brand',
                'name': 'Global Journey'
              },
              'category': ['Retail Technology', 'Display Solutions', 'Gift Shop Solutions', 'Garden Centre Retail', 'East Anglia Retail', 'Sales Agent Services'],
              'offers': {
                '@type': 'Offer',
                'availability': 'https://schema.org/InStock',
                'deliveryLeadTime': 'P1D',
                'areaServed': counties.map(county => ({
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
              'name': 'Tourist Attraction & Museum Shop Solutions',
              'description': 'Official Global Journey sales agent providing specialized display solutions for museums, visitor centres, theme parks, and tourist attractions in East Anglia. Includes local delivery and personal support.',
              'brand': {
                '@type': 'Brand',
                'name': 'Global Journey'
              },
              'category': ['Tourist Attraction Retail', 'Museum Shop Solutions', 'Visitor Centre Displays', 'Theme Park Retail', 'East Anglia Retail', 'Sales Agent Services'],
              'offers': {
                '@type': 'Offer',
                'availability': 'https://schema.org/InStock',
                'deliveryLeadTime': 'P1D',
                'areaServed': counties.map(county => ({
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

  // Special handling for Museums and Galleries
  if (company.slug === 'museums-and-galleries') {
    return {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'LocalBusiness', 'WholesaleStore', 'SalesAgent'],
      '@id': `https://www.easalesltd.co.uk/companies/museums-and-galleries#organization`,
      'name': 'Museums and Galleries Sales Agent - Sale or Return Christmas Cards',
      'description': 'Official Museums and Galleries sales agent and supplier in East Anglia. We supply charity Christmas cards, licensed art cards, and sale or return greeting cards to retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.',
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
        'name': 'Museums and Galleries Sales Agent - Christmas Cards',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Sale or Return Christmas Cards',
              'description': 'Official Museums and Galleries sales agent providing high-quality sale or return Christmas cards.',
              'brand': {
                '@type': 'Brand',
                'name': 'Museums and Galleries'
              },
              'category': ['Greeting Cards', 'Christmas Cards', 'Sale or Return', 'Licensed Products', 'Sales Agent Services']
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
              'description': 'Official Museums and Galleries sales agent providing charity Christmas cards and licensed art cards.',
              'brand': {
                '@type': 'Brand',
                'name': 'Museums and Galleries'
              },
              'category': ['Greeting Cards', 'Christmas Cards', 'Charity Cards', 'Licensed Products', 'Sales Agent Services']
            },
            'areaServed': counties.map(county => ({
              '@type': 'State',
              'name': county
            }))
          }
        ]
      }
    };
  }

  // Special handling for Emotional Rescue
  if (company.slug === 'emotional-rescue') {
    return {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'LocalBusiness', 'WholesaleStore', 'SalesAgent'],
      '@id': `https://www.easalesltd.co.uk/companies/emotional-rescue#organization`,
      'name': 'Emotional Rescue Sales Agent - Alternative to Rosie Made A Thing',
      'description': 'Official Emotional Rescue sales agent and wholesale supplier in East Anglia. We supply unique, humorous greeting cards and gifts - a great alternative to Rosie Made A Thing. Available for retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.',
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
        'name': 'Emotional Rescue Sales Agent - Humorous Cards & Gifts',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Humorous Greeting Cards',
              'description': 'Official Emotional Rescue sales agent providing unique and humorous greeting cards - a great alternative to Rosie Made A Thing.',
              'brand': {
                '@type': 'Brand',
                'name': 'Emotional Rescue'
              },
              'category': ['Greeting Cards', 'Humorous Cards', 'Alternative Cards', 'Gift Cards', 'Sales Agent Services']
            },
            'areaServed': counties.map(county => ({
              '@type': 'State',
              'name': county
            }))
          }
        ]
      }
    };
  }

  // Special handling for Ohh Deer wholesale
  if (company.slug === 'ohh-deer-wholesale') {
    return {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'LocalBusiness', 'WholesaleStore', 'SalesAgent'],
      '@id': `https://www.easalesltd.co.uk/companies/ohh-deer-wholesale#organization`,
      'name': 'Ohh Deer Sales Agent - Laura Ashley & Cath Kidston Cards, Gift Wrap & Stationery',
      'description': 'Official Ohh Deer sales agent and wholesale supplier in East Anglia. We supply Laura Ashley greeting cards, gift bags, and wrapping paper, Cath Kidston greeting cards and stationery, and A6 greeting card spinners to retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.',
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
        'name': 'Ohh Deer Sales Agent - Laura Ashley, Cath Kidston & Card Display Solutions',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Laura Ashley Greeting Cards, Gift Bags & Wrapping Paper',
              'description': 'Official Ohh Deer sales agent providing Laura Ashley greeting cards, gift bags, and wrapping paper featuring beautiful floral and traditional designs.',
              'brand': {
                '@type': 'Brand',
                'name': 'Laura Ashley'
              },
              'category': ['Greeting Cards', 'Gift Bags', 'Wrapping Paper', 'Floral Design', 'Traditional Design', 'Sales Agent Services']
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
              'name': 'Cath Kidston Greeting Cards & Stationery',
              'description': 'Official Ohh Deer sales agent providing Cath Kidston greeting cards and stationery featuring iconic floral and vintage-inspired designs.',
              'brand': {
                '@type': 'Brand',
                'name': 'Cath Kidston'
              },
              'category': ['Greeting Cards', 'Stationery', 'Vintage Design', 'Floral Cards', 'Sales Agent Services']
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
              'name': 'A6 Greeting Card Spinners & Displays',
              'description': 'Official Ohh Deer sales agent providing high-quality A6 greeting card spinners and display units for retail stores.',
              'brand': {
                '@type': 'Brand',
                'name': 'Ohh Deer'
              },
              'category': ['Retail Displays', 'Card Spinners', 'A6 Displays', 'Greeting Card Solutions', 'Sales Agent Services']
            },
            'areaServed': counties.map(county => ({
              '@type': 'State',
              'name': county
            }))
          }
        ]
      }
    };
  }

  // Special handling for Peppermint Grove
  if (company.slug === 'peppermint-grove') {
    return {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'LocalBusiness', 'WholesaleStore', 'SalesAgent'],
      '@id': `https://www.easalesltd.co.uk/companies/peppermint-grove#organization`,
      'name': 'Peppermint Grove Sales Agent - Luxury Home Fragrance',
      'description': 'Official Peppermint Grove sales agent and wholesale supplier in East Anglia. We supply luxury candles, diffusers, and home fragrance products to retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.',
      'url': 'https://www.easalesltd.co.uk/companies/peppermint-grove',
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
        'name': 'Peppermint Grove Sales Agent - Product Catalog',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Peppermint Grove Luxury Candles',
              'description': 'Official Peppermint Grove sales agent providing high-quality luxury candles in various fragrances and sizes',
              'brand': {
                '@type': 'Brand',
                'name': 'Peppermint Grove'
              },
              'category': ['Home Fragrance', 'Luxury Candles', 'Sales Agent Services']
            }
          }
        ]
      }
    };
  }

  // Special handling for Star Editions
  if (company.slug === 'star-editions') {
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
                'areaServed': counties.map(county => ({
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
                'areaServed': counties.map(county => ({
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
                'areaServed': counties.map(county => ({
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
            'areaServed': counties.map(county => ({
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
            'areaServed': counties.map(county => ({
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