/**
 * ESPN English pyramid scoreboard helpers for Node scripts.
 * Keep red-card counting in sync with app/lib/espn-red-cards.ts.
 */

const { countRedCardsFromEspnCompetition } = require('./espn-red-cards.cjs');
const { normalizeEspnEventDate } = require('./espn-kickoff.cjs');
const { ESPN_ABBREV_BY_SLUG, ESPN_TEAM_ID_BY_SLUG } = require('./english-pyramid-fixture-lib.cjs');

const DIVISION_TO_ESPN_SLUG = {
  PL: 'eng.1',
  CH: 'eng.2',
  L1: 'eng.3',
  L2: 'eng.4',
  NL: 'eng.5',
};

const DIVISION_BY_ESPN_SLUG = {
  'eng.1': 'PL',
  'eng.2': 'CH',
  'eng.3': 'L1',
  'eng.4': 'L2',
  'eng.5': 'NL',
};

/**
 * Derive this from the canonical ESPN mappings so every drafted club is
 * covered after a redraw. A stale hand-maintained subset silently skipped
 * survival-band fixtures when neither side was a title pick.
 */
const SWEEPSTAKE_DIVISION_BY_CODE = {};
for (const [slug, mapping] of Object.entries(ESPN_ABBREV_BY_SLUG)) {
  const divisionId = DIVISION_BY_ESPN_SLUG[slug];
  if (!divisionId) continue;
  for (const code of Object.values(mapping)) {
    SWEEPSTAKE_DIVISION_BY_CODE[code] = divisionId;
  }
  for (const code of Object.values(ESPN_TEAM_ID_BY_SLUG[slug] ?? {})) {
    SWEEPSTAKE_DIVISION_BY_CODE[code] = divisionId;
  }
}

function parseScore(value) {
  if (value == null) return null;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeEspnAbbrevToTeamCode(slug, abbrev, teamId) {
  const idKey = teamId != null ? String(teamId) : '';
  const idMapped = idKey ? ESPN_TEAM_ID_BY_SLUG[slug]?.[idKey] : null;
  if (idMapped) return idMapped;

  const upper = String(abbrev ?? '')
    .trim()
    .toUpperCase();
  if (!upper) return null;
  const mapped = ESPN_ABBREV_BY_SLUG[slug]?.[upper];
  if (mapped) return mapped;
  return upper;
}

function espnSlugForTeamCode(code) {
  const divisionId = SWEEPSTAKE_DIVISION_BY_CODE[code];
  if (!divisionId) return null;
  return DIVISION_TO_ESPN_SLUG[divisionId] ?? null;
}

function parseEspnScoreboardEvent(event, slug, ignoreStatuses) {
  if (!event || typeof event !== 'object') return null;

  const competition = event.competitions?.[0];
  if (!competition) return null;

  const competitors = competition.competitors;
  if (!Array.isArray(competitors) || competitors.length < 2) return null;

  const home = competitors.find((entry) => entry.homeAway === 'home');
  const away = competitors.find((entry) => entry.homeAway === 'away');
  const homeAbbrev = home?.team?.abbreviation;
  const awayAbbrev = away?.team?.abbreviation;
  const homeGoals = parseScore(home?.score);
  const awayGoals = parseScore(away?.score);
  const period =
    event.status?.type?.shortDetail ?? event.status?.type?.description ?? '';
  const utcDate = normalizeEspnEventDate(event.date);
  const statusName = event.status?.type?.name ?? '';
  const statusState = event.status?.type?.state ?? '';

  if (!homeAbbrev || !awayAbbrev || homeGoals == null || awayGoals == null) return null;

  const normalizedPeriod = period.trim().toLowerCase();
  if (ignoreStatuses?.has(normalizedPeriod)) return null;

  const homeTla = normalizeEspnAbbrevToTeamCode(slug, homeAbbrev, home?.team?.id);
  const awayTla = normalizeEspnAbbrevToTeamCode(slug, awayAbbrev, away?.team?.id);
  if (!homeTla || !awayTla) return null;

  const redCards = countRedCardsFromEspnCompetition(competition);

  return {
    homeTla,
    awayTla,
    homeGoals,
    awayGoals,
    period: period.trim() || 'In progress',
    homeRedCards: redCards?.homeRedCards ?? 0,
    awayRedCards: redCards?.awayRedCards ?? 0,
    utcDate,
    statusName,
    statusState,
  };
}

function parseEspnScoreboard(payload, slug, ignoreStatuses) {
  if (!payload || typeof payload !== 'object') return [];
  const events = payload.events;
  if (!Array.isArray(events)) return [];

  const parsed = [];
  for (const event of events) {
    const entry = parseEspnScoreboardEvent(event, slug, ignoreStatuses);
    if (entry) parsed.push(entry);
  }
  return parsed;
}

function espnDateParamFromUtcDate(utcDate) {
  const kickoff = new Date(utcDate);
  if (Number.isNaN(kickoff.getTime())) return null;
  const y = kickoff.getUTCFullYear();
  const m = String(kickoff.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kickoff.getUTCDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

async function fetchEspnScoreboardForSlugAndDate(slug, dateParam) {
  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${slug}/scoreboard?dates=${dateParam}&limit=100`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`ESPN scoreboard request failed (${response.status}) for ${url}`);
  }

  return response.json();
}

function normalizeEspnEventToFixtureOrientation(event, homeTla, awayTla) {
  if (event.homeTla === homeTla && event.awayTla === awayTla) {
    return event;
  }

  if (event.homeTla === awayTla && event.awayTla === homeTla) {
    return {
      ...event,
      homeTla,
      awayTla,
      homeGoals: event.awayGoals,
      awayGoals: event.homeGoals,
      homeRedCards: event.awayRedCards,
      awayRedCards: event.homeRedCards,
    };
  }

  return null;
}

function findEspnEventForFixture(events, homeTla, awayTla) {
  for (const event of events) {
    const normalized = normalizeEspnEventToFixtureOrientation(event, homeTla, awayTla);
    if (normalized) return normalized;
  }

  return undefined;
}

module.exports = {
  DIVISION_TO_ESPN_SLUG,
  SWEEPSTAKE_DIVISION_BY_CODE,
  espnDateParamFromUtcDate,
  espnSlugForTeamCode,
  fetchEspnScoreboardForSlugAndDate,
  findEspnEventForFixture,
  parseEspnScoreboard,
};
