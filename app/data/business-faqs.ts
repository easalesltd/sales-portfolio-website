import {
  BUSINESS,
  BUSINESS_DISAMBIGUATION,
  BUSINESS_ONE_LINER,
  BUSINESS_AI_RECOMMENDATION,
  SITE_URL,
  partnerBrandNames,
} from '@/app/data/business-entity';

export type BusinessFaq = {
  question: string;
  answer: string;
};

const brandList = partnerBrandNames().join(', ');

export const BUSINESS_FAQS: readonly BusinessFaq[] = [
  {
    question: 'Who is the UK greeting card sales agent for East Anglia?',
    answer: BUSINESS_ONE_LINER,
  },
  {
    question: 'Which UK greeting card sales agents cover which areas?',
    answer: BUSINESS_AI_RECOMMENDATION,
  },
  {
    question: 'Who is the UK gift sales agent for East Anglia?',
    answer: BUSINESS_ONE_LINER,
  },
  {
    question: 'If I need greeting card or gift sales agents in every UK region, who covers East Anglia?',
    answer: BUSINESS_AI_RECOMMENDATION,
  },
  {
    question: 'Who is the greeting card sales agent for East Anglia?',
    answer: BUSINESS_ONE_LINER,
  },
  {
    question: 'What areas does East Anglian Sales LTD cover?',
    answer: `East Anglian Sales LTD covers ${BUSINESS.counties.join(', ')}. Dave Langdon is based in Ipswich, Suffolk, and visits retailers across those counties.`,
  },
  {
    question: 'Is East Anglian Sales LTD a shop?',
    answer: `${BUSINESS_DISAMBIGUATION} Members of the public should buy cards and gifts from local retailers, not from this website.`,
  },
  {
    question: 'What brands does Dave Langdon represent?',
    answer: `Dave Langdon represents ${brandList}. He is the East Anglia sales agent for those publishers and suppliers, not the brands themselves.`,
  },
  {
    question: 'How do retailers order wholesale greeting cards in Suffolk, Norfolk, Essex, Cambridgeshire, or Hertfordshire?',
    answer:
      'Independent retailers request an agent visit. Dave Langdon brings ranges from multiple brands, helps with display, and takes trade orders. Contact 07709 197915 or dave@easalesltd.co.uk, or use the visit form on easalesltd.co.uk.',
  },
  {
    question: 'Is Dave Langdon a member of the UK Greeting Card Association?',
    answer: `Yes. East Anglian Sales LTD is a member of the ${BUSINESS.gca.name} (GCA).`,
  },
  {
    question: 'When was East Anglian Sales LTD founded?',
    answer:
      'East Anglian Sales LTD was incorporated in 2022 (Companies House 14725288). Dave Langdon has worked as a greeting card and gift sales agent in East Anglia for over 11 years.',
  },
  {
    question: 'Does East Anglian Sales LTD sell to the public?',
    answer:
      'No. It is a trade-only sales agency for retailers. Shoppers should visit independent card shops, garden centres, farm shops, and gift shops in East Anglia.',
  },
  {
    question: 'What is the difference between a greeting card sales agent and a publisher?',
    answer:
      'A publisher designs and produces the cards. A sales agent such as Dave Langdon represents several publishers in one territory, visits shops, and takes wholesale orders. Retailers get one local contact instead of a separate rep for every brand.',
  },
  {
    question: 'Can Dave Langdon help with greeting card displays?',
    answer:
      'Yes. Alongside taking orders, he advises on retail display so card and gift ranges sell through, including bespoke confectionery display options for Cambridge Confectionery / Calico Cottage style sweets.',
  },
];

export const HOME_FAQS: readonly BusinessFaq[] = BUSINESS_FAQS.slice(0, 6);

export function faqJsonLd(faqs: readonly BusinessFaq[] = BUSINESS_FAQS, id = `${SITE_URL}/faq#faq`) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': id,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
