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
const { fetchFwpResultForFixture, OUR_NLN_NLS_CODES } = require('./lib/english-pyramid-fwp-nln-nls.cjs');
const { fetchFotMobResultForFixture } = require('./lib/english-pyramid-fotmob.cjs');
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

function isNlnNlsFixture(fixture) {
  return OUR_NLN_NLS_CODES.has(fixture.homeTla) || OUR_NLN_NLS_CODES.has(fixture.awayTla);
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

async function resolveFinalResult(fixture, espnCache, fotMobCache) {
  if (isNlnNlsFixture(fixture)) {
    const fwpMatch = await fetchFwpResultForFixture(fixture);
    if (!fwpMatch) {
      return { status: 'waiting', detail: 'FWP result not final yet' };
    }
    return {
      status: 'ready',
      goals: { homeGoals: fwpMatch.homeGoals, awayGoals: fwpMatch.awayGoals },
      redCards: {
        homeRedCards: fwpMatch.homeRedCards,
        awayRedCards: fwpMatch.awayRedCards,
      },
      redsUnchecked: true,
      label: `FWP ${fwpMatch.period}`,
      comment:
        'Verified final score (Football Web Pages sync). Red cards not verified on FWP — redsUnchecked.',
    };
  }

  const slug = espnSlugForFixture(fixture);
  if (!slug) {
    return { status: 'skipped', detail: 'no ESPN/FWP league source' };
  }

  let espnMatch;
  try {
    espnMatch = await loadEspnEventsForFixture(fixture, espnCache);
  } catch (error) {
    return {
      status: 'waiting',
      detail: `ESPN fetch failed (${error instanceof Error ? error.message : error})`,
    };
  }

  if (!espnMatch) {
    return { status: 'waiting', detail: 'no ESPN event yet' };
  }

  if (!isEspnFinalPeriod(espnMatch.period)) {
    return { status: 'waiting', detail: `ESPN status "${espnMatch.period}" is not final` };
  }

  let redCards = {
    homeRedCards: espnMatch.homeRedCards,
    awayRedCards: espnMatch.awayRedCards,
  };
  let redsUnchecked = false;
  let comment = 'Verified final result (ESPN sync).';

  if (slug === 'eng.5') {
    try {
      const fotMobMatch = await fetchFotMobResultForFixture(fixture, fotMobCache);
      if (fotMobMatch) {
        if (
          fotMobMatch.homeGoals !== espnMatch.homeGoals ||
          fotMobMatch.awayGoals !== espnMatch.awayGoals
        ) {
          return {
            status: 'waiting',
            detail:
              `ESPN/FotMob final-score mismatch ` +
              `(${espnMatch.homeGoals}-${espnMatch.awayGoals} vs ` +
              `${fotMobMatch.homeGoals}-${fotMobMatch.awayGoals})`,
          };
        }

        const redsDisagree =
          fotMobMatch.homeRedCards !== espnMatch.homeRedCards ||
          fotMobMatch.awayRedCards !== espnMatch.awayRedCards;
        redCards = {
          homeRedCards: Math.max(espnMatch.homeRedCards, fotMobMatch.homeRedCards),
          awayRedCards: Math.max(espnMatch.awayRedCards, fotMobMatch.awayRedCards),
        };
        redsUnchecked = redsDisagree;
        comment = redsDisagree
          ? 'Verified final score (ESPN + FotMob). Red-card feeds disagree — redsUnchecked.'
          : 'Verified final result and red cards (ESPN + FotMob).';
      }
    } catch (error) {
      comment =
        `Verified final result (ESPN sync). FotMob cross-check unavailable: ` +
        `${error instanceof Error ? error.message : error}`;
    }
  }

  return {
    status: 'ready',
    goals: { homeGoals: espnMatch.homeGoals, awayGoals: espnMatch.awayGoals },
    redCards,
    redsUnchecked,
    label: espnMatch.period,
    comment,
  };
}

async function main() {
  const source = readDataFileSource(dataPath);
  const dueOptions = getDueFixtureOptionsFromEnv();
  const dueFixtures = await getDueFixtures(source, dueOptions);
  const espnCache = new Map();
  const fotMobCache = { day: new Map(), detail: new Map() };
  const pendingEntries = [];
  const skipped = [];

  for (const fixture of dueFixtures) {
    let resolved;
    try {
      resolved = await resolveFinalResult(fixture, espnCache, fotMobCache);
    } catch (error) {
      skipped.push(
        `${fixture.id}: result lookup failed (${error instanceof Error ? error.message : error})`,
      );
      continue;
    }

    if (resolved.status !== 'ready') {
      skipped.push(`${fixture.id}: ${resolved.detail}`);
      continue;
    }

    pendingEntries.push(
      formatManualMatchEntry(fixture, resolved.goals, resolved.redCards, resolved.comment, {
        redsUnchecked: resolved.redsUnchecked === true,
      }),
    );

    console.log(
      `Will append ${fixture.id}: ${fixture.homeTla} ${resolved.goals.homeGoals}-${resolved.goals.awayGoals} ${fixture.awayTla} (${resolved.label})`,
    );
  }

  if (pendingEntries.length === 0) {
    console.log(
      `No final fixtures ready to sync (${dueFixtures.length} due, all waiting on ESPN/FWP).`,
    );
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
    console.log('Still waiting on finals for:');
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
