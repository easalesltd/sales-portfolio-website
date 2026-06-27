#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const dataPath = path.join(repoRoot, 'app/data/english-pyramid-fantasy.ts');

/** 2026/27 season — ignore prior-season dates ESPN still returns on some calendars. */
const SEASON_START_ISO = '2026-07-01T00:00:00Z';

const LEAGUE_SLUGS = ['eng.1', 'eng.2', 'eng.3', 'eng.4', 'eng.5'];

/** ESPN abbreviation → sweepstake code (per league slug). */
const ESPN_ABBREV_BY_SLUG = {
  'eng.1': { MNC: 'MCI', MAN: 'MUN', ARS: 'ARS', AVL: 'AVL', CHE: 'CHE', LIV: 'LIV', NEW: 'NEW' },
  'eng.2': { WHU: 'WHU', WOL: 'WOL', BUR: 'BUR', MID: 'MID', BIR: 'BIR', SHU: 'SHU', SOU: 'SOU' },
  'eng.3': { LEI: 'LEI', SHW: 'SHW', LTN: 'LUT', STO: 'STP', PLY: 'PLY', HUD: 'HUD', BOL: 'BOL' },
  'eng.4': { BAR: 'BAR', ROT: 'ROT', PTV: 'PVL', SAL: 'SAL', CHES: 'CHS', BRI: 'BRST', GRI: 'GRI' },
  'eng.5': { CAR: 'CAR', SOUT: 'STD', FGR: 'FGR', BOR: 'BORE', HAR: 'HPL', SCU: 'SCU', YORK: 'YOR' },
};

const TEAM_NAME_BY_CODE = {
  MCI: 'Manchester City',
  MUN: 'Manchester United',
  ARS: 'Arsenal',
  AVL: 'Aston Villa',
  CHE: 'Chelsea',
  LIV: 'Liverpool',
  NEW: 'Newcastle United',
  WHU: 'West Ham United',
  WOL: 'Wolverhampton Wanderers',
  BUR: 'Burnley',
  MID: 'Middlesbrough',
  BIR: 'Birmingham City',
  SHU: 'Sheffield United',
  SOU: 'Southampton',
  LEI: 'Leicester City',
  SHW: 'Sheffield Wednesday',
  LUT: 'Luton Town',
  STP: 'Stockport County',
  PLY: 'Plymouth Argyle',
  HUD: 'Huddersfield Town',
  BOL: 'Bolton Wanderers',
  BAR: 'Barnet',
  ROT: 'Rotherham United',
  PVL: 'Port Vale',
  SAL: 'Salford City',
  CHS: 'Chesterfield',
  BRST: 'Bristol Rovers',
  GRI: 'Grimsby Town',
  CAR: 'Carlisle United',
  STD: 'Southend United',
  FGR: 'Forest Green Rovers',
  BORE: 'Boreham Wood',
  HPL: 'Hartlepool United',
  SCU: 'Scunthorpe United',
  YOR: 'York City',
};

const OUR_CODES = new Set(Object.keys(TEAM_NAME_BY_CODE));

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`ESPN request failed (${response.status}): ${url}`);
  }
  return response.json();
}

function mapTeamCode(slug, abbrev) {
  if (!abbrev) return null;
  return ESPN_ABBREV_BY_SLUG[slug]?.[abbrev.trim().toUpperCase()] ?? null;
}

function fixtureId(utcDate, homeCode, awayCode) {
  const dateKey = utcDate.slice(0, 10);
  return `${dateKey}-${homeCode.toLowerCase()}-${awayCode.toLowerCase()}`;
}

