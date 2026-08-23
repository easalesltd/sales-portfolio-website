#!/usr/bin/env node

/**
 * Recap daily roast for the English pyramid sweepstake.
 * Keeps ENGLISH_PYRAMID_FANTASY_DAILY_UPDATE current after automated score sync.
 * Names managers and clubs, mirrors standings totals, and refuses TLA dumps.
 * Cursor agent / manual edits can still overwrite with sharper copy.
 */

const fs = require('node:fs');
const path = require('node:path');
const {
  assertLedgerMonotonic,
  parseManualMatchIds,
} = require('./lib/sweepstake-ledger-guard.cjs');
const { buildRoastFromSource, replaceDailyUpdate } = require('./lib/english-pyramid-roast.cjs');

const repoRoot = path.resolve(__dirname, '..');
const dataPath = path.join(repoRoot, 'app/data/english-pyramid-fantasy.ts');
const writeChanges = process.argv.includes('--write');

function main() {
  const beforeSource = fs.readFileSync(dataPath, 'utf8');
  const beforeIds = parseManualMatchIds(beforeSource, 'ENGLISH_PYRAMID_MANUAL_MATCHES');
  const { roast } = buildRoastFromSource(beforeSource);

  console.log('Proposed daily roast:');
  console.log(roast);

  if (!writeChanges) {
    console.log('Dry run only. Re-run with --write to update ENGLISH_PYRAMID_FANTASY_DAILY_UPDATE.');
    return;
  }

  const updated = replaceDailyUpdate(beforeSource, roast);
  assertLedgerMonotonic(
    beforeIds,
    parseManualMatchIds(updated, 'ENGLISH_PYRAMID_MANUAL_MATCHES'),
    'ENGLISH_PYRAMID_MANUAL_MATCHES',
  );
  fs.writeFileSync(dataPath, updated, 'utf8');
  console.log('Updated ENGLISH_PYRAMID_FANTASY_DAILY_UPDATE.');
}

main();
