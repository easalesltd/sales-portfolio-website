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
  const [isVisible, setIsVisible] = useState(false);
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
    };

    video.addEventListener('loadeddata', handleLoadedData);

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
        
        if (!video) return;

        if (entry.isIntersecting) {
          // When section becomes visible
          const playVideo = async () => {
            try {
              if (video.currentTime > 0) {
                // If video was previously played, start from beginning
                video.currentTime = 0;
              }
              await video.play();
            } catch (error) {
              console.log('Playback failed, trying with muted...', error);
              video.muted = true;
              try {
                await video.play();
              } catch (secondError) {
                console.log('Muted playback failed, waiting for interaction...', secondError);
                const playOnTouch = async () => {
                  try {
                    await video.play();
                    document.removeEventListener('touchstart', playOnTouch);
                  } catch (e) {
                    console.log('Touch playback failed:', e);
                  }
                };
                document.addEventListener('touchstart', playOnTouch, { once: true });
              }
            }
          };
          playVideo();
        } else {
          // When section is not visible
          if (fadeOut) {
            // Fade out before pausing
            video.style.transition = 'opacity 1s ease-out';
            video.style.opacity = '0';
            setTimeout(() => {
              video.pause();
              video.currentTime = 0;
            }, 1000);
          } else {
            video.pause();
            video.currentTime = 0;
          }
        }
      },
      {
        threshold: [0.1, 0.5], // Trigger at both 10% and 50% visibility
        rootMargin: '0px',
      }
    );

    const currentContainer = containerRef.current;
    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [fadeOut]);

  return (
    <div ref={containerRef} className="relative">
      {/* Video Background */}
      <div className="absolute inset-0 bg-white">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            isVisible && isLoaded ? 'opacity-30' : 'opacity-0'
          }`}
          style={{
            transition: fadeIn ? 'opacity 1s ease-in' : 'none'
          }}
          muted
          playsInline
          loop
          preload="metadata"
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