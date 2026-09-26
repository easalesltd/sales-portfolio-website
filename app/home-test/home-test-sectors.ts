export type HomeTestSlide = {
  id: string;
  statement: string;
  ink: 'light' | 'dark';
  href: string;
  hero: {
    src: string;
    alt: string;
  };
};

export type HomeTestSector = {
  id: string;
  title: string;
  headline?: string;
  slides: HomeTestSlide[];
};

export const HOME_TEST_SECTORS: HomeTestSector[] = [
  {
    id: 'greeting-cards',
    title: 'Greeting cards',
    slides: [
      {
        id: 'paper-salad',
        statement: 'Paper Salad.',
        ink: 'light',
        href: '/companies/paper-salad',
        hero: {
          src: '/images/showcase/paper-salad-mothers-day-amazing-mum.jpg',
          alt: 'Paper Salad Mother’s Day greeting cards',
        },
      },
      {
        id: 'museums-and-galleries-cards',
        statement: 'Museums & Galleries.',
        ink: 'dark',
        href: '/companies/museums-and-galleries',
        hero: {
          src: '/images/companies/museums-and-galleries/official/range-cards.jpg',
          alt: 'Museums and Galleries licensed art greeting cards',
        },
      },
      {
        id: 'mint',
        statement: 'Mint.',
        ink: 'dark',
        href: '/companies/mint-publishing',
        hero: {
          src: '/images/companies/mint-publishing/official/banner-1-1-25.jpg',
          alt: 'Mint Publishing Katie Abey humorous greeting cards',
        },
      },
      {
        id: 'ohh-deer',
        statement: 'Ohh Deer.',
        ink: 'dark',
        href: '/companies/ohh-deer',
        hero: {
          src: '/images/companies/ohh-deer/official/social-hero.jpg',
          alt: 'Ohh Deer illustrated greeting cards',
        },
      },
    ],
  },
  {
    id: 'gifts',
    title: 'Gifts',
    slides: [
      {
        id: 'museums-and-galleries-gifts',
        statement: 'Museums & Galleries.',
        ink: 'dark',
        href: '/companies/museums-and-galleries',
        hero: {
          src: '/images/companies/museums-and-galleries/official/range-gift.jpg',
          alt: 'Museums and Galleries licensed giftware',
        },
      },
      {
        id: 'mint-gifts',
        statement: 'Mint.',
        ink: 'dark',
        href: '/companies/mint-publishing',
        hero: {
          src: '/images/companies/mint-publishing/official/giftware-spread.jpg',
          alt: 'Mint Publishing notebooks, bookmarks and giftware',
        },
      },
      {
        id: 'ohh-deer-gifts',
        statement: 'Ohh Deer.',
        ink: 'dark',
        href: '/companies/ohh-deer',
        hero: {
          src: '/images/companies/ohh-deer/official/acrylic-keyrings.jpg',
          alt: 'Ohh Deer acrylic keyrings',
        },
      },
      {
        id: 'cgb-giftware',
        statement: 'CGB Giftware.',
        ink: 'dark',
        href: '/companies/cgb-giftware',
        hero: {
          src: '/images/companies/CGB-Giftware/ArtisanGlass-01.jpg',
          alt: 'CGB Giftware artisan glass',
        },
      },
      {
        id: 'funky-monkey',
        statement: 'Funky Monkey.',
        ink: 'light',
        href: '/companies/funky-monkey-gifts',
        hero: {
          src: '/images/companies/funky-monkey-gifts/official/homepage-hero.png',
          alt: 'Funky Monkey Gifts Welcome to the Madhouse sign',
        },
      },
      {
        id: 'global-journey',
        statement: 'Global Journey.',
        ink: 'dark',
        href: '/companies/global-journey-gifts',
        hero: {
          src: '/images/companies/global-journey/official/christmas-pets.jpg',
          alt: 'Global Journey pet Christmas decorations',
        },
      },
    ],
  },
  {
    id: 'bags-and-wrap',
    title: 'Bags and wrap',
    slides: [
      {
        id: 'museums-and-galleries-wrap',
        statement: 'Museums & Galleries.',
        ink: 'light',
        href: '/companies/museums-and-galleries',
        hero: {
          src: '/images/companies/museums-and-galleries/official/gift-packaging.jpg',
          alt: 'Museums and Galleries gift wrap and wrapped presents',
        },
      },
      {
        id: 'mint-wrap',
        statement: 'Mint.',
        ink: 'dark',
        href: '/companies/mint-publishing',
        hero: {
          src: '/images/companies/mint-publishing/official/giftware-bags.jpg',
          alt: 'Mint Publishing gift bags, notebooks and tags',
        },
      },
      {
        id: 'ohh-deer-wrap',
        statement: 'Ohh Deer.',
        ink: 'dark',
        href: '/companies/ohh-deer',
        hero: {
          src: '/images/companies/ohh-deer/official/gift-bags.jpg',
          alt: 'Ohh Deer gift bags',
        },
      },
    ],
  },
  {
    id: 'stationery',
    title: 'Stationery',
    slides: [
      {
        id: 'museums-and-galleries-stationery',
        statement: 'Museums & Galleries.',
        ink: 'dark',
        href: '/companies/museums-and-galleries',
        hero: {
          src: '/images/companies/museums-and-galleries/official/range-stationery.jpg',
          alt: 'Museums and Galleries licensed notebooks and stationery',
        },
      },
      {
        id: 'mint-stationery',
        statement: 'Mint.',
        ink: 'dark',
        href: '/companies/mint-publishing',
        hero: {
          src: '/images/companies/mint-publishing/official/banner-1-1-27.jpg',
          alt: 'Mint Publishing stationery and notebooks',
        },
      },
      {
        id: 'ohh-deer-stationery',
        statement: 'Ohh Deer.',
        ink: 'dark',
        href: '/companies/ohh-deer',
        hero: {
          src: '/images/companies/ohh-deer/official/tiny-notebooks-lifestyle.jpg',
          alt: 'Ohh Deer tiny notebooks',
        },
      },
    ],
  },
  {
    id: 'candles-and-diffusers',
    title: 'Candles and diffusers',
    slides: [
      {
        id: 'peppermint-grove',
        statement: 'Peppermint Grove.',
        ink: 'dark',
        href: '/companies/peppermint-grove',
        hero: {
          src: '/images/companies/peppermint-grove/official/velvet-cake-lifestyle.jpg',
          alt: 'Peppermint Grove candle and diffuser styled on a wooden table',
        },
      },
      {
        id: 'moss-st',
        statement: 'Moss St.',
        ink: 'dark',
        href: '/companies/peppermint-grove',
        hero: {
          src: '/images/companies/peppermint-grove/official/moss-st-mantel.jpg',
          alt: 'Moss St candle and diffuser on a marble mantel',
        },
      },
    ],
  },
  {
    id: 'confectionery',
    title: 'Confectionery',
    headline: 'The Cambridge Confectionery Company.',
    slides: [
      {
        id: 'buttons',
        statement: 'Buttons.',
        ink: 'dark',
        href: '/companies/cambridge-confectionery-company',
        hero: {
          src: '/images/companies/the-cambridge-confectionery-company/official/buttons.png',
          alt: 'Cambridge Confectionery giant chocolate buttons',
        },
      },
    ],
  },
];

export const HOME_TEST_SLIDES = HOME_TEST_SECTORS.flatMap((sector) =>
  sector.slides.map((slide) => ({
    ...slide,
    sectorId: sector.id,
    sectorTitle: sector.title,
    headline: sector.headline ?? slide.statement,
  })),
);

export function firstSlideIndexForSector(sectorIndex: number): number {
  let index = 0;
  for (let i = 0; i < sectorIndex; i += 1) {
    index += HOME_TEST_SECTORS[i]?.slides.length ?? 0;
  }
  return index;
}

export function sectorIndexForSlide(slideIndex: number): number {
  let passed = 0;
  for (let i = 0; i < HOME_TEST_SECTORS.length; i += 1) {
    passed += HOME_TEST_SECTORS[i].slides.length;
    if (slideIndex < passed) return i;
  }
  return HOME_TEST_SECTORS.length - 1;
}
