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
  '/images/showcase/image (17).png'
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
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Images Container */}
      <div className="relative w-full h-full">
        {/* Current Image */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ opacity: isTransitioning ? 0 : 1, transition: `opacity ${TRANSITION_DURATION}ms ease-in-out` }}
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
          style={{ opacity: isTransitioning ? 1 : 0, transition: `opacity ${TRANSITION_DURATION}ms ease-in-out` }}
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
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
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