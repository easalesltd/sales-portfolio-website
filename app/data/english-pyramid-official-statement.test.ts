/** @jest-environment node */

import { existsSync } from 'node:fs';
import path from 'node:path';
import { ENGLISH_PYRAMID_OFFICIAL_STATEMENT } from '@/app/data/english-pyramid-fantasy';

describe('Horsham postponement official statement', () => {
  it('apologises, records the 1-2, and explains the false postpone', () => {
    expect(ENGLISH_PYRAMID_OFFICIAL_STATEMENT).not.toBeNull();
    const statement = ENGLISH_PYRAMID_OFFICIAL_STATEMENT!;
    expect(statement.headline).toMatch(/Horsham vs Farnham Town/i);
    expect(statement.imageUrl).toBe('/images/english-pyramid-fantasy/steward-statement.jpg');
    expect(statement.imageAlt).toMatch(/apology/i);
    expect(statement.body).toMatch(/apology/i);
    expect(statement.body).toContain('1-2');
    expect(statement.body).toContain('Nest');
    expect(statement.body).toContain('Scott');
    expect(statement.body).toMatch(/Investigation/);
    expect(statement.body).toMatch(/Resolution/);
    expect(statement.body).not.toMatch(/[—–]/);
  });

  it('ships the press-conference photo used at the top of the statement', () => {
    const statement = ENGLISH_PYRAMID_OFFICIAL_STATEMENT!;
    const publicPath = path.join(process.cwd(), 'public', statement.imageUrl!.replace(/^\//, ''));
    expect(existsSync(publicPath)).toBe(true);
  });
});
