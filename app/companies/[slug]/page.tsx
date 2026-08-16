import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getCspNonce } from '@/app/lib/csp-nonce'
import { companies } from '../../data/companies'
import VideoBackground from '../../components/VideoBackground'
import { Company } from '@/app/lib/types'
import { partnerBrandLogoAlt } from '@/app/lib/partner-brand-logo-alt'
import { partnerBrandAgentDescription } from '@/app/lib/partner-brand-agent-description'
import { jsonLdMerchantOfferComplianceFields } from '@/app/lib/json-ld-merchant-offer-fields'

const OrderForm = dynamic(() => import('./OrderForm'), {
  loading: () => (
    <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
      Loading order form...
    </div>
  ),
})

const ImageGallery = dynamic(() => import('../../components/ImageGallery'), {
  loading: () => (
    <div className="h-64 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800" />
  ),
})

const ShowroomVideo = dynamic(() => import('../../components/ShowroomVideo'), {
  loading: () => (
    <div className="h-64 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800" />
  ),
})

// Add shuffle function at the top level
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const company = companies.find(c => c.slug === resolvedParams.slug);
  if (!company) {
    notFound();
  }

  // Brand-first metadata; agent coverage belongs in page body / org schema, not every title.
  const companyMetadata = {
    'museums-and-galleries': {
      title: 'Museums and Galleries | Art & Design-led Greeting Cards & Stationery',
      description:
        'Museums & Galleries — UK licensed art and design-led greetings cards and gift stationery. Includes Angela Harding, Peter Rabbit and Henry Fraser ranges for 2026.',
    },
    'paper-salad': {
      title: 'Paper Salad | Neon-Bright Hand-Painted Cards & Stationery',
      description:
        'Paper Salad wholesale greeting cards and chocolate — neon-bright, hand-painted designs from their Cheshire studio, printed in the UK.',
    },
    'ohh-deer': {
      title: 'Ohh Deer | Illustrated Cards, Stationery & Gifts',
      description:
        'Ohh Deer wholesale greeting cards, stationery, silly beans and gifts — including Cath Kidston and Laura Ashley greeting card ranges.',
    },
    'mint-publishing': {
      title: 'Mint Publishing | Funny Birthday & Captioned Greeting Cards',
      description:
        'Mint Publishing wholesale greeting cards — refreshingly different birthday, blank and captioned cards, including the official Katie Abey range.',
    },
    'global-journey-gifts': {
      title: 'Global Journey Gifts | Retail Gifts & Coin Dispenser Solutions',
      description:
        'Global Journey wholesale gifts on customised displays, plus coin dispenser machines for tourist attractions, museums, garden centres and visitor centres.',
    },
    'david-fischhoff': {
      title: 'David Fischhoff | Artificial Flowers & Memorial Ornaments',
      description:
        'David Fischhoff wholesale artificial flowers, grave ornaments and memorial products for independent retailers.',
    },
    'emotional-rescue': {
      title: 'Emotional Rescue | Unique & Innovative Greeting Cards',
      description:
        'Emotional Rescue wholesale greeting cards — unique, innovative designs for independent retailers.',
    },
    'boxer-gifts': {
      title: 'Boxer Gifts | Fun Wholesale Gift Items',
      description:
        'Boxer Gifts — designers and suppliers of unique, fun, quality wholesale gift items for independent retailers.',
    },
    'peppermint-grove': {
      title: 'Peppermint Grove | Luxury Home Fragrance & Bath Care',
      description:
        'Peppermint Grove luxury home fragrance and bath & body — handmade in Australia and presented in custom-designed glassware.',
    },
    'cgb-giftware': {
      title: 'CGB Giftware | High-Quality Gifts & Bespoke Giftware',
      description:
        'CGB Giftware (Container Group) — artisan glass, Enchanted Emporium and distinctive wholesale gift ranges for retailers.',
    },
    'cambridge-confectionery-company': {
      title: 'The Cambridge Confectionery Company | Handfinished Chocolate Gifts',
      description:
        'The Cambridge Confectionery Company — generously topped chocolate bars, gift collections and giant buttons, finished by hand.',
    },
    'star-editions': {
      title: 'Star Editions | Licensed Cards & Bespoke Giftware',
      description:
        'Star Editions wholesale licensed greeting cards and giftware — including Richard Briggs and Dave Thompson ranges, finished in the UK.',
    },
    'rudi-and-bear': {
      title: 'Rudi & Bear | Hand-Painted Neds for Independent Retailers',
      description:
        'Rudi & Bear wholesale — hand-painted Neds from Cornwall, plastic-free gift boxes, display stands and bespoke collabs for toy shops, gift shops, garden centres and visitor attractions.',
    },
  };

  const metadata = companyMetadata[resolvedParams.slug as keyof typeof companyMetadata];
  if (metadata) {
    const metaDescription =
      'description' in metadata && typeof metadata.description === 'string'
        ? metadata.description
        : partnerBrandAgentDescription(company);
    return {
      title: metadata.title,
      description: metaDescription,
      openGraph: {
        title: metadata.title,
        description: metaDescription,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: metadata.title,
        description: metaDescription,
      }
    };
  }

  // Special case for Museums and Galleries
  if (resolvedParams.slug === 'museums-and-galleries') {
    const title = 'Museums and Galleries Sales Agent | Official Wholesale Supplier in East Anglia';
    const description = partnerBrandAgentDescription(company);
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        url: `https://www.easalesltd.co.uk/companies/${company.slug}`,
        images: company.logoUrl ? [
          {
            url: `https://www.easalesltd.co.uk${company.logoUrl}`,
            width: 1200,
            height: 630,
            alt: `${company.name} Sales Agent`
          }
        ] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: company.logoUrl ? [`https://www.easalesltd.co.uk${company.logoUrl}`] : undefined,
      },
      alternates: {
        canonical: `https://www.easalesltd.co.uk/companies/${company.slug}`
      }
    };
  }

  // Generate metadata from company data if not present
  const title = `${company.name} Sales Agent | Wholesale Supplier in East Anglia`;
  const description = partnerBrandAgentDescription(company);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://www.easalesltd.co.uk/companies/${company.slug}`,
      images: company.logoUrl ? [
        {
          url: `https://www.easalesltd.co.uk${company.logoUrl}`,
          width: 1200,
          height: 630,
          alt: `${company.name} Sales Agent`
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: company.logoUrl ? [`https://www.easalesltd.co.uk${company.logoUrl}`] : undefined,
    },
    alternates: {
      canonical: `https://www.easalesltd.co.uk/companies/${company.slug}`
    }
  };
}

