import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title:
    'Bespoke Confectionary Displays for Attractions Retailers in East Anglia | East Anglian Sales LTD',
  description:
    'Bespoke confectionary displays and custom-labelled sweets for attractions-style retailers in East Anglia. Choose bespoke labelling or Cambridge branded off-the-shelf display solutions.',
  keywords: [
    'bespoke confectionary displays',
    'bespoke confectionery displays',
    'custom sweet displays',
    'attractions retail confectionery',
    'attraction gift shop sweets',
    'museum gift shop confectionery displays',
    'zoo gift shop confectionery displays',
    'heritage site gift shop displays',
    'visitor attraction retail displays',
    'East Anglia confectionery displays',
    'Suffolk bespoke confectionery displays',
    'Norfolk bespoke confectionery displays',
    'Essex bespoke confectionery displays',
    'Cambridgeshire confectionery displays',
    'compostable bespoke labels sweets',
    'Cambridge confectionary branded display',
  ],
  alternates: {
    canonical: 'https://www.easalesltd.co.uk/display-solutions/bespoke-confectionary-displays',
  },
  openGraph: {
    title:
      'Bespoke Confectionary Displays for Attractions Retailers in East Anglia | East Anglian Sales LTD',
    description:
      'The go-to bespoke confectionary and display service for attractions-style retailers across East Anglia.',
    url: 'https://www.easalesltd.co.uk/display-solutions/bespoke-confectionary-displays',
    type: 'article',
    locale: 'en_GB',
    siteName: 'East Anglian Sales LTD',
    images: [
      {
        url: 'https://www.easalesltd.co.uk/images/display-solutions/bespoke-confectionary/page-23-asset-1.jpeg',
        width: 1024,
        height: 648,
        alt: 'Bespoke labelling and display options',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bespoke Confectionary Displays | East Anglian Sales LTD',
    description:
      'Bespoke confectionary displays for attractions-style retailers in East Anglia, with bespoke or off-the-shelf routes.',
    images: ['https://www.easalesltd.co.uk/images/display-solutions/bespoke-confectionary/page-23-asset-1.jpeg'],
  },
};

const bespokeSteps = [
  'Share a high-resolution logo and brief (or request a template).',
  'Receive PDF design concepts in 2-3 working days at no charge.',
  'Approve your preferred design and final physical sample.',
  'We print and hold your labels free of charge, then deliver to store in around 2-3 weeks from artwork approval.',
];

const offTheShelfSteps = [
  'Choose between CCCo. branding or The Little Things branding.',
  'Confirm what pricing information you want on shelf edge strips.',
  'Select your range from the sweets list (up to 30 varieties per display).',
];

const commonNotes = [
  'Minimum print run for bespoke labels: 5,000 labels.',
  'Label shape options: 45mm round or 40mm square.',
  'Displays are available in short or tall format.',
  'A full display can hold around 360 bags of sweets.',
];

export default function BespokeConfectionaryDisplaysPage() {
  return (
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

        <section id="bespoke-labelling" className="scroll-mt-28 bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Bespoke Labelling</h2>
          <p className="text-gray-700 mt-3 max-w-4xl">
            This route gives you your own branded compostable labels and matching display graphics.
            Once your label design is approved, the same creative direction can be carried through to
            your display header and edge strips.
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">How it works</h3>
              <ul className="mt-3 list-disc pl-5 space-y-2 text-gray-700">
                {bespokeSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
              <h3 className="text-lg font-semibold text-gray-900 mt-6">Key details</h3>
              <ul className="mt-3 list-disc pl-5 space-y-2 text-gray-700">
                {commonNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative h-56 sm:h-64 rounded-lg overflow-hidden shadow-md">
                <Image
                  src="/images/display-solutions/bespoke-confectionary/page-23-asset-1.jpeg"
                  alt="Bespoke bag mockups and branded display concept"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="relative h-56 sm:h-64 rounded-lg overflow-hidden shadow-md">
                <Image
                  src="/images/display-solutions/bespoke-confectionary/page-22-asset-2.jpeg"
                  alt="Sweet category examples for bespoke ranges"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                />
              </div>
              <div className="relative h-56 sm:h-64 rounded-lg overflow-hidden shadow-md sm:col-span-2">
                <Image
                  src="/images/display-solutions/bespoke-confectionary/page-22-asset-1.jpeg"
                  alt="Bespoke confectionery visual style and textures"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="cambridge-branded" className="scroll-mt-28 bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Cambridge Branded (Skip Bespoke Labelling)
          </h2>
          <p className="text-gray-700 mt-3 max-w-4xl">
            If you want a pick-up confectionery range without bespoke print runs, choose a ready-made
            branded route. CCCo. and The Little Things formats are both available in square or round
            label styles.
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Three simple steps</h3>
              <ul className="mt-3 list-disc pl-5 space-y-2 text-gray-700">
                {offTheShelfSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
              <p className="text-gray-700 mt-4">
                A fully stocked display can be delivered and installed within days after one planning
                conversation with the sales team.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative h-56 sm:h-64 rounded-lg overflow-hidden shadow-md">
                <Image
                  src="/images/display-solutions/bespoke-confectionary/page-24-asset-2.jpeg"
                  alt="Cambridge and Little Things branded bag options"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                />
              </div>
              <div className="relative h-56 sm:h-64 rounded-lg overflow-hidden shadow-md">
                <Image
                  src="/images/display-solutions/bespoke-confectionary/page-24-asset-1.jpeg"
                  alt="Installed branded sweets display and display frame"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                />
              </div>
              <div className="relative h-56 sm:h-64 rounded-lg overflow-hidden shadow-md sm:col-span-2">
                <Image
                  src="/images/display-solutions/bespoke-confectionary/brochure-page-24.png"
                  alt="Skip bespoke labelling brochure reference"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-900">Need help choosing the right route?</h2>
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
  );
}
