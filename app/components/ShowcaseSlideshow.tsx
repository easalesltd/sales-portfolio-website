'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const TRANSITION_DURATION = 1000; // 1 second for a smoother fade transition
const SLIDE_DURATION = 5000; // 5 seconds per slide for better viewing

// Using all available showcase images
const showcaseImages = [
  '/images/showcase/showcase1.jpeg',
  '/images/showcase/showcase2.jpeg',
  '/images/showcase/showcase3.jpeg',
  '/images/showcase/showcase4.jpeg',
  '/images/showcase/showcase6.jpeg',
  '/images/showcase/showcase9.jpeg',
  '/images/showcase/showcase13.jpeg',
  '/images/showcase/1-1-25.jpeg',
  '/images/showcase/1-1-26.jpeg',
  '/images/showcase/bd66610d-a7c2-4835-9657-9e4248cf7400.jpeg',
  '/images/showcase/1066f4f9-50ba-4dfb-8f5d-703151fd119e.jpeg',
  '/images/showcase/6c27d66e-3695-49a1-b4a4-d7967106679b.jpeg',
  '/images/showcase/4003f792-f399-4cc5-8802-e2bfcd93c330.jpeg',
  '/images/showcase/b6943adc-3dc7-47b7-9c10-399cd36d33c1.jpeg',
  '/images/showcase/901d0ddb-3e10-4a3d-aeee-c2d207eba557.jpeg',
  '/images/showcase/IMG_0670_copy_bdc70bf1-59fc-476e-9c6d-bf96f508ee40_1500x.jpeg',
  '/images/showcase/PGA_Gift_Set_Web_Banner_2bb5540a-8eb3-446a-9bf0-53b3250f4c37.jpeg',
  '/images/showcase/Screenshot 2025-05-18 at 09.18.44.png',
  '/images/showcase/Screenshot 2025-05-18 at 09.18.13.png',
  '/images/showcase/Screenshot 2025-05-18 at 09.18.07.png',
  '/images/showcase/Screenshot 2025-05-18 at 09.16.46.png',
  '/images/showcase/image (17).png',
  '/images/showcase/Screenshot 2025-06-03 at 21.45.58.png',
  '/images/showcase/Screenshot 2025-06-03 at 21.45.27.png',
  '/images/showcase/Screenshot 2025-06-03 at 21.45.03.png',
  '/images/showcase/740dde85-43e1-4049-b4d6-44f3c9844c25.jpeg',
  '/images/showcase/d40a6860-3952-4308-b87b-770c946035a3.jpeg',
  '/images/showcase/394317ab-f7e6-4896-a346-2c041850a748.jpeg',
  '/images/companies/Real & Exciting Designs/a0ed6336-e2ad-4373-8cc7-a3631d177ceb.jpeg',
  '/images/companies/Real & Exciting Designs/c85f6dc5-1cb4-43f6-8eb5-fadd5bc56678.jpeg',
  '/images/companies/Real & Exciting Designs/6fa30e7a-4206-4982-afb3-228eee448a16.jpeg',
  '/images/companies/Real & Exciting Designs/acaf8625-698f-43fe-b3ce-34247404bb5d.jpeg'
];

export default function ShowcaseSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageError, setImageError] = useState<boolean[]>(new Array(showcaseImages.length).fill(false));
  const [shuffledImages, setShuffledImages] = useState<string[]>([]);

  // Function to shuffle array using Fisher-Yates algorithm
  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize shuffled images on component mount
  useEffect(() => {
    setShuffledImages(shuffleArray(showcaseImages));
  }, []);

  useEffect(() => {
    if (shuffledImages.length === 0) return;

    const timer = setInterval(() => {
      setNextIndex((currentIndex + 1) % shuffledImages.length);
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentIndex((currentIndex + 1) % shuffledImages.length);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [currentIndex, shuffledImages.length]);

  const handleImageError = (index: number) => {
    setImageError(prev => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  };

  // If all images failed to load
  if (imageError.every(Boolean)) {
    return (
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-gray-900">
        <div className="flex items-center justify-center h-full text-white text-lg">
          Loading showcase images...
        </div>
      </div>
    );
  }

  // If shuffled images are not ready yet
  if (shuffledImages.length === 0) {
    return (
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-gray-900">
        <div className="flex items-center justify-center h-full text-white text-lg">
          Preparing showcase images...
        </div>
      </div>
    );
  }

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setNextIndex(index);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, TRANSITION_DURATION);
  };

  return (
    <div className="relative w-full h-full">
      {/* Images Container */}
      <div className="relative w-full h-full">
        {/* Current Image */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            opacity: isTransitioning ? 0 : 1, 
            transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`,
            backgroundColor: 'rgba(0, 0, 0, 0.1)'
          }}
        >
          <Image
            src={shuffledImages[currentIndex]}
            alt={`Showcase image ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority={currentIndex === 0}
            onError={() => handleImageError(currentIndex)}
            sizes="100vw"
            quality={90}
          />
        </div>

        {/* Next Image */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            opacity: isTransitioning ? 1 : 0, 
            transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`,
            backgroundColor: 'rgba(0, 0, 0, 0.1)'
          }}
        >
          <Image
            src={shuffledImages[nextIndex]}
            alt={`Showcase image ${nextIndex + 1}`}
            fill
            className="object-cover"
            priority
            onError={() => handleImageError(nextIndex)}
            sizes="100vw"
            quality={90}
          />
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {shuffledImages.map((_, index) => (
          !imageError[index] && (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                currentIndex === index
                  ? 'bg-white w-6 shadow-lg'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          )
        ))}
      </div>
    </div>
  );
} 