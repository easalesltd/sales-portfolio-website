#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const {
  espnDateParamFromUtcDate,
  espnSlugForTeamCode,
  fetchEspnScoreboardForSlugAndDate,
  findEspnEventForFixture,
  parseEspnScoreboard,
} = require('./lib/english-pyramid-espn-scoreboard.cjs');

const repoRoot = path.resolve(__dirname, '..');
const dataPath = path.join(repoRoot, 'app/data/english-pyramid-fantasy.ts');
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
  const match = source.match(
    new RegExp(`export const ${name}[\\s\\S]*?= \\[([\\s\\S]*?)\\](?: as const)?;`),
  );
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

async function loadEspnEventsForMatch(match, cache) {
  const slug = espnSlugForTeamCode(match.homeTla);
  const dateParam = espnDateParamFromUtcDate(match.utcDate);
  if (!slug || !dateParam) return null;

  const cacheKey = `${slug}:${dateParam}`;
  if (!cache.has(cacheKey)) {
    const payload = await fetchEspnScoreboardForSlugAndDate(slug, dateParam);
    cache.set(cacheKey, parseEspnScoreboard(payload, slug, IGNORED_ESPN_STATUSES));
  }

  return findEspnEventForFixture(cache.get(cacheKey), match.homeTla, match.awayTla);
}

async function main() {
  const manualMatches = parseManualMatches();
  const errors = [];
  const checked = [];
  const espnCache = new Map();

  for (const match of manualMatches) {
    let espnMatch;
    try {
      espnMatch = await loadEspnEventsForMatch(match, espnCache);
    } catch (error) {
      console.warn(
        `Skipping ESPN red-card check for ${match.id}: ${error instanceof Error ? error.message : error}`,
      );
      continue;
    }

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
    console.error('English pyramid red-card validation failed:');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(
    `Validated English pyramid red cards against ESPN for ${checked.length} ledger match(es).`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
