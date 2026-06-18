#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const dataPath = path.join(repoRoot, 'app/data/world-cup-fantasy.ts');

// A 90-minute match plus half-time and usual stoppage is roughly 115 minutes.
// The extra buffer lets public result sources settle before the agent checks.
const DEFAULT_UPDATE_DELAY_MINUTES = 130;
const DEFAULT_LOOKBACK_MINUTES = 8 * 60;

const updateDelayMinutes = Number.parseInt(
  process.env.WORLD_CUP_UPDATE_DELAY_MINUTES || `${DEFAULT_UPDATE_DELAY_MINUTES}`,
  10,
);
const lookbackMinutes = Number.parseInt(
  process.env.WORLD_CUP_DUE_LOOKBACK_MINUTES || `${DEFAULT_LOOKBACK_MINUTES}`,
  10,
);
const forceAgent = process.env.WORLD_CUP_FORCE_AGENT === '1';
const now = process.env.WORLD_CUP_NOW ? new Date(process.env.WORLD_CUP_NOW) : new Date();

if (Number.isNaN(now.getTime())) {
  throw new Error(`Invalid WORLD_CUP_NOW value: ${process.env.WORLD_CUP_NOW}`);
}

const source = fs.readFileSync(dataPath, 'utf8');

function extractConstArray(name) {
  const match = source.match(new RegExp(`export const ${name}[\\s\\S]*?= \\[([\\s\\S]*?)\\n\\];`));
  if (!match) {
    throw new Error(`Unable to find ${name} in ${dataPath}`);
  }
  return match[1];
}

function parseFixtures() {
  const fixturesSource = extractConstArray('WORLD_CUP_FANTASY_FIXTURES');
  const fixturePattern =
    /id: '([^']+)',\s*utcDate: '([^']+)',\s*homeTeam: \{ name: '([^']+)', tla: '([^']+)' \},\s*awayTeam: \{ name: '([^']+)', tla: '([^']+)' \}/g;

  return [...fixturesSource.matchAll(fixturePattern)].map((match) => ({
    id: match[1],
    utcDate: match[2],
    homeName: match[3],
    homeTla: match[4],
    awayName: match[5],
    awayTla: match[6],
  }));
}

function parseRecordedMatchIds() {
  const matchesSource = extractConstArray('WORLD_CUP_FANTASY_MANUAL_MATCHES');
  return new Set([...matchesSource.matchAll(/id: '([^']+)'/g)].map((match) => match[1]));
}

function formatFixture(fixture) {
  return `${fixture.id} (${fixture.utcDate}) ${fixture.homeTla} ${fixture.homeName} vs ${fixture.awayTla} ${fixture.awayName}`;
}

function setOutput(name, value) {
  const githubOutput = process.env.GITHUB_OUTPUT;
  if (!githubOutput) return;

  fs.appendFileSync(githubOutput, `${name}<<EOF\n${value}\nEOF\n`);
}

const fixtures = parseFixtures();
const recordedMatchIds = parseRecordedMatchIds();
const updateDelayMs = updateDelayMinutes * 60 * 1000;
const lookbackMs = lookbackMinutes * 60 * 1000;

const dueFixtures = fixtures.filter((fixture) => {
  if (recordedMatchIds.has(fixture.id)) return false;

  const kickoff = new Date(fixture.utcDate);
  if (Number.isNaN(kickoff.getTime())) {
    throw new Error(`Invalid fixture utcDate for ${fixture.id}: ${fixture.utcDate}`);
  }

  const dueAt = new Date(kickoff.getTime() + updateDelayMs);
  return dueAt <= now && now.getTime() - dueAt.getTime() <= lookbackMs;
});

const due = forceAgent || dueFixtures.length > 0;
const fixtureList = dueFixtures.map(formatFixture).join('\n');

setOutput('due', due ? 'true' : 'false');
setOutput('fixtures', fixtureList);
setOutput('update_delay_minutes', `${updateDelayMinutes}`);
setOutput('lookback_minutes', `${lookbackMinutes}`);

if (dueFixtures.length > 0) {
  console.log(`World Cup score agent is due for ${dueFixtures.length} fixture(s):`);
  console.log(fixtureList);
} else if (forceAgent) {
  console.log('World Cup score agent forced by WORLD_CUP_FORCE_AGENT=1.');
} else {
  console.log(
    `No unrecorded fixtures are due within the ${lookbackMinutes}-minute lookback window.`,
  );
}

console.log(`Expected result check delay: ${updateDelayMinutes} minutes after kick-off.`);
