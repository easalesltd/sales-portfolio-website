#!/usr/bin/env node

const assert = require('node:assert/strict');
const {
  assertLedgerMonotonic,
  assertNoDuplicateLedgerIds,
  filterNewLedgerEntries,
  parseManualMatchIds,
} = require('./sweepstake-ledger-guard.cjs');

const sampleSource = `
export const WORLD_CUP_FANTASY_MANUAL_MATCHES = [
  { id: 'a', homeGoals: 1, awayGoals: 0 },
  { id: 'b', homeGoals: 2, awayGoals: 1 },
];
`;

assert.deepEqual(parseManualMatchIds(sampleSource, 'WORLD_CUP_FANTASY_MANUAL_MATCHES'), ['a', 'b']);

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
