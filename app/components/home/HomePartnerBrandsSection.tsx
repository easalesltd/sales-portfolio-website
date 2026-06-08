'use client';

import type { Company } from '../../data/companies';
import FadeInOnScroll from '../FadeInOnScroll';
import PartnerBrandTile from '../PartnerBrandTile';
import VideoBackground from '../VideoBackground';

type Props = {
  companies: Company[];
};

/** Partner brands block: video background + scroll motion (same UX as before homepage split). */
export default function HomePartnerBrandsSection({ companies }: Props) {
  return (
    <div id="partner-brands" className="relative min-h-screen">
      <VideoBackground videoUrl="/videos/brands-background.mp4">
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <FadeInOnScroll>
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Partner Brands</h2>
            </FadeInOnScroll>
            <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
              {companies.map((company, index) => (
                <FadeInOnScroll
                  key={company.id}
                  delay={0.1 * (index % 6)}
                  className="h-full min-h-0 w-full"
                >
                  <PartnerBrandTile company={company} />
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </div>
      </VideoBackground>
    </div>
  );
}
