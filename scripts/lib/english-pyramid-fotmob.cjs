/**
 * FotMob final-result/red-card cross-check for National League fixtures.
 *
 * ESPN remains primary. FotMob supplies explicit dismissal totals and catches
 * occasional score-feed lag through its date and match-detail endpoints.
 */

const FOTMOB_ORIGIN = 'https://www.fotmob.com';

function normalizeTeamName(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\bfootball club\b/g, ' ')
    .replace(/\b(?:afc|fc|town|borough|athletic|city)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function teamNameMatches(team, fixtureName) {
  const expected = normalizeTeamName(fixtureName);
  return [team?.longName, team?.name]
    .filter(Boolean)
    .some((name) => normalizeTeamName(name) === expected);
}

function fotMobDateParam(utcDate) {
  const value = String(utcDate ?? '').slice(0, 10).replace(/-/g, '');
  return /^\d{8}$/.test(value) ? value : null;
}

function isNationalLeagueFamily(name) {
  const normalized = String(name ?? '').trim().toLowerCase();
  return (
    normalized === 'national league' ||
    normalized === 'national league north' ||
    normalized === 'national league south'
  );
}

function nationalLeagueMatches(payload) {
  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.leagues)) return [];
  return payload.leagues
    .filter((league) => isNationalLeagueFamily(league?.name))
    .flatMap((league) => (Array.isArray(league.matches) ? league.matches : []));
}

function findFotMobMatchForFixture(payload, fixture) {
  return nationalLeagueMatches(payload).find(
    (match) =>
      teamNameMatches(match?.home, fixture.homeName) &&
      teamNameMatches(match?.away, fixture.awayName),
  );
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent':
        'Mozilla/5.0 (compatible; english-pyramid-sync/1.0; +https://github.com/easalesltd/sales-portfolio-website)',
    },
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) {
    throw new Error(`FotMob request failed (${response.status}) for ${url}`);
  }
  return response.json();
}

function parseScore(value) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

function eventRedCardCounts(detail) {
  let homeRedCards = 0;
  let awayRedCards = 0;
  const events = detail?.content?.matchFacts?.events?.events;
  if (!Array.isArray(events)) return { homeRedCards, awayRedCards };

  for (const event of events) {
    const type = String(event?.type ?? '').toLowerCase();
    const card = String(event?.card ?? event?.cardType ?? '').toLowerCase();
    if (type !== 'card' || !card.includes('red')) continue;
    if (event.isHome === true) homeRedCards += 1;
    else if (event.isHome === false) awayRedCards += 1;
  }
  return { homeRedCards, awayRedCards };
}

function parseFotMobFinal(match, detail) {
  const status = detail?.header?.status ?? match?.status;
  if (status?.finished !== true) return null;

  const headerTeams = Array.isArray(detail?.header?.teams) ? detail.header.teams : [];
  const homeScore = parseScore(headerTeams[0]?.score ?? match?.home?.score);
  const awayScore = parseScore(headerTeams[1]?.score ?? match?.away?.score);
  if (homeScore == null || awayScore == null) return null;

  const eventCounts = eventRedCardCounts(detail);
  const homeRedCards =
    parseScore(status.numberOfHomeRedCards) ?? eventCounts.homeRedCards;
  const awayRedCards =
    parseScore(status.numberOfAwayRedCards) ?? eventCounts.awayRedCards;

  return { homeGoals: homeScore, awayGoals: awayScore, homeRedCards, awayRedCards };
}

function isFotMobMatchGoingAhead(match) {
  const status = match?.status;
  if (!status) return false;
  if (status.started === true || status.finished === true || status.ongoing === true) return true;
  if (status.scoreStr) return true;
  if (status.cancelled) return false;
  return Boolean(status.utcTime);
}

function isFotMobPostponed(match) {
  return Boolean(match?.status?.cancelled) && !isFotMobMatchGoingAhead(match);
}

async function fetchFotMobResultForFixture(fixture, caches = {}) {
  const date = fotMobDateParam(fixture.utcDate);
  if (!date) return null;

  const dayCache = caches.day ?? new Map();
  const detailCache = caches.detail ?? new Map();
  if (!dayCache.has(date)) {
    dayCache.set(date, fetchJson(`${FOTMOB_ORIGIN}/api/data/matches?date=${date}`));
  }
  const day = await dayCache.get(date);
  const match = findFotMobMatchForFixture(day, fixture);
  if (!match?.id) return null;

  if (!detailCache.has(match.id)) {
    detailCache.set(
      match.id,
      fetchJson(
        `${FOTMOB_ORIGIN}/api/data/matchDetails?matchId=${encodeURIComponent(match.id)}`,
      ),
    );
  }
  const detail = await detailCache.get(match.id);
  return parseFotMobFinal(match, detail);
}

module.exports = {
  fetchFotMobResultForFixture,
  findFotMobMatchForFixture,
  isFotMobMatchGoingAhead,
  isFotMobPostponed,
  nationalLeagueMatches,
  normalizeTeamName,
  parseFotMobFinal,
};
