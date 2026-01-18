import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact East Anglian Sales LTD | David Langdon & Dave Langdon - Request a Visit from Your Local Agent",
  description: "Get in touch with David Langdon and Dave Langdon, your local wholesale agent in East Anglia. Request a visit, discuss trade prices, or place an order for greeting cards, gifts, and display solutions across Suffolk, Norfolk, Essex, and Cambridgeshire.",
  keywords: [
    "contact East Anglian Sales",
    "contact Dave Langdon",
    "contact David Langdon",
    "Dave Langdon contact",
    "David Langdon contact",
    "Dave Langdon phone",
    "David Langdon phone",
    "Dave Langdon email",
    "David Langdon email",
    "request agent visit",
    "wholesale trade prices",
    "local sales agent Suffolk",
    "Norfolk wholesale contact",
    "Essex gift supplier contact",
    "Cambridgeshire retail supplier",
    "wholesale order enquiry",
    "trade account application",
    "local agent visit",
    "wholesale supplier contact",
    "East Anglia sales agent",
    "greeting cards wholesale contact",
    "gift supplier enquiry",
    "display solutions contact"
  ],
  openGraph: {
    title: "Contact East Anglian Sales LTD | David Langdon & Dave Langdon - Request a Visit from Your Local Agent",
    description: "Get in touch with David Langdon and Dave Langdon, your local wholesale agent in East Anglia. Request a visit, discuss trade prices, or place an order for greeting cards, gifts, and display solutions across Suffolk, Norfolk, Essex, and Cambridgeshire.",
    type: "website",
    locale: "en_GB",
    siteName: "East Anglian Sales LTD",
    url: "https://www.easalesltd.co.uk/contact",
    images: [
      {
        url: "https://www.easalesltd.co.uk/images/showcase/showcase1.jpeg",
        width: 1200,
        height: 630,
        alt: "Contact East Anglian Sales LTD"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact East Anglian Sales LTD | David Langdon & Dave Langdon - Request a Visit",
    description: "Get in touch with David Langdon and Dave Langdon, your local wholesale agent in East Anglia. Request a visit or place an order.",
    images: ["https://www.easalesltd.co.uk/images/showcase/showcase1.jpeg"]
  },
  alternates: {
    canonical: "https://www.easalesltd.co.uk/contact"
  },
  other: {
    'geo.region': 'GB-ENG',
    'geo.placename': 'Ipswich, Suffolk',
    'geo.position': '52.2333;0.7167',
    'ICBM': '52.2333, 0.7167'
  },
  // Add Google Business Profile verification
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION_CODE || '',
  },
}; 