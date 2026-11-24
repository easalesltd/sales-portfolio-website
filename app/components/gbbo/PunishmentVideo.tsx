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
}: {
  src: string | null;
  label: string;
  compact?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [poster, setPoster] = useState<string | undefined>(undefined);
  const captured = useRef(false);

  useEffect(() => {
    captured.current = false;
    setPoster(undefined);
  }, [src]);

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
    <figure className={compact ? "w-40 max-w-full" : "w-full max-w-md"}>
      <video
        ref={videoRef}
        className="aspect-[9/16] w-full rounded-2xl bg-chocolate object-cover"
        src={previewSrc(src)}
        poster={poster}
        controls
        playsInline
        preload="metadata"
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
      />
      <figcaption className="mt-1 text-xs text-chocolate/65">{label}</figcaption>
    </figure>
  );
}
