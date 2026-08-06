const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '../..');
const dataPath = path.join(repoRoot, 'app/data/english-pyramid-fantasy.ts');

/** 2026/27 season — ignore prior-season dates ESPN still returns on some calendars. */
const SEASON_START_ISO = '2026-07-01T00:00:00Z';

/** National League (eng.5) fixtures typically publish around this date each summer. */
const NATIONAL_LEAGUE_FIXTURES_RELEASE_DATE = '2026-07-10';

/**
 * National League sweepstake clubs on ESPN eng.5.
 * York City (YOR) promoted to League Two for 2026/27 — tracked under eng.4.
 */
const NL_SWEEPSTAKE_CODES = [
  'CAR',
  'STD',
  'FGR',
  'BORE',
  'HPL',
  'SCU',
  'BRW',
  'HRN',
  'WEA',
  'ALT',
  'ALD',
  'KID',
  'SUT',
  'TAM',
];

const LEAGUE_SLUGS = ['eng.1', 'eng.2', 'eng.3', 'eng.4', 'eng.5'];

/**
 * ESPN abbreviation → sweepstake code (our clubs only, per league slug).
 * Ambiguous abbrevs (e.g. HAR = Hartlepool and Harrogate) use ESPN_TEAM_ID_BY_SLUG instead.
 */
const ESPN_ABBREV_BY_SLUG = {
  'eng.1': {
    MNC: 'MCI',
    MAN: 'MUN',
    ARS: 'ARS',
    AVL: 'AVL',
    CHE: 'CHE',
    LIV: 'LIV',
    NEW: 'NEW',
    HUL: 'HUL',
    COV: 'COV',
    IPS: 'IPS',
    SUN: 'SUN',
    FUL: 'FUL',
    LEE: 'LEE',
    CRY: 'CRY',
  },
  'eng.2': {
    WHU: 'WHU',
    WOL: 'WOL',
    BUR: 'BUR',
    MID: 'MID',
    BIR: 'BIR',
    SHU: 'SHU',
    SOU: 'SOU',
    BOL: 'BOL',
    LCN: 'LIN',
    CHA: 'CHA',
    CAR: 'CDF',
    PNE: 'PNE',
    POR: 'POR',
    BLK: 'BLK',
  },
  'eng.3': {
    LEI: 'LEI',
    SHW: 'SHW',
    LTN: 'LUT',
    STO: 'STP',
    PLY: 'PLY',
    HUD: 'HUD',
    MKD: 'MKD',
    BRO: 'BRO',
    WIM: 'WIM',
    BRT: 'BTN',
    CAM: 'CAM',
    LEY: 'LEY',
    NCO: 'NCO',
    OXF: 'OXF',
  },
  'eng.4': {
    BAR: 'BAR',
    PTV: 'PVL',
    SAL: 'SAL',
    CHES: 'CHS',
    BRI: 'BRST',
    GRI: 'GRI',
    YORK: 'YOR',
    NEW: 'NWP',
    CHL: 'CHT',
    ACC: 'ACC',
    TRN: 'TRN',
    SHR: 'SHR',
    FLE: 'FLE',
    CRA: 'CRA',
  },
  'eng.5': {
    CAR: 'CAR',
    SOUT: 'STD',
    FGR: 'FGR',
    BOR: 'BORE',
    SCU: 'SCU',
    BRW: 'BRW',
    HOR: 'HRN',
    WEA: 'WEA',
    ALT: 'ALT',
    ALD: 'ALD',
    KID: 'KID',
    SUT: 'SUT',
    TAM: 'TAM',
  },
};

/** ESPN team id → sweepstake code when abbreviation alone is ambiguous. */
const ESPN_TEAM_ID_BY_SLUG = {
  'eng.4': { 315: 'YOR' }, // York City (abbrev YORK)
  'eng.5': { 323: 'HPL' }, // Hartlepool United (abbrev HAR; Harrogate is also HAR)
};

