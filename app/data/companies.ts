export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  /** Optional: logo tuned for dark company page (often black on transparent; CSS inverts to white on black). Homepage/grids keep using logoUrl. */
  logoUrlDark?: string;
  catalogueUrl: string;
  websiteUrl: string;
  videos?: string[]; // Array of video URLs for Trade Show Videos
  brandLogos?: string[]; // Array of brand logo URLs
}

export const companies: Company[] = [
  {
    id: "boxer-gifts",
    name: "Boxer Gifts",
    slug: "boxer-gifts",
    description: "Welcome to the fun club! Here at Boxer Gifts, we are designers, innovators, manufacturers, and suppliers of unique, fun and quality wholesale gift items.",
    logoUrl: "/images/logos/boxer-gifts-placeholder.png.png",
    catalogueUrl: "https://drive.google.com/drive/folders/1YOuSwkFPAEHKGuj07oqmnr3MdR0Sv0i6?usp=drive_link",
    websiteUrl: "https://www.boxergifts.com"
  },
  {
    id: "david-fischhoff",
    name: "David Fischhoff",
    slug: "david-fischhoff",
    description: "We are a family owned wholesale and import business specialising in artificial flowers, grave ornaments & memorial ornaments specialists.",
    logoUrl: "/images/companies/david-fischhoff/logo-transparent.png",
    catalogueUrl: "https://drive.google.com/drive/folders/1MdQ96ZWv9rW2Ms3AqvYkrcx5WSJCaazW?usp=drive_link",
    websiteUrl: "https://www.davidfischhoff.co.uk"
  },
  {
    id: "emotional-rescue",
    name: "Emotional Rescue",
    slug: "emotional-rescue",
    description: "Creators of unique and innovative greeting cards, bringing emotion and creativity to every occasion.",
    logoUrl: "/images/companies/emotional-rescue/Screenshot 2025-05-16 at 17.22.49.png",
    catalogueUrl: "https://drive.google.com/drive/folders/1UANnjMXxYW3x8NLDsgcHARVrMsiUxmYa?usp=drive_link",
    websiteUrl: "https://www.emotional-rescue.co.uk"
  },
  {
    id: "global-journey-gifts",
    name: "Global Journey Gifts",
    slug: "global-journey-gifts",
    description: "Our unique and original gift ranges are supplied on customised displays with vibrant Point of Sale, in order to showcase the product and maximise sales. We also supply high-quality coin dispenser machines and interactive retail solutions for tourist attractions, museums, and visitor centres.",
    logoUrl: "/images/logos/global-journey-placeholder.png",
    catalogueUrl: "https://drive.google.com/drive/folders/1XkXfbTrgIbJmswkiwPMwkGnMNOG4g6C-?usp=drive_link",
    websiteUrl: "https://www.globaljourney.com"
  },
  {
    id: "mint-publishing",
    name: "Mint Publishing",
    slug: "mint-publishing",
    description: "M!NT is your fully refreshed and refreshingly different publisher of (mostly funny) birthday, blank and captioned greetings cards. We are proud to supply the official Katie Abey Greeting Cards range.",
    logoUrl: "/images/logos/MINT-PUBLISHING-placeholder.png",
    catalogueUrl: "https://drive.google.com/drive/folders/1oUU_899INjpAiD-gu9Zf2Vo9AEjLe-2y?usp=drive_link",
    websiteUrl: "https://www.mintpublishing.co.uk",
    videos: ["/videos/companies/mint-publishing/trade show.mov"],
    brandLogos: [
      "/images/logos/MINT-PUBLISHING-placeholder.png"
    ]
  },
  {
    id: "museums-and-galleries",
    name: "Museums and Galleries",
    slug: "museums-and-galleries",
    description: "Home of the finest arts brands. We are the UK's leading publisher of licensed art and design-led greetings cards and gift stationery. And in 2026, we're delighted to welcome Angela Harding, Peter Rabbit and Henry Fraser to our greeting card ranges.",
    logoUrl: "/images/logos/museums-galleries-placeholder.png",
    catalogueUrl: "https://drive.google.com/drive/folders/13GUXPjjXh3uMshpbwZCOGBL7B2pIZ-AJ?usp=drive_link",
    websiteUrl: "https://www.museums.co.uk",
    videos: ["/videos/companies/museums-and-galleries/trade-show.mov"],
    brandLogos: [
      "/images/logos/museums-galleries-placeholder.png"
    ]
  },
  {
    id: "ohh-deer",
    name: "Ohh Deer",
    slug: "ohh-deer",
    description: "Ohh Deer is a UK-based company founded in 2011 by Jamie Mitchell and Mark Callaby, known for its playful, artistic, and inclusive greeting cards, stationery, and gifts. We are proud to supply the official Cath Kidston greeting cards and stationery range, featuring their iconic floral and vintage-inspired designs, as well as the beautiful Laura Ashley collection of greeting cards, gift bags, and wrapping paper.",
    logoUrl: "/images/logos/ohh-deer-placeholder.png",
    catalogueUrl: "https://drive.google.com/drive/folders/1FWnmKaHf8tmhV-RSeZYaSfx3fG0aDuk6?usp=drive_link",
    websiteUrl: "https://wholesale.ohhdeer.com",
    videos: ["/videos/companies/ohh-deer/trade show.mp4"],
    brandLogos: [
      "/images/logos/ohh-deer-placeholder.png"
    ]
  },
  {
    id: "paper-salad",
    name: "Paper Salad",
    slug: "paper-salad",
    description: "The home of neon bright greeting cards & stationery! Our designs are painted by hand and creatively pieced together to create quirky cards at our Cheshire studio, all printed by specialist UK printers.",
    logoUrl: "/images/logos/paper-salad-placeholder.png",
    catalogueUrl: "https://drive.google.com/drive/folders/1vd-GDkbzhaByJoC9FOy1UEgDhcZ3-TR4?usp=drive_link",
    websiteUrl: "https://www.papersalad.co.uk",
    videos: ["/videos/companies/paper-salad/trade show.mp4"],
    brandLogos: [
      "/images/logos/paper-salad-placeholder.png"
    ]
  },
  {
    id: "peppermint-grove",
    name: "Peppermint Grove",
    slug: "peppermint-grove",
    description: "Peppermint Grove offers luxurious home fragrance and bath & body care, handmade in Australia and beautifully presented in custom-designed glassware.",
    logoUrl: "/images/logos/peppermint-grove-placeholder.png",
    catalogueUrl: "https://drive.google.com/drive/folders/1QIbWuPgEMmHjMae7XnFlMvwX_Y_NSfJX?usp=drive_link",
    websiteUrl: "https://peppermintgroveaustralia.com"
  },
  {
    id: "real-and-exciting-designs",
    name: "Real and Exciting Designs",
    slug: "real-and-exciting-designs",
    description: "Real and Exciting Designs produces a trendy and sophisticated range of Everyday and Christmas Greetings Cards, as well as fabulous Foiled Gift wrap and Notebooks.",
    logoUrl: "/images/logos/real-&-exciting-logo.png",
    catalogueUrl: "https://drive.google.com/file/d/1c3gVLBxXfuqV5i0fYdjRgvyCYYYFO4_x/view?usp=drive_link",
    websiteUrl: ""
  },
  {
    id: "star-editions",
    name: "Star Editions",
    slug: "star-editions",
    description: "Star Editions Ltd specializes in bespoke merchandise and custom branding, with all products finished in the UK for exceptional quality. We are proud to supply the official Richard Briggs and Dave Thompson greeting cards and gifts ranges, featuring their unique and humorous designs. We offer a rapid 5-day turnaround on all orders, transforming your designs into premium greeting cards, art prints, giftware, and stationery. Our UK-based finishing ensures the highest standards while maintaining quick delivery times.",
    logoUrl: "/images/logos/star-editions-placeholder.png",
    catalogueUrl: "https://drive.google.com/drive/folders/1JpQGmvHZWN6WaZkmHax8Qk0Jou_7dyK7?usp=drive_link",
    websiteUrl: "https://www.stareditions.com"
  },
  {
    id: "cgb-giftware",
    name: "CGB Giftware",
    slug: "cgb-giftware",
    description: "CGB Giftware (Container Group) specializes in beautiful, high-quality giftware and bespoke gift solutions. From artisan glass collections to enchanted emporium ranges, we offer unique and distinctive gifts that delight customers and drive retail success.",
    logoUrl: "/images/logos/cgb-giftware.png",
    catalogueUrl: "https://drive.google.com/drive/folders/1zT5aoUgVQ3408BZl8GaRVt6iFkLNOB5U?usp=drive_link",
    websiteUrl: "https://www.cgbgiftware.co.uk"
  },
  {
    id: "cambridge-confectionery-company",
    name: "The Cambridge Confectionery Company",
    slug: "cambridge-confectionery-company",
    description: "Chocolate, made to be seen. Family-owned and proudly independent, we create generously topped bars, beautifully boxed gift collections and signature giant buttons, finished by hand so every piece looks as good as it tastes.",
    logoUrl: "/images/logos/cambridge-confectionery-company.png",
    logoUrlDark: "/images/logos/The-Cambridge-Confectionary-Company.png",
    catalogueUrl: "https://drive.google.com/drive/folders/1nWAKl870bAJTOQo_Sn-qNSje4RmbRiwy?usp=drive_link",
    websiteUrl: ""
  }
].sort((a, b) => {
  // Alphabetical order, ignoring a leading "The" (e.g. "The Cambridge..." under "C").
  const normalize = (name: string) => name.replace(/^\s*the\s+/i, "").trim().toLowerCase();
  const an = normalize(a.name);
  const bn = normalize(b.name);
  const cmp = an.localeCompare(bn);
  return cmp !== 0 ? cmp : a.name.localeCompare(b.name);
});  