'use client';

import Image from 'next/image';
import Link from 'next/link';
import VideoBackground from '../components/VideoBackground';

export default function TemporaryRepCoverPage() {
  const salesApps = [
    {
      name: 'Sales Pak',
      logoPath: '/images/sales-apps/sales-pak.png'
    },
    {
      name: 'Blue Alligator',
      logoPath: '/images/sales-apps/blue-alligator.png'
    },
    {
      name: 'Pixsell',
      logoPath: '/images/sales-apps/Pixsell.png'
    },
    {
      name: 'Card Manager',
      logoPath: '/images/sales-apps/card-manager.png'
    },
    {
      name: 'Shopify',
      logoPath: '/images/sales-apps/Shopify.png'
    },
    {
      name: 'Inzant',
      logoPath: '/images/sales-apps/Inzant.png'
    }
  ];

  const benefits = [
    'Immediate coverage when your rep leaves unexpectedly',
    'No disruption to customer relationships',
    'Maintain sales momentum during transitions',
    'Professional representation of your brand',
    'Fully trained on all major sales platforms',
    'Established relationships across East Anglia'
  ];

  const coverageAreas = [
    'Suffolk',
    'Norfolk', 
    'Essex',
    'Cambridgeshire'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <div className="h-[40vh] md:h-[60vh] min-h-[300px] w-full relative overflow-hidden">
        <VideoBackground videoUrl="/videos/brands-background.mp4">
          <div className="w-full h-full flex items-center justify-center bg-black/40">
            <div className="text-center px-4 max-w-4xl">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                Temporary Rep Cover
              </h1>
              <p className="text-lg md:text-xl text-white drop-shadow-lg max-w-2xl mx-auto">
                Seamless coverage when your sales representative leaves. 
                Keep your business running smoothly with professional, experienced cover.
              </p>
            </div>
          </div>
        </VideoBackground>
      </div>

      {/* Main Content */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* Introduction Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              When Life Happens, We&apos;ve Got You Covered
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Losing a sales representative can be stressful and disruptive to your business. 
              Whether it&apos;s planned leave, unexpected departure, or extended absence, 
              I provide seamless temporary coverage to ensure your customers continue to receive 
              the same high-quality service and attention they expect.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-neutral-950 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">{benefit}</p>
              </div>
            ))}
          </div>

          {/* Sales Apps Expertise */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Fully Trained on All Major Sales Platforms
            </h2>
            <p className="text-lg text-gray-700 text-center mb-12 max-w-3xl mx-auto">
              I&apos;m proficient in the leading sales applications used in the greeting card and gift industry. 
              This means I can hit the ground running with your existing systems and processes.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {salesApps.map((app, index) => (
                <div 
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-all duration-300 hover:border-neutral-400 hover:scale-105"
                >
                  <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <Image
                      src={app.logoPath}
                      alt={`${app.name} logo`}
                      width={48}
                      height={48}
                      className="object-contain max-w-full max-h-full"
                      onError={(e) => {
                        // Fallback to generic icon if logo fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    {/* Fallback generic icon */}
                    <div className="w-12 h-12 bg-neutral-950 rounded-lg flex items-center justify-center" style={{ display: 'none' }}>
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 leading-tight">{app.name}</h3>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                Each platform includes: Order management, Customer database, Sales reporting, Inventory tracking, and more
              </p>
            </div>
          </div>

          {/* Coverage Areas */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Coverage Areas
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {coverageAreas.map((area, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <h3 className="font-semibold text-gray-900">{area}</h3>
                  </div>
                ))}
              </div>
              <p className="text-center text-gray-600 mt-6">
                Additional areas can be covered by arrangement. I&apos;m flexible and can adapt to your specific needs.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              How Temporary Cover Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-neutral-950 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Initial Contact</h3>
                <p className="text-gray-600">
                  Get in touch as soon as you know you need cover. The earlier the better to ensure smooth transition.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-neutral-950 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Quick Setup</h3>
                <p className="text-gray-600">
                  I&apos;ll get up to speed quickly with your systems, customers, and processes to minimize disruption.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-neutral-950 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Seamless Coverage</h3>
                <p className="text-gray-600">
                  Your customers receive the same high-quality service while you focus on finding your permanent replacement.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-neutral-950 rounded-lg p-8 text-center text-white dark:border dark:border-neutral-700">
            <h2 className="text-3xl font-bold mb-4">
              Don&apos;t Let a Gap Become a Problem
            </h2>
                          <p className="text-xl mb-8 opacity-90">
                Get in touch today to discuss your temporary cover needs. 
                I&apos;m here to help keep your business running smoothly.
              </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="px-8 py-3 bg-white text-neutral-950 rounded-md hover:bg-neutral-200 transition-colors font-medium text-lg border border-white"
              >
                Get in Touch
              </Link>
              <Link 
                href="tel:+44" 
                className="px-8 py-3 border-2 border-white text-white rounded-md hover:bg-white hover:text-neutral-950 transition-colors font-medium text-lg"
              >
                Call Now
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
} 