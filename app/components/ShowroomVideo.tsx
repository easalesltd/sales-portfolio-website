'use client';

import React from 'react';

interface ShowroomVideoProps {
  videoSrc: string;
  posterSrc: string;
}

function mimeTypeForVideoPath(src: string): string {
  const path = src.split('?')[0]?.toLowerCase() ?? '';
  if (path.endsWith('.webm')) return 'video/webm';
  if (path.endsWith('.ogv') || path.endsWith('.ogg')) return 'video/ogg';
  if (path.endsWith('.mov') || path.endsWith('.qt')) return 'video/quicktime';
  return 'video/mp4';
}

/** Prefer H.264 MP4 when a `.mov` path is still used (Chrome on Windows). */
function videoSourcesForPath(src: string): { src: string; type: string }[] {
  const pathOnly = src.split('?')[0] ?? src;
  const lower = pathOnly.toLowerCase();
  if (lower.endsWith('.mov')) {
    const mp4Src = `${pathOnly.slice(0, -4)}.mp4`;
    return [
      { src: mp4Src, type: 'video/mp4' },
      { src, type: 'video/quicktime' },
    ];
  }
  return [{ src, type: mimeTypeForVideoPath(src) }];
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
        {videoSourcesForPath(videoSrc).map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
        Your browser does not support the video tag.
      </video>
    </div>
  );
}