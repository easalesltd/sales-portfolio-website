'use client';

import React from 'react';
import { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  videoUrl: string;
  children: React.ReactNode;
  fadeIn?: boolean;
}

export default function VideoBackground({ 
  videoUrl, 
  children,
  fadeIn = false
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Initial setup
    video.muted = true;
    video.playsInline = true;
    video.load();

    // Attempt to play immediately
    video.play().catch(() => {
      // Handle autoplay failure silently
    });

    const handleLoadedData = () => {
      setIsLoaded(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);

    // Cleanup
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Video Background */}
      <div className="absolute inset-0 bg-black/20">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${isLoaded ? 'opacity-20' : 'opacity-0'}`}
          style={{
            transition: fadeIn ? 'opacity 1s ease-in' : 'none'
          }}
          muted
          playsInline
          loop
          autoPlay
          preload="auto"
          x-webkit-airplay="deny"
          disablePictureInPicture
          controlsList="nodownload noplaybackrate"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="relative w-full h-full">
        {children}
      </div>
    </div>
  );
} 