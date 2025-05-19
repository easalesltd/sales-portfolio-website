'use client';

import Image from 'next/image';
import { useState } from 'react';
import GoogleReviews from "../components/GoogleReviews";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About East Anglian Sales LTD | Your Local Wholesale Partner",
  description: "Learn about East Anglian Sales LTD, your trusted wholesale supplier of greeting cards and gifts in East Anglia. Family-run business with personal service from Dave Langdon.",
};

export default function AboutPage() {
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({});

  const handleImageError = (imagePath: string) => {
    setImageError(prev => ({...prev, [imagePath]: true}));
    console.error(`Failed to load image: ${imagePath}`);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Us</h1>
          <div className="prose prose-lg mx-auto">
            <div className="bg-blue-50 rounded-xl p-8 mb-12 shadow-lg">
              <p className="text-xl text-gray-700 italic">
                "Hi, I'm Dave, a Sales Agent based in Ipswich, Suffolk. I've been a professional Middle Man in East Anglia for over a decade. Roaming town to town, Monday to Friday, matching brilliant brands with brilliant retailers. In the summer, I may be spotted in shorts. I apologise in advance for the legs. And Flip Flops."
              </p>
            </div>
            
            <p className="text-lg text-gray-700 mb-6">
              East Anglian Sales Ltd was established in 2022, but our experience in the industry spans much further. We've built strong relationships with retailers across Suffolk, Norfolk, Essex, and Cambridgeshire, understanding their unique needs and helping them succeed.
            </p>
            
            <p className="text-lg text-gray-700 mb-6">
              Our mission is simple: to connect quality brands with quality retailers. We believe in personal service, regular visits, and building lasting partnerships. Whether you're a small independent shop or a larger retail outlet, we're here to help you grow.
            </p>
          </div>
        </div>

        {/* Photo Grid */}
        <div className="space-y-8">
          {/* 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Guitar Photo */}
            <div className="relative h-80 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <Image
                src="/images/about/DSC07186.JPG"
                alt="Dave with his guitar"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                priority
                onError={() => handleImageError('/images/about/DSC07186.JPG')}
              />
            </div>

            {/* Family Photo 1 */}
            <div className="relative h-80 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <Image
                src="/images/about/PXL_20240810_193137220_1.jpg"
                alt="Dave with family"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                onError={() => handleImageError('/images/about/PXL_20240810_193137220_1.jpg')}
              />
            </div>

            {/* Recent Photo */}
            <div className="relative h-80 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <Image
                src="/images/about/20240420_103516.jpg"
                alt="Recent photo"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                onError={() => handleImageError('/images/about/20240420_103516.jpg')}
              />
            </div>

            {/* Family Photo 2 */}
            <div className="relative h-80 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <Image
                src="/images/about/IMG-20230810-WA0046.jpg"
                alt="Family moment"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                onError={() => handleImageError('/images/about/IMG-20230810-WA0046.jpg')}
              />
            </div>
          </div>

          {/* Large Bottom Photo - Legoland Roller Coaster */}
          <div className="relative h-96 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <Image
              src="/images/about/IMG-20240923-WA0018.jpg"
              alt="Family at Legoland"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              onError={() => handleImageError('/images/about/IMG-20240923-WA0018.jpg')}
            />
          </div>
        </div>

        {/* Add Google Reviews section */}
        <GoogleReviews />
      </div>
    </div>
  );
} 