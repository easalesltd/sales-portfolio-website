#!/usr/bin/env node

/**
 * Template daily roast for the English pyramid sweepstake.
 * Keeps ENGLISH_PYRAMID_FANTASY_DAILY_UPDATE current after automated score sync.
 * Cursor agent / manual edits can still overwrite with sharper copy.
 */

const fs = require('node:fs');
const path = require('node:path');
const {
  assertLedgerMonotonic,
  parseManualMatchIds,
} = require('./lib/sweepstake-ledger-guard.cjs');

const repoRoot = path.resolve(__dirname, '..');
const dataPath = path.join(repoRoot, 'app/data/english-pyramid-fantasy.ts');
const writeChanges = process.argv.includes('--write');

function extractConstArray(name, source) {
  const match = source.match(
    new RegExp(`export const ${name}[^=]*= \\[([\\s\\S]*?)\\](?: as const)?;`)
  );
  if (!match) {
    throw new Error(`Unable to find ${name} in ${dataPath}`);
  }
  return match[1];
}

function parseQuotedList(value) {
  return [...value.matchAll(/'([^']+)'/g)].map((match) => match[1]);
}

function parsePlayers(source) {
  const playersSource = extractConstArray('ENGLISH_PYRAMID_FANTASY_PLAYERS', source);
  const playerPattern = /\{\s*id: '([^']+)',\s*name: '([^']+)',[\s\S]*?teams: \[([^\]]+)\]/g;

  return [...playersSource.matchAll(playerPattern)].map((match) => ({
    id: match[1],
    name: match[2],
    teams: parseQuotedList(match[3]),
  }));
}

function parseTeamMeta(source) {
  const teamTableSource = source.match(
    /export const ENGLISH_PYRAMID_TEAM_BY_CODE[\s\S]*?= \{([\s\S]*?)\n\};/
  );
  if (!teamTableSource) return { searchNames: new Map(), names: new Map() };

  const searchNames = new Map();
  const names = new Map();
  const teamPattern = /\s([A-Z0-9]+): \{([\s\S]*?)\n\s{2}\},?/g;
  for (const match of teamTableSource[1].matchAll(teamPattern)) {
    const code = match[1];
    const body = match[2];
    const searchMatch = body.match(/searchNames: \[([^\]]+)\]/);
    const nameMatch = body.match(/name: '([^']+)'/);
    searchNames.set(code, searchMatch ? parseQuotedList(searchMatch[1]) : []);
    names.set(code, nameMatch ? nameMatch[1] : code);
  }

  return { searchNames, names };
}

function readNumber(objectSource, key, fallback = 0) {
  const match = objectSource.match(new RegExp(`${key}: (\\d+)`));
  return match ? Number.parseInt(match[1], 10) : fallback;
}

function readString(objectSource, pattern, label) {
  const match = objectSource.match(pattern);
  if (!match) {
    throw new Error(`Unable to parse ${label} from manual match:\n${objectSource}`);
  }
  return match[1];
}

function parseMatches(source) {
  const matchesSource = extractConstArray('ENGLISH_PYRAMID_MANUAL_MATCHES', source);
  const objectPattern = /\{\s*(?:\/\*\*[\s\S]*?\*\/\s*)?id: '[^']+',[\s\S]*?\n\s{2}\}/g;

  return [...matchesSource.matchAll(objectPattern)].map((match) => {
    const objectSource = match[0];
    return {
      id: readString(objectSource, /id: '([^']+)'/, 'id'),
      utcDate: readString(objectSource, /utcDate: '([^']+)'/, 'utcDate'),
      homeTeam: readString(
        objectSource,
        /homeTeam: \{ name: '(?:\\.|[^'\\])*', tla: '([^']+)' \}/,
        'home team'
      ),
      awayTeam: readString(
        objectSource,
        /awayTeam: \{ name: '(?:\\.|[^'\\])*', tla: '([^']+)' \}/,
        'away team'
      ),
      homeGoals: readNumber(objectSource, 'homeGoals'),
      awayGoals: readNumber(objectSource, 'awayGoals'),
      homeRedCards: readNumber(objectSource, 'homeRedCards'),
      awayRedCards: readNumber(objectSource, 'awayRedCards'),
    };
  });
}

function teamCodeMatches(matchTla, playerTeamCode, searchNames) {
  const normalized = matchTla.trim().toUpperCase();
  if (playerTeamCode.toUpperCase() === normalized) return true;
  return (searchNames.get(playerTeamCode) ?? []).some(
    (name) => name.toUpperCase() === normalized
  );
}