export async function generateStaticParams() {
  return companies.map((company) => ({
    slug: company.slug,
  }))
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const company = companies.find(c => c.slug === resolvedParams.slug);
  if (!company) {
    notFound();
  }

  const nonce = await getCspNonce();
  const structuredData = generateStructuredData(company);
  
  // Generate VideoObject schemas for company videos
  const videoSchemas = company.videos && company.videos.length > 0 
    ? company.videos.map((video, index) => ({
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        '@id': `https://www.easalesltd.co.uk/companies/${company.slug}#video-${index + 1}`,
        'name': `${company.name} Trade Show Video`,
        'description': `Trade show presentation and product showcase for ${company.name}`,
        'thumbnailUrl': `https://www.easalesltd.co.uk${company.logoUrl}`,
        // Google expects a timezone-qualified datetime (ISO 8601), not date-only.
        'uploadDate': '2024-01-01T00:00:00Z',
        'contentUrl': `https://www.easalesltd.co.uk${video}`,
        'embedUrl': `https://www.easalesltd.co.uk${video}`,
        'publisher': {
          '@type': 'Organization',
          'name': 'East Anglian Sales LTD',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://www.easalesltd.co.uk/images/logo.webp'
          }
        }
      }))
    : [];

  const allSchemas = [structuredData, ...videoSchemas];

  const hasVideoBackground = [
    'museums-and-galleries', 
    'ohh-deer',
    'boxer-gifts',
    'emotional-rescue',
    'peppermint-grove',
    'mint-publishing',
    'cgb-giftware'
  ].includes(resolvedParams.slug);

  // Define base image arrays
  const paperSaladBaseImages = resolvedParams.slug === 'paper-salad' ? [
    '/images/companies/paper-salad/official/colour-hub.jpg',
    '/images/companies/paper-salad/official/sunshine.jpg',
    '/images/companies/paper-salad/official/gold-dust.jpg',
    '/images/companies/paper-salad/official/hunky-dory.jpg',
    '/images/companies/paper-salad/official/cameo.jpg',
    '/images/companies/paper-salad/official/alchemy.jpg',
    '/images/companies/paper-salad/official/jamboree.jpg',
    '/images/companies/paper-salad/official/hoopla.jpg',
    '/images/companies/paper-salad/official/fleurescent.jpg',
    '/images/companies/paper-salad/official/birthday.jpg',
  ] : [];

  const emotionalRescueBaseImages = resolvedParams.slug === 'emotional-rescue' ? [
    '/images/companies/emotional-rescue/336207-IMG_3646-copy.jpeg',
    '/images/companies/emotional-rescue/emo_web.jpeg',
    '/images/companies/emotional-rescue/81J8YSOEzoL.jpeg',
    '/images/companies/emotional-rescue/519NuytaJ1L.jpeg',
    '/images/companies/emotional-rescue/613nPYonKsL.jpeg',
    '/images/companies/emotional-rescue/EMZFPW11768_600x.jpeg',
    '/images/companies/emotional-rescue/EMZFPW11770_600x.jpeg'
  ] : [];

  const museumsAndGalleriesBaseImages = resolvedParams.slug === 'museums-and-galleries' ? [
    '/images/companies/museums-and-galleries/official/range-cards.jpg',
    '/images/companies/museums-and-galleries/official/range-stationery.jpg',
    '/images/companies/museums-and-galleries/official/range-gift.jpg',
    '/images/companies/museums-and-galleries/official/range-square.jpeg',
    '/images/companies/museums-and-galleries/official/portrait-1.jpg',
    '/images/companies/museums-and-galleries/official/portrait-2.jpg',
    '/images/companies/museums-and-galleries/official/portrait-3.jpg',
    '/images/companies/museums-and-galleries/official/collection-1.jpg',
    '/images/companies/museums-and-galleries/official/collection-2.jpg',
    '/images/companies/museums-and-galleries/official/collection-3.jpg',
    '/images/companies/museums-and-galleries/official/collection-4.jpg',
  ] : [];

  const starEditionsBaseImages = resolvedParams.slug === 'star-editions' ? [
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

  const peppermintGroveBaseImages = resolvedParams.slug === 'peppermint-grove' ? [
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

  const boxerGiftsBaseImages = resolvedParams.slug === 'boxer-gifts' ? [
    '/images/companies/boxer-gifts/official/liar-liar.jpg',
    '/images/companies/boxer-gifts/official/squeezy-peas.jpg',
    '/images/companies/boxer-gifts/official/dancing-vase.jpg',
    '/images/companies/boxer-gifts/official/tulip-mug.jpg',
    '/images/companies/boxer-gifts/official/tequila-racers.jpg',
    '/images/companies/boxer-gifts/official/skinny-dippin.jpg',
    '/images/companies/boxer-gifts/official/deadly-blooms.jpg',
    '/images/companies/boxer-gifts/official/i-love-you-mummy.jpg',
    '/images/companies/boxer-gifts/official/serial-killers.jpg',
    '/images/companies/boxer-gifts/official/poop-book.jpg',
  ] : [];

  const davidFischhoffBaseImages = resolvedParams.slug === 'david-fischhoff' ? [
    '/images/companies/david-fischhoff/36.jpeg',
    '/images/companies/david-fischhoff/695.jpeg',
    '/images/companies/david-fischhoff/68.jpeg',
    '/images/companies/david-fischhoff/13.jpeg',
    '/images/companies/david-fischhoff/67.jpeg'
  ] : [];

  const ohhDeerBaseImages = resolvedParams.slug === 'ohh-deer' ? [
    '/images/companies/ohh-deer/Tiny-Notebooks-Web-Square.jpg',
    '/images/companies/ohh-deer/Cath-Kidston-Web-Asset-Square.jpg',
    '/images/companies/ohh-deer/Beth-Evans-Web-Asset-Square.jpg',
    '/images/companies/ohh-deer/Daily-Planners-Web-Asset-Square.jpg',
    '/images/companies/ohh-deer/Laura-Ashley-Web-Asset-Square.jpg',
    '/images/companies/ohh-deer/Screenshot 2025-11-24 at 12.18.16.png',
    '/images/companies/ohh-deer/Screenshot 2025-11-24 at 12.18.22.png',
    '/images/companies/ohh-deer/Screenshot 2025-11-24 at 12.18.27.png',
    '/images/companies/ohh-deer/ODFK13957-Frank-The-Frog-WEB (1).jpg'
  ] : [];

  const globalJourneyBaseImages = resolvedParams.slug === 'global-journey-gifts' ? [
    '/images/companies/global-journey/Screenshot 2025-05-17 at 08.34.04.png',
    '/images/companies/global-journey/Screenshot 2025-05-17 at 08.33.54.png',
    '/images/companies/global-journey/Screenshot 2025-05-17 at 08.33.48.png',
    '/images/companies/global-journey/Screenshot 2025-05-17 at 08.33.35.png',
    '/images/companies/global-journey/Screenshot 2025-05-17 at 08.33.13.png',
    '/images/companies/global-journey/Screenshot 2025-05-17 at 08.33.00.png'
  ] : [];


  const mintPublishingBaseImages = resolvedParams.slug === 'mint-publishing' ? [
    '/images/companies/mint-publishing/1-1-27.jpeg',
    '/images/companies/mint-publishing/1-1-26.jpeg',
    '/images/companies/mint-publishing/1-1-29.jpeg',
    '/images/companies/mint-publishing/1-1-25.jpeg',
    '/images/companies/mint-publishing/1-19.jpeg',
    '/images/companies/mint-publishing/1-30.jpeg',
    '/images/companies/mint-publishing/Screenshot 2025-12-19 at 23.23.28.png',
    '/images/companies/mint-publishing/Screenshot 2025-12-19 at 23.23.32.png',
    '/images/companies/mint-publishing/Screenshot 2025-12-19 at 23.23.44.png',
    '/images/companies/mint-publishing/Screenshot 2025-12-19 at 23.23.50.png',
    '/images/companies/mint-publishing/Screenshot 2025-12-19 at 23.24.26.png',
    '/images/companies/mint-publishing/Screenshot 2025-12-19 at 23.24.39.png',
    '/images/companies/mint-publishing/Screenshot 2025-12-19 at 23.24.50.png',
    '/images/companies/mint-publishing/Screenshot 2025-12-19 at 23.25.00.png',
    '/images/companies/mint-publishing/Screenshot 2025-12-19 at 23.27.07.png',
    '/images/companies/mint-publishing/Screenshot 2025-12-19 at 23.28.57.png',
    '/images/companies/mint-publishing/Screenshot 2025-12-19 at 23.29.11.png'
  ] : [];

  const cgbGiftwareBaseImages = resolvedParams.slug === 'cgb-giftware' ? [
    '/images/companies/CGB-Giftware/ArtisanGlass-01.jpg',
    '/images/companies/CGB-Giftware/Best Teacher Ever_03.jpg',
    '/images/companies/CGB-Giftware/BRAMBLE FARM-02.jpg',
    '/images/companies/CGB-Giftware/CGB Bespoke-01.jpg',
    '/images/companies/CGB-Giftware/CGB Bespoke-14.jpg',
    '/images/companies/CGB-Giftware/COASTAL LIVING-09.jpg',
    '/images/companies/CGB-Giftware/DAPPER SPORTS DIVISION-11.jpg',
    '/images/companies/CGB-Giftware/DAPPERCHAP2024-07.jpg',
    '/images/companies/CGB-Giftware/ENCHANTED EMPORIUM1.jpg'
  ] : [];

  const cambridgeConfectioneryCompanyBaseImages = resolvedParams.slug === 'cambridge-confectionery-company' ? [
    '/images/companies/the-cambridge-confectionery-company/Celebration-bar-600x600.png',
    '/images/companies/the-cambridge-confectionery-company/Fudge-Sundae-main-tile-600x600.jpeg',
    '/images/companies/the-cambridge-confectionery-company/Heart-Chocolates-600x600 (1).png',
    '/images/companies/the-cambridge-confectionery-company/Honeycomb-fudge-600x600.png',
    '/images/companies/the-cambridge-confectionery-company/IMG_7711-600x600.jpeg',
    '/images/companies/the-cambridge-confectionery-company/IMG_8071-600x600.jpeg',
    '/images/companies/the-cambridge-confectionery-company/Rocky-Road-fud-600x600.png',
    '/images/companies/the-cambridge-confectionery-company/Salted-Caramel-Product-683x600 (1).png',
    '/images/companies/the-cambridge-confectionery-company/Salted-Caramel-Product-683x600.png',
    '/images/companies/the-cambridge-confectionery-company/Salty-Sweet-nutty-treats-600x600.png',
    '/images/companies/the-cambridge-confectionery-company/Thank-you-Bar-600x600.png',
    '/images/companies/the-cambridge-confectionery-company/Toffe-Crunch-600x600.png'
  ] : [];

  const rudiAndBearBaseImages = resolvedParams.slug === 'rudi-and-bear' ? [
    '/images/companies/rudi-and-bear/official/wholesale-hero.jpg',
    '/images/companies/rudi-and-bear/official/neds.jpg',
    '/images/companies/rudi-and-bear/official/display.jpg',
    '/images/companies/rudi-and-bear/official/catalogue-cover.jpg',
    '/images/companies/rudi-and-bear/official/collab-inspo.png',
    '/images/companies/rudi-and-bear/official/locations.jpg',
    '/images/companies/rudi-and-bear/official/brand-message.jpg',
    '/images/companies/rudi-and-bear/official/characters.jpg',
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
  const mintPublishingImages = shuffleArray(mintPublishingBaseImages);
  const cgbGiftwareImages = shuffleArray(cgbGiftwareBaseImages);
  const cambridgeConfectioneryCompanyImages = shuffleArray(cambridgeConfectioneryCompanyBaseImages);
  const rudiAndBearImages = shuffleArray(rudiAndBearBaseImages);

  const companyPageLogoSrc = company.logoUrlDark ?? company.logoUrl;
  const useLightMarkOnDark = Boolean(company.logoUrlDark);
  const isCambridgeDarkBrand = resolvedParams.slug === 'cambridge-confectionery-company';
  const invertLightMarkOnDark =
    useLightMarkOnDark &&
    !isCambridgeDarkBrand &&
    resolvedParams.slug !== 'rudi-and-bear';

  const content = (
    <>
      {allSchemas.map((schema, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }}
        />
      ))}
      <div
        className={`min-h-screen pt-3 pb-12 sm:pt-5 md:py-12 ${
          isCambridgeDarkBrand ? 'bg-neutral-950' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Company Information */}
            <div
              className={`brand-card ${hasVideoBackground ? 'bg-white/90 backdrop-blur-md dark:bg-neutral-900/90' : 'dark:bg-neutral-900 dark:border dark:border-neutral-800'} rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl`}
            >
              <div
                className={`h-60 relative mb-8 group rounded-lg overflow-hidden ${
                  /* Always paint a dark field for logoUrlDark assets — not `dark:bg-*` only, or SSR/first paint is white-on-white (invisible) until JS adds html.dark */
                  useLightMarkOnDark ? 'bg-black' : ''
                }`}
              >
                {!useLightMarkOnDark && (
                  <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-gray-50/10 group-hover:to-gray-50/20 dark:to-transparent dark:group-hover:to-white/5 transition-all duration-300 pointer-events-none" />
                )}
                <Image
                  src={companyPageLogoSrc}
                  alt={partnerBrandLogoAlt(company.name)}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  className={`object-contain p-6 z-10 transition-transform duration-300 group-hover:scale-105 ${
                    /* logoUrlDark file is black artwork on transparent — invert so it reads as white on bg-black */
                    invertLightMarkOnDark
                      ? 'invert'
                      : useLightMarkOnDark
                        ? ''
                        : 'dark:brightness-0 dark:invert'
                  }`}
                />
              </div>
              <div className="space-y-6">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 relative">
                  {company.name}
                  {/* Dark bar on light SSR; switches with dark: when html.dark (Cambridge route) hydrates — avoids white-on-white flash */}
                  <div className="brand-rule h-1 w-28 mt-2 bg-neutral-950 dark:bg-white" />
                </h1>
                <p className="text-xl leading-relaxed text-gray-600 dark:text-neutral-300">{company.description}</p>
                
                <div className="mt-12">
                  {resolvedParams.slug === 'paper-salad' && (
                    <>
                      <div className="mb-8">
                        <ImageGallery images={paperSaladImages} interval={6000} />
                        <p className="mt-2 text-xs text-gray-500">
                          Range photography from{' '}
                          <a href="https://www.papersalad.com/" className="underline underline-offset-2" target="_blank" rel="noopener noreferrer">
                            Paper Salad
                          </a>
                          .
                        </p>
                      </div>
                      {company.videos && company.videos.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-2xl font-semibold text-gray-900 dark:text-neutral-100 mb-4">Trade Show Videos</h3>
                          {company.videos.map((video, index) => (
                            <div key={index} className="mb-4">
                              <ShowroomVideo 
                                videoSrc={video}
                                posterSrc={company.logoUrl}
                              />
                            </div>
                          ))}
                          <p className="text-sm text-gray-600 dark:text-neutral-400 mt-2 italic">
                            Watch our latest trade show presentations and product showcases.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                  {resolvedParams.slug === 'emotional-rescue' && (
                    <div className="mb-8">
                      <ImageGallery images={emotionalRescueImages} interval={5000} />
                    </div>
                  )}
                  {resolvedParams.slug === 'museums-and-galleries' && (
                    <>
                      <div className="mb-8">
                        <ImageGallery images={museumsAndGalleriesImages} interval={5500} />
                        <p className="mt-2 text-xs text-gray-500">
                          Range photography from{' '}
                          <a href="https://museumsgalleries.co.uk/" className="underline underline-offset-2" target="_blank" rel="noopener noreferrer">
                            Museums &amp; Galleries
                          </a>
                          .
                        </p>
                      </div>
                      {company.videos && company.videos.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-2xl font-semibold text-gray-900 dark:text-neutral-100 mb-4">Trade Show Videos</h3>
                          {company.videos.map((video, index) => (
                            <div key={index} className="mb-4">
                              <ShowroomVideo 
                                videoSrc={video}
                                posterSrc={company.logoUrl}
                              />
                            </div>
                          ))}
                          <p className="text-sm text-gray-600 dark:text-neutral-400 mt-2 italic">
                            Watch our latest trade show presentations and product showcases.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                  {resolvedParams.slug === 'star-editions' && (
                    <div className="mb-8">
                      <ImageGallery images={starEditionsImages} interval={5000} />
                    </div>
                  )}
                  {resolvedParams.slug === 'peppermint-grove' && (
                    <div className="mb-8">
                      <ImageGallery images={peppermintGroveImages} interval={5500} />
                    </div>
                  )}
                  {resolvedParams.slug === 'boxer-gifts' && (
                    <div className="mb-8">
                      <ImageGallery images={boxerGiftsImages} interval={5000} />
                      <p className="mt-2 text-xs text-gray-500">
                        Product photography from{' '}
                        <a href="https://www.boxergifts.com/" className="underline underline-offset-2" target="_blank" rel="noopener noreferrer">
                          Boxer Gifts
                        </a>
                        .
                      </p>
                    </div>
                  )}
                  {resolvedParams.slug === 'david-fischhoff' && (
                    <div className="mb-8">
                      <ImageGallery images={davidFischhoffImages} interval={5000} />
                    </div>
                  )}
                  {resolvedParams.slug === 'ohh-deer' && (
                    <>
                      <div className="mb-8">
                        <ImageGallery images={ohhDeerImages} interval={5500} />
                      </div>
                      {company.videos && company.videos.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-2xl font-semibold text-gray-900 dark:text-neutral-100 mb-4">Trade Show Videos</h3>
                          {company.videos.map((video, index) => (
                            <div key={index} className="mb-4">
                              <ShowroomVideo 
                                videoSrc={video}
                                posterSrc={company.logoUrl}
                              />
                            </div>
                          ))}
                          <p className="text-sm text-gray-600 dark:text-neutral-400 mt-2 italic">
                            Watch our latest trade show presentations and product showcases.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                  {resolvedParams.slug === 'global-journey-gifts' && (
                    <div className="mb-8">
                      <ImageGallery images={globalJourneyImages} interval={5500} />
                    </div>
                  )}
                  {resolvedParams.slug === 'mint-publishing' && (
                    <>
                      <div className="mb-8">
                        <ImageGallery images={mintPublishingImages} interval={5000} />
                      </div>
                      {company.videos && company.videos.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-2xl font-semibold text-gray-900 dark:text-neutral-100 mb-4">Trade Show Videos</h3>
                          {company.videos.map((video, index) => (
                            <div key={index} className="mb-4">
                              <ShowroomVideo 
                                videoSrc={video}
                                posterSrc={company.logoUrl}
                              />
                            </div>
                          ))}
                          <p className="text-sm text-gray-600 dark:text-neutral-400 mt-2 italic">
                            Watch our latest trade show presentations and product showcases.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                  {resolvedParams.slug === 'cgb-giftware' && (
                    <>
                      <div className="mb-8">
                        <ImageGallery images={cgbGiftwareImages} interval={5500} />
                      </div>
                      <div className="mb-8">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-neutral-100 mb-4">Showroom Tour</h3>
                        <ShowroomVideo 
                          videoSrc="/images/companies/CGB-Giftware/Showroom Tour.mp4"
                          posterSrc="/images/companies/CGB-Giftware/CGB Bespoke-01.jpg"
                        />
                        <p className="text-sm text-gray-600 dark:text-neutral-400 mt-2 italic">
                          Take a virtual tour of our showroom to see our beautiful giftware collections in detail.
                        </p>
                      </div>
                    </>
                  )}
                  {resolvedParams.slug === 'cambridge-confectionery-company' && (
                    <div className="mb-8">
                      <ImageGallery images={cambridgeConfectioneryCompanyImages} interval={5000} />
                    </div>
                  )}
                  {resolvedParams.slug === 'rudi-and-bear' && (
                    <div className="mb-8">
                      <ImageGallery images={rudiAndBearImages} interval={5500} />
                      <p className="mt-2 text-xs text-gray-500">
                        Wholesale photography from{' '}
                        <a href="https://rudiandbear.co.uk/pages/wholesale" className="underline underline-offset-2" target="_blank" rel="noopener noreferrer">
                          Rudi &amp; Bear
                        </a>
                        . Watch how Ned is made on{' '}
                        <a href="https://youtu.be/ZD7nWVt-Q74" className="underline underline-offset-2" target="_blank" rel="noopener noreferrer">
                          YouTube
                        </a>
                        .
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                  {company.catalogueUrl && company.catalogueUrl.trim() !== '' && (
                    <a
                      href={company.catalogueUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={
                        isCambridgeDarkBrand
                          ? 'brand-cta inline-flex items-center px-6 py-3 border-2 border-neutral-950 text-base font-medium rounded-xl shadow-sm text-neutral-950 bg-white hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-950 dark:border-white dark:focus:ring-white dark:focus:ring-offset-neutral-900 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5'
                          : 'brand-cta inline-flex items-center px-6 py-3 border border-neutral-950 text-base font-medium rounded-xl shadow-sm text-white bg-neutral-950 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-950 dark:focus:ring-offset-neutral-900 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5'
                      }
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
                  )}
                  {company.websiteUrl && company.websiteUrl.trim() !== '' && (
                    <a
                      href={company.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="brand-cta inline-flex items-center px-6 py-3 border text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                    >
                      Visit {company.name}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Order Form */}
            <div
              className={`brand-card ${hasVideoBackground ? 'bg-white/80 backdrop-blur-sm dark:bg-neutral-900/90' : 'bg-white dark:bg-neutral-900'} rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl dark:border dark:border-neutral-800`}
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-neutral-100 mb-6 relative">
                Place an Order
                <div className="brand-rule h-1 w-16 mt-2 bg-neutral-950 dark:bg-white" />
              </h2>
              <OrderForm companyName={company.name} companySlug={company.slug} invertedPrimaryButtons={isCambridgeDarkBrand} />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (hasVideoBackground) {
    const videoPath = `/videos/companies/${resolvedParams.slug}/background.mp4`;
    const playbackRate = resolvedParams.slug === 'cgb-giftware' ? 0.5 : 1.0; // Slow down CGB Giftware video to half speed
    
    return (
      <VideoBackground videoUrl={videoPath} playbackRate={playbackRate}>
        {content}
      </VideoBackground>
    );
  }

  return content;
}

const SITE_ORIGIN = 'https://www.easalesltd.co.uk';

/** Product snippets require `image`; use logo + optional hero product shot per brand. */
function productSchemaImages(company: Company): string[] {
  const logo = `${SITE_ORIGIN}${company.logoUrl}`;
  const heroBySlug: Partial<Record<Company['slug'], string>> = {
    'peppermint-grove': `${SITE_ORIGIN}/images/companies/peppermint-grove/PGA_Uk_Diffuser_Category_d8e301ee-42b8-4ef0-9d68-5221f68c83b3.jpeg`,
    'rudi-and-bear': `${SITE_ORIGIN}/images/companies/rudi-and-bear/official/display.jpg`,
  };
  const hero = heroBySlug[company.slug];
  return hero && hero !== logo ? [hero, logo] : [logo];
}

function generateStructuredData(company: Company) {
  const offerCompliance = jsonLdMerchantOfferComplianceFields()
  const companyStructuredData = {
    'museums-and-galleries': {
      name: 'Museums and Galleries Greeting Cards - Art & Design-led Cards Supplier in East Anglia, Hertfordshire & Cambridgeshire',
      description: 'Licensed art and design-led greetings cards and gift stationery from the UK\'s leading publisher. Specializing in museum and gallery inspired designs.',
      categories: [
        'Greeting Cards',
        'Art Cards',
        'Design-led Cards',
        'Museum Cards',
        'Gallery Cards',
        'Licensed Cards',
        'Contemporary Cards',
        'Modern Cards',
        'Premium Cards',
        'Luxury Cards',
        'High-end Cards',
        'Quality Cards',
        'Unique Cards',
        'Exclusive Cards',
        'Specialist Cards',
        'Boutique Cards',
        'Independent Cards',
        'Artisan Cards',
        'Craft Cards',
        'Handcrafted Cards',
        'Bespoke Cards',
        'Custom Cards',
        'Personalized Cards',
        'Tailored Cards',
        'East Anglia Retail',
        'Hertfordshire Retail',
        'Cambridgeshire Retail'
      ]
    },
    'paper-salad': {
      name: 'Paper Salad Greeting Cards - Contemporary Design-led Cards in East Anglia, Hertfordshire & Cambridgeshire',
      description: 'Contemporary greeting cards and stationery with unique, modern designs. Specializing in creative and innovative card designs.',
      categories: [
        'Greeting Cards',
        'Contemporary Cards',
        'Design-led Cards',
        'Modern Cards',
        'Unique Cards',
        'Creative Cards',
        'Innovative Cards',
        'Stylish Cards',
        'Trendy Cards',
        'Fashionable Cards',
        'Designer Cards',
        'Boutique Cards',
        'Independent Cards',
        'Artisan Cards',
        'Craft Cards',
        'Handcrafted Cards',
        'Bespoke Cards',
        'Custom Cards',
        'Personalized Cards',
        'Tailored Cards',
        'East Anglia Retail',
        'Hertfordshire Retail',
        'Cambridgeshire Retail'
      ]
    },
    'ohh-deer': {
      name: 'Ohh Deer Greeting Cards - Illustrated Cards & Stationery in East Anglia, Hertfordshire & Cambridgeshire',
      description: 'Fun and quirky greeting cards, stationery, and gifts with unique illustrations. Official supplier of Cath Kidston and Laura Ashley greeting cards and stationery.',
      categories: [
        'Greeting Cards',
        'Illustrated Cards',
        'Funny Cards',
        'Humorous Cards',
        'Quirky Cards',
        'Playful Cards',
        'Whimsical Cards',
        'Cute Cards',
        'Adorable Cards',
        'Sweet Cards',
        'Lovely Cards',
        'Charming Cards',
        'Delightful Cards',
        'Cheerful Cards',
        'Joyful Cards',
        'Happy Cards',
        'Fun Cards',
        'Entertaining Cards',
        'Amusing Cards',
        'Comical Cards',
        'Witty Cards',
        'Clever Cards',
        'Smart Cards',
        'Intelligent Cards',
        'Creative Cards',
        'Innovative Cards',
        'Unique Cards',
        'Original Cards',
        'Distinctive Cards',
        'Special Cards',
        'Exclusive Cards',
        'Premium Cards',
        'Quality Cards',
        'High-end Cards',
        'Luxury Cards',
        'Designer Cards',
        'Boutique Cards',
        'Independent Cards',
        'Artisan Cards',
        'Craft Cards',
        'Handcrafted Cards',
        'Bespoke Cards',
        'Custom Cards',
        'Personalized Cards',
        'Tailored Cards',
        'Cath Kidston Cards',
        'Laura Ashley Cards',
        'East Anglia Retail',
        'Hertfordshire Retail',
        'Cambridgeshire Retail'
      ]
    },
    'mint-publishing': {
      name: 'Mint Publishing Greeting Cards - Funny & Captioned Cards in East Anglia, Hertfordshire & Cambridgeshire',
      description: 'Funny and refreshingly different birthday, blank, and captioned greetings cards. Specializing in humorous and witty card designs.',
      categories: [
        'Greeting Cards',
        'Funny Cards',
        'Humorous Cards',
        'Comical Cards',
        'Witty Cards',
        'Clever Cards',
        'Smart Cards',
        'Intelligent Cards',
        'Amusing Cards',
        'Entertaining Cards',
        'Hilarious Cards',
        'Laugh-out-loud Cards',
        'Side-splitting Cards',
        'Rib-tickling Cards',
        'Knee-slapping Cards',
        'Belly-laugh Cards',
        'Chuckle-inducing Cards',
        'Giggle-worthy Cards',
        'Smile-provoking Cards',
        'Joy-bringing Cards',
        'Cheer-spreading Cards',
        'Mood-lifting Cards',
        'Spirit-raising Cards',
        'Heart-warming Cards',
        'Soul-touching Cards',
        'Emotion-evoking Cards',
        'Feeling-expressing Cards',
        'Sentiment-conveying Cards',
        'Message-delivering Cards',
        'Communication-enhancing Cards',
        'Connection-fostering Cards',
        'Relationship-strengthening Cards',
        'Bond-deepening Cards',
        'Friendship-celebrating Cards',
        'Love-expressing Cards',
        'Care-showing Cards',
        'Appreciation-demonstrating Cards',
        'Gratitude-expressing Cards',
        'Thanks-giving Cards',
        'Congratulation-offering Cards',
        'Celebration-marking Cards',
        'Achievement-recognizing Cards',
        'Success-acknowledging Cards',
        'Milestone-commemorating Cards',
        'Memory-creating Cards',
        'Moment-capturing Cards',
        'East Anglia Retail',
        'Hertfordshire Retail',
        'Cambridgeshire Retail'
      ]
    },
    'global-journey-gifts': {
      name: 'Global Journey Sales Agent - Official Supplier in East Anglia, Hertfordshire & Cambridgeshire',
      description: 'Unique and original gift ranges with customised displays for tourist attractions, museums, and visitor centres.',
      categories: ['Gifts', 'Tourist Attractions', 'Museum Gifts', 'Retail Solutions', 'East Anglia Retail', 'Hertfordshire Retail', 'Cambridgeshire Retail']
    },
    'david-fischhoff': {
      name: 'David Fischhoff Sales Agent - Official Supplier in East Anglia, Hertfordshire & Cambridgeshire',
      description: 'Artistic greeting cards and designs.',
      categories: ['Greeting Cards', 'Art Cards', 'Design-led Cards', 'East Anglia Retail', 'Hertfordshire Retail', 'Cambridgeshire Retail']
    },
    'emotional-rescue': {
      name: 'Emotional Rescue Greeting Cards - Contemporary Cards in East Anglia, Hertfordshire & Cambridgeshire',
      description: 'Contemporary greeting cards and stationery with modern, stylish designs. Specializing in elegant and sophisticated card designs.',
      categories: [
        'Greeting Cards',
        'Contemporary Cards',
        'Modern Cards',
        'Current Cards',
        'Present-day Cards',
        'Up-to-date Cards',
        'Trendy Cards',
        'Fashionable Cards',
        'Stylish Cards',
        'Chic Cards',
        'Elegant Cards',
        'Sophisticated Cards',
        'Refined Cards',
        'Polished Cards',
        'Classy Cards',
        'Upscale Cards',
        'Premium Cards',
        'High-end Cards',
        'Luxury Cards',
        'Quality Cards',
        'Excellent Cards',
        'Superior Cards',
        'Exceptional Cards',
        'Outstanding Cards',
        'Remarkable Cards',
        'Notable Cards',
        'Distinctive Cards',
        'Unique Cards',
        'Original Cards',
        'Creative Cards',
        'Innovative Cards',
        'Imaginative Cards',
        'Inventive Cards',
        'Artistic Cards',
        'Designer Cards',
        'Boutique Cards',
        'Independent Cards',
        'Artisan Cards',
        'Craft Cards',
        'Handcrafted Cards',
        'Bespoke Cards',
        'Custom Cards',
        'Personalized Cards',
        'Tailored Cards',
        'East Anglia Retail',
        'Hertfordshire Retail',
        'Cambridgeshire Retail'
      ]
    },
    'rudi-and-bear': {
      name: 'Rudi & Bear Sales Agent - Hand-Painted Neds in East Anglia, Hertfordshire & Cambridgeshire',
      description: 'Hand-painted collectable Neds from Cornwall, plastic-free packaging, retail display stands and bespoke collaborations for independent retailers.',
      categories: [
        'Collectable Gifts',
        'Hand-painted Gifts',
        "Children's Gifts",
        'Toy Shop Gifts',
        'Visitor Attraction Gifts',
        'Garden Centre Gifts',
        'East Anglia Retail',
        'Hertfordshire Retail',
        'Cambridgeshire Retail'
      ]
    },
    'boxer-gifts': {
      name: 'Boxer Gifts Sales Agent - Official Supplier in East Anglia, Hertfordshire & Cambridgeshire',
      description: 'Quality giftware and retail solutions.',
      categories: ['Giftware', 'Retail Solutions', 'East Anglia Retail', 'Hertfordshire Retail', 'Cambridgeshire Retail']
    },
    'peppermint-grove': {
      name: 'Peppermint Grove Sales Agent - Official Supplier in East Anglia, Hertfordshire & Cambridgeshire',
      description: 'Luxury home fragrance including candles and diffusers.',
      categories: ['Home Fragrance', 'Candles', 'Diffusers', 'East Anglia Retail', 'Hertfordshire Retail', 'Cambridgeshire Retail']
    },
    'star-editions': {
      name: 'Star Editions Greeting Cards - Licensed Cards & Gifts in East Anglia, Hertfordshire & Cambridgeshire',
      description: 'Licensed greeting cards and gifts from well-known brands and properties. Specializing in official and authorized card designs.',
      categories: [
        'Greeting Cards',
        'Licensed Cards',
        'Branded Cards',
        'Official Cards',
        'Authorized Cards',
        'Certified Cards',
        'Approved Cards',
        'Endorsed Cards',
        'Recognized Cards',
        'Established Cards',
        'Reputable Cards',
        'Trusted Cards',
        'Reliable Cards',
        'Dependable Cards',
        'Consistent Cards',
        'Quality Cards',
        'Excellent Cards',
        'Superior Cards',
        'Exceptional Cards',
        'Outstanding Cards',
        'Remarkable Cards',
        'Notable Cards',
        'Distinctive Cards',
        'Unique Cards',
        'Original Cards',
        'Creative Cards',
        'Innovative Cards',
        'Imaginative Cards',
        'Inventive Cards',
        'Artistic Cards',
        'Designer Cards',
        'Boutique Cards',
        'Independent Cards',
        'Artisan Cards',
        'Craft Cards',
        'Handcrafted Cards',
        'Bespoke Cards',
        'Custom Cards',
        'Personalized Cards',
        'Tailored Cards',
        'East Anglia Retail',
        'Hertfordshire Retail',
        'Cambridgeshire Retail'
      ]
    },
    'cgb-giftware': {
      name: 'CGB Giftware (Container Group) Sales Agent - Bespoke Giftware & Artisan Collections in East Anglia, Hertfordshire & Cambridgeshire',
      description: 'Beautiful, high-quality giftware and bespoke gift solutions from Container Group. Specializing in artisan glass collections, enchanted emporium ranges, and unique distinctive gifts.',
      categories: [
        'Giftware',
        'Container Group Gifts',
        'Container Group Giftware',
        'CGB Giftware',
        'Bespoke Giftware',
        'Artisan Giftware',
        'Unique Giftware',
        'Distinctive Giftware',
        'Quality Giftware',
        'Premium Giftware',
        'Luxury Giftware',
        'High-end Giftware',
        'Boutique Giftware',
        'Specialist Giftware',
        'Exclusive Giftware',
        'Designer Giftware',
        'Contemporary Giftware',
        'Modern Giftware',
        'Stylish Giftware',
        'Elegant Giftware',
        'Sophisticated Giftware',
        'Refined Giftware',
        'Artisan Glass Collections',
        'Enchanted Emporium Gifts',
        'Bramble Farm Collection',
        'Glossary and Glow Gifts',
        'Winter Robin Collection',
        'Best Teacher Gifts',
        'Bespoke Gift Solutions',
        'Custom Giftware',
        'Personalized Gifts',
        'Tailored Gift Solutions',
        'Wholesale Giftware',
        'Trade Giftware',
        'Retail Giftware',
        'Gift Shop Supplies',
        'Gift Store Products',
        'Gift Boutique Items',
        'Gift Emporium Products',
        'Gift Gallery Items',
        'Gift Showroom Products',
        'East Anglia Retail',
        'Hertfordshire Retail',
        'Cambridgeshire Retail'
      ]
    },
    'cambridge-confectionery-company': {
      name: 'The Cambridge Confectionery Company & Calico Cottage Sales Agent - Wholesale Chocolate & Confectionery in East Anglia',
      description: 'Chocolate, made to be seen. Family-owned and proudly independent, we create generously topped bars, beautifully boxed gift collections and signature giant buttons, finished by hand so every piece looks as good as it tastes. Also known as Calico Cottage.',
      categories: [
        'The Cambridge Confectionery Company',
        'Calico Cottage',
        'Confectionery',
        'Chocolate',
        'Wholesale Confectionery',
        'Sweet Treats',
        'Gifts',
        'Confectionery Products',
        'East Anglia Retail',
        'Cambridgeshire Retail',
        'Hertfordshire Retail',
        'Suffolk Retail',
        'Norfolk Retail',
        'Essex Retail'
      ]
    }
  };

  const data = companyStructuredData[company.slug as keyof typeof companyStructuredData];
  if (data) {
    return {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'LocalBusiness', 'WholesaleStore', 'SalesAgent'],
      '@id': `https://www.easalesltd.co.uk/companies/${company.slug}#organization`,
      'name': data.name,
      'description': partnerBrandAgentDescription(company),
      'url': `https://www.easalesltd.co.uk/companies/${company.slug}`,
      'logo': {
        '@type': 'ImageObject',
        'url': `${SITE_ORIGIN}${company.logoUrl}`,
        'width': '800',
        'height': '600'
      },
      'areaServed': ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire', 'Hertfordshire'].map(county => ({
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
            'description': data.description,
            'image': productSchemaImages(company),
            'brand': {
              '@type': 'Brand',
              'name': company.name
            },
            'category': data.categories,
            'offers': {
              '@type': 'Offer',
              ...offerCompliance,
              'priceCurrency': 'GBP',
              'price': '0.00',
              'availability': 'https://schema.org/InStock',
              'url': `https://www.easalesltd.co.uk/companies/${company.slug}`,
              'seller': {
                '@type': 'Organization',
                'name': 'East Anglian Sales LTD'
              }
            }
          },
          'areaServed': ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire', 'Hertfordshire'].map(county => ({
            '@type': 'State',
            'name': county
          }))
        }
      }
    };
  }

  // Fallback to default structured data if no specific case exists
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'WholesaleStore', 'SalesAgent'],
    '@id': `https://www.easalesltd.co.uk/companies/${company.slug}#organization`,
    'name': `${company.name} Sales Agent - Wholesale Supplier in East Anglia`,
    'description': partnerBrandAgentDescription(company),
    'url': `https://www.easalesltd.co.uk/companies/${company.slug}`,
    'logo': {
      '@type': 'ImageObject',
      'url': `${SITE_ORIGIN}${company.logoUrl}`,
      'width': '800',
      'height': '600'
    },
    'areaServed': ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire', 'Hertfordshire'].map(county => ({
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
            'description': partnerBrandAgentDescription(company),
            'image': productSchemaImages(company),
            'brand': {
              '@type': 'Brand',
              'name': company.name
            },
            'category': ['Sales Agent Services', 'Wholesale Products', 'East Anglia Retail'],
            'offers': {
              '@type': 'Offer',
              ...offerCompliance,
              'priceCurrency': 'GBP',
              'price': '0.00',
              'availability': 'https://schema.org/InStock',
              'url': `https://www.easalesltd.co.uk/companies/${company.slug}`,
              'seller': {
                '@type': 'Organization',
                'name': 'East Anglian Sales LTD'
              }
            }
          },
          'areaServed': ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire', 'Hertfordshire'].map(county => ({
            '@type': 'State',
            'name': county
          }))
        }
      ]
    }
  };
}