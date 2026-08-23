import React from 'react';
import type { Metadata } from "next";
import { getCspNonce } from './lib/csp-nonce';
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { FaEnvelope, FaFacebook, FaInstagram, FaPhone } from 'react-icons/fa';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { companies, type Company } from './data/companies';
import MobileRequestButton from './components/MobileRequestButton';
import HeaderLogo from './components/HeaderLogo';
import AboutDropdown from './components/AboutDropdown';
import GoogleWebVitals from './components/GoogleWebVitals';
import CookieConsentBanner from './components/CookieConsentBanner';
import CookieSettingsButton from './components/CookieSettingsButton';
import { buildGoogleConsentDefaultScript } from './lib/cookie-consent';
import {
  GCA_MEMBER_LOGO_PATH,
  HOME_PAGE_META_DESCRIPTION,
  UK_GREETING_CARD_ASSOCIATION_NAME,
  UK_GREETING_CARD_ASSOCIATION_URL,
} from './lib/home-page-meta-description';
import { BUSINESS, FACEBOOK_PAGE_URL } from './data/business-entity';

// Optimize font loading with display swap and preload
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', 'arial']
});

// Import the components dynamically to avoid 'use client' conflicts
const ClientButton = dynamic(() => import('./components/ClientButton'), {
  ssr: true,
  loading: () => (
    <div className="px-4 py-2 rounded-md border border-neutral-300 bg-neutral-200 text-neutral-500 animate-pulse dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
      Request an Agent Visit
    </div>
  )
});

const MobileMenu = dynamic(() => import('./components/MobileMenu'), {
  ssr: true,
  loading: () => (
    <div className="md:hidden">
      <button className="text-gray-500 p-1.5 animate-pulse">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  )
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
  )
});

