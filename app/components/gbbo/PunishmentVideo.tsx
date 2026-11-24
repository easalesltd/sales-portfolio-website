"use client";

import { useEffect, useRef, useState } from "react";

/** Force a decodeable first frame so blank black rectangles do not sit around waiting for play. */
function previewSrc(src: string): string {
  if (src.includes("#")) return src;
  return `${src}#t=0.001`;
}

export function PunishmentVideo({
  src,
  label,
  compact = false,
  /** Defer network load until the clip is near the viewport (needed for Wrapped’s many tapes). */
  lazy = false,
}: {
  src: string | null;
  label: string;
  compact?: boolean;
  lazy?: boolean;
}) {
  const figureRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [poster, setPoster] = useState<string | undefined>(undefined);
  const [active, setActive] = useState(!lazy);
  const captured = useRef(false);

  useEffect(() => {
    captured.current = false;
    setPoster(undefined);
    if (!lazy) {
      setActive(true);
      return;
    }
    setActive(false);
    const node = figureRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const scrollRoot = node.closest("[data-unwrapped-scroller]");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      {
        root: scrollRoot instanceof Element ? scrollRoot : null,
        rootMargin: "240px 0px",
        threshold: 0.01,
      },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [src, lazy]);

  function capturePoster() {
    const video = videoRef.current;
    if (!video || captured.current || video.videoWidth < 2 || video.videoHeight < 2) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return;
    try {
      context.drawImage(video, 0, 0);
      const data = canvas.toDataURL("image/jpeg", 0.72);
      if (data.startsWith("data:image")) {
        captured.current = true;
        setPoster(data);
      }
    } catch {
      // Same-origin Crimewatch clips should allow this; ignore if a browser blocks it.
    }
  }

  if (!src) return null;

  return (
    <figure ref={figureRef} className={compact ? "w-44 max-w-full sm:w-52" : "w-full max-w-md"}>
      {active ? (
        <video
          ref={videoRef}
          className="aspect-[9/16] w-full rounded-2xl bg-chocolate object-cover"
          src={previewSrc(src)}
          poster={poster}
          controls
          playsInline
          preload="metadata"
          controlsList="nodownload"
          onLoadedMetadata={(event) => {
            const video = event.currentTarget;
            if (video.currentTime < 0.05) {
              try {
                video.currentTime = 0.1;
              } catch {
                capturePoster();
              }
            } else {
              capturePoster();
            }
          }}
          onLoadedData={capturePoster}
          onSeeked={capturePoster}
          onError={() => {
            // Fall back to the plain URL if the media fragment / seek path fails.
            const video = videoRef.current;
            if (!video || video.dataset.fallback === "1") return;
            video.dataset.fallback = "1";
            video.removeAttribute("poster");
            video.src = src;
            video.load();
          }}
        />
      ) : (
        <button
          type="button"
          className="flex aspect-[9/16] w-full items-center justify-center rounded-2xl bg-chocolate/90 text-sm font-bold text-flour"
          onClick={() => setActive(true)}
        >
          Tap to load tape
        </button>
      )}
      <figcaption className="mt-1 text-xs opacity-70">{label}</figcaption>
    </figure>
  );
}
