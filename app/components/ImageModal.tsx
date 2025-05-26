'use client';

import { useEffect } from 'react';
import Image from 'next/image';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  alt: string;
}

export default function ImageModal({ isOpen, onClose, imageSrc, alt }: ImageModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      // Prevent default touch behavior to avoid scrolling
      e.preventDefault();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('touchstart', handleTouchStart, { passive: false });
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none'; // Prevent touch actions while modal is open
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('touchstart', handleTouchStart);
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4 touch-none"
      onClick={onClose}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div 
        className="relative w-full h-full max-w-[95vw] max-h-[95vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <button
          onClick={e => {
            e.stopPropagation();
            onClose();
          }}
          onTouchStart={e => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={imageSrc}
            alt={alt}
            width={1200}
            height={800}
            className="object-contain max-h-[90vh] w-auto max-w-full"
            quality={100}
            priority
            sizes="(max-width: 768px) 95vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>
      </div>
    </div>
  );
} 