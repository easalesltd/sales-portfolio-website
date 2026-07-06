#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const {
  formatDueFixturesWithEspnHints,
  getDueFixtureOptionsFromEnv,
  getDueFixtures,
} = require('./lib/world-cup-due-fixtures-lib.cjs');
const { readDataFileSource } = require('./lib/world-cup-fixtures.cjs');

const repoRoot = path.resolve(__dirname, '..');
const dataPath = path.join(repoRoot, 'app/data/world-cup-fantasy.ts');
const forceAgent = process.env.WORLD_CUP_FORCE_AGENT === '1';

function setOutput(name, value) {
  const githubOutput = process.env.GITHUB_OUTPUT;
  if (!githubOutput) return;

  fs.appendFileSync(githubOutput, `${name}<<EOF\n${value}\nEOF\n`);
}

async function main() {
  const source = readDataFileSource(dataPath);
  const dueOptions = getDueFixtureOptionsFromEnv();
  const dueFixtures = await getDueFixtures(source, dueOptions);
  const hasDueFixtures = dueFixtures.length > 0;

  const fixtureList = hasDueFixtures
    ? await formatDueFixturesWithEspnHints(dueFixtures, source)
    : '';

  setOutput('due', hasDueFixtures ? 'true' : 'false');
  setOutput('forced', forceAgent ? 'true' : 'false');
  setOutput('fixtures', fixtureList);
  setOutput('update_delay_minutes', `${dueOptions.updateDelayMinutes}`);
  setOutput('due_lead_minutes', `${dueOptions.dueLeadMinutes}`);

  if (dueFixtures.length > 0) {
    console.log(`World Cup automation is due for ${dueFixtures.length} unrecorded fixture(s):`);
    console.log(fixtureList);
  } else if (forceAgent) {
    console.log('World Cup automation forced by WORLD_CUP_FORCE_AGENT=1.');
  } else {
    console.log('No unrecorded fixtures are past the finality buffer yet.');
  }

  console.log(`Expected result check delay: ${dueOptions.updateDelayMinutes} minutes after kick-off.`);
  console.log(`Due check lead window: ${dueOptions.dueLeadMinutes} minutes.`);
  console.log('Due fixtures stay active until recorded (no lookback expiry).');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
