/** @jest-environment node */

import { describe, expect, it } from '@jest/globals';
import { SITE_OG_IMAGE_URL, pageSocialFields } from '@/app/lib/site-social-meta';

describe('pageSocialFields', () => {
  it('adds canonical, OG url, and a 1200 image for a path', () => {
    const fields = pageSocialFields({
      title: 'FAQ',
      description: 'Questions',
      path: '/faq',
    });
    expect(fields.alternates.canonical).toBe('https://www.easalesltd.co.uk/faq');
    expect(fields.openGraph.url).toBe('https://www.easalesltd.co.uk/faq');
    expect(fields.openGraph.images[0]?.url).toBe(SITE_OG_IMAGE_URL);
    expect(fields.openGraph.images[0]?.width).toBe(1200);
    expect(fields.twitter.card).toBe('summary_large_image');
  });

  it('uses a brand logo when given', () => {
    const fields = pageSocialFields({
      title: 'Paper Salad',
      description: 'Cards',
      path: '/companies/paper-salad',
      imageUrl: 'https://www.easalesltd.co.uk/images/companies/paper-salad/logo.png',
      imageAlt: 'Paper Salad logo',
    });
    expect(fields.alternates.canonical).toBe('https://www.easalesltd.co.uk/companies/paper-salad');
    expect(fields.openGraph.images[0]?.url).toContain('paper-salad');
  });
});
