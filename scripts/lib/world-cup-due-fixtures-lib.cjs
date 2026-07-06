/**
 * Shared due-fixture logic for World Cup automation scripts.
 * Fixtures stay due until recorded (no lookback expiry).
 */

const {
  buildEspnAliasMap,
  findEspnMatchForFixture,
} = require('./world-cup-espn-scoreboard.cjs');
const { isEspnFinalPeriod } = require('./world-cup-espn-finals.cjs');
const { readDataFileSource, parseScheduleFixtures } = require('./world-cup-fixtures.cjs');

const DEFAULT_UPDATE_DELAY_MINUTES = 110;
const DEFAULT_DUE_LEAD_MINUTES = 0;

const IGNORED_ESPN_STATUSES = new Set([
  'scheduled',
  'postponed',
  'canceled',
  'cancelled',
  'delayed',
  'suspended',
]);

function parseRecordedMatchIds(source) {
  const matchesSource = source.match(
    /export const WORLD_CUP_FANTASY_MANUAL_MATCHES[\s\S]*?= \[([\s\S]*?)\n\](?: as const)?;/,
  );
  if (!matchesSource) {
    throw new Error('Unable to find WORLD_CUP_FANTASY_MANUAL_MATCHES in world-cup-fantasy.ts');
  }
  return new Set([...matchesSource[1].matchAll(/id: '([^']+)'/g)].map((match) => match[1]));
}

function getDueFixtureOptionsFromEnv() {
  const updateDelayMinutes = Number.parseInt(
    process.env.WORLD_CUP_UPDATE_DELAY_MINUTES || `${DEFAULT_UPDATE_DELAY_MINUTES}`,
    10,
  );
  const dueLeadMinutes = Number.parseInt(
    process.env.WORLD_CUP_DUE_LEAD_MINUTES || `${DEFAULT_DUE_LEAD_MINUTES}`,
    10,
  );
  const now = process.env.WORLD_CUP_NOW ? new Date(process.env.WORLD_CUP_NOW) : new Date();

  if (Number.isNaN(now.getTime())) {
    throw new Error(`Invalid WORLD_CUP_NOW value: ${process.env.WORLD_CUP_NOW}`);
  }

  return { updateDelayMinutes, dueLeadMinutes, now };
}

function getDueFixtures(source, options = {}) {
  const {
    updateDelayMinutes = DEFAULT_UPDATE_DELAY_MINUTES,
    dueLeadMinutes = DEFAULT_DUE_LEAD_MINUTES,
    now = new Date(),
  } = options;

  const fixtures = parseScheduleFixtures(source);
  const recordedMatchIds = parseRecordedMatchIds(source);
  const updateDelayMs = updateDelayMinutes * 60 * 1000;
  const dueLeadMs = dueLeadMinutes * 60 * 1000;

  return fixtures.filter((fixture) => {
    if (recordedMatchIds.has(fixture.id)) return false;
    if (fixture.homeTla === 'TBD' || fixture.awayTla === 'TBD') return false;

    const kickoff = new Date(fixture.utcDate);
    if (Number.isNaN(kickoff.getTime())) {
      throw new Error(`Invalid fixture utcDate for ${fixture.id}: ${fixture.utcDate}`);
    }

    const dueAt = new Date(kickoff.getTime() + updateDelayMs);
    return dueAt.getTime() <= now.getTime() + dueLeadMs;
  });
}

function formatFixture(fixture) {
  return `${fixture.id} (${fixture.utcDate}) ${fixture.homeTla} ${fixture.homeName} vs ${fixture.awayTla} ${fixture.awayName}`;
}

function formatEspnHint(fixture, espnMatch) {
  if (!espnMatch) return ' ESPN: no matching event yet.';

  const scoreLine = `${fixture.homeTla} ${espnMatch.homeGoals}-${espnMatch.awayGoals} ${fixture.awayTla}`;
  const finalTag = isEspnFinalPeriod(espnMatch.period) ? 'FINAL' : espnMatch.period;
  const redLine =
    espnMatch.homeRedCards === 0 && espnMatch.awayRedCards === 0
      ? 'reds: none'
      : `reds: ${fixture.homeTla} ${espnMatch.homeRedCards}, ${fixture.awayTla} ${espnMatch.awayRedCards}`;

  return ` ESPN: ${scoreLine} (${finalTag}); ${redLine}.`;
}

async function formatDueFixturesWithEspnHints(dueFixtures, source) {
  const aliasToCode = buildEspnAliasMap(source);
  const cache = new Map();
  const lines = [];

  for (const fixture of dueFixtures) {
    try {
      const espnMatch = await findEspnMatchForFixture(
        fixture,
        aliasToCode,
        cache,
        IGNORED_ESPN_STATUSES,
      );
      lines.push(`${formatFixture(fixture)}${formatEspnHint(fixture, espnMatch)}`);
    } catch (error) {
      lines.push(formatFixture(fixture));
      console.warn(
        `Unable to fetch ESPN hint for ${fixture.id}: ${
          error instanceof Error ? error.message : error
        }`,
      );
    }
  }

  return lines.join('\n');
}

module.exports = {
  DEFAULT_DUE_LEAD_MINUTES,
  DEFAULT_UPDATE_DELAY_MINUTES,
  formatDueFixturesWithEspnHints,
  formatFixture,
  getDueFixtureOptionsFromEnv,
  getDueFixtures,
  parseRecordedMatchIds,
};
