/**
 * National League North / South fixtures via Football Web Pages HTML
 * (not on ESPN). Team pages: https://www.footballwebpages.co.uk/{slug}/fixtures-results
 */

const FWP_ORIGIN = 'https://www.footballwebpages.co.uk';

/** Our 28 NLN/NLS sweepstake clubs (title + survival) → FWP URL slug. */
const FWP_SLUG_BY_CODE = {
  SSH: 'south-shields',
  MAC: 'macclesfield',
  MOR: 'morecambe',
  WRK: 'worksop-town',
  DAR: 'darlington',
  BUX: 'buxton',
  CHF: 'chester',
  HEB: 'hebburn-town',
  SPA: 'spalding-united',
  BED: 'bedford-town',
  HBO: 'harborough-town',
  HED: 'hednesford-town',
  OXC: 'oxford-city',
  MAR: 'marine',
  DAG: 'dagenham-and-redbridge',
  TOR: 'torquay-united',
  HOR: 'horsham',
  WSM: 'weston-super-mare',
  MAI: 'maidstone-united',
  TRU: 'truro-city',
  CLM: 'chelmsford-city',
  FNH: 'farnham-town',
  AFT: 'afc-totton',
  DOV: 'dover-athletic',
  SBY: 'salisbury',
  CHU: 'chesham-united',
  TON: 'tonbridge-angels',
  WAH: 'walton-and-hersham',
};

