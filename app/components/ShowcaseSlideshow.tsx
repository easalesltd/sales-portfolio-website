'use client';

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const TRANSITION_DURATION = 1000; // 1 second for a smoother fade transition
const SLIDE_DURATION = 5000; // 5 seconds per slide for better viewing

type ShowcaseSlide = { src: string; alt: string };

/** Homepage hero — descriptive alts only (no layout/CSS change); keep file list in sync with public/images/showcase. */
const SHOWCASE_SLIDES: ShowcaseSlide[] = [
  { src: '/images/showcase/1-1-25.jpeg', alt: 'Seasonal greeting cards on a shop display' },
  { src: '/images/showcase/1066f4f9-50ba-4dfb-8f5d-703151fd119e.jpeg', alt: 'Greeting card spinner in an independent shop' },
  { src: '/images/showcase/1755245031292398.jpg', alt: 'Wholesale greeting cards and gifts laid out for a retailer' },
  { src: '/images/showcase/1755253128244036.jpg', alt: 'Card and gift point of sale on a shop floor' },
  { src: '/images/showcase/4003f792-f399-4cc5-8802-e2bfcd93c330.jpeg', alt: 'Greeting card bay in an independent retailer' },
  { src: '/images/showcase/6c27d66e-3695-49a1-b4a4-d7967106679b.jpeg', alt: 'Greeting card fixture in a garden centre' },
  { src: '/images/showcase/901d0ddb-3e10-4a3d-aeee-c2d207eba557.jpeg', alt: 'Publisher greeting card ranges on a retail display' },
  { src: '/images/showcase/Fudge-hero-1536x600.png', alt: 'Wholesale fudge and confectionery display' },
  { src: '/images/showcase/Hero-sticks-1024x600.png', alt: 'Chocolate sticks on a wholesale confectionery stand' },
  {
    src: '/images/showcase/IMG_0670_copy_bdc70bf1-59fc-476e-9c6d-bf96f508ee40_1500x.jpeg',
    alt: 'Greeting cards and stationery on a retailer counter',
  },
  { src: '/images/showcase/Large-Hamper-1024x600.png', alt: 'Large wholesale gift hamper' },
  { src: '/images/companies/ohh-deer/official/back-to-school.jpg', alt: 'Ohh Deer back-to-school stationery and cards' },
  { src: '/images/companies/ohh-deer/official/catalogue-banner.jpg', alt: 'Ohh Deer wholesale catalogue range' },
  { src: '/images/companies/mint-publishing/official/banner-1-1-26.jpg', alt: 'Mint Publishing greeting card range' },
  { src: '/images/companies/mint-publishing/official/banner-1-1-27.jpg', alt: 'Mint Publishing humorous birthday cards' },
  { src: '/images/companies/global-journey/official/cake-candles.jpg', alt: 'Global Journey cake candles gift range' },
  { src: '/images/companies/museums-and-galleries/official/range-cards.jpg', alt: 'Museums and Galleries licensed art greeting cards' },
  { src: '/images/companies/rudi-and-bear/official/wholesale-hero.jpg', alt: 'Rudi and Bear Ned character gifts' },
  { src: '/images/companies/boxer-gifts/official/deadly-blooms.jpg', alt: 'Boxer Gifts Deadly Blooms catalogue' },
  { src: '/images/companies/emotional-rescue/emo_web.jpeg', alt: 'Emotional Rescue humorous greeting cards' },
  { src: '/images/showcase/b6943adc-3dc7-47b7-9c10-399cd36d33c1.jpeg', alt: 'Greeting cards laid out on a retailer visit' },
  { src: '/images/showcase/bd66610d-a7c2-4835-9657-9e4248cf7400.jpeg', alt: 'Card and gift shelves in a shop' },
  { src: '/images/showcase/d40a6860-3952-4308-b87b-770c946035a3.jpeg', alt: 'Wholesale order display in an independent shop' },
  { src: '/images/showcase/image (17).png', alt: 'Mixed giftware and greeting cards' },
  { src: '/images/showcase/mix-hero-1024x600.png', alt: 'Mixed greeting cards and gifts' },
  { src: '/images/showcase/showcase1.jpeg', alt: 'Retail greeting card display' },
  { src: '/images/showcase/showcase2.jpeg', alt: 'Shop card fixture and gift display' },
  { src: '/images/showcase/showcase4.jpeg', alt: 'Greeting cards merchandised for trade customers' },
  { src: '/images/showcase/paper-salad-mothers-day-amazing-mum.jpg', alt: 'Paper Salad Mother’s Day greeting cards' },
  { src: '/images/showcase/paper-salad-valentines-range.jpg', alt: 'Paper Salad Valentine’s Day greeting cards' },
  { src: '/images/showcase/paper-salad-mothers-day-queen-of-mums.jpg', alt: 'Paper Salad Queen of Mums greeting cards' },
];