const TEAM_NAME_BY_CODE = {
  MCI: 'Manchester City',
  MUN: 'Manchester United',
  ARS: 'Arsenal',
  AVL: 'Aston Villa',
  CHE: 'Chelsea',
  LIV: 'Liverpool',
  NEW: 'Newcastle United',
  HUL: 'Hull City',
  COV: 'Coventry City',
  IPS: 'Ipswich Town',
  SUN: 'Sunderland',
  FUL: 'Fulham',
  LEE: 'Leeds United',
  CRY: 'Crystal Palace',
  WHU: 'West Ham United',
  WOL: 'Wolverhampton Wanderers',
  BUR: 'Burnley',
  MID: 'Middlesbrough',
  BIR: 'Birmingham City',
  SHU: 'Sheffield United',
  SOU: 'Southampton',
  LIN: 'Lincoln City',
  CHA: 'Charlton Athletic',
  CDF: 'Cardiff City',
  PNE: 'Preston North End',
  POR: 'Portsmouth',
  BLK: 'Blackburn Rovers',
  BOL: 'Bolton Wanderers',
  LEI: 'Leicester City',
  SHW: 'Sheffield Wednesday',
  LUT: 'Luton Town',
  STP: 'Stockport County',
  PLY: 'Plymouth Argyle',
  HUD: 'Huddersfield Town',
  MKD: 'Milton Keynes Dons',
  BRO: 'Bromley',
  WIM: 'AFC Wimbledon',
  BTN: 'Burton Albion',
  CAM: 'Cambridge United',
  LEY: 'Leyton Orient',
  NCO: 'Notts County',
  OXF: 'Oxford United',
  BAR: 'Barnet',
  PVL: 'Port Vale',
  SAL: 'Salford City',
  CHS: 'Chesterfield',
  BRST: 'Bristol Rovers',
  GRI: 'Grimsby Town',
  YOR: 'York City',
  NWP: 'Newport County',
  CHT: 'Cheltenham Town',
  ACC: 'Accrington Stanley',
  TRN: 'Tranmere Rovers',
  SHR: 'Shrewsbury Town',
  FLE: 'Fleetwood Town',
  CRA: 'Crawley Town',
  CAR: 'Carlisle United',
  STD: 'Southend United',
  FGR: 'Forest Green Rovers',
  BORE: 'Boreham Wood',
  HPL: 'Hartlepool United',
  SCU: 'Scunthorpe United',
  BRW: 'Barrow',
  HRN: 'Hornchurch',
  WEA: 'Wealdstone',
  ALT: 'Altrincham',
  ALD: 'Aldershot Town',
  KID: 'Kidderminster Harriers',
  SUT: 'Sutton United',
  TAM: 'Tamworth',
  SSH: 'South Shields',
  MAC: 'Macclesfield',
  MOR: 'Morecambe',
  WRK: 'Worksop Town',
  DAR: 'Darlington',
  BUX: 'Buxton',
  CHF: 'Chester FC',
  HEB: 'Hebburn Town',
  SPA: 'Spalding United',
  BED: 'Bedford Town',
  HBO: 'Harborough Town',
  HED: 'Hednesford Town',
  OXC: 'Oxford City',
  MAR: 'Marine',
  DAG: 'Dagenham & Redbridge',
  TOR: 'Torquay United',
  HOR: 'Horsham',
  WSM: 'Weston-super-Mare',
  MAI: 'Maidstone United',
  EBB: 'Ebbsfleet United',
  CLM: 'Chelmsford City',
  FNH: 'Farnham Town',
  AFT: 'AFC Totton',
  DOV: 'Dover Athletic',
  SBY: 'Salisbury',
  CHU: 'Chesham United',
  TON: 'Tonbridge Angels',
  WAH: 'Walton & Hersham',
};

const OUR_CODES = new Set(Object.keys(TEAM_NAME_BY_CODE));

/** Season slugs that are never league competition (cup / play-off). */
const CUP_SEASON_SLUG_PATTERN =
  /(cup|carabao|fa-|trophy|play-?off|preliminary|promotion-final|community-shield)/i;

