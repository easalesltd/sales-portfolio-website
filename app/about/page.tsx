'use client';

import Image from 'next/image';
import { useState } from 'react';
import ImageModal from "../components/ImageModal";
import VideoBackground from "../components/VideoBackground";

const aboutImages = [
  { src: '/images/about/IMG-20230520-WA0021.jpg', alt: 'Dave portrait' },
  { src: '/images/about/Underline_The_Sky_(3_of_21) (1).jpg', alt: 'Dave professional photo' },
  { src: '/images/about/Screenshot-2025-08-30-at-17-41-48.png', alt: 'Dave portrait' },
  { src: '/images/about/20240420_103516 portrait.jpg', alt: 'Recent photo' },
  { src: '/images/about/20250526_145646 portrait.jpg', alt: 'Latest photo' },
  { src: '/images/about/DSC07186.JPG', alt: 'Dave with his guitar' },
  { src: '/images/about/IMG-20230810-WA0046.jpg', alt: 'Family moment' },
  { src: '/images/about/IMG-20240923-WA0018.jpg', alt: 'Family at Legoland' },
  { src: '/images/about/PXL_20240810_193137220_1.jpg', alt: 'Dave with family' },
  { src: '/images/about/dave-portrait-2025.jpg', alt: 'Dave portrait' },
];

export default function AboutPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const goToPrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === 0 ? aboutImages.length - 1 : selectedImageIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === aboutImages.length - 1 ? 0 : selectedImageIndex + 1);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="bg-white">
        {/* Video Background Section */}
        <div className="w-full min-h-[30vh] md:h-[30vh] relative overflow-hidden">
          <VideoBackground videoUrl="/videos/About/background.mp4">
            <div className="w-full h-full flex items-center justify-center bg-black/30 py-8 md:py-0">
              <div className="text-center px-4 max-w-3xl">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">Dave Langdon - Your Greeting Card Sales Agent</h1>
                <p className="text-sm md:text-lg text-white drop-shadow-lg leading-relaxed">
                  As a professional greeting card and gift sales agent, Dave Langdon established East Anglian Sales Ltd in 2022, bringing over a decade of experience as a rep in East Anglia. 
                  Dave has built strong relationships with retailers across Suffolk, Norfolk, Essex, and Cambridgeshire, 
                  understanding their unique needs and helping them succeed with expert greeting card sales representation.
                </p>
              </div>
            </div>
          </VideoBackground>
        </div>

        {/* Mobile Photo Gallery - COMPLETELY REWRITTEN */}
        <div className="block lg:hidden py-6">
          <div className="overflow-x-auto flex gap-4 px-4 snap-x snap-mandatory">
            {aboutImages.map((img, index) => (
              <div
                key={`mobile-${index}`}
                className="relative min-w-[260px] h-48 rounded-lg overflow-hidden shadow-lg cursor-pointer snap-center flex-shrink-0"
                onClick={() => handleImageClick(index)}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="260px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Rest of the content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left column - Text content */}
            <div className="space-y-8">
              {/* Mobile: Only text, no interleaved images */}
              <div className="block lg:hidden space-y-8">
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">A Message from Dave</h2>
                  <p className="text-base text-gray-700 italic">
                    &quot;Hi, I&apos;m Dave Langdon, a professional Greeting Card and Giftware Sales Agent based in Ipswich, Suffolk. I&apos;ve been working in East Anglia for over a decade, roaming town to town, Monday to Friday, matching brilliant greeting card and gift brands with brilliant retailers. In the summer, I may be spotted in shorts. I apologise in advance for the legs. And Flip Flops.&quot;
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose Dave Langdon?</h2>
                  <p className="text-lg text-gray-700 mb-4">
                    I&apos;m committed to helping retailers find the perfect products for their customers. Whether you&apos;re looking for traditional greeting cards or modern gift items, I can help you build a successful product range with expert knowledge and personal service.
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Service Area</h2>
                  <p className="text-lg text-gray-700 mb-4">
                    I proudly serve retailers across East Anglia, including:
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
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">A Message from Dave</h2>
                  <p className="text-base text-gray-700 italic">
                    &quot;Hi, I&apos;m Dave Langdon, a professional Greeting Card and Giftware Sales Agent based in Ipswich, Suffolk. I&apos;ve been working in East Anglia for over a decade, roaming town to town, Monday to Friday, matching brilliant greeting card and gift brands with brilliant retailers. In the summer, I may be spotted in shorts. I apologise in advance for the legs. And Flip Flops.&quot;
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose Dave Langdon?</h2>
                  <p className="text-lg text-gray-700 mb-4">
                    I&apos;m committed to helping retailers find the perfect products for their customers. Whether you&apos;re looking for traditional greeting cards or modern gift items, I can help you build a successful product range with expert knowledge and personal service.
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Service Area</h2>
                  <p className="text-lg text-gray-700 mb-4">
                    I proudly serve retailers across East Anglia, including:
                  </p>
                  <ul className="text-lg text-gray-700 list-disc list-inside mb-4">
                    <li>Suffolk</li>
                    <li>Norfolk</li>
                    <li>Essex</li>
                    <li>Cambridgeshire</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column - Desktop Photo Grid - Perfectly aligned with text */}
            <div className="hidden lg:block">
              <div className="space-y-3 mt-4">
                {/* Row 1 - 5 images starting at exact top of text */}
                <div className="grid grid-cols-5 gap-2">
                  {aboutImages.slice(0, 5).map((img, index) => (
                    <div
                      key={`desktop-row1-${index}`}
                      className="relative h-44 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleImageClick(index)}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 20vw"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Row 2 - 5 images extending to bottom of text */}
                <div className="grid grid-cols-5 gap-2">
                  {aboutImages.slice(5, 10).map((img, index) => (
                    <div
                      key={`desktop-row2-${index}`}
                      className="relative h-44 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleImageClick(index + 5)}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 20vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Image Modal */}
          {selectedImageIndex !== null && (
            <ImageModal
              isOpen={selectedImageIndex !== null}
              onClose={closeModal}
              imageSrc={aboutImages[selectedImageIndex].src}
              alt={aboutImages[selectedImageIndex].alt}
              onPrevious={goToPrevious}
              onNext={goToNext}
              currentIndex={selectedImageIndex}
              totalImages={aboutImages.length}
            />
          )}
        </div>
      </div>
    </div>
  );
} 