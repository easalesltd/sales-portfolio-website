#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const {
  validateManualMatchesAgainstFixtures,
} = require('./lib/sweepstake-ledger-validation.cjs');
const {
  parseKnockoutMatchIds,
  isKnockoutMatchId,
} = require('./lib/world-cup-scoring-lib.cjs');
const {
  readDataFileSource,
  parseScheduleFixtures,
} = require('./lib/world-cup-fixtures.cjs');
const { resolveFixtureKickoff } = require('./lib/world-cup-due-fixtures-lib.cjs');
const { buildEspnAliasMap } = require('./lib/world-cup-espn-scoreboard.cjs');

const repoRoot = path.resolve(__dirname, '..');
const dataPath = path.join(repoRoot, 'app/data/world-cup-fantasy.ts');
const source = readDataFileSource(dataPath);

const DEFAULT_RESULT_FINALITY_BUFFER_MINUTES = 110;

const resultFinalityBufferMinutes = Number.parseInt(
  process.env.WORLD_CUP_RESULT_FINALITY_BUFFER_MINUTES ||
    `${DEFAULT_RESULT_FINALITY_BUFFER_MINUTES}`,
  10,
);
const now = process.env.WORLD_CUP_NOW ? new Date(process.env.WORLD_CUP_NOW) : new Date();

if (!Number.isFinite(resultFinalityBufferMinutes) || resultFinalityBufferMinutes < 0) {
  throw new Error(
    `Invalid WORLD_CUP_RESULT_FINALITY_BUFFER_MINUTES value: ${process.env.WORLD_CUP_RESULT_FINALITY_BUFFER_MINUTES}`,
  );
}

if (Number.isNaN(now.getTime())) {
  throw new Error(`Invalid WORLD_CUP_NOW value: ${process.env.WORLD_CUP_NOW}`);
}

function extractConstArray(name) {
  const match = source.match(new RegExp(`export const ${name}[\\s\\S]*?= \\[([\\s\\S]*?)\\n\\](?: as const)?;`));
  if (!match) {
    throw new Error(`Unable to find ${name} in ${dataPath}`);
  }
  return match[1];
}

