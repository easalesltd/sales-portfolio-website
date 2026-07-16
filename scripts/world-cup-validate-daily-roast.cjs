#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const dataPath = path.join(repoRoot, 'app/data/world-cup-fantasy.ts');
const source = fs.readFileSync(dataPath, 'utf8');
const {
  parseKnockoutMatchIds,
  isKnockoutMatchId,
  scoreTeamMatch,
} = require('./lib/world-cup-scoring-lib.cjs');
const { isWorldCupSweepstakeComplete } = require('./lib/world-cup-sweepstake-complete.cjs');

function extractConstArray(name) {
  const match = source.match(new RegExp(`export const ${name}[\\s\\S]*?= \\[([\\s\\S]*?)\\n\\](?: as const)?;`));
  if (!match) {
    throw new Error(`Unable to find ${name} in ${dataPath}`);
  }
  return match[1];
}

function extractConstString(name) {
  const match = source.match(new RegExp(`export const ${name} =\\s*'([\\s\\S]*?)';`));
  if (!match) {
    throw new Error(`Unable to find ${name} in ${dataPath}`);
  }
  return match[1];
}

function parseQuotedList(value) {
  return [...value.matchAll(/'([^']+)'/g)].map((match) => match[1]);
}

function parsePlayers() {
  const playersSource = extractConstArray('WORLD_CUP_FANTASY_PLAYERS');
  const playerPattern = /\{\s*id: '([^']+)',\s*name: '([^']+)',[\s\S]*?teams: \[([^\]]+)\]/g;

  return [...playersSource.matchAll(playerPattern)].map((match) => {
    const block = match[0];
    const teamNameMatch = block.match(/teamName: '([^']+)'/);
    return {
      id: match[1],
      name: match[2],
      teamName: teamNameMatch ? teamNameMatch[1] : null,
      teams: parseQuotedList(match[3]),
    };
  });
}

function parseTeamMeta() {
  const teamTableSource = source.match(
    /export const WORLD_CUP_TEAM_BY_CODE[\s\S]*?= \{([\s\S]*?)\n\};/,
  );
  if (!teamTableSource) return new Map();

  const meta = new Map();
  const teamPattern = /\s([A-Z]{3}): \{([\s\S]*?)\},?(?=\n\s*[A-Z]{3}:|\n\};)/g;
  for (const match of teamTableSource[1].matchAll(teamPattern)) {
    const code = match[1];
    const block = match[2];
    const nameMatch = block.match(/name: '([^']+)'/);
    const searchNamesMatch = block.match(/searchNames: \[([^\]]+)\]/);
    meta.set(code, {
      code,
      name: nameMatch ? nameMatch[1] : code,
      searchNames: searchNamesMatch ? parseQuotedList(searchNamesMatch[1]) : [],
    });
  }

  return meta;
}

function readNumber(objectSource, key, fallback = 0) {
  const match = objectSource.match(new RegExp(`(?:^|[^A-Za-z])${key}: (\\d+)`));
  return match ? Number.parseInt(match[1], 10) : fallback;
}

function readString(objectSource, pattern, label) {
  const match = objectSource.match(pattern);
  if (!match) {
    throw new Error(`Unable to parse ${label} from manual match:\n${objectSource}`);
  }
  return match[1];
}

