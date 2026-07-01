#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const {
  buildEspnAliasMap,
  espnDateParamFromUtcDate,
  fetchEspnScoreboardForDate,
  findEspnEventForFixture,
  parseEspnScoreboard,
} = require('./lib/world-cup-espn-scoreboard.cjs');

const repoRoot = path.resolve(__dirname, '..');
const dataPath = path.join(repoRoot, 'app/data/world-cup-fantasy.ts');
const source = fs.readFileSync(dataPath, 'utf8');

const IGNORED_ESPN_STATUSES = new Set([
  'scheduled',
  'postponed',
  'canceled',
  'cancelled',
  'delayed',
  'suspended',
]);

function extractConstArray(name) {
  const match = source.match(new RegExp(`export const ${name}[\\s\\S]*?= \\[([\\s\\S]*?)\\n\\](?: as const)?;`));
  if (!match) {
    throw new Error(`Unable to find ${name} in ${dataPath}`);
  }
  return match[1];
}

function readNumber(objectSource, key, fallback = 0) {
  const match = objectSource.match(new RegExp(`${key}: (\\d+)`));
  return match ? Number.parseInt(match[1], 10) : fallback;
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
      homeGoals: readNumber(objectSource, 'homeGoals'),
      awayGoals: readNumber(objectSource, 'awayGoals'),
      homeRedCards: readNumber(objectSource, 'homeRedCards'),
      awayRedCards: readNumber(objectSource, 'awayRedCards'),
    };
  });
}

function isEspnFullTimePeriod(period) {
  const normalized = period.trim().toLowerCase();
  if (!normalized) return false;

  return (
    normalized === 'ft' ||
    normalized === 'full time' ||
    normalized === 'final' ||
    normalized.startsWith('status_full') ||
    /^full.?time\b/.test(normalized) ||
    /\bft\b/.test(normalized)
  );
}

async function loadEspnEventsForDate(dateParam, aliasToCode, cache) {
  if (cache.has(dateParam)) return cache.get(dateParam);

  const payload = await fetchEspnScoreboardForDate(dateParam);
  const events = parseEspnScoreboard(payload, aliasToCode, IGNORED_ESPN_STATUSES);
  cache.set(dateParam, events);
  return events;
}

async function main() {
  const aliasToCode = buildEspnAliasMap(source);
  const manualMatches = parseManualMatches();
  const errors = [];
  const checked = [];
  const espnCache = new Map();

  for (const match of manualMatches) {
    const dateParam = espnDateParamFromUtcDate(match.utcDate);
    if (!dateParam) continue;

    let events;
    try {
      events = await loadEspnEventsForDate(dateParam, aliasToCode, espnCache);
    } catch (error) {
      console.warn(
        `Skipping ESPN red-card check for ${match.id}: ${error instanceof Error ? error.message : error}`,
      );
      continue;
    }

    const espnMatch = findEspnEventForFixture(events, match.homeTla, match.awayTla);
    if (!espnMatch) continue;
    if (!isEspnFullTimePeriod(espnMatch.period)) continue;
    if (espnMatch.homeGoals !== match.homeGoals || espnMatch.awayGoals !== match.awayGoals) {
      continue;
    }

    checked.push(match.id);

    if (match.homeRedCards < espnMatch.homeRedCards) {
      errors.push(
        `${match.id}: ledger homeRedCards=${match.homeRedCards} but ESPN reports ${espnMatch.homeRedCards}`,
      );
    }
    if (match.awayRedCards < espnMatch.awayRedCards) {
      errors.push(
        `${match.id}: ledger awayRedCards=${match.awayRedCards} but ESPN reports ${espnMatch.awayRedCards}`,
      );
    }
  }

  if (errors.length > 0) {
    console.error('World Cup red-card validation failed:');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(
    `Validated World Cup red cards against ESPN for ${checked.length} ledger match(es).`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
