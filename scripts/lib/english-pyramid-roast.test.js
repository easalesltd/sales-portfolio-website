/** @jest-environment node */

const fs = require('node:fs');
const path = require('node:path');
const {
  assertRoastQuality,
  buildRoast,
  clubLabel,
  computeStandings,
  parseTeamMeta,
  parseTsStringAfterKey,
  buildRoastFromSource,
} = require('./english-pyramid-roast.cjs');

const players = [
  { id: 'scott', name: 'Scott', teams: ['ARS'] },
  { id: 'chris', name: 'Chris', teams: ['NEW'] },
  { id: 'ben', name: 'Ben', teams: ['LIV'] },
  { id: 'nest', name: 'Nest', teams: ['AVL'] },
  { id: 'dave', name: 'Dave', teams: ['MCI', 'BUR', 'PVL', 'TRN'] },
  { id: 'ash', name: 'Ash', teams: ['MUN'] },
  { id: 'jon', name: 'Jon', teams: ['CHE'] },
];

const names = new Map([
  ['ARS', 'Arsenal'],
  ['NEW', 'Newcastle United'],
  ['LIV', 'Liverpool'],
  ['AVL', 'Aston Villa'],
  ['MCI', 'Manchester City'],
  ['BUR', 'Burnley'],
  ['WBA', 'West Bromwich Albion'],
  ['BHA', 'Brighton & Hove Albion'],
  ['BOU', 'AFC Bournemouth'],
  ['PVL', 'Port Vale'],
  ['TRN', 'Tranmere Rovers'],
  ['MUN', 'Manchester United'],
  ['CHE', 'Chelsea'],
]);

const searchNames = new Map();

const sundayMatches = [
  {
    id: '2026-08-23-wba-bur',
    utcDate: '2026-08-23T11:00Z',
    homeName: 'West Bromwich Albion',
    awayName: 'Burnley',
    homeTeam: 'WBA',
    awayTeam: 'BUR',
    homeGoals: 3,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    id: '2026-08-23-bha-avl',
    utcDate: '2026-08-23T13:00Z',
    homeName: 'Brighton & Hove Albion',
    awayName: 'Aston Villa',
    homeTeam: 'BHA',
    awayTeam: 'AVL',
    homeGoals: 4,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 1,
  },
  {
    id: '2026-08-23-mci-bou',
    utcDate: '2026-08-23T13:00Z',
    homeName: 'Manchester City',
    awayName: 'AFC Bournemouth',
    homeTeam: 'MCI',
    awayTeam: 'BOU',
    homeGoals: 2,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    id: '2026-08-23-new-liv',
    utcDate: '2026-08-23T15:30Z',
    homeName: 'Newcastle United',
    awayName: 'Liverpool',
    homeTeam: 'NEW',
    awayTeam: 'LIV',
    homeGoals: 2,
    awayGoals: 2,
    homeRedCards: 0,
    awayRedCards: 0,
  },
];

function seededStandings(extraPoints) {
  return players.map((player) => ({
    id: player.id,
    name: player.name,
    points: extraPoints[player.id] || 0,
    goalsFor: 0,
    goalsAgainst: 0,
    bonusPoints: 0,
    goalDifference: 0,
  }));
}

describe('parseTeamMeta', () => {
  it('reads double-quoted club names from ENGLISH_PYRAMID_TEAM_BY_CODE', () => {
    const source = `
export const ENGLISH_PYRAMID_TEAM_BY_CODE: Record<string, EnglishPyramidTeamMeta> = {
  ARS: { code: 'ARS', name: "Arsenal", divisionId: 'PL', outrightOddsDecimal: 2.5, oddsNote: "talkSPORT" },
  YOR: { code: 'YOR', name: "York City", divisionId: 'L2', searchNames: ["YORK"] },
};
`;
    const { names, searchNames: searches } = parseTeamMeta(source);
    expect(names.get('ARS')).toBe('Arsenal');
    expect(names.get('YOR')).toBe('York City');
    expect(searches.get('YOR')).toEqual(['YORK']);
  });

  it('reads the live team table instead of falling back to TLAs', () => {
    const source = fs.readFileSync(
      path.join(__dirname, '../../app/data/english-pyramid-fantasy.ts'),
      'utf8',
    );
    const { names, searchNames: searches } = parseTeamMeta(source);
    expect(names.get('ARS')).toBe('Arsenal');
    expect(names.get('MCI')).toBe('Manchester City');
    expect(searches.get('YOR')).toEqual(['YORK']);
    expect(names.get('WBA')).toBeUndefined();
  });

  it('parses both quote styles', () => {
    expect(parseTsStringAfterKey(`name: "Aston Villa"`, 'name')).toBe('Aston Villa');
    expect(parseTsStringAfterKey(`name: 'Aston Villa'`, 'name')).toBe('Aston Villa');
  });
});

