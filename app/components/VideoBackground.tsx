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
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Initial setup
    video.muted = true;
    video.playsInline = true;
    video.load();

    const handleLoadedData = () => {
      setIsLoaded(true);
      // Attempt to play immediately when loaded
      video.play().catch(error => {
        console.log('Initial playback failed:', error);
        // If initial play fails, try again with user interaction
        const playOnInteraction = async () => {
          try {
            await video.play();
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('touchstart', playOnInteraction);
          } catch (e) {
            console.log('Interaction playback failed:', e);
          }
        };
        document.addEventListener('click', playOnInteraction);
        document.addEventListener('touchstart', playOnInteraction);
      });
    };

    video.addEventListener('loadeddata', handleLoadedData);

    // Cleanup
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      document.removeEventListener('click', handleLoadedData);
      document.removeEventListener('touchstart', handleLoadedData);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Video Background */}
      <div className="absolute inset-0 bg-black/20">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            isLoaded ? 'opacity-20' : 'opacity-0'
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
      <div className="relative w-full h-full">
        {children}
      </div>
    </div>
  );
} 