#!/usr/bin/env node

/**
 * Check if any World Cup fixtures are scheduled in the current time window.
 * Returns early exit code if no matches are active to save CI resources.
 */

const fs = require('node:fs');
const path = require('node:path');
const {
  parseScheduleFixtures,
  readDataFileSource,
} = require('./lib/world-cup-fixtures.cjs');
const {
  getDueFixtureOptionsFromEnv,
  getDueFixtures,
} = require('./lib/world-cup-due-fixtures-lib.cjs');

const repoRoot = path.resolve(__dirname, '..');
const dataPath = path.join(repoRoot, 'app/data/world-cup-fantasy.ts');

// Match window: 1 hour before first match until 1 hour after last match of the day.
// Overdue unrecorded fixtures also force a run so self-healing syncs still happen
// after generated knockout windows have passed.
const PRE_MATCH_BUFFER_MINUTES = 60;
const POST_MATCH_BUFFER_MINUTES = 60;

function setOutput(name, value) {
  const githubOutput = process.env.GITHUB_OUTPUT;
  if (!githubOutput) return;

  fs.appendFileSync(githubOutput, `${name}=${value}\n`);
}

function isInMatchWindow(fixtureUtcDate, now) {
  const fixtureTime = new Date(fixtureUtcDate).getTime();
  const windowStart = fixtureTime - PRE_MATCH_BUFFER_MINUTES * 60 * 1000;
  const windowEnd = fixtureTime + POST_MATCH_BUFFER_MINUTES * 60 * 1000;
  
  return now >= windowStart && now <= windowEnd;
}

async function main() {
  const source = readDataFileSource(dataPath);
  const fixtures = parseScheduleFixtures(source);
  const fixtureDates = fixtures.map((fixture) => new Date(fixture.utcDate).getTime());

  if (fixtureDates.length === 0) {
    console.log('No fixtures found in schedule.');
    setOutput('should_run', 'false');
    process.exit(0);
  }

  const dueOptions = getDueFixtureOptionsFromEnv();
  const now = dueOptions.now.getTime();
  const dueFixtures = await getDueFixtures(source, dueOptions);
  if (dueFixtures.length > 0) {
    console.log(`Found ${dueFixtures.length} overdue unrecorded fixture(s) - workflow should run.`);
    setOutput('should_run', 'true');
    process.exit(0);
  }

  const minFixtureTime = Math.min(...fixtureDates);
  const maxFixtureTime = Math.max(...fixtureDates);

  // Check if we're in any match window
  const inMatchWindow = fixtureDates.some(date => isInMatchWindow(date, now));

  // Also check if we're before the tournament starts or after it ends
  const tournamentStart = minFixtureTime - PRE_MATCH_BUFFER_MINUTES * 60 * 1000;
  const tournamentEnd = maxFixtureTime + POST_MATCH_BUFFER_MINUTES * 60 * 1000;

  if (now < tournamentStart) {
    console.log(`Tournament hasn't started yet. First match: ${new Date(minFixtureTime).toISOString()}`);
    setOutput('should_run', 'false');
    process.exit(0);
  }

  if (now > tournamentEnd) {
    console.log('Tournament has ended.');
    setOutput('should_run', 'false');
    process.exit(0);
  }

  if (inMatchWindow) {
    console.log('Currently in match window - workflow should run.');
    setOutput('should_run', 'true');
    process.exit(0);
  }

  console.log('Outside match window - skipping workflow to save CI resources.');
  setOutput('should_run', 'false');
  process.exit(0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
