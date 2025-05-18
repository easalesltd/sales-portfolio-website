'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const TRANSITION_DURATION = 800; // 0.8 second for a smoother fade transition
const SLIDE_DURATION = 5000; // 5 seconds per slide for better viewing

// Using only valid showcase images
const showcaseImages = [
  '/images/showcase/showcase1.jpeg',
  '/images/showcase/showcase2.jpeg',
  '/images/showcase/1-1-25.jpeg',
  '/images/showcase/1-1-26.jpeg',
  '/images/showcase/IMG_0670_copy_bdc70bf1-59fc-476e-9c6d-bf96f508ee40_1500x.jpeg',
  '/images/showcase/showcase3.jpeg',
  '/images/showcase/showcase4.jpeg',
  '/images/showcase/showcase6.jpeg',
  '/images/showcase/showcase9.jpeg',
  '/images/showcase/showcase13.jpeg'
];

export default function ShowcaseSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageError, setImageError] = useState<boolean[]>(new Array(showcaseImages.length).fill(false));

  useEffect(() => {
    const timer = setInterval(() => {
      // Start transition
      setIsTransitioning(true);
      
      // After transition duration, update indices
      setTimeout(() => {
        setCurrentIndex(nextIndex);
        setNextIndex((nextIndex + 1) % showcaseImages.length);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
      
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [nextIndex]);

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

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setIsTransitioning(true);
    setNextIndex(index);
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Current Image */}
      <div 
        className={`absolute inset-0 transition-opacity duration-800 ease-in-out ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Image
          src={showcaseImages[currentIndex]}
          alt={`Showcase image ${currentIndex + 1}`}
          fill
          className="object-cover transform scale-[1.02] transition-transform duration-[10000ms] ease-linear"
          priority={currentIndex === 0}
          onError={() => handleImageError(currentIndex)}
          sizes="100vw"
          quality={90}
        />
      </div>

      {/* Next Image (for smooth transition) */}
      <div 
        className={`absolute inset-0 transition-opacity duration-800 ease-in-out ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Image
          src={showcaseImages[nextIndex]}
          alt={`Showcase image ${nextIndex + 1}`}
          fill
          className="object-cover transform scale-[1.02] transition-transform duration-[10000ms] ease-linear"
          priority
          onError={() => handleImageError(nextIndex)}
          sizes="100vw"
          quality={90}
        />
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {showcaseImages.map((_, index) => (
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