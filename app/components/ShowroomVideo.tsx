'use client';

import React from 'react';

interface ShowroomVideoProps {
  videoSrc: string;
  posterSrc: string;
}

export default function ShowroomVideo({ videoSrc, posterSrc }: ShowroomVideoProps) {
  const handlePlay = () => {
    // Pause background video when showroom tour starts
    const backgroundVideo = document.querySelector('video[autoplay]') as HTMLVideoElement;
    if (backgroundVideo) {
      backgroundVideo.pause();
    }
  };

  const handlePause = () => {
    // Resume background video when showroom tour is paused
    const backgroundVideo = document.querySelector('video[autoplay]') as HTMLVideoElement;
    if (backgroundVideo) {
      backgroundVideo.play().catch(() => {
        // Handle play failure silently
      });
    }
  };

  const handleEnded = () => {
    // Resume background video when showroom tour ends
    const backgroundVideo = document.querySelector('video[autoplay]') as HTMLVideoElement;
    if (backgroundVideo) {
      backgroundVideo.play().catch(() => {
        // Handle play failure silently
      });
    }
  };

  return (
    <div className="relative max-w-md mx-auto aspect-[9/16] rounded-lg overflow-hidden shadow-lg">
      <video
        controls
        preload="none"
        className="w-full h-full object-cover"
        poster={posterSrc}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        style={{
          objectFit: 'contain',
          backgroundColor: '#f8f9fa'
        }}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}