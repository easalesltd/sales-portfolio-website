#!/usr/bin/env node

/**
 * Fail CI if the live daily roast is stale filler: missing totals,
 * TLA score dumps, or the old three-line insult templates.
 */

const fs = require('node:fs');
const path = require('node:path');
const {
  assertRoastQuality,
  computeStandings,
  parseDailyUpdate,
  parseMatches,
  parsePlayers,
  parseTeamMeta,
} = require('./lib/english-pyramid-roast.cjs');

const repoRoot = path.resolve(__dirname, '..');
const dataPath = path.join(repoRoot, 'app/data/english-pyramid-fantasy.ts');
const source = fs.readFileSync(dataPath, 'utf8');

const players = parsePlayers(source);
const { searchNames } = parseTeamMeta(source);
const matches = parseMatches(source);
const standings = computeStandings(players, matches, searchNames);
const roast = parseDailyUpdate(source);
const errors = assertRoastQuality(roast, standings);

if (errors.length > 0) {
  console.error('English pyramid daily roast validation failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `Validated daily roast against ${standings.length} standings row(s) and ${matches.length} ledger match(es).`,
);
