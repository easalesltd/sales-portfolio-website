/**
 * Shared checks that keep manual result ledgers aligned with fixture schedules.
 * Used by World Cup and English pyramid validate scripts.
 */

function validateManualMatchesAgainstFixtures(manualMatches, fixtures, errors, options = {}) {
  const fixturesById = new Map(fixtures.map((fixture) => [fixture.id, fixture]));
  const isKnockoutMatchId = options.isKnockoutMatchId ?? (() => false);
  const requireAllInFixtures = options.requireAllInFixtures ?? false;

  for (const match of manualMatches) {
    const fixture = fixturesById.get(match.id);
    if (!fixture) {
      if (requireAllInFixtures || isKnockoutMatchId(match.id)) {
        errors.push(
          `${match.id}: manual result is missing from the fixtures schedule (elimination/bracket logic will break)`,
        );
      }
      continue;
    }

    const homeTla = fixture.homeTla ?? fixture.homeTeam?.tla;
    const awayTla = fixture.awayTla ?? fixture.awayTeam?.tla;
    if (homeTla !== match.homeTla || awayTla !== match.awayTla) {
      errors.push(
        `${match.id}: manual teams (${match.homeTla} vs ${match.awayTla}) do not match fixture (${homeTla} vs ${awayTla})`,
      );
    }
  }
}

function validateOverdueFixturesWithoutResults(
  manualMatchIds,
  fixtures,
  now,
  bufferMinutes,
  errors,
) {
  for (const fixture of fixtures) {
    if (manualMatchIds.has(fixture.id)) continue;

    const homeTla = fixture.homeTla ?? fixture.homeTeam?.tla;
    const awayTla = fixture.awayTla ?? fixture.awayTeam?.tla;
    if (homeTla === 'TBD' || awayTla === 'TBD') continue;

    const kickoff = new Date(fixture.utcDate);
    if (Number.isNaN(kickoff.getTime())) {
      errors.push(`${fixture.id}: invalid fixture utcDate ${fixture.utcDate}`);
      continue;
    }

    const minutesSinceKickoff = (now.getTime() - kickoff.getTime()) / 60000;
    if (minutesSinceKickoff >= bufferMinutes) {
      errors.push(
        `${fixture.id}: kicked off ${Math.floor(minutesSinceKickoff)} minutes ago but has no manual result yet`,
      );
    }
  }
}

module.exports = {
  validateManualMatchesAgainstFixtures,
  validateOverdueFixturesWithoutResults,
};
