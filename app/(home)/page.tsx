'use client';

import Link from "next/link";
import { useState } from "react";
import { companies } from "../data/companies";
import ShowcaseSlideshow from "../components/ShowcaseSlideshow";
import VideoBackground from "../components/VideoBackground";
import FadeInOnScroll from "../components/FadeInOnScroll";
import RequestVisitForm from "../components/RequestVisitForm";
import PartnerBrandCard from "../components/PartnerBrandCard";

export default function Home() {
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  return (
    <main className="min-h-screen">
      {/* Hero Section with Showcase Slideshow */}
      <div className="h-[240px] max-h-[240px] md:h-[80vh] md:max-h-none min-h-[240px] md:min-h-[600px] w-full relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-full h-full min-h-0">
          <ShowcaseSlideshow />
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeInOnScroll>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Dave Langdon - Serving Retailers Across East Anglia</h1>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.2}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Greeting Cards & Gifts for the Wholesale Trade</h2>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.3}>
            <p className="text-lg text-gray-700 mb-6">
              Based in Ipswich, Suffolk, I've spent over a decade supplying quality greeting cards, stationery, and gifts to retailers across East Anglia. From charming independent shops to bustling garden centres, I help retailers create amazing displays that customers love.
            </p>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.4}>
            <p className="text-lg text-gray-700 mb-8">
              I cover Suffolk, Norfolk, Essex, and Cambridgeshire. Whether you need wholesale supply, display solutions, or expert advice, I'm here to help your business grow with the best greeting card and gift brands in the industry.
            </p>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.5}>
            <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-stretch sm:items-center gap-3 sm:gap-6 w-full max-w-xl sm:max-w-none mx-auto">
              <button 
                onClick={() => setIsRequestFormOpen(true)}
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center text-center px-6 py-3 min-h-[3rem] rounded-md font-medium border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 transition-colors dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                Request an Agent Visit
              </button>
              <Link 
                href="/about" 
                className="w-full sm:w-auto inline-flex items-center justify-center text-center px-6 py-3 min-h-[3rem] rounded-md font-medium border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 transition-colors dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                About Dave
              </Link>
              <Link 
                href="/contact" 
                className="w-full sm:w-auto inline-flex items-center justify-center text-center px-6 py-3 min-h-[3rem] rounded-md font-medium border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 transition-colors dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                Get In Touch
              </Link>
            </div>
          </FadeInOnScroll>
        </div>
      </div>

      {/* Brands Grid */}
      <div id="partner-brands" className="relative min-h-screen">
        <VideoBackground videoUrl="/videos/brands-background.mp4">
          <div className="py-20">
            <div className="max-w-7xl mx-auto px-4">
              <FadeInOnScroll>
                <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Our Partner Brands</h2>
              </FadeInOnScroll>
              <FadeInOnScroll delay={0.2}>
                <h3 className="text-xl text-center mb-12 text-gray-700">Quality Products from Leading Suppliers</h3>
              </FadeInOnScroll>
              <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
                {companies.map((company, index) => (
                  <FadeInOnScroll
                    key={company.id}
                    delay={0.1 * (index % 6)}
                    className="h-full min-h-0 w-full"
                  >
                    <PartnerBrandCard company={company} hoverLift={false} />
                  </FadeInOnScroll>
                ))}
              </div>
            </div>
          </div>
        </VideoBackground>
      </div>

      {/* Request Visit Form Modal */}
      <RequestVisitForm 
        isOpen={isRequestFormOpen} 
        onClose={() => setIsRequestFormOpen(false)} 
      />
    </main>
  );
}
