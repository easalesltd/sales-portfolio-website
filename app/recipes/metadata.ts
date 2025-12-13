import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dave's Recipes - Sourdough Bread & Orange Juice Pastry Mince Pies | East Anglian Sales",
  description: "Dave Langdon's famous recipes including Josceline Dimbleby inspired orange juice pastry mince pies with cream cheese and go-to sourdough bread. Perfect for sharing with customers across East Anglia.",
  keywords: [
    // Josceline Dimbleby Recipe Keywords
    "Josceline Dimbleby Orange Juice Pastry Mince Pies",
    "Josceline Dimbleby mince pies",
    "Josceline Dimbleby orange pastry",
    "Josceline Dimbleby recipe",
    "Orange Juice Pastry Mince Pies",
    "Orange juice pastry recipe",
    "Orange pastry mince pies",
    
    // Orange Mince Pies with Cream Cheese
    "Orange Mince Pies with Cream Cheese",
    "Orange mince pies cream cheese",
    "Cream cheese mince pies",
    "Orange cream cheese mince pies",
    "Mince pies with cream cheese filling",
    "Orange juice mince pies",
    "Citrus mince pies",
    
    // Recipe Variations
    "Orange juice pastry",
    "Orange pastry recipe",
    "Mince pies orange pastry",
    "Christmas mince pies orange",
    "Homemade orange mince pies",
    "Traditional orange mince pies",
    "Best orange mince pies",
    "Easy orange mince pies",
    
    // Sourdough Keywords
    "Dave Langdon sourdough",
    "Sourdough bread recipe",
    "Homemade sourdough",
    "Sourdough starter recipe",
    
    // General Recipe Keywords
    "Dave Langdon recipes",
    "East Anglian recipes",
    "Sales agent recipes",
    "Christmas baking recipes",
    "Homemade Christmas treats",
    "Traditional Christmas recipes"
  ].join(', '),
  openGraph: {
    title: "Dave's Kitchen - Josceline Dimbleby Orange Juice Pastry Mince Pies & Sourdough",
    description: "Discover Dave Langdon's famous orange juice pastry mince pies inspired by Josceline Dimbleby, featuring cream cheese surprise filling. Plus his go-to sourdough bread recipe.",
    type: "website",
    locale: "en_GB",
    siteName: "East Anglian Sales LTD",
    images: [
      {
        url: "/images/recipes/20251208_205320.jpg",
        width: 800,
        height: 600,
        alt: "Dave Langdon's Orange Juice Pastry Mince Pies with Cream Cheese"
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: "Dave's Kitchen - Orange Juice Pastry Mince Pies & Sourdough Recipes",
    description: "Josceline Dimbleby inspired orange juice pastry mince pies with cream cheese surprise, plus sourdough bread recipe from East Anglian sales agent Dave Langdon.",
  },
  alternates: {
    canonical: "https://www.easalesltd.co.uk/recipes"
  },
  robots: {
    index: true,
    follow: true
  }
};