'use client';

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { FaInstagram } from "react-icons/fa";
import { companies } from "./data/companies";
import { partnerBrandLogoAlt } from "./lib/partner-brand-logo-alt";
import ShowcaseSlideshow from "./components/ShowcaseSlideshow";
import FadeInOnScroll from "./components/FadeInOnScroll";

const VideoBackground = dynamic(() => import("./components/VideoBackground"));
const RequestVisitForm = dynamic(() => import("./components/RequestVisitForm"));

export default function Home() {
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  return (
    <main className="min-h-screen">
      {/* Hero Section with Showcase Slideshow */}
      <div className="h-[240px] max-h-[240px] md:h-[80vh] md:max-h-none min-h-[240px] md:min-h-[600px] w-full relative overflow-hidden bg-white md:bg-gradient-to-br md:from-blue-50 md:to-indigo-100 transition-shadow duration-500 md:hover:shadow-2xl">
        <div className="w-full h-full min-h-0">
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
              Hi I'm Dave Langdon, a greeting card and gift sales agent based in Ipswich, Suffolk, and I've been helping retailers across East Anglia build ranges that actually sell for over 11 years.
            </p>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.3}>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              I work with a carefully chosen set of publishers and gift suppliers, and I cover Suffolk, Norfolk, Essex, and Cambridgeshire, visiting regularly, not just dropping off stock and disappearing. Whether you run an independent shop, garden centre, farm shop, or retail store, I can help you find the right ranges, get your display working harder, and keep things fresh with new designs as they come through.
            </p>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.4}>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              If you'd like a visit to see the latest ranges, I'd love to come and have a chat.
            </p>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.55}>
            <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-stretch sm:items-center gap-3 sm:gap-6 w-full max-w-xl sm:max-w-none mx-auto">
              <button 
                onClick={() => setIsRequestFormOpen(true)}
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center text-center px-6 py-3 min-h-[3rem] rounded-md font-medium border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 transition-all duration-300 sm:hover:-translate-y-0.5 sm:hover:shadow-lg active:translate-y-0 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                Request an Agent Visit
              </button>
              <Link 
                href="/about" 
                className="w-full sm:w-auto inline-flex items-center justify-center text-center px-6 py-3 min-h-[3rem] rounded-md font-medium border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 transition-all duration-300 sm:hover:-translate-y-0.5 sm:hover:shadow-lg active:translate-y-0 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                About Dave
              </Link>
              <Link 
                href="/contact" 
                className="w-full sm:w-auto inline-flex items-center justify-center text-center px-6 py-3 min-h-[3rem] rounded-md font-medium border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 transition-all duration-300 sm:hover:-translate-y-0.5 sm:hover:shadow-lg active:translate-y-0 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
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
                {companies.map((company, index) => {
                  const useLightMarkOnDarkTile = Boolean(company.logoUrlDark);
                  const invertLightMarkOnDarkTile =
                    useLightMarkOnDarkTile && company.id !== 'cambridge-confectionery-company';
                  const logoSrc = company.logoUrlDark ?? company.logoUrl;
                  return (
                  <FadeInOnScroll key={company.id} delay={0.1 * (index % 6)}>
                    <Link 
                      href={`/companies/${company.slug}`}
                      className="group flex flex-col bg-white/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-1"
                    >
                      <div
                        className={`aspect-[3/2] relative flex-shrink-0 ${
                          useLightMarkOnDarkTile ? 'bg-black' : 'bg-white'
                        }`}
                      >
                        <Image
                          src={logoSrc}
                          alt={partnerBrandLogoAlt(company.name)}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 320px"
                          className={`object-contain p-6 group-hover:scale-105 transition-transform duration-300 ${
                            invertLightMarkOnDarkTile ? 'invert' : ''
                          }`}
                          quality={75}
                        />
                      </div>
                      <div className="p-6 bg-white/90 backdrop-blur-sm flex-grow flex flex-col justify-start min-h-[140px]">
                        <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">{company.name}</h3>
                        <p className="text-gray-700 text-center text-sm leading-relaxed">{company.description}</p>
                      </div>
                    </Link>
                  </FadeInOnScroll>
                );
                })}
              </div>
            </div>
          </div>
        </VideoBackground>
      </div>

      {/* Instagram — prominent CTA (also linked in site footer) */}
      <div className="bg-gradient-to-br from-pink-50 via-white to-violet-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 text-center">
          <FadeInOnScroll>
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 mb-4 text-white shadow-md"
              aria-hidden
            >
              <FaInstagram className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Follow Dave on Instagram</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Shop visits, new ranges, and snapshots from the road across East Anglia.
            </p>
            <a
              href="https://www.instagram.com/eastangliansalesltd/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-95 transition-opacity shadow-md"
            >
              <FaInstagram className="h-5 w-5 shrink-0" aria-hidden />
              @eastangliansalesltd
            </a>
          </FadeInOnScroll>
        </div>
      </div>

      {/* Request Visit Form Modal */}
      <RequestVisitForm 
        isOpen={isRequestFormOpen} 
        onClose={() => setIsRequestFormOpen(false)} 
      />
    </main>
  );
}
