/**
 * Blog / Press (magazine and trade press) articles by Dave Langdon.
 *
 * Add an entry to `magazineArticles` for each piece. The site builds
 * `/blog` (index) and `/blog/[slug]` (article pages) from this list.
 */
export interface MagazineArticle {
  slug: string;
  title: string;
  excerpt: string;
  /** Full document title; used with `absolute` so the root title template is not applied */
  metaTitle?: string;
  /** meta description + OG/Twitter; ~150–160 chars, key terms for search */
  metaDescription?: string;
  /** ISO date YYYY-MM-DD */
  publishedAt: string;
  /** e.g. magazine or supplement name */
  publication?: string;
  /** Optional hero image under /public */
  coverImage?: string;
  /** Link to original web piece or publisher */
  sourceUrl?: string;
  /** Body copy — each string is one paragraph */
  paragraphs: string[];
}

/** Display titles: `Publication, Issue — Piece name | Dave Langdon` */
const magazineArticlesUnsorted: MagazineArticle[] = [
  {
    slug: 'progressive-greetings-winnie-the-pooh-february-2026',
    title: 'Progressive Greetings, February 2026 — Winnie the Pooh agent feature | Dave Langdon',
    metaTitle:
      'Winnie the Pooh & greeting card agents — Progressive Greetings Feb 2026 | Dave Langdon, East Anglia',
    metaDescription:
      'Dave Langdon in Progressive Greetings — Winnie the Pooh, wholesale greeting card agents & the trade. East Anglia sales rep, East Anglian Sales Ltd.',
    excerpt:
      'Feature in Progressive Greetings (Max Publishing) — Winnie the Pooh, agents, and the wholesale greeting card trade.',
    publishedAt: '2026-01-23',
    publication: 'Progressive Greetings (February 2026)',
    coverImage: encodeURI(
      '/images/blog/Progresive Greetings Febuary 2026 - Winnie The Pooh Agent Feature.png'
    ),
    sourceUrl:
      'https://issuu.com/maxpublishing/docs/progressive_greetings_february_2026',
    paragraphs: [
      'This piece appears in the February 2026 issue of Progressive Greetings from Max Publishing — spotlighting Winnie the Pooh and life as an agent in the trade.',
    ],
  },
  {
    slug: 'diary-sales-agent-january-february-2026',
    title: 'Greetings Today, January/February 2026 — Diary of a Sales Agent | Dave Langdon',
    metaTitle:
      'Diary of a Sales Agent — Greetings Today Jan/Feb 2026 | Dave Langdon, East Anglia',
    metaDescription:
      'Dave Langdon’s Greetings Today diary — wholesale greeting cards & giftware, life on the road across Suffolk, Norfolk, Essex & Cambridgeshire.',
    excerpt:
      'Greetings Today column — diary from the road, wholesale greeting cards and giftware across East Anglia.',
    publishedAt: '2026-01-22',
    publication: 'Greetings Today (January/February 2026)',
    coverImage: encodeURI(
      '/images/blog/Greetings Today January:Febuary 2026 Diary of a Sales Agent Dave Langdon.png'
    ),
    sourceUrl:
      'https://issuu.com/lemapublisihng/docs/greetings_today_january_february_2026',
    paragraphs: [
      'This instalment of Diary of a Sales Agent appears in the January/February 2026 issue of Greetings Today from Lema Publishing.',
    ],
  },
  {
    slug: 'diary-sales-agent-september-october-2025',
    title: 'Greetings Today, September/October 2025 — Diary of a Sales Agent | Dave Langdon',
    metaTitle:
      'Diary of a Sales Agent — Greetings Today Sep/Oct 2025 | Dave Langdon, East Anglia',
    metaDescription:
      'Greetings Today column by Dave Langdon — retail visits, wholesale cards & gifts, East Anglia greeting card agent. East Anglian Sales Ltd.',
    excerpt:
      'Greetings Today column — diary from the road, retailers, and wholesale cards & gift across East Anglia.',
    publishedAt: '2025-08-27',
    publication: 'Greetings Today (September/October 2025)',
    coverImage: encodeURI(
      '/images/blog/Greetings Today September:October 2025  Diary of a Sales Agent Dave Langdon.png'
    ),
    sourceUrl:
      'https://issuu.com/lemapublisihng/docs/greetings_today_september_october_2025',
    paragraphs: [
      'This instalment of Diary of a Sales Agent appears in the September/October 2025 issue of Greetings Today from Lema Publishing.',
    ],
  },
  {
    slug: 'diary-sales-agent-march-april-2026',
    title: 'Greetings Today, March/April 2026 — Diary of a Sales Agent | Dave Langdon',
    metaTitle:
      'Diary of a Sales Agent — Greetings Today March/April 2026 | Dave Langdon, East Anglia',
    metaDescription:
      'Dave Langdon’s Diary of a Sales Agent in Greetings Today — wholesale greeting cards, retailers & trade life across East Anglia. East Anglian Sales Ltd.',
    excerpt:
      'My latest column for Greetings Today — life on the road, retailers, and the wholesale greeting card trade in East Anglia.',
    publishedAt: '2026-03-30',
    publication: 'Greetings Today (March/April 2026)',
    coverImage: encodeURI(
      '/images/blog/Greetings Today March:April 2026  Diary of a Sales Agent Dave Langdon.png'
    ),
    sourceUrl:
      'https://issuu.com/lemapublisihng/docs/greetings_today_march_april_2026',
    paragraphs: [
      'This instalment of Diary of a Sales Agent appears in the March/April 2026 issue of Greetings Today from Lema Publishing — a look at the day-to-day of representing greeting card and giftware brands across East Anglia.',
    ],
  },
];

export const magazineArticles: MagazineArticle[] = [...magazineArticlesUnsorted].sort(
  (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
);

export function getAllMagazineArticles(): MagazineArticle[] {
  return magazineArticles;
}

export function getMagazineArticleBySlug(slug: string): MagazineArticle | undefined {
  return magazineArticles.find((a) => a.slug === slug);
}

export function getAllMagazineArticleSlugs(): string[] {
  return magazineArticles.map((a) => a.slug);
}
