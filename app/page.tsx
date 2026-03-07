'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { companies } from "./data/companies";
import ShowcaseSlideshow from "./components/ShowcaseSlideshow";
import VideoBackground from "./components/VideoBackground";
import FadeInOnScroll from "./components/FadeInOnScroll";
import RequestVisitForm from "./components/RequestVisitForm";

export default function Home() {
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  return (
    <main className="min-h-screen">
      {/* Hero Section with Showcase Slideshow */}
      <div className="h-[30vh] md:h-[80vh] min-h-[200px] md:min-h-[600px] w-full relative overflow-hidden bg-white md:bg-gradient-to-br md:from-blue-50 md:to-indigo-100">
        <div className="w-full h-full">
          <ShowcaseSlideshow />
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-left">
          <FadeInOnScroll>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">UK Greeting Card & Gift Sales Agent Covering East Anglia</h1>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.2}>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              I'm Dave Langdon, a UK greeting card and gift sales agent based in Ipswich, Suffolk. For over 11 years I've been helping retailers across East Anglia build strong greeting card and gift ranges that sell.
            </p>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.3}>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              I work with a selection of established greeting card publishers and gift suppliers, bringing quality wholesale ranges to independent shops, garden centres, farm shops, and retail stores.
            </p>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.35}>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">As a local greeting card sales agent, I provide more than just supply. I help retailers with:</p>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.4}>
            <ul className="text-lg text-gray-700 mb-6 list-disc pl-6 space-y-2 leading-relaxed [&>li]:pl-1">
              <li>choosing the right ranges</li>
              <li>creating attractive card displays</li>
              <li>improving card sales and margins</li>
              <li>keeping ranges fresh with new designs</li>
            </ul>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.45}>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              I cover Suffolk, Norfolk, Essex, and Cambridgeshire, visiting retailers regularly and providing ongoing support.
            </p>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.5}>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              If you're looking for a greeting card agent in East Anglia, I'd be happy to arrange a visit and show you the latest ranges.
            </p>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.55}>
            <div className="flex justify-center gap-6">
              <button 
                onClick={() => setIsRequestFormOpen(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Request an Agent Visit
              </button>
              <Link 
                href="/about" 
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                About Us
              </Link>
              <Link 
                href="/contact" 
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {companies.map((company, index) => (
                  <FadeInOnScroll key={company.id} delay={0.1 * (index % 6)}>
                    <Link 
                      href={`/companies/${company.slug}`}
                      className="group flex flex-col bg-white/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full"
                    >
                      <div className="aspect-[3/2] relative flex-shrink-0">
                        <Image
                          src={company.logoUrl}
                          alt={`${company.name} logo`}
                          fill
                          className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6 bg-white/90 backdrop-blur-sm flex-grow flex flex-col justify-start min-h-[140px]">
                        <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">{company.name}</h3>
                        <p className="text-gray-700 text-center text-sm leading-relaxed">{company.description}</p>
                      </div>
                    </Link>
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
