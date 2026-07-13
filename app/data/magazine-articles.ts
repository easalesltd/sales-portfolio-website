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
  /** Pull quotes from the published piece (shown as blockquotes) */
  quotes?: string[];
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
      'Winnie the Pooh takes the spotlight — Dave on agents, nostalgia, and why classic characters still matter in the wholesale trade.',
    publishedAt: '2026-01-23',
    publication: 'Progressive Greetings (February 2026)',
    coverImage: encodeURI(
      '/images/blog/Progresive Greetings Febuary 2026 - Winnie The Pooh Agent Feature.png'
    ),
    sourceUrl:
      'https://issuu.com/maxpublishing/docs/progressive_greetings_february_2026',
    quotes: [
      "Don't be ridiculous, there's no need to be an Eeyore in the East!",
      'As far as I can tell we had a stupendous sell-through of Christmas cards and all of my greeting card agencies were a credit to my principals and customers.',
      'Both are super exciting for me as I was already such a fan of their work!',
    ],
    paragraphs: [
      'This piece appears in the February 2026 issue of Progressive Greetings from Max Publishing — a Winnie the Pooh-themed “Pooh Corners” feature where agents across the UK share a year-in-review in Hundred Acre Wood style.',
      'Dave Langdon’s East Anglia corner covers Museums & Galleries, Paper Salad, Ohh Deer and Mint on the young card and gift side, plus Star Editions, Peppermint Grove, Boxer Gifts, Global Journey, WPL Gifts (now widdop) and David Fischhoff.',
      'Asked whether 2025 was a year full of honey, Dave pushes back on doom talk for the category: Christmas card sell-through was strong, and he credits principals and customers for the result.',
      'Looking ahead he flags two standouts: Angela Harding joining Museums & Galleries on greeting cards, and Ohh Deer working with Meg Fatherly — both ranges he was already a fan of before they landed in the agency.',
      'On the inevitable “which Pooh character are you?” question, Dave lands closest to Pooh — “a heart of gold and always happy to help” — with a wry nod to being food-obsessed and a little impulsive at times.',
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
      'New year on the road: diary scraps from wholesale card and gift visits across Suffolk, Norfolk, Essex, and Cambridgeshire.',
    publishedAt: '2026-01-22',
    publication: 'Greetings Today (January/February 2026)',
    coverImage: encodeURI(
      '/images/blog/Greetings Today January:Febuary 2026 Diary of a Sales Agent Dave Langdon.png'
    ),
    sourceUrl:
      'https://issuu.com/lemapublisihng/docs/greetings_today_january_february_2026',
    quotes: [
      'Dave Langdon on why Christmas cards are still king, as he reports back on festive sales, and looks ahead to this year’s standout ranges, and of course, the trade shows…',
      'The post-festive verdict from my conversations with customers has been just how well Christmas cards actually performed.',
      'Several retailers are already telling me they saw around 85% sell-through before the January sales even began.',
    ],
    paragraphs: [
      'This instalment of Diary of a Sales Agent appears in the January/February 2026 issue of Greetings Today from Lema Publishing.',
      'Dave reports from East Anglia after Christmas with a simple message for the trade: Christmas cards are still king. For a category that has been written off more times than he has parking fines, the feedback from retailers was genuinely encouraging.',
      'He was even asked by BBC Radio Cambridgeshire to talk about Christmas cards through the eyes of a salesperson — and fielded the inevitable “are Christmas card sales doomed?” line. His answer on air matched what he sees on the ground: that narrative simply does not align with sell-through in independent stores.',
      'Several customers reported around 85% sell-through before January sales began, with top-up orders running into the first week of December — momentum that still matters on the high street when wallets are under pressure.',
      'Looking to 2026 he highlights new ranges landing in the agency: Angela Harding with Museums & Galleries, Meg Fatherly with Ohh Deer, and Alchemy Ages from Paper Salad — plus the usual round of trade shows, including Harrogate Christmas & Gift Fair.',
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
      'Autumn on the route — shop stories, ranges, and the everyday rhythm of a greeting card agent in East Anglia.',
    publishedAt: '2025-08-27',
    publication: 'Greetings Today (September/October 2025)',
    coverImage: encodeURI(
      '/images/blog/Greetings Today September:October 2025  Diary of a Sales Agent Dave Langdon.png'
    ),
    sourceUrl:
      'https://issuu.com/lemapublisihng/docs/greetings_today_september_october_2025',
    quotes: [
      'Dave Langdon at East Anglian Sales reports on a damp Home & Gift, and considers what makes a successful Christmas card range.',
      'The key to Christmas card success is to build your range around a strong chat box.',
      "It's well being an agent that does really offer strength across so it's important to target all potential customers walking through your doors.",
    ],
    paragraphs: [
      'This instalment of Diary of a Sales Agent appears in the September/October 2025 issue of Greetings Today from Lema Publishing.',
      'Writing after a damp Home & Gift, Dave looks ahead to Christmas ranges and what separates a good card wall from a great one: cover the funny and cool cards, contemporary art, blank cards, trendy AB and even small sizes — have you covered all bases?',
      'He is proud to work with Museums & Galleries’ large and very successful range year after year, with artist Angela Harding’s designs extending into gift bags, gift wrap and more. Paper Salad’s Christmas collection, he writes, is “the equivalent of adding a scoop of gold leaf to an already gorgeous greeting card ice cream.”',
      'Year highlights on the road include connecting a principal with a national account, surviving the M25 in paint-flecked workwear, and the everyday joy of building relationships — understanding what makes customers tick, and ordering it before the other shop in town claims exclusivity.',
      'His takeaway for retailers: never underestimate a strong Christmas card supplier, check you have covered newer lifestyle greeting card buyers, and — tongue firmly in cheek — try not to leave too much paint in your car boot.',
    ],
  },
  {
    slug: 'diary-sales-agent-march-april-2026',
    title: 'Greetings Today, March/April 2026 — Diary of a Sales Agent | Dave Langdon',
    metaTitle:
      'Diary of a Sales Agent — Greetings Today March/April 2026 | Dave Langdon, East Anglia',
    metaDescription:
      'Dave Langdon: Father’s Day, till point pickup lines and accountancy fails — Diary of a Sales Agent, Greetings Today March/April 2026. East Anglia wholesale greeting cards.',
    excerpt:
      'Dave talks Fathers Day, Till Point pickup lines and Accountancy fails',
    publishedAt: '2026-03-30',
    publication: 'Greetings Today (March/April 2026)',
    coverImage: encodeURI(
      '/images/blog/Greetings Today March:April 2026  Diary of a Sales Agent Dave Langdon.png'
    ),
    sourceUrl:
      'https://issuu.com/lemapublisihng/docs/greetings_today_march_april_2026',
    quotes: [
      "I'm convinced 10% of the world's computing power is currently dedicated to trying to explain depreciation to me. I still don't get it.",
      "I don't speak for all dads, but personally I'd much rather receive a laugh than a 'mushy' sentiment.",
      "As an agent representing multiple brands, it's a real treat to show off the products in person, in between scouting out who has the best snacks, the coldest drinks, or just a chair to collapse into after 4pm.",
    ],
    paragraphs: [
      'This instalment of Diary of a Sales Agent appears in the March/April 2026 issue of Greetings Today from Lema Publishing — a look at the day-to-day of representing greeting card and giftware brands across East Anglia.',
      'Dave opens with end-of-year accounts and the perennial shock of the tax bill, before declaring a seasonal wardrobe change from “Hot Mess Tax Season” to “Hot Girl Summer” in protest at the weather gods.',
      'Spring Fair remains a highlight: sprinting between Museums & Galleries, Mint, Paper Salad and Ohh Deer, comparing snacks between halls, and — after nine years — developing a strange condition called “see-the-same-people-every-year-and-assume-they-are-all-based-in-East-Anglia-itis.”',
      'As Q1 winds down he looks forward to funny Father’s Day cards (personally preferring a laugh to a mushy sentiment) and shares till-point pickup winners from the agency: Global Journey wooden animal keyrings, Mint “To Be Frank” keyrings, Ohh Deer motel keyrings and Silly Beans, plus Paper Salad gifting chocolate now in stock.',
      'Whether he has finally mastered bookkeeping or is still stuck in a hedge somewhere outside Basingstoke, he signs off hoping for a funny — and hopefully dry — Q2.',
    ],
  },
  {
    slug: 'diary-sales-agent-may-june-2026',
    title: 'Greetings Today, May/June 2026 — Diary of a Sales Agent | Dave Langdon',
    metaTitle:
      'Diary of a Sales Agent — Greetings Today May/June 2026 | Dave Langdon, East Anglia',
    metaDescription:
      'Dave Langdon’s Greetings Today column — a website video game, an Isle of Wight display install, and ranges from Ohh Deer, Star Editions, Paper Salad and Museums & Galleries.',
    excerpt:
      'A secret website game, a bespoke Ohh Deer spinner on the Isle of Wight, and why classic licences and teacher cards still sell.',
    publishedAt: '2026-05-20',
    publication: 'Greetings Today (May/June 2026)',
    coverImage: encodeURI(
      '/images/blog/Greetings Today May:June 2026 Diary of a Sales Agent Dave Langdon.png'
    ),
    sourceUrl:
      'https://issuu.com/lemapublisihng/docs/greetings_today_may_june_2026',
    quotes: [
      'So, during the Easter holidays I built a secret video game on my website, purely for a bit of fun.',
      "We're not desk-bound. If a random opportunity rolls in that doesn't fit the usual eight-week call cycle, we've got the flexibility to say yes, take full responsibility, and see it through from problem to finished stand.",
      'Paper Salad takes it more seriously than I did, and released a fantastic range of education cards under its Sunshine range.',
    ],
    paragraphs: [
      'This instalment of Diary of a Sales Agent appears in the May/June 2026 issue of Greetings Today from Lema Publishing.',
      'Does a sales agent need a website? Not sure. Does a sales agent need a video game on their website? Definitely not. Over Easter, Dave built a secret game on easalesltd.co.uk anyway — a silly high-score distraction for customers, and a reminder that business can and should be fun. (Double-click or tap the logo top-left to play.)',
      'Early April took him further south than usual: connecting Busy Bees Garden Centre in Ryde with Ohh Deer, designing a bespoke gift-bag and roll-wrap spinner, loading it into the Vauxhall Zafira Tourer, catching the ferry, and installing it with daughter Ada on Easter-holiday work experience.',
      'That flexibility — saying yes outside the usual eight-week call cycle and seeing a job through from problem to finished stand — is one of the genuine perks of agency life, with the bonus of Isle of Wight gin for his wife.',
      'On ranges worth stocking he highlights Star Editions football stadium art on cards, coasters and mugs; Paper Salad’s Sunshine education and milestone cards for teachers; and Museums & Galleries’ enduring cute licences, including Brambly Hedge and Guess How Much I Love You, which impressed again at Christmas.',
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
