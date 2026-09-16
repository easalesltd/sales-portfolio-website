/** @jest-environment node */

const {
  collectDuplicateDirectedPairs,
  collectFixtureCountMismatches,
  collectPastUnrecordedFixtures,
  describeIntegrityErrors,
  formatPlayedGameAudit,
  parseFantasyPlayersFromSource,
  summarizePlayedGames,
} = require('./english-pyramid-fixture-integrity.cjs');

function fixture(id, utcDate, home, away, extra = {}) {
  return {
    id,
    utcDate,
    homeTeam: { name: home, tla: home },
    awayTeam: { name: away, tla: away },
    ...extra,
  };
}

describe('english-pyramid fixture integrity', () => {
  it('flags the same home+away pair listed on two dates', () => {
    const duplicates = collectDuplicateDirectedPairs([
      fixture('2026-09-16-wol-por', '2026-09-16T18:45Z', 'WOL', 'POR'),
      fixture('2026-10-20-wol-por', '2026-10-20T18:45Z', 'WOL', 'POR'),
    ]);
    expect(duplicates).toHaveLength(1);
    expect(duplicates[0].map((row) => row.id)).toEqual([
      '2026-09-16-wol-por',
      '2026-10-20-wol-por',
    ]);
  });

  it('treats a past unrecorded row as a missed result, and ignores postponements', () => {
    const fixtures = [
      fixture('2026-09-12-por-cha', '2026-09-12T14:00Z', 'POR', 'CHA'),
      fixture('2026-08-31-ebb-hor', '2026-08-31T14:00Z', 'EBB', 'HOR', { postponed: true }),
      fixture('2026-09-16-kid-gat', '2026-09-16T18:45Z', 'KID', 'GAT'),
    ];
    const missing = collectPastUnrecordedFixtures(
      fixtures,
      new Set(),
      new Date('2026-09-16T19:20:00Z'),
    );
    expect(missing.map((row) => row.id)).toEqual(['2026-09-12-por-cha']);
  });

  it('reports a manager gap only when recorded games disagree with past fixtures', () => {
    const fixtures = [
      fixture('2026-09-12-por-cha', '2026-09-12T14:00Z', 'POR', 'CHA'),
      fixture('2026-09-13-wol-shu', '2026-09-13T11:00Z', 'WOL', 'SHU'),
    ];
    const summary = summarizePlayedGames(
      [
        { id: 'jon', name: 'Jon', teams: ['POR'] },
        { id: 'scott', name: 'Scott', teams: ['WOL'] },
      ],
      fixtures,
      new Set(['2026-09-13-wol-shu']),
      new Date('2026-09-16T12:00:00Z'),
    );

    expect(summary.balanced).toBe(false);
    expect(summary.managers.find((row) => row.id === 'jon')?.gaps).toEqual([
      expect.objectContaining({ code: 'POR', recorded: 0, pastDue: 1 }),
    ]);
    expect(summary.managers.find((row) => row.id === 'scott')?.gaps).toEqual([]);
    expect(formatPlayedGameAudit(summary)).toContain('POR: recorded 0, past due 1');
  });

  it('describes a stale double listing in validate wording', () => {
    const errors = describeIntegrityErrors({
      duplicates: collectDuplicateDirectedPairs([
        fixture('2026-09-16-wol-por', '2026-09-16T18:45Z', 'WOL', 'POR'),
        fixture('2026-10-20-wol-por', '2026-10-20T18:45Z', 'WOL', 'POR'),
      ]),
      countMismatches: [{ code: 'WOL', name: 'Wolverhampton Wanderers', actual: 47, expected: 46 }],
      pastUnrecorded: [fixture('2026-09-12-por-cha', '2026-09-12T14:00Z', 'POR', 'CHA')],
    });
    expect(errors.join('\n')).toContain('WOL vs POR is listed 2 times');
    expect(errors.join('\n')).toContain('WOL (Wolverhampton Wanderers) has 47 league fixtures');
    expect(errors.join('\n')).toContain('2026-09-12-por-cha');
  });

  it('does not invent a manager gap when recorded games match past fixtures', () => {
    const fixtures = [
      fixture('2026-09-12-por-cha', '2026-09-12T14:00Z', 'POR', 'CHA'),
      fixture('2026-09-13-wol-shu', '2026-09-13T11:00Z', 'WOL', 'SHU'),
    ];
    const summary = summarizePlayedGames(
      [
        { id: 'jon', name: 'Jon', teams: ['POR'] },
        { id: 'scott', name: 'Scott', teams: ['WOL'] },
      ],
      fixtures,
      new Set(['2026-09-12-por-cha', '2026-09-13-wol-shu']),
      new Date('2026-09-16T12:00:00Z'),
    );
    expect(summary.balanced).toBe(true);
    expect(formatPlayedGameAudit(summary)).toContain('Jon 1/1 recorded/past due (ok)');
  });

  it('keeps the live pyramid ledger free of stale duplicates, short club lists, and missing past results', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    const { parseFixturesFromSource } = require('./english-pyramid-fixture-lib.cjs');

    const source = fs.readFileSync(
      path.join(__dirname, '../../app/data/english-pyramid-fantasy.ts'),
      'utf8',
    );
    const fixtures = parseFixturesFromSource(source);
    const recorded = new Set(
      [
        ...source
          .match(/export const ENGLISH_PYRAMID_MANUAL_MATCHES[^=]*= \[([\s\S]*?)\](?: as const)?;/)[1]
          .matchAll(/id: '([^']+)'/g),
      ].map((match) => match[1]),
    );
    const now = new Date('2026-09-16T18:00:00Z');

    expect(collectDuplicateDirectedPairs(fixtures)).toEqual([]);
    expect(collectFixtureCountMismatches(fixtures)).toEqual([]);
    expect(collectPastUnrecordedFixtures(fixtures, recorded, now)).toEqual([]);
    expect(
      summarizePlayedGames(parseFantasyPlayersFromSource(source), fixtures, recorded, now).balanced,
    ).toBe(true);
    expect(fixtures.some((row) => row.id === '2026-09-16-wol-por')).toBe(false);
    expect(fixtures.some((row) => row.id === '2026-10-20-wol-por')).toBe(true);
  });
});
