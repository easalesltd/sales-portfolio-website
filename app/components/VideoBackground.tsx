'use client';

import React, { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  videoUrl: string;
  children: React.ReactNode;
  fadeIn?: boolean;
  playbackRate?: number;
  /** Poster frame while the video buffer loads. */
  posterUrl?: string;
}

/**
 * Decorative muted background video. Files must be video-only (no audio track) so
 * iOS/Android do not pause Spotify/Apple Music when playback starts.
 */
export default function VideoBackground({
  videoUrl,
  children,
  fadeIn = false,
  playbackRate = 1.0,
  posterUrl,
}: VideoBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: '120px', threshold: 0.01 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.playsInline = true;
    video.playbackRate = playbackRate;

    if (!isInView) {
      video.pause();
      return;
    }

    const startPlayback = () => {
      setIsLoaded(true);
      void video.play().catch(() => {
        // Autoplay can still be blocked in strict browser policies.
      });
    };

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      startPlayback();
      return;
    }

    video.addEventListener('loadeddata', startPlayback, { once: true });
    return () => video.removeEventListener('loadeddata', startPlayback);
  }, [isInView, playbackRate, videoUrl]);

  const backdropClass = `h-full w-full object-cover ${isLoaded ? 'opacity-20' : 'opacity-0'}`;
  const backdropTransition = fadeIn ? 'opacity 1s ease-in' : 'none';

  return (
    <div ref={containerRef} className="relative h-full min-h-0 w-full">
      <div className="pointer-events-none absolute inset-0 bg-black/20">
        <video
          key={videoUrl}
          ref={videoRef}
          className={backdropClass}
          style={{ transition: backdropTransition }}
          poster={posterUrl}
          data-decorative-background
          muted
          playsInline
          loop
          preload={isInView ? 'metadata' : 'none'}
          disablePictureInPicture
          controlsList="nodownload noplaybackrate nofullscreen"
          aria-hidden
          tabIndex={-1}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>

      <div className="relative z-10 h-full min-h-0 w-full">{children}</div>
    </div>
  );
}
