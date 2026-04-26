import { companies } from './data/companies';
import HomeAboutSection from './components/home/HomeAboutSection';
import HomeHeroSlideshow from './components/home/HomeHeroSlideshow';
import HomePartnerBrandsSection from './components/home/HomePartnerBrandsSection';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="h-[240px] max-h-[240px] md:h-[80vh] md:max-h-none min-h-[240px] md:min-h-[600px] w-full relative overflow-hidden bg-white md:bg-gradient-to-br md:from-blue-50 md:to-indigo-100 transition-shadow duration-500 md:hover:shadow-2xl motion-safe:md:transition-transform motion-safe:md:duration-300 motion-safe:md:hover:-translate-y-1">
        <div className="w-full h-full min-h-0">
          <HomeHeroSlideshow />
        </div>
      </div>

      <HomeAboutSection />

      <HomePartnerBrandsSection companies={companies} />
    </main>
  );
}
