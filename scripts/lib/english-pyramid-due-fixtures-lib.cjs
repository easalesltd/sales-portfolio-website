/**
 * Shared due-fixture logic for English pyramid automation scripts.
 * Fixtures stay due until recorded (no lookback expiry).
 */

const fs = require('node:fs');
const path = require('node:path');
const { parseFixturesFromSource } = require('./english-pyramid-fixture-lib.cjs');
const {
  espnDateParamFromUtcDate,
  espnSlugForTeamCode,
  fetchEspnScoreboardForSlugAndDate,
  findEspnEventForFixture,
  parseEspnScoreboard,
} = require('./english-pyramid-espn-scoreboard.cjs');
const { isEspnFinalPeriod } = require('./world-cup-espn-finals.cjs');
const {
  formatKickoffDelayNote,
  isFixtureDueByKickoff,
  resolveEffectiveKickoff,
  shouldLookupEspnKickoff,
} = require('./espn-kickoff.cjs');

const repoRoot = path.resolve(__dirname, '../..');
const defaultDataPath = path.join(repoRoot, 'app/data/english-pyramid-fantasy.ts');

const DEFAULT_UPDATE_DELAY_MINUTES = 115;
const DEFAULT_DUE_LEAD_MINUTES = 10;

const IGNORED_ESPN_STATUSES = new Set([
  'scheduled',
  'postponed',
  'canceled',
  'cancelled',
  'delayed',
  'suspended',
]);

function readDataFileSource(dataPath = defaultDataPath) {
  return fs.readFileSync(dataPath, 'utf8');
}

function extractConstArray(source, name) {
  const match = source.match(
    new RegExp(`export const ${name}[^=]*= \\[([\\s\\S]*?)\\](?: as const)?;`),
  );
  if (!match) {
    throw new Error(`Unable to find ${name} in english-pyramid-fantasy.ts`);
  }
  return match[1];
}

