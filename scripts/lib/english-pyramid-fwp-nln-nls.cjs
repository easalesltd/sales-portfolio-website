/**
 * National League North / South fixtures via Football Web Pages HTML
 * (not on ESPN). Team pages: https://www.footballwebpages.co.uk/{slug}/fixtures-results
 */

const FWP_ORIGIN = 'https://www.footballwebpages.co.uk';

/** Our 14 NLN/NLS sweepstake clubs → FWP URL slug. */
const FWP_SLUG_BY_CODE = {
  SSH: 'south-shields',
  MAC: 'macclesfield',
  MER: 'merthyr-town',
  WRK: 'worksop-town',
  DAR: 'darlington',
  BUX: 'buxton',
  CHF: 'chester',
  DAG: 'dagenham-and-redbridge',
  TOR: 'torquay-united',
  HOR: 'horsham',
  WSM: 'weston-super-mare',
  MAI: 'maidstone-united',
  EBB: 'ebbsfleet-united',
  CLM: 'chelmsford-city',
};

const FWP_LEAGUE_COMP_BY_CODE = {
  SSH: 'national-league-north',
  MAC: 'national-league-north',
  MER: 'national-league-north',
  WRK: 'national-league-north',
  DAR: 'national-league-north',
  BUX: 'national-league-north',
  CHF: 'national-league-north',
  DAG: 'national-league-south',
  TOR: 'national-league-south',
  HOR: 'national-league-south',
  WSM: 'national-league-south',
  MAI: 'national-league-south',
  EBB: 'national-league-south',
  CLM: 'national-league-south',
};

/**
 * FWP slug → sweepstake / opponent TLA.
 * Avoid collisions with ESPN-covered OUR codes (SOU Southampton, SAL Salford, etc.).
 */
const FWP_CODE_BY_SLUG = {
  // NL North — ours
  'south-shields': 'SSH',
  macclesfield: 'MAC',
  'merthyr-town': 'MER',
  'worksop-town': 'WRK',
  darlington: 'DAR',
  buxton: 'BUX',
  chester: 'CHF',
  // NL North — opponents
  'afc-telford-united': 'TEL',
  'bedford-town': 'BED',
  'brackley-town': 'BRK',
  chorley: 'CHO',
  'harborough-town': 'HBO',
  'hebburn-town': 'HEB',
  'hednesford-town': 'HED',
  hereford: 'HER',
  'kings-lynn-town': 'KLT',
  marine: 'MAR',
  morecambe: 'MOR',
  'oxford-city': 'OXC',
  radcliffe: 'RAD',
  'scarborough-athletic': 'SCA',
  southport: 'SPT',
  'spalding-united': 'SPA',
  'spennymoor-town': 'SPE',
  // NL South — ours
  'dagenham-and-redbridge': 'DAG',
  'torquay-united': 'TOR',
  horsham: 'HOR',
  'weston-super-mare': 'WSM',
  'maidstone-united': 'MAI',
  'ebbsfleet-united': 'EBB',
  'chelmsford-city': 'CLM',
  // NL South — opponents
  'afc-totton': 'AFT',
  'billericay-town': 'BIL',
  'braintree-town': 'BRT',
  'chesham-united': 'CHU',
  'dorking-wanderers': 'DOR',
  'dover-athletic': 'DOV',
  farnborough: 'FAR',
  'farnham-town': 'FNH',
  'folkestone-invicta': 'FOL',
  'hampton-and-richmond-borough': 'HRB',
  'hemel-hempstead-town': 'HEM',
  'maidenhead-united': 'MDH',
  salisbury: 'SBY',
  'slough-town': 'SLO',
  'tonbridge-angels': 'TON',
  'truro-city': 'TRU',
  'walton-and-hersham': 'WAH',
};

