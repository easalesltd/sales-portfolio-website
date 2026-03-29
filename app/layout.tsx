import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { FaEnvelope, FaInstagram, FaPhone } from 'react-icons/fa';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { companies, type Company } from './data/companies';
import MobileRequestButton from './components/MobileRequestButton';
import AboutDropdown from './components/AboutDropdown';

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
      <button className="text-gray-500 p-2 animate-pulse">
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

export const metadata: Metadata = {
  title: {
    template: '%s | Greeting Card & Gift Sales Agent',
    default: 'Dave Langdon - Greeting Card & Gift Sales Agent | East Anglia',
  },
  description: 'Professional Greeting Card and Giftware Sales Agent serving the wholesale trade in East Anglia. Dave Langdon provides personal service to retailers across Suffolk, Norfolk, Essex, and Cambridgeshire.',
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
  keywords: [
    // General Sales Agent Terms (Non-Location Specific)
    "Greeting Card Sales Agent",
    "Gift Sales Agent", 
    "Greeting Card Agent",
    "Gift Agent",
    "Greeting Card Sales Representative",
    "Gift Sales Representative",
    "Greeting Card Sales Rep",
    "Gift Sales Rep",
    "Greeting Card Wholesale Agent",
    "Gift Wholesale Agent",
    "Greeting Card Trade Agent",
    "Gift Trade Agent",
    "Greeting Card Distributor",
    "Gift Distributor",
    "Greeting Card Wholesale Supplier",
    "Gift Wholesale Supplier",
    "Greeting Card Trade Supplier",
    "Gift Trade Supplier",
    "Greeting Card Retail Supplier",
    "Gift Retail Supplier",
    "Greeting Card Business Supplier",
    "Gift Business Supplier",
    "Greeting Card Sales Professional",
    "Gift Sales Professional",
    "Greeting Card Sales Specialist",
    "Gift Sales Specialist",
    "Greeting Card Sales Consultant",
    "Gift Sales Consultant",
    "Greeting Card Sales Manager",
    "Gift Sales Manager",
    "Greeting Card Sales Executive",
    "Gift Sales Executive",
    "Greeting Card Sales Coordinator",
    "Gift Sales Coordinator",
    "Greeting Card Sales Officer",
    "Gift Sales Officer",
    "Greeting Card Sales Associate",
    "Gift Sales Associate",
    "Greeting Card Sales Partner",
    "Gift Sales Partner",
    "Greeting Card Sales Team",
    "Gift Sales Team",
    "Greeting Card Sales Service",
    "Gift Sales Service",
    "Greeting Card Sales Support",
    "Gift Sales Support",
    "Greeting Card Sales Help",
    "Gift Sales Help",
    "Greeting Card Sales Assistance",
    "Gift Sales Assistance",
    "Greeting Card Sales Guidance",
    "Gift Sales Guidance",
    "Greeting Card Sales Advice",
    "Gift Sales Advice",
    "Greeting Card Sales Expertise",
    "Gift Sales Expertise",
    "Greeting Card Sales Knowledge",
    "Gift Sales Knowledge",
    "Greeting Card Sales Experience",
    "Gift Sales Experience",
    "Greeting Card Sales Skills",
    "Gift Sales Skills",
    "Greeting Card Sales Capabilities",
    "Gift Sales Capabilities",
    "Greeting Card Sales Solutions",
    "Gift Sales Solutions",
    "Greeting Card Sales Options",
    "Gift Sales Options",
    "Greeting Card Sales Choices",
    "Gift Sales Choices",
    "Greeting Card Sales Alternatives",
    "Gift Sales Alternatives",
    "Greeting Card Sales Possibilities",
    "Gift Sales Possibilities",
    "Greeting Card Sales Opportunities",
    "Gift Sales Opportunities",
    "Greeting Card Sales Prospects",
    "Gift Sales Prospects",
    "Greeting Card Sales Potential",
    "Gift Sales Potential",
    "Greeting Card Sales Benefits",
    "Gift Sales Benefits",
    "Greeting Card Sales Advantages",
    "Gift Sales Advantages",
    "Greeting Card Sales Features",
    "Gift Sales Features",
    "Greeting Card Sales Highlights",
    "Gift Sales Highlights",
    "Greeting Card Sales Strengths",
    "Gift Sales Strengths",
    "Greeting Card Sales Value",
    "Gift Sales Value",
    "Greeting Card Sales Quality",
    "Gift Sales Quality",
    "Greeting Card Sales Excellence",
    "Gift Sales Excellence",
    "Greeting Card Sales Superiority",
    "Gift Sales Superiority",
    "Greeting Card Sales Premium",
    "Gift Sales Premium",
    "Greeting Card Sales High-End",
    "Gift Sales High-End",
    "Greeting Card Sales Luxury",
    "Gift Sales Luxury",
    "Greeting Card Sales Premium Quality",
    "Gift Sales Premium Quality",
    "Greeting Card Sales Top Quality",
    "Gift Sales Top Quality",
    "Greeting Card Sales Best Quality",
    "Gift Sales Best Quality",
    "Greeting Card Sales Superior Quality",
    "Gift Sales Superior Quality",
    "Greeting Card Sales Excellent Quality",
    "Gift Sales Excellent Quality",
    "Greeting Card Sales Outstanding Quality",
    "Gift Sales Outstanding Quality",
    "Greeting Card Sales Exceptional Quality",
    "Gift Sales Exceptional Quality",
    "Greeting Card Sales Remarkable Quality",
    "Gift Sales Remarkable Quality",
    "Greeting Card Sales Notable Quality",
    "Gift Sales Notable Quality",
    "Greeting Card Sales Distinctive Quality",
    "Gift Sales Distinctive Quality",
    "Greeting Card Sales Unique Quality",
    "Gift Sales Unique Quality",
    "Greeting Card Sales Original Quality",
    "Gift Sales Original Quality",
    "Greeting Card Sales Creative Quality",
    "Gift Sales Creative Quality",
    "Greeting Card Sales Innovative Quality",
    "Gift Sales Innovative Quality",
    "Greeting Card Sales Imaginative Quality",
    "Gift Sales Imaginative Quality",
    "Greeting Card Sales Inventive Quality",
    "Gift Sales Inventive Quality",
    "Greeting Card Sales Artistic Quality",
    "Gift Sales Artistic Quality",
    "Greeting Card Sales Designer Quality",
    "Gift Sales Designer Quality",
    "Greeting Card Sales Boutique Quality",
    "Gift Sales Boutique Quality",
    "Greeting Card Sales Independent Quality",
    "Gift Sales Independent Quality",
    "Greeting Card Sales Artisan Quality",
    "Gift Sales Artisan Quality",
    "Greeting Card Sales Craft Quality",
    "Gift Sales Craft Quality",
    "Greeting Card Sales Handcrafted Quality",
    "Gift Sales Handcrafted Quality",
    "Greeting Card Sales Bespoke Quality",
    "Gift Sales Bespoke Quality",
    "Greeting Card Sales Custom Quality",
    "Gift Sales Custom Quality",
    "Greeting Card Sales Personalized Quality",
    "Gift Sales Personalized Quality",
    "Greeting Card Sales Tailored Quality",
    "Gift Sales Tailored Quality",
    
    // General Sales Agent - Location Specific
    "Sales Agent East Anglia",
    "Sales Agent Essex",
    "Sales Agent Suffolk",
    "Sales Agent Norfolk", 
    "Sales Agent Cambridgeshire",
    "Sales Agent Hertfordshire",
    "Local Sales Agent East Anglia",
    "Local Sales Agent Essex",
    "Local Sales Agent Suffolk",
    "Local Sales Agent Norfolk",
    "Local Sales Agent Cambridgeshire",
    "Local Sales Agent Hertfordshire",
    
    // Greeting Card Sales Agent - Location Specific
    "Greeting Card Sales Agent East Anglia",
    "Greeting Card Sales Agent Essex",
    "Greeting Card Sales Agent Suffolk",
    "Greeting Card Sales Agent Norfolk", 
    "Greeting Card Sales Agent Cambridgeshire",
    "Greeting Card Sales Agent Hertfordshire",
    "Greeting Card Agent East Anglia",
    "Greeting Card Agent Essex",
    "Greeting Card Agent Suffolk",
    "Greeting Card Agent Norfolk",
    "Greeting Card Agent Cambridgeshire",
    "Greeting Card Agent Hertfordshire",
    "Greeting Card Sales Representative East Anglia",
    "Greeting Card Sales Representative Essex",
    "Greeting Card Sales Representative Suffolk",
    "Greeting Card Sales Representative Norfolk",
    "Greeting Card Sales Representative Cambridgeshire",
    "Greeting Card Sales Representative Hertfordshire",
    
    // Gift Sales Agent - Location Specific
    "Gift Sales Agent East Anglia",
    "Gift Sales Agent Essex",
    "Gift Sales Agent Suffolk",
    "Gift Sales Agent Norfolk",
    "Gift Sales Agent Cambridgeshire", 
    "Gift Sales Agent Hertfordshire",
    "Gift Agent East Anglia",
    "Gift Agent Essex",
    "Gift Agent Suffolk",
    "Gift Agent Norfolk",
    "Gift Agent Cambridgeshire",
    "Gift Agent Hertfordshire",
    "Gift Sales Representative East Anglia",
    "Gift Sales Representative Essex",
    "Gift Sales Representative Suffolk",
    "Gift Sales Representative Norfolk",
    "Gift Sales Representative Cambridgeshire",
    "Gift Sales Representative Hertfordshire",
    
    // Wholesale and Trade Terms
    "Greeting Card Wholesale Supplier East Anglia",
    "Gift Wholesale Supplier East Anglia",
    "Greeting Card Trade Supplier Essex",
    "Gift Trade Supplier Essex",
    "Greeting Card Wholesale Supplier Suffolk",
    "Gift Wholesale Supplier Suffolk",
    "Greeting Card Wholesale Supplier Norfolk",
    "Gift Wholesale Supplier Norfolk",
    "Greeting Card Wholesale Supplier Cambridgeshire",
    "Gift Wholesale Supplier Cambridgeshire",
    "Greeting Card Wholesale Supplier Hertfordshire",
    "Gift Wholesale Supplier Hertfordshire",
    
    // The Cambridge Confectionery Company & Calico Cottage (wholesale confectionery)
    "Dave Langdon Cambridge Confectionery Company",
    "David Langdon Cambridge Confectionery Company",
    "Dave Langdon Calico Cottage",
    "David Langdon Calico Cottage",
    "The Cambridge Confectionery Company Sales Agent Dave Langdon",
    "The Cambridge Confectionery Company Sales Agent David Langdon",
    "Calico Cottage Sales Agent Dave Langdon",
    "Calico Cottage Sales Agent David Langdon",
    "The Cambridge Confectionery Company Sales Agent",
    "Calico Cottage Sales Agent",
    "Cambridge Confectionery wholesale",
    "wholesale Cambridge Confectionery",
    "wholesale Cambridge Confectionery Company",
    "Calico Cottage wholesale",
    "wholesale Calico Cottage",
    "wholesale confectionery East Anglia",
    "confectionery sales agent East Anglia",
    "chocolate wholesale East Anglia",
    "trade confectionery supplier East Anglia",
    "The Cambridge Confectionery Company East Anglia",
    "Calico Cottage East Anglia",
    "The Cambridge Confectionery Company Suffolk",
    "The Cambridge Confectionery Company Norfolk",
    "The Cambridge Confectionery Company Essex",
    "The Cambridge Confectionery Company Cambridgeshire",
    "The Cambridge Confectionery Company Hertfordshire",
    "Calico Cottage Suffolk",
    "Calico Cottage Norfolk",
    "Calico Cottage Essex",
    "Calico Cottage Cambridgeshire",
    "Calico Cottage Hertfordshire",
    
    // Retail and Business Terms
    "Greeting Card Retail Supplier East Anglia",
    "Gift Retail Supplier East Anglia",
    "Greeting Card Business Supplier Essex",
    "Gift Business Supplier Essex",
    "Greeting Card Retail Supplier Suffolk",
    "Gift Retail Supplier Suffolk",
    "Greeting Card Retail Supplier Norfolk",
    "Gift Retail Supplier Norfolk",
    "Greeting Card Retail Supplier Cambridgeshire",
    "Gift Retail Supplier Cambridgeshire",
    "Greeting Card Retail Supplier Hertfordshire",
    "Gift Retail Supplier Hertfordshire",
    
    // Local and Regional Terms
    "Local Greeting Card Sales Agent East Anglia",
    "Local Gift Sales Agent East Anglia",
    "Local Greeting Card Agent Essex",
    "Local Gift Agent Essex",
    "Local Greeting Card Agent Suffolk",
    "Local Gift Agent Suffolk",
    "Local Greeting Card Agent Norfolk",
    "Local Gift Agent Norfolk",
    "Local Greeting Card Agent Cambridgeshire",
    "Local Gift Agent Cambridgeshire",
    "Local Greeting Card Agent Hertfordshire",
    "Local Gift Agent Hertfordshire",
    
    // Industry Specific Terms
    "Greeting Card Distributor East Anglia",
    "Gift Distributor East Anglia",
    "Greeting Card Distributor Essex",
    "Gift Distributor Essex",
    "Greeting Card Distributor Suffolk",
    "Gift Distributor Suffolk",
    "Greeting Card Distributor Norfolk",
    "Gift Distributor Norfolk",
    "Greeting Card Distributor Cambridgeshire",
    "Gift Distributor Cambridgeshire",
    "Greeting Card Distributor Hertfordshire",
    "Gift Distributor Hertfordshire",
    
    // Product Specific Terms
    "Birthday Card Sales Agent East Anglia",
    "Birthday Card Sales Agent Essex",
    "Birthday Card Sales Agent Suffolk",
    "Birthday Card Sales Agent Norfolk",
    "Birthday Card Sales Agent Cambridgeshire",
    "Birthday Card Sales Agent Hertfordshire",
    "Christmas Card Sales Agent East Anglia",
    "Christmas Card Sales Agent Essex",
    "Christmas Card Sales Agent Suffolk",
    "Christmas Card Sales Agent Norfolk",
    "Christmas Card Sales Agent Cambridgeshire",
    "Christmas Card Sales Agent Hertfordshire",
    "Anniversary Card Sales Agent East Anglia",
    "Anniversary Card Sales Agent Essex",
    "Anniversary Card Sales Agent Suffolk",
    "Anniversary Card Sales Agent Norfolk",
    "Anniversary Card Sales Agent Cambridgeshire",
    "Anniversary Card Sales Agent Hertfordshire",
    "Wedding Card Sales Agent East Anglia",
    "Wedding Card Sales Agent Essex",
    "Wedding Card Sales Agent Suffolk",
    "Wedding Card Sales Agent Norfolk",
    "Wedding Card Sales Agent Cambridgeshire",
    "Wedding Card Sales Agent Hertfordshire",
    
    // Gift Categories
    "Home Gift Sales Agent East Anglia",
    "Home Gift Sales Agent Essex",
    "Home Gift Sales Agent Suffolk",
    "Home Gift Sales Agent Norfolk",
    "Home Gift Sales Agent Cambridgeshire",
    "Home Gift Sales Agent Hertfordshire",
    "Lifestyle Gift Sales Agent East Anglia",
    "Lifestyle Gift Sales Agent Essex",
    "Lifestyle Gift Sales Agent Suffolk",
    "Lifestyle Gift Sales Agent Norfolk",
    "Lifestyle Gift Sales Agent Cambridgeshire",
    "Lifestyle Gift Sales Agent Hertfordshire",
    "Personal Care Gift Sales Agent East Anglia",
    "Personal Care Gift Sales Agent Essex",
    "Personal Care Gift Sales Agent Suffolk",
    "Personal Care Gift Sales Agent Norfolk",
    "Personal Care Gift Sales Agent Cambridgeshire",
    "Personal Care Gift Sales Agent Hertfordshire",
    
    // Business and Trade Terms
    "Greeting Card Trade Account East Anglia",
    "Gift Trade Account East Anglia",
    "Greeting Card Trade Account Essex",
    "Gift Trade Account Essex",
    "Greeting Card Trade Account Suffolk",
    "Gift Trade Account Suffolk",
    "Greeting Card Trade Account Norfolk",
    "Gift Trade Account Norfolk",
    "Greeting Card Trade Account Cambridgeshire",
    "Gift Trade Account Cambridgeshire",
    "Greeting Card Trade Account Hertfordshire",
    "Gift Trade Account Hertfordshire",
    
    // Service Terms
    "Greeting Card Delivery East Anglia",
    "Gift Delivery East Anglia",
    "Greeting Card Delivery Essex",
    "Gift Delivery Essex",
    "Greeting Card Delivery Suffolk",
    "Gift Delivery Suffolk",
    "Greeting Card Delivery Norfolk",
    "Gift Delivery Norfolk",
    "Greeting Card Delivery Cambridgeshire",
    "Gift Delivery Cambridgeshire",
    "Greeting Card Delivery Hertfordshire",
    "Gift Delivery Hertfordshire",
    
    // Display and Retail Solutions
    "Greeting Card Display Solutions East Anglia",
    "Gift Display Solutions East Anglia",
    "Greeting Card Display Solutions Essex",
    "Gift Display Solutions Essex",
    "Greeting Card Display Solutions Suffolk",
    "Gift Display Solutions Suffolk",
    "Greeting Card Display Solutions Norfolk",
    "Gift Display Solutions Norfolk",
    "Greeting Card Display Solutions Cambridgeshire",
    "Gift Display Solutions Cambridgeshire",
    "Greeting Card Display Solutions Hertfordshire",
    "Gift Display Solutions Hertfordshire",
    
    // General Terms
    "East Anglian Sales LTD",
    "EA Sales",
    "Dave Langdon",
    "wholesale greeting cards",
    "wholesale gifts",
    "retail supplier",
    "trade supplier",
    "local agent",
    "sales representative",
    "business supplier",
    "retail solutions",
    "display solutions",
    "trade prices",
    "wholesale prices",
    "local delivery",
    "personal service",
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
    title: "Dave Langdon - Greeting Card & Gift Sales Agent | East Anglia",
    description: "Professional Greeting Card and Giftware Sales Agent serving the wholesale trade in East Anglia. Dave Langdon provides personal service to retailers across Suffolk, Norfolk, Essex, Cambridgeshire, and Hertfordshire.",
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
    title: 'Dave Langdon - Greeting Card & Gift Sales Agent | East Anglia',
    description: 'Professional Greeting Card and Giftware Sales Agent serving the wholesale trade in East Anglia. Serving retailers across Suffolk, Norfolk, Essex, Cambridgeshire, and Hertfordshire.',
    site: '@eastangliansalesltd',
    creator: '@DaveLangdon',
    images: [
      'https://www.easalesltd.co.uk/images/showcase/showcase1.jpeg',
      'https://www.easalesltd.co.uk/images/showcase/showcase2.jpeg'
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
        
        {/* Touch Icon and Web App Declarations */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EA Sales" />
        <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/favicons/favicon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/favicons/favicon-167x167.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/favicons/favicon-120x120.png" />
        <meta name="application-name" content="EA Sales" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/favicons/msapplication-TileImage.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Structured data for search engines - rendered inline for immediate availability */}
        <script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "@id": "https://www.easalesltd.co.uk/#webpage",
                "url": "https://www.easalesltd.co.uk",
                "name": "Dave Langdon - Greeting Card & Gift Sales Agent | East Anglia",
                "description": "Professional Greeting Card and Giftware Sales Agent serving the wholesale trade in East Anglia. Dave Langdon provides personal service to retailers across Suffolk, Norfolk, Essex, and Cambridgeshire.",
                "inLanguage": "en-GB",
                "isPartOf": {
                  "@type": "WebSite",
                  "@id": "https://www.easalesltd.co.uk/#website",
                  "url": "https://www.easalesltd.co.uk",
                  "name": "East Anglian Sales LTD"
                },
                "primaryImageOfPage": {
                  "@type": "ImageObject",
                  "url": "https://www.easalesltd.co.uk/images/showcase/showcase1.jpeg",
                  "contentUrl": "https://www.easalesltd.co.uk/images/showcase/showcase1.jpeg",
                  "width": 1200,
                  "height": 630
                },
                "breadcrumb": {
                  "@id": "https://www.easalesltd.co.uk/#breadcrumb"
                },
                "about": {
                  "@id": "https://www.easalesltd.co.uk/#organization"
                },
                "mainEntity": {
                  "@id": "https://www.easalesltd.co.uk/#organization"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": ["Organization", "LocalBusiness", "SalesAgent"],
                "@id": "https://www.easalesltd.co.uk/#organization",
                "name": "East Anglian Sales LTD",
                "alternateName": ["EA Sales", "East Anglian Sales"],
                "description": "Professional Greeting Card and Giftware Sales Agent serving the wholesale trade in East Anglia. Providing personal service to retailers across Suffolk, Norfolk, Essex, Cambridgeshire, and Hertfordshire.",
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
                    "areaServed": ["Suffolk", "Norfolk", "Essex", "Cambridgeshire", "Hertfordshire"],
                    "availableLanguage": "English"
                  }
                ],
                "sameAs": [
                  "https://www.instagram.com/eastangliansalesltd/",
                  "https://www.linkedin.com/company/east-anglian-sales-ltd",
                  "https://www.facebook.com/eastangliansalesltd"
                ],
                "areaServed": [
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
                  "jobTitle": ["Greeting Card Sales Agent", "Giftware Sales Agent", "Sales Agent"],
                  "occupation": {
                    "@type": "Occupation",
                    "name": "Greeting Card Sales Agent",
                    "occupationLocation": {
                      "@type": "City",
                      "name": "Ipswich"
                    },
                    "skills": "Greeting Card Sales, Giftware Sales, Retail Supplier, Wholesale Agent"
                  },
                  "description": "Dave Langdon, also known as David Langdon, is a professional Greeting Card Sales Agent and Giftware Sales Agent with over a decade of experience in East Anglia"
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
                "@type": "BreadcrumbList",
                "@id": "https://www.easalesltd.co.uk/#breadcrumb",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://www.easalesltd.co.uk"
                  }
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "Person",
                "@id": "https://www.easalesltd.co.uk/#person",
                "name": "Dave Langdon",
                "alternateName": ["David Langdon"],
                "jobTitle": ["Greeting Card Sales Agent", "Giftware Sales Agent", "Sales Agent"],
                "occupation": {
                  "@type": "Occupation",
                  "name": "Greeting Card Sales Agent",
                  "occupationLocation": {
                    "@type": "City",
                    "name": "Ipswich"
                  }
                },
                "knowsAbout": ["Greeting Card Sales", "Giftware Sales", "Retail Supplier", "Wholesale Agent", "Gift Sales Representative"],
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
                "description": "Dave Langdon, also known as David Langdon, is a UK-based professional Greeting Card Sales Agent and Giftware Sales Agent based in Ipswich, Suffolk. With over a decade of experience, Dave serves retailers across East Anglia including Suffolk, Norfolk, Essex, Cambridgeshire, and Hertfordshire."
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "@id": "https://www.easalesltd.co.uk/#faqpage",
                "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is a Greeting Card Sales Agent?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A Greeting Card Sales Agent is a professional intermediary between greeting card manufacturers and retailers. Dave Langdon is a UK-based Greeting Card and Giftware Sales Agent for East Anglian Sales LTD, helping retailers across East Anglia find perfect greeting cards and gifts."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is a Giftware Sales Agent?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A Giftware Sales Agent represents giftware manufacturers to retail businesses. Dave Langdon provides retailers in East Anglia with quality giftware products and expert advice on product selection and display solutions."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Where does Dave Langdon serve as a Sales Agent?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Dave Langdon serves as a Greeting Card and Giftware Sales Agent across East Anglia, covering Suffolk, Norfolk, Essex, Cambridgeshire, and Hertfordshire. He travels to retailers throughout these regions providing personal service."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How do I contact a Greeting Card Sales Agent?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Contact Dave Langdon by phone at 07709197915 or email at dave@easalesltd.co.uk. Available Monday to Friday to discuss greeting card and giftware needs."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What brands does the Greeting Card Sales Agent represent?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Dave Langdon represents brands including Paper Salad, Ohh Deer, Museums & Galleries, Mint Publishing, Star Editions, Boxer Gifts, Global Journey, Peppermint Grove, Emotional Rescue, David Fischhoff, Real & Exciting Designs, CGB Giftware, The Cambridge Confectionery Company (also known as Calico Cottage), and more."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Who is David Langdon?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "David Langdon (Dave Langdon) is a UK-based professional Greeting Card and Giftware Sales Agent based in Ipswich, Suffolk. He works for East Anglian Sales LTD, serving retailers across East Anglia including Suffolk, Norfolk, Essex, Cambridgeshire, and Hertfordshire."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What areas does East Anglian Sales LTD cover?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "East Anglian Sales LTD serves retailers across East Anglia, covering Suffolk, Norfolk, Essex, Cambridgeshire, and Hertfordshire. They provide wholesale greeting cards, gifts, and display solutions to independent shops and garden centres."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What services does East Anglian Sales LTD provide?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "East Anglian Sales LTD provides wholesale greeting cards and giftware supply, display solutions, expert product advice, and personal service to retailers. They help businesses create effective product displays and grow their greeting card and gift ranges."
                  }
                }
                ]
              }
            ])
          }}
        ></script>
      </head>
      <body className={inter.className}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7HWXWDZG4F"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7HWXWDZG4F');
          `}
        </Script>
        <header className="fixed top-0 left-0 right-0 bg-white dark:bg-neutral-950 z-50 pt-4 border-b border-transparent dark:border-neutral-800 transition-colors duration-300">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <Image
                    src="/images/logo.webp"
                    alt="East Anglian Sales LTD Logo"
                    width={100}
                    height={67}
                    className="object-contain brightness-0 dark:invert"
                    priority
                    sizes="100px"
                    quality={85}
                  />
                </Link>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/" prefetch className="text-gray-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-900">Home</Link>
                <AboutDropdown />
                <BrandsDropdown />
                <Link href="/display-solutions" prefetch className="text-gray-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-900">Display Solutions</Link>
                <Link href="/temporary-rep-cover" prefetch className="text-gray-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-900">Temporary Rep Cover</Link>
                <Link href="/contact" prefetch className="text-gray-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-900">Contact</Link>
                <ClientButton />
              </div>
              <div className="flex items-center md:hidden gap-2">
                <MobileRequestButton />
                <MobileMenu />
              </div>
            </div>
          </nav>
        </header>
        {/* Fixed gap below header - stays visible when scrolling so content doesn't touch header */}
        <div className="fixed top-20 left-0 right-0 h-2 bg-white dark:bg-neutral-950 z-40 transition-colors duration-300" aria-hidden="true" />
        <main id="main-content" className="pt-[88px] min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
          {children}
        </main>

        <footer className="bg-gray-50 dark:bg-neutral-950 dark:border-t dark:border-neutral-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-4">East Anglian Sales LTD</h3>
              <div className="space-y-2 text-gray-600 dark:text-neutral-400">
                <p>Registered office: Office 2, Paragon House,</p>
                <p>35 Lower Brook Street, Ipswich, England, IP4 1AQ</p>
                <p>Company Registration No: 14725288</p>
                <p>VAT No. 481 2602 07</p>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex justify-center space-x-6">
                  <a 
                    href="tel:07709197915" 
                    className="text-gray-600 dark:text-neutral-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    aria-label="Phone"
                  >
                    <FaPhone className="h-6 w-6" />
                  </a>
                  <a 
                    href="mailto:dave@easalesltd.co.uk" 
                    className="text-gray-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                    aria-label="Email"
                  >
                    <FaEnvelope className="h-6 w-6" />
                  </a>
                  <a 
                    href="https://www.instagram.com/eastangliansalesltd/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-neutral-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
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
