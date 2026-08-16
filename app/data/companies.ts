export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  /** Optional: black-on-transparent asset; shown inverted on black (company page + homepage grid when set). */
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
    logoUrl: "/images/logos/boxer-gifts.png",
    catalogueUrl: "https://drive.google.com/drive/folders/1NHeoQnTz2rtiGUjHJscqG53-erEaT1EM?usp=sharing",
    websiteUrl: "https://www.boxergifts.com"
  },
  {
    id: "david-fischhoff",
    name: "David Fischhoff",
    slug: "david-fischhoff",
    description: "We are a family owned wholesale and import business specialising in artificial flowers, grave ornaments & memorial ornaments specialists.",
    logoUrl: "/images/logos/david-fischhoff.png",
    catalogueUrl: "https://drive.google.com/drive/folders/1286x38eZGahw2tET8ueZ7y56frI5uog2?usp=drive_link",
    websiteUrl: "https://www.davidfischhoff.co.uk"
  },
  {
    id: "emotional-rescue",
    name: "Emotional Rescue",
    slug: "emotional-rescue",
    description: "Creators of unique and innovative greeting cards, bringing emotion and creativity to every occasion.",
    logoUrl: "/images/logos/emotional-rescue.png",
    catalogueUrl: "https://drive.google.com/drive/folders/1rObjRfP-H7HqfaVZtc1cP0t_FUkr1EB-?usp=drive_link",
    websiteUrl: "https://www.emotional-rescue.com"
  },
  {
    id: "global-journey-gifts",
    name: "Global Journey Gifts",
    slug: "global-journey-gifts",
    description: "Our unique and original gift ranges are supplied on customised displays with vibrant Point of Sale, in order to showcase the product and maximise sales. We also supply high-quality coin dispenser machines and interactive retail solutions for tourist attractions, museums, and visitor centres.",
    logoUrl: "/images/logos/global-journey.png",
    catalogueUrl: "https://drive.google.com/drive/folders/1NSdH5hnpczlDwv9z1DyhE9p9-XXLsmSX?usp=drive_link",
    websiteUrl: "https://globaljourney.co.uk"
  },
  {
    id: "mint-publishing",
    name: "Mint Publishing",
    slug: "mint-publishing",
    description: "M!NT is your fully refreshed and refreshingly different publisher of (mostly funny) birthday, blank and captioned greetings cards. We are proud to supply the official Katie Abey Greeting Cards range.",
    logoUrl: "/images/logos/mint-publishing.png",
    catalogueUrl: "https://drive.google.com/drive/folders/1nCipeZFu9PpqIMJoHcYbUXqdvvFcYrNd?usp=drive_link",
    websiteUrl: "https://mint-publishing.co.uk",
    videos: ["/videos/companies/mint-publishing/trade show.mp4"],
    brandLogos: [
      "/images/logos/mint-publishing.png"
    ]
  },
  {
    id: "museums-and-galleries",
    name: "Museums and Galleries",
    slug: "museums-and-galleries",
    description: "Home of the finest arts brands. We are the UK's leading publisher of licensed art and design-led greetings cards and gift stationery. And in 2026, we're delighted to welcome Angela Harding, Peter Rabbit and Henry Fraser to our greeting card ranges.",
    logoUrl: "/images/logos/museums-and-galleries.png",
    catalogueUrl: "https://drive.google.com/drive/folders/14VzcZeRwdH5RTVK5JDyovfrMr7YSdT0D?usp=drive_link",
    websiteUrl: "https://museumsgalleries.co.uk",
    videos: ["/videos/companies/museums-and-galleries/trade-show.mp4"],
    brandLogos: [
      "/images/logos/museums-and-galleries.png"
    ]
  },
  {
    id: "ohh-deer",
    name: "Ohh Deer",
    slug: "ohh-deer",
    description: "Ohh Deer is a UK-based company founded in 2011 by Jamie Mitchell and Mark Callaby, known for its playful, artistic, and inclusive greeting cards, stationery, and gifts. We are proud to supply the official Cath Kidston greeting cards and stationery range, featuring their iconic floral and vintage-inspired designs, as well as the beautiful Laura Ashley collection of greeting cards, gift bags, and wrapping paper.",
    logoUrl: "/images/logos/ohh-deer.png",
    catalogueUrl: "https://drive.google.com/drive/folders/1bxt-iirM_JX6JKZkjOhvK_s6boa89SSg?usp=drive_link",
    websiteUrl: "https://ohhdeerwholesale.com",
    videos: ["/videos/companies/ohh-deer/trade show.mp4"],
    brandLogos: [
      "/images/logos/ohh-deer.png"
    ]
  },
  {
    id: "paper-salad",
    name: "Paper Salad",
    slug: "paper-salad",
    description: "The home of neon bright greeting cards & stationery! Our designs are painted by hand and creatively pieced together to create quirky cards at our Cheshire studio, all printed by specialist UK printers.",
    logoUrl: "/images/logos/paper-salad.png",
    catalogueUrl: "https://drive.google.com/drive/folders/1x1-87N__h5257lsUjeHaYSOc9CjvId89?usp=drive_link",
    websiteUrl: "https://www.papersalad.com",
    videos: ["/videos/companies/paper-salad/trade show.mp4"],
    brandLogos: [
      "/images/logos/paper-salad.png"
    ]
  },
  {
    id: "peppermint-grove",
    name: "Peppermint Grove",
    slug: "peppermint-grove",
    description: "Peppermint Grove offers luxurious home fragrance and bath & body care, handmade in Australia and beautifully presented in custom-designed glassware.",
    logoUrl: "/images/logos/peppermint-grove.png",
    catalogueUrl: "https://drive.google.com/drive/folders/1M80gJ4gK6y4ywlNR3SoaKGV0mWq6S_6P?usp=drive_link",
    websiteUrl: "https://peppermintgrovefragrances.com"
  },
  {
    id: "rudi-and-bear",
    name: "Rudi & Bear",
    slug: "rudi-and-bear",
    description: "Ned has been bringing smiles to little adventurers since 2017. Hand-painted in Cornwall and packed plastic-free in a signature gift box, Rudi & Bear makes collectable Neds for independent toy shops, gift shops, garden centres, museums and visitor attractions — including bespoke collabs for local landmarks, brand colours and themed collections.",
    logoUrl: "/images/logos/rudi-and-bear.png",
    catalogueUrl: "https://cdn.shopify.com/s/files/1/1002/8980/6719/files/RudiandBear.pdf?v=1785927953",
    websiteUrl: "https://rudiandbear.co.uk/pages/wholesale"
  },
  {
    id: "star-editions",
    name: "Star Editions",
    slug: "star-editions",
    description: "Star Editions supplies bespoke merchandise, licensed greeting cards and giftware — including Richard Briggs and Dave Thompson ranges — finished in the UK for East Anglia retailers.",
    logoUrl: "/images/logos/star-editions.png",
    catalogueUrl: "https://drive.google.com/drive/folders/1KoXselEgD5deBx2ml8OT1DfkqqtQD0IS?usp=drive_link",
    websiteUrl: "https://www.stareditions.com"
  },
  {
    id: "cgb-giftware",
    name: "CGB Giftware",
    slug: "cgb-giftware",
    description: "CGB Giftware (Container Group) specializes in beautiful, high-quality giftware and bespoke gift solutions. From artisan glass collections to enchanted emporium ranges, we offer unique and distinctive gifts that delight customers and drive retail success.",
    logoUrl: "/images/logos/cgb-giftware.png",
    catalogueUrl: "https://drive.google.com/drive/folders/1D5SEfDoKgNXxGfmgscPGLmbF_L3RJx3j?usp=sharing",
    websiteUrl: "https://www.cgbgiftware.co.uk"
  },
  {
    id: "cambridge-confectionery-company",
    name: "The Cambridge Confectionery Company",
    slug: "cambridge-confectionery-company",
    description: "Chocolate, made to be seen. Family-owned and proudly independent, we create generously topped bars, beautifully boxed gift collections and signature giant buttons, finished by hand so every piece looks as good as it tastes.",
    logoUrl: "/images/logos/cambridge-confectionery-company.png",
    logoUrlDark: "/images/logos/cambridge-confectionery-company.png",
    catalogueUrl: "https://drive.google.com/drive/folders/1oTm-lvfd8tpfux5Vxqmd3M1PTNTX8YDl?usp=drive_link",
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