const DisplaySolutionsDropdown = dynamic(
  () => import('./components/DisplaySolutionsDropdown'),
  {
    ssr: true,
    loading: () => (
      <div className="text-gray-700 px-3 py-2 rounded-md hover:bg-gray-50 flex items-center animate-pulse">
        Display Solutions
        <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: {
    template: '%s | UK Greeting Card Sales Agent',
    default: 'Dave Langdon - UK Greeting Card Sales Agent | East Anglia',
  },
  description: HOME_PAGE_META_DESCRIPTION,
  icons: {
    icon: [
      { url: '/favicons/favicon.ico', sizes: 'any' },
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/favicons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/favicons/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/favicons/android-chrome-512x512.png',
      },
      {
        rel: 'msapplication-TileImage',
        url: '/favicons/msapplication-TileImage.png',
      },
    ],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION_CODE || undefined,
    ...(process.env.NEXT_PUBLIC_BING_VERIFICATION_CODE
      ? {
          other: {
            'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION_CODE,
          },
        }
      : {}),
  },
  openGraph: {
    title: "Dave Langdon - UK Greeting Card Sales Agent | East Anglia",
    description: HOME_PAGE_META_DESCRIPTION,
    type: "website",
    locale: "en_GB",
    siteName: "East Anglian Sales LTD",
    url: "https://www.easalesltd.co.uk",
    images: [
      {
        url: "https://www.easalesltd.co.uk/images/showcase/showcase1.jpeg",
        width: 1200,
        height: 630,
        alt: "East Anglian Sales LTD - Greeting Cards & Gifts Display"
      },
      {
        url: "https://www.easalesltd.co.uk/images/showcase/showcase2.jpeg",
        width: 1200,
        height: 630,
        alt: "East Anglian Sales LTD - Wholesale Cards & Gifts"
      },
      {
        url: "https://www.easalesltd.co.uk/images/showcase/showcase4.jpeg",
        width: 1200,
        height: 630,
        alt: "East Anglian Sales LTD - Greeting Card Sales Agent"
      }
    ]
  },
  robots: {
    index: true,
    follow: true
  },
  authors: [{ name: "Dave Langdon" }, { name: "David Langdon" }],
  metadataBase: new URL("https://www.easalesltd.co.uk"),
  generator: "Next.js",
  applicationName: "East Anglian Sales LTD",
  appleWebApp: {
    capable: true,
    title: 'EA Sales',
    statusBarStyle: 'default',
  },
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
    title: 'Dave Langdon - UK Greeting Card Sales Agent | East Anglia',
    description: HOME_PAGE_META_DESCRIPTION,
    site: '@eastangliansalesltd',
    creator: '@DaveLangdon',
    images: [
      'https://www.easalesltd.co.uk/images/showcase/showcase1.jpeg',
      'https://www.easalesltd.co.uk/images/showcase/showcase2.jpeg'
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const nonce = await getCspNonce()
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()

  return (
    <html lang="en-GB">
      <head>
        {/* Preload critical assets */}
        <link
          rel="preload"
          href="/images/logo.webp"
          as="image"
          type="image/webp"
        />
        <link
          rel="preload"
          href="/favicons/favicon.ico"
          as="image"
          type="image/x-icon"
        />
        <link rel="alternate" type="text/plain" title="LLM site summary" href="/llms.txt" />
        <link rel="alternate" type="text/plain" title="LLM full source" href="/llms-full.txt" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Geo and location meta tags */}
        <meta name="geo.region" content="GB-ENG" />
        <meta name="geo.placename" content="East Anglia" />
        <meta name="geo.position" content="52.2333;0.7167" />
        <meta name="ICBM" content="52.2333, 0.7167" />
        <meta name="distribution" content="UK" />
        <meta name="coverage" content="Suffolk, Norfolk, Essex, Cambridgeshire, Hertfordshire" />
        
        {/* Sitemap */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        
        {/* Touch icons and web app title come from metadata.icons / metadata.appleWebApp */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/favicons/msapplication-TileImage.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Structured data for search engines - rendered inline for immediate availability */}
        <script
          id="schema-org"
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "additionalType": [
                  "https://schema.org/LocalBusiness",
                  "https://schema.org/SalesAgent"
                ],
                "@id": "https://www.easalesltd.co.uk/#organization",
                "name": "East Anglian Sales LTD",
                "alternateName": ["EA Sales", "East Anglian Sales"],
                "description": HOME_PAGE_META_DESCRIPTION,
                "url": "https://www.easalesltd.co.uk",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.easalesltd.co.uk/images/logo.webp",
                  "contentUrl": "https://www.easalesltd.co.uk/images/logo.webp",
                  "width": 100,
                  "height": 67
                },
                "image": [
                  {
                    "@type": "ImageObject",
                    "url": "https://www.easalesltd.co.uk/images/showcase/showcase1.jpeg",
                    "contentUrl": "https://www.easalesltd.co.uk/images/showcase/showcase1.jpeg",
                    "width": 1200,
                    "height": 630,
                    "caption": "East Anglian Sales LTD - Greeting Cards & Gifts Display"
                  },
                  {
                    "@type": "ImageObject",
                    "url": "https://www.easalesltd.co.uk/images/showcase/showcase2.jpeg",
                    "contentUrl": "https://www.easalesltd.co.uk/images/showcase/showcase2.jpeg",
                    "width": 1200,
                    "height": 630,
                    "caption": "East Anglian Sales LTD - Wholesale Cards & Gifts"
                  },
                  {
                    "@type": "ImageObject",
                    "url": "https://www.easalesltd.co.uk/images/showcase/showcase4.jpeg",
                    "contentUrl": "https://www.easalesltd.co.uk/images/showcase/showcase4.jpeg",
                    "width": 1200,
                    "height": 630,
                    "caption": "East Anglian Sales LTD - Greeting Card Sales Agent"
                  }
                ],
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
                  "latitude": 52.2333,
                  "longitude": 0.7167
                },
                "contactPoint": [
                  {
                    "@type": "ContactPoint",
                    "telephone": "07709197915",
                    "email": "dave@easalesltd.co.uk",
                    "contactType": "sales",
                    "areaServed": ["East Anglia", "Suffolk", "Norfolk", "Essex", "Cambridgeshire", "Hertfordshire"],
                    "availableLanguage": "English"
                  }
                ],
                "sameAs": [...BUSINESS.sameAs],
                "identifier": {
                  "@type": "PropertyValue",
                  "name": "Company Number",
                  "propertyID": "CompanyNumber",
                  "value": "14725288"
                },
                "disambiguatingDescription": "UK greeting card and gift sales agent covering East Anglia. Trade-only. Not a high-street shop and not a publisher.",
                "knowsAbout": [
                  "UK greeting card sales agent",
                  "UK gift sales agent",
                  "UK sales agents by territory",
                  "Greeting card sales agent",
                  "Wholesale greeting cards",
                  "Giftware sales agent",
                  "East Anglia independent retail",
                  "Retail display solutions"
                ],
                "memberOf": {
                  "@type": "Organization",
                  "name": UK_GREETING_CARD_ASSOCIATION_NAME,
                  "alternateName": "GCA",
                  "url": UK_GREETING_CARD_ASSOCIATION_URL
                },
                "areaServed": [
                  {
                    "@type": "AdministrativeArea",
                    "name": "East Anglia",
                    "containedInPlace": {
                      "@type": "Country",
                      "name": "United Kingdom"
                    }
                  },
                  {
                    "@type": "State",
                    "name": "Suffolk",
                    "address": {
                      "@type": "PostalAddress",
                      "addressRegion": "Suffolk",
                      "addressCountry": "GB"
                    }
                  },
                  {
                    "@type": "State",
                    "name": "Norfolk",
                    "address": {
                      "@type": "PostalAddress",
                      "addressRegion": "Norfolk",
                      "addressCountry": "GB"
                    }
                  },
                  {
                    "@type": "State",
                    "name": "Essex",
                    "address": {
                      "@type": "PostalAddress",
                      "addressRegion": "Essex",
                      "addressCountry": "GB"
                    }
                  },
                  {
                    "@type": "State",
                    "name": "Cambridgeshire",
                    "address": {
                      "@type": "PostalAddress",
                      "addressRegion": "Cambridgeshire",
                      "addressCountry": "GB"
                    }
                  },
                  {
                    "@type": "State",
                    "name": "Hertfordshire",
                    "address": {
                      "@type": "PostalAddress",
                      "addressRegion": "Hertfordshire",
                      "addressCountry": "GB"
                    }
                  },
                  {
                    "@type": "GeoCircle",
                    "geoMidpoint": {
                      "@type": "GeoCoordinates",
                      "latitude": "52.2333",
                      "longitude": "0.7167"
                    },
                    "geoRadius": {
                      "@type": "Distance",
                      "value": "100",
                      "unitCode": "KMT"
                    }
                  }
                ],
                "serviceArea": {
                  "@type": "GeoCircle",
                  "geoMidpoint": {
                    "@type": "GeoCoordinates",
                    "latitude": "52.2333",
                    "longitude": "0.7167"
                  },
                  "geoRadius": {
                    "@type": "Distance",
                    "value": "100",
                    "unitCode": "KMT"
                  }
                },
                "priceRange": "££",
                "vatID": "481 2602 07",
                "foundingDate": "2022",
                "founder": {
                  "@type": "Person",
                  "name": "Dave Langdon",
                  "alternateName": "David Langdon",
                  "jobTitle": ["UK Greeting Card Sales Agent", "Greeting Card Sales Agent", "Giftware Sales Agent", "Sales Agent"],
                  "occupation": {
                    "@type": "Occupation",
                    "name": "UK Greeting Card Sales Agent",
                    "occupationLocation": {
                      "@type": "City",
                      "name": "Ipswich"
                    },
                    "skills": "Greeting Card Sales, Giftware Sales, Retail Supplier, Wholesale Agent"
                  },
                  "description": "Dave Langdon, also known as David Langdon, is a UK greeting card and gift sales agent covering East Anglia, with over a decade of experience."
                },
                "openingHours": "Mo-Fr 09:00-17:00",
                "openingHoursSpecification": [
                  {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    "opens": "09:00",
                    "closes": "17:00"
                  }
                ],
                "paymentAccepted": ["Credit Card", "Debit Card", "Bank Transfer"],
                "currenciesAccepted": "GBP",
                "telephone": "07709197915",
                "email": "dave@easalesltd.co.uk"
              },
              {
                "@context": "https://schema.org",
                "@type": "Person",
                "@id": "https://www.easalesltd.co.uk/#person",
                "name": "Dave Langdon",
                "alternateName": ["David Langdon"],
                "url": "https://www.easalesltd.co.uk/about",
                "sameAs": [...BUSINESS.personSameAs],
                "jobTitle": ["UK Greeting Card Sales Agent", "Greeting Card Sales Agent", "Giftware Sales Agent", "Sales Agent"],
                "occupation": {
                  "@type": "Occupation",
                  "name": "UK Greeting Card Sales Agent",
                  "occupationLocation": {
                    "@type": "City",
                    "name": "Ipswich"
                  }
                },
                "knowsAbout": [
                  "UK greeting card sales agent",
                  "UK sales agents by territory",
                  "Greeting Card Sales",
                  "Giftware Sales",
                  "Retail Supplier",
                  "Wholesale Agent",
                  "Gift Sales Representative",
                  UK_GREETING_CARD_ASSOCIATION_NAME
                ],
                "worksFor": {
                  "@type": "Organization",
                  "@id": "https://www.easalesltd.co.uk/#organization",
                  "name": "East Anglian Sales LTD"
                },
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Ipswich",
                  "addressRegion": "Suffolk",
                  "addressCountry": "GB"
                },
                "description": "Dave Langdon, also known as David Langdon, is a UK greeting card and gift sales agent covering East Anglia, based in Ipswich, Suffolk. With over a decade of experience, he serves retailers across Suffolk, Norfolk, Essex, Cambridgeshire, and Hertfordshire."
              }
            ])
          }}
        ></script>
      </head>
      <body className={inter.className}>
        <GoogleWebVitals />
        {gaMeasurementId ? (
          <>
            <Script id="google-consent-default" strategy="beforeInteractive" nonce={nonce}>
              {buildGoogleConsentDefaultScript()}
            </Script>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
              nonce={nonce}
            />
            <Script id="google-analytics" strategy="afterInteractive" nonce={nonce}>
              {`
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}');
              `}
            </Script>
          </>
        ) : null}
        {gaMeasurementId ? <CookieConsentBanner /> : null}
        <header className="sticky top-0 z-50 w-full bg-white dark:bg-neutral-950 border-b border-gray-100 dark:border-neutral-800 transition-colors duration-300 pt-[max(0.125rem,env(safe-area-inset-top))] pb-1.5 md:pt-4 md:pb-3">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/*
              Sticky (not fixed) so content always starts below the real header height on mobile — avoids
              guessing with pt-* on main when the row wraps. Slimmer py on small screens; md+ keeps roomy bar.
            */}
            <div className="flex min-h-0 items-center justify-between py-0 md:min-h-16 md:py-1 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:gap-x-3 lg:gap-x-4">
              <div className="flex min-w-0 items-center md:justify-self-start">
                <HeaderLogo />
              </div>
              <div className="hidden min-w-0 flex-wrap items-center justify-center gap-x-3 gap-y-1 lg:gap-x-6 md:flex md:justify-self-center">
                <Link href="/" prefetch className="text-gray-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-900">Home</Link>
                <AboutDropdown />
                <BrandsDropdown />
                <DisplaySolutionsDropdown />
                <Link href="/temporary-rep-cover" prefetch className="text-gray-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-900">Temporary Rep Cover</Link>
                <Link href="/contact" prefetch className="text-gray-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-900">Contact</Link>
              </div>
              <div className="hidden items-center md:flex md:justify-self-end">
                <ClientButton />
              </div>
              <div className="flex shrink-0 items-center gap-2 md:hidden">
                <MobileRequestButton />
                <MobileMenu />
              </div>
            </div>
          </nav>
        </header>
        <main id="main-content" className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
          {children}
        </main>

        <footer className="bg-gray-50 dark:bg-neutral-950 dark:border-t dark:border-neutral-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-8 xl:gap-x-10 gap-y-10 items-start">
              <div className="order-3 lg:order-1 text-center lg:text-left min-w-0 lg:max-w-md border-t border-gray-200 dark:border-neutral-800 pt-10 lg:border-t-0 lg:pt-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-4">East Anglian Sales LTD</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-neutral-400 leading-relaxed">
                  <p>Registered office: Office 2, Paragon House,</p>
                  <p>35 Lower Brook Street, Ipswich, England, IP4 1AQ</p>
                  <p>Company Registration No: 14725288</p>
                  <p>VAT No. 481 2602 07</p>
                </div>
                <div className="mt-6 flex justify-center lg:justify-start gap-7">
                  <a
                    href="tel:07709197915"
                    className="rounded-md p-1 text-gray-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white transition-colors"
                    aria-label="Phone"
                  >
                    <FaPhone className="h-7 w-7" />
                  </a>
                  <a
                    href="mailto:dave@easalesltd.co.uk"
                    className="rounded-md p-1 text-gray-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white transition-colors"
                    aria-label="Email"
                  >
                    <FaEnvelope className="h-7 w-7" />
                  </a>
                </div>
              </div>

              <div className="order-1 lg:order-2 text-center border-t-0 pt-0 lg:pt-0 flex flex-col items-center lg:items-center min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-4 w-full">
                  Follow East Anglian Sales
                </h3>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-4 max-w-sm mx-auto leading-relaxed">
                  Shop visits, new ranges, and snapshots from the road across East Anglia. And maybe
                  whatever I&apos;ve baked that day.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={FACEBOOK_PAGE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold border border-neutral-900 dark:border-neutral-200 text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-800 dark:focus-visible:ring-neutral-300 dark:focus-visible:ring-offset-neutral-950"
                  >
                    <FaFacebook className="h-5 w-5 shrink-0" aria-hidden />
                    Facebook
                  </a>
                  <a
                    href="https://www.instagram.com/eastangliansalesltd/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold border border-neutral-900 dark:border-neutral-200 text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-800 dark:focus-visible:ring-neutral-300 dark:focus-visible:ring-offset-neutral-950"
                  >
                    <FaInstagram className="h-5 w-5 shrink-0" aria-hidden />
                    @eastangliansalesltd
                  </a>
                </div>
              </div>

              <div className="order-2 lg:order-3 text-center lg:text-right border-t border-gray-200 dark:border-neutral-800 pt-10 lg:border-t-0 lg:pt-0 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-4">
                  Member of the {UK_GREETING_CARD_ASSOCIATION_NAME}
                </h3>
                <a
                  href={UK_GREETING_CARD_ASSOCIATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center lg:justify-end focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-800 dark:focus-visible:ring-neutral-300 dark:focus-visible:ring-offset-neutral-950 rounded w-full lg:w-auto"
                  aria-label={`${UK_GREETING_CARD_ASSOCIATION_NAME} (opens in a new tab)`}
                >
                  <Image
                    src={encodeURI(GCA_MEMBER_LOGO_PATH)}
                    alt={`${UK_GREETING_CARD_ASSOCIATION_NAME} member logo`}
                    width={280}
                    height={84}
                    className="h-[4.25rem] w-auto max-w-[min(100%,280px)] object-contain mx-auto lg:ml-auto lg:mr-0 mix-blend-multiply"
                    sizes="(max-width: 640px) 70vw, 280px"
                  />
                </a>
              </div>
            </div>
            <div className="mt-10 border-t border-gray-200 pt-8 text-center text-sm text-gray-600 dark:border-neutral-800 dark:text-neutral-400">
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
                <Link href="/privacy" className="underline underline-offset-2 hover:text-neutral-950 hover:no-underline dark:hover:text-neutral-100">
                  Privacy
                </Link>
                <span aria-hidden className="text-gray-300 dark:text-neutral-700">
                  |
                </span>
                <Link href="/cookies" className="underline underline-offset-2 hover:text-neutral-950 hover:no-underline dark:hover:text-neutral-100">
                  Cookies
                </Link>
                {gaMeasurementId ? (
                  <>
                    <span aria-hidden className="text-gray-300 dark:text-neutral-700">
                      |
                    </span>
                    <CookieSettingsButton />
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
