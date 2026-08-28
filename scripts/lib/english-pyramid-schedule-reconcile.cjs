/**
 * Catch brought-forward kick-offs and postponements before the ledger
 * treats Saturday 15:00 as gospel. Matches live FotMob (NL family) and ESPN
 * (PL→NL) events to in-repo fixtures by home+away, not fixture id.
 */

const {
  londonCalendarDate,
  parseFixturesFromSource,
} = require('./english-pyramid-fixture-lib.cjs');
const {
  espnDateParamFromUtcDate,
  espnSlugForTeamCode,
  fetchEspnScoreboardForSlugAndDate,
  findEspnEventForFixture,
  parseEspnScoreboard,
} = require('./english-pyramid-espn-scoreboard.cjs');
const {
  findFotMobMatchForFixture,
  isFotMobPostponed,
  nationalLeagueMatches,
} = require('./english-pyramid-fotmob.cjs');

const DEFAULT_PAST_DAYS = 3;
const DEFAULT_FUTURE_DAYS = 4;
const FOTMOB_ORIGIN = 'https://www.fotmob.com';

function addUtcDays(isoDay, days) {
  const date = new Date(`${isoDay}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function fotMobDateParam(isoDay) {
  return isoDay.replace(/-/g, '');
}

function fixtureId(utcDate, homeTla, awayTla) {
  return `${utcDate.slice(0, 10)}-${homeTla.toLowerCase()}-${awayTla.toLowerCase()}`;
}

function recordedMatchIds(source) {
  const match = source.match(
    /export const ENGLISH_PYRAMID_MANUAL_MATCHES[^=]*= \[([\s\S]*?)\](?: as const)?;/,
  );
  if (!match) return new Set();
  return new Set([...match[1].matchAll(/id: '([^']+)'/g)].map((entry) => entry[1]));
}

function windowFixtures(fixtures, recordedIds, now, pastDays, futureDays) {
  const nowMs = now.getTime();
  const pastMs = pastDays * 86_400_000;
  const futureMs = futureDays * 86_400_000;
  return fixtures.filter((fixture) => {
    if (recordedIds.has(fixture.id)) return false;
    const kickoff = Date.parse(fixture.utcDate);
    if (Number.isNaN(kickoff)) return false;
    return kickoff >= nowMs - pastMs && kickoff <= nowMs + futureMs;
  });
}

function datesToScan(fixtures, now, pastDays, futureDays) {
  const dates = new Set();
  const today = londonCalendarDate(now.toISOString());
  for (let offset = -pastDays; offset <= futureDays; offset += 1) {
    dates.add(addUtcDays(today, offset));
  }
  for (const fixture of fixtures) {
    const day = londonCalendarDate(fixture.utcDate);
    if (!day) continue;
    dates.add(day);
    dates.add(addUtcDays(day, -1));
    dates.add(addUtcDays(day, 1));
  }
  return [...dates].sort();
}

function patchesFromFotMobDay(fixtures, date, payload) {
  const patches = [];
  const matches = nationalLeagueMatches(payload);
  if (matches.length === 0) return patches;

  for (const fixture of fixtures) {
    const match = findFotMobMatchForFixture(payload, {
      homeName: fixture.homeTeam.name,
      awayName: fixture.awayTeam.name,
    });
    if (!match) continue;

    if (isFotMobPostponed(match) && !fixture.postponed) {
      patches.push({
        type: 'postpone',
        id: fixture.id,
        note: `FotMob marked postponed (${date}).`,
      });
      continue;
    }

    const liveUtc = match.status?.utcTime;
    if (!liveUtc || fixture.postponed) continue;
    const liveDay = londonCalendarDate(liveUtc);
    const localDay = londonCalendarDate(fixture.utcDate);
    if (liveDay && localDay && liveDay !== localDay) {
      const utcDate = new Date(liveUtc).toISOString().replace(/\.\d{3}Z$/, 'Z');
      patches.push({
        type: 'move',
        fromId: fixture.id,
        toId: fixtureId(utcDate, fixture.homeTeam.tla, fixture.awayTeam.tla),
        utcDate,
        note: `FotMob kick-off moved ${localDay} → ${liveDay}.`,
      });
    }
  }

  return patches;
}

function patchesFromEspnEvents(fixtures, events) {
  const patches = [];
  for (const fixture of fixtures) {
    const event = findEspnEventForFixture(events, fixture.homeTeam.tla, fixture.awayTeam.tla);
    if (!event) continue;
    if (event.postponed && !fixture.postponed) {
      patches.push({
        type: 'postpone',
        id: fixture.id,
        note: 'ESPN marked postponed.',
      });
      continue;
    }
    if (!event.utcDate || fixture.postponed) continue;
    const liveDay = londonCalendarDate(event.utcDate);
    const localDay = londonCalendarDate(fixture.utcDate);
    if (liveDay && localDay && liveDay !== localDay) {
      patches.push({
        type: 'move',
        fromId: fixture.id,
        toId: fixtureId(event.utcDate, fixture.homeTeam.tla, fixture.awayTeam.tla),
        utcDate: event.utcDate,
        note: `ESPN kick-off moved ${localDay} → ${liveDay}.`,
      });
    }
  }
  return patches;
}

function dedupePatches(patches) {
  const seen = new Set();
  const unique = [];
  for (const patch of patches) {
    const key =
      patch.type === 'move' ? `move:${patch.fromId}:${patch.toId}` : `postpone:${patch.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(patch);
  }
  return unique;
}

function fixtureObjectPattern(id) {
  return new RegExp(
    `(\\{\\s*\\n\\s*id: '${id}',\\n\\s*utcDate: ')([^']+)(',\\n\\s*homeTeam: \\{ name: '(?:\\\\'|[^'])*', tla: '[^']+' \\},\\n\\s*awayTeam: \\{ name: '(?:\\\\'|[^'])*', tla: '[^']+' \\},)((?:\\n\\s*/\\*\\*[\\s\\S]*?\\*/\\n\\s*postponed: true,)?)`,
  );
}

function applySchedulePatches(source, patches) {
  let next = source;
  for (const patch of dedupePatches(patches)) {
    if (patch.type === 'postpone') {
      const pattern = fixtureObjectPattern(patch.id);
      const match = next.match(pattern);
      if (!match) {
        throw new Error(`Unable to mark ${patch.id} postponed.`);
      }
      if (match[4]) continue;
      next = next.replace(
        pattern,
        `$1$2$3\n    /** ${patch.note || 'League match postponed — no ledger result until it is rearranged.'} */\n    postponed: true,`,
      );
      continue;
    }

    if (patch.type === 'move') {
      if (patch.fromId !== patch.toId) {
        next = next.replaceAll(`id: '${patch.fromId}'`, `id: '${patch.toId}'`);
      }
      const pattern = fixtureObjectPattern(patch.toId);
      next = next.replace(pattern, `$1${patch.utcDate}$3$4`);
    }
  }
  return next;
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
    throw new Error(`Schedule lookup failed (${response.status}) for ${url}`);
  }
  return response.json();
}

async function collectLivePatches(source, options = {}) {
  const now = options.now ?? new Date();
  const pastDays = options.pastDays ?? DEFAULT_PAST_DAYS;
  const futureDays = options.futureDays ?? DEFAULT_FUTURE_DAYS;
  const fixtures = parseFixturesFromSource(source);
  const recordedIds = recordedMatchIds(source);
  const inWindow = windowFixtures(fixtures, recordedIds, now, pastDays, futureDays);
  if (inWindow.length === 0) return [];

  const patches = [];
  const dates = datesToScan(inWindow, now, pastDays, futureDays);
  const fotMobCache = options.fotMobDayCache ?? new Map();

  for (const date of dates) {
    const param = fotMobDateParam(date);
    try {
      if (!fotMobCache.has(param)) {
        fotMobCache.set(param, await fetchJson(`${FOTMOB_ORIGIN}/api/data/matches?date=${param}`));
      }
      patches.push(...patchesFromFotMobDay(inWindow, date, fotMobCache.get(param)));
    } catch (error) {
      console.warn(
        `FotMob schedule lookup failed for ${date}: ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  const espnCache = options.espnCache ?? new Map();
  const espnFixtures = inWindow.filter(
    (fixture) => espnSlugForTeamCode(fixture.homeTeam.tla) || espnSlugForTeamCode(fixture.awayTeam.tla),
  );
  for (const fixture of espnFixtures) {
    const slug = espnSlugForTeamCode(fixture.homeTeam.tla) || espnSlugForTeamCode(fixture.awayTeam.tla);
    for (const date of datesToScan([fixture], now, 1, 1)) {
      const dateParam = espnDateParamFromUtcDate(`${date}T12:00:00Z`);
      if (!slug || !dateParam) continue;
      const cacheKey = `${slug}:${dateParam}`;
      try {
        if (!espnCache.has(cacheKey)) {
          const payload = await fetchEspnScoreboardForSlugAndDate(slug, dateParam);
          espnCache.set(cacheKey, parseEspnScoreboard(payload, slug, new Set()));
        }
        patches.push(...patchesFromEspnEvents([fixture], espnCache.get(cacheKey)));
      } catch (error) {
        console.warn(
          `ESPN schedule lookup failed for ${fixture.id}: ${
            error instanceof Error ? error.message : error
          }`,
        );
      }
    }
  }

  return dedupePatches(patches);
}

function describePatches(patches) {
  return patches.map((patch) => {
    if (patch.type === 'postpone') return `${patch.id}: postponed (${patch.note})`;
    return `${patch.fromId} → ${patch.toId} ${patch.utcDate} (${patch.note})`;
  });
}

module.exports = {
  DEFAULT_FUTURE_DAYS,
  DEFAULT_PAST_DAYS,
  applySchedulePatches,
  collectLivePatches,
  describePatches,
  isFotMobPostponed,
  londonCalendarDate,
  patchesFromEspnEvents,
  patchesFromFotMobDay,
  windowFixtures,
};
