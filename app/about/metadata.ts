import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Dave Langdon | East Anglian Sales",
  description:
    "Meet Dave Langdon — East Anglia's greeting card and gift sales agent, based in Ipswich with over 11 years' experience helping independent retailers build ranges that sell.",
  openGraph: {
    title: "About Dave Langdon | East Anglian Sales",
    description:
      "Meet Dave Langdon — East Anglia's greeting card and gift sales agent, based in Ipswich with over 11 years' experience helping independent retailers build ranges that sell.",
    type: "website",
    locale: "en_GB",
    siteName: "East Anglian Sales LTD",
    url: "https://www.easalesltd.co.uk/about",
    images: [
      {
        url: "https://www.easalesltd.co.uk/images/showcase/showcase1.jpeg",
        width: 1200,
        height: 630,
        alt: "East Anglian Sales LTD - Wholesale Cards & Gifts"
      },
      {
        url: "https://www.easalesltd.co.uk/images/showcase/showcase2.jpeg",
        width: 1200,
        height: 630,
        alt: "About East Anglian Sales LTD - Greeting Card Sales Agent"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "About Dave Langdon | East Anglian Sales",
    description:
      "Meet Dave Langdon — East Anglia's greeting card and gift sales agent, based in Ipswich with over 11 years' experience helping independent retailers build ranges that sell.",
    images: [
      "https://www.easalesltd.co.uk/images/showcase/showcase1.jpeg",
      "https://www.easalesltd.co.uk/images/showcase/showcase2.jpeg"
    ]
  },
  alternates: {
    canonical: "https://www.easalesltd.co.uk/about"
  },
  other: {
    'geo.region': 'GB-ENG',
    'geo.placename': 'Ipswich, Suffolk',
    'geo.position': '52.2333;0.7167',
    'ICBM': '52.2333, 0.7167'
  }
}; 