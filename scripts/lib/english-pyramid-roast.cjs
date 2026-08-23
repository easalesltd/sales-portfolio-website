/**
 * Daily roast builder for the English pyramid sweepstake.
 * CI uses this after a ledger sync so the page never gets a TLA dump
 * or a recycled three-line insult template.
 */

const BANNED_ROAST_PHRASES = [
  'nobody clapped',
  'war crime against entertainment',
  'absolute pants',
  'rotting on',
  'human equivalent of a 1-1',
];

const TLA_SCORE_DUMP = /\b[A-Z]{3,4}\s+\d+-\d+\s+[A-Z]{3,4}\b/;

const SHORT_CLUB_NAMES = {
  'AFC Bournemouth': 'Bournemouth',
  'Aston Villa': 'Villa',
  'Brighton & Hove Albion': 'Brighton',
  'Crystal Palace': 'Palace',
  'Manchester City': 'City',
  'Manchester United': 'United',
  'Newcastle United': 'Newcastle',
  'Nottingham Forest': 'Forest',
  'Tottenham Hotspur': 'Spurs',
  'West Bromwich Albion': 'West Brom',
  'West Ham United': 'West Ham',
  'Wolverhampton Wanderers': 'Wolves',
  'Leicester City': 'Leicester',
  'Ipswich Town': 'Ipswich',
  'Sheffield Wednesday': 'Wednesday',
  'Milton Keynes Dons': 'MK Dons',
  'Forest Green Rovers': 'Forest Green',
  'Queens Park Rangers': 'QPR',
};

function extractConstArray(name, source) {
  const match = source.match(
    new RegExp(`export const ${name}[^=]*= \\[([\\s\\S]*?)\\](?: as const)?;`),
  );
  if (!match) {
    throw new Error(`Unable to find ${name}`);
  }
  return match[1];
}

function parseQuotedList(value) {
  return [...value.matchAll(/['"]([^'"]+)['"]/g)].map((match) => match[1]);
}

function parseTsStringAfterKey(body, key) {
  const match = body.match(new RegExp(`${key}:\\s*(['"])((?:\\\\.|(?!\\1)[^\\\\])*)\\1`));
  if (!match) return null;
  return match[2].replace(/\\'/g, "'").replace(/\\"/g, '"');
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
    /export const ENGLISH_PYRAMID_TEAM_BY_CODE[\s\S]*?= \{([\s\S]*?)\n\};/,
  );
  if (!teamTableSource) return { searchNames: new Map(), names: new Map() };

  const searchNames = new Map();
  const names = new Map();
  const teamPattern = /\s([A-Z0-9]+): \{([^}]+)\}/g;
  for (const match of teamTableSource[1].matchAll(teamPattern)) {
    const code = match[1];
    const body = match[2];
    const searchMatch = body.match(/searchNames: \[([^\]]+)\]/);
    const name = parseTsStringAfterKey(body, 'name');
    searchNames.set(code, searchMatch ? parseQuotedList(searchMatch[1]) : []);
    names.set(code, name || code);
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
      homeName: readString(
        objectSource,
        /homeTeam: \{ name: '((?:\\.|[^'\\])*)', tla:/,
        'home name',
      ).replace(/\\'/g, "'"),
      awayName: readString(
        objectSource,
        /awayTeam: \{ name: '((?:\\.|[^'\\])*)', tla:/,
        'away name',
      ).replace(/\\'/g, "'"),
      homeTeam: readString(
        objectSource,
        /homeTeam: \{ name: '(?:\\.|[^'\\])*', tla: '([^']+)' \}/,
        'home team',
      ),
      awayTeam: readString(
        objectSource,
        /awayTeam: \{ name: '(?:\\.|[^'\\])*', tla: '([^']+)' \}/,
        'away team',
      ),
      homeGoals: readNumber(objectSource, 'homeGoals'),
      awayGoals: readNumber(objectSource, 'awayGoals'),
      homeRedCards: readNumber(objectSource, 'homeRedCards'),
      awayRedCards: readNumber(objectSource, 'awayRedCards'),
    };
  });
}

function parseDailyUpdate(source) {
  const match = source.match(
    /export const ENGLISH_PYRAMID_FANTASY_DAILY_UPDATE =\s*'((?:\\'|[^'])*)'\s*;/,
  );
  if (!match) return '';
  return match[1].replace(/\\n/g, '\n').replace(/\\'/g, "'").replace(/\\\\/g, '\\');
}

function teamCodeMatches(matchTla, playerTeamCode, searchNames) {
  const normalized = matchTla.trim().toUpperCase();
  if (playerTeamCode.toUpperCase() === normalized) return true;
  return (searchNames.get(playerTeamCode) ?? []).some(
    (name) => name.toUpperCase() === normalized,
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
    id: player.id,
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
        if (goalsAgainst === 0 && !(goalsFor === 0 && goalsAgainst === 0)) {
          standings[index].bonusPoints += 1;
        }
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

function managerForTeam(players, teamCode, searchNames) {
  return players.find((player) =>
    player.teams.some((code) => teamCodeMatches(teamCode, code, searchNames) || code === teamCode),
  );
}

function clubLabel(code, names, matchName) {
  if (matchName) return SHORT_CLUB_NAMES[matchName] || matchName;
  const named = names.get(code);
  if (named && named !== code) return SHORT_CLUB_NAMES[named] || named;
  return code;
}

function scoringBits(goalsFor, goalsAgainst, redCards, isHome) {
  const bits = [];
  if (goalsFor === 0 && goalsAgainst === 0) {
    bits.push('minus 1 for the 0-0');
  } else if (goalsFor > goalsAgainst) {
    bits.push(isHome ? 'plus 3 for the home win' : 'plus 4 for the away win');
  } else if (goalsFor === goalsAgainst) {
    bits.push('plus 1 for the draw');
  } else {
    bits.push('no win points');
  }

  if (!(goalsFor === 0 && goalsAgainst === 0) && goalsAgainst === 0) {
    bits.push('plus 1 for the clean sheet');
  }
  if (goalsFor >= 3) bits.push('plus 1 for three or more');
  if (goalsAgainst >= 3) bits.push('minus 1 for leaking three');
  if (redCards === 1) bits.push('plus 1 for the red');
  if (redCards > 1) bits.push(`plus ${redCards} for the reds`);

  return bits;
}

function formatNet(points) {
  if (points === 0) return 'net zero';
  if (points > 0) return `net plus ${points}`;
  return `net minus ${Math.abs(points)}`;
}

function latestDayMatches(matches) {
  if (matches.length === 0) return [];
  const latestDate = matches.reduce((max, match) => {
    const date = match.utcDate.slice(0, 10);
    return date > max ? date : max;
  }, matches[0].utcDate.slice(0, 10));
  return matches.filter((match) => match.utcDate.slice(0, 10) === latestDate);
}

function formatBits(bits) {
  if (bits.length === 0) return '';
  const first = bits[0][0].toUpperCase() + bits[0].slice(1);
  return [first, ...bits.slice(1)].join(', ');
}

function describeAppearance(app) {
  const club = app.club;
  const opp = app.opponent;
  const wonScore = `${app.goalsFor}-${app.goalsAgainst}`;
  const lostScore = `${app.goalsAgainst}-${app.goalsFor}`;

  if (app.goalsFor === 0 && app.goalsAgainst === 0) {
    return `${club} served up a boring 0-0 against ${opp}`;
  }
  if (app.goalsFor > app.goalsAgainst && app.isHome) {
    return `${club} beat ${opp} ${wonScore} at home`;
  }
  if (app.goalsFor > app.goalsAgainst) {
    return `${club} won ${wonScore} at ${opp}`;
  }
  if (app.goalsFor === app.goalsAgainst) {
    return `${club} drew ${wonScore} with ${opp}`;
  }
  if (app.isHome) {
    return `${club} lost ${lostScore} at home to ${opp}`;
  }
  return `${club} lost ${lostScore} at ${opp}`;
}

function appearancesForDay(dayMatches, players, searchNames, names) {
  const byManager = new Map();

  for (const match of dayMatches) {
    const homeMgr = managerForTeam(players, match.homeTeam, searchNames);
    const awayMgr = managerForTeam(players, match.awayTeam, searchNames);
    const home = clubLabel(match.homeTeam, names, match.homeName);
    const away = clubLabel(match.awayTeam, names, match.awayName);

    const sides = [
      homeMgr && {
        manager: homeMgr,
        club: home,
        opponent: away,
        isHome: true,
        goalsFor: match.homeGoals,
        goalsAgainst: match.awayGoals,
        redCards: match.homeRedCards,
        otherManager: awayMgr,
      },
      awayMgr && {
        manager: awayMgr,
        club: away,
        opponent: home,
        isHome: false,
        goalsFor: match.awayGoals,
        goalsAgainst: match.homeGoals,
        redCards: match.awayRedCards,
        otherManager: homeMgr,
      },
    ].filter(Boolean);

    for (const side of sides) {
      const key = side.manager.id;
      if (!byManager.has(key)) {
        byManager.set(key, { manager: side.manager, apps: [] });
      }
      byManager.get(key).apps.push(side);
    }
  }

  return byManager;
}

function paragraphForManager(entry, standing) {
  const ownDerby =
    entry.apps.length === 2 &&
    entry.apps.every((app) => app.otherManager?.id === entry.manager.id);

  if (ownDerby) {
    const [first] = entry.apps;
    const score = `${first.goalsFor}-${first.goalsAgainst}`;
    const bits = scoringBits(first.goalsFor, first.goalsAgainst, first.redCards, first.isHome);
    const twinBits = scoringBits(
      entry.apps[1].goalsFor,
      entry.apps[1].goalsAgainst,
      entry.apps[1].redCards,
      entry.apps[1].isHome,
    );
    return `${entry.manager.name}'s ${first.club} and ${first.opponent} played each other and finished ${score}. ${formatBits(bits)} for one, ${twinBits.join(', ')} for the other. ${entry.manager.name} is on ${standing.points}.`;
  }

  const sentences = entry.apps.map((app, index) => {
    const bits = scoringBits(app.goalsFor, app.goalsAgainst, app.redCards, app.isHome);
    const pts = scoreTeamMatch(app.goalsFor, app.goalsAgainst, app.redCards, app.isHome);
    const lead = index === 0 ? `${entry.manager.name}'s ` : 'Then ';
    return `${lead}${describeAppearance(app)}. ${formatBits(bits)}, ${formatNet(pts)}.`;
  });

  sentences.push(`${entry.manager.name} is on ${standing.points}.`);
  return sentences.join(' ');
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

function assertRoastQuality(roast, standings) {
  const errors = [];
  const text = String(roast || '');

  if (/[\u2013\u2014]/.test(text)) {
    errors.push('Roast contains an en dash or em dash. Use a hyphen in scores (0-1).');
  }

  if (TLA_SCORE_DUMP.test(text)) {
    errors.push(`Roast dumps TLA scorelines (${text.match(TLA_SCORE_DUMP)?.[0]}). Name the clubs.`);
  }

  for (const phrase of BANNED_ROAST_PHRASES) {
    if (text.toLowerCase().includes(phrase)) {
      errors.push(`Roast reuses the banned CI filler "${phrase}".`);
    }
  }

  for (const standing of standings) {
    if (!text.includes(standing.name)) {
      errors.push(`Roast is missing manager ${standing.name}.`);
    }
    const pointsPattern = new RegExp(`\\b${standing.points}\\b`);
    if (!pointsPattern.test(text)) {
      errors.push(`Roast is missing ${standing.name}'s total of ${standing.points}.`);
    }
  }

  return errors;
}

function buildRoast(standings, matches, players, searchNames, names) {
  if (standings.length === 0) {
    return sanitiseRoast(
      'Pre-season. Zero points. The ledger is empty and somehow everyone still looks soft.',
    );
  }

  const dayMatches = latestDayMatches(matches);
  const tableLine = `Table: ${standings.map((row) => `${row.name} ${row.points}`).join(', ')}.`;

  if (dayMatches.length === 0) {
    return sanitiseRoast(
      `${standings[0].name} tops the empty table on ${standings[0].points} while ${standings[standings.length - 1].name} is already last on ${standings[standings.length - 1].points}. August cannot come soon enough.\n\n${tableLine}`,
    );
  }

  const byManager = appearancesForDay(dayMatches, players, searchNames, names);
  const playedIds = new Set(byManager.keys());
  const paragraphs = [];

  for (const standing of standings) {
    const entry = byManager.get(standing.id);
    if (!entry) continue;
    paragraphs.push(paragraphForManager(entry, standing));
  }

  const idleLeaders = [];
  const leader = standings[0];
  const bottom = standings[standings.length - 1];
  if (!playedIds.has(leader.id)) {
    idleLeaders.push(
      `${leader.name} still leads on ${leader.points} without a club kicking a ball.`,
    );
  }
  if (!playedIds.has(bottom.id) && bottom.id !== leader.id) {
    idleLeaders.push(`${bottom.name} is still last on ${bottom.points}.`);
  }
  if (idleLeaders.length > 0) {
    paragraphs.push(idleLeaders.join(' '));
  }

  paragraphs.push(tableLine);
  return sanitiseRoast(paragraphs.join('\n\n'));
}

function buildRoastFromSource(source) {
  const players = parsePlayers(source);
  const { searchNames, names } = parseTeamMeta(source);
  const matches = parseMatches(source);
  const standings = computeStandings(players, matches, searchNames);
  const roast = buildRoast(standings, matches, players, searchNames, names);
  const errors = assertRoastQuality(roast, standings);
  if (errors.length > 0) {
    throw new Error(`Generated roast failed quality checks:\n- ${errors.join('\n- ')}`);
  }
  return { roast, standings, matches, players };
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
    `export const ENGLISH_PYRAMID_FANTASY_DAILY_UPDATE =\n  '${escapeRoastForTs(roast)}';`,
  );
}

module.exports = {
  BANNED_ROAST_PHRASES,
  TLA_SCORE_DUMP,
  assertRoastQuality,
  buildRoast,
  buildRoastFromSource,
  clubLabel,
  computeStandings,
  escapeRoastForTs,
  parseDailyUpdate,
  parseMatches,
  parsePlayers,
  parseTeamMeta,
  parseTsStringAfterKey,
  replaceDailyUpdate,
  sanitiseRoast,
  scoreTeamMatch,
};
