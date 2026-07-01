/**
 * ESPN English pyramid scoreboard helpers for Node scripts.
 * Keep red-card counting in sync with app/lib/world-cup-espn-scoreboard.ts.
 */

const { countRedCardsFromEspnCompetition } = require('./espn-red-cards.cjs');
const { ESPN_ABBREV_BY_SLUG } = require('./english-pyramid-fixture-lib.cjs');

const DIVISION_TO_ESPN_SLUG = {
  PL: 'eng.1',
  CH: 'eng.2',
  L1: 'eng.3',
  L2: 'eng.4',
  NL: 'eng.5',
};

const SWEEPSTAKE_DIVISION_BY_CODE = {
  MCI: 'PL', MUN: 'PL', ARS: 'PL', AVL: 'PL', CHE: 'PL', LIV: 'PL', NEW: 'PL',
  WHU: 'CH', WOL: 'CH', BUR: 'CH', MID: 'CH', BIR: 'CH', SHU: 'CH', SOU: 'CH',
  LEI: 'L1', SHW: 'L1', LUT: 'L1', STP: 'L1', PLY: 'L1', HUD: 'L1', BOL: 'L1',
  BAR: 'L2', ROT: 'L2', PVL: 'L2', SAL: 'L2', CHS: 'L2', BRST: 'L2', GRI: 'L2',
  CAR: 'NL', STD: 'NL', FGR: 'NL', BORE: 'NL', HPL: 'NL', SCU: 'NL', YOR: 'NL',
};

function parseScore(value) {
  if (value == null) return null;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeEspnAbbrevToTeamCode(slug, abbrev) {
  const upper = abbrev.trim().toUpperCase();
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

  if (!homeAbbrev || !awayAbbrev || homeGoals == null || awayGoals == null) return null;

  const normalizedPeriod = period.trim().toLowerCase();
  if (ignoreStatuses?.has(normalizedPeriod)) return null;

  const homeTla = normalizeEspnAbbrevToTeamCode(slug, homeAbbrev);
  const awayTla = normalizeEspnAbbrevToTeamCode(slug, awayAbbrev);
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

function findEspnEventForFixture(events, homeTla, awayTla) {
  return events.find((event) => event.homeTla === homeTla && event.awayTla === awayTla);
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
