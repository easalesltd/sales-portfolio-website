#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const {
  buildEspnAliasMap,
  findEspnMatchForFixture,
} = require('./lib/world-cup-espn-scoreboard.cjs');
const { updateWorldCupFixtureKickoff } = require('./lib/world-cup-fixture-kickoff.cjs');
const {
  applyDelayedKickoffUpdates,
  getDueFixtureOptionsFromEnv,
  getDueFixtures,
} = require('./lib/world-cup-due-fixtures-lib.cjs');
const {
  isEspnFinalPeriod,
  resolveLedgerGoalsFromEspnMatch,
} = require('./lib/world-cup-espn-finals.cjs');
const { readDataFileSource } = require('./lib/world-cup-fixtures.cjs');
const {
  appendManualMatches,
  formatManualMatchEntry,
} = require('./lib/world-cup-ledger-write.cjs');
const {
  isKnockoutMatchId,
  parseKnockoutMatchIds,
} = require('./lib/world-cup-scoring-lib.cjs');

const repoRoot = path.resolve(__dirname, '..');
const dataPath = path.join(repoRoot, 'app/data/world-cup-fantasy.ts');
const writeChanges = process.argv.includes('--write');

const IGNORED_ESPN_STATUSES = new Set([
  'scheduled',
  'postponed',
  'canceled',
  'cancelled',
  'delayed',
  'suspended',
]);

async function main() {
  const dueOptions = getDueFixtureOptionsFromEnv();

  await applyDelayedKickoffUpdates({
    ...dueOptions,
    writeChanges,
    updateKickoff: updateWorldCupFixtureKickoff,
  });

  let source = readDataFileSource(dataPath);
  const dueFixtures = await getDueFixtures(source, dueOptions);
  const aliasToCode = buildEspnAliasMap(source);
  const espnCache = new Map();
  const fixturesSource = source.match(
    /export const WORLD_CUP_FANTASY_FIXTURES[\s\S]*?= \[([\s\S]*?)\n\];/,
  )?.[1];
  const knockoutFixtureIds = fixturesSource ? parseKnockoutMatchIds(fixturesSource) : new Set();

  const pendingEntries = [];
  const skipped = [];
  let kickoffFilesUpdated = false;

  for (const fixture of dueFixtures) {
    if (writeChanges && fixture.kickoff?.isDelayed) {
      if (updateWorldCupFixtureKickoff(fixture.id, fixture.kickoff.effectiveUtcDate)) {
        kickoffFilesUpdated = true;
      }
    }

    let espnMatch;
    try {
      espnMatch = await findEspnMatchForFixture(
        fixture,
        aliasToCode,
        espnCache,
        IGNORED_ESPN_STATUSES,
      );
    } catch (error) {
      skipped.push(
        `${fixture.id}: ESPN fetch failed (${error instanceof Error ? error.message : error})`,
      );
      continue;
    }

    if (!espnMatch) {
      skipped.push(`${fixture.id}: no ESPN event yet`);
      continue;
    }

    if (!isEspnFinalPeriod(espnMatch.period)) {
      skipped.push(`${fixture.id}: ESPN status "${espnMatch.period}" is not final`);
      continue;
    }

    const isKnockout = isKnockoutMatchId(fixture.id, knockoutFixtureIds);
    const goals = resolveLedgerGoalsFromEspnMatch(espnMatch, isKnockout);
    if (!goals) {
      skipped.push(`${fixture.id}: knockout level score without a pen winner on ESPN`);
      continue;
    }

    const ledgerUtcDate = fixture.kickoff?.effectiveUtcDate ?? fixture.utcDate;
    const delayNote = fixture.kickoff?.isDelayed
      ? ` Delayed kick-off; ESPN started ${ledgerUtcDate}.`
      : '';
    const comment = espnMatch.period.toLowerCase().includes('pen')
      ? `Verified final result (ESPN sync; post-pens winner).${delayNote}`
      : `Verified final result (ESPN sync).${delayNote}`;

    pendingEntries.push(
      formatManualMatchEntry(
        { ...fixture, utcDate: ledgerUtcDate },
        goals,
        {
          homeRedCards: espnMatch.homeRedCards,
          awayRedCards: espnMatch.awayRedCards,
        },
        comment.trim(),
      ),
    );

    console.log(
      `Will append ${fixture.id}: ${fixture.homeTla} ${goals.homeGoals}-${goals.awayGoals} ${fixture.awayTla} (${espnMatch.period})`,
    );
  }

  if (kickoffFilesUpdated) {
    source = readDataFileSource(dataPath);
  }

  if (pendingEntries.length === 0) {
    console.log(`No ESPN-final fixtures ready to sync (${dueFixtures.length} due, all waiting).`);
    for (const reason of skipped) {
      console.log(`- ${reason}`);
    }
    return;
  }

  const updatedSource = appendManualMatches(source, pendingEntries);

  if (!writeChanges) {
    console.log(
      `Dry run: ${pendingEntries.length} fixture(s) ready. Re-run with --write to update the ledger.`,
    );
    return;
  }

  fs.writeFileSync(dataPath, updatedSource, 'utf8');
  console.log(`Appended ${pendingEntries.length} World Cup result(s) to the manual ledger.`);

  if (skipped.length > 0) {
    console.log('Still waiting on ESPN finals for:');
    for (const reason of skipped) {
      console.log(`- ${reason}`);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
