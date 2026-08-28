#!/usr/bin/env node

const fs = require('node:fs');

const {
  compareFixtureLists,
  fetchAllLeagueFixtures,
  mergeRemoteFixturesWithLocal,
  parseFixturesFromSource,
  summarizeNlFixtureStatus,
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
  const comparableRemote = mergeRemoteFixturesWithLocal(localFixtures, remoteFixtures);
  const diff = compareFixtureLists(localFixtures, comparableRemote);
  const nlStatus = summarizeNlFixtureStatus(localFixtures, remoteFixtures);

  console.log(`Local fixtures: ${localFixtures.length}`);
  console.log(`Remote league fixtures: ${remoteFixtures.length} (ESPN PL→NL + FWP NLN/NLS)`);
  for (const [slug, count] of Object.entries(bySlug)) {
    console.log(`  ${slug}: ${count}`);
  }

  if (nlStatus.pendingRelease) {
    console.log(
      `\nNational League fixtures usually publish on ${nlStatus.releaseDate}; automatic refresh runs from that date.`
    );
  } else if (nlStatus.awaitingEspn) {
    console.log(
      `\nNational League release date has passed but ESPN eng.5 still has no fixtures for: ${nlStatus.missingLocal.join(', ')}`
    );
  } else if (nlStatus.readyToImport) {
    console.log(
      `\nNational League fixtures are available on ESPN for: ${nlStatus.availableRemote.join(', ')}`
    );
  }

  setOutput('nl_pending', nlStatus.pendingRelease ? 'true' : 'false');
  setOutput('nl_awaiting_espn', nlStatus.awaitingEspn ? 'true' : 'false');
  setOutput('nl_ready', nlStatus.readyToImport ? 'true' : 'false');

  const localCounts = summarizePerTeam(localFixtures);
  const remoteCounts = summarizePerTeam(remoteFixtures);

  if (!diff.changed) {
    console.log('\nFixtures are in sync (ESPN + Football Web Pages, league only).');
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

  if (diff.movedCalendarDay?.length > 0) {
    console.log(`\nMoved to a different calendar day (${diff.movedCalendarDay.length}):`);
    for (const entry of diff.movedCalendarDay.slice(0, 20)) {
      console.log(`  ~ ${formatFixtureLine(entry.before)} → ${entry.after.utcDate}`);
    }
  }

  if (diff.postponedDrift?.length > 0) {
    console.log(`\nPostponed on the remote source but not in the repo (${diff.postponedDrift.length}):`);
    for (const entry of diff.postponedDrift.slice(0, 20)) {
      console.log(`  ! ${formatFixtureLine(entry.before)}`);
    }
  }

  if (write) {
    writeFixturesToDataFile(remoteFixtures);
    console.log(
      '\nUpdated app/data/english-pyramid-fantasy.ts from ESPN + Football Web Pages (league fixtures only).'
    );
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
