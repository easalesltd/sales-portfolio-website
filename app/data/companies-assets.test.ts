/** @jest-environment node */

import { existsSync } from 'fs';
import path from 'path';
import { companies } from '@/app/data/companies';

function publicFile(urlPath: string): string {
  return path.join(process.cwd(), 'public', urlPath.replace(/^\//, ''));
}

describe('company logo assets', () => {
  it('keeps every companies.ts logo on disk', () => {
    for (const company of companies) {
      expect(existsSync(publicFile(company.logoUrl))).toBe(true);
      if (company.logoUrlDark) {
        expect(existsSync(publicFile(company.logoUrlDark))).toBe(true);
      }
    }
  });
});

describe('company video assets', () => {
  it('keeps every companies.ts video on disk as mp4, not the unused .mov originals', () => {
    const videoPaths = companies.flatMap((company) => company.videos ?? []);
    expect(videoPaths.length).toBeGreaterThan(0);
    for (const videoPath of videoPaths) {
      expect(videoPath.endsWith('.mp4')).toBe(true);
      expect(existsSync(publicFile(videoPath))).toBe(true);
    }
  });

  it('serves the CGB showroom tour from the shared background mp4', () => {
    expect(existsSync(publicFile('/videos/companies/cgb-giftware/background.mp4'))).toBe(true);
    expect(existsSync(publicFile('/images/companies/CGB-Giftware/Showroom Tour.mp4'))).toBe(false);
    expect(existsSync(publicFile('/videos/companies/cgb-giftware/Showroom Tour.mp4'))).toBe(false);
  });
});
