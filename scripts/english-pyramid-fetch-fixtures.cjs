#!/usr/bin/env node

const {
  fetchAllLeagueFixtures,
  formatFixtureBlock,
  summarizePerTeam,
  expectedMatchesForTeamCode,
  TEAM_NAME_BY_CODE,
  writeFixturesToDataFile,
} = require('./lib/english-pyramid-fixture-lib.cjs');

async function main() {
  const write = process.argv.includes('--write');
  const { fixtures, bySlug } = await fetchAllLeagueFixtures();

  if (fixtures.length === 0) {
    throw new Error('No league fixtures returned from ESPN for the 2026/27 season.');
  }

  for (const [slug, count] of Object.entries(bySlug)) {
    process.stderr.write(`${slug}: ${count} sweepstake league fixtures\n`);
  }

  const firstDate = fixtures[0].utcDate.slice(0, 10);
  const lastDate = fixtures.at(-1).utcDate.slice(0, 10);
  const perTeam = summarizePerTeam(fixtures);
  const countWarnings = Object.keys(TEAM_NAME_BY_CODE)
    .map((code) => {
      const expected = expectedMatchesForTeamCode(code);
      const actual = perTeam[code] ?? 0;
      if (expected == null || actual === 0) return null;
      if (actual !== expected) return `${code}=${actual} (expected ${expected})`;
      return null;
    })
    .filter(Boolean);

  process.stderr.write(
    `Per sweepstake club: ${Object.entries(perTeam)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([code, count]) => `${code}=${count}`)
      .join(', ')}\n`
  );
  process.stderr.write(
    `Total: ${fixtures.length} league fixtures (${firstDate} → ${lastDate}). First matchday opens on ${firstDate}.\n`
  );
  process.stderr.write(`First fixture: ${fixtures[0].id} (${fixtures[0].utcDate})\n`);
  if (countWarnings.length > 0) {
    process.stderr.write(`Count warnings (ESPN gaps): ${countWarnings.join(', ')}\n`);
  }
  process.stderr.write(
    `Note: National League (eng.5) fixtures usually publish around 10 July — GitHub Actions polls ESPN 10–20 July and weekly thereafter. NL North/South (14 clubs) are not on ESPN; add those fixtures manually when available.\n`
  );
  process.stderr.write('Cup ties are excluded — league competition only.\n');

  if (write) {
    writeFixturesToDataFile(fixtures);
    process.stderr.write(`Updated app/data/english-pyramid-fantasy.ts\n`);
  } else {
    process.stdout.write(`${formatFixtureBlock(fixtures)}\n`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
