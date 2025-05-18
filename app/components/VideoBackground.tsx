'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  videoUrl: string;
  children: React.ReactNode;
}

export default function VideoBackground({ videoUrl, children }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Initial setup
      video.muted = true;
      video.playsInline = true;
      video.load();
      video.pause();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
        
        const video = videoRef.current;
        if (!video) return;

        if (entry.isIntersecting) {
          // When section becomes visible
          const playVideo = async () => {
            try {
              video.currentTime = 0;
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
          video.pause();
          video.currentTime = 0;
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
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Video Background */}
      <div className="absolute inset-0 bg-white">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            isVisible ? 'opacity-30' : 'opacity-0'
          }`}
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