'use client';

import { useState } from 'react';
import ImageModal from './ImageModal';

type BlogCoverImageProps = {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  /** Magazine pages are portrait; 3/2 crops the masthead so the card stays full-bleed. */
  aspectClassName?: string;
  className?: string;
};

export default function BlogCoverImage({
  src,
  alt,
  aspectClassName = 'aspect-[3/2]',
  className = '',
}: BlogCoverImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`relative block w-full overflow-hidden bg-gray-100 dark:bg-neutral-800 cursor-zoom-in group/img focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 dark:focus-visible:ring-neutral-100 dark:focus-visible:ring-offset-neutral-950 ${aspectClassName} ${className}`}
        aria-label={`View full size: ${alt}`}
      >
        {/* Native img: next/image fill left portrait scans at intrinsic size, grey bar on the right. */}
        <img
          src={src}
          alt=""
          className="absolute inset-0 size-full max-h-none max-w-none object-cover object-top transition-transform duration-300 group-hover/img:scale-[1.02]"
        />
      </button>
      <ImageModal
        isOpen={open}
        onClose={() => setOpen(false)}
        imageSrc={src}
        alt={alt}
      />
    </>
  );
}
