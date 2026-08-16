'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import ImageModal from './ImageModal'

interface ImageGalleryProps {
  images: string[]
  interval?: number
}

function gallerySrc(src: string) {
  return encodeURI(src)
}

export default function ImageGallery({ images, interval = 5000 }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)

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

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distanceSwipe = touchStart - touchEnd
    const isLeftSwipe = distanceSwipe > 50
    const isRightSwipe = distanceSwipe < -50

    if (isLeftSwipe && images.length > 1) {
      goToNext()
    }
    if (isRightSwipe && images.length > 1) {
      goToPrevious()
    }
  }

  if (!images.length) return null

  const currentSrc = gallerySrc(images[currentIndex])

  return (
    <>
      <div
        className="relative w-full h-[400px] overflow-hidden rounded-xl touch-pan-y bg-neutral-100 dark:bg-neutral-900"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-xl" />
        )}

        <button
          type="button"
          className="absolute inset-0 z-[1] cursor-zoom-in border-0 p-0 bg-transparent"
          aria-label="Open image full screen"
          aria-haspopup="dialog"
          aria-expanded={lightboxOpen}
          onClick={() => setLightboxOpen(true)}
        />

        <Image
          src={currentSrc}
          alt={`Gallery image ${currentIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={currentIndex === 0}
          quality={85}
          className={`object-contain transition-opacity duration-500 pointer-events-none ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)}
        />

        {images.length > 1 && (
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-[2]"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goToSlide(index)
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? 'bg-neutral-900 dark:bg-white w-4'
                    : 'bg-neutral-400/80 hover:bg-neutral-600 dark:bg-white/50 dark:hover:bg-white/75 w-2'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300 z-[2]"
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300 z-[2]"
              aria-label="Next image"
            >
              →
            </button>
          </>
        )}
      </div>

      <ImageModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        imageSrc={currentSrc}
        alt={`Gallery image ${currentIndex + 1}`}
        onPrevious={images.length > 1 ? goToPrevious : undefined}
        onNext={images.length > 1 ? goToNext : undefined}
        currentIndex={currentIndex}
        totalImages={images.length}
      />
    </>
  )
}
