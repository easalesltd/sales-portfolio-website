'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import ImageModal from '@/app/components/ImageModal';

const plasticFreeHighlights = [
  'We offer 50 varieties of sweets in plastic free pick-up bags — ideal for impulse sweet till and pick-and-mix purchasing.',
  'Every bag can carry your bespoke compostable label, so your brand stays front-of-pack without conventional plastic.',
  'The bags look like plastic but are made from wood pulp and compost in soil — a true plastic free packaging solution for retail.',
];

const plasticFreeSeoTopics = [
  'Plastic free confectionery supplier',
  'Impulse sweet till & pick-and-mix displays',
  'Compostable wood pulp pick-up bags',
  'Bespoke labelling for attractions & gift shops',
  'Museum, heritage & garden centre impulse sweets',
];

const bespokeSteps = [
  'Send over a high-res logo and a brief, or ask for a starting template.',
  'PDF design concepts come back within 2-3 working days, at no cost.',
  "Approve your design, sign off on a physical sample, and you're done.",
  'Compostable labels are printed and held for you free of charge. Delivery to store takes around 2-3 weeks from artwork sign-off.',
  'Your sweets ship in plastic free wood pulp bags — ready for the impulse till or bespoke display.',
];

const offTheShelfSteps = [
  'Pick your branding: CCCo. or The Little Things.',
  'Confirm what pricing information goes on the shelf edge strips.',
  'Choose your sweet selection (up to 30 varieties per display) — all in plastic free pick-up bags.',
  'We install an impulse sweet till display stocked and ready for footfall.',
];

const commonNotes = [
  'Plastic free packaging: wood pulp pick-up bags (not conventional plastic) — compostable in soil.',
  '50 sweet varieties available for bespoke and impulse ranges.',
  'Minimum print run is 5,000 compostable labels.',
  'Label formats: 45mm round or 40mm square.',
  'Impulse sweet till displays available in short or tall format.',
  'A full display holds around 360 plastic free bags.',
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
    alt: 'Bespoke confectionery display stand installed at Ely Cathedral gift shop',
    venue: 'Ely Cathedral',
    location: 'Cambridgeshire',
    caption:
      'Full bespoke sweet stand with matched header graphics, shelf-edge pricing and a stocked pick-and-mix run.',
    badge: 'Bespoke install',
    featured: true,
    sizes: '(max-width: 768px) 100vw, 58vw',
  },
  {
    src: '/images/display-solutions/recent-installs/ely-cathedral-biodegradable-bag-branding.jpg',
    alt: 'Compostable sweet bags with bespoke Ely Cathedral branding on shelf',
    venue: 'Ely Cathedral',
    location: 'Cambridgeshire',
    caption:
      'Plastic free wood pulp bags with bespoke compostable labelling — on shelf and ready for impulse purchasing.',
    badge: 'Plastic free bags',
    sizes: '(max-width: 768px) 100vw, 42vw',
  },
  {
    src: '/images/display-solutions/recent-installs/twenty-pence-garden-centre-sweet-stand.jpg',
    alt: 'Impulse impact sweet display stand at Twenty Pence Garden Centre',
    venue: 'Twenty Pence Garden Centre',
    location: 'East Anglia',
    caption: 'Impulse impact sweet stand positioned for high-footfall garden-centre trade.',
    badge: 'Impulse display',
    sizes: '(max-width: 768px) 100vw, 42vw',
  },
];