const FWP_NAME_BY_SLUG = {
  'south-shields': 'South Shields',
  macclesfield: 'Macclesfield',
  'merthyr-town': 'Merthyr Town',
  'worksop-town': 'Worksop Town',
  darlington: 'Darlington',
  buxton: 'Buxton',
  chester: 'Chester FC',
  'afc-telford-united': 'AFC Telford United',
  'bedford-town': 'Bedford Town',
  'brackley-town': 'Brackley Town',
  chorley: 'Chorley',
  'harborough-town': 'Harborough Town',
  'hebburn-town': 'Hebburn Town',
  'hednesford-town': 'Hednesford Town',
  hereford: 'Hereford',
  'kings-lynn-town': "King's Lynn Town",
  marine: 'Marine',
  morecambe: 'Morecambe',
  'oxford-city': 'Oxford City',
  radcliffe: 'Radcliffe',
  'scarborough-athletic': 'Scarborough Athletic',
  southport: 'Southport',
  'spalding-united': 'Spalding United',
  'spennymoor-town': 'Spennymoor Town',
  'dagenham-and-redbridge': 'Dagenham & Redbridge',
  'torquay-united': 'Torquay United',
  horsham: 'Horsham',
  'weston-super-mare': 'Weston-super-Mare',
  'maidstone-united': 'Maidstone United',
  'ebbsfleet-united': 'Ebbsfleet United',
  'chelmsford-city': 'Chelmsford City',
  'afc-totton': 'AFC Totton',
  'billericay-town': 'Billericay Town',
  'braintree-town': 'Braintree Town',
  'chesham-united': 'Chesham United',
  'dorking-wanderers': 'Dorking Wanderers',
  'dover-athletic': 'Dover Athletic',
  farnborough: 'Farnborough',
  'farnham-town': 'Farnham Town',
  'folkestone-invicta': 'Folkestone Invicta',
  'hampton-and-richmond-borough': 'Hampton & Richmond Borough',
  'hemel-hempstead-town': 'Hemel Hempstead Town',
  'maidenhead-united': 'Maidenhead United',
  salisbury: 'Salisbury',
  'slough-town': 'Slough Town',
  'tonbridge-angels': 'Tonbridge Angels',
  'truro-city': 'Truro City',
  'walton-and-hersham': 'Walton & Hersham',
};

const OUR_NLN_NLS_CODES = new Set(Object.keys(FWP_SLUG_BY_CODE));

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'text/html',
      'User-Agent':
        'Mozilla/5.0 (compatible; english-pyramid-fixtures/1.0; +https://github.com/easalesltd/sales-portfolio-website)',
    },
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`FWP request failed (${response.status}): ${url}`);
  }
  return response.text();
}

function parseKoToMinutes(ko) {
  const raw = String(ko || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '');
  const match = raw.match(/^(\d{1,2})(?:[.:](\d{2}))?(am|pm)$/);
  if (!match) {
    throw new Error(`Unrecognised FWP kick-off time: ${ko}`);
  }
  let hour = Number(match[1]);
  const minute = Number(match[2] || '0');
  const meridiem = match[3];
  if (meridiem === 'pm' && hour !== 12) hour += 12;
  if (meridiem === 'am' && hour === 12) hour = 0;
  return hour * 60 + minute;
}

/** Convert a Europe/London wall time to UTC ISO-8601 (…Z). */
function londonLocalToUtcIso(day, month, year, hour, minute) {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0);
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });

  const asMap = (date) => {
    const parts = formatter.formatToParts(date);
    return Object.fromEntries(parts.filter((p) => p.type !== 'literal').map((p) => [p.type, p.value]));
  };

  let utcMs = utcGuess;
  for (let i = 0; i < 3; i += 1) {
    const map = asMap(new Date(utcMs));
    const asLocalMs = Date.UTC(
      Number(map.year),
      Number(map.month) - 1,
      Number(map.day),
      Number(map.hour),
      Number(map.minute),
      Number(map.second)
    );
    const desiredLocalMs = Date.UTC(year, month - 1, day, hour, minute, 0);
    utcMs -= asLocalMs - desiredLocalMs;
  }

  return new Date(utcMs).toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function parseUkDateToUtcIso(dateExport, koText) {
  const dateMatch = String(dateExport).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!dateMatch) {
    throw new Error(`Unrecognised FWP date: ${dateExport}`);
  }
  const day = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const year = Number(dateMatch[3]);
  const totalMinutes = parseKoToMinutes(koText);
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return londonLocalToUtcIso(day, month, year, hour, minute);
}

function fixtureId(utcDate, homeCode, awayCode) {
  return `${utcDate.slice(0, 10)}-${homeCode.toLowerCase()}-${awayCode.toLowerCase()}`;
}

