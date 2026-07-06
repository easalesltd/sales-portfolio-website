#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const {
  espnDateParamFromUtcDate,
  espnSlugForTeamCode,
  fetchEspnScoreboardForSlugAndDate,
  findEspnEventForFixture,
  parseEspnScoreboard,
} = require('./lib/english-pyramid-espn-scoreboard.cjs');
const {
  getDueFixtureOptionsFromEnv,
  getDueFixtures,
  readDataFileSource,
} = require('./lib/english-pyramid-due-fixtures-lib.cjs');
const { isEspnFinalPeriod } = require('./lib/world-cup-espn-finals.cjs');
const {
  appendManualMatches,
  formatManualMatchEntry,
} = require('./lib/english-pyramid-ledger-write.cjs');

const repoRoot = path.resolve(__dirname, '..');
const dataPath = path.join(repoRoot, 'app/data/english-pyramid-fantasy.ts');
const writeChanges = process.argv.includes('--write');

const IGNORED_ESPN_STATUSES = new Set([
  'scheduled',
  'postponed',
  'canceled',
  'cancelled',
  'delayed',
  'suspended',
]);

function setOutput(name, value) {
  const githubOutput = process.env.GITHUB_OUTPUT;
  if (!githubOutput) return;
  fs.appendFileSync(githubOutput, `${name}=${value}\n`);
}

function espnSlugForFixture(fixture) {
  return espnSlugForTeamCode(fixture.homeTla) || espnSlugForTeamCode(fixture.awayTla);
}

async function loadEspnEventsForFixture(fixture, cache) {
  const slug = espnSlugForFixture(fixture);
  const dateParam = espnDateParamFromUtcDate(fixture.utcDate);
  if (!slug || !dateParam) return null;

  const cacheKey = `${slug}:${dateParam}`;
  if (!cache.has(cacheKey)) {
    const payload = await fetchEspnScoreboardForSlugAndDate(slug, dateParam);
    cache.set(cacheKey, parseEspnScoreboard(payload, slug, IGNORED_ESPN_STATUSES));
  }

  return findEspnEventForFixture(cache.get(cacheKey), fixture.homeTla, fixture.awayTla);
}

async function main() {
  const source = readDataFileSource(dataPath);
  const dueOptions = getDueFixtureOptionsFromEnv();
  const dueFixtures = await getDueFixtures(source, dueOptions);
  const espnCache = new Map();
  const pendingEntries = [];
  const skipped = [];

  for (const fixture of dueFixtures) {
    const slug = espnSlugForFixture(fixture);
    if (!slug) {
      skipped.push(`${fixture.id}: no ESPN league slug (likely NL North/South — needs manual/agent)`);
      continue;
    }

    let espnMatch;
    try {
      espnMatch = await loadEspnEventsForFixture(fixture, espnCache);
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

    pendingEntries.push(
      formatManualMatchEntry(
        fixture,
        { homeGoals: espnMatch.homeGoals, awayGoals: espnMatch.awayGoals },
        {
          homeRedCards: espnMatch.homeRedCards,
          awayRedCards: espnMatch.awayRedCards,
        },
      ),
    );

    console.log(
      `Will append ${fixture.id}: ${fixture.homeTla} ${espnMatch.homeGoals}-${espnMatch.awayGoals} ${fixture.awayTla} (${espnMatch.period})`,
    );
  }

  if (pendingEntries.length === 0) {
    console.log(`No ESPN-final fixtures ready to sync (${dueFixtures.length} due, all waiting).`);
    for (const reason of skipped) {
      console.log(`- ${reason}`);
    }
    setOutput('remaining_due', `${dueFixtures.length}`);
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
  const remainingDue = await getDueFixtures(updatedSource, dueOptions);
  setOutput('synced_count', `${pendingEntries.length}`);
  setOutput('remaining_due', `${remainingDue.length}`);
  console.log(`Appended ${pendingEntries.length} English pyramid result(s) to the manual ledger.`);

  if (skipped.length > 0) {
    console.log('Still waiting on ESPN finals or manual sources for:');
    for (const reason of skipped) {
      console.log(`- ${reason}`);
    }
  }

  if (remainingDue.length > 0) {
    console.log(`${remainingDue.length} fixture(s) still due after sync.`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
