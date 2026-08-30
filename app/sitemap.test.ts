/** @jest-environment node */

import { describe, expect, it } from '@jest/globals';
import sitemap from '@/app/sitemap';

describe('sitemap', () => {
  it('keeps lastModified only where a real article date exists', () => {
    const entries = sitemap();
    const home = entries.find((entry) => entry.url === 'https://www.easalesltd.co.uk/');
    const article = entries.find((entry) => entry.url.includes('/blog/') && !entry.url.endsWith('/blog'));
    expect(home?.lastModified).toBeUndefined();
    expect(article?.lastModified).toBeInstanceOf(Date);
  });
});