function decodeHtmlEntities(value) {
  return String(value)
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

function isFwpScoreText(text) {
  return /^\d+\s*-\s*\d+$/.test(String(text || '').trim());
}

function parseScorePair(text) {
  const match = String(text || '')
    .trim()
    .match(/^(\d+)\s*-\s*(\d+)$/);
  if (!match) return null;
  return { left: Number(match[1]), right: Number(match[2]) };
}

/**
 * Finished FWP team-page rows use title "Home 1-0 Away".
 * The ko-score cell is viewed-team first (not always home-away).
 */
function parseFinishedHomeAwayGoals(title, koText, venue) {
  const decodedTitle = decodeHtmlEntities(title);
  const titleScore = decodedTitle.match(/^(.+?)\s+(\d+)\s*-\s*(\d+)\s+(.+)$/);
  if (titleScore) {
    return {
      homeGoals: Number(titleScore[2]),
      awayGoals: Number(titleScore[3]),
      final: true,
      source: 'title',
    };
  }

  const pair = parseScorePair(koText);
  if (!pair) return { final: false };

  if (venue === 'H') {
    return { homeGoals: pair.left, awayGoals: pair.right, final: true, source: 'ko-home' };
  }
  if (venue === 'A') {
    return { homeGoals: pair.right, awayGoals: pair.left, final: true, source: 'ko-away' };
  }

  return { final: false };
}

function resolveTeamFromSlug(slug) {
  const code = FWP_CODE_BY_SLUG[slug];
  if (!code) {
    throw new Error(`Unknown FWP team slug (add to FWP_CODE_BY_SLUG): ${slug}`);
  }
  return {
    code,
    name: FWP_NAME_BY_SLUG[slug] || slug,
    isOurs: OUR_NLN_NLS_CODES.has(code),
  };
}

function slugForTeamCode(code) {
  return FWP_SLUG_BY_CODE[code] || null;
}

function parseTeamFixtureRows(html, expectedCompSlug) {
  const rows = [];
  const rowPattern = /<tr[^>]*title="([^"]+)" data-href="(match\/[^"]+)"[^>]*>(.*?)<\/tr>/gs;

  for (const match of html.matchAll(rowPattern)) {
    const title = decodeHtmlEntities(match[1]);
    const href = match[2];
    const body = match[3];
    const parts = href.split('/');
    // match / 2026-2027 / comp / home-slug / away-slug / id
    if (parts.length < 6 || parts[0] !== 'match') continue;
    const compSlug = parts[2];
    if (compSlug !== expectedCompSlug) continue;

    const homeSlug = parts[3];
    const awaySlug = parts[4];
    const dateMatch = body.match(/data-export="(\d{1,2}\/\d{1,2}\/\d{4})"/);
    const koMatch = body.match(/class="ko-score"[^>]*>([^<]+)/);
    const venueMatch = body.match(/class="[^"]*venue[^"]*"[^>]*>([^<]+)/);
    if (!dateMatch || !koMatch) {
      throw new Error(`FWP row missing date/kick-off: ${href}`);
    }

    rows.push({
      title,
      href,
      homeSlug,
      awaySlug,
      dateExport: dateMatch[1],
      koText: decodeHtmlEntities(koMatch[1]),
      venue: venueMatch ? decodeHtmlEntities(venueMatch[1]) : null,
    });
  }

  return rows;
}

function kickoffTextForUtc(row) {
  // Once finished, FWP replaces kick-off with the score — keep a stable afternoon default.
  if (isFwpScoreText(row.koText) || parseFinishedHomeAwayGoals(row.title, row.koText, row.venue).final) {
    return '3pm';
  }
  return row.koText;
}

async function fetchClubLeagueFixtures(code) {
  const slug = FWP_SLUG_BY_CODE[code];
  const expectedComp = FWP_LEAGUE_COMP_BY_CODE[code];
  if (!slug || !expectedComp) {
    throw new Error(`No FWP mapping for ${code}`);
  }

  const html = await fetchHtml(`${FWP_ORIGIN}/${slug}/fixtures-results`);
  const rows = parseTeamFixtureRows(html, expectedComp);
  const fixtures = [];

  for (const row of rows) {
    const home = resolveTeamFromSlug(row.homeSlug);
    const away = resolveTeamFromSlug(row.awaySlug);
    if (!home.isOurs && !away.isOurs) continue;

    const utcDate = parseUkDateToUtcIso(row.dateExport, kickoffTextForUtc(row));
    fixtures.push({
      id: fixtureId(utcDate, home.code, away.code),
      utcDate,
      homeTeam: { name: home.name, tla: home.code },
      awayTeam: { name: away.name, tla: away.code },
      involvedOurCodes: [home.isOurs ? home.code : null, away.isOurs ? away.code : null].filter(
        Boolean
      ),
      source: 'fwp',
      competition: expectedComp,
    });
  }

  return fixtures;
}

const fwpClubPageCache = new Map();

async function loadClubFixtureRows(code) {
  if (fwpClubPageCache.has(code)) return fwpClubPageCache.get(code);

  const slug = FWP_SLUG_BY_CODE[code];
  const expectedComp = FWP_LEAGUE_COMP_BY_CODE[code];
  if (!slug || !expectedComp) {
    throw new Error(`No FWP mapping for ${code}`);
  }

  const html = await fetchHtml(`${FWP_ORIGIN}/${slug}/fixtures-results`);
  const rows = parseTeamFixtureRows(html, expectedComp);
  fwpClubPageCache.set(code, rows);
  return rows;
}

/**
 * Look up a finished NLN/NLS result for a due sweepstake fixture.
 * Returns null if not final yet. Red cards are not reliably published on FWP tables → 0.
 */
async function fetchFwpResultForFixture(fixture) {
  const homeCode = fixture.homeTla || fixture.homeTeam?.tla;
  const awayCode = fixture.awayTla || fixture.awayTeam?.tla;
  const ourCode = OUR_NLN_NLS_CODES.has(homeCode)
    ? homeCode
    : OUR_NLN_NLS_CODES.has(awayCode)
      ? awayCode
      : null;
  if (!ourCode) return null;

  const homeSlug = slugForTeamCode(homeCode) || Object.entries(FWP_CODE_BY_SLUG).find(([, c]) => c === homeCode)?.[0];
  const awaySlug = slugForTeamCode(awayCode) || Object.entries(FWP_CODE_BY_SLUG).find(([, c]) => c === awayCode)?.[0];
  if (!homeSlug || !awaySlug) {
    throw new Error(`FWP slug missing for ${homeCode} vs ${awayCode}`);
  }

  const rows = await loadClubFixtureRows(ourCode);
  const row = rows.find((entry) => entry.homeSlug === homeSlug && entry.awaySlug === awaySlug);
  if (!row) return null;

  const parsed = parseFinishedHomeAwayGoals(row.title, row.koText, row.venue);
  if (!parsed.final) return null;

  return {
    homeGoals: parsed.homeGoals,
    awayGoals: parsed.awayGoals,
    homeRedCards: 0,
    awayRedCards: 0,
    period: 'FT',
    source: 'fwp',
    scoreSource: parsed.source,
  };
}

async function fetchAllNlnNlsFixtures() {
  const byCode = {};
  const allFixtures = [];

  for (const code of Object.keys(FWP_SLUG_BY_CODE)) {
    const fixtures = await fetchClubLeagueFixtures(code);
    byCode[code] = fixtures.length;
    allFixtures.push(...fixtures);
  }

  allFixtures.sort((a, b) => a.utcDate.localeCompare(b.utcDate) || a.id.localeCompare(b.id));

  const seen = new Set();
  const uniqueFixtures = allFixtures.filter((fixture) => {
    if (seen.has(fixture.id)) return false;
    seen.add(fixture.id);
    return true;
  });

  return {
    fixtures: uniqueFixtures,
    byCode,
    source: 'football-web-pages',
  };
}

module.exports = {
  FWP_CODE_BY_SLUG,
  FWP_LEAGUE_COMP_BY_CODE,
  FWP_NAME_BY_SLUG,
  FWP_ORIGIN,
  FWP_SLUG_BY_CODE,
  OUR_NLN_NLS_CODES,
  fetchAllNlnNlsFixtures,
  fetchClubLeagueFixtures,
  fetchFwpResultForFixture,
  isFwpScoreText,
  londonLocalToUtcIso,
  parseFinishedHomeAwayGoals,
  parseKoToMinutes,
  parseUkDateToUtcIso,
  slugForTeamCode,
};
