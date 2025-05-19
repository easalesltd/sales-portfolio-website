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

  const hasVideoBackground = [
    'museums-and-galleries', 
    'paper-salad', 
    'ohh-deer-wholesale',
    'boxer-gifts',
    'emotional-rescue',
    'peppermint-grove'
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
    '/images/companies/peppermint-grove/PGACore6_2059e7fb-a309-4078-a054-f9118e8a4a93_400x.jpeg'
  ] : [];

  const boxerGiftsImages = params.slug === 'boxer-gifts' ? [
    '/images/companies/boxer-gifts/OT2075_a70b.webp',
    '/images/companies/boxer-gifts/CO1012___MR_GOOD_LOOKIN__APRON___34_49a0.webp',
    '/images/companies/boxer-gifts/MU3131_4d24.webp',
    '/images/companies/boxer-gifts/YHU0838_Grumpy_Git_9b56.webp',
    '/images/companies/boxer-gifts/Untitled_550_550_px_4_.png'
  ] : [];

  const davidFischoffImages = params.slug === 'david-fischoff' ? [
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

  const content = (
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
                {params.slug === 'david-fischoff' && (
                  <div className="mb-8">
                    <ImageGallery images={davidFischoffImages} interval={5000} />
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