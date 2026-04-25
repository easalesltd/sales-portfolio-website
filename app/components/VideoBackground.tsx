'use client';

import React, { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  videoUrl: string;
  children: React.ReactNode;
  fadeIn?: boolean;
  playbackRate?: number; // Speed multiplier (0.5 = half speed, 2 = double speed)
}

export default function VideoBackground({
  videoUrl,
  children,
  fadeIn = false,
  playbackRate = 1.0,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.playbackRate = playbackRate;

    const attemptPlay = () => {
      void video.play().catch(() => {
        // Keep silent; browsers can still block autoplay in rare cases.
      });
    };

    const handleLoadedData = () => {
      setIsLoaded(true);
      attemptPlay();
    };
    const handleCanPlay = () => attemptPlay();

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);

    // Always force a source reload after client navigation to avoid first-load no-play race.
    video.load();
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      handleLoadedData();
    } else {
      attemptPlay();
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.pause();
    };
  }, [playbackRate, videoUrl]);

  return (
    <div className="relative w-full">
      <div className="absolute inset-0 bg-black/20 pointer-events-none">
        <video
          key={videoUrl}
          ref={videoRef}
          className={`w-full h-full object-cover ${isLoaded ? 'opacity-20' : 'opacity-0'}`}
          style={{
            transition: fadeIn ? 'opacity 1s ease-in' : 'none',
          }}
          muted
          playsInline
          loop
          autoPlay
          preload="metadata"
          x-webkit-airplay="deny"
          disablePictureInPicture
          controlsList="nodownload noplaybackrate"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>

      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
