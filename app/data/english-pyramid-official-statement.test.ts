/** @jest-environment node */

import { existsSync } from 'node:fs';
import path from 'node:path';
import {
  ENGLISH_PYRAMID_OFFICIAL_STATEMENT,
  publishedOfficialStatement,
} from '@/app/data/english-pyramid-fantasy';

describe('vanished red cards official statement', () => {
  it('apologises, names the four dismissals, and restores the points', () => {
    expect(ENGLISH_PYRAMID_OFFICIAL_STATEMENT).not.toBeNull();
    const statement = ENGLISH_PYRAMID_OFFICIAL_STATEMENT!;
    expect(statement.headline).toMatch(/red cards/i);
    expect(statement.imageUrl).toBe('/images/english-pyramid-fantasy/steward-statement.jpg');
    expect(statement.imageAlt).toMatch(/apology/i);
    expect(statement.body).toMatch(/apology/i);
    expect(statement.body).toContain('1-0');
    expect(statement.body).toContain('Scott');
    expect(statement.body).toContain('Ben');
    expect(statement.body).toContain('Darlington');
    expect(statement.body).toContain('Oxford City');
    expect(statement.body).toContain('Dagenham');
    expect(statement.body).toContain('Maidenhead');
    expect(statement.body).toContain('129');
    expect(statement.body).toContain('100');
    expect(statement.body).toMatch(/Investigation/);
    expect(statement.body).toMatch(/Resolution/);
    expect(statement.body).not.toMatch(/[—–]/);
  });

  it('stays live through Monday evening and drops at Tuesday 00:00 London', () => {
    const statement = ENGLISH_PYRAMID_OFFICIAL_STATEMENT!;
    expect(statement.expiresAtUtc).toBe('2026-08-31T23:00:00Z');
    expect(publishedOfficialStatement(statement, new Date('2026-08-31T21:00:00Z'))).toBe(statement);
    expect(publishedOfficialStatement(statement, new Date('2026-08-31T23:00:00Z'))).toBeNull();
  });

  it('ships the press-conference photo used at the top of the statement', () => {
    const statement = ENGLISH_PYRAMID_OFFICIAL_STATEMENT!;
    const publicPath = path.join(process.cwd(), 'public', statement.imageUrl!.replace(/^\//, ''));
    expect(existsSync(publicPath)).toBe(true);
  });
});
