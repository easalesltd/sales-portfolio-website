#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const dataPath = path.join(repoRoot, 'app/data/english-pyramid-fantasy.ts');

// English league matches: 90 minutes plus stoppage often lands around 115–120 minutes.
const DEFAULT_UPDATE_DELAY_MINUTES = 115;
const DEFAULT_DUE_LEAD_MINUTES = 10;
const DEFAULT_LOOKBACK_MINUTES = 8 * 60;

const updateDelayMinutes = Number.parseInt(
  process.env.ENGLISH_PYRAMID_UPDATE_DELAY_MINUTES || `${DEFAULT_UPDATE_DELAY_MINUTES}`,
  10,
);
const dueLeadMinutes = Number.parseInt(
  process.env.ENGLISH_PYRAMID_DUE_LEAD_MINUTES || `${DEFAULT_DUE_LEAD_MINUTES}`,
  10,
);
const lookbackMinutes = Number.parseInt(
  process.env.ENGLISH_PYRAMID_DUE_LOOKBACK_MINUTES || `${DEFAULT_LOOKBACK_MINUTES}`,
  10,
);
const forceAgent = process.env.ENGLISH_PYRAMID_FORCE_AGENT === '1';
const now = process.env.ENGLISH_PYRAMID_NOW ? new Date(process.env.ENGLISH_PYRAMID_NOW) : new Date();

if (Number.isNaN(now.getTime())) {
  throw new Error(`Invalid ENGLISH_PYRAMID_NOW value: ${process.env.ENGLISH_PYRAMID_NOW}`);
}

const source = fs.readFileSync(dataPath, 'utf8');

function extractConstArray(name) {
  const match = source.match(
    new RegExp(`export const ${name}[^=]*= \\[([\\s\\S]*?)\\](?: as const)?;`)
  );
  if (!match) {
    throw new Error(`Unable to find ${name} in ${dataPath}`);
  }
  return match[1];
}

function parseFixtures() {
  const fixturesSource = extractConstArray('ENGLISH_PYRAMID_FIXTURES');
  const fixturePattern =
    /id: '([^']+)',\s*utcDate: '([^']+)',\s*homeTeam: \{ name: '([^']+)', tla: '([^']+)' \},\s*awayTeam: \{ name: '([^']+)', tla: '([^']+)' \}/g;

  return [...fixturesSource.matchAll(fixturePattern)].map((match) => ({
    id: match[1],
    utcDate: match[2],
    homeName: match[3],
    homeTla: match[4],
    awayName: match[5],
    awayTla: match[6],
  }));
}

function parseRecordedMatchIds() {
  const matchesSource = extractConstArray('ENGLISH_PYRAMID_MANUAL_MATCHES');
  return new Set([...matchesSource.matchAll(/id: '([^']+)'/g)].map((match) => match[1]));
}

function parseSweepstakeTeamCodes() {
  const teamTable = source.match(/export const ENGLISH_PYRAMID_TEAM_BY_CODE[\s\S]*?= \{([\s\S]*?)\n\};/);
  if (!teamTable) return [];
  return [...teamTable[1].matchAll(/^\s{2}([A-Z0-9]+): \{/gm)].map((match) => match[1]);
}

function formatFixture(fixture) {
  return `${fixture.id} (${fixture.utcDate}) ${fixture.homeTla} ${fixture.homeName} vs ${fixture.awayTla} ${fixture.awayName}`;
}

function setOutput(name, value) {
  const githubOutput = process.env.GITHUB_OUTPUT;
  if (!githubOutput) return;

  fs.appendFileSync(githubOutput, `${name}<<EOF\n${value}\nEOF\n`);
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

/**
 * UK league result windows in Europe/London (handles GMT/BST automatically).
 * Weekend: 12:30 / 15:00 / 17:30 / 19:45 KO batches → roughly 14:25–22:45 due.
 * Midweek: 19:45 / 20:00 KO → roughly 21:40–22:45 due.
 */
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

const fixtures = parseFixtures();
const recordedMatchIds = parseRecordedMatchIds();
const sweepstakeTeamCodes = parseSweepstakeTeamCodes();
const updateDelayMs = updateDelayMinutes * 60 * 1000;
const dueLeadMs = dueLeadMinutes * 60 * 1000;
const lookbackMs = lookbackMinutes * 60 * 1000;
const london = getLondonContext(now);
const ukWindow = getUkResultsWindow(london);

const dueFixtures = fixtures.filter((fixture) => {
  if (recordedMatchIds.has(fixture.id)) return false;

  const kickoff = new Date(fixture.utcDate);
  if (Number.isNaN(kickoff.getTime())) {
    throw new Error(`Invalid fixture utcDate for ${fixture.id}: ${fixture.utcDate}`);
  }

  const dueAt = new Date(kickoff.getTime() + updateDelayMs);
  return (
    dueAt.getTime() <= now.getTime() + dueLeadMs &&
    now.getTime() - dueAt.getTime() <= lookbackMs
  );
});

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

const hasDueFixtures = dueFixtures.length > 0;
const isDue = hasDueFixtures || matchdaySweepDue;
const fixtureList = hasDueFixtures
  ? dueFixtures.map(formatFixture).join('\n')
  : matchdaySweepMessage;

setOutput('due', isDue ? 'true' : 'false');
setOutput('forced', forceAgent ? 'true' : 'false');
setOutput('scan_mode', hasDueFixtures ? 'fixtures' : matchdaySweepDue ? 'matchday' : 'none');
setOutput('fixtures', fixtureList);
setOutput('update_delay_minutes', `${updateDelayMinutes}`);
setOutput('due_lead_minutes', `${dueLeadMinutes}`);
setOutput('lookback_minutes', `${lookbackMinutes}`);
setOutput('london_context', `${london.calendarDate} ${london.weekday} ${london.hour}:${String(london.minute).padStart(2, '0')} Europe/London`);
setOutput('uk_results_window', ukWindow.inWindow ? 'true' : 'false');

if (hasDueFixtures) {
  console.log(`English pyramid score agent is due for ${dueFixtures.length} fixture(s):`);
  console.log(fixtureList);
} else if (matchdaySweepDue) {
  console.log('English pyramid matchday sweep is due:');
  console.log(matchdaySweepMessage);
} else if (forceAgent) {
  console.log('English pyramid score agent forced by ENGLISH_PYRAMID_FORCE_AGENT=1.');
} else {
  console.log(
    `No unrecorded fixtures are due within the ${lookbackMinutes}-minute lookback window.`,
  );
  console.log(`London context: ${london.calendarDate} ${london.weekday} — ${ukWindow.label}.`);
}

console.log(`Expected result check delay: ${updateDelayMinutes} minutes after kick-off (UTC stored in fixtures).`);
console.log(`Due check lead window: ${dueLeadMinutes} minutes.`);