function parseRecordedMatchIds(source) {
  const matchesSource = extractConstArray(source, 'ENGLISH_PYRAMID_MANUAL_MATCHES');
  return new Set([...matchesSource.matchAll(/id: '([^']+)'/g)].map((match) => match[1]));
}

function parseSweepstakeTeamCodes(source) {
  const teamTable = source.match(/export const ENGLISH_PYRAMID_TEAM_BY_CODE[\s\S]*?= \{([\s\S]*?)\n\};/);
  if (!teamTable) return [];
  return [...teamTable[1].matchAll(/^\s{2}([A-Z0-9]+): \{/gm)].map((match) => match[1]);
}

function getDueFixtureOptionsFromEnv() {
  const updateDelayMinutes = Number.parseInt(
    process.env.ENGLISH_PYRAMID_UPDATE_DELAY_MINUTES || `${DEFAULT_UPDATE_DELAY_MINUTES}`,
    10,
  );
  const dueLeadMinutes = Number.parseInt(
    process.env.ENGLISH_PYRAMID_DUE_LEAD_MINUTES || `${DEFAULT_DUE_LEAD_MINUTES}`,
    10,
  );
  const now = process.env.ENGLISH_PYRAMID_NOW
    ? new Date(process.env.ENGLISH_PYRAMID_NOW)
    : new Date();

  if (Number.isNaN(now.getTime())) {
    throw new Error(`Invalid ENGLISH_PYRAMID_NOW value: ${process.env.ENGLISH_PYRAMID_NOW}`);
  }

  return { updateDelayMinutes, dueLeadMinutes, now };
}

function listUnrecordedFixtures(source) {
  const fixtures = parseFixturesFromSource(source).map((fixture) => ({
    id: fixture.id,
    utcDate: fixture.utcDate,
    homeName: fixture.homeTeam.name,
    homeTla: fixture.homeTeam.tla,
    awayName: fixture.awayTeam.name,
    awayTla: fixture.awayTeam.tla,
  }));
  const recordedMatchIds = parseRecordedMatchIds(source);

  return fixtures.filter((fixture) => {
    if (recordedMatchIds.has(fixture.id)) return false;

    const kickoff = new Date(fixture.utcDate);
    if (Number.isNaN(kickoff.getTime())) {
      throw new Error(`Invalid fixture utcDate for ${fixture.id}: ${fixture.utcDate}`);
    }

    return true;
  });
}

async function resolveFixtureKickoff(fixture, now, updateDelayMinutes, cache) {
  const scheduledDue = isFixtureDueByKickoff(
    fixture.utcDate,
    now,
    updateDelayMinutes,
    DEFAULT_DUE_LEAD_MINUTES,
  );
  const needsLookup = shouldLookupEspnKickoff(fixture.utcDate, now, updateDelayMinutes);

  if (!needsLookup && !scheduledDue) {
    return resolveEffectiveKickoff(fixture.utcDate, null);
  }

  try {
    const espnMatch = await loadEspnEventsForFixture(fixture, cache);
    return resolveEffectiveKickoff(fixture.utcDate, espnMatch);
  } catch (error) {
    console.warn(
      `Unable to resolve ESPN kick-off for ${fixture.id}: ${
        error instanceof Error ? error.message : error
      }`,
    );
    return resolveEffectiveKickoff(fixture.utcDate, null);
  }
}

async function getDueFixtures(source, options = {}) {
  const {
    updateDelayMinutes = DEFAULT_UPDATE_DELAY_MINUTES,
    dueLeadMinutes = DEFAULT_DUE_LEAD_MINUTES,
    now = new Date(),
  } = options;

  const cache = new Map();
  const dueFixtures = [];

  for (const fixture of listUnrecordedFixtures(source)) {
    const kickoff = await resolveFixtureKickoff(fixture, now, updateDelayMinutes, cache);
    if (isFixtureDueByKickoff(kickoff.effectiveUtcDate, now, updateDelayMinutes, dueLeadMinutes)) {
      dueFixtures.push({ ...fixture, kickoff });
    }
  }

  return dueFixtures;
}

function formatFixture(fixture) {
  const delayNote = fixture.kickoff ? formatKickoffDelayNote(fixture.kickoff) : '';
  return `${fixture.id} (${fixture.utcDate}${delayNote}) ${fixture.homeTla} ${fixture.homeName} vs ${fixture.awayTla} ${fixture.awayName}`;
}

function espnSlugForFixture(fixture) {
  return espnSlugForTeamCode(fixture.homeTla) || espnSlugForTeamCode(fixture.awayTla);
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

async function formatDueFixturesWithEspnHints(dueFixtures, source) {
  const cache = new Map();
  const lines = [];

  for (const fixture of dueFixtures) {
    try {
      const espnMatch = await loadEspnEventsForFixture(fixture, cache);
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

function getLondonContext(date) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  const weekday = parts.weekday;
  const hour = Number.parseInt(parts.hour, 10);
  const minute = Number.parseInt(parts.minute, 10);
  const calendarDate = `${parts.year}-${parts.month}-${parts.day}`;

  return {
    weekday,
    hour,
    minute,
    minutesSinceMidnight: hour * 60 + minute,
    calendarDate,
  };
}

function londonKickoffDate(utcDate) {
  return getLondonContext(new Date(utcDate)).calendarDate;
}

function isWeekendLondon(weekday) {
  return weekday === 'Sat' || weekday === 'Sun';
}

function isMidweekLondon(weekday) {
  return weekday === 'Mon' || weekday === 'Tue' || weekday === 'Wed' || weekday === 'Thu' || weekday === 'Fri';
}

function getUkResultsWindow(london) {
  const { weekday, minutesSinceMidnight } = london;

  if (isWeekendLondon(weekday)) {
    if (minutesSinceMidnight >= 14 * 60 + 10 && minutesSinceMidnight <= 22 * 60 + 50) {
      return { inWindow: true, label: 'weekend matchday (Europe/London)' };
    }
  }

  if (isMidweekLondon(weekday)) {
    if (minutesSinceMidnight >= 21 * 60 && minutesSinceMidnight <= 22 * 60 + 50) {
      return { inWindow: true, label: 'midweek matchday (Europe/London)' };
    }
  }

  return { inWindow: false, label: 'outside UK results window' };
}

function isMatchdaySweepPhase(london) {
  const { weekday, minutesSinceMidnight } = london;

  if (isWeekendLondon(weekday)) {
    return minutesSinceMidnight >= 16 * 60 + 25 && minutesSinceMidnight <= 22 * 60 + 45;
  }

  if (isMidweekLondon(weekday)) {
    return minutesSinceMidnight >= 21 * 60 + 20 && minutesSinceMidnight <= 22 * 60 + 45;
  }

  return false;
}

function isMatchdaySweepSlot(date) {
  const minute = date.getUTCMinutes();
  return minute === 5 || minute === 35;
}

function getMatchdaySweepDue(source, dueFixtures, now) {
  const london = getLondonContext(now);
  const ukWindow = getUkResultsWindow(london);
  const fixtures = parseFixturesFromSource(source).map((fixture) => ({
    id: fixture.id,
    utcDate: fixture.utcDate,
    homeName: fixture.homeTeam.name,
    homeTla: fixture.homeTeam.tla,
    awayName: fixture.awayTeam.name,
    awayTla: fixture.awayTeam.tla,
  }));
  const recordedMatchIds = parseRecordedMatchIds(source);
  const sweepstakeTeamCodes = parseSweepstakeTeamCodes(source);

  const unrecordedKickoffsToday = fixtures.filter((fixture) => {
    if (recordedMatchIds.has(fixture.id)) return false;
    return londonKickoffDate(fixture.utcDate) === london.calendarDate;
  });

  const matchdaySweepDue =
    ukWindow.inWindow &&
    isMatchdaySweepPhase(london) &&
    isMatchdaySweepSlot(now) &&
    dueFixtures.length === 0 &&
    unrecordedKickoffsToday.length > 0;

  const matchdaySweepMessage = matchdaySweepDue
    ? [
        `Matchday sweep (${ukWindow.label}, London date ${london.calendarDate}).`,
        'Scan reliable UK sources (BBC Sport, Sky Sports, club sites, Flashscore) for full-time league results today across:',
        'Premier League, Championship, League One, League Two, National League, National League North, National League South.',
        `Check all ${sweepstakeTeamCodes.length} sweepstake clubs and append any newly finished games not already in ENGLISH_PYRAMID_MANUAL_MATCHES.`,
        `Unrecorded fixtures listed for today: ${unrecordedKickoffsToday.map(formatFixture).join('; ') || 'none listed — infer from results pages'}.`,
        `Team codes: ${sweepstakeTeamCodes.join(', ')}.`,
      ].join('\n')
    : '';

  return {
    london,
    ukWindow,
    matchdaySweepDue,
    matchdaySweepMessage,
    unrecordedKickoffsToday,
  };
}

module.exports = {
  DEFAULT_DUE_LEAD_MINUTES,
  DEFAULT_UPDATE_DELAY_MINUTES,
  formatDueFixturesWithEspnHints,
  formatFixture,
  getDueFixtureOptionsFromEnv,
  getDueFixtures,
  getLondonContext,
  getMatchdaySweepDue,
  getUkResultsWindow,
  listUnrecordedFixtures,
  parseRecordedMatchIds,
  parseSweepstakeTeamCodes,
  readDataFileSource,
  resolveFixtureKickoff,
};
