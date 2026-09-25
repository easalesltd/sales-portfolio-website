import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { getCspNonce } from './lib/csp-nonce';
import { getHomePageJsonLd } from './lib/home-page-json-ld';
import { HOME_PAGE_META_DESCRIPTION } from './lib/home-page-meta-description';
import { pageSocialFields } from './lib/site-social-meta';
import HomeTestExperience from './home-test/HomeTestExperience';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['500', '700', '800'],
  variable: '--font-home-test-display',
  display: 'swap',
});

const HOME_TITLE = 'East Anglian Sales LTD | UK Greeting Card Sales Agent Covering East Anglia';

export const metadata: Metadata = {
  title: {
    absolute: HOME_TITLE,
  },
  description: HOME_PAGE_META_DESCRIPTION,
  ...pageSocialFields({
    title: HOME_TITLE,
    description: HOME_PAGE_META_DESCRIPTION,
    path: '/',
  }),
};

export default async function HomePage() {
  const nonce = await getCspNonce();

  return (
    <div className={outfit.variable}>
      <script
        id="home-page-schema"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getHomePageJsonLd()),
        }}
      />
      <HomeTestExperience nonce={nonce} />
    </div>
  );
}
