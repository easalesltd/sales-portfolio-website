#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { parseFixturesFromSource } = require('./lib/english-pyramid-fixture-lib.cjs');
const {
  validateManualMatchesAgainstFixtures,
  validateOverdueFixturesWithoutResults,
} = require('./lib/sweepstake-ledger-validation.cjs');

const repoRoot = path.resolve(__dirname, '..');
const dataPath = path.join(repoRoot, 'app/data/english-pyramid-fantasy.ts');
const source = fs.readFileSync(dataPath, 'utf8');

const DEFAULT_RESULT_FINALITY_BUFFER_MINUTES = 110;

const resultFinalityBufferMinutes = Number.parseInt(
  process.env.ENGLISH_PYRAMID_RESULT_FINALITY_BUFFER_MINUTES ||
    `${DEFAULT_RESULT_FINALITY_BUFFER_MINUTES}`,
  10,
);
const now = process.env.ENGLISH_PYRAMID_NOW
  ? new Date(process.env.ENGLISH_PYRAMID_NOW)
  : new Date();

if (!Number.isFinite(resultFinalityBufferMinutes) || resultFinalityBufferMinutes < 0) {
  throw new Error(
    `Invalid ENGLISH_PYRAMID_RESULT_FINALITY_BUFFER_MINUTES value: ${process.env.ENGLISH_PYRAMID_RESULT_FINALITY_BUFFER_MINUTES}`,
  );
}

if (Number.isNaN(now.getTime())) {
  throw new Error(`Invalid ENGLISH_PYRAMID_NOW value: ${process.env.ENGLISH_PYRAMID_NOW}`);
}

function extractConstArray(name) {
  const match = source.match(
    new RegExp(`export const ${name}[\\s\\S]*?= \\[([\\s\\S]*?)\\](?: as const)?;`),
  );
  if (!match) {
    throw new Error(`Unable to find ${name} in ${dataPath}`);
  }
  return match[1];
}

function readNumber(objectSource, key, label, fallback = undefined) {
  const match = objectSource.match(new RegExp(`${key}: (\\d+)`));
  if (!match) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Unable to parse ${label} from manual match:\n${objectSource}`);
  }
  return Number.parseInt(match[1], 10);
}

function readString(objectSource, pattern, label) {
  const match = objectSource.match(pattern);
  if (!match) {
    throw new Error(`Unable to parse ${label} from manual match:\n${objectSource}`);
  }
  return match[1];
}

function parseManualMatches() {
  const matchesSource = extractConstArray('ENGLISH_PYRAMID_MANUAL_MATCHES');
  const objectPattern = /\{\s*(?:\/\*\*[\s\S]*?\*\/\s*)?id: '[^']+',[\s\S]*?\n\s{2}\}/g;

  return [...matchesSource.matchAll(objectPattern)].map((match) => {
    const objectSource = match[0];
    return {
      id: readString(objectSource, /id: '([^']+)'/, 'id'),
      utcDate: readString(objectSource, /utcDate: '([^']+)'/, 'utcDate'),
      homeTla: readString(
        objectSource,
        /homeTeam: \{ name: '[^']+', tla: '([^']+)' \}/,
        'home team TLA',
      ),
      awayTla: readString(
        objectSource,
        /awayTeam: \{ name: '[^']+', tla: '([^']+)' \}/,
        'away team TLA',
      ),
      homeGoals: readNumber(objectSource, 'homeGoals', 'homeGoals'),
      awayGoals: readNumber(objectSource, 'awayGoals', 'awayGoals'),
      homeRedCards: readNumber(objectSource, 'homeRedCards', 'homeRedCards', 0),
      awayRedCards: readNumber(objectSource, 'awayRedCards', 'awayRedCards', 0),
    };
  });
}

const manualMatches = parseManualMatches();
const fixtures = parseFixturesFromSource(source).map((fixture) => ({
  id: fixture.id,
  utcDate: fixture.utcDate,
  homeTla: fixture.homeTeam.tla,
  awayTla: fixture.awayTeam.tla,
}));
const seenIds = new Set(manualMatches.map((match) => match.id));
const errors = [];

validateManualMatchesAgainstFixtures(manualMatches, fixtures, errors, {
  requireAllInFixtures: true,
});
validateOverdueFixturesWithoutResults(seenIds, fixtures, now, resultFinalityBufferMinutes, errors);

if (errors.length > 0) {
  console.error('English pyramid manual match validation failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `Validated ${manualMatches.length} English pyramid manual match(es); result finality buffer is ${resultFinalityBufferMinutes} minutes after kick-off.`,
);
