#!/usr/bin/env node

const fs = require('node:fs');

const {
  compareFixtureLists,
  fetchAllLeagueFixtures,
  parseFixturesFromSource,
  summarizePerTeam,
  writeFixturesToDataFile,
} = require('./lib/english-pyramid-fixture-lib.cjs');

function setOutput(name, value) {
  const githubOutput = process.env.GITHUB_OUTPUT;
  if (!githubOutput) return;
  fs.appendFileSync(githubOutput, `${name}<<EOF\n${value}\nEOF\n`);
}

function formatFixtureLine(fixture) {
  return `${fixture.id} ${fixture.utcDate} ${fixture.homeTeam.tla} vs ${fixture.awayTeam.tla}`;
}

async function main() {
  const write = process.argv.includes('--write');
  const localFixtures = parseFixturesFromSource();
  const { fixtures: remoteFixtures, bySlug } = await fetchAllLeagueFixtures();
  const diff = compareFixtureLists(localFixtures, remoteFixtures);

  console.log(`Local fixtures: ${localFixtures.length}`);
  console.log(`ESPN league fixtures: ${remoteFixtures.length}`);
  for (const [slug, count] of Object.entries(bySlug)) {
    console.log(`  ${slug}: ${count}`);
  }

  const localCounts = summarizePerTeam(localFixtures);
  const remoteCounts = summarizePerTeam(remoteFixtures);

  if (!diff.changed) {
    console.log('\nFixtures are in sync with ESPN (league only).');
    setOutput('changed', 'false');
    return;
  }

  setOutput('changed', 'true');

  if (diff.added.length > 0) {
    console.log(`\nAdded (${diff.added.length}):`);
    for (const fixture of diff.added.slice(0, 40)) {
      console.log(`  + ${formatFixtureLine(fixture)}`);
    }
    if (diff.added.length > 40) {
      console.log(`  … and ${diff.added.length - 40} more`);
    }
  }

  if (diff.removed.length > 0) {
    console.log(`\nRemoved (${diff.removed.length}):`);
    for (const fixture of diff.removed.slice(0, 40)) {
      console.log(`  - ${formatFixtureLine(fixture)}`);
    }
    if (diff.removed.length > 40) {
      console.log(`  … and ${diff.removed.length - 40} more`);
    }
  }

  if (diff.rescheduled.length > 0) {
    console.log(`\nRescheduled (${diff.rescheduled.length}):`);
    for (const entry of diff.rescheduled.slice(0, 20)) {
      console.log(`  ~ ${formatFixtureLine(entry.before)} → ${entry.after.utcDate}`);
    }
  }

  if (write) {
    writeFixturesToDataFile(remoteFixtures);
    console.log('\nUpdated app/data/english-pyramid-fantasy.ts from ESPN (league fixtures only).');
    setOutput('updated', 'true');
    return;
  }

  console.log('\nRun npm run english-pyramid:fetch-fixtures -- --write to refresh the ledger.');
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
