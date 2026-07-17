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
 *
 * Mobile Chrome needs: muted + playsInline + autoPlay attributes, an explicit
 * load() when the section enters view, and faststart MP4s (moov before mdat).
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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: '160px', threshold: 0.01 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Attribute + property — Android Chrome is picky about muted autoplay.
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.playsInline = true;
    video.playbackRate = playbackRate;

    if (!isInView) {
      video.pause();
      return;
    }

    let cancelled = false;

    const tryPlay = () => {
      if (cancelled) return;
      setIsReady(true);
      const playAttempt = video.play();
      if (playAttempt !== undefined) {
        void playAttempt.catch(() => {
          // Strict autoplay policies can still block; keep poster / first frame.
        });
      }
    };

    const onCanPlay = () => tryPlay();
    const onLoadedData = () => tryPlay();

    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('loadeddata', onLoadedData);

    // Kick loading — preload alone is unreliable on mobile when src was idle.
    if (video.preload !== 'auto') {
      video.preload = 'auto';
    }
    video.load();

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      tryPlay();
    }

    // Retry after a short delay (Chrome sometimes needs a second nudge).
    const retryId = window.setTimeout(() => {
      if (!cancelled && video.paused) tryPlay();
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(retryId);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('loadeddata', onLoadedData);
    };
  }, [isInView, playbackRate, videoUrl]);

  const showMedia = isReady || Boolean(posterUrl);
  const backdropClass = `h-full w-full object-cover ${showMedia ? 'opacity-20' : 'opacity-0'}`;
  const backdropTransition = fadeIn ? 'opacity 1s ease-in' : 'none';

  return (
    <div ref={containerRef} className="relative h-full min-h-0 w-full">
      <div className="pointer-events-none absolute inset-0 bg-black/20">
        <video
          key={videoUrl}
          ref={videoRef}
          className={backdropClass}
          style={{ transition: backdropTransition }}
          src={isInView ? videoUrl : undefined}
          poster={posterUrl}
          data-decorative-background
          muted
          autoPlay
          playsInline
          loop
          preload={isInView ? 'auto' : 'none'}
          disablePictureInPicture
          controlsList="nodownload noplaybackrate nofullscreen"
          aria-hidden
          tabIndex={-1}
        />
      </div>

      <div className="relative z-10 h-full min-h-0 w-full">{children}</div>
    </div>
  );
}
