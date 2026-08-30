/** @jest-environment node */

import { existsSync } from 'node:fs';
import path from 'node:path';
import {
  ENGLISH_PYRAMID_OFFICIAL_STATEMENT,
  publishedOfficialStatement,
} from '@/app/data/english-pyramid-fantasy';

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

  it('stays live through Sunday and drops at Monday 00:00 London', () => {
    const statement = ENGLISH_PYRAMID_OFFICIAL_STATEMENT!;
    expect(statement.expiresAtUtc).toBe('2026-08-30T23:00:00Z');
    expect(publishedOfficialStatement(statement, new Date('2026-08-30T21:00:00Z'))).toBe(statement);
    expect(publishedOfficialStatement(statement, new Date('2026-08-30T23:00:00Z'))).toBeNull();
  });

  it('ships the press-conference photo used at the top of the statement', () => {
    const statement = ENGLISH_PYRAMID_OFFICIAL_STATEMENT!;
    const publicPath = path.join(process.cwd(), 'public', statement.imageUrl!.replace(/^\//, ''));
    expect(existsSync(publicPath)).toBe(true);
  });
});
