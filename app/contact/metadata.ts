import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact East Anglian Sales LTD | Request a Visit from Your Local Agent",
  description: "Get in touch with Dave Langdon, your local wholesale agent in East Anglia. Request a visit, discuss trade prices, or place an order for greeting cards, gifts, and display solutions across Suffolk, Norfolk, Essex, and Cambridgeshire.",
  keywords: [
    "contact East Anglian Sales",
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
    title: "Contact East Anglian Sales LTD | Request a Visit from Your Local Agent",
    description: "Get in touch with Dave Langdon, your local wholesale agent in East Anglia. Request a visit, discuss trade prices, or place an order for greeting cards, gifts, and display solutions across Suffolk, Norfolk, Essex, and Cambridgeshire.",
    type: "website",
    locale: "en_GB",
    siteName: "East Anglian Sales LTD"
  },
  // Add Google Business Profile verification
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION_CODE || '',
  },
}; 