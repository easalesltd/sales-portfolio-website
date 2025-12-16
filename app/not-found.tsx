import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.svg.png"
              alt="East Anglian Sales LTD Logo"
              width={150}
              height={100}
              className="object-contain brightness-0"
              priority
              quality={90}
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
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Homepage
          </Link>
          <Link
            href="/about"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium"
          >
            Contact Us
          </Link>
        </div>

        {/* Popular Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Popular pages:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/recipes" className="text-blue-600 hover:text-blue-800 hover:underline">
              Recipes
            </Link>
            <Link href="/display-solutions" className="text-blue-600 hover:text-blue-800 hover:underline">
              Display Solutions
            </Link>
            <Link href="/companies" className="text-blue-600 hover:text-blue-800 hover:underline">
              Our Partner Brands
            </Link>
            <Link href="/temporary-rep-cover" className="text-blue-600 hover:text-blue-800 hover:underline">
              Temporary Rep Cover
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