/** Identical frame for both stand hero images — same window size side-by-side */
const STAND_HERO_FRAME =
  'relative mx-auto h-[22rem] w-[17.5rem] shrink-0 overflow-hidden rounded-md bg-neutral-50 sm:h-[24rem] sm:w-[19rem] md:h-[26rem] md:w-[20.5rem]';

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
        alt: 'Plastic free bespoke sweet bag mockups and branded impulse display concept',
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
          <section className="relative overflow-hidden rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 sm:p-6 shadow-lg">
            <div className="mb-4 text-center">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-purple-700">
                Pick Your Stand Style
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
                    Bespoke - Your Brand, Your Way
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
                    alt="Off the shelf Cambridge branded display stand option"
                    fill
                    className="object-cover object-[center_top] transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 304px, 328px"
                    priority
                  />
                </div>
                <div className="mt-3 flex min-h-[4.75rem] items-start justify-center px-1">
                  <p className="max-w-[20.5rem] text-center text-sm font-semibold leading-snug text-gray-900 sm:text-base">
                    Cambridge Branded (Off the Shelf)
                  </p>
                </div>
              </a>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Display Solutions
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-900 ring-1 ring-emerald-200">
                Plastic free supplier
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
                Impulse sweet till
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
                Pick-and-mix · East Anglia
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
              Bespoke Confectionery Displays
            </h1>
            <p className="text-lg font-medium text-emerald-800 mt-3 max-w-4xl">
              Your own bespoke confectionery collection — in{' '}
              <span className="font-bold uppercase tracking-wide">plastic free packaging</span>.
            </p>
            <p className="text-lg text-gray-700 mt-3 max-w-4xl">
              East Anglian Sales LTD is your plastic free supplier for impulse sweet till and
              pick-and-mix displays at attractions-style retailers. Every pick-up bag is wood pulp
              based (not conventional plastic), compostable in soil, and available with bespoke
              compostable labelling or fast Cambridge branded stands.
            </p>
            <p className="text-base text-gray-700 mt-3 max-w-4xl">
              Ideal for gift shops in museums, heritage venues, visitor attractions, garden centres,
              farm parks and destination retail in Suffolk, Norfolk, Essex and Cambridgeshire — anywhere
              you need impulse confectionery without plastic packaging.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <a
                href="#bespoke-labelling"
                className="rounded-lg border border-blue-200 bg-blue-50 px-5 py-4 text-left transition hover:border-blue-400 hover:bg-blue-100"
              >
                <p className="text-sm font-medium text-blue-700">Option 1</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">Bespoke Labelling</p>
                <p className="text-gray-700 mt-2">
                  Your logo on compostable labels and plastic free bags — plus matched impulse display
                  graphics.
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
                  Fast route to a stocked impulse sweet till using CCCo. or The Little Things branding
                  — plastic free bags included.
                </p>
              </a>
            </div>
          </section>

          <section
            id="plastic-free-packaging"
            className="scroll-mt-28 overflow-hidden rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 shadow-xl"
          >
            <div className="grid gap-8 p-6 md:grid-cols-2 md:gap-10 md:p-10 lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                  Plastic free packaging
                </p>
                <h2 className="mt-2 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-[2.35rem]">
                  Your own bespoke confectionery collection
                </h2>
                <p className="mt-3 text-lg font-extrabold uppercase tracking-[0.12em] text-emerald-700 sm:text-xl">
                  In plastic free packaging
                </p>
                <p className="mt-4 text-base text-gray-700 leading-relaxed">
                  We are a plastic free supplier for impulse sweet till purchasing across East Anglia —
                  from single-site gift shops to multi-location attractions. No conventional plastic
                  pick-up bags: just compostable wood pulp packaging that performs on the shelf.
                </p>
              </div>
              <ul className="space-y-4">
                {plasticFreeHighlights.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 rounded-xl border border-emerald-100 bg-white/90 p-4 shadow-sm"
                  >
                    <span
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white"
                      aria-hidden
                    >
                      ✓
                    </span>
                    <span className="text-gray-800 leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-emerald-100 bg-emerald-900/95 px-6 py-5 md:px-10">
              <p className="text-center text-sm font-semibold uppercase tracking-wider text-emerald-200">
                Impulse sweet till &amp; pick-and-mix keywords we supply for
              </p>
              <ul className="mt-3 flex flex-wrap justify-center gap-2">
                {plasticFreeSeoTopics.map((topic) => (
                  <li
                    key={topic}
                    className="rounded-full bg-emerald-800 px-3 py-1 text-xs font-medium text-emerald-50 ring-1 ring-emerald-600"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section
            id="recent-installs"
            className="scroll-mt-28 overflow-hidden rounded-2xl bg-neutral-950 text-white shadow-xl ring-1 ring-neutral-800"
          >
            <div className="border-b border-neutral-800 bg-gradient-to-r from-amber-500/15 via-neutral-900 to-purple-900/20 px-6 py-8 md:px-10 md:py-10">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
                Recent installs
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Sweet stands live in East Anglian retail
              </h2>
              <p className="mt-3 max-w-3xl text-base text-neutral-300 md:text-lg">
                Not mock-ups — real impulse sweet till installs with plastic free, compostable bags.
                Tap any photo to view full size.
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
              Planning a similar install?{' '}
              <Link href="/contact" className="font-semibold text-amber-300 hover:text-amber-200">
                Speak to the team
              </Link>{' '}
              — we cover Suffolk, Norfolk, Essex and Cambridgeshire.
            </p>
          </section>

          <section
            id="bespoke-labelling"
            className="scroll-mt-28 bg-white rounded-lg shadow-lg p-6 md:p-8"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Bespoke Labelling</h2>
            <p className="mt-2 text-sm font-bold uppercase tracking-wide text-emerald-700">
              Plastic free bags · compostable labels
            </p>
            <p className="text-gray-700 mt-3 max-w-4xl">
              Your logo, your colours, your shop. This route pairs{' '}
              <strong>plastic free wood pulp pick-up bags</strong> with compostable bespoke labels and
              matching impulse display graphics — from the till-facing bags to the header card above the
              run.
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
            <p className="mt-2 text-sm font-bold uppercase tracking-wide text-emerald-700">
              Plastic free pick-up bags included
            </p>
            <p className="text-gray-700 mt-3 max-w-4xl">
              No print run, no design process. Choose from CCCo. or The Little Things branding — both
              on round or square compostable label styles — and have a stocked{' '}
              <strong>impulse sweet till display</strong> in store within days, every bag plastic free.
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

          <section
            id="impulse-sweet-till"
            className="scroll-mt-28 rounded-lg border border-gray-200 bg-gray-50 p-6 md:p-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900">
              Impulse sweet till purchasing — plastic free, end to end
            </h2>
            <div className="mt-4 grid gap-6 md:grid-cols-2 text-gray-700">
              <p className="leading-relaxed">
                Whether you call it an <strong>impulse sweet till</strong>, pick-and-mix unit, or
                confectionery dump bin, the principle is the same: high-margin sweets in grab-and-go
                packaging at the till or throughout the shop. We supply the{' '}
                <strong>plastic free bags</strong>, the <strong>bespoke or Cambridge branding</strong>,
                and the <strong>display hardware</strong> — one conversation with our East Anglia sales
                team.
              </p>
              <p className="leading-relaxed">
                Retailers choose us as a <strong>plastic free confectionery supplier</strong> because
                the wood pulp bags compost in soil, the labels are compostable, and the stands are built
                for attractions footfall. From impulse till refills to a full bespoke install, we cover
                Suffolk, Norfolk, Essex and Cambridgeshire.
              </p>
            </div>
          </section>

          <section className="bg-blue-50 rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              Need help choosing the right route?
            </h2>
            <p className="text-gray-700 mt-3 max-w-3xl">
              Tell us whether you want bespoke plastic free labelling or the quickest Cambridge branded
              impulse till setup — we&apos;ll recommend the best display format, bag mix and first order.
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
