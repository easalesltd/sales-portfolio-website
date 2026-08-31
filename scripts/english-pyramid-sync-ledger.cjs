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
    let fwpError = null;
    try {
      const fwpMatch = await fetchFwpResultForFixture(fixture);
      if (fwpMatch) {
        let redCards = {
          homeRedCards: fwpMatch.homeRedCards,
          awayRedCards: fwpMatch.awayRedCards,
        };
        let redsUnchecked = true;
        let comment =
          'Verified final score (Football Web Pages sync). Red cards not verified on FWP — redsUnchecked.';

        try {
          const fotMobMatch = await fetchFotMobResultForFixture(fixture, fotMobCache);
          if (
            fotMobMatch &&
            fotMobMatch.homeGoals === fwpMatch.homeGoals &&
            fotMobMatch.awayGoals === fwpMatch.awayGoals
          ) {
            redCards = {
              homeRedCards: Math.max(redCards.homeRedCards, fotMobMatch.homeRedCards),
              awayRedCards: Math.max(redCards.awayRedCards, fotMobMatch.awayRedCards),
            };
            redsUnchecked = false;
            comment =
              redCards.homeRedCards > 0 || redCards.awayRedCards > 0
                ? 'Verified final score (Football Web Pages). Red cards from FotMob match details.'
                : 'Verified final score (Football Web Pages + FotMob). No red cards.';
          }
        } catch {
          // Keep the FWP score. Reds stay unchecked if FotMob is unavailable.
        }

        return {
          status: 'ready',
          goals: { homeGoals: fwpMatch.homeGoals, awayGoals: fwpMatch.awayGoals },
          redCards,
          redsUnchecked,
          label: `FWP ${fwpMatch.period}`,
          comment,
        };
      }
    } catch (error) {
      fwpError = error instanceof Error ? error.message : String(error);
    }

    try {
      const fotMobMatch = await fetchFotMobResultForFixture(fixture, fotMobCache);
      if (fotMobMatch) {
        return {
          status: 'ready',
          goals: { homeGoals: fotMobMatch.homeGoals, awayGoals: fotMobMatch.awayGoals },
          redCards: {
            homeRedCards: fotMobMatch.homeRedCards,
            awayRedCards: fotMobMatch.awayRedCards,
          },
          redsUnchecked: true,
          label: 'FT',
          comment: fwpError
            ? `Verified final score (FotMob; FWP unavailable: ${fwpError}). Red cards from FotMob — redsUnchecked.`
            : 'Verified final score (FotMob; FWP not final yet). Red cards from FotMob — redsUnchecked.',
        };
      }
    } catch (error) {
      const fotMobError = error instanceof Error ? error.message : String(error);
      return {
        status: 'waiting',
        detail: fwpError
          ? `FWP failed (${fwpError}); FotMob failed (${fotMobError})`
          : `FWP not final; FotMob failed (${fotMobError})`,
      };
    }

    return {
      status: 'waiting',
      detail: fwpError
        ? `FWP failed (${fwpError}); FotMob result not final yet`
        : 'FWP/FotMob result not final yet',
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
  const {
    applySchedulePatches,
    collectLivePatches,
    describePatches,
  } = require('./lib/english-pyramid-schedule-reconcile.cjs');

  let workingSource = source;
  try {
    const schedulePatches = await collectLivePatches(workingSource, { now: dueOptions.now });
    if (schedulePatches.length > 0) {
      console.log('Schedule drift before score sync:');
      for (const line of describePatches(schedulePatches)) {
        console.log(`- ${line}`);
      }
      if (writeChanges) {
        workingSource = applySchedulePatches(workingSource, schedulePatches);
        fs.writeFileSync(dataPath, workingSource, 'utf8');
        console.log('Updated fixture dates / postponements from live sources.');
      }
    }
  } catch (error) {
    console.warn(
      `Schedule reconcile failed (${error instanceof Error ? error.message : error}); continuing with local fixtures.`,
    );
  }

  const dueFixtures = await getDueFixtures(workingSource, dueOptions);
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

  const updatedSource = appendManualMatches(workingSource, pendingEntries);
  const appendedCount = updatedSource === workingSource ? 0 : pendingEntries.length;

  if (!writeChanges) {
    console.log(
      `Dry run: ${pendingEntries.length} fixture(s) ready` +
        `${appendedCount === 0 && pendingEntries.length > 0 ? ' (none new after dedupe)' : ''}. ` +
        `Re-run with --write to update the ledger.`,
    );
    return;
  }

  if (appendedCount === 0) {
    console.error(
      `Ready fixtures (${pendingEntries.length}) were filtered out before write — ledger parse/dedupe bug?`,
    );
    process.exitCode = 1;
    return;
  }

  fs.writeFileSync(dataPath, updatedSource, 'utf8');
  const remainingDue = await getDueFixtures(updatedSource, dueOptions);
  setOutput('synced_count', `${appendedCount}`);
  setOutput('remaining_due', `${remainingDue.length}`);
  console.log(`Appended ${appendedCount} English pyramid result(s) to the manual ledger.`);

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
