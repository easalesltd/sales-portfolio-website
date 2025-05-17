import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { FaEnvelope, FaInstagram, FaLinkedin, FaPhone } from 'react-icons/fa';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Optimize font loading
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true
});

// Import the components dynamically to avoid 'use client' conflicts
const ClientButton = dynamic(() => import('./components/ClientButton'), {
  ssr: true,
  loading: () => (
    <div className="px-4 py-2 bg-blue-600/50 text-white rounded-md animate-pulse">
      Request an Agent Visit
    </div>
  ),
});

const MobileMenu = dynamic(() => import('./components/MobileMenu'), {
  ssr: true,
  loading: () => (
    <div className="md:hidden">
      <button className="text-gray-500 p-2 animate-pulse">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  ),
});

const BrandsDropdown = dynamic(() => import('./components/BrandsDropdown'), {
  ssr: true,
  loading: () => (
    <div className="text-gray-700 px-3 py-2 rounded-md hover:bg-gray-50 flex items-center animate-pulse">
      Our Partner Brands
      <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </div>
  ),
});

export const metadata: Metadata = {
  title: "East Anglian Sales LTD | Greeting Cards, Gifts & More in East Anglia",
  description: "Leading supplier and wholesaler of greeting cards, gifts, candles, diffusers, and chocolate in East Anglia. Serving retailers in Suffolk, Norfolk, Essex, and Cambridgeshire. Specializing in sale or return Christmas cards.",
  icons: {
    icon: '/images/logo.svg.png?v=2',
    apple: '/images/logo.svg.png?v=2',
  },
  keywords: [
    "greeting cards East Anglia",
    "gifts Suffolk",
    "candles Norfolk",
    "diffusers Essex",
    "chocolate supplier Cambridgeshire",
    "sale or return Christmas cards",
    "Christmas cards East Anglia",
    "wholesale gifts Suffolk",
    "gift supplier Norfolk",
    "greeting card wholesaler Essex",
    "East Anglian Sales",
    "gift trade supplier",
    "wholesale supplier East Anglia",
    "wholesaler East Anglia",
    "gift wholesaler Suffolk",
    "greeting card wholesaler Norfolk",
    "wholesale distributor East Anglia",
    "gift trade wholesaler",
    "greeting card spinners",
    "card display spinners",
    "rotating card displays",
    "card display solutions",
    "coin dispenser machines",
    "£1 coin vending machines",
    "card vending solutions",
    "retail display equipment",
    "card shop equipment",
    "greeting card display units"
  ],
  openGraph: {
    title: "East Anglian Sales LTD | Greeting Cards & Gifts Wholesaler",
    description: "Leading wholesaler and supplier of greeting cards, gifts, candles, diffusers, and chocolate in East Anglia. Serving retailers in Suffolk, Norfolk, Essex, and Cambridgeshire.",
    type: "website",
    locale: "en_GB",
    siteName: "East Anglian Sales LTD"
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "https://www.easalesltd.co.uk"
  },
  authors: [{ name: "Dave Langdon" }],
  metadataBase: new URL("https://www.easalesltd.co.uk"),
  generator: "Next.js",
  applicationName: "East Anglian Sales LTD",
  referrer: "origin-when-cross-origin",
  creator: "Dave Langdon",
  publisher: "East Anglian Sales LTD",
  category: "Wholesale Gifts and Cards",
  formatDetection: {
    email: false,
    address: true,
    telephone: true
  },
  twitter: {
    card: 'summary_large_image',
    title: 'East Anglian Sales LTD | Wholesale Gifts & Cards',
    description: 'Leading wholesaler of greeting cards, gifts, and more in East Anglia. Serving retailers across Suffolk, Norfolk, Essex, and Cambridgeshire.',
    site: '@eastangliansalesltd',
    creator: '@DaveLangdon',
    images: ['/images/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="geo.region" content="GB-ENG" />
        <meta name="geo.placename" content="East Anglia" />
        <meta name="geo.position" content="52.2333;0.7167" />
        <meta name="ICBM" content="52.2333, 0.7167" />
        <meta name="distribution" content="UK" />
        <meta name="coverage" content="Suffolk, Norfolk, Essex, Cambridgeshire" />
        <meta name="description" content="East Anglian Sales LTD - Our Partner Brands" />
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "East Anglian Sales LTD",
              "description": "Leading supplier and wholesaler of greeting cards, gifts, candles, diffusers, and chocolate in East Anglia.",
              "url": "https://www.easalesltd.co.uk",
              "logo": "https://www.easalesltd.co.uk/images/logo.svg.png",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Office 2, Paragon House, 35 Lower Brook Street",
                "addressLocality": "Ipswich",
                "addressRegion": "Suffolk",
                "postalCode": "IP4 1AQ",
                "addressCountry": "GB"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "07709197915",
                "email": "dave@easalesltd.co.uk",
                "contactType": "sales"
              },
              "sameAs": [
                "https://www.instagram.com/eastangliansalesltd/",
                "https://www.linkedin.com/company/east-anglian-sales-ltd"
              ],
              "areaServed": [
                "Suffolk",
                "Norfolk",
                "Essex",
                "Cambridgeshire"
              ],
              "vatID": "481 2602 07",
              "foundingDate": "2022",
              "founder": {
                "@type": "Person",
                "name": "Dave Langdon"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <Image
                    src="/images/logo.svg.png?v=2"
                    alt="East Anglian Sales LTD Logo"
                    width={100}
                    height={67}
                    className="object-contain brightness-0"
                    priority
                    unoptimized
                  />
                </Link>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" prefetch className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
                <Link href="/about" prefetch className="text-gray-700 hover:text-blue-600 transition-colors">About</Link>
                <BrandsDropdown />
                <Link href="/display-solutions" prefetch className="text-gray-700 hover:text-blue-600 transition-colors">Display Solutions</Link>
                <Link href="/contact" prefetch className="text-gray-700 hover:text-blue-600 transition-colors">Contact</Link>
                <ClientButton />
              </div>
              <MobileMenu />
            </div>
          </nav>
        </header>

        <main className="pt-16 min-h-screen bg-white">
          {children}
        </main>

        <footer className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">East Anglian Sales LTD</h3>
              <div className="space-y-2 text-gray-600">
                <p>Registered office: Office 2, Paragon House,</p>
                <p>35 Lower Brook Street, Ipswich, England, IP4 1AQ</p>
                <p>Company Registration No: 14725288</p>
                <p>VAT No. 481 2602 07</p>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex justify-center space-x-6">
                  <a 
                    href="tel:07709197915" 
                    className="text-gray-600 hover:text-green-600 transition-colors"
                    aria-label="Phone"
                  >
                    <FaPhone className="h-6 w-6" />
                  </a>
                  <a 
                    href="mailto:dave@easalesltd.co.uk" 
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    aria-label="Email"
                  >
                    <FaEnvelope className="h-6 w-6" />
                  </a>
                  <a 
                    href="https://www.instagram.com/eastangliansalesltd/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-pink-600 transition-colors"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
