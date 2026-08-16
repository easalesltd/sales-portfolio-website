import type { Metadata } from 'next';
import { companies } from './data/companies';
import { getCspNonce } from './lib/csp-nonce';
import { getHomePageJsonLd } from './lib/home-page-json-ld';
import { HOME_PAGE_META_DESCRIPTION } from './lib/home-page-meta-description';
import HomeAboutSection from './components/home/HomeAboutSection';
import HomeFaqSection from './components/home/HomeFaqSection';
import HomeHeroSlideshow from './components/home/HomeHeroSlideshow';
import HomePartnerBrandsSection from './components/home/HomePartnerBrandsSection';

export const metadata: Metadata = {
  title: {
    absolute: 'East Anglian Sales LTD | Dave Langdon — Greeting Card & Gift Sales Agent',
  },
  description: HOME_PAGE_META_DESCRIPTION,
  alternates: {
    canonical: 'https://www.easalesltd.co.uk',
  },
  openGraph: {
    title: 'East Anglian Sales LTD | Dave Langdon — Greeting Card & Gift Sales Agent',
    description: HOME_PAGE_META_DESCRIPTION,
  },
  twitter: {
    title: 'East Anglian Sales LTD | Dave Langdon — Greeting Card & Gift Sales Agent',
    description: HOME_PAGE_META_DESCRIPTION,
  },
};

export default async function HomePage() {
  const nonce = await getCspNonce();

  return (
    <main className="min-h-screen">
      <script
        id="home-page-schema"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getHomePageJsonLd()),
        }}
      />

      <div className="h-[240px] max-h-[240px] md:h-[80vh] md:max-h-none min-h-[240px] md:min-h-[600px] w-full relative overflow-hidden bg-white md:bg-gradient-to-br md:from-blue-50 md:to-indigo-100 transition-shadow duration-500 md:hover:shadow-2xl motion-safe:md:transition-transform motion-safe:md:duration-300 motion-safe:md:hover:-translate-y-1">
        <div className="w-full h-full min-h-0">
          <HomeHeroSlideshow />
        </div>
      </div>

      <HomeAboutSection />

      <HomeFaqSection />

      <HomePartnerBrandsSection companies={companies} />
    </main>
  );
}
