#!/usr/bin/env node

const assert = require('node:assert/strict');
const {
  assertLedgerMonotonic,
  assertNoDuplicateLedgerIds,
  filterNewLedgerEntries,
  countManualMatches,
  parseManualMatchIds,
} = require('./sweepstake-ledger-guard.cjs');

const sampleSource = `
export const WORLD_CUP_FANTASY_MANUAL_MATCHES = [
  { id: 'a', homeGoals: 1, awayGoals: 0 },
  { id: 'b', homeGoals: 2, awayGoals: 1 },
];
`;

assert.deepEqual(parseManualMatchIds(sampleSource, 'WORLD_CUP_FANTASY_MANUAL_MATCHES'), ['a', 'b']);
assert.equal(countManualMatches(sampleSource, 'WORLD_CUP_FANTASY_MANUAL_MATCHES'), 2);
assert.equal(parseManualMatchIds(sampleSource, 'WORLD_CUP_FANTASY_MANUAL_MATCHES').size, undefined);

const emptyPyramidLedger = `
export const ENGLISH_PYRAMID_MANUAL_MATCHES: readonly EnglishPyramidManualMatch[] = [];

export const ENGLISH_PYRAMID_FIXTURES: readonly EnglishPyramidFixture[] = [
  { id: '2026-08-08-alt-std', utcDate: '2026-08-08T14:00Z' },
  { id: '2026-08-08-bil-dov', utcDate: '2026-08-08T14:00:00Z' },
];
`;

assert.deepEqual(parseManualMatchIds(emptyPyramidLedger, 'ENGLISH_PYRAMID_MANUAL_MATCHES'), []);
assert.deepEqual(
  filterNewLedgerEntries(
    emptyPyramidLedger,
    ["  { id: '2026-08-08-alt-std', homeGoals: 1, awayGoals: 3 },"],
    'ENGLISH_PYRAMID_MANUAL_MATCHES',
  ).map((entry) => entry.match(/id: '([^']+)'/)?.[1]),
  ['2026-08-08-alt-std'],
);

assertLedgerMonotonic(['a'], ['a', 'b']);
assert.throws(() => assertLedgerMonotonic(['a', 'b'], ['b']), /would remove 1 recorded match/);

assert.throws(
  () => assertNoDuplicateLedgerIds(['a', 'a']),
  /duplicate fixture id/,
);

const filtered = filterNewLedgerEntries(
  sampleSource,
  ["  { id: 'b', homeGoals: 0, awayGoals: 0 },", "  { id: 'c', homeGoals: 3, awayGoals: 2 },"],
  'WORLD_CUP_FANTASY_MANUAL_MATCHES',
);
assert.equal(filtered.length, 1);
assert.match(filtered[0], /id: 'c'/);

console.log('sweepstake-ledger-guard tests passed');
