/**
 * Offline ledger/fixture integrity: catch rearranged games left on a stale
 * date, missing past results, duplicate home+away rows, and short club lists.
 * Played-game totals can differ across managers when the calendar does;
 * they must not differ because a result was skipped.
 */

const {
  directedPairKey,
  expectedMatchesForTeamCode,
  londonCalendarDate,
  summarizePerTeam,
  TEAM_NAME_BY_CODE,
} = require('./english-pyramid-fixture-lib.cjs');

function parseFantasyPlayersFromSource(source) {
  const match = source.match(/export const ENGLISH_PYRAMID_FANTASY_PLAYERS[^=]*= \[([\s\S]*?)\];/);
  if (!match) {
    throw new Error('Unable to find ENGLISH_PYRAMID_FANTASY_PLAYERS');
  }
  return [...match[1].matchAll(/\{\s*id: '([^']+)',\s*name: '([^']+)',[\s\S]*?teams: \[([^\]]+)\]/g)].map(
    (entry) => ({
      id: entry[1],
      name: entry[2],
      teams: [...entry[3].matchAll(/'([^']+)'/g)].map((team) => team[1]),
    }),
  );
}

function collectDuplicateDirectedPairs(fixtures) {
  const byPair = new Map();
  for (const fixture of fixtures) {
    const key = directedPairKey(fixture);
    if (!byPair.has(key)) byPair.set(key, []);
    byPair.get(key).push(fixture);
  }

  return [...byPair.values()].filter((group) => group.length > 1);
}

function collectFixtureCountMismatches(fixtures) {
  const counts = summarizePerTeam(fixtures);
  const mismatches = [];
  for (const code of Object.keys(TEAM_NAME_BY_CODE).sort()) {
    const expected = expectedMatchesForTeamCode(code);
    if (expected == null) continue;
    const actual = counts[code] ?? 0;
    if (actual !== expected) {
      mismatches.push({
        code,
        name: TEAM_NAME_BY_CODE[code],
        actual,
        expected,
      });
    }
  }
  return mismatches;
}

function collectPastUnrecordedFixtures(fixtures, recordedIds, now = new Date()) {
  const today = londonCalendarDate(now.toISOString());
  if (!today) return [];

  return fixtures.filter((fixture) => {
    if (recordedIds.has(fixture.id) || fixture.postponed) return false;
    const day = londonCalendarDate(fixture.utcDate);
    return Boolean(day && day < today);
  });
}

function involvingClub(fixtures, code) {
  return fixtures.filter(
    (fixture) => fixture.homeTeam?.tla === code || fixture.awayTeam?.tla === code,
  );
}

function summarizePlayedGames(players, fixtures, recordedIds, now = new Date()) {
  const today = londonCalendarDate(now.toISOString());
  const managers = players.map((player) => {
    const clubs = player.teams.map((code) => {
      const rows = involvingClub(fixtures, code);
      const pastDueRows = rows.filter((fixture) => {
        const day = londonCalendarDate(fixture.utcDate);
        return Boolean(day && today && day < today && !fixture.postponed);
      });
      const recordedPast = pastDueRows.filter((fixture) => recordedIds.has(fixture.id)).length;
      const recordedFuture = rows.filter((fixture) => {
        const day = londonCalendarDate(fixture.utcDate);
        return recordedIds.has(fixture.id) && Boolean(day && today && day > today);
      }).length;
      return {
        code,
        recorded: recordedPast,
        pastDue: pastDueRows.length,
        recordedFuture,
        postponed: rows.filter((fixture) => fixture.postponed).length,
      };
    });

    return {
      id: player.id,
      name: player.name,
      recorded: clubs.reduce((sum, club) => sum + club.recorded, 0),
      pastDue: clubs.reduce((sum, club) => sum + club.pastDue, 0),
      postponed: clubs.reduce((sum, club) => sum + club.postponed, 0),
      gaps: clubs.filter((club) => club.recorded !== club.pastDue || club.recordedFuture > 0),
    };
  });

  return {
    today,
    managers,
    balanced: managers.every((manager) => manager.gaps.length === 0),
  };
}

function describeIntegrityErrors({ duplicates, countMismatches, pastUnrecorded }) {
  const errors = [];

  for (const group of duplicates) {
    const ids = group.map((fixture) => fixture.id).join(', ');
    const sample = group[0];
    const home = sample.homeTeam?.tla ?? sample.homeTla;
    const away = sample.awayTeam?.tla ?? sample.awayTla;
    errors.push(
      `${home} vs ${away} is listed ${group.length} times (${ids}). Rearranged league games must keep a single home+away row.`,
    );
  }

  for (const mismatch of countMismatches) {
    errors.push(
      `${mismatch.code} (${mismatch.name}) has ${mismatch.actual} league fixtures; expected ${mismatch.expected}.`,
    );
  }

  for (const fixture of pastUnrecorded) {
    const home = fixture.homeTeam?.tla ?? fixture.homeTla;
    const away = fixture.awayTeam?.tla ?? fixture.awayTla;
    errors.push(
      `${fixture.id}: ${home} vs ${away} has a past London date (${londonCalendarDate(fixture.utcDate)}) and no ledger result. Mark it postponed or record the score.`,
    );
  }

  return errors;
}

function formatPlayedGameAudit(summary) {
  const lines = [
    `Played club-games through ${summary.today} (London dates before today, postponed excluded):`,
  ];
  const ranked = [...summary.managers].sort(
    (a, b) => b.pastDue - a.pastDue || a.name.localeCompare(b.name),
  );
  for (const manager of ranked) {
    const mark = manager.gaps.length === 0 ? 'ok' : 'GAP';
    lines.push(
      `  ${manager.name} ${manager.recorded}/${manager.pastDue} recorded/past due (${mark})`,
    );
    for (const gap of manager.gaps) {
      const futureNote = gap.recordedFuture > 0 ? `, future recorded ${gap.recordedFuture}` : '';
      lines.push(`    ${gap.code}: recorded ${gap.recorded}, past due ${gap.pastDue}${futureNote}`);
    }
  }
  if (summary.balanced) {
    lines.push(
      'Every manager has a result for every past league fixture. Totals can still differ when clubs have had fewer Saturday/midweek dates.',
    );
  }
  return lines.join('\n');
}

module.exports = {
  collectDuplicateDirectedPairs,
  collectFixtureCountMismatches,
  collectPastUnrecordedFixtures,
  describeIntegrityErrors,
  formatPlayedGameAudit,
  parseFantasyPlayersFromSource,
  summarizePlayedGames,
};
