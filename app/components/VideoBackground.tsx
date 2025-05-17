'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface VideoBackgroundProps {
  children?: React.ReactNode;
  videoUrl?: string;
  fallbackImageUrl?: string;
}

export default function VideoBackground({ children, videoUrl = '/videos/showcase.mp4', fallbackImageUrl }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVideoSupported, setIsVideoSupported] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (info: string) => {
    console.log('Video Debug:', info);
    setDebugInfo(prev => [...prev, info]);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      addDebugInfo('Video ref not available');
      return;
    }

    // Reset states
    setError(null);
    setIsLoaded(false);
    setDebugInfo([]);
    addDebugInfo(`Attempting to load video: ${videoUrl}`);

    // Check if video format is supported
    const checkVideoSupport = () => {
      const videoTest = document.createElement('video');
      const canPlayMP4 = videoTest.canPlayType('video/mp4');
      addDebugInfo(`Browser MP4 support: ${canPlayMP4}`);
      return canPlayMP4 !== "";
    };
    const isSupported = checkVideoSupport();
    setIsVideoSupported(isSupported);
    
    if (!isSupported) {
      addDebugInfo('Video format not supported by browser');
      return;
    }

    const handleVideoError = (e: Event) => {
      const videoElement = e.target as HTMLVideoElement;
      const errorMessage = videoElement.error ? `Code: ${videoElement.error.code}, Message: ${videoElement.error.message}` : 'Unknown error';
      addDebugInfo(`Video error: ${errorMessage}`);
      setError('Error loading video');
      setIsLoaded(false);
    };

    const handleLoadedData = () => {
      addDebugInfo('Video data loaded successfully');
      setIsLoaded(true);
      // Try playing the video with a retry mechanism
      const attemptPlay = async (retries = 3) => {
        try {
          await video.play();
          addDebugInfo('Video playing successfully');
        } catch (err) {
          addDebugInfo(`Video autoplay failed (attempt ${4 - retries}/3): ${err}`);
          if (retries > 0) {
            setTimeout(() => attemptPlay(retries - 1), 1000);
          } else {
            setError('Failed to autoplay video');
          }
        }
      };
      attemptPlay();
    };

    const handleLoadStart = () => {
      addDebugInfo('Video load started');
    };

    const handleCanPlay = () => {
      addDebugInfo('Video can play');
    };

    // Add event listeners
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleVideoError);
    video.addEventListener('stalled', () => addDebugInfo('Video stalled'));
    video.addEventListener('suspend', () => addDebugInfo('Video suspended'));
    video.addEventListener('waiting', () => addDebugInfo('Video waiting'));

    // Check if video file exists and is accessible
    fetch(videoUrl, { method: 'HEAD' })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Video file not found: ${response.status} ${response.statusText}`);
        }
        addDebugInfo('Video file exists and is accessible');
      })
      .catch(err => {
        addDebugInfo(`Video file check failed: ${err}`);
        setError('Failed to load video');
      });

    // Cleanup
    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleVideoError);
      video.removeEventListener('stalled', () => {});
      video.removeEventListener('suspend', () => {});
      video.removeEventListener('waiting', () => {});
      video.pause();
      video.removeAttribute('src');
      video.load();
      addDebugInfo('Video cleanup completed');
    };
  }, [videoUrl]);

  // If video is not supported or there's an error, show fallback
  if (!isVideoSupported || error) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 w-full h-full overflow-hidden">
          {fallbackImageUrl ? (
            <div className="absolute inset-0">
              <Image
                src={fallbackImageUrl}
                alt="Background"
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <div className="text-white text-center p-4">
                <p className="mb-2">{error || 'Video playback not supported'}</p>
                <details className="text-sm opacity-75">
                  <summary>Debug Info</summary>
                  <pre className="mt-2 text-left">
                    {debugInfo.map((info, i) => (
                      <div key={i}>{info}</div>
                    ))}
                  </pre>
                </details>
              </div>
            </div>
          )}
        </div>
        <div className="relative z-40">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Container */}
      <div className="fixed inset-0 w-full h-full overflow-hidden">
        {/* Loading state */}
        <div 
          className={`absolute inset-0 bg-gray-900 transition-opacity duration-1000 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          } z-10`} 
        />
        
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={`
            absolute inset-0 w-full h-full object-cover
            transition-opacity duration-1000
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
            z-0
          `}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30 z-30" />

        {/* Debug overlay (only visible during development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute bottom-4 right-4 z-50 bg-black/50 text-white text-xs p-2 rounded">
            <details>
              <summary>Video Debug Info</summary>
              <pre className="mt-2">
                {debugInfo.map((info, i) => (
                  <div key={i}>{info}</div>
                ))}
              </pre>
            </details>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-40">
        {children}
      </div>
    </div>
  );
} 