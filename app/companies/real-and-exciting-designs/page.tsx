import { Metadata } from 'next'
import Image from 'next/image'
import { companies } from '../../data/companies'
import OrderForm from '../[slug]/OrderForm'
import VideoBackground from '../../components/VideoBackground'
import ImageGallery from '../../components/ImageGallery'

const counties = ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire']

function generateCompanyMetadata(company: typeof companies[0]): Metadata {
  const baseTitle = `Real and Exciting Designs Sales Agent | Contemporary Fashion Led Greeting Cards & Gift Wrap | Wholesale Supplier`;
  const baseDescription = `Official Real and Exciting Designs sales agent and wholesale supplier in East Anglia. We supply contemporary fashion led greeting cards, gift wrap, and notebooks to retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.`;
  
  const locationMetadata = counties.map(county => ({
    title: `Real and Exciting Designs Sales Agent ${county} | Contemporary Greeting Cards & Gift Wrap in ${county}`,
    description: `Looking for a Real and Exciting Designs sales agent in ${county}? We are the official supplier of contemporary fashion led greeting cards, gift wrap, and notebooks in ${county}. Contact us for trade prices and local delivery.`,
    keywords: [
      `Real and Exciting Designs Sales Agent ${county}`,
      `Real and Exciting Designs Agent ${county}`,
      `Real and Exciting Designs ${county}`,
      `Real and Exciting Designs ${county} wholesaler`,
      `contemporary greeting cards ${county}`,
      `fashion led cards ${county}`,
      `gift wrap wholesale ${county}`,
      `notebooks wholesale ${county}`,
      `${county} Real and Exciting Designs distributor`,
      `Real and Exciting Designs local supplier ${county}`,
      `greeting cards trade prices ${county}`,
      `${county} wholesale Real and Exciting Designs`,
      `gift wrap retailer supplier ${county}`,
      `${county} Real and Exciting Designs wholesale prices`,
      `contemporary cards ${county}`,
      `fashion led notebooks ${county}`,
      `gift wrap wholesale ${county}`,
      `Real and Exciting Designs trade account ${county}`,
      `contemporary greeting cards wholesale ${county}`,
      `fashion led gift wrap ${county}`,
      `notebooks trade prices ${county}`,
      `greeting cards supplier ${county}`,
      `gift wrap supplier ${county}`,
      `notebooks supplier ${county}`
    ]
  }));

  return {
    title: baseTitle,
    description: baseDescription,
    keywords: [
      ...locationMetadata.flatMap(m => m.keywords),
      'Real and Exciting Designs Sales Agent',
      'Real and Exciting Designs Agent East Anglia',
      'Real and Exciting Designs wholesale',
      'contemporary greeting cards supplier',
      'fashion led cards wholesale',
      'gift wrap trade prices',
      'Real and Exciting Designs distributor',
      'greeting cards wholesale prices',
      'gift wrap supplier',
      'East Anglia notebooks wholesale',
      'East Anglian greeting cards supplier',
      'local gift wrap supplier',
      'contemporary greeting cards wholesale',
      'fashion led notebooks supplier',
      'gift wrap wholesale',
      'notebooks products',
      'contemporary cards East Anglia',
      'fashion led gift wrap UK',
      'notebooks wholesale UK',
      'Real and Exciting Designs greeting cards',
      'contemporary fashion led cards',
      'gift wrap wholesale',
      'notebooks supplier'
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
          alt: 'Real and Exciting Designs - Contemporary Fashion Led Greeting Cards & Gift Wrap'
        }
      ]
    },
    alternates: {
      canonical: `https://easalesltd.com/companies/real-and-exciting-designs`
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

function generateStructuredData(company: typeof companies[0]) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'WholesaleStore', 'SalesAgent'],
    '@id': `https://www.easalesltd.co.uk/companies/real-and-exciting-designs#organization`,
    'name': 'Real and Exciting Designs Sales Agent - Contemporary Fashion Led Greeting Cards & Gift Wrap',
    'description': 'Official Real and Exciting Designs sales agent and wholesale supplier in East Anglia. We supply contemporary fashion led greeting cards, gift wrap, and notebooks to retailers across Essex, Suffolk, Norfolk, and Cambridgeshire.',
    'url': 'https://www.easalesltd.co.uk/companies/real-and-exciting-designs',
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
      'name': 'Real and Exciting Designs Sales Agent - Product Catalog',
      'itemListElement': {
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Product',
          'name': 'Real and Exciting Designs Products',
          'description': 'Contemporary fashion led greeting cards, gift wrap, and notebooks designed and printed in England using FSC board.',
          'brand': {
            '@type': 'Brand',
            'name': 'Real and Exciting Designs'
          },
          'category': ['Greeting Cards', 'Gift Wrap', 'Notebooks', 'Stationery', 'East Anglia Retail']
        },
        'areaServed': counties.map(county => ({
          '@type': 'State',
          'name': county
        }))
      }
    }
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const company = companies.find((c) => c.slug === 'real-and-exciting-designs')
  if (!company) {
    return {
      title: 'Company Not Found',
      description: 'The requested company could not be found.'
    }
  }
  return generateCompanyMetadata(company)
}

export default async function CompanyPage() {
  const company = companies.find((c) => c.slug === 'real-and-exciting-designs')
  if (!company) {
    return <div>Company not found</div>
  }

  const detailedDescription = "Real and Exciting Designs was established in 1996 by textile designer Sarah Curedale-Raynor. Since then RED has gone on to create many ground-breaking ranges in the greeting card industry and is best known for its contemporary fashion led designs. All our products are designed and printed in England and use FSC board for cards & Envelopes. We sell extensively sold throughout the UK and exported worldwide to the USA, Australia, New Zealand, and Europe."

  const images = [
    '/images/companies/Real & Exciting Designs/a0ed6336-e2ad-4373-8cc7-a3631d177ceb.jpeg',
    '/images/companies/Real & Exciting Designs/c85f6dc5-1cb4-43f6-8eb5-fadd5bc56678.jpeg',
    '/images/companies/Real & Exciting Designs/6fa30e7a-4206-4982-afb3-228eee448a16.jpeg',
    '/images/companies/Real & Exciting Designs/acaf8625-698f-43fe-b3ce-34247404bb5d.jpeg'
  ]

  const structuredData = generateStructuredData(company)

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Company Information */}
            <div className="bg-white rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="h-60 relative mb-8 group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/10 group-hover:to-gray-50/20 transition-all duration-300" />
                <Image
                  src={company.logoUrl}
                  alt={`${company.name} logo`}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
              <div className="space-y-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-4 relative">
                  {company.name}
                  <div className="h-1 w-20 bg-blue-600 mt-2" />
                </h1>
                <p className="text-xl leading-relaxed text-gray-600">{detailedDescription}</p>

                {/* Image Gallery */}
                <div className="mt-12">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Product Gallery</h2>
                  <ImageGallery images={images} />
                </div>

                {/* Catalogue Download */}
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
            <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 relative">
                Place an Order
                <div className="h-1 w-16 bg-blue-600 mt-2" />
              </h2>
              <OrderForm companyName={company.name} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 