async function fetchLeagueFixtures(slug) {
  const base = await fetchJson(
    `https://site.api.espn.com/apis/site/v2/sports/soccer/${slug}/scoreboard?limit=100`
  );
  const calendar = base.leagues?.[0]?.calendar ?? [];
  const fixtures = [];

  for (const calendarIso of calendar) {
    if (calendarIso < SEASON_START_ISO) continue;

    const ymd = calendarIso.slice(0, 10).replace(/-/g, '');
    const day = await fetchJson(
      `https://site.api.espn.com/apis/site/v2/sports/soccer/${slug}/scoreboard?dates=${ymd}&limit=100`
    );

    for (const event of day.events ?? []) {
      if (!event.date || event.date < SEASON_START_ISO) continue;

      const competition = event.competitions?.[0];
      if (!competition) continue;

      const home = competition.competitors?.find((entry) => entry.homeAway === 'home');
      const away = competition.competitors?.find((entry) => entry.homeAway === 'away');
      const homeCode = mapTeamCode(slug, home?.team?.abbreviation);
      const awayCode = mapTeamCode(slug, away?.team?.abbreviation);

      if (!homeCode || !awayCode) continue;
      if (!OUR_CODES.has(homeCode) && !OUR_CODES.has(awayCode)) continue;

      fixtures.push({
        id: fixtureId(event.date, homeCode, awayCode),
        utcDate: event.date,
        homeTeam: {
          name: TEAM_NAME_BY_CODE[homeCode] ?? home.team.displayName,
          tla: homeCode,
        },
        awayTeam: {
          name: TEAM_NAME_BY_CODE[awayCode] ?? away.team.displayName,
          tla: awayCode,
        },
      });
    }
  }

  return fixtures;
}

function formatFixtureBlock(fixtures) {
  const lines = fixtures.map((fixture) => {
    return `  {
    id: '${fixture.id}',
    utcDate: '${fixture.utcDate}',
    homeTeam: { name: '${fixture.homeTeam.name.replace(/'/g, "\\'")}', tla: '${fixture.homeTeam.tla}' },
    awayTeam: { name: '${fixture.awayTeam.name.replace(/'/g, "\\'")}', tla: '${fixture.awayTeam.tla}' },
  }`;
  });

  return `/** Sweepstake fixtures for our 28 ESPN-covered clubs (PL → L2). National League on ESPN when 2026/27 publishes; NL North/South add manually. Fetched ${new Date().toISOString().slice(0, 10)} via npm run english-pyramid:fetch-fixtures. */
export const ENGLISH_PYRAMID_FIXTURES: readonly EnglishPyramidFixture[] = [
${lines.join(',\n')},
];`;
}

function writeFixturesToDataFile(fixtures) {
  const source = fs.readFileSync(dataPath, 'utf8');
  const block = formatFixtureBlock(fixtures);
  const pattern =
    /\/\*\* Sweepstake fixtures[\s\S]*?\*\/\nexport const ENGLISH_PYRAMID_FIXTURES: readonly EnglishPyramidFixture\[\] = \[[\s\S]*?\];/;

  if (!pattern.test(source)) {
    throw new Error(`Unable to locate ENGLISH_PYRAMID_FIXTURES block in ${dataPath}`);
  }

  fs.writeFileSync(dataPath, source.replace(pattern, block));
}

async function main() {
  const write = process.argv.includes('--write');
  const allFixtures = [];

  for (const slug of LEAGUE_SLUGS) {
    const leagueFixtures = await fetchLeagueFixtures(slug);
    process.stderr.write(`${slug}: ${leagueFixtures.length} sweepstake fixtures\n`);
    allFixtures.push(...leagueFixtures);
  }

  allFixtures.sort((a, b) => a.utcDate.localeCompare(b.utcDate) || a.id.localeCompare(b.id));

  const seen = new Set();
  const uniqueFixtures = allFixtures.filter((fixture) => {
    if (seen.has(fixture.id)) return false;
    seen.add(fixture.id);
    return true;
  });

  if (uniqueFixtures.length === 0) {
    throw new Error('No fixtures returned from ESPN for the 2026/27 season.');
  }

  const firstDate = uniqueFixtures[0].utcDate.slice(0, 10);
  const lastDate = uniqueFixtures.at(-1).utcDate.slice(0, 10);

  process.stderr.write(
    `Total: ${uniqueFixtures.length} fixtures (${firstDate} → ${lastDate}). First matchday opens on ${firstDate}.\n`
  );
  process.stderr.write(
    'Note: National League North/South (14 clubs) are not on ESPN — add those fixtures manually when available.\n'
  );

  if (write) {
    writeFixturesToDataFile(uniqueFixtures);
    process.stderr.write(`Updated ${dataPath}\n`);
  } else {
    process.stdout.write(`${formatFixtureBlock(uniqueFixtures)}\n`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