function parseTeamCodes() {
  const teamTableMatch = source.match(
    /export const WORLD_CUP_TEAM_BY_CODE[\s\S]*?= \{([\s\S]*?)\n\};/,
  );
  if (!teamTableMatch) {
    throw new Error(`Unable to find WORLD_CUP_TEAM_BY_CODE in ${dataPath}`);
  }

  return new Set([...teamTableMatch[1].matchAll(/\s([A-Z]{3}): \{/g)].map((match) => match[1]));
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
  const matchesSource = extractConstArray('WORLD_CUP_FANTASY_MANUAL_MATCHES');
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

function parseFixtures() {
  const fixturesSource = extractConstArray('WORLD_CUP_FANTASY_FIXTURES');
  const fixturePattern =
    /id: '([^']+)',\s*utcDate: '([^']+)',(?:\s*stage: '[^']+',)?\s*homeTeam: \{ name: '[^']+', tla: '([^']+)' \},\s*awayTeam: \{ name: '([^']+)', tla: '([^']+)' \}/g;

  return [...fixturesSource.matchAll(fixturePattern)].map((match) => ({
    id: match[1],
    utcDate: match[2],
    homeTla: match[3],
    awayTla: match[5],
  }));
}

function validateNonNegativeInteger(value, label, matchId, errors) {
  if (!Number.isInteger(value) || value < 0) {
    errors.push(`${matchId}: ${label} must be a non-negative integer`);
  }
}

const IGNORED_ESPN_STATUSES = new Set([
  'scheduled',
  'postponed',
  'canceled',
  'cancelled',
  'delayed',
  'suspended',
]);

async function validateOverdueFixturesWithEspn(seenIds, fixtures, errors) {
  const aliasToCode = buildEspnAliasMap(source);
  const cache = new Map();

  for (const fixture of fixtures) {
    if (seenIds.has(fixture.id)) continue;

    const homeTla = fixture.homeTla ?? fixture.homeTeam?.tla;
    const awayTla = fixture.awayTla ?? fixture.awayTeam?.tla;
    if (homeTla === 'TBD' || awayTla === 'TBD') continue;

    const kickoff = new Date(fixture.utcDate);
    if (Number.isNaN(kickoff.getTime())) {
      errors.push(`${fixture.id}: invalid fixture utcDate ${fixture.utcDate}`);
      continue;
    }

    const kickoffInfo = await resolveFixtureKickoff(
      {
        ...fixture,
        homeTla,
        awayTla,
        homeName: fixture.homeName ?? fixture.homeTeam?.name ?? homeTla,
        awayName: fixture.awayName ?? fixture.awayTeam?.name ?? awayTla,
      },
      now,
      resultFinalityBufferMinutes,
      aliasToCode,
      cache,
    );

    const effectiveKickoff = new Date(kickoffInfo.effectiveUtcDate);
    const minutesSinceKickoff = (now.getTime() - effectiveKickoff.getTime()) / 60000;
    if (minutesSinceKickoff >= resultFinalityBufferMinutes) {
      const delayNote = kickoffInfo.isDelayed
        ? ` (ESPN kick-off ${kickoffInfo.effectiveUtcDate}, delayed ${kickoffInfo.delayMinutes}m from schedule)`
        : '';
      errors.push(
        `${fixture.id}: kicked off ${Math.floor(minutesSinceKickoff)} minutes ago but has no manual result yet${delayNote}`,
      );
    }
  }
}

async function main() {
const teamCodes = parseTeamCodes();
const manualMatches = parseManualMatches();
const fixturesSource = extractConstArray('WORLD_CUP_FANTASY_FIXTURES');
const knockoutFixtureIds = parseKnockoutMatchIds(fixturesSource);
const seenIds = new Set();
const errors = [];

for (const match of manualMatches) {
  if (seenIds.has(match.id)) {
    errors.push(`${match.id}: duplicate manual match id`);
  }
  seenIds.add(match.id);

  if (
    !isKnockoutMatchId(match.id, knockoutFixtureIds) &&
    !/^\d{4}-\d{2}-\d{2}-[a-z0-9]{3}-[a-z0-9]{3}$/.test(match.id)
  ) {
    errors.push(`${match.id}: id should use yyyy-mm-dd-home-away format`);
  }

  const kickoff = new Date(match.utcDate);
  if (Number.isNaN(kickoff.getTime())) {
    errors.push(`${match.id}: invalid utcDate ${match.utcDate}`);
  } else {
    const minutesSinceKickoff = (now.getTime() - kickoff.getTime()) / 60000;
    if (minutesSinceKickoff < 0) {
      errors.push(`${match.id}: manual result is dated in the future`);
    } else if (minutesSinceKickoff < resultFinalityBufferMinutes) {
      errors.push(
        `${match.id}: recorded only ${Math.floor(
          minutesSinceKickoff,
        )} minutes after kick-off; wait at least ${resultFinalityBufferMinutes} minutes and confirm full-time from reliable sources`,
      );
    }
  }

  if (!teamCodes.has(match.homeTla)) {
    errors.push(`${match.id}: unknown home team code ${match.homeTla}`);
  }
  if (!teamCodes.has(match.awayTla)) {
    errors.push(`${match.id}: unknown away team code ${match.awayTla}`);
  }
  if (match.homeTla === match.awayTla) {
    errors.push(`${match.id}: home and away teams must differ`);
  }

  validateNonNegativeInteger(match.homeGoals, 'homeGoals', match.id, errors);
  validateNonNegativeInteger(match.awayGoals, 'awayGoals', match.id, errors);
  validateNonNegativeInteger(match.homeRedCards, 'homeRedCards', match.id, errors);
  validateNonNegativeInteger(match.awayRedCards, 'awayRedCards', match.id, errors);
}

const fixtures = parseScheduleFixtures(source);
validateManualMatchesAgainstFixtures(manualMatches, fixtures, errors, {
  isKnockoutMatchId: (id) => isKnockoutMatchId(id, knockoutFixtureIds),
});
await validateOverdueFixturesWithEspn(seenIds, fixtures, errors);

if (errors.length > 0) {
  console.error('World Cup manual match validation failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `Validated ${manualMatches.length} World Cup manual match(es); result finality buffer is ${resultFinalityBufferMinutes} minutes after kick-off.`,
);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
