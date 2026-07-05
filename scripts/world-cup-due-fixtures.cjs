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
const { readDataFileSource, parseScheduleFixtures } = require('./lib/world-cup-fixtures.cjs');

const repoRoot = path.resolve(__dirname, '..');
const dataPath = path.join(repoRoot, 'app/data/world-cup-fantasy.ts');

// Wait beyond the normal full-time estimate so stoppage-time goals and public
// score feeds have settled before an agent is allowed to record a final score.
const DEFAULT_UPDATE_DELAY_MINUTES = 110;
// Do not run before the finality buffer. GitHub scheduled workflows can arrive
// late and later cron slots will still catch the fixture inside the lookback.
const DEFAULT_DUE_LEAD_MINUTES = 0;
const DEFAULT_LOOKBACK_MINUTES = 24 * 60;

const updateDelayMinutes = Number.parseInt(
  process.env.WORLD_CUP_UPDATE_DELAY_MINUTES || `${DEFAULT_UPDATE_DELAY_MINUTES}`,
  10,
);
const dueLeadMinutes = Number.parseInt(
  process.env.WORLD_CUP_DUE_LEAD_MINUTES || `${DEFAULT_DUE_LEAD_MINUTES}`,
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

const source = readDataFileSource(dataPath);

function parseRecordedMatchIds() {
  const matchesSource = source.match(
    /export const WORLD_CUP_FANTASY_MANUAL_MATCHES[\s\S]*?= \[([\s\S]*?)\n\](?: as const)?;/,
  );
  if (!matchesSource) {
    throw new Error(`Unable to find WORLD_CUP_FANTASY_MANUAL_MATCHES in ${dataPath}`);
  }
  return new Set([...matchesSource[1].matchAll(/id: '([^']+)'/g)].map((match) => match[1]));
}

function formatFixture(fixture) {
  return `${fixture.id} (${fixture.utcDate}) ${fixture.homeTla} ${fixture.homeName} vs ${fixture.awayTla} ${fixture.awayName}`;
}

function formatEspnRedCardHint(fixture, espnMatch) {
  if (!espnMatch) return '';
  if (espnMatch.homeRedCards === 0 && espnMatch.awayRedCards === 0) {
    return ' ESPN reds: none reported.';
  }
  return ` ESPN reds: ${fixture.homeTla} ${espnMatch.homeRedCards}, ${fixture.awayTla} ${espnMatch.awayRedCards}.`;
}

async function appendEspnRedCardHints(dueFixtures) {
  const aliasToCode = buildEspnAliasMap(source);
  const cache = new Map();
  const lines = [];

  for (const fixture of dueFixtures) {
    const dateParam = espnDateParamFromUtcDate(fixture.utcDate);
    if (!dateParam) {
      lines.push(formatFixture(fixture));
      continue;
    }

    try {
      if (!cache.has(dateParam)) {
        const payload = await fetchEspnScoreboardForDate(dateParam);
        cache.set(
          dateParam,
          parseEspnScoreboard(payload, aliasToCode, new Set(['scheduled', 'postponed', 'canceled', 'cancelled', 'delayed', 'suspended'])),
        );
      }

      const espnMatch = findEspnEventForFixture(
        cache.get(dateParam),
        fixture.homeTla,
        fixture.awayTla,
      );
      lines.push(`${formatFixture(fixture)}${formatEspnRedCardHint(fixture, espnMatch)}`);
    } catch (error) {
      lines.push(formatFixture(fixture));
      console.warn(
        `Unable to fetch ESPN red-card hint for ${fixture.id}: ${
          error instanceof Error ? error.message : error
        }`,
      );
    }
  }

  return lines.join('\n');
}

function setOutput(name, value) {
  const githubOutput = process.env.GITHUB_OUTPUT;
  if (!githubOutput) return;

  fs.appendFileSync(githubOutput, `${name}<<EOF\n${value}\nEOF\n`);
}

const fixtures = parseScheduleFixtures(source);
const recordedMatchIds = parseRecordedMatchIds();
const updateDelayMs = updateDelayMinutes * 60 * 1000;
const dueLeadMs = dueLeadMinutes * 60 * 1000;
const lookbackMs = lookbackMinutes * 60 * 1000;

const dueFixtures = fixtures.filter((fixture) => {
  if (recordedMatchIds.has(fixture.id)) return false;
  if (fixture.homeTla === 'TBD' || fixture.awayTla === 'TBD') return false;

  const kickoff = new Date(fixture.utcDate);
  if (Number.isNaN(kickoff.getTime())) {
    throw new Error(`Invalid fixture utcDate for ${fixture.id}: ${fixture.utcDate}`);
  }

  const dueAt = new Date(kickoff.getTime() + updateDelayMs);
  return (
    dueAt.getTime() <= now.getTime() + dueLeadMs &&
    now.getTime() - dueAt.getTime() <= lookbackMs
  );
});

const hasDueFixtures = dueFixtures.length > 0;

async function main() {
  const fixtureList = hasDueFixtures
    ? await appendEspnRedCardHints(dueFixtures)
    : '';

  setOutput('due', hasDueFixtures ? 'true' : 'false');
  setOutput('forced', forceAgent ? 'true' : 'false');
  setOutput('fixtures', fixtureList);
  setOutput('update_delay_minutes', `${updateDelayMinutes}`);
  setOutput('due_lead_minutes', `${dueLeadMinutes}`);
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
  console.log(`Due check lead window: ${dueLeadMinutes} minutes.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
