'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImageModal from '../components/ImageModal';

const IMAGE_SRC = '/images/what-is-a-sales-agent/Screenshot%202026-02-15%20at%2014.47.45.png';
const IMAGE_ALT = 'Map showing how companies separate sales territories between agents across the UK';

export default function TerritoryImage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="my-8">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="block w-full max-w-2xl mx-auto rounded-lg overflow-hidden shadow-md bg-gray-100 cursor-pointer hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="View territory map full size"
        >
          <div className="relative w-full aspect-video">
            <Image
              src={IMAGE_SRC}
              alt={IMAGE_ALT}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        </button>
        <p className="text-sm text-gray-500 mt-2 text-center max-w-2xl mx-auto">
          Companies separate the country into territories, with each area covered by a dedicated agent. Click the image to view full size.
        </p>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageSrc={IMAGE_SRC}
        alt={IMAGE_ALT}
      />
    </>
  );
}