describe('clubLabel', () => {
  it('uses the match name and shortens the long ones', () => {
    expect(clubLabel('WBA', names, 'West Bromwich Albion')).toBe('West Brom');
    expect(clubLabel('AVL', names, 'Aston Villa')).toBe('Villa');
  });
});

describe('buildRoast', () => {
  it('names managers and clubs instead of dumping TLAs', () => {
    const prior = {
      scott: 89,
      chris: 73,
      ben: 63,
      nest: 61,
      dave: 51,
      ash: 49,
      jon: 42,
    };
    const standings = computeStandings(players, sundayMatches, searchNames)
      .map((row) => ({ ...row, points: row.points + (prior[row.id] || 0) }))
      .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));

    const roast = buildRoast(standings, sundayMatches, players, searchNames, names);
    const errors = assertRoastQuality(roast, standings);

    expect(errors).toEqual([]);
    expect(roast).toContain("Nest's Villa lost 4-0 at Brighton");
    expect(roast).toContain('plus 1 for the red');
    expect(roast).toContain("Dave's Burnley lost 3-1 at West Brom");
    expect(roast).toContain('Then City beat Bournemouth 2-1 at home');
    expect(roast).toContain('Chris');
    expect(roast).toContain('Ben');
    expect(roast).toContain('2-2');
    expect(roast).toContain('Scott still leads on 89 without a club kicking a ball');
    expect(roast).not.toMatch(/\bWBA 3-1 BUR\b/);
    expect(roast).not.toMatch(/\bBHA 4-0 AVL\b/);
    expect(roast.toLowerCase()).not.toContain('nobody clapped');
    expect(roast.toLowerCase()).not.toContain('war crime');
  });

  it('keeps an own-squad derby as one paragraph', () => {
    const standings = seededStandings({ dave: 51, scott: 89, jon: 42 });
    const matches = [
      {
        id: '2026-08-22-pvl-trn',
        utcDate: '2026-08-22T14:00Z',
        homeName: 'Port Vale',
        awayName: 'Tranmere Rovers',
        homeTeam: 'PVL',
        awayTeam: 'TRN',
        homeGoals: 1,
        awayGoals: 1,
        homeRedCards: 0,
        awayRedCards: 0,
      },
    ];

    const roast = buildRoast(standings, matches, players, searchNames, names);
    expect(roast).toContain("Dave's Port Vale and Tranmere Rovers played each other");
    expect(roast).toContain('1-1');
    expect(roast).toContain('Dave is on 51');
  });
});

describe('assertRoastQuality', () => {
  const standings = [
    { name: 'Scott', points: 89 },
    { name: 'Jon', points: 42 },
  ];

  it('rejects the old CI insult template and TLA dumps', () => {
    const roast =
      "Scott on 89. Congrats, nobody clapped.\n\nWBA 3-1 BUR. BHA 4-0 AVL.\n\nJon on 42 is a war crime against entertainment.";
    const errors = assertRoastQuality(roast, standings);
    expect(errors.some((error) => error.includes('TLA'))).toBe(true);
    expect(errors.some((error) => error.includes('nobody clapped'))).toBe(true);
    expect(errors.some((error) => error.includes('war crime'))).toBe(true);
  });

  it('rejects missing totals', () => {
    const errors = assertRoastQuality('Scott had a nice day. Jon did not.', standings);
    expect(errors.some((error) => error.includes('89'))).toBe(true);
    expect(errors.some((error) => error.includes('42'))).toBe(true);
  });
});

describe('buildRoastFromSource', () => {
  it('builds a valid recap from the live ledger', () => {
    const source = fs.readFileSync(
      path.join(__dirname, '../../app/data/english-pyramid-fantasy.ts'),
      'utf8',
    );
    const { roast, standings } = buildRoastFromSource(source);
    expect(assertRoastQuality(roast, standings)).toEqual([]);
    expect(roast).toContain('Table:');
  });
});
