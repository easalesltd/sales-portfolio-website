'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import ImageModal from '@/app/components/ImageModal';

const bespokeSteps = [
  'Send over a high-res logo and a brief, or ask for a starting template.',
  'PDF design concepts come back within 2-3 working days, at no cost.',
  "Approve your design, sign off on a physical sample, and you're done.",
  'Labels are printed and held for you free of charge. Delivery to store takes around 2-3 weeks from artwork sign-off.',
];

const offTheShelfSteps = [
  'Pick your branding: CCCo. or The Little Things.',
  'Confirm what pricing information goes on the shelf edge strips.',
  'Choose your sweet selection (up to 30 varieties per display).',
];

const commonNotes = [
  'Minimum print run is 5,000 labels.',
  'Label formats: 45mm round or 40mm square.',
  'Displays are available in short or tall format.',
  'A full display holds around 360 bags (initial cost: GBP 540).',
];

type GalleryImage = {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
};

function ClickableImageTile({
  image,
  onOpen,
}: {
  image: GalleryImage;
  onOpen: (img: GalleryImage) => void;
}) {
  return (
    <button
      type="button"
      className={`relative h-56 sm:h-64 rounded-lg overflow-hidden shadow-md cursor-zoom-in ${image.className ?? ''}`}
      onClick={() => onOpen(image)}
      aria-label={`Expand image: ${image.alt}`}
    >
      <Image src={image.src} alt={image.alt} fill className="object-cover" sizes={image.sizes} />
    </button>
  );
}

export default function BespokeConfectionaryDisplaysClient() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const bespokeImages = useMemo<GalleryImage[]>(
    () => [
      {
        src: '/images/display-solutions/bespoke-confectionary/page-23-asset-1.jpeg',
        alt: 'Bespoke bag mockups and branded display concept',
        sizes: '(max-width: 1024px) 100vw, 50vw',
      },
      {
        src: '/images/display-solutions/bespoke-confectionary/page-22-asset-2.jpeg',
        alt: 'Sweet category examples for bespoke ranges',
        sizes: '(max-width: 1024px) 100vw, 25vw',
      },
      {
        src: '/images/display-solutions/bespoke-confectionary/page-22-asset-1.jpeg',
        alt: 'Bespoke confectionery visual style and textures',
        className: 'sm:col-span-2',
        sizes: '(max-width: 1024px) 100vw, 50vw',
      },
    ],
    []
  );

  const offTheShelfImages = useMemo<GalleryImage[]>(
    () => [
      {
        src: '/images/display-solutions/bespoke-confectionary/page-24-asset-2.jpeg',
        alt: 'Cambridge and Little Things branded bag options',
        sizes: '(max-width: 1024px) 100vw, 25vw',
      },
      {
        src: '/images/display-solutions/bespoke-confectionary/page-24-asset-1.jpeg',
        alt: 'Installed branded sweets display and display frame',
        sizes: '(max-width: 1024px) 100vw, 25vw',
      },
      {
        src: '/images/display-solutions/bespoke-confectionary/brochure-page-24.png',
        alt: 'Skip bespoke labelling brochure reference',
        className: 'sm:col-span-2',
        sizes: '(max-width: 1024px) 100vw, 50vw',
      },
    ],
    []
  );

  return (
    <>
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <section className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Display Solutions
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Bespoke Confectionary Displays
            </h1>
            <p className="text-lg text-gray-700 mt-4 max-w-4xl">
              The go-to bespoke confectionary and display service for attractions-style retailers
              across East Anglia. Choose the route that best fits your store: fully bespoke
              compostable labelling with matched display graphics, or a ready-to-install Cambridge
              branded solution.
            </p>
            <p className="text-base text-gray-700 mt-3 max-w-4xl">
              Ideal for gift shops in museums, heritage venues, visitor attractions, garden centres,
              farm parks and destination retail spaces in Suffolk, Norfolk, Essex and Cambridgeshire.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <a
                href="#bespoke-labelling"
                className="rounded-lg border border-blue-200 bg-blue-50 px-5 py-4 text-left transition hover:border-blue-400 hover:bg-blue-100"
              >
                <p className="text-sm font-medium text-blue-700">Option 1</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">Bespoke Labelling</p>
                <p className="text-gray-700 mt-2">
                  Ideal if you want your own logo, colours and design language on-pack and on display.
                </p>
              </a>

              <a
                href="#cambridge-branded"
                className="rounded-lg border border-gray-200 bg-gray-50 px-5 py-4 text-left transition hover:border-gray-400 hover:bg-gray-100"
              >
                <p className="text-sm font-medium text-gray-700">Option 2</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">
                  Cambridge Branded (Off the Shelf)
                </p>
                <p className="text-gray-700 mt-2">
                  Fast route to a stocked display using CCCo. branding (or The Little Things as an
                  alternative).
                </p>
              </a>
            </div>
          </section>

          <section
            id="bespoke-labelling"
            className="scroll-mt-28 bg-white rounded-lg shadow-lg p-6 md:p-8"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Bespoke Labelling</h2>
            <p className="text-gray-700 mt-3 max-w-4xl">
              Your logo, your colours, your shop. This route produces compostable labels and matching
              display graphics designed around your brand, from the bags on the shelf to the header
              card above.
            </p>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">How it works</h3>
                <ul className="mt-3 list-disc pl-5 space-y-2 text-gray-700">
                  {bespokeSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
                <h3 className="text-lg font-semibold text-gray-900 mt-6">The details</h3>
                <ul className="mt-3 list-disc pl-5 space-y-2 text-gray-700">
                  {commonNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {bespokeImages.map((image) => (
                  <ClickableImageTile key={image.src} image={image} onOpen={setSelectedImage} />
                ))}
              </div>
            </div>
          </section>

          <section
            id="cambridge-branded"
            className="scroll-mt-28 bg-white rounded-lg shadow-lg p-6 md:p-8"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Cambridge Branded (Skip Bespoke Labelling)
            </h2>
            <p className="text-gray-700 mt-3 max-w-4xl">
              No print run, no design process. Choose from CCCo. or The Little Things branding - both
              available in round or square label styles - and have a stocked display in store within
              days.
            </p>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Three steps</h3>
                <ul className="mt-3 list-disc pl-5 space-y-2 text-gray-700">
                  {offTheShelfSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
                <p className="text-gray-700 mt-4">One conversation with the sales team and it&apos;s sorted.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {offTheShelfImages.map((image) => (
                  <ClickableImageTile key={image.src} image={image} onOpen={setSelectedImage} />
                ))}
              </div>
            </div>
          </section>

          <section className="bg-blue-50 rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              Need help choosing the right route?
            </h2>
            <p className="text-gray-700 mt-3 max-w-3xl">
              Tell us whether you want bespoke branding or the quickest Cambridge branded setup, and
              we&apos;ll recommend the best display format and first order mix.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center px-5 py-3 rounded-md text-sm font-semibold border border-neutral-950 text-white bg-neutral-950 hover:bg-neutral-800 transition-colors"
              >
                Speak to the team
              </Link>
              <Link
                href="/display-solutions"
                className="inline-flex items-center px-5 py-3 rounded-md text-sm font-semibold border border-neutral-300 text-neutral-900 bg-white hover:bg-neutral-100 transition-colors"
              >
                Back to Display Solutions
              </Link>
            </div>
          </section>
        </div>
      </div>

      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageSrc={selectedImage?.src ?? ''}
        alt={selectedImage?.alt ?? ''}
      />
    </>
  );
}