const LEAGUE_SEASON_SLUG_PATTERN = /(regular-season|english-premier-league|league-one|league-two|national-league)/i;

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`ESPN request failed (${response.status}): ${url}`);
  }
  return response.json();
}

function fixtureId(utcDate, homeCode, awayCode) {
  const dateKey = utcDate.slice(0, 10);
  return `${dateKey}-${homeCode.toLowerCase()}-${awayCode.toLowerCase()}`;
}

function normalizeFixture(fixture) {
  return {
    id: fixture.id,
    utcDate: fixture.utcDate,
    homeTeam: {
      name: fixture.homeTeam.name,
      tla: fixture.homeTeam.tla.toUpperCase(),
    },
    awayTeam: {
      name: fixture.awayTeam.name,
      tla: fixture.awayTeam.tla.toUpperCase(),
    },
  };
}

function fixtureKey(fixture) {
  return `${fixture.utcDate}|${fixture.homeTeam.tla}|${fixture.awayTeam.tla}`;
}

async function fetchLeagueRoster(slug) {
  const payload = await fetchJson(
    `https://site.api.espn.com/apis/site/v2/sports/soccer/${slug}/teams?limit=100`
  );
  const roster = new Map();

  for (const entry of payload.sports?.[0]?.leagues?.[0]?.teams ?? []) {
    const abbrev = entry.team?.abbreviation?.trim().toUpperCase();
    if (!abbrev) continue;
    roster.set(abbrev, entry.team.displayName ?? entry.team.name ?? abbrev);
  }

  return roster;
}

function resolveOurCode(slug, competitor) {
  const teamId = String(competitor?.team?.id ?? '');
  const idMapped = ESPN_TEAM_ID_BY_SLUG[slug]?.[teamId];
  if (idMapped) return idMapped;

  const abbrev = competitor?.team?.abbreviation?.trim().toUpperCase();
  if (!abbrev) return null;
  return ESPN_ABBREV_BY_SLUG[slug]?.[abbrev] ?? null;
}

function resolveTeam(slug, competitor, roster) {
  const abbrev = competitor?.team?.abbreviation?.trim().toUpperCase();
  if (!abbrev || !roster.has(abbrev)) return null;

  const ourCode = resolveOurCode(slug, competitor);
  if (ourCode) {
    return {
      code: ourCode,
      name: TEAM_NAME_BY_CODE[ourCode] ?? competitor.team.displayName ?? competitor.team.name,
      isOurs: true,
    };
  }

  const displayName = competitor.team.displayName ?? competitor.team.name ?? abbrev;

  /**
   * ESPN reuses abbreviations across divisions. If an opponent’s abbrev matches one of
   * *our* codes for a different club (eng.3 Barnsley=BAR vs eng.4 Barnet=BAR), remap so
   * we never attribute the wrong club’s results to a sweepstake side.
   */
  const OPPONENT_ABBREV_COLLISION = {
    'eng.3': { BAR: 'BSL' }, // Barnsley — Barnet owns BAR in our L2 pool
  };
  const collisionCode = OPPONENT_ABBREV_COLLISION[slug]?.[abbrev];
  if (collisionCode || OUR_CODES.has(abbrev)) {
    return {
      code: collisionCode ?? `${abbrev}_OPP`,
      name: displayName,
      isOurs: false,
    };
  }

  // Opponents keep ESPN abbrev only — never alias across leagues (e.g. eng.4 NEW = Newport, not Newcastle).
  return {
    code: abbrev,
    name: displayName,
    isOurs: false,
  };
}

