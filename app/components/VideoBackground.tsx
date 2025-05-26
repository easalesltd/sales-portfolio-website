'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  videoUrl: string;
  children: React.ReactNode;
  fadeIn?: boolean;
  fadeOut?: boolean;
}

export default function VideoBackground({ 
  videoUrl, 
  children,
  fadeIn = true,
  fadeOut = true
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Initial setup
    video.muted = true;
    video.playsInline = true;
    video.loop = true;

    const checkVisibility = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const isVisible = (
        rect.top < window.innerHeight &&
        rect.bottom > 0
      );

      if (isVisible && !isPlaying) {
        video.play()
          .then(() => setIsPlaying(true))
          .catch(error => console.log('Playback failed:', error));
      } else if (!isVisible && isPlaying) {
        video.pause();
        video.currentTime = 0;
        setIsPlaying(false);
      }
    };

    // Check visibility on scroll and resize
    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);
    
    // Initial check
    checkVisibility();

    return () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    };
  }, [isPlaying]);

  return (
    <div ref={containerRef} className="relative">
      {/* Video Background */}
      <div className="absolute inset-0 bg-white">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            isPlaying ? 'opacity-30' : 'opacity-0'
          }`}
          style={{
            transition: fadeIn ? 'opacity 1s ease-in' : 'none'
          }}
          muted
          playsInline
          loop
          preload="auto"
          x-webkit-airplay="deny"
          disablePictureInPicture
          controlsList="nodownload noplaybackrate"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
} 