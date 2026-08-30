import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center" aria-label="East Anglian Sales LTD home">
            <Image
              src="/images/logo.webp"
              alt="East Anglian Sales LTD"
              width={150}
              height={100}
              className="object-contain brightness-0"
              priority
              sizes="150px"
              quality={85}
            />
          </Link>
        </div>

        {/* 404 Message */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or the URL might be incorrect.
        </p>

        {/* Navigation Options */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-md font-medium border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 transition-colors dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            Go to Homepage
          </Link>
          <Link
            href="/about"
            className="px-6 py-3 rounded-md font-medium border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 transition-colors dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            About Dave
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-md font-medium border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 transition-colors dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            Contact Us
          </Link>
        </div>

        {/* Popular Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Popular pages:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/recipes" className="text-neutral-900 hover:text-neutral-600 hover:underline dark:text-neutral-100 dark:hover:text-neutral-300">
              Recipes
            </Link>
            <Link href="/display-solutions" className="text-neutral-900 hover:text-neutral-600 hover:underline dark:text-neutral-100 dark:hover:text-neutral-300">
              Display Solutions
            </Link>
            <Link href="/companies" className="text-neutral-900 hover:text-neutral-600 hover:underline dark:text-neutral-100 dark:hover:text-neutral-300">
              My Partner Brands
            </Link>
            <Link href="/temporary-rep-cover" className="text-neutral-900 hover:text-neutral-600 hover:underline dark:text-neutral-100 dark:hover:text-neutral-300">
              Temporary Rep Cover
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