function isLeagueEvent(event, leagueId, roster) {
  const seasonSlug = event.season?.slug ?? '';
  if (!seasonSlug || CUP_SEASON_SLUG_PATTERN.test(seasonSlug)) return false;
  if (!LEAGUE_SEASON_SLUG_PATTERN.test(seasonSlug)) return false;

  const uid = event.uid ?? '';
  if (leagueId && uid && !uid.includes(`~l:${leagueId}~`)) return false;

  const competition = event.competitions?.[0];
  if (!competition) return false;

  const home = competition.competitors?.find((entry) => entry.homeAway === 'home');
  const away = competition.competitors?.find((entry) => entry.homeAway === 'away');
  const homeAbbrev = home?.team?.abbreviation?.trim().toUpperCase();
  const awayAbbrev = away?.team?.abbreviation?.trim().toUpperCase();

  if (!homeAbbrev || !awayAbbrev) return false;
  if (!roster.has(homeAbbrev) || !roster.has(awayAbbrev)) return false;

  return true;
}

async function fetchLeagueFixtures(slug) {
  const roster = await fetchLeagueRoster(slug);
  if (roster.size === 0) return { slug, fixtures: [], rosterSize: 0 };

  const base = await fetchJson(
    `https://site.api.espn.com/apis/site/v2/sports/soccer/${slug}/scoreboard?limit=100`
  );
  const leagueId = base.leagues?.[0]?.id;
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
      if (!isLeagueEvent(event, leagueId, roster)) continue;

      const competition = event.competitions?.[0];
      const home = competition.competitors?.find((entry) => entry.homeAway === 'home');
      const away = competition.competitors?.find((entry) => entry.homeAway === 'away');
      const homeTeam = resolveTeam(slug, home, roster);
      const awayTeam = resolveTeam(slug, away, roster);

      if (!homeTeam || !awayTeam) continue;
      if (!homeTeam.isOurs && !awayTeam.isOurs) continue;

      fixtures.push({
        ...normalizeFixture({
          id: fixtureId(event.date, homeTeam.code, awayTeam.code),
          utcDate: event.date,
          homeTeam: { name: homeTeam.name, tla: homeTeam.code },
          awayTeam: { name: awayTeam.name, tla: awayTeam.code },
        }),
        involvedOurCodes: [
          homeTeam.isOurs ? homeTeam.code : null,
          awayTeam.isOurs ? awayTeam.code : null,
        ].filter(Boolean),
      });
    }
  }

  return { slug, fixtures: filterCupFixtures(fixtures, slug), rosterSize: roster.size };
}

/** Drop single-meeting pairings (typical cup ties); league home + away = 2. */
function filterCupFixtures(fixtures, slug) {
  const ourCodesInSlug = new Set(Object.values(ESPN_ABBREV_BY_SLUG[slug] ?? {}));
  const pairCounts = new Map();

  for (const fixture of fixtures) {
    for (const ourCode of fixture.involvedOurCodes ?? []) {
      const opponentTla =
        fixture.homeTeam.tla === ourCode ? fixture.awayTeam.tla : fixture.homeTeam.tla;
      const pairKey = `${ourCode}|${opponentTla}`;
      pairCounts.set(pairKey, (pairCounts.get(pairKey) ?? 0) + 1);
    }
  }

  return fixtures.filter((fixture) =>
    (fixture.involvedOurCodes ?? []).every((ourCode) => {
      const opponentTla =
        fixture.homeTeam.tla === ourCode ? fixture.awayTeam.tla : fixture.homeTeam.tla;
      return pairCounts.get(`${ourCode}|${opponentTla}`) === 2;
    })
  );
}

/**
 * FWP (and occasional ESPN) keep the original Saturday listing after a match is
 * brought forward to Friday night. Collapse same home+away within 2 calendar
 * days, keeping the earlier kick-off (the real brought-forward fixture).
 */
