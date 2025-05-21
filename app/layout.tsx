import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { FaEnvelope, FaInstagram, FaLinkedin, FaPhone } from 'react-icons/fa';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { companies, type Company } from './data/companies';
import Breadcrumbs from './components/Breadcrumbs';

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
  title: "East Anglian Sales LTD | Leading Wholesale Supplier in East Anglia",
  description: "East Anglian Sales LTD - Your trusted local supplier of greeting cards, gifts, and display solutions in Suffolk, Norfolk, Essex, and Cambridgeshire. Family-run business with personal service.",
  icons: {
    icon: [
      { rel: 'icon', url: '/icons/favicon.ico', sizes: 'any' },
      { rel: 'icon', url: '/icons/favicon.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', url: '/icons/apple-touch-icon.png' },
      { rel: 'mask-icon', url: '/icons/safari-pinned-tab.svg', color: '#000000' }
    ],
    shortcut: '/icons/favicon.ico',
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        url: '/icons/favicon-96x96.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/icons/web-app-manifest-192x192.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '512x512',
        url: '/icons/web-app-manifest-512x512.png'
      }
    ]
  },
  manifest: '/site.webmanifest',
  keywords: [
    "East Anglian Sales LTD",
    "East Anglian Sales",
    "EA Sales Ltd",
    "Dave Langdon sales",
    "greeting cards East Anglia",
    "wholesale gifts Suffolk",
    "card supplier Norfolk",
    "gift wholesaler Essex",
    "Cambridgeshire wholesale supplier",
    "greeting card wholesaler East Anglia",
    "display solutions East Anglia",
    "local gift supplier Suffolk",
    "card display solutions Norfolk",
    "retail supplier Ipswich",
    "East Anglian wholesale distributor",
    "Suffolk sales agent",
    "Norfolk trade supplier",
    "Essex gift wholesaler",
    "Cambridgeshire retail supplier",
    "East Anglia business supplier"
  ],
  openGraph: {
    title: "East Anglian Sales LTD | Your Local Wholesale Partner",
    description: "Family-run wholesale supplier of greeting cards, gifts, and display solutions serving retailers across East Anglia. Personal service from Dave Langdon in Suffolk, Norfolk, Essex, and Cambridgeshire.",
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
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": ["Organization", "LocalBusiness"],
                "@id": "https://www.easalesltd.co.uk/#organization",
                "name": "East Anglian Sales LTD",
                "alternateName": ["EA Sales", "East Anglian Sales"],
                "description": "Family-run wholesale supplier of greeting cards, gifts, and display solutions serving retailers across East Anglia.",
                "url": "https://www.easalesltd.co.uk",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.easalesltd.co.uk/images/logo.svg.png",
                  "width": "100",
                  "height": "67"
                },
                "image": "https://www.easalesltd.co.uk/images/showcase/showcase1.jpeg",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Office 2, Paragon House, 35 Lower Brook Street",
                  "addressLocality": "Ipswich",
                  "addressRegion": "Suffolk",
                  "postalCode": "IP4 1AQ",
                  "addressCountry": "GB"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": "52.2333",
                  "longitude": "0.7167"
                },
                "contactPoint": [
                  {
                    "@type": "ContactPoint",
                    "telephone": "07709197915",
                    "email": "dave@easalesltd.co.uk",
                    "contactType": "sales",
                    "areaServed": ["Suffolk", "Norfolk", "Essex", "Cambridgeshire"],
                    "availableLanguage": "English"
                  }
                ],
                "sameAs": [
                  "https://www.instagram.com/eastangliansalesltd/",
                  "https://www.linkedin.com/company/east-anglian-sales-ltd"
                ],
                "areaServed": [
                  {
                    "@type": "GeoCircle",
                    "geoMidpoint": {
                      "@type": "GeoCoordinates",
                      "latitude": "52.2333",
                      "longitude": "0.7167"
                    },
                    "geoRadius": "100000"
                  }
                ],
                "priceRange": "££",
                "vatID": "481 2602 07",
                "foundingDate": "2022",
                "founder": {
                  "@type": "Person",
                  "name": "Dave Langdon",
                  "jobTitle": "Sales Agent",
                  "description": "Professional Sales Agent with over a decade of experience in East Anglia"
                },
                "openingHours": "Mo-Fr 09:00-17:00",
                "paymentAccepted": ["Credit Card", "Debit Card", "Bank Transfer"],
                "currenciesAccepted": "GBP",
                "hasOfferCatalog": {
                  "@type": "OfferCatalog",
                  "name": "Product Catalog",
                  "itemListElement": [
                    {
                      "@type": "OfferCatalog",
                      "name": "Greeting Cards",
                      "itemListElement": companies.map((company: Company) => ({
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Product",
                          "name": company.name,
                          "description": company.description,
                          "url": `https://www.easalesltd.co.uk/companies/${company.slug}`
                        }
                      }))
                    }
                  ]
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://www.easalesltd.co.uk"
                  }
                ]
              }
            ])
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
        <Breadcrumbs />
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