function parseManualMatches() {
  const matchesSource = extractConstArray('WORLD_CUP_FANTASY_MANUAL_MATCHES');
  const objectPattern = /\{\s*(?:\/\*\*[\s\S]*?\*\/\s*)?id: '[^']+',[\s\S]*?\n\s{2}\}/g;

  return [...matchesSource.matchAll(objectPattern)].map((match) => {
    const objectSource = match[0];
    return {
      id: readString(objectSource, /id: '([^']+)'/, 'id'),
      utcDate: readString(objectSource, /utcDate: '([^']+)'/, 'utcDate'),
      homeName: readString(
        objectSource,
        /homeTeam: \{ name: '([^']+)', tla: '([^']+)' \}/,
        'home team name',
      ),
      homeTla: (() => {
        const match = objectSource.match(/homeTeam: \{ name: '[^']+', tla: '([^']+)' \}/);
        if (!match) throw new Error(`Unable to parse home team TLA from manual match:\n${objectSource}`);
        return match[1];
      })(),
      awayName: readString(
        objectSource,
        /awayTeam: \{ name: '([^']+)', tla: '([^']+)' \}/,
        'away team name',
      ),
      awayTla: (() => {
        const match = objectSource.match(/awayTeam: \{ name: '[^']+', tla: '([^']+)' \}/);
        if (!match) throw new Error(`Unable to parse away team TLA from manual match:\n${objectSource}`);
        return match[1];
      })(),
      homeGoals: readNumber(objectSource, 'homeGoals'),
      awayGoals: readNumber(objectSource, 'awayGoals'),
      homeRedCards: readNumber(objectSource, 'homeRedCards'),
      awayRedCards: readNumber(objectSource, 'awayRedCards'),
      homePenalties: readNumber(objectSource, 'homePenalties', null),
      awayPenalties: readNumber(objectSource, 'awayPenalties', null),
    };
  });
}

function utcDateKey(utcDate) {
  return utcDate.slice(0, 10);
}

function latestManualMatchDay(manualMatches) {
  if (manualMatches.length === 0) return null;
  return manualMatches.map((match) => utcDateKey(match.utcDate)).sort().at(-1);
}

function teamMentions(teamMeta) {
  const mentions = [];

  for (const meta of teamMeta.values()) {
    mentions.push({ code: meta.code, label: meta.name });
    for (const alias of meta.searchNames) {
      mentions.push({ code: meta.code, label: alias });
    }
  }

  return mentions.sort((a, b) => b.label.length - a.label.length);
}

function findMentionedTeams(roast, teamMeta) {
  const mentioned = [];
  const seenCodes = new Set();

  for (const mention of teamMentions(teamMeta)) {
    if (!roast.includes(mention.label) || seenCodes.has(mention.code)) continue;
    seenCodes.add(mention.code);
    mentioned.push(mention);
  }

  return mentioned;
}

function teamsOnDay(manualMatches, roastDay) {
  const codes = new Set();

  for (const match of manualMatches) {
    if (utcDateKey(match.utcDate) !== roastDay) continue;
    codes.add(match.homeTla);
    codes.add(match.awayTla);
  }

  return codes;
}

function teamDates(manualMatches) {
  const datesByTeam = new Map();

  for (const match of manualMatches) {
    const day = utcDateKey(match.utcDate);
    for (const tla of [match.homeTla, match.awayTla]) {
      const dates = datesByTeam.get(tla) ?? new Set();
      dates.add(day);
      datesByTeam.set(tla, dates);
    }
  }

  return datesByTeam;
}

function teamLabel(teamMeta, code) {
  return teamMeta.get(code)?.name ?? code;
}

function roastReferencesTeam(roast, code, teamMeta) {
  if (findMentionedTeams(roast, teamMeta).some((team) => team.code === code)) {
    return true;
  }

  const meta = teamMeta.get(code);
  if (!meta) return false;

  const labels = [meta.name, ...meta.searchNames];
  if (meta.name.includes('-')) {
    labels.push(meta.name.split('-')[0]);
  }

  return labels.some((label) => label.length >= 3 && roast.includes(label));
}

function splitRoastClauses(roast) {
  return roast
    .split(/(?<=[.!?])\s+|\s—\s|,\s+(?=[A-Z])/)
    .map((clause) => clause.trim())
    .filter(Boolean);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function playerOwnsTeam(player, teamCode) {
  return player.teams.includes(teamCode);
}

function teamCodeMatches(matchTla, playerTeamCode, aliases) {
  const normalized = matchTla.trim().toUpperCase();
  if (playerTeamCode.toUpperCase() === normalized) return true;
  return (aliases.get(playerTeamCode) ?? []).some((alias) => alias.toUpperCase() === normalized);
}

function parseTeamAliases(teamMeta) {
  const aliases = new Map();
  const teamTableSource = source.match(
    /export const WORLD_CUP_TEAM_BY_CODE[\s\S]*?= \{([\s\S]*?)\n\};/,
  );
  if (!teamTableSource) return aliases;

  const teamPattern = /\s([A-Z]{3}): \{([\s\S]*?)\},?(?=\n\s*[A-Z]{3}:|\n\};)/g;
  for (const match of teamTableSource[1].matchAll(teamPattern)) {
    const code = match[1];
    const aliasMatch = match[2].match(/aliases: \[([^\]]+)\]/);
    aliases.set(code, aliasMatch ? parseQuotedList(aliasMatch[1]) : []);
  }

  return aliases;
}

function computeStandings(players, matches, aliases, knockoutMatchIds) {
  const standings = players.map((player) => ({
    id: player.id,
    name: player.name,
    teamName: player.teamName,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    bonusPoints: 0,
  }));

  for (const match of matches) {
    const isKnockout = isKnockoutMatchId(match.id, knockoutMatchIds);
    for (const [index, player] of players.entries()) {
      for (const teamCode of player.teams) {
        const isHome = teamCodeMatches(match.homeTla, teamCode, aliases);
        const isAway = teamCodeMatches(match.awayTla, teamCode, aliases);
        if (!isHome && !isAway) continue;

        const goalsFor = isHome ? match.homeGoals : match.awayGoals;
        const goalsAgainst = isHome ? match.awayGoals : match.homeGoals;
        const redCards = isHome ? match.homeRedCards : match.awayRedCards;
        const penaltiesFor = isHome ? match.homePenalties : match.awayPenalties;
        const penaltiesAgainst = isHome ? match.awayPenalties : match.homePenalties;
        standings[index].points += scoreTeamMatch(
          goalsFor,
          goalsAgainst,
          redCards,
          isKnockout,
          penaltiesFor,
          penaltiesAgainst,
        );
        standings[index].goalsFor += goalsFor;
        standings[index].goalsAgainst += goalsAgainst;
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
        a.name.localeCompare(b.name),
    );
}

function standingByName(standings, name) {
  return standings.find((standing) => standing.name === name);
}

function playerDisplayLabels(standing) {
  const labels = [standing.name];
  if (standing.teamName) labels.push(standing.teamName);
  return labels;
}

function roastMentionsLabel(roast, label) {
  return roast.includes(label);
}

function roastMentionsStanding(roast, standing) {
  return playerDisplayLabels(standing).some((label) => roastMentionsLabel(roast, label));
}

function validateFinalRoast(roast, standings) {
  const errors = [];
  const winner = standings[0];
  const bottom = standings.at(-1);

  if (!winner) {
    errors.push('No standings available for final roast validation');
    return errors;
  }

  if (!roastMentionsStanding(roast, winner)) {
    errors.push(
      `Final roast must crown the winner (${playerDisplayLabels(winner).join(' / ')})`,
    );
  }

  const winnerPointPatterns = playerDisplayLabels(winner).flatMap((label) => [
    new RegExp(`\\b${escapeRegExp(label)}\\b(?: wins on| takes it on| crowned on| champion on) (\\d+)\\b`, 'i'),
    new RegExp(`\\b${escapeRegExp(label)}\\b wins the sweepstake on (\\d+)\\b`, 'i'),
  ]);

  for (const pattern of winnerPointPatterns) {
    const match = roast.match(pattern);
    if (!match) continue;
    const claimedPoints = Number.parseInt(match[1], 10);
    if (claimedPoints !== winner.points) {
      errors.push(
        `Final roast says ${match[0]}, but computed champion total is ${winner.points}`,
      );
    }
  }

  if (bottom && bottom.id !== winner.id && !roastMentionsStanding(roast, bottom)) {
    errors.push(
      `Final roast should mention last-placed ${playerDisplayLabels(bottom).join(' / ')}`,
    );
  }

  return errors;
}

function validateStandingsClaims(roast, standings, options = {}) {
  const errors = [];
  const playerNames = standings.map((standing) => standing.name);
  const tournamentComplete = options.tournamentComplete === true;
  const winner = standings[0];

  const leaderPatterns = tournamentComplete
    ? [
        /\b(\w+)\b(?: wins on| takes it on| crowned on| champion on) (\d+)\b/i,
        /\b(\w+)\b wins the sweepstake on (\d+)\b/i,
        /\b(\w+)\b(?: leads on| is top on) (\d+)\b/,
      ]
    : [/\b(\w+)\b(?: leads on| is top on) (\d+)\b/];

  for (const pattern of leaderPatterns) {
    const leaderMatch = roast.match(pattern);
    if (!leaderMatch) continue;

    const [, name, pointsText] = leaderMatch;
    const leader = standings[0];
    const claimedPoints = Number.parseInt(pointsText, 10);

    if (!playerNames.includes(name)) {
      errors.push(`Roast leader name "${name}" is not a sweepstake player`);
    } else if (leader && name !== leader.name && !leader.teamName?.includes(name)) {
      const expected = leader.teamName ? `${leader.teamName} (${leader.name})` : leader.name;
      errors.push(`Roast says ${name} leads on ${pointsText}, but ${expected} leads on ${leader.points}`);
    } else if (leader && name === leader.name && claimedPoints !== leader.points) {
      errors.push(`Roast says ${name} leads on ${pointsText}, but computed leader total is ${leader.points}`);
    } else if (
      leader &&
      leader.teamName &&
      name !== leader.name &&
      roast.includes(leader.teamName) &&
      claimedPoints !== leader.points
    ) {
      errors.push(`Roast says ${name} leads on ${pointsText}, but computed leader total is ${leader.points}`);
    }
    break;
  }

  if (tournamentComplete && winner && !leaderPatterns.some((pattern) => pattern.test(roast))) {
    if (!roastMentionsStanding(roast, winner)) {
      errors.push(`Final roast must state the winner's points (e.g. "${winner.name} wins on ${winner.points}")`);
    }
  }

  const bottomMatch = roast.match(/\b(\w+)\b(?: stays| remains) bottom on (\d+)\b/);
  if (bottomMatch) {
    const [, name, pointsText] = bottomMatch;
    const bottom = standings.at(-1);
    const claimedPoints = Number.parseInt(pointsText, 10);

    if (!playerNames.includes(name)) {
      errors.push(`Roast bottom name "${name}" is not a sweepstake player`);
    } else if (bottom && name !== bottom.name) {
      errors.push(
        `Roast says ${name} is bottom on ${pointsText}, but ${bottom.name} is bottom on ${bottom.points}`,
      );
    } else if (bottom && claimedPoints !== bottom.points) {
      errors.push(`Roast says ${name} is bottom on ${pointsText}, but computed bottom total is ${bottom.points}`);
    }
  }

  const tiedMatch = roast.match(/\b(\w+) and (\w+)\b are (?:level|locked) on (\d+)\b/);
  if (tiedMatch) {
    const [, firstName, secondName, pointsText] = tiedMatch;
    const claimedPoints = Number.parseInt(pointsText, 10);

    for (const name of [firstName, secondName]) {
      const standing = standingByName(standings, name);
      if (!standing) {
        errors.push(`Roast tie mentions unknown player "${name}"`);
      } else if (standing.points !== claimedPoints) {
        errors.push(`Roast says ${name} is level on ${pointsText}, but computed total is ${standing.points}`);
      }
    }
  }

  for (const match of roast.matchAll(/\b(\w+) has (\d+)\b/g)) {
    const [, name, pointsText] = match;
    const standing = standingByName(standings, name);
    const claimedPoints = Number.parseInt(pointsText, 10);

    if (!standing) {
      if (playerNames.includes(name)) continue;
      errors.push(`Roast points mention uses unknown player "${name}"`);
      continue;
    }

    if (standing.points !== claimedPoints) {
      errors.push(`Roast says ${name} has ${pointsText}, but computed total is ${standing.points}`);
    }
  }

  return errors;
}

function validatePlayerTeamLinks(roast, players, teamMeta) {
  const errors = [];
  const mentions = findMentionedTeams(roast, teamMeta);

  for (const clause of splitRoastClauses(roast)) {
    const playersInClause = players.filter((player) => clause.includes(player.name));
    if (playersInClause.length !== 1) continue;

    const player = playersInClause[0];

    for (const team of mentions) {
      if (!clause.includes(team.label) || playerOwnsTeam(player, team.code)) continue;

      const proximityPatterns = [
        new RegExp(`${escapeRegExp(player.name)}.{0,48}${escapeRegExp(team.label)}`, 'i'),
        new RegExp(`${escapeRegExp(team.label)}.{0,48}${escapeRegExp(player.name)}`, 'i'),
      ];

      if (!proximityPatterns.some((pattern) => pattern.test(clause))) continue;

      errors.push(
        `Roast links ${player.name} with ${team.label}, but ${player.name} manages ${player.teams
          .map((code) => teamLabel(teamMeta, code))
          .join(', ')}`,
      );
    }
  }

  return errors;
}

function validateRoastDayScope(roast, manualMatches, teamMeta, roastDay) {
  const errors = [];
  const dayTeams = teamsOnDay(manualMatches, roastDay);
  const datesByTeam = teamDates(manualMatches);
  const mentionedTeams = findMentionedTeams(roast, teamMeta);

  for (const team of mentionedTeams) {
    if (dayTeams.has(team.code)) continue;
    const days = [...(datesByTeam.get(team.code) ?? [])].sort();
    errors.push(
      days.length > 0
        ? `Roast mentions ${team.label}, but that team did not play on ${roastDay} (recorded on ${days.join(', ')})`
        : `Roast mentions ${team.label}, but that team has no recorded results`,
    );
  }

  for (const code of dayTeams) {
    const label = teamLabel(teamMeta, code);
    if (!roastReferencesTeam(roast, code, teamMeta)) {
      errors.push(`Roast omits ${label}, which played on ${roastDay}`);
    }
  }

  return errors;
}

function validateWorldCupDailyRoast(context, options = {}) {
  const { roast, players, manualMatches, standings, teamMeta } = context;
  const tournamentComplete = options.tournamentComplete ?? isWorldCupSweepstakeComplete(manualMatches);
  const roastDay = options.roastDay ?? latestManualMatchDay(manualMatches);

  if (!roastDay) {
    return roast.trim().length > 0 ? ['Roast is set but no manual matches are recorded yet'] : [];
  }

  if (tournamentComplete) {
    return [
      ...validateStandingsClaims(roast, standings, { tournamentComplete: true }),
      ...validatePlayerTeamLinks(roast, players, teamMeta),
      ...validateFinalRoast(roast, standings),
    ];
  }

  return [
    ...validateStandingsClaims(roast, standings),
    ...validatePlayerTeamLinks(roast, players, teamMeta),
    ...validateRoastDayScope(roast, manualMatches, teamMeta, roastDay),
  ];
}

function loadValidationContext() {
  const teamMeta = parseTeamMeta();
  const players = parsePlayers();
  const manualMatches = parseManualMatches();
  const knockoutMatchIds = parseKnockoutMatchIds(extractConstArray('WORLD_CUP_FANTASY_FIXTURES'));
  const standings = computeStandings(players, manualMatches, parseTeamAliases(teamMeta), knockoutMatchIds);
  const roast = extractConstString('WORLD_CUP_FANTASY_DAILY_UPDATE');

  return { roast, players, manualMatches, standings, teamMeta };
}

module.exports = {
  validateWorldCupDailyRoast,
  loadValidationContext,
  latestManualMatchDay,
  isWorldCupSweepstakeComplete,
};

if (require.main === module) {
  const context = loadValidationContext();
  const tournamentComplete = isWorldCupSweepstakeComplete(context.manualMatches);
  const roastDay = latestManualMatchDay(context.manualMatches);
  const errors = validateWorldCupDailyRoast(context, { roastDay, tournamentComplete });

  if (errors.length > 0) {
    console.error(
      `World Cup ${tournamentComplete ? 'final' : 'daily'} roast validation failed for ${roastDay}:`,
    );
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`Validated World Cup ${tournamentComplete ? 'final' : 'daily'} roast for ${roastDay}.`);
}