function collapseRescheduledDuplicates(fixtures) {
  const byDirectedPair = new Map();
  for (const fixture of fixtures) {
    const key = `${fixture.homeTeam.tla}|${fixture.awayTeam.tla}`;
    if (!byDirectedPair.has(key)) byDirectedPair.set(key, []);
    byDirectedPair.get(key).push(fixture);
  }

  const dropIds = new Set();
  for (const list of byDirectedPair.values()) {
    if (list.length < 2) continue;
    list.sort((a, b) => a.utcDate.localeCompare(b.utcDate) || a.id.localeCompare(b.id));
    for (let i = 0; i < list.length - 1; i++) {
      const current = list[i];
      const next = list[i + 1];
      if (dropIds.has(current.id)) continue;
      const dayA = Date.parse(`${current.utcDate.slice(0, 10)}T00:00:00Z`);
      const dayB = Date.parse(`${next.utcDate.slice(0, 10)}T00:00:00Z`);
      if (!Number.isFinite(dayA) || !Number.isFinite(dayB)) continue;
      const dayDiff = Math.round((dayB - dayA) / 86_400_000);
      if (dayDiff >= 1 && dayDiff <= 2) {
        dropIds.add(next.id);
      }
    }
  }

  if (dropIds.size === 0) return fixtures;
  return fixtures.filter((fixture) => !dropIds.has(fixture.id));
}

async function fetchAllLeagueFixtures() {
  const { fetchAllNlnNlsFixtures } = require('./english-pyramid-fwp-nln-nls.cjs');

  const bySlug = {};
  const allFixtures = [];

  for (const slug of LEAGUE_SLUGS) {
    const result = await fetchLeagueFixtures(slug);
    bySlug[slug] = result.fixtures.length;
    allFixtures.push(...result.fixtures);
  }

  const nlnNls = await fetchAllNlnNlsFixtures();
  bySlug['fwp.nln-nls'] = nlnNls.fixtures.length;
  allFixtures.push(...nlnNls.fixtures);

  allFixtures.sort((a, b) => a.utcDate.localeCompare(b.utcDate) || a.id.localeCompare(b.id));

  const seen = new Set();
  const uniqueFixtures = allFixtures.filter((fixture) => {
    if (seen.has(fixture.id)) return false;
    seen.add(fixture.id);
    return true;
  });

  const fixtures = collapseRescheduledDuplicates(uniqueFixtures);
  return { fixtures, bySlug, nlnNlsByCode: nlnNls.byCode };
}

function readDataFileSource() {
  return fs.readFileSync(dataPath, 'utf8');
}

