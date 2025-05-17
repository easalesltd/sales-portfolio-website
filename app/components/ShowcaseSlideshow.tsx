'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const TRANSITION_DURATION = 500; // 0.5 second for fade transition (reduced from 1 second)
const SLIDE_DURATION = 3500; // 3.5 seconds per slide (changed from 5 seconds)

// Using only valid showcase images
const showcaseImages = [
  '/images/showcase/1-1-25.jpeg',
  '/images/showcase/1-1-26.jpeg',
  '/images/showcase/IMG_0670_copy_bdc70bf1-59fc-476e-9c6d-bf96f508ee40_1500x.jpeg',
  '/images/showcase/showcase1.jpeg',
  '/images/showcase/showcase3.jpeg',
  '/images/showcase/showcase4.jpeg',
  '/images/showcase/showcase6.jpeg',
  '/images/showcase/showcase8.jpeg',
  '/images/showcase/showcase9.jpeg',
  '/images/showcase/showcase13.jpeg'
];

export default function ShowcaseSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageError, setImageError] = useState<boolean[]>(new Array(showcaseImages.length).fill(false));

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      
      // Wait for fade out
      setTimeout(() => {
        setCurrentIndex((prevIndex) => {
          // Find next valid image
          let nextIndex = (prevIndex + 1) % showcaseImages.length;
          let attempts = 0;
          while (imageError[nextIndex] && attempts < showcaseImages.length) {
            nextIndex = (nextIndex + 1) % showcaseImages.length;
            attempts++;
          }
          return nextIndex;
        });
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
      
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [imageError]);

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

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Current Image */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Image
          src={showcaseImages[currentIndex]}
          alt={`Showcase image ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority={currentIndex === 0}
          onError={() => handleImageError(currentIndex)}
          sizes="100vw"
          quality={85}
        />
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {showcaseImages.map((_, index) => (
          !imageError[index] && (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsTransitioning(false);
                }, TRANSITION_DURATION);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 shadow-md ${
                currentIndex === index
                  ? 'bg-blue-600 w-4'
                  : 'bg-gray-200 hover:bg-blue-400'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          )
        ))}
      </div>
    </div>
  );
} 