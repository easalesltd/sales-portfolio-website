'use client';

import Image from 'next/image';
import { useState } from 'react';
import GoogleReviews from "../components/GoogleReviews";
import ImageModal from "../components/ImageModal";

const aboutImages = [
  { src: '/images/about/DSC07186.JPG', alt: 'Dave with his guitar' },
  { src: '/images/about/PXL_20240810_193137220_1.jpg', alt: 'Dave with family' },
  { src: '/images/about/20240420_103516.jpg', alt: 'Recent photo' },
  { src: '/images/about/IMG-20230810-WA0046.jpg', alt: 'Family moment' },
  { src: '/images/about/IMG-20240923-WA0018.jpg', alt: 'Family at Legoland' },
];

export default function AboutPage() {
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({});
  const [selectedImage, setSelectedImage] = useState<{src: string; alt: string} | null>(null);

  const handleImageError = (imagePath: string) => {
    setImageError(prev => ({...prev, [imagePath]: true}));
    console.error(`Failed to load image: ${imagePath}`);
  };

  const handleImageClick = (src: string, alt: string) => {
    setSelectedImage({ src, alt });
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="bg-white">
      {/* Option 2: Horizontal Scrollable Gallery (Mobile Only) */}
      <div className="block lg:hidden">
        <div className="overflow-x-auto flex gap-4 py-4 px-2 snap-x snap-mandatory">
          {aboutImages.map((img, idx) => (
            <div
              key={img.src}
              className="relative min-w-[260px] h-48 rounded-lg overflow-hidden shadow-lg cursor-pointer snap-center flex-shrink-0"
              onClick={() => handleImageClick(img.src, img.alt)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                onError={() => handleImageError(img.src)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column - Text content (Desktop) */}
          <div className="space-y-8">
            {/* Interleaved Photos with Text (Mobile Only) */}
            <div className="block lg:hidden space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">A Message from your agent</h3>
                <p className="text-xl text-gray-700 italic mb-4">
                  "Hi, I'm Dave, a Sales Agent based in Ipswich, Suffolk. I've been a professional Middle Man in East Anglia for over a decade. Roaming town to town, Monday to Friday, matching brilliant brands with brilliant retailers. In the summer, I may be spotted in shorts. I apologise in advance for the legs. And Flip Flops."
                </p>
                {/* Interleaved Photo 1 */}
                <div className="relative h-48 rounded-lg overflow-hidden shadow-lg cursor-pointer mb-4" onClick={() => handleImageClick(aboutImages[0].src, aboutImages[0].alt)}>
                  <Image src={aboutImages[0].src} alt={aboutImages[0].alt} fill className="object-cover" onError={() => handleImageError(aboutImages[0].src)} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
                <p className="text-lg text-gray-700 mb-4">
                  East Anglian Sales Ltd was established in 2022, but our experience in the industry spans much further. We've built strong relationships with retailers across Suffolk, Norfolk, Essex, and Cambridgeshire, understanding their unique needs and helping them succeed.
                </p>
                {/* Interleaved Photo 2 */}
                <div className="relative h-48 rounded-lg overflow-hidden shadow-lg cursor-pointer mb-4" onClick={() => handleImageClick(aboutImages[1].src, aboutImages[1].alt)}>
                  <Image src={aboutImages[1].src} alt={aboutImages[1].alt} fill className="object-cover" onError={() => handleImageError(aboutImages[1].src)} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-lg text-gray-700 mb-4">
                  Our mission is simple: to connect quality brands with quality retailers. We believe in personal service, regular visits, and building lasting partnerships. Whether you're a small independent shop or a larger retail outlet, we're here to help you grow.
                </p>
                {/* Interleaved Photo 3 */}
                <div className="relative h-48 rounded-lg overflow-hidden shadow-lg cursor-pointer mb-4" onClick={() => handleImageClick(aboutImages[2].src, aboutImages[2].alt)}>
                  <Image src={aboutImages[2].src} alt={aboutImages[2].alt} fill className="object-cover" onError={() => handleImageError(aboutImages[2].src)} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Service Area</h2>
                <p className="text-lg text-gray-700 mb-4">
                  We proudly serve retailers across East Anglia, including:
                </p>
                <ul className="text-lg text-gray-700 list-disc list-inside mb-4">
                  <li>Suffolk</li>
                  <li>Norfolk</li>
                  <li>Essex</li>
                  <li>Cambridgeshire</li>
                </ul>
                {/* Interleaved Photo 4 */}
                <div className="relative h-48 rounded-lg overflow-hidden shadow-lg cursor-pointer mb-4" onClick={() => handleImageClick(aboutImages[3].src, aboutImages[3].alt)}>
                  <Image src={aboutImages[3].src} alt={aboutImages[3].alt} fill className="object-cover" onError={() => handleImageError(aboutImages[3].src)} />
                </div>
              </div>
              {/* Interleaved Photo 5 */}
              <div className="relative h-48 rounded-lg overflow-hidden shadow-lg cursor-pointer mb-4" onClick={() => handleImageClick(aboutImages[4].src, aboutImages[4].alt)}>
                <Image src={aboutImages[4].src} alt={aboutImages[4].alt} fill className="object-cover" onError={() => handleImageError(aboutImages[4].src)} />
              </div>
            </div>

            {/* Desktop: Original text content only */}
            <div className="hidden lg:block">
              <div className="bg-blue-50 rounded-xl p-8 mb-8 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">A Message from your agent</h3>
                <p className="text-xl text-gray-700 italic">
                  "Hi, I'm Dave, a Sales Agent based in Ipswich, Suffolk. I've been a professional Middle Man in East Anglia for over a decade. Roaming town to town, Monday to Friday, matching brilliant brands with brilliant retailers. In the summer, I may be spotted in shorts. I apologise in advance for the legs. And Flip Flops."
                </p>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
              <p className="text-lg text-gray-700 mb-6">
                East Anglian Sales Ltd was established in 2022, but our experience in the industry spans much further. We've built strong relationships with retailers across Suffolk, Norfolk, Essex, and Cambridgeshire, understanding their unique needs and helping them succeed.
              </p>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
                Our mission is simple: to connect quality brands with quality retailers. We believe in personal service, regular visits, and building lasting partnerships. Whether you're a small independent shop or a larger retail outlet, we're here to help you grow.
              </p>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Service Area</h2>
              <p className="text-lg text-gray-700 mb-6">
                We proudly serve retailers across East Anglia, including:
              </p>
              <ul className="text-lg text-gray-700 list-disc list-inside mb-8">
                <li>Suffolk</li>
                <li>Norfolk</li>
                <li>Essex</li>
                <li>Cambridgeshire</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Photo Grid (Desktop Only) */}
          <div className="space-y-6 hidden lg:block">
            {/* Top Row - 2 Photos */}
            <div className="grid grid-cols-2 gap-6">
              {/* Guitar Photo */}
              <div 
                className="relative h-80 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleImageClick('/images/about/DSC07186.JPG', 'Dave with his guitar')}
              >
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
              <div 
                className="relative h-80 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleImageClick('/images/about/PXL_20240810_193137220_1.jpg', 'Dave with family')}
              >
                <Image
                  src="/images/about/PXL_20240810_193137220_1.jpg"
                  alt="Dave with family"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  onError={() => handleImageError('/images/about/PXL_20240810_193137220_1.jpg')}
                />
              </div>
            </div>
            {/* Middle Row - 2 Photos */}
            <div className="grid grid-cols-2 gap-6">
              {/* Recent Photo */}
              <div 
                className="relative h-80 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleImageClick('/images/about/20240420_103516.jpg', 'Recent photo')}
              >
                <Image
                  src="/images/about/20240420_103516.jpg"
                  alt="Recent photo"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  onError={() => handleImageError('/images/about/20240420_103516.jpg')}
                />
              </div>
              {/* Family Photo 2 */}
              <div 
                className="relative h-80 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleImageClick('/images/about/IMG-20230810-WA0046.jpg', 'Family moment')}
              >
                <Image
                  src="/images/about/IMG-20230810-WA0046.jpg"
                  alt="Family moment"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  onError={() => handleImageError('/images/about/IMG-20230810-WA0046.jpg')}
                />
              </div>
            </div>
            {/* Bottom Row - Full Width Photo */}
            <div 
              className="relative h-96 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => handleImageClick('/images/about/IMG-20240923-WA0018.jpg', 'Family at Legoland')}
            >
              <Image
                src="/images/about/IMG-20240923-WA0018.jpg"
                alt="Family at Legoland"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                onError={() => handleImageError('/images/about/IMG-20240923-WA0018.jpg')}
              />
            </div>
          </div>
        </div>

        {/* Google Reviews section - Full Width */}
        <div className="mt-16">
          <GoogleReviews />
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <ImageModal
            isOpen={!!selectedImage}
            onClose={closeModal}
            imageSrc={selectedImage.src}
            alt={selectedImage.alt}
          />
        )}
      </div>
    </div>
  );
} 