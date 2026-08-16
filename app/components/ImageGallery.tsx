'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import ImageModal from './ImageModal'

interface ImageGalleryProps {
  images: string[]
  interval?: number // Time in milliseconds between slides
}

export default function ImageGallery({ images, interval = 5000 }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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

  const openLightbox = () => setLightboxOpen(true)
  const closeLightbox = () => setLightboxOpen(false)

  const modalPrevious = () => goToPrevious()
  const modalNext = () => goToNext()

  if (!images.length) return null

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full h-[min(70vw,480px)] min-h-[320px] overflow-hidden rounded-xl touch-pan-y bg-zinc-100 dark:bg-neutral-800"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-neutral-700 animate-pulse rounded-xl" />
        )}

        <button
          type="button"
          className="absolute inset-0 z-[1] cursor-zoom-in border-0 p-0 bg-transparent text-left"
          aria-label="Open image full screen"
          aria-haspopup="dialog"
          aria-expanded={lightboxOpen}
          onClick={openLightbox}
        />

        <Image
          src={encodeURI(images[currentIndex])}
          alt={`Gallery image ${currentIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          priority={currentIndex === 0}
          quality={85}
          className={`object-contain p-3 transition-opacity duration-500 pointer-events-none ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoadingComplete={() => setIsLoading(false)}
        />

        {images.length > 1 && (
          <Image
            src={encodeURI(images[(currentIndex + 1) % images.length])}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            priority={false}
            quality={85}
            style={{ display: 'none' }}
          />
        )}

        <div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-[2]"
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
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? 'bg-zinc-900 dark:bg-white w-4'
                  : 'bg-zinc-400/80 hover:bg-zinc-600 dark:bg-white/50 dark:hover:bg-white/75'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            goToPrevious()
          }}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300 z-[2]"
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
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300 z-[2]"
          aria-label="Next image"
        >
          →
        </button>
      </div>

      <ImageModal
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        imageSrc={encodeURI(images[currentIndex])}
        alt={`Gallery image ${currentIndex + 1}`}
        onPrevious={images.length > 1 ? modalPrevious : undefined}
        onNext={images.length > 1 ? modalNext : undefined}
        currentIndex={currentIndex}
        totalImages={images.length}
      />
    </>
  )
}
