import type { Metadata } from 'next';
import { companies } from '../data/companies';
import HomePartnerBrandsSection from '../components/home/HomePartnerBrandsSection';
import { pageSocialFields } from '../lib/site-social-meta';

const DESCRIPTION =
  'Greeting card, gift and confectionery brands represented across East Anglia by Dave Langdon of East Anglian Sales LTD.';

export const metadata: Metadata = {
  title: 'My Partner Brands',
  description: DESCRIPTION,
  ...pageSocialFields({
    title: 'My Partner Brands | East Anglian Sales LTD',
    description: DESCRIPTION,
    path: '/partner-brands',
  }),
};

export default function PartnerBrandsPage() {
  return <HomePartnerBrandsSection companies={companies} />;
}
