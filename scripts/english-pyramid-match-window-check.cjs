#!/usr/bin/env node

/**
 * Decide whether the English pyramid score workflow should spend CI minutes.
 *
 * Unrecorded fixtures stay in-window from 60 minutes before kick-off until they
 * are written to the ledger (no 60-minute post-KO cut-off — full-time is ~115
 * minutes later, and midweek catch-up crons need to keep running).
 */

const fs = require('node:fs');
const {
  listUnrecordedFixtures,
  readDataFileSource,
} = require('./lib/english-pyramid-due-fixtures-lib.cjs');

const PRE_MATCH_BUFFER_MINUTES = 60;

function setOutput(name, value) {
  const githubOutput = process.env.GITHUB_OUTPUT;
  if (!githubOutput) return;

  fs.appendFileSync(githubOutput, `${name}=${value}\n`);
}

function parseNow(value = process.env.ENGLISH_PYRAMID_NOW) {
  if (!value) return new Date();
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid ENGLISH_PYRAMID_NOW value: ${value}`);
  }
  return parsed;
}

function shouldRunScoreWorkflow(source, now = new Date(), preMatchBufferMinutes = PRE_MATCH_BUFFER_MINUTES) {
  const bufferMs = preMatchBufferMinutes * 60 * 1000;
  const nowMs = now.getTime();

  return listUnrecordedFixtures(source).some((fixture) => {
    const kickoff = new Date(fixture.utcDate).getTime();
    if (Number.isNaN(kickoff)) {
      throw new Error(`Invalid fixture utcDate for ${fixture.id}: ${fixture.utcDate}`);
    }
    return nowMs >= kickoff - bufferMs;
  });
}

function main() {
  const source = readDataFileSource();
  const now = parseNow();

  if (shouldRunScoreWorkflow(source, now)) {
    console.log('Unrecorded fixtures are due or imminent — workflow should run.');
    setOutput('should_run', 'true');
    process.exit(0);
  }

  console.log('No unrecorded fixtures are in the pre-match buffer or overdue — skipping.');
  setOutput('should_run', 'false');
  process.exit(0);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

module.exports = {
  PRE_MATCH_BUFFER_MINUTES,
  shouldRunScoreWorkflow,
};
