'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ImageGalleryProps {
  images: string[]
  interval?: number // Time in milliseconds between slides
}

export default function ImageGallery({ images, interval = 5000 }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (!images.length) return null

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-xl">
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
      )}
      
      {/* Main Image */}
      <Image
        src={images[currentIndex]}
        alt={`Gallery image ${currentIndex + 1}`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        priority={currentIndex === 0}
        quality={85}
        className={`object-cover transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoadingComplete={() => setIsLoading(false)}
      />

      {/* Preload Next Image (hidden) */}
      {images.length > 1 && (
        <Image
          src={images[(currentIndex + 1) % images.length]}
          alt="Preload next gallery image"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          priority={false}
          quality={85}
          style={{ display: 'none' }}
        />
      )}

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? 'bg-white w-4'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => goToSlide((currentIndex - 1 + images.length) % images.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300"
        aria-label="Previous image"
      >
        ←
      </button>
      <button
        onClick={() => goToSlide((currentIndex + 1) % images.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300"
        aria-label="Next image"
      >
        →
      </button>
    </div>
  )
} 