export default function ShowcaseSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageError, setImageError] = useState<boolean[]>(new Array(SHOWCASE_SLIDES.length).fill(false));
  /** Start with a full ordered list so SSR and first paint never show an empty/loading state. */
  const [shuffledImages, setShuffledImages] = useState<ShowcaseSlide[]>(() => [...SHOWCASE_SLIDES]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse drag support (desktop + trackpads). Uses refs so we don't re-render mid-drag.
  const dragStartXRef = useRef<number | null>(null);
  const dragStartYRef = useRef<number | null>(null);
  const dragEndXRef = useRef<number | null>(null);
  const dragEndYRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Function to shuffle array using Fisher-Yates algorithm
  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Shuffle after mount (client-only); keep the first slide so LCP and hydration stay stable.
  useEffect(() => {
    const [first, ...rest] = SHOWCASE_SLIDES;
    setShuffledImages([first, ...shuffleArray(rest)]);
  }, []);

  useEffect(() => {
    if (shuffledImages.length === 0 || !isAutoPlaying) return;

    let transitionTimeoutId: number | undefined;

    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIdx = (prev + 1) % shuffledImages.length;
        setNextIndex(nextIdx);
        setIsTransitioning(true);
        transitionTimeoutId = window.setTimeout(() => {
          setCurrentIndex(nextIdx);
          setIsTransitioning(false);
        }, TRANSITION_DURATION);
        return prev;
      });
    }, SLIDE_DURATION);

    return () => {
      window.clearInterval(timer);
      if (transitionTimeoutId !== undefined) clearTimeout(transitionTimeoutId);
    };
  }, [currentIndex, shuffledImages.length, isAutoPlaying]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartRef.current == null || touchEndRef.current == null) return;
    
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left - go to next image
      const nextIdx = (currentIndex + 1) % shuffledImages.length;
      setNextIndex(nextIdx);
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(nextIdx);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
    } else if (isRightSwipe) {
      // Swipe right - go to previous image
      const prevIdx = (currentIndex - 1 + shuffledImages.length) % shuffledImages.length;
      setNextIndex(prevIdx);
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(prevIdx);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
    }

    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 5000);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only primary button
    isDraggingRef.current = true;
    setIsAutoPlaying(false);
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    dragEndXRef.current = e.clientX;
    dragEndYRef.current = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    dragEndXRef.current = e.clientX;
    dragEndYRef.current = e.clientY;
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (
      dragStartXRef.current == null ||
      dragStartYRef.current == null ||
      dragEndXRef.current == null ||
      dragEndYRef.current == null
    )
      return;

    const distanceX = dragStartXRef.current - dragEndXRef.current;
    const distanceY = dragStartYRef.current - dragEndYRef.current;

    // Only treat as a horizontal swipe if it "dominates" vertical movement.
    const isHorizontalGesture = Math.abs(distanceX) > Math.abs(distanceY) * 1.1;
    if (!isHorizontalGesture) return;

    if (distanceX > minSwipeDistance) {
      const nextIdx = (currentIndex + 1) % shuffledImages.length;
      setNextIndex(nextIdx);
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(nextIdx);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
    } else if (distanceX < -minSwipeDistance) {
      const prevIdx = (currentIndex - 1 + shuffledImages.length) % shuffledImages.length;
      setNextIndex(prevIdx);
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(prevIdx);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
    }

    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 5000);
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    // If the user drags out of the container, stop the drag so it doesn't "stick".
    if (isDraggingRef.current) isDraggingRef.current = false;
    setIsAutoPlaying(true);
  };

  const handleImageError = (index: number) => {
    setImageError(prev => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  };

  // If every slide failed, show a neutral fallback (no loading copy for crawlers or users).
  if (imageError.length > 0 && imageError.every(Boolean)) {
    return (
      <div
        className="absolute inset-0 w-full h-full overflow-hidden bg-gradient-to-br from-slate-200 via-slate-100 to-blue-50"
        aria-hidden
      />
    );
  }

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setNextIndex(index);
    setIsTransitioning(true);
    setIsAutoPlaying(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
      // Resume auto-play after 5 seconds of inactivity
      setTimeout(() => {
        setIsAutoPlaying(true);
      }, 5000);
    }, TRANSITION_DURATION);
  };

  return (
    <div 
      ref={containerRef}
      className="relative min-h-0 min-w-0 w-full h-full overflow-hidden ring-0 transition-shadow duration-300 md:hover:ring-2 md:hover:ring-white/20"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Images Container */}
      <div className="relative min-h-0 h-full w-full overflow-hidden bg-white md:bg-transparent">
        {/* Current Image */}
        <div 
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden [&_img]:!h-full [&_img]:!w-full [&_img]:max-w-none [&_img]:object-cover"
          style={{ 
            opacity: isTransitioning ? 0 : 1, 
            transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`,
            backgroundColor: 'rgba(0, 0, 0, 0.1)'
          }}
        >
          <Image
            src={shuffledImages[currentIndex].src}
            alt={shuffledImages[currentIndex].alt}
            fill
            className="object-cover select-none max-w-none"
            priority={currentIndex === 0}
            fetchPriority={currentIndex === 0 ? 'high' : 'auto'}
            onError={() => handleImageError(currentIndex)}
            sizes="100vw"
            quality={75}
            draggable={false}
          />
        </div>

        {/* Next Image */}
        <div 
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden [&_img]:!h-full [&_img]:!w-full [&_img]:max-w-none [&_img]:object-cover"
          style={{ 
            opacity: isTransitioning ? 1 : 0, 
            transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`,
            backgroundColor: 'rgba(0, 0, 0, 0.1)'
          }}
        >
          <Image
            src={shuffledImages[nextIndex].src}
            alt={shuffledImages[nextIndex].alt}
            fill
            className="object-cover select-none max-w-none"
            loading="lazy"
            onError={() => handleImageError(nextIndex)}
            sizes="100vw"
            quality={75}
            draggable={false}
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

      {/* Navigation Arrows */}
      <button
        onClick={() => goToSlide((currentIndex - 1 + shuffledImages.length) % shuffledImages.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300"
        aria-label="Previous image"
      >
        ←
      </button>
      <button
        onClick={() => goToSlide((currentIndex + 1) % shuffledImages.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300"
        aria-label="Next image"
      >
        →
      </button>
    </div>
  );
} 