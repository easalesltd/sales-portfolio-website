/**
 * ESPN World Cup scoreboard helpers for Node scripts.
 * Keep red-card counting in sync with app/lib/world-cup-espn-scoreboard.ts.
 */

const ESPN_SCOREBOARD_URL =
  'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';

function parseScore(value) {
  if (value == null) return null;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function buildEspnAliasMap(source) {
  const aliasToCode = new Map();
  const teamTableMatch = source.match(
    /export const WORLD_CUP_TEAM_BY_CODE[\s\S]*?= \{([\s\S]*?)\n\};/,
  );
  if (!teamTableMatch) return aliasToCode;

  const teamPattern = /\s([A-Z]{3}): \{([\s\S]*?)\},?(?=\n\s*[A-Z]{3}:|\n\};)/g;
  for (const match of teamTableMatch[1].matchAll(teamPattern)) {
    const code = match[1];
    aliasToCode.set(code, code);
    const aliasesMatch = match[2].match(/aliases: \[([^\]]+)\]/);
    if (!aliasesMatch) continue;
    for (const alias of aliasesMatch[1].matchAll(/'([^']+)'/g)) {
      aliasToCode.set(alias[1].toUpperCase(), code);
    }
  }

  return aliasToCode;
}

function normalizeEspnAbbrevToTeamCode(abbrev, aliasToCode) {
  const upper = abbrev.trim().toUpperCase();
  return aliasToCode.get(upper) ?? upper;
}

const { countRedCardsFromEspnCompetition } = require('./espn-red-cards.cjs');

function parseEspnScoreboardEvent(event, aliasToCode, ignoreStatuses) {
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

  const redCards = countRedCardsFromEspnCompetition(competition);

  return {
    homeTla: normalizeEspnAbbrevToTeamCode(homeAbbrev, aliasToCode),
    awayTla: normalizeEspnAbbrevToTeamCode(awayAbbrev, aliasToCode),
    homeGoals,
    awayGoals,
    period: period.trim() || 'In progress',
    homeRedCards: redCards?.homeRedCards ?? 0,
    awayRedCards: redCards?.awayRedCards ?? 0,
    homeWinner: home?.winner === true,
    awayWinner: away?.winner === true,
  };
}

function parseEspnScoreboard(payload, aliasToCode, ignoreStatuses) {
  if (!payload || typeof payload !== 'object') return [];
  const events = payload.events;
  if (!Array.isArray(events)) return [];

  const parsed = [];
  for (const event of events) {
    const entry = parseEspnScoreboardEvent(event, aliasToCode, ignoreStatuses);
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

async function fetchEspnScoreboardForDate(dateParam) {
  const url = dateParam
    ? `${ESPN_SCOREBOARD_URL}?dates=${dateParam}&limit=100`
    : ESPN_SCOREBOARD_URL;

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
  ESPN_SCOREBOARD_URL,
  buildEspnAliasMap,
  countRedCardsFromEspnCompetition,
  espnDateParamFromUtcDate,
  fetchEspnScoreboardForDate,
  findEspnEventForFixture,
  normalizeEspnAbbrevToTeamCode,
  parseEspnScoreboard,
  parseEspnScoreboardEvent,
};
