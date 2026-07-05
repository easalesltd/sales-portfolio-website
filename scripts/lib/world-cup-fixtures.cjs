const fs = require('node:fs');
const path = require('node:path');
const { resolveWorldCupScheduleFixtures } = require('./world-cup-knockout-bracket.cjs');

const repoRoot = path.resolve(__dirname, '..', '..');
const defaultDataPath = path.join(repoRoot, 'app/data/world-cup-fantasy.ts');

function readDataFileSource(dataPath = defaultDataPath) {
  return fs.readFileSync(dataPath, 'utf8');
}

function extractConstArray(source, name) {
  const match = source.match(new RegExp(`export const ${name}[\\s\\S]*?= \\[([\\s\\S]*?)\\n\\](?: as const)?;`));
  if (!match) {
    throw new Error(`Unable to find ${name} in world-cup-fantasy.ts`);
  }
  return match[1];
}

function parseTeamByCode(source) {
  const teamTableMatch = source.match(
    /export const WORLD_CUP_TEAM_BY_CODE[\s\S]*?= \{([\s\S]*?)\n\};/,
  );
  if (!teamTableMatch) {
    throw new Error('Unable to find WORLD_CUP_TEAM_BY_CODE in world-cup-fantasy.ts');
  }

  const teamByCode = {};
  const entryPattern = /([A-Z]{3}): \{ code: '[^']+', name: '([^']+)'(?:, flag: '[^']*')?(?:, aliases: \[([^\]]*)\])?/g;

  for (const match of teamTableMatch[1].matchAll(entryPattern)) {
    const aliases = match[3]
      ? [...match[3].matchAll(/'([^']+)'/g)].map((aliasMatch) => aliasMatch[1])
      : [];
    teamByCode[match[1]] = { code: match[1], name: match[2], aliases };
  }

  return teamByCode;
}

function parseBaseFixtures(source) {
  const fixturesSource = extractConstArray(source, 'WORLD_CUP_FANTASY_FIXTURES');
  const fixturePattern =
    /id: '([^']+)',\s*utcDate: '([^']+)',(?:\s*stage: '([^']+)',)?\s*homeTeam: \{ name: '([^']+)', tla: '([^']+)' \},\s*awayTeam: \{ name: '([^']+)', tla: '([^']+)' \}/g;

  return [...fixturesSource.matchAll(fixturePattern)].map((match) => ({
    id: match[1],
    utcDate: match[2],
    stage: match[3],
    homeTeam: { name: match[4], tla: match[5] },
    awayTeam: { name: match[6], tla: match[7] },
    homeTla: match[5],
    awayTla: match[7],
    homeName: match[4],
    awayName: match[6],
  }));
}

function readString(objectSource, pattern, label) {
  const match = objectSource.match(pattern);
  if (!match) {
    throw new Error(`Unable to parse ${label} from manual match:\n${objectSource}`);
  }
  return match[1];
}

function readNumber(objectSource, key, fallback = undefined) {
  const match = objectSource.match(new RegExp(`${key}: (\\d+)`));
  if (!match) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Unable to parse ${key} from manual match:\n${objectSource}`);
  }
  return Number.parseInt(match[1], 10);
}

function parseManualMatches(source) {
  const matchesSource = extractConstArray(source, 'WORLD_CUP_FANTASY_MANUAL_MATCHES');
  const objectPattern = /\{\s*(?:\/\*\*[\s\S]*?\*\/\s*)?id: '[^']+',[\s\S]*?\n\s{2}\}/g;

  return [...matchesSource.matchAll(objectPattern)].map((match) => {
    const objectSource = match[0];
    return {
      id: readString(objectSource, /id: '([^']+)'/, 'id'),
      utcDate: readString(objectSource, /utcDate: '([^']+)'/, 'utcDate'),
      homeTeam: {
        name: readString(objectSource, /homeTeam: \{ name: '([^']+)'/, 'home team name'),
        tla: readString(objectSource, /homeTeam: \{ name: '[^']+', tla: '([^']+)' \}/, 'home team TLA'),
      },
      awayTeam: {
        name: readString(objectSource, /awayTeam: \{ name: '([^']+)'/, 'away team name'),
        tla: readString(objectSource, /awayTeam: \{ name: '[^']+', tla: '([^']+)' \}/, 'away team TLA'),
      },
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
      homeGoals: readNumber(objectSource, 'homeGoals'),
      awayGoals: readNumber(objectSource, 'awayGoals'),
      homeRedCards: readNumber(objectSource, 'homeRedCards', 0),
      awayRedCards: readNumber(objectSource, 'awayRedCards', 0),
    };
  });
}

function parseScheduleFixtures(source = readDataFileSource()) {
  const baseFixtures = parseBaseFixtures(source);
  const manualMatches = parseManualMatches(source);
  const teamByCode = parseTeamByCode(source);
  return resolveWorldCupScheduleFixtures(baseFixtures, manualMatches, teamByCode);
}

module.exports = {
  defaultDataPath,
  readDataFileSource,
  extractConstArray,
  parseTeamByCode,
  parseBaseFixtures,
  parseManualMatches,
  parseScheduleFixtures,
};
