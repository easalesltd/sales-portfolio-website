/** @jest-environment node */

import { ENGLISH_PYRAMID_OFFICIAL_STATEMENT } from '@/app/data/english-pyramid-fantasy';

describe('Horsham postponement official statement', () => {
  it('apologises, records the 1-2, and explains the false postpone', () => {
    expect(ENGLISH_PYRAMID_OFFICIAL_STATEMENT).not.toBeNull();
    const statement = ENGLISH_PYRAMID_OFFICIAL_STATEMENT!;
    expect(statement.headline).toMatch(/Horsham vs Farnham Town/i);
    expect(statement.body).toMatch(/apology/i);
    expect(statement.body).toContain('1-2');
    expect(statement.body).toContain('Nest');
    expect(statement.body).toContain('Scott');
    expect(statement.body).toMatch(/Investigation/);
    expect(statement.body).toMatch(/Resolution/);
    expect(statement.body).not.toMatch(/[—–]/);
  });
});