const FWP_LEAGUE_COMP_BY_CODE = {
  SSH: 'national-league-north',
  MAC: 'national-league-north',
  MOR: 'national-league-north',
  WRK: 'national-league-north',
  DAR: 'national-league-north',
  BUX: 'national-league-north',
  CHF: 'national-league-north',
  HEB: 'national-league-north',
  SPA: 'national-league-north',
  BED: 'national-league-north',
  HBO: 'national-league-north',
  HED: 'national-league-north',
  OXC: 'national-league-north',
  MAR: 'national-league-north',
  DAG: 'national-league-south',
  TOR: 'national-league-south',
  HOR: 'national-league-south',
  WSM: 'national-league-south',
  MAI: 'national-league-south',
  TRU: 'national-league-south',
  CLM: 'national-league-south',
  FNH: 'national-league-south',
  AFT: 'national-league-south',
  DOV: 'national-league-south',
  SBY: 'national-league-south',
  CHU: 'national-league-south',
  TON: 'national-league-south',
  WAH: 'national-league-south',
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
  'truro-city': 'TRU',
  'chelmsford-city': 'CLM',
  // NL South — opponents
  'afc-totton': 'AFT',
  'billericay-town': 'BIL',
  'braintree-town': 'BRT',
  'chesham-united': 'CHU',
  'dorking-wanderers': 'DOR',
  'dover-athletic': 'DOV',
  'ebbsfleet-united': 'EBB',
  farnborough: 'FAR',
  'farnham-town': 'FNH',
  'folkestone-invicta': 'FOL',
  'hampton-and-richmond-borough': 'HRB',
  'hemel-hempstead-town': 'HEM',
  'maidenhead-united': 'MDH',
  salisbury: 'SBY',
  'slough-town': 'SLO',
  'tonbridge-angels': 'TON',
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

function htmlToVisibleText(html) {
  return decodeHtmlEntities(
    String(html || '')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

function isFwpPostponedText(text) {
  const raw = String(text || '').trim().toLowerCase();
  const compact = raw.replace(/\s+/g, '');
  return (
    compact === 'p:p' ||
    compact === 'p-p' ||
    compact === 'p.p' ||
    compact === 'pp' ||
    compact === 'postponed' ||
    /\bpostponed\b/.test(raw)
  );
}

function extractScorePair(text) {
  const matches = [...String(text || '').matchAll(/(\d+)\s*-\s*(\d+)/g)];
  if (matches.length === 0) return null;
  const last = matches[matches.length - 1];
  return { left: Number(last[1]), right: Number(last[2]) };
}

function isFwpScoreText(text) {
  return extractScorePair(text) != null && !isFwpPostponedText(text);
}

function parseScorePair(text) {
  return extractScorePair(text);
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
    const koTd = body.match(/<td class="ko-score"[^>]*>([\s\S]*?)<\/td>/i);
    const venueMatch = body.match(/class="[^"]*venue[^"]*"[^>]*>([^<]+)/);
    const koText = htmlToVisibleText(koTd ? koTd[1] : '');
    if (!dateMatch) {
      console.warn(`FWP row missing date (skipped): ${href}`);
      continue;
    }

    rows.push({
      title,
      href,
      homeSlug,
      awaySlug,
      dateExport: dateMatch[1],
      koText,
      venue: venueMatch ? decodeHtmlEntities(venueMatch[1]) : null,
    });
  }

  return rows;
}

function kickoffTextForUtc(row) {
  // Finished / postponed rows replace kick-off with a score or P:P.
  if (
    isFwpPostponedText(row.koText) ||
    isFwpScoreText(row.koText) ||
    parseFinishedHomeAwayGoals(row.title, row.koText, row.venue).final
  ) {
    return '3pm';
  }
  return row.koText || '3pm';
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

    const postponed =
      isFwpPostponedText(row.koText) || /\bpostponed\b/i.test(row.title);
    const inferredKickoff =
      postponed ||
      isFwpScoreText(row.koText) ||
      parseFinishedHomeAwayGoals(row.title, row.koText, row.venue).final;
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
      kickoffInferred: inferredKickoff,
      ...(postponed ? { postponed: true } : {}),
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

async function fetchAllNlnNlsFixturesFromFwp() {
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

/** BBC short names → our TLA (league fixtures pages). */
const BBC_NAME_TO_CODE = {
  ...Object.fromEntries(
    Object.entries(FWP_NAME_BY_SLUG).map(([slug, name]) => [name, FWP_CODE_BY_SLUG[slug]])
  ),
  Chester: 'CHF',
  'Hampton & Richmond': 'HRB',
  'Hampton and Richmond': 'HRB',
  'Dagenham and Redbridge': 'DAG',
  'Walton and Hersham': 'WAH',
};

const BBC_MONTHS = [
  '2026-08',
  '2026-09',
  '2026-10',
  '2026-11',
  '2026-12',
  '2027-01',
  '2027-02',
  '2027-03',
  '2027-04',
];

const BBC_MONTH_INDEX = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

function decodeBbcHtml(text) {
  return String(text || '')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

async function fetchBbcMonthHtml(leaguePath, month) {
  const url = `https://www.bbc.co.uk/sport/football/${leaguePath}/scores-fixtures/${month}`;
  const response = await fetch(url, {
    headers: {
      Accept: 'text/html',
      'User-Agent':
        'Mozilla/5.0 (compatible; english-pyramid-fixtures/1.0; +https://github.com/easalesltd/sales-portfolio-website)',
    },
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`BBC request failed (${response.status}): ${url}`);
  }
  return response.text();
}

function parseBbcMonthFixtures(html, fileYear, expectedComp) {
  const fixtures = [];
  let currentDate = null;
  const tokenRe =
    /<h2[^>]*>([^<]+)<\/h2>|visually-hidden[^"]*"[^>]*>([^<]+ versus [^<]+ kick off [^<]+)</g;
  let match;
  while ((match = tokenRe.exec(html))) {
    if (match[1]) {
      const heading = decodeBbcHtml(match[1]);
      const dateMatch = heading.match(
        /(\d{1,2})(?:st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)/i
      );
      if (dateMatch) {
        currentDate = {
          day: Number(dateMatch[1]),
          month: BBC_MONTH_INDEX[dateMatch[2]],
        };
      }
      continue;
    }
    if (!currentDate || !match[2]) continue;
    const line = decodeBbcHtml(match[2]);
    const versus = line.match(/^(.+?) versus (.+?) kick off (\d{1,2}):(\d{2})$/);
    if (!versus) continue;
    const homeName = versus[1].trim();
    const awayName = versus[2].trim();
    const homeCode = BBC_NAME_TO_CODE[homeName];
    const awayCode = BBC_NAME_TO_CODE[awayName];
    if (!homeCode || !awayCode) continue;
    if (!OUR_NLN_NLS_CODES.has(homeCode) && !OUR_NLN_NLS_CODES.has(awayCode)) continue;

    const utcDate = londonLocalToUtcIso(
      currentDate.day,
      currentDate.month + 1,
      fileYear,
      Number(versus[3]),
      Number(versus[4])
    );
    const homeDisplay = FWP_NAME_BY_SLUG[Object.entries(FWP_CODE_BY_SLUG).find(([, c]) => c === homeCode)?.[0]] || homeName;
    const awayDisplay = FWP_NAME_BY_SLUG[Object.entries(FWP_CODE_BY_SLUG).find(([, c]) => c === awayCode)?.[0]] || awayName;

    fixtures.push({
      id: fixtureId(utcDate, homeCode, awayCode),
      utcDate,
      homeTeam: { name: homeDisplay, tla: homeCode },
      awayTeam: { name: awayDisplay, tla: awayCode },
      involvedOurCodes: [OUR_NLN_NLS_CODES.has(homeCode) ? homeCode : null, OUR_NLN_NLS_CODES.has(awayCode) ? awayCode : null].filter(
        Boolean
      ),
      source: 'bbc',
      competition: expectedComp,
    });
  }
  return fixtures;
}

async function fetchAllNlnNlsFixturesFromBbc() {
  const allFixtures = [];
  for (const [leaguePath, expectedComp] of [
    ['national-league-north', 'national-league-north'],
    ['national-league-south', 'national-league-south'],
  ]) {
    for (const month of BBC_MONTHS) {
      const html = await fetchBbcMonthHtml(leaguePath, month);
      const fileYear = Number(month.slice(0, 4));
      allFixtures.push(...parseBbcMonthFixtures(html, fileYear, expectedComp));
    }
  }

  allFixtures.sort((a, b) => a.utcDate.localeCompare(b.utcDate) || a.id.localeCompare(b.id));
  const seen = new Set();
  const uniqueFixtures = allFixtures.filter((fixture) => {
    if (seen.has(fixture.id)) return false;
    seen.add(fixture.id);
    return true;
  });

  const byCode = {};
  for (const code of Object.keys(FWP_SLUG_BY_CODE)) byCode[code] = 0;
  for (const fixture of uniqueFixtures) {
    for (const code of fixture.involvedOurCodes ?? []) {
      byCode[code] = (byCode[code] ?? 0) + 1;
    }
  }

  return {
    fixtures: uniqueFixtures,
    byCode,
    source: 'bbc-sport',
  };
}

async function fetchAllNlnNlsFixtures() {
  try {
    return await fetchAllNlnNlsFixturesFromFwp();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!/FWP request failed \(403\)/.test(message) && !/cloudflare/i.test(message)) {
      throw error;
    }
    console.warn(`FWP blocked (${message}); falling back to BBC Sport NLN/NLS fixtures.`);
    return fetchAllNlnNlsFixturesFromBbc();
  }
}

module.exports = {
  FWP_CODE_BY_SLUG,
  FWP_LEAGUE_COMP_BY_CODE,
  FWP_NAME_BY_SLUG,
  FWP_ORIGIN,
  FWP_SLUG_BY_CODE,
  OUR_NLN_NLS_CODES,
  fetchAllNlnNlsFixtures,
  fetchAllNlnNlsFixturesFromBbc,
  fetchAllNlnNlsFixturesFromFwp,
  fetchClubLeagueFixtures,
  fetchFwpResultForFixture,
  htmlToVisibleText,
  isFwpPostponedText,
  isFwpScoreText,
  londonLocalToUtcIso,
  parseFinishedHomeAwayGoals,
  parseKoToMinutes,
  parseUkDateToUtcIso,
  slugForTeamCode,
};
