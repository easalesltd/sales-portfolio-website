import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dave Langdon's Favourite Recipes | East Anglian Sales",
  description:
    "Baking recipes from Dave Langdon, greeting card agent — sourdough, mince pies & chocolate puds for customer gifts. East Anglia. East Anglian Sales Ltd.",
  openGraph: {
    title: "Dave Langdon's Favourite Recipes | East Anglian Sales",
    description:
      "Baking recipes from Dave Langdon, greeting card agent — sourdough, mince pies & chocolate puds for customer gifts. East Anglia. East Anglian Sales Ltd.",
    type: "website",
    locale: "en_GB",
    siteName: "East Anglian Sales LTD",
    url: "https://www.easalesltd.co.uk/recipes",
    images: [
      {
        url: "https://www.easalesltd.co.uk/images/recipes/20251125_083621.jpg",
        width: 1200,
        height: 630,
        alt: "Dave's Favourite Baking Recipes"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Dave Langdon's Favourite Recipes | East Anglian Sales",
    description:
      "Baking recipes from Dave Langdon, greeting card agent — sourdough, mince pies & chocolate puds for customer gifts. East Anglia. East Anglian Sales Ltd.",
    images: ["https://www.easalesltd.co.uk/images/recipes/20251125_083621.jpg"]
  },
  alternates: {
    canonical: "https://www.easalesltd.co.uk/recipes"
  }
};
