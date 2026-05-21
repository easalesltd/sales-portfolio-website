'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import ImageModal from '@/app/components/ImageModal';

const SWEET_SUPPLIER_NAME = 'The Cambridge Confectionery Company';
const SWEET_SUPPLIER_HREF = '/companies/cambridge-confectionery-company';
const AGENT_REGIONS = 'Suffolk, Norfolk, Essex and Cambridgeshire';

const packagingPoints = [
  'Wood pulp pick-up bags — they look like conventional plastic but compost in soil.',
  'Up to 50 sweet varieties for impulse and pick-and-mix ranges.',
  'Compostable bespoke labels (45mm round or 40mm square) when you choose the bespoke route.',
];

const bespokeSteps = [
  'Send a high-res logo and brief, or ask for a starting template.',
  'Receive PDF design concepts within 2–3 working days, at no cost.',
  'Approve artwork, sign off a physical sample, then we print labels (held free of charge until you need them).',
  'Delivery to store is typically 2–3 weeks from final artwork sign-off.',
];

const bespokeSpecs = [
  'Minimum label print run: 5,000.',
  'Displays in short or tall format; a full run holds around 360 bags.',
];

const offTheShelfSteps = [
  'Choose CCCo. or The Little Things branding (round or square labels).',
  'Confirm shelf-edge pricing for the strips.',
  'Pick your sweet selection — up to 30 varieties per display.',
  'We deliver a stocked display, ready for the shop floor.',
];

type GalleryImage = {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
};

type RecentInstall = GalleryImage & {
  venue: string;
  location: string;
  caption: string;
  badge: string;
  featured?: boolean;
};

const recentInstalls: RecentInstall[] = [
  {
    src: '/images/display-solutions/recent-installs/ely-cathedral-bespoke-sweet-stand.jpg',
    alt: 'Bespoke confectionery display stand at Ely Cathedral gift shop',
    venue: 'Ely Cathedral',
    location: 'Cambridgeshire',
    caption: 'Bespoke stand with header graphics, shelf-edge pricing and a full pick-and-mix run.',
    badge: 'Bespoke install',
    featured: true,
    sizes: '(max-width: 768px) 100vw, 58vw',
  },
  {
    src: '/images/display-solutions/recent-installs/ely-cathedral-biodegradable-bag-branding.jpg',
    alt: 'Bespoke labelled sweet bags on shelf at Ely Cathedral',
    venue: 'Ely Cathedral',
    location: 'Cambridgeshire',
    caption: 'On-pack labelling matched to the venue brand.',
    badge: 'Bespoke labels',
    sizes: '(max-width: 768px) 100vw, 42vw',
  },
  {
    src: '/images/display-solutions/recent-installs/twenty-pence-garden-centre-sweet-stand.jpg',
    alt: 'Impulse sweet display at Twenty Pence Garden Centre',
    venue: 'Twenty Pence Garden Centre',
    location: 'East Anglia',
    caption: 'Impulse display in a high-footfall garden-centre location.',
    badge: 'Impulse display',
    sizes: '(max-width: 768px) 100vw, 42vw',
  },
];

const STAND_HERO_FRAME =
  'relative mx-auto h-[22rem] w-[17.5rem] shrink-0 overflow-hidden rounded-md bg-neutral-50 sm:h-[24rem] sm:w-[19rem] md:h-[26rem] md:w-[20.5rem]';

function SupplierLink({ className = '' }: { className?: string }) {
  return (
    <Link href={SWEET_SUPPLIER_HREF} className={className}>
      {SWEET_SUPPLIER_NAME}
    </Link>
  );
}

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

function RecentInstallCard({
  install,
  onOpen,
}: {
  install: RecentInstall;
  onOpen: (img: GalleryImage) => void;
}) {
  return (
    <button
      type="button"
      className={`group relative flex w-full flex-col overflow-hidden rounded-xl text-left shadow-lg ring-1 ring-white/10 cursor-zoom-in ${
        install.featured ? 'min-h-[20rem] sm:min-h-[28rem]' : 'min-h-[12rem] sm:min-h-[14rem]'
      }`}
      onClick={() => onOpen(install)}
      aria-label={`Expand photo: ${install.venue}`}
    >
      <Image
        src={install.src}
        alt={install.alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        sizes={install.sizes}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/25 to-transparent" />
      <div className="absolute left-3 top-3">
        <span className="inline-block rounded-full bg-amber-400/95 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-neutral-950">
          {install.badge}
        </span>
      </div>
      <div className="relative mt-auto p-4 sm:p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-amber-200/90">
          {install.location}
        </p>
        <p className="mt-0.5 text-lg font-bold text-white sm:text-xl">{install.venue}</p>
        <p className="mt-2 text-sm leading-snug text-neutral-200 line-clamp-3">{install.caption}</p>
      </div>
    </button>
  );
}

export default function BespokeConfectioneryDisplaysClient() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const bespokeImages = useMemo<GalleryImage[]>(
    () => [
      {
        src: '/images/display-solutions/bespoke-confectionery/page-23-asset-1.jpeg',
        alt: 'Bespoke sweet bag mockups and branded display concept',
        sizes: '(max-width: 1024px) 100vw, 50vw',
      },
      {
        src: '/images/display-solutions/bespoke-confectionery/page-22-asset-2.jpeg',
        alt: 'Sweet category examples for bespoke ranges',
        sizes: '(max-width: 1024px) 100vw, 25vw',
      },
      {
        src: '/images/display-solutions/bespoke-confectionery/page-22-asset-1.jpeg',
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
        src: '/images/display-solutions/bespoke-confectionery/page-24-asset-2.jpeg',
        alt: 'Cambridge and Little Things branded bag options',
        sizes: '(max-width: 1024px) 100vw, 25vw',
      },
      {
        src: '/images/display-solutions/bespoke-confectionery/page-24-asset-1.jpeg',
        alt: 'Installed branded sweets display and display frame',
        sizes: '(max-width: 1024px) 100vw, 25vw',
      },
      {
        src: '/images/display-solutions/bespoke-confectionery/brochure-page-24.png',
        alt: 'Off-the-shelf branded confectionery brochure reference',
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
          <section className="relative overflow-hidden rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 sm:p-6 shadow-lg">
            <div className="mb-4 text-center">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-purple-700">
                Pick your stand style
              </p>
            </div>
            <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 md:gap-10">
              <a
                href="#bespoke-labelling"
                className="group relative flex w-full flex-col overflow-hidden rounded-lg border border-purple-200/90 bg-white p-1.5 shadow-sm transition duration-300 hover:z-10 hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-md"
              >
                <span className="absolute left-2 top-2 z-10 rounded-full bg-purple-700 px-2 py-0.5 text-[11px] font-semibold leading-tight text-white sm:text-xs sm:px-2.5 sm:py-1">
                  Option 1
                </span>
                <div className={STAND_HERO_FRAME}>
                  <Image
                    src="/images/bespoke-confectionery-displays/Bespoke.png"
                    alt="Bespoke confectionery display stand option"
                    fill
                    className="object-cover object-[center_top] transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 304px, 328px"
                    priority
                  />
                </div>
                <div className="mt-3 flex min-h-[4.75rem] items-start justify-center px-1">
                  <p className="max-w-[20.5rem] text-center text-sm font-semibold leading-snug text-gray-900 sm:text-base">
                    Bespoke — your brand, your way
                  </p>
                </div>
              </a>

              <a
                href="#cambridge-branded"
                className="group relative flex w-full flex-col overflow-hidden rounded-lg border border-blue-200/90 bg-white p-1.5 shadow-sm transition duration-300 hover:z-10 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
              >
                <span className="absolute left-2 top-2 z-10 rounded-full bg-blue-700 px-2 py-0.5 text-[11px] font-semibold leading-tight text-white sm:text-xs sm:px-2.5 sm:py-1">
                  Option 2
                </span>
                <div className={STAND_HERO_FRAME}>
                  <Image
                    src="/images/bespoke-confectionery-displays/Off the Shelf.png"
                    alt="Off-the-shelf Cambridge branded display stand option"
                    fill
                    className="object-cover object-[center_top] transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 304px, 328px"
                    priority
                  />
                </div>
                <div className="mt-3 flex min-h-[4.75rem] items-start justify-center px-1">
                  <p className="max-w-[20.5rem] text-center text-sm font-semibold leading-snug text-gray-900 sm:text-base">
                    Cambridge branded (off the shelf)
                  </p>
                </div>
              </a>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Display Solutions
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Bespoke Confectionery Displays
            </h1>
            <p className="text-lg text-gray-700 mt-4 max-w-3xl leading-relaxed">
              <SupplierLink className="font-semibold text-emerald-900 hover:underline" /> supplies
              impulse and pick-and-mix confectionery for museum shops, heritage sites, visitor
              attractions, garden centres and destination retail. East Anglian Sales LTD is the sales
              agent for {AGENT_REGIONS}.
            </p>
            <p className="text-gray-700 mt-3 max-w-3xl leading-relaxed">
              There are two routes: <strong>bespoke labelling</strong> with your own brand on pack and
              on the stand, or a <strong>ready-to-stock Cambridge branded display</strong> when you
              want to move quickly.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <a
                href="#bespoke-labelling"
                className="rounded-lg border border-blue-200 bg-blue-50 px-5 py-4 text-left transition hover:border-blue-400 hover:bg-blue-100"
              >
                <p className="text-sm font-medium text-blue-700">Option 1</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">Bespoke labelling</p>
                <p className="text-gray-700 mt-2 text-sm leading-relaxed">
                  Your logo on compostable labels and matching display artwork.
                </p>
              </a>

              <a
                href="#cambridge-branded"
                className="rounded-lg border border-gray-200 bg-gray-50 px-5 py-4 text-left transition hover:border-gray-400 hover:bg-gray-100"
              >
                <p className="text-sm font-medium text-gray-700">Option 2</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">Cambridge branded</p>
                <p className="text-gray-700 mt-2 text-sm leading-relaxed">
                  CCCo. or The Little Things branding — stocked and in store within days.
                </p>
              </a>
            </div>
          </section>

          <section
            id="plastic-free-packaging"
            className="scroll-mt-28 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 shadow-lg p-6 md:p-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Plastic free packaging</h2>
            <p className="mt-3 text-gray-700 max-w-3xl leading-relaxed">
              Every programme uses the same pick-up bags from{' '}
              <SupplierLink className="font-semibold text-emerald-900 hover:underline" /> — wood pulp,
              not conventional plastic.
            </p>
            <ul className="mt-6 space-y-3 max-w-3xl">
              {packagingPoints.map((point) => (
                <li key={point} className="flex gap-3 text-gray-800 leading-relaxed">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
          </section>

          <section
            id="recent-installs"
            className="scroll-mt-28 overflow-hidden rounded-2xl bg-neutral-950 text-white shadow-xl ring-1 ring-neutral-800"
          >
            <div className="border-b border-neutral-800 bg-gradient-to-r from-amber-500/15 via-neutral-900 to-purple-900/20 px-6 py-8 md:px-10">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Recent installs</h2>
              <p className="mt-2 max-w-2xl text-neutral-300 leading-relaxed">
                A few live stands and labelled runs from East Anglian retailers. Tap a photo to enlarge.
              </p>
            </div>

            <div className="grid gap-4 p-4 sm:p-6 md:grid-cols-12 md:gap-5 md:p-8">
              {recentInstalls
                .filter((i) => i.featured)
                .map((install) => (
                  <div key={install.src} className="md:col-span-7 md:row-span-2">
                    <RecentInstallCard install={install} onOpen={setSelectedImage} />
                  </div>
                ))}
              <div className="grid gap-4 md:col-span-5 md:grid-rows-2 md:gap-5">
                {recentInstalls
                  .filter((i) => !i.featured)
                  .map((install) => (
                    <RecentInstallCard key={install.src} install={install} onOpen={setSelectedImage} />
                  ))}
              </div>
            </div>

            <p className="border-t border-neutral-800 px-6 pb-6 text-center text-sm text-neutral-400 md:px-10 md:pb-8">
              Want something similar?{' '}
              <Link href="/contact" className="font-semibold text-amber-300 hover:text-amber-200">
                Get in touch
              </Link>
              .
            </p>
          </section>

          <section
            id="bespoke-labelling"
            className="scroll-mt-28 bg-white rounded-lg shadow-lg p-6 md:p-8"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Bespoke labelling</h2>
            <p className="text-gray-700 mt-3 max-w-3xl leading-relaxed">
              Your logo, colours and shop name on compostable labels, with display graphics to match —
              from the bags on the shelf to the header above the run.
            </p>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">How it works</h3>
                <ol className="mt-3 list-decimal pl-5 space-y-2 text-gray-700">
                  {bespokeSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <h3 className="text-lg font-semibold text-gray-900 mt-6">Good to know</h3>
                <ul className="mt-3 list-disc pl-5 space-y-2 text-gray-700">
                  {bespokeSpecs.map((note) => (
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
              Cambridge branded (off the shelf)
            </h2>
            <p className="text-gray-700 mt-3 max-w-3xl leading-relaxed">
              No label print run and no design cycle. Choose CCCo. or The Little Things branding, confirm
              shelf-edge pricing, pick your sweets, and we supply a display ready for the shop floor —
              usually within days.
            </p>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">How it works</h3>
                <ol className="mt-3 list-decimal pl-5 space-y-2 text-gray-700">
                  {offTheShelfSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {offTheShelfImages.map((image) => (
                  <ClickableImageTile key={image.src} image={image} onOpen={setSelectedImage} />
                ))}
              </div>
            </div>
          </section>

          <section className="bg-blue-50 rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-900">Not sure which route fits?</h2>
            <p className="text-gray-700 mt-3 max-w-2xl leading-relaxed">
              Tell us about your shop and timeline — we&apos;ll point you at bespoke labelling or the
              fastest Cambridge branded setup, and suggest a display format and first order mix.
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
