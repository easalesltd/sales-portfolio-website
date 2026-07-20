#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const dataPath = path.join(repoRoot, 'app/data/english-pyramid-fantasy.ts');
const source = fs.readFileSync(dataPath, 'utf8');

function extractConstArray(name) {
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

function parsePlayers() {
  const playersSource = extractConstArray('ENGLISH_PYRAMID_FANTASY_PLAYERS');
  const playerPattern = /\{\s*id: '([^']+)',\s*name: '([^']+)',[\s\S]*?teams: \[([^\]]+)\]/g;

  return [...playersSource.matchAll(playerPattern)].map((match) => ({
    id: match[1],
    name: match[2],
    teams: parseQuotedList(match[3]),
  }));
}

function parseTeamSearchNames() {
  const teamTableSource = source.match(
    /export const ENGLISH_PYRAMID_TEAM_BY_CODE[\s\S]*?= \{([\s\S]*?)\n\};/
  );
  if (!teamTableSource) return new Map();

  const searchNames = new Map();
  const teamPattern = /\s([A-Z0-9]+): \{([\s\S]*?)\n\s{2}\},?/g;
  for (const match of teamTableSource[1].matchAll(teamPattern)) {
    const code = match[1];
    const searchMatch = match[2].match(/searchNames: \[([^\]]+)\]/);
    searchNames.set(code, searchMatch ? parseQuotedList(searchMatch[1]) : []);
  }

  return searchNames;
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

function parseMatches() {
  const matchesSource = extractConstArray('ENGLISH_PYRAMID_MANUAL_MATCHES');
  const objectPattern = /\{\s*(?:\/\*\*[\s\S]*?\*\/\s*)?id: '[^']+',[\s\S]*?\n\s{2}\}/g;

  return [...matchesSource.matchAll(objectPattern)].map((match) => {
    const objectSource = match[0];
    return {
      id: readString(objectSource, /id: '([^']+)'/, 'id'),
      homeTeam: readString(
        objectSource,
        /homeTeam: \{ name: '[^']+', tla: '([^']+)' \}/,
        'home team'
      ),
      awayTeam: readString(
        objectSource,
        /awayTeam: \{ name: '[^']+', tla: '([^']+)' \}/,
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

function scoreTeamMatch(goalsFor, goalsAgainst, redCards) {
  let total = goalsFor > goalsAgainst ? 3 : goalsFor === goalsAgainst ? 1 : 0;
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
        standings[index].points += scoreTeamMatch(goalsFor, goalsAgainst, redCards);
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

const standings = computeStandings(parsePlayers(), parseMatches(), parseTeamSearchNames());

console.log('Current English pyramid sweepstake standings:');
standings.forEach((standing, index) => {
  console.log(`${index + 1}. ${standing.name} — ${standing.points} pts`);
});
