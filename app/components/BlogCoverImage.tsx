'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImageModal from './ImageModal';

type BlogCoverImageProps = {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  /** e.g. aspect-[2/1] */
  aspectClassName?: string;
  className?: string;
};

export default function BlogCoverImage({
  src,
  alt,
  sizes = '(max-width: 768px) 100vw, 42rem',
  priority = false,
  aspectClassName = 'aspect-[2/1]',
  className = '',
}: BlogCoverImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`relative w-full overflow-hidden bg-gray-100 dark:bg-neutral-800 cursor-zoom-in group/img focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950 ${aspectClassName} ${className}`}
        aria-label={`View full size: ${alt}`}
      >
        <Image
          src={src}
          alt=""
          fill
          className="object-cover transition-transform duration-300 group-hover/img:scale-[1.02]"
          sizes={sizes}
          priority={priority}
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