function parseFixturesFromSource(source = readDataFileSource()) {
  const block = source.match(
    /export const ENGLISH_PYRAMID_FIXTURES: readonly EnglishPyramidFixture\[\] = \[([\s\S]*?)\];/
  );
  if (!block) {
    throw new Error(`Unable to locate ENGLISH_PYRAMID_FIXTURES in ${dataPath}`);
  }

  const fixturePattern =
    /id: '([^']+)',\s*utcDate: '([^']+)',\s*homeTeam: \{ name: '((?:\\'|[^'])*)', tla: '([^']+)' \},\s*awayTeam: \{ name: '((?:\\'|[^'])*)', tla: '([^']+)' \}/g;

  return [...block[1].matchAll(fixturePattern)].map((match) =>
    normalizeFixture({
      id: match[1],
      utcDate: match[2],
      homeTeam: { name: match[3].replace(/\\'/g, "'"), tla: match[4] },
      awayTeam: { name: match[5].replace(/\\'/g, "'"), tla: match[6] },
    })
  );
}

function formatFixtureBlock(fixtures, fetchedOn = new Date().toISOString().slice(0, 10)) {
  const lines = fixtures.map((fixture) => {
    return `  {
    id: '${fixture.id}',
    utcDate: '${fixture.utcDate}',
    homeTeam: { name: '${fixture.homeTeam.name.replace(/'/g, "\\'")}', tla: '${fixture.homeTeam.tla}' },
    awayTeam: { name: '${fixture.awayTeam.name.replace(/'/g, "\\'")}', tla: '${fixture.awayTeam.tla}' },
  }`;
  });

  return `/** Sweepstake fixtures for all 98 clubs (PL → NL South; title + survival drafts). ESPN covers PL→NL; NL North/South from Football Web Pages. League matches only — cup ties excluded. Fetched ${fetchedOn} via npm run english-pyramid:fetch-fixtures. */
export const ENGLISH_PYRAMID_FIXTURES: readonly EnglishPyramidFixture[] = [
${lines.join(',\n')},
];`;
}

function writeFixturesToDataFile(fixtures) {
  const source = readDataFileSource();
  const block = formatFixtureBlock(fixtures);
  const pattern =
    /\/\*\* Sweepstake fixtures[\s\S]*?\*\/\nexport const ENGLISH_PYRAMID_FIXTURES: readonly EnglishPyramidFixture\[\] = \[[\s\S]*?\];/;

  if (!pattern.test(source)) {
    throw new Error(`Unable to locate ENGLISH_PYRAMID_FIXTURES block in ${dataPath}`);
  }

  fs.writeFileSync(dataPath, source.replace(pattern, block));
}

function compareFixtureLists(localFixtures, remoteFixtures) {
  const localById = new Map(localFixtures.map((fixture) => [fixture.id, fixture]));
  const remoteById = new Map(remoteFixtures.map((fixture) => [fixture.id, fixture]));

  const added = [];
  const removed = [];
  const rescheduled = [];

  for (const [id, remote] of remoteById) {
    const local = localById.get(id);
    if (!local) {
      added.push(remote);
      continue;
    }
    if (fixtureKey(local) !== fixtureKey(remote)) {
      rescheduled.push({ before: local, after: remote });
    }
  }

  for (const [id, local] of localById) {
    if (!remoteById.has(id)) {
      removed.push(local);
    }
  }

  // Same teams but new kick-off (id includes date) — surface as added+removed pairs too.
  const addedKeys = new Set(added.map((fixture) => `${fixture.homeTeam.tla}|${fixture.awayTeam.tla}`));
  for (const fixture of removed) {
    addedKeys.add(`${fixture.homeTeam.tla}|${fixture.awayTeam.tla}`);
  }

  return { added, removed, rescheduled, changed: added.length + removed.length + rescheduled.length > 0 };
}

/** Abbrevs reused across divisions on ESPN (Cardiff vs Carlisle, Newport vs Newcastle). */
const AMBIGUOUS_OPPONENT_ABBREVS = new Set(['CAR', 'NEW']);

function isOurSweepstakeClub(team) {
  return OUR_CODES.has(team.tla) && TEAM_NAME_BY_CODE[team.tla] === team.name;
}

function isSweepstakeClubSide(team, fixture) {
  if (!isOurSweepstakeClub(team)) return false;

  const ourDivision = SWEEPSTAKE_DIVISION_BY_CODE[team.tla];
  const other = team.tla === fixture.homeTeam.tla ? fixture.awayTeam : fixture.homeTeam;

  // Two of our clubs in different divisions can share an ESPN abbrev collision path;
  // still count each named side when both resolve as ours.
  if (
    AMBIGUOUS_OPPONENT_ABBREVS.has(other.tla) &&
    isOurSweepstakeClub(other) &&
    SWEEPSTAKE_DIVISION_BY_CODE[other.tla] !== ourDivision
  ) {
    return true;
  }

  // Same-division sweepstake derbies count for both sides.
  if (isOurSweepstakeClub(other)) {
    return SWEEPSTAKE_DIVISION_BY_CODE[other.tla] === ourDivision;
  }

  // Name match already distinguishes Carlisle/Newcastle from Cardiff/Newport opponents.
  return true;
}

function summarizePerTeam(fixtures) {
  const counts = {};
  for (const fixture of fixtures) {
    const ourTeams =
      fixture.involvedOurCodes ??
      [fixture.homeTeam, fixture.awayTeam]
        .filter((team) => isSweepstakeClubSide(team, fixture))
        .map((team) => team.tla);
    for (const team of ourTeams) {
      counts[team] = (counts[team] ?? 0) + 1;
    }
  }
  return counts;
}

/** Expected league matches per sweepstake club (38 PL, 46 elsewhere). */
const EXPECTED_LEAGUE_MATCHES_BY_DIVISION = {
  PL: 38,
  CH: 46,
  L1: 46,
  L2: 46,
  NL: 46,
  NLN: 46,
  NLS: 46,
};

function expectedMatchesForTeamCode(code) {
  const teamDivision = SWEEPSTAKE_DIVISION_BY_CODE[code];
  return teamDivision ? EXPECTED_LEAGUE_MATCHES_BY_DIVISION[teamDivision] : null;
}

function utcDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function isOnOrAfterNlReleaseDate(now = new Date()) {
  return utcDateKey(now) >= NATIONAL_LEAGUE_FIXTURES_RELEASE_DATE;
}

function summarizeNlFixtureStatus(localFixtures, remoteFixtures, now = new Date()) {
  const localCounts = summarizePerTeam(localFixtures);
  const remoteCounts = summarizePerTeam(remoteFixtures);
  const missingLocal = NL_SWEEPSTAKE_CODES.filter((code) => (localCounts[code] ?? 0) === 0);
  const availableRemote = NL_SWEEPSTAKE_CODES.filter((code) => (remoteCounts[code] ?? 0) > 0);
  const pendingRelease = !isOnOrAfterNlReleaseDate(now);
  const awaitingEspn =
    isOnOrAfterNlReleaseDate(now) && missingLocal.length > 0 && availableRemote.length === 0;
  const readyToImport =
    isOnOrAfterNlReleaseDate(now) &&
    availableRemote.some((code) => (localCounts[code] ?? 0) < (remoteCounts[code] ?? 0));

  return {
    releaseDate: NATIONAL_LEAGUE_FIXTURES_RELEASE_DATE,
    pendingRelease,
    awaitingEspn,
    readyToImport,
    missingLocal,
    availableRemote,
  };
}

const SWEEPSTAKE_DIVISION_BY_CODE = {
  MCI: 'PL', MUN: 'PL', ARS: 'PL', AVL: 'PL', CHE: 'PL', LIV: 'PL', NEW: 'PL',
  WHU: 'CH', WOL: 'CH', BUR: 'CH', MID: 'CH', BIR: 'CH', SHU: 'CH', SOU: 'CH', BOL: 'CH',
  LEI: 'L1', SHW: 'L1', LUT: 'L1', STP: 'L1', PLY: 'L1', HUD: 'L1',
  BAR: 'L2', ROT: 'L2', PVL: 'L2', SAL: 'L2', CHS: 'L2', BRST: 'L2', GRI: 'L2', YOR: 'L2',
  CAR: 'NL', STD: 'NL', FGR: 'NL', BORE: 'NL', HPL: 'NL', SCU: 'NL',
  SSH: 'NLN', MAC: 'NLN', MER: 'NLN', WRK: 'NLN', DAR: 'NLN', BUX: 'NLN', CHF: 'NLN',
  DAG: 'NLS', TOR: 'NLS', HOR: 'NLS', WSM: 'NLS', MAI: 'NLS', EBB: 'NLS', CLM: 'NLS',
};

module.exports = {
  CUP_SEASON_SLUG_PATTERN,
  dataPath,
  ESPN_ABBREV_BY_SLUG,
  ESPN_TEAM_ID_BY_SLUG,
  LEAGUE_SLUGS,
  NL_SWEEPSTAKE_CODES,
  NATIONAL_LEAGUE_FIXTURES_RELEASE_DATE,
  OUR_CODES,
  SEASON_START_ISO,
  TEAM_NAME_BY_CODE,
  collapseRescheduledDuplicates,
  compareFixtureLists,
  fetchAllLeagueFixtures,
  fetchLeagueFixtures,
  formatFixtureBlock,
  isOnOrAfterNlReleaseDate,
  parseFixturesFromSource,
  expectedMatchesForTeamCode,
  resolveOurCode,
  summarizeNlFixtureStatus,
  summarizePerTeam,
  writeFixturesToDataFile,
};
