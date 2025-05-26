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
<<<<<<< Updated upstream
=======
  const [isLoaded, setIsLoaded] = useState(false);
>>>>>>> Stashed changes
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Initial setup
    video.muted = true;
    video.playsInline = true;
    video.loop = true;

<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Video Background */}
      <div className="absolute inset-0 bg-black/20">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
<<<<<<< Updated upstream
            isPlaying ? 'opacity-30' : 'opacity-0'
=======
            isLoaded ? 'opacity-20' : 'opacity-0'
>>>>>>> Stashed changes
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