function scoreTeamMatch(goalsFor, goalsAgainst, redCards, isHome = true) {
  if (goalsFor === 0 && goalsAgainst === 0) {
    return -1 + redCards;
  }
  let total =
    goalsFor > goalsAgainst ? (isHome ? 3 : 4) : goalsFor === goalsAgainst ? 1 : 0;
  if (goalsAgainst === 0) total += 1;
  if (goalsFor >= 3) total += 1;
  if (goalsAgainst >= 3) total -= 1;
  total += redCards;
  return total;
}

function computeStandings(players, matches, searchNames) {
  const standings = players.map((player) => ({
    name: player.name,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    bonusPoints: 0,
  }));

  for (const match of matches) {
    for (const [index, player] of players.entries()) {
      for (const teamCode of player.teams) {
        const isHome = teamCodeMatches(match.homeTeam, teamCode, searchNames);
        const isAway = teamCodeMatches(match.awayTeam, teamCode, searchNames);
        if (!isHome && !isAway) continue;

        const goalsFor = isHome ? match.homeGoals : match.awayGoals;
        const goalsAgainst = isHome ? match.awayGoals : match.homeGoals;
        const redCards = isHome ? match.homeRedCards : match.awayRedCards;
        standings[index].points += scoreTeamMatch(goalsFor, goalsAgainst, redCards, isHome);
        standings[index].goalsFor += goalsFor;
        standings[index].goalsAgainst += goalsAgainst;
        if (goalsAgainst === 0) standings[index].bonusPoints += 1;
        if (goalsFor >= 3) standings[index].bonusPoints += 1;
      }
    }
  }

  return standings
    .map((standing) => ({
      ...standing,
      goalDifference: standing.goalsFor - standing.goalsAgainst,
    }))
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.goalDifference - a.goalDifference ||
        b.bonusPoints - a.bonusPoints ||
        a.name.localeCompare(b.name)
    );
}

function managerForTeam(players, teamCode, searchNames) {
  return players.find((player) =>
    player.teams.some((code) => teamCodeMatches(teamCode, code, searchNames) || code === teamCode)
  );
}

function clubLabel(code, names) {
  return names.get(code) || code;
}

function latestMatchdaySummary(matches, players, searchNames, names) {
  if (matches.length === 0) return null;

  const latestDate = matches.reduce((max, match) => {
    const date = match.utcDate.slice(0, 10);
    return date > max ? date : max;
  }, matches[0].utcDate.slice(0, 10));

  const dayMatches = matches.filter((match) => match.utcDate.slice(0, 10) === latestDate);
  const bits = [];

  for (const match of dayMatches) {
    const homeMgr = managerForTeam(players, match.homeTeam, searchNames);
    const awayMgr = managerForTeam(players, match.awayTeam, searchNames);
    const home = clubLabel(match.homeTeam, names);
    const away = clubLabel(match.awayTeam, names);
    const score = `${match.homeGoals}-${match.awayGoals}`;

    if (match.homeGoals > match.awayGoals && homeMgr) {
      bits.push(`${homeMgr.name}'s ${home} beat ${away} ${score}`);
    } else if (match.awayGoals > match.homeGoals && awayMgr) {
      bits.push(`${awayMgr.name}'s ${away} nicked it ${score} at ${home}`);
    } else if (match.homeGoals === 0 && match.awayGoals === 0) {
      const namesOnPitch = [homeMgr?.name, awayMgr?.name].filter(Boolean).join('/');
      bits.push(`${namesOnPitch || 'someone'} served up a boring 0-0 (${home} vs ${away})`);
    } else {
      bits.push(`${home} ${score} ${away}`);
    }
  }

  return { latestDate, dayMatches, summary: bits.slice(0, 6).join('. ') };
}

function hashPick(seed, length) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % length;
}

function sanitiseRoast(text) {
  return String(text)
    .replace(/\u2014/g, '. ')
    .replace(/\u2013/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\s+\./g, '.')
    .replace(/\.+/g, (match) => (match.length > 3 ? '...' : match))
    .trim();
}

function pickFreshTemplate(templates, seed, previousRoast) {
  const previous = String(previousRoast || '').toLowerCase();
  const start = hashPick(seed, templates.length);
  if (!previous) return templates[start];

  for (let offset = 0; offset < templates.length; offset += 1) {
    const candidate = templates[(start + offset) % templates.length];
    const distinctive = candidate
      .toLowerCase()
      .split(/\n+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 12 && !line.includes('pts') && !/\d+-\d+/.test(line));
    const repeats = distinctive.some((line) => previous.includes(line.slice(0, 28)));
    if (!repeats) return candidate;
  }

  return templates[start];
}

function buildRoast(standings, dayInfo, previousRoast = '') {
  if (standings.length === 0) {
    return sanitiseRoast('Pre-season. Zero points. The ledger is empty and somehow everyone still looks soft.');
  }

  const leader = standings[0];
  const bottom = standings[standings.length - 1];
  const mid = standings[Math.floor(standings.length / 2)];

  if (!dayInfo) {
    return sanitiseRoast(
      `${leader.name} tops the empty table on ${leader.points} while ${bottom.name} is already last on ${bottom.points}. August can't come soon enough.`,
    );
  }

  const templates = [
    `${leader.name} is top on ${leader.points} and still looks like a fraud.\n\n${dayInfo.summary}.\n\n${bottom.name} is rotting on ${bottom.points}. Absolute pants.`,
    `${bottom.name} is last on ${bottom.points}. Sit down.\n\n${leader.name} swans about on ${leader.points}. ${dayInfo.summary}. Soft.`,
    `Table: ${leader.name} ${leader.points}, ${bottom.name} ${bottom.points}. Spineless.\n\n${dayInfo.summary}.`,
    `${leader.name} leads on ${leader.points}. ${mid.name} is the human equivalent of a 1-1.\n\n${dayInfo.summary}.\n\n${bottom.name} is bottom on ${bottom.points} and it is tragic.`,
    `${dayInfo.summary}.\n\n${leader.name} is first on ${leader.points}. ${bottom.name} is last on ${bottom.points}. Do one.`,
    `${leader.name} on ${leader.points}. Congrats, nobody clapped.\n\n${dayInfo.summary}.\n\n${bottom.name} on ${bottom.points} is a war crime against entertainment.`,
  ];

  const seed = `${dayInfo.latestDate}:${dayInfo.dayMatches.map((m) => m.id).join(',')}:${leader.points}:${bottom.points}`;
  return sanitiseRoast(pickFreshTemplate(templates, seed, previousRoast));
}

function escapeRoastForTs(value) {
  return sanitiseRoast(value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r\n/g, '\n')
    .replace(/\n/g, '\\n');
}

function replaceDailyUpdate(source, roast) {
  const pattern = /export const ENGLISH_PYRAMID_FANTASY_DAILY_UPDATE =\s*'((?:\\'|[^'])*)'\s*;/;
  if (!pattern.test(source)) {
    throw new Error('Unable to find ENGLISH_PYRAMID_FANTASY_DAILY_UPDATE in data file.');
  }
  return source.replace(
    pattern,
    `export const ENGLISH_PYRAMID_FANTASY_DAILY_UPDATE =\n  '${escapeRoastForTs(roast)}';`
  );
}

function main() {
  const beforeSource = fs.readFileSync(dataPath, 'utf8');
  const beforeIds = parseManualMatchIds(beforeSource, 'ENGLISH_PYRAMID_MANUAL_MATCHES');
  const players = parsePlayers(beforeSource);
  const { searchNames, names } = parseTeamMeta(beforeSource);
  const matches = parseMatches(beforeSource);
  const standings = computeStandings(players, matches, searchNames);
  const dayInfo = latestMatchdaySummary(matches, players, searchNames, names);
  const previousRoast = beforeSource.match(
    /export const ENGLISH_PYRAMID_FANTASY_DAILY_UPDATE =\s*'((?:\\'|[^'])*)'\s*;/,
  )?.[1];
  const roast = sanitiseRoast(buildRoast(standings, dayInfo, previousRoast));

  console.log('Proposed daily roast:');
  console.log(roast);

  if (!writeChanges) {
    console.log('Dry run only. Re-run with --write to update ENGLISH_PYRAMID_FANTASY_DAILY_UPDATE.');
    return;
  }

  const updated = replaceDailyUpdate(beforeSource, roast);
  assertLedgerMonotonic(
    beforeIds,
    parseManualMatchIds(updated, 'ENGLISH_PYRAMID_MANUAL_MATCHES'),
    'ENGLISH_PYRAMID_MANUAL_MATCHES'
  );
  fs.writeFileSync(dataPath, updated, 'utf8');
  console.log('Updated ENGLISH_PYRAMID_FANTASY_DAILY_UPDATE.');
}

main();
