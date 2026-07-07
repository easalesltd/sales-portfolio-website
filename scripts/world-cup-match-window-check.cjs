#!/usr/bin/env node

/**
 * Check if any World Cup fixtures are scheduled in the current time window.
 * Returns early exit code if no matches are active to save CI resources.
 */

const fs = require('node:fs');
const path = require('node:path');
const { readDataFileSource } = require('./lib/world-cup-fixtures.cjs');

const repoRoot = path.resolve(__dirname, '..');
const dataPath = path.join(repoRoot, 'app/data/world-cup-fantasy.ts');

// Match window: 1 hour before first match until 1 hour after last match of the day
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

function main() {
  const source = readDataFileSource(dataPath);
  const fixturesSource = source.match(
    /export const WORLD_CUP_FANTASY_FIXTURES[\s\S]*?= \[([\s\S]*?)\n\];/,
  )?.[1];

  if (!fixturesSource) {
    console.error('Unable to find WORLD_CUP_FANTASY_FIXTURES in data source.');
    process.exit(1);
  }

  // Parse fixture dates
  const datePattern = /utcDate:\s*'([^']+)'/g;
  const fixtureDates = [];
  let match;
  
  while ((match = datePattern.exec(fixturesSource)) !== null) {
    fixtureDates.push(new Date(match[1]).getTime());
  }

  if (fixtureDates.length === 0) {
    console.log('No fixtures found in schedule.');
    setOutput('should_run', 'false');
    process.exit(0);
  }

  const now = Date.now();
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
