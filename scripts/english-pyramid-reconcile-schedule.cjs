#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const {
  applySchedulePatches,
  collectLivePatches,
  describePatches,
} = require('./lib/english-pyramid-schedule-reconcile.cjs');

const repoRoot = path.resolve(__dirname, '..');
const dataPath = path.join(repoRoot, 'app/data/english-pyramid-fantasy.ts');
const writeChanges = process.argv.includes('--write');

async function main() {
  const source = fs.readFileSync(dataPath, 'utf8');
  const patches = await collectLivePatches(source);

  if (patches.length === 0) {
    console.log('No live postponements or calendar-day kick-off moves in the near window.');
    return;
  }

  console.log(`Schedule drift (${patches.length}):`);
  for (const line of describePatches(patches)) {
    console.log(`- ${line}`);
  }

  if (!writeChanges) {
    console.log('Dry run only. Re-run with --write to update fixtures.');
    process.exitCode = 1;
    return;
  }

  fs.writeFileSync(dataPath, applySchedulePatches(source, patches), 'utf8');
  console.log(`Updated ${dataPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
