'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  alt: string;
  onPrevious?: () => void;
  onNext?: () => void;
  currentIndex?: number;
  totalImages?: number;
}

export default function ImageModal({ isOpen, onClose, imageSrc, alt, onPrevious, onNext, currentIndex, totalImages }: ImageModalProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onNext) {
      onNext();
    }
    if (isRightSwipe && onPrevious) {
      onPrevious();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && onPrevious) {
        onPrevious();
      } else if (e.key === 'ArrowRight' && onNext) {
        onNext();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onPrevious, onNext]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
      onClick={onClose}
      onTouchEnd={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-full h-full max-w-[95vw] max-h-[95vh] flex items-center justify-center"
        onClick={e => e.stopPropagation()}
        onTouchEnd={e => e.stopPropagation()}
      >
        <button
          onClick={e => {
            e.stopPropagation();
            onClose();
          }}
          onTouchStart={e => {
            e.stopPropagation();
          }}
          onTouchEnd={e => {
            e.stopPropagation();
            e.preventDefault();
            onClose();
          }}
          className="absolute top-2 md:top-4 right-2 md:right-4 bg-black/50 hover:bg-black/70 active:bg-black/80 text-white rounded-full p-3 md:p-2 z-10 transition-colors touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center"
          aria-label="Close modal"
          style={{ touchAction: 'manipulation' }}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image counter */}
        {currentIndex !== undefined && totalImages !== undefined && (
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
            {currentIndex + 1} / {totalImages}
          </div>
        )}

        {/* Previous button */}
        {onPrevious && (
          <button
            onClick={e => {
              e.stopPropagation();
              onPrevious();
            }}
            onTouchStart={e => {
              e.stopPropagation();
            }}
            onTouchEnd={e => {
              e.stopPropagation();
              e.preventDefault();
              onPrevious();
            }}
            className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 active:bg-black/80 text-white rounded-full p-4 md:p-3 z-10 transition-colors touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Previous image"
            style={{ touchAction: 'manipulation' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Next button */}
        {onNext && (
          <button
            onClick={e => {
              e.stopPropagation();
              onNext();
            }}
            onTouchStart={e => {
              e.stopPropagation();
            }}
            onTouchEnd={e => {
              e.stopPropagation();
              e.preventDefault();
              onNext();
            }}
            className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 active:bg-black/80 text-white rounded-full p-4 md:p-3 z-10 transition-colors touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Next image"
            style={{ touchAction: 'manipulation' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        <div 
          className="relative w-full h-full flex items-center justify-center"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEndHandler}
        >
          <Image
            src={imageSrc}
            alt={alt}
            fill
            className="object-contain"
            quality={100}
            priority
            sizes="95vw"
          />
        </div>
      </div>
    </div>
  );
} 