'use client';

import Image from 'next/image';
import { useState } from 'react';
import ImageModal from "../components/ImageModal";
import VideoBackground from "../components/VideoBackground";

const aboutImages = [
  { src: '/images/about/DSC07186.JPG', alt: 'Dave with his guitar' },
  { src: '/images/about/PXL_20240810_193137220_1.jpg', alt: 'Dave with family' },
  { src: '/images/about/20240420_103516 portrait.jpg', alt: 'Recent photo' },
  { src: '/images/about/IMG-20230810-WA0046.jpg', alt: 'Family moment' },
  { src: '/images/about/IMG-20240923-WA0018.jpg', alt: 'Family at Legoland' },
  { src: '/images/about/20250526_145646 portrait.jpg', alt: 'Latest photo' },
];

export default function AboutPage() {
  const [selectedImage, setSelectedImage] = useState<{src: string; alt: string} | null>(null);

  const handleImageClick = (src: string, alt: string) => {
    setSelectedImage({ src, alt });
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="bg-white">
        {/* Video Background Section */}
        <div className="w-full h-[20vh] md:h-[30vh] relative overflow-hidden">
          <VideoBackground videoUrl="/videos/About/background.mp4">
            <div className="w-full h-full flex items-center justify-center bg-black/30">
              <div className="text-center px-4 max-w-3xl">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">Our Story</h2>
                <p className="text-base md:text-lg text-white drop-shadow-lg">
                  East Anglian Sales Ltd was established in 2022, but our experience in the industry spans much further. 
                  We&apos;ve built strong relationships with retailers across Suffolk, Norfolk, Essex, and Cambridgeshire, 
                  understanding their unique needs and helping them succeed.
                </p>
              </div>
            </div>
          </VideoBackground>
        </div>

        {/* Mobile Photo Gallery */}
        <div className="block lg:hidden">
          <div className="overflow-x-auto flex gap-4 py-6 px-4 snap-x snap-mandatory">
            {aboutImages.map((img) => (
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
                />
              </div>
            ))}
          </div>
        </div>

        {/* Rest of the content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left column - Text content (Desktop) */}
            <div className="space-y-8">
              {/* Mobile: Only text, no interleaved images */}
              <div className="block lg:hidden space-y-8">
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">A Message from your agent</h3>
                  <p className="text-base text-gray-700 italic">
                    &quot;Hi, I&apos;m Dave, a Sales Agent based in Ipswich, Suffolk. I&apos;ve been a professional Middle Man in East Anglia for over a decade. Roaming town to town, Monday to Friday, matching brilliant brands with brilliant retailers. In the summer, I may be spotted in shorts. I apologise in advance for the legs. And Flip Flops.&quot;
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
                  <p className="text-lg text-gray-700 mb-4">
                    I&apos;m committed to helping retailers find the perfect products for their customers. Whether you&apos;re looking for traditional greeting cards or modern gift items, I can help you build a successful product range.
                  </p>
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
                </div>
              </div>

              {/* Desktop: Original text content only */}
              <div className="hidden lg:block">
                <div className="bg-blue-50 rounded-lg p-4 mb-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">A Message from your agent</h3>
                  <p className="text-base text-gray-700 italic">
                    &quot;Hi, I&apos;m Dave, a Sales Agent based in Ipswich, Suffolk. I&apos;ve been a professional Middle Man in East Anglia for over a decade. Roaming town to town, Monday to Friday, matching brilliant brands with brilliant retailers. In the summer, I may be spotted in shorts. I apologise in advance for the legs. And Flip Flops.&quot;
                  </p>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-lg text-gray-700 mb-6">
                  I&apos;m committed to helping retailers find the perfect products for their customers. Whether you&apos;re looking for traditional greeting cards or modern gift items, I can help you build a successful product range.
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
                  />
                </div>
              </div>
              {/* Middle Row - 2 Photos */}
              <div className="grid grid-cols-2 gap-6">
                {/* Recent Photo */}
                <div 
                  className="relative h-80 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => handleImageClick('/images/about/20240420_103516 portrait.jpg', 'Recent photo')}
                >
                  <Image
                    src="/images/about/20240420_103516 portrait.jpg"
                    alt="Recent photo"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
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
                  />
                </div>
              </div>
              {/* Bottom Row - 2 Photos */}
              <div className="grid grid-cols-2 gap-6">
                {/* Legoland Photo */}
                <div 
                  className="relative h-80 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => handleImageClick('/images/about/IMG-20240923-WA0018.jpg', 'Family at Legoland')}
                >
                  <Image
                    src="/images/about/IMG-20240923-WA0018.jpg"
                    alt="Family at Legoland"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {/* Latest Photo */}
                <div 
                  className="relative h-80 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => handleImageClick('/images/about/20250526_145646 portrait.jpg', 'Latest photo')}
                >
                  <Image
                    src="/images/about/20250526_145646 portrait.jpg"
                    alt="Latest photo"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
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
    </div>
  );
} 