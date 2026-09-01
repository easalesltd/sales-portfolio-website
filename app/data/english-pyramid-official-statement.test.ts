/** @jest-environment node */

import { existsSync } from 'node:fs';
import path from 'node:path';
import {
  ENGLISH_PYRAMID_OFFICIAL_STATEMENT,
  isRedCardOfficialStatement,
  publishedOfficialStatement,
} from '@/app/data/english-pyramid-fantasy';

describe('Truro replacement official statement', () => {
  it('names the swap, backdates Jon\'s points, and keeps the driveway photo', () => {
    expect(ENGLISH_PYRAMID_OFFICIAL_STATEMENT).not.toBeNull();
    const statement = ENGLISH_PYRAMID_OFFICIAL_STATEMENT!;
    expect(statement.headline).toMatch(/Truro/i);
    expect(statement.imageUrl).toBe('/images/english-pyramid-fantasy/steward-statement.jpg');
    expect(statement.imageAlt).toMatch(/driveway/i);
    expect(statement.body).toContain('Ebbsfleet');
    expect(statement.body).toContain('Truro');
    expect(statement.body).toContain('Jon');
    expect(statement.body).toContain('2-0');
    expect(statement.body).toContain('0-0');
    expect(statement.body).toContain('0-2');
    expect(statement.body).toContain('3-0');
    expect(statement.body).toContain('1-0');
    expect(statement.body).toContain('89');
    expect(statement.body).toContain('102');
    expect(statement.body).toMatch(/plus 13/);
    expect(statement.body).toMatch(/slut drop/i);
    expect(statement.body).not.toMatch(/vanished red cards/i);
    expect(statement.body).not.toMatch(/every red card recorded so far/i);
    expect(statement.body).not.toMatch(/Red card audit/i);
    expect(isRedCardOfficialStatement(statement)).toBe(false);
    expect(statement.body).not.toMatch(/[—–]/);
  });

  it('stays live after tonight and drops at Tuesday night midnight', () => {
    const statement = ENGLISH_PYRAMID_OFFICIAL_STATEMENT!;
    expect(statement.expiresAtUtc).toBe('2026-09-01T23:00:00Z');
    expect(publishedOfficialStatement(statement, new Date('2026-09-01T21:00:00Z'))).toBe(statement);
    expect(publishedOfficialStatement(statement, new Date('2026-09-01T23:00:00Z'))).toBeNull();
  });

  it('only treats a red-card headline or audit body as a red-card statement', () => {
    expect(isRedCardOfficialStatement(null)).toBe(false);
    expect(
      isRedCardOfficialStatement({
        headline: 'Official statement: vanished red cards',
        issuedAtUtc: '2026-08-31T16:00:00Z',
        body: 'The cards vanished.',
      })
    ).toBe(true);
    expect(
      isRedCardOfficialStatement({
        headline: 'Official statement: Horsham vs Farnham Town',
        issuedAtUtc: '2026-08-29T16:05:00Z',
        body: 'Apology.\n\nRed card audit\n\nListed below.',
      })
    ).toBe(true);
  });

  it('ships the press-conference photo used at the top of the statement', () => {
    const statement = ENGLISH_PYRAMID_OFFICIAL_STATEMENT!;
    const publicPath = path.join(process.cwd(), 'public', statement.imageUrl!.replace(/^\//, ''));
    expect(existsSync(publicPath)).toBe(true);
  });
});
