#!/usr/bin/env node

const fs = require('node:fs');
const {
  applyDelayedKickoffUpdates,
  getDueFixtureOptionsFromEnv,
} = require('./lib/world-cup-due-fixtures-lib.cjs');
const { updateWorldCupFixtureKickoff } = require('./lib/world-cup-fixture-kickoff.cjs');

const writeChanges = process.argv.includes('--write');

function setOutput(name, value) {
  const githubOutput = process.env.GITHUB_OUTPUT;
  if (!githubOutput) return;
  fs.appendFileSync(githubOutput, `${name}=${value}\n`);
}

async function main() {
  const updatedCount = await applyDelayedKickoffUpdates({
    ...getDueFixtureOptionsFromEnv(),
    writeChanges,
    updateKickoff: updateWorldCupFixtureKickoff,
  });

  setOutput('kickoffs_patched', `${updatedCount}`);

  if (updatedCount === 0) {
    console.log('No delayed World Cup kick-offs to patch.');
    return;
  }

  console.log(`Patched ${updatedCount} delayed World Cup kick-off(s).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
