/**
 * English pyramid sweepstake — seven divisions, one club each per manager.
 * Draft: clubs ranked 1–7 by pre-season outright odds within each division; each manager
 * gets exactly one pick at each rank (one favourite, one second favourite, … one seventh)
 * spread across the seven divisions — player index p takes rank ((p + divisionIndex) mod 7) + 1.
 */
export type EnglishPyramidDivision = {
  id: string;
  label: string;
  tier: number;
};

export type EnglishPyramidTeamMeta = {
  code: string;
  name: string;
  divisionId: string;
  /** Decimal outright winner odds at 2026/27 pre-season (lower = favourite). */
  outrightOddsDecimal: number;
  /** Where odds are published; NL North/South use estimated ranking where markets are thin. */
  oddsNote?: string;
  searchNames?: readonly string[];
};

export const ENGLISH_PYRAMID_DIVISIONS: readonly EnglishPyramidDivision[] = [
  { id: 'PL', label: 'Premier League', tier: 1 },
  { id: 'CH', label: 'Championship', tier: 2 },
  { id: 'L1', label: 'League One', tier: 3 },
  { id: 'L2', label: 'League Two', tier: 4 },
  { id: 'NL', label: 'National League', tier: 5 },
  { id: 'NLN', label: 'National League North', tier: 6 },
  { id: 'NLS', label: 'National League South', tier: 7 },
] as const;

/** All clubs in the draft pool (49) with pre-season title odds. */
export const ENGLISH_PYRAMID_TEAM_BY_CODE: Record<string, EnglishPyramidTeamMeta> = {
  ARS: { code: 'ARS', name: 'Arsenal', divisionId: 'PL', outrightOddsDecimal: 2.5, oddsNote: 'Goal.com / BetVictor Jun 2026' },
  MCI: { code: 'MCI', name: 'Manchester City', divisionId: 'PL', outrightOddsDecimal: 3.5, oddsNote: 'Goal.com Jun 2026' },
  LIV: { code: 'LIV', name: 'Liverpool', divisionId: 'PL', outrightOddsDecimal: 6.5, oddsNote: 'Goal.com Jun 2026' },
  MUN: { code: 'MUN', name: 'Manchester United', divisionId: 'PL', outrightOddsDecimal: 7, oddsNote: 'Goal.com Jun 2026' },
  CHE: { code: 'CHE', name: 'Chelsea', divisionId: 'PL', outrightOddsDecimal: 11, oddsNote: 'Goal.com Jun 2026' },
  AVL: { code: 'AVL', name: 'Aston Villa', divisionId: 'PL', outrightOddsDecimal: 26, oddsNote: 'Racing Post 25/1 Jun 2026' },
  NEW: { code: 'NEW', name: 'Newcastle United', divisionId: 'PL', outrightOddsDecimal: 41, oddsNote: 'Racing Post 40/1 Jun 2026' },
  WHU: { code: 'WHU', name: 'West Ham United', divisionId: 'CH', outrightOddsDecimal: 3.5, oddsNote: 'BettingLounge 5/2 Jun 2026' },
  WOL: { code: 'WOL', name: 'Wolverhampton Wanderers', divisionId: 'CH', outrightOddsDecimal: 7, oddsNote: 'BettingLounge 6/1 Jun 2026' },
  BUR: { code: 'BUR', name: 'Burnley', divisionId: 'CH', outrightOddsDecimal: 9, oddsNote: 'BettingLounge 8/1 Jun 2026' },
  MID: { code: 'MID', name: 'Middlesbrough', divisionId: 'CH', outrightOddsDecimal: 13, oddsNote: 'BettingLounge 12/1 Jun 2026' },
  BIR: { code: 'BIR', name: 'Birmingham City', divisionId: 'CH', outrightOddsDecimal: 15, oddsNote: 'BettingLounge 14/1 Jun 2026' },
  SHU: { code: 'SHU', name: 'Sheffield United', divisionId: 'CH', outrightOddsDecimal: 17, oddsNote: 'BettingLounge 16/1 Jun 2026' },
  SOU: { code: 'SOU', name: 'Southampton', divisionId: 'CH', outrightOddsDecimal: 15, oddsNote: 'Betfair 14/1 Jun 2026' },
  LEI: { code: 'LEI', name: 'Leicester City', divisionId: 'L1', outrightOddsDecimal: 4, oddsNote: 'BetVictor 3/1 Jun 2026' },
  SHW: { code: 'SHW', name: 'Sheffield Wednesday', divisionId: 'L1', outrightOddsDecimal: 8.5, oddsNote: 'BetVictor 15/2 Jun 2026' },
  LUT: { code: 'LUT', name: 'Luton Town', divisionId: 'L1', outrightOddsDecimal: 10, oddsNote: 'Bet365 9/1 Jun 2026' },
  STP: { code: 'STP', name: 'Stockport County', divisionId: 'L1', outrightOddsDecimal: 15, oddsNote: 'Bet365 14/1 Jun 2026' },
  PLY: { code: 'PLY', name: 'Plymouth Argyle', divisionId: 'L1', outrightOddsDecimal: 15, oddsNote: 'Bet365 14/1 Jun 2026' },
  HUD: { code: 'HUD', name: 'Huddersfield Town', divisionId: 'L1', outrightOddsDecimal: 15, oddsNote: 'Bet365 14/1 Jun 2026' },
  BOL: { code: 'BOL', name: 'Bolton Wanderers', divisionId: 'L1', outrightOddsDecimal: 17, oddsNote: 'Betfair 66/1 promotion Jun 2026' },
  BAR: { code: 'BAR', name: 'Barnet', divisionId: 'L2', outrightOddsDecimal: 10, oddsNote: 'Sky Bet 9/1 Jun 2026' },
  ROT: { code: 'ROT', name: 'Rotherham United', divisionId: 'L2', outrightOddsDecimal: 10, oddsNote: 'Sky Bet 9/1 Jun 2026' },
  PVL: { code: 'PVL', name: 'Port Vale', divisionId: 'L2', outrightOddsDecimal: 10, oddsNote: 'Sky Bet 9/1 Jun 2026' },
  SAL: { code: 'SAL', name: 'Salford City', divisionId: 'L2', outrightOddsDecimal: 11, oddsNote: 'Sky Bet 10/1 Jun 2026' },
  CHS: { code: 'CHS', name: 'Chesterfield', divisionId: 'L2', outrightOddsDecimal: 11, oddsNote: 'Sky Bet 10/1 Jun 2026' },
  BRST: { code: 'BRST', name: 'Bristol Rovers', divisionId: 'L2', outrightOddsDecimal: 11, oddsNote: 'Sky Bet 11/1 Jun 2026' },
  GRI: { code: 'GRI', name: 'Grimsby Town', divisionId: 'L2', outrightOddsDecimal: 12, oddsNote: 'Estimated L2 pre-season Jun 2026' },
  CAR: { code: 'CAR', name: 'Carlisle United', divisionId: 'NL', outrightOddsDecimal: 3.75, oddsNote: 'BetVictor 11/4 Jun 2026' },
  STD: { code: 'STD', name: 'Southend United', divisionId: 'NL', outrightOddsDecimal: 6, oddsNote: 'BetVictor 5/1 Jun 2026' },
  FGR: { code: 'FGR', name: 'Forest Green Rovers', divisionId: 'NL', outrightOddsDecimal: 7.5, oddsNote: 'BetVictor 13/2 Jun 2026' },
  BORE: { code: 'BORE', name: 'Boreham Wood', divisionId: 'NL', outrightOddsDecimal: 9, oddsNote: 'BetVictor 8/1 Jun 2026', searchNames: ['Boreham Wood FC'] },
  HPL: { code: 'HPL', name: 'Hartlepool United', divisionId: 'NL', outrightOddsDecimal: 11, oddsNote: 'BetVictor 10/1 Jun 2026' },
  SCU: { code: 'SCU', name: 'Scunthorpe United', divisionId: 'NL', outrightOddsDecimal: 11, oddsNote: 'BetVictor 10/1 Jun 2026' },
  YOR: { code: 'YOR', name: 'York City', divisionId: 'NL', outrightOddsDecimal: 13, oddsNote: 'Estimated NL pre-season Jun 2026' },
  SSH: { code: 'SSH', name: 'South Shields', divisionId: 'NLN', outrightOddsDecimal: 4, oddsNote: 'Estimated from 2025/26 NL North runners-up' },
  MAC: { code: 'MAC', name: 'Macclesfield', divisionId: 'NLN', outrightOddsDecimal: 5, oddsNote: 'Estimated NL North pre-season Jun 2026' },
  MER: { code: 'MER', name: 'Merthyr Town', divisionId: 'NLN', outrightOddsDecimal: 6, oddsNote: 'Estimated NL North pre-season Jun 2026' },
  WRK: { code: 'WRK', name: 'Worksop Town', divisionId: 'NLN', outrightOddsDecimal: 7, oddsNote: 'Estimated NL North pre-season Jun 2026' },
  DAR: { code: 'DAR', name: 'Darlington', divisionId: 'NLN', outrightOddsDecimal: 8, oddsNote: 'Estimated NL North pre-season Jun 2026' },
  BUX: { code: 'BUX', name: 'Buxton', divisionId: 'NLN', outrightOddsDecimal: 9, oddsNote: 'Estimated NL North pre-season Jun 2026' },
  CHF: { code: 'CHF', name: 'Chester FC', divisionId: 'NLN', outrightOddsDecimal: 10, oddsNote: 'Estimated NL North pre-season Jun 2026' },
  DAG: { code: 'DAG', name: 'Dagenham & Redbridge', divisionId: 'NLS', outrightOddsDecimal: 4, oddsNote: 'Estimated NL South pre-season Jun 2026', searchNames: ['Dagenham and Redbridge'] },
  TOR: { code: 'TOR', name: 'Torquay United', divisionId: 'NLS', outrightOddsDecimal: 5, oddsNote: 'Estimated NL South pre-season Jun 2026' },
  HOR: { code: 'HOR', name: 'Horsham', divisionId: 'NLS', outrightOddsDecimal: 6, oddsNote: 'Estimated NL South pre-season Jun 2026' },
  WSM: { code: 'WSM', name: 'Weston-super-Mare', divisionId: 'NLS', outrightOddsDecimal: 7, oddsNote: 'Estimated NL South pre-season Jun 2026', searchNames: ['Weston super Mare'] },
  MAI: { code: 'MAI', name: 'Maidstone United', divisionId: 'NLS', outrightOddsDecimal: 8, oddsNote: 'Estimated NL South pre-season Jun 2026' },
  EBB: { code: 'EBB', name: 'Ebbsfleet United', divisionId: 'NLS', outrightOddsDecimal: 9, oddsNote: 'Estimated NL South pre-season Jun 2026' },
  CLM: { code: 'CLM', name: 'Chelmsford City', divisionId: 'NLS', outrightOddsDecimal: 10, oddsNote: 'Estimated NL South pre-season Jun 2026' },
};

const DIVISION_LABEL_BY_ID = Object.fromEntries(ENGLISH_PYRAMID_DIVISIONS.map((d) => [d.id, d.label]));

function buildPreSeasonOddsRankByCode(): Record<string, number> {
  const byDivision = new Map<string, EnglishPyramidTeamMeta[]>();
  for (const meta of Object.values(ENGLISH_PYRAMID_TEAM_BY_CODE)) {
    const list = byDivision.get(meta.divisionId) ?? [];
    list.push(meta);
    byDivision.set(meta.divisionId, list);
  }

  const ranks: Record<string, number> = {};
  for (const teams of byDivision.values()) {
    teams
      .sort(
        (a, b) =>
          a.outrightOddsDecimal - b.outrightOddsDecimal || a.code.localeCompare(b.code)
      )
      .forEach((team, index) => {
        ranks[team.code] = index + 1;
      });
  }
  return ranks;
}

const PRESEASON_ODDS_RANK_BY_CODE = buildPreSeasonOddsRankByCode();

export function getPreSeasonOddsRank(code: string): number | null {
  return PRESEASON_ODDS_RANK_BY_CODE[code] ?? null;
}

export function teamCodeMatches(matchTla: string, playerTeamCode: string): boolean {
  const meta = ENGLISH_PYRAMID_TEAM_BY_CODE[playerTeamCode];
  const normalized = matchTla.trim().toUpperCase();
  if (playerTeamCode.toUpperCase() === normalized) return true;
  return (meta?.searchNames ?? []).some((name) => name.toUpperCase() === normalized);
}

export function getEnglishPyramidTeamSearchTerms(code: string): string[] {
  const meta = ENGLISH_PYRAMID_TEAM_BY_CODE[code];
  if (!meta) return [code];
  return [...new Set([meta.code, meta.name, ...(meta.searchNames ?? [])])];
}

export function formatTeamLabel(code: string): string {
  const meta = ENGLISH_PYRAMID_TEAM_BY_CODE[code];
  if (!meta) return code;
  const division = DIVISION_LABEL_BY_ID[meta.divisionId];
  const rank = PRESEASON_ODDS_RANK_BY_CODE[code];
  if (division && rank != null) {
    return `${meta.name} (#${rank}, ${division})`;
  }
  if (rank != null) return `${meta.name} (#${rank})`;
  return division ? `${meta.name} (${division})` : meta.name;
}

export type EnglishPyramidFantasyPlayer = {
  id: string;
  name: string;
  teamName?: string;
  managerImage: string;
  clubCrest: string;
  teams: readonly string[];
  draftNote: string;
};

export const ENGLISH_PYRAMID_SWEEPSTAKE_INTRO =
  'Seven managers, seven English divisions — one club from the Premier League down to National League North and South. Points follow your clubs’ real league results all season.';

export const ENGLISH_PYRAMID_SWEEPSTAKE_FAIRNESS =
  'Within each division, clubs were ranked 1–7 by pre-season outright winner betting odds. Each manager gets exactly one pick at each rank — one favourite, one second favourite, and so on — spread across the seven divisions, so nobody stacks all the favourites or all the long shots.';

export const ENGLISH_PYRAMID_FANTASY_DAILY_UPDATE =
  'Season opens soon — no league results in the ledger yet. When the 2026/27 campaigns kick off, this roast will start naming names. lol at Scott already being last.';

export const ENGLISH_PYRAMID_FANTASY_PLAYERS: readonly EnglishPyramidFantasyPlayer[] = [
  {
    id: 'ash',
    name: 'Ash',
    teamName: 'FC Cajuicey',
    managerImage: '/images/world-cup-fantasy/managers/ash.png',
    clubCrest: '/images/world-cup-fantasy/crests/ash.png',
    teams: ['ARS', 'WOL', 'LUT', 'BRST', 'HPL', 'BUX', 'CLM'],
    draftNote:
      'The #1 pick in the Premier League (Arsenal) balanced by a #7 in the south (Chelmsford) — Wolves, Luton and Bristol Rovers fill the middle, Hartlepool and Buxton cover the non-league bands.',
  },
  {
    id: 'jon',
    name: 'Jon',
    teamName: 'Team Noah',
    managerImage: '/images/world-cup-fantasy/managers/jon.png',
    clubCrest: '/images/world-cup-fantasy/crests/team-noah-fc.png',
    teams: ['MCI', 'BUR', 'HUD', 'CHS', 'SCU', 'CHF', 'DAG'],
    draftNote:
      'City as the #2 Premier League pick, Burnley #3 in the Championship, Huddersfield and Chesterfield in the middle tiers — Scunthorpe, Chester and Dagenham round out the pyramid.',
  },
  {
    id: 'nest',
    name: 'Nest',
    teamName: 'Summer Soul Vibes UTD',
    managerImage: '/images/world-cup-fantasy/managers/nest.png',
    clubCrest: '/images/world-cup-fantasy/crests/nest.png',
    teams: ['LIV', 'MID', 'PLY', 'SAL', 'YOR', 'SSH', 'TOR'],
    draftNote:
      'Liverpool #3 in the top flight, Middlesbrough and Plymouth carry promotion hope, Salford and York add grit — South Shields and Torquay bring the soulful long shots.',
  },
  {
    id: 'chris',
    name: 'Chris',
    teamName: 'Saka Potatoes',
    managerImage: '/images/world-cup-fantasy/managers/chris.png',
    clubCrest: '/images/world-cup-fantasy/crests/saka-potatoes-fc.png',
    teams: ['MUN', 'BIR', 'STP', 'GRI', 'CAR', 'MAC', 'HOR'],
    draftNote:
      'United #4 in the Premier League, Birmingham and Stockport know the chase, Grimsby and Carlisle steady the ship — Macclesfield and Horsham for potato-powered upsets.',
  },
  {
    id: 'scott',
    name: 'Scott',
    teamName: 'Objection Overruled FC',
    managerImage: '/images/world-cup-fantasy/managers/scott.png',
    clubCrest: '/images/world-cup-fantasy/crests/objection-overruled.png',
    teams: ['CHE', 'SOU', 'BOL', 'BAR', 'STD', 'MER', 'WSM'],
    draftNote:
      'Chelsea #5 at the top, Southampton and Bolton in the middle leagues, Barnet and Southend cover the lower tiers — Merthyr and Weston-super-Mare for the objectionable outsiders.',
  },
  {
    id: 'dave',
    name: 'Dave',
    teamName: 'Creamy Creamers FC',
    managerImage: '/images/world-cup-fantasy/managers/dave.png',
    clubCrest: '/images/world-cup-fantasy/crests/dave.png',
    teams: ['AVL', 'SHU', 'LEI', 'PVL', 'FGR', 'WRK', 'MAI'],
    draftNote:
      'Villa #6 in the Premier League but Leicester #1 in League One — Port Vale, Forest Green and Worksop cream the middle, Maidstone the southern wildcard.',
  },
  {
    id: 'ben',
    name: 'Ben',
    teamName: 'Mulletman FC',
    managerImage: '/images/world-cup-fantasy/managers/ben.png',
    clubCrest: '/images/world-cup-fantasy/crests/mulletman-fc.png?v=5',
    teams: ['NEW', 'WHU', 'SHW', 'ROT', 'BORE', 'DAR', 'EBB'],
    draftNote:
      'Newcastle as the #7 Premier League pick, but West Ham #1 in the Championship and Wednesday #2 in League One — Rotherham, Boreham Wood and Darlington fill the ladder, Ebbsfleet the southern long shot.',
  },
] as const;

export const ENGLISH_PYRAMID_FANTASY_SCORING = {
  win: 3,
  draw: 1,
  loss: 0,
  highScoringBonusMinGoals: 3,
  highScoringBonus: 1,
  cleanSheetBonus: 1,
  redCardPenalty: -1,
  highConcededPenaltyMinGoals: 3,
  highConcededPenalty: -1,
} as const;

export type EnglishPyramidManualMatch = {
  id: string;
  utcDate: string;
  homeTeam: { name: string; tla: string };
  awayTeam: { name: string; tla: string };
  homeGoals: number;
  awayGoals: number;
  homeRedCards?: number;
  awayRedCards?: number;
};

export const ENGLISH_PYRAMID_MANUAL_MATCHES: readonly EnglishPyramidManualMatch[] = [];

export type EnglishPyramidFixture = {
  id: string;
  /** UTC ISO-8601 — convert from Europe/London kick-off (e.g. Sat 15:00 UK → 14:00Z in BST). */
  utcDate: string;
  homeTeam: { name: string; tla: string };
  awayTeam: { name: string; tla: string };
};

/** Sweepstake fixtures for our 28 ESPN-covered clubs (PL → L2). National League when ESPN publishes 2026/27; NL North/South add manually. Fetched 2026-06-27 via npm run english-pyramid:fetch-fixtures. */
export const ENGLISH_PYRAMID_FIXTURES: readonly EnglishPyramidFixture[] = [
  {
    id: '2026-08-15-bar-sal',
    utcDate: '2026-08-15T14:00Z',
    homeTeam: { name: 'Barnet', tla: 'BAR' },
    awayTeam: { name: 'Salford City', tla: 'SAL' },
  },
  {
    id: '2026-08-15-ply-stp',
    utcDate: '2026-08-15T14:00Z',
    homeTeam: { name: 'Plymouth Argyle', tla: 'PLY' },
    awayTeam: { name: 'Stockport County', tla: 'STP' },
  },
  {
    id: '2026-08-15-shu-bir',
    utcDate: '2026-08-15T16:30Z',
    homeTeam: { name: 'Sheffield United', tla: 'SHU' },
    awayTeam: { name: 'Birmingham City', tla: 'BIR' },
  },
  {
    id: '2026-08-16-bur-whu',
    utcDate: '2026-08-16T15:00Z',
    homeTeam: { name: 'Burnley', tla: 'BUR' },
    awayTeam: { name: 'West Ham United', tla: 'WHU' },
  },
  {
    id: '2026-08-22-sal-chs',
    utcDate: '2026-08-22T14:00Z',
    homeTeam: { name: 'Salford City', tla: 'SAL' },
    awayTeam: { name: 'Chesterfield', tla: 'CHS' },
  },
  {
    id: '2026-08-23-new-liv',
    utcDate: '2026-08-23T15:30Z',
    homeTeam: { name: 'Newcastle United', tla: 'NEW' },
    awayTeam: { name: 'Liverpool', tla: 'LIV' },
  },
  {
    id: '2026-08-29-avl-ars',
    utcDate: '2026-08-29T14:00Z',
    homeTeam: { name: 'Aston Villa', tla: 'AVL' },
    awayTeam: { name: 'Arsenal', tla: 'ARS' },
  },
  {
    id: '2026-08-29-rot-chs',
    utcDate: '2026-08-29T14:00Z',
    homeTeam: { name: 'Rotherham United', tla: 'ROT' },
    awayTeam: { name: 'Chesterfield', tla: 'CHS' },
  },
  {
    id: '2026-09-01-bir-sou',
    utcDate: '2026-09-01T18:45Z',
    homeTeam: { name: 'Birmingham City', tla: 'BIR' },
    awayTeam: { name: 'Southampton', tla: 'SOU' },
  },
  {
    id: '2026-09-01-lei-ply',
    utcDate: '2026-09-01T18:45Z',
    homeTeam: { name: 'Leicester City', tla: 'LEI' },
    awayTeam: { name: 'Plymouth Argyle', tla: 'PLY' },
  },
  {
    id: '2026-09-01-lut-stp',
    utcDate: '2026-09-01T18:45Z',
    homeTeam: { name: 'Luton Town', tla: 'LUT' },
    awayTeam: { name: 'Stockport County', tla: 'STP' },
  },
  {
    id: '2026-09-01-whu-wol',
    utcDate: '2026-09-01T18:45Z',
    homeTeam: { name: 'West Ham United', tla: 'WHU' },
    awayTeam: { name: 'Wolverhampton Wanderers', tla: 'WOL' },
  },
  {
    id: '2026-09-02-bur-mid',
    utcDate: '2026-09-02T18:45Z',
    homeTeam: { name: 'Burnley', tla: 'BUR' },
    awayTeam: { name: 'Middlesbrough', tla: 'MID' },
  },
  {
    id: '2026-09-05-ars-che',
    utcDate: '2026-09-05T14:00Z',
    homeTeam: { name: 'Arsenal', tla: 'ARS' },
    awayTeam: { name: 'Chelsea', tla: 'CHE' },
  },
  {
    id: '2026-09-05-bir-wol',
    utcDate: '2026-09-05T14:00Z',
    homeTeam: { name: 'Birmingham City', tla: 'BIR' },
    awayTeam: { name: 'Wolverhampton Wanderers', tla: 'WOL' },
  },
  {
    id: '2026-09-05-brst-rot',
    utcDate: '2026-09-05T14:00Z',
    homeTeam: { name: 'Bristol Rovers', tla: 'BRST' },
    awayTeam: { name: 'Rotherham United', tla: 'ROT' },
  },
  {
    id: '2026-09-05-chs-bar',
    utcDate: '2026-09-05T14:00Z',
    homeTeam: { name: 'Chesterfield', tla: 'CHS' },
    awayTeam: { name: 'Barnet', tla: 'BAR' },
  },
  {
    id: '2026-09-05-sal-pvl',
    utcDate: '2026-09-05T14:00Z',
    homeTeam: { name: 'Salford City', tla: 'SAL' },
    awayTeam: { name: 'Port Vale', tla: 'PVL' },
  },
  {
    id: '2026-09-12-gri-brst',
    utcDate: '2026-09-12T14:00Z',
    homeTeam: { name: 'Grimsby Town', tla: 'GRI' },
    awayTeam: { name: 'Bristol Rovers', tla: 'BRST' },
  },
  {
    id: '2026-09-12-mun-mci',
    utcDate: '2026-09-12T14:00Z',
    homeTeam: { name: 'Manchester United', tla: 'MUN' },
    awayTeam: { name: 'Manchester City', tla: 'MCI' },
  },
  {
    id: '2026-09-12-rot-sal',
    utcDate: '2026-09-12T14:00Z',
    homeTeam: { name: 'Rotherham United', tla: 'ROT' },
    awayTeam: { name: 'Salford City', tla: 'SAL' },
  },
  {
    id: '2026-09-12-shu-wol',
    utcDate: '2026-09-12T14:00Z',
    homeTeam: { name: 'Sheffield United', tla: 'SHU' },
    awayTeam: { name: 'Wolverhampton Wanderers', tla: 'WOL' },
  },
  {
    id: '2026-09-12-stp-lei',
    utcDate: '2026-09-12T14:00Z',
    homeTeam: { name: 'Stockport County', tla: 'STP' },
    awayTeam: { name: 'Leicester City', tla: 'LEI' },
  },
  {
    id: '2026-09-19-bir-mid',
    utcDate: '2026-09-19T14:00Z',
    homeTeam: { name: 'Birmingham City', tla: 'BIR' },
    awayTeam: { name: 'Middlesbrough', tla: 'MID' },
  },
  {
    id: '2026-09-19-shw-stp',
    utcDate: '2026-09-19T14:00Z',
    homeTeam: { name: 'Sheffield Wednesday', tla: 'SHW' },
    awayTeam: { name: 'Stockport County', tla: 'STP' },
  },
  {
    id: '2026-09-26-hud-lut',
    utcDate: '2026-09-26T14:00Z',
    homeTeam: { name: 'Huddersfield Town', tla: 'HUD' },
    awayTeam: { name: 'Luton Town', tla: 'LUT' },
  },
  {
    id: '2026-10-10-brst-bar',
    utcDate: '2026-10-10T14:00Z',
    homeTeam: { name: 'Bristol Rovers', tla: 'BRST' },
    awayTeam: { name: 'Barnet', tla: 'BAR' },
  },
  {
    id: '2026-10-10-hud-shw',
    utcDate: '2026-10-10T14:00Z',
    homeTeam: { name: 'Huddersfield Town', tla: 'HUD' },
    awayTeam: { name: 'Sheffield Wednesday', tla: 'SHW' },
  },
  {
    id: '2026-10-10-liv-mci',
    utcDate: '2026-10-10T14:00Z',
    homeTeam: { name: 'Liverpool', tla: 'LIV' },
    awayTeam: { name: 'Manchester City', tla: 'MCI' },
  },
  {
    id: '2026-10-10-mid-wol',
    utcDate: '2026-10-10T14:00Z',
    homeTeam: { name: 'Middlesbrough', tla: 'MID' },
    awayTeam: { name: 'Wolverhampton Wanderers', tla: 'WOL' },
  },
  {
    id: '2026-10-10-pvl-gri',
    utcDate: '2026-10-10T14:00Z',
    homeTeam: { name: 'Port Vale', tla: 'PVL' },
    awayTeam: { name: 'Grimsby Town', tla: 'GRI' },
  },
  {
    id: '2026-10-17-bur-wol',
    utcDate: '2026-10-17T14:00Z',
    homeTeam: { name: 'Burnley', tla: 'BUR' },
    awayTeam: { name: 'Wolverhampton Wanderers', tla: 'WOL' },
  },
  {
    id: '2026-10-17-new-avl',
    utcDate: '2026-10-17T14:00Z',
    homeTeam: { name: 'Newcastle United', tla: 'NEW' },
    awayTeam: { name: 'Aston Villa', tla: 'AVL' },
  },
  {
    id: '2026-10-17-ply-hud',
    utcDate: '2026-10-17T14:00Z',
    homeTeam: { name: 'Plymouth Argyle', tla: 'PLY' },
    awayTeam: { name: 'Huddersfield Town', tla: 'HUD' },
  },
  {
    id: '2026-10-17-pvl-chs',
    utcDate: '2026-10-17T14:00Z',
    homeTeam: { name: 'Port Vale', tla: 'PVL' },
    awayTeam: { name: 'Chesterfield', tla: 'CHS' },
  },
  {
    id: '2026-10-20-brst-sal',
    utcDate: '2026-10-20T18:45Z',
    homeTeam: { name: 'Bristol Rovers', tla: 'BRST' },
    awayTeam: { name: 'Salford City', tla: 'SAL' },
  },
  {
    id: '2026-10-24-avl-mci',
    utcDate: '2026-10-24T14:00Z',
    homeTeam: { name: 'Aston Villa', tla: 'AVL' },
    awayTeam: { name: 'Manchester City', tla: 'MCI' },
  },
  {
    id: '2026-10-24-lut-lei',
    utcDate: '2026-10-24T14:00Z',
    homeTeam: { name: 'Luton Town', tla: 'LUT' },
    awayTeam: { name: 'Leicester City', tla: 'LEI' },
  },
  {
    id: '2026-10-24-whu-sou',
    utcDate: '2026-10-24T14:00Z',
    homeTeam: { name: 'West Ham United', tla: 'WHU' },
    awayTeam: { name: 'Southampton', tla: 'SOU' },
  },
  {
    id: '2026-10-31-che-mun',
    utcDate: '2026-10-31T15:00Z',
    homeTeam: { name: 'Chelsea', tla: 'CHE' },
    awayTeam: { name: 'Manchester United', tla: 'MUN' },
  },
  {
    id: '2026-10-31-liv-ars',
    utcDate: '2026-10-31T15:00Z',
    homeTeam: { name: 'Liverpool', tla: 'LIV' },
    awayTeam: { name: 'Arsenal', tla: 'ARS' },
  },
  {
    id: '2026-11-07-mun-avl',
    utcDate: '2026-11-07T15:00Z',
    homeTeam: { name: 'Manchester United', tla: 'MUN' },
    awayTeam: { name: 'Aston Villa', tla: 'AVL' },
  },
  {
    id: '2026-11-14-brst-chs',
    utcDate: '2026-11-14T15:00Z',
    homeTeam: { name: 'Bristol Rovers', tla: 'BRST' },
    awayTeam: { name: 'Chesterfield', tla: 'CHS' },
  },
  {
    id: '2026-11-14-shw-ply',
    utcDate: '2026-11-14T15:00Z',
    homeTeam: { name: 'Sheffield Wednesday', tla: 'SHW' },
    awayTeam: { name: 'Plymouth Argyle', tla: 'PLY' },
  },
  {
    id: '2026-11-21-bar-pvl',
    utcDate: '2026-11-21T15:00Z',
    homeTeam: { name: 'Barnet', tla: 'BAR' },
    awayTeam: { name: 'Port Vale', tla: 'PVL' },
  },
  {
    id: '2026-11-21-gri-rot',
    utcDate: '2026-11-21T15:00Z',
    homeTeam: { name: 'Grimsby Town', tla: 'GRI' },
    awayTeam: { name: 'Rotherham United', tla: 'ROT' },
  },
  {
    id: '2026-11-21-hud-lei',
    utcDate: '2026-11-21T15:00Z',
    homeTeam: { name: 'Huddersfield Town', tla: 'HUD' },
    awayTeam: { name: 'Leicester City', tla: 'LEI' },
  },
  {
    id: '2026-11-21-liv-mun',
    utcDate: '2026-11-21T15:00Z',
    homeTeam: { name: 'Liverpool', tla: 'LIV' },
    awayTeam: { name: 'Manchester United', tla: 'MUN' },
  },
  {
    id: '2026-11-21-new-ars',
    utcDate: '2026-11-21T15:00Z',
    homeTeam: { name: 'Newcastle United', tla: 'NEW' },
    awayTeam: { name: 'Arsenal', tla: 'ARS' },
  },
  {
    id: '2026-11-24-shu-sou',
    utcDate: '2026-11-24T19:45Z',
    homeTeam: { name: 'Sheffield United', tla: 'SHU' },
    awayTeam: { name: 'Southampton', tla: 'SOU' },
  },
  {
    id: '2026-11-25-bur-bir',
    utcDate: '2026-11-25T19:45Z',
    homeTeam: { name: 'Burnley', tla: 'BUR' },
    awayTeam: { name: 'Birmingham City', tla: 'BIR' },
  },
  {
    id: '2026-11-28-ars-mci',
    utcDate: '2026-11-28T15:00Z',
    homeTeam: { name: 'Arsenal', tla: 'ARS' },
    awayTeam: { name: 'Manchester City', tla: 'MCI' },
  },
  {
    id: '2026-11-28-sou-mid',
    utcDate: '2026-11-28T15:00Z',
    homeTeam: { name: 'Southampton', tla: 'SOU' },
    awayTeam: { name: 'Middlesbrough', tla: 'MID' },
  },
  {
    id: '2026-12-01-bar-rot',
    utcDate: '2026-12-01T19:45Z',
    homeTeam: { name: 'Barnet', tla: 'BAR' },
    awayTeam: { name: 'Rotherham United', tla: 'ROT' },
  },
  {
    id: '2026-12-02-new-mun',
    utcDate: '2026-12-02T20:00Z',
    homeTeam: { name: 'Newcastle United', tla: 'NEW' },
    awayTeam: { name: 'Manchester United', tla: 'MUN' },
  },
  {
    id: '2026-12-05-che-liv',
    utcDate: '2026-12-05T15:00Z',
    homeTeam: { name: 'Chelsea', tla: 'CHE' },
    awayTeam: { name: 'Liverpool', tla: 'LIV' },
  },
  {
    id: '2026-12-05-shu-whu',
    utcDate: '2026-12-05T15:00Z',
    homeTeam: { name: 'Sheffield United', tla: 'SHU' },
    awayTeam: { name: 'West Ham United', tla: 'WHU' },
  },
  {
    id: '2026-12-05-wol-sou',
    utcDate: '2026-12-05T15:00Z',
    homeTeam: { name: 'Wolverhampton Wanderers', tla: 'WOL' },
    awayTeam: { name: 'Southampton', tla: 'SOU' },
  },
  {
    id: '2026-12-08-whu-mid',
    utcDate: '2026-12-08T19:45Z',
    homeTeam: { name: 'West Ham United', tla: 'WHU' },
    awayTeam: { name: 'Middlesbrough', tla: 'MID' },
  },
  {
    id: '2026-12-09-sou-bur',
    utcDate: '2026-12-09T19:45Z',
    homeTeam: { name: 'Southampton', tla: 'SOU' },
    awayTeam: { name: 'Burnley', tla: 'BUR' },
  },
  {
    id: '2026-12-12-chs-gri',
    utcDate: '2026-12-12T15:00Z',
    homeTeam: { name: 'Chesterfield', tla: 'CHS' },
    awayTeam: { name: 'Grimsby Town', tla: 'GRI' },
  },
  {
    id: '2026-12-12-lei-shw',
    utcDate: '2026-12-12T15:00Z',
    homeTeam: { name: 'Leicester City', tla: 'LEI' },
    awayTeam: { name: 'Sheffield Wednesday', tla: 'SHW' },
  },
  {
    id: '2026-12-12-mci-che',
    utcDate: '2026-12-12T15:00Z',
    homeTeam: { name: 'Manchester City', tla: 'MCI' },
    awayTeam: { name: 'Chelsea', tla: 'CHE' },
  },
  {
    id: '2026-12-12-shu-bur',
    utcDate: '2026-12-12T15:00Z',
    homeTeam: { name: 'Sheffield United', tla: 'SHU' },
    awayTeam: { name: 'Burnley', tla: 'BUR' },
  },
  {
    id: '2026-12-19-ars-mun',
    utcDate: '2026-12-19T15:00Z',
    homeTeam: { name: 'Arsenal', tla: 'ARS' },
    awayTeam: { name: 'Manchester United', tla: 'MUN' },
  },
  {
    id: '2026-12-19-bir-whu',
    utcDate: '2026-12-19T15:00Z',
    homeTeam: { name: 'Birmingham City', tla: 'BIR' },
    awayTeam: { name: 'West Ham United', tla: 'WHU' },
  },
  {
    id: '2026-12-19-che-avl',
    utcDate: '2026-12-19T15:00Z',
    homeTeam: { name: 'Chelsea', tla: 'CHE' },
    awayTeam: { name: 'Aston Villa', tla: 'AVL' },
  },
  {
    id: '2026-12-19-gri-bar',
    utcDate: '2026-12-19T15:00Z',
    homeTeam: { name: 'Grimsby Town', tla: 'GRI' },
    awayTeam: { name: 'Barnet', tla: 'BAR' },
  },
  {
    id: '2026-12-19-pvl-rot',
    utcDate: '2026-12-19T15:00Z',
    homeTeam: { name: 'Port Vale', tla: 'PVL' },
    awayTeam: { name: 'Rotherham United', tla: 'ROT' },
  },
  {
    id: '2026-12-19-shw-lut',
    utcDate: '2026-12-19T15:00Z',
    homeTeam: { name: 'Sheffield Wednesday', tla: 'SHW' },
    awayTeam: { name: 'Luton Town', tla: 'LUT' },
  },
  {
    id: '2026-12-26-new-mci',
    utcDate: '2026-12-26T15:00Z',
    homeTeam: { name: 'Newcastle United', tla: 'NEW' },
    awayTeam: { name: 'Manchester City', tla: 'MCI' },
  },
  {
    id: '2026-12-26-sal-gri',
    utcDate: '2026-12-26T15:00Z',
    homeTeam: { name: 'Salford City', tla: 'SAL' },
    awayTeam: { name: 'Grimsby Town', tla: 'GRI' },
  },
  {
    id: '2026-12-26-shu-mid',
    utcDate: '2026-12-26T15:00Z',
    homeTeam: { name: 'Sheffield United', tla: 'SHU' },
    awayTeam: { name: 'Middlesbrough', tla: 'MID' },
  },
  {
    id: '2026-12-29-pvl-brst',
    utcDate: '2026-12-29T19:45Z',
    homeTeam: { name: 'Port Vale', tla: 'PVL' },
    awayTeam: { name: 'Bristol Rovers', tla: 'BRST' },
  },
  {
    id: '2026-12-29-sou-whu',
    utcDate: '2026-12-29T19:45Z',
    homeTeam: { name: 'Southampton', tla: 'SOU' },
    awayTeam: { name: 'West Ham United', tla: 'WHU' },
  },
  {
    id: '2026-12-29-stp-hud',
    utcDate: '2026-12-29T19:45Z',
    homeTeam: { name: 'Stockport County', tla: 'STP' },
    awayTeam: { name: 'Huddersfield Town', tla: 'HUD' },
  },
  {
    id: '2026-12-30-avl-liv',
    utcDate: '2026-12-30T20:00Z',
    homeTeam: { name: 'Aston Villa', tla: 'AVL' },
    awayTeam: { name: 'Liverpool', tla: 'LIV' },
  },
  {
    id: '2027-01-01-bur-shu',
    utcDate: '2027-01-01T15:00Z',
    homeTeam: { name: 'Burnley', tla: 'BUR' },
    awayTeam: { name: 'Sheffield United', tla: 'SHU' },
  },
  {
    id: '2027-01-01-ply-lut',
    utcDate: '2027-01-01T15:00Z',
    homeTeam: { name: 'Plymouth Argyle', tla: 'PLY' },
    awayTeam: { name: 'Luton Town', tla: 'LUT' },
  },
  {
    id: '2027-01-01-shw-hud',
    utcDate: '2027-01-01T15:00Z',
    homeTeam: { name: 'Sheffield Wednesday', tla: 'SHW' },
    awayTeam: { name: 'Huddersfield Town', tla: 'HUD' },
  },
  {
    id: '2027-01-02-che-new',
    utcDate: '2027-01-02T15:00Z',
    homeTeam: { name: 'Chelsea', tla: 'CHE' },
    awayTeam: { name: 'Newcastle United', tla: 'NEW' },
  },
  {
    id: '2027-01-06-mun-new',
    utcDate: '2027-01-06T20:00Z',
    homeTeam: { name: 'Manchester United', tla: 'MUN' },
    awayTeam: { name: 'Newcastle United', tla: 'NEW' },
  },
  {
    id: '2027-01-09-bar-gri',
    utcDate: '2027-01-09T15:00Z',
    homeTeam: { name: 'Barnet', tla: 'BAR' },
    awayTeam: { name: 'Grimsby Town', tla: 'GRI' },
  },
  {
    id: '2027-01-09-lut-shw',
    utcDate: '2027-01-09T15:00Z',
    homeTeam: { name: 'Luton Town', tla: 'LUT' },
    awayTeam: { name: 'Sheffield Wednesday', tla: 'SHW' },
  },
  {
    id: '2027-01-09-rot-pvl',
    utcDate: '2027-01-09T15:00Z',
    homeTeam: { name: 'Rotherham United', tla: 'ROT' },
    awayTeam: { name: 'Port Vale', tla: 'PVL' },
  },
  {
    id: '2027-01-16-avl-mun',
    utcDate: '2027-01-16T15:00Z',
    homeTeam: { name: 'Aston Villa', tla: 'AVL' },
    awayTeam: { name: 'Manchester United', tla: 'MUN' },
  },
  {
    id: '2027-01-16-chs-pvl',
    utcDate: '2027-01-16T15:00Z',
    homeTeam: { name: 'Chesterfield', tla: 'CHS' },
    awayTeam: { name: 'Port Vale', tla: 'PVL' },
  },
  {
    id: '2027-01-16-hud-ply',
    utcDate: '2027-01-16T15:00Z',
    homeTeam: { name: 'Huddersfield Town', tla: 'HUD' },
    awayTeam: { name: 'Plymouth Argyle', tla: 'PLY' },
  },
  {
    id: '2027-01-16-wol-bur',
    utcDate: '2027-01-16T15:00Z',
    homeTeam: { name: 'Wolverhampton Wanderers', tla: 'WOL' },
    awayTeam: { name: 'Burnley', tla: 'BUR' },
  },
  {
    id: '2027-01-19-sal-brst',
    utcDate: '2027-01-19T19:45Z',
    homeTeam: { name: 'Salford City', tla: 'SAL' },
    awayTeam: { name: 'Bristol Rovers', tla: 'BRST' },
  },
  {
    id: '2027-01-23-ars-new',
    utcDate: '2027-01-23T15:00Z',
    homeTeam: { name: 'Arsenal', tla: 'ARS' },
    awayTeam: { name: 'Newcastle United', tla: 'NEW' },
  },
  {
    id: '2027-01-23-lei-lut',
    utcDate: '2027-01-23T15:00Z',
    homeTeam: { name: 'Leicester City', tla: 'LEI' },
    awayTeam: { name: 'Luton Town', tla: 'LUT' },
  },
  {
    id: '2027-01-23-mun-liv',
    utcDate: '2027-01-23T15:00Z',
    homeTeam: { name: 'Manchester United', tla: 'MUN' },
    awayTeam: { name: 'Liverpool', tla: 'LIV' },
  },
  {
    id: '2027-01-30-mci-ars',
    utcDate: '2027-01-30T15:00Z',
    homeTeam: { name: 'Manchester City', tla: 'MCI' },
    awayTeam: { name: 'Arsenal', tla: 'ARS' },
  },
  {
    id: '2027-02-06-ars-liv',
    utcDate: '2027-02-06T15:00Z',
    homeTeam: { name: 'Arsenal', tla: 'ARS' },
    awayTeam: { name: 'Liverpool', tla: 'LIV' },
  },
  {
    id: '2027-02-06-chs-rot',
    utcDate: '2027-02-06T15:00Z',
    homeTeam: { name: 'Chesterfield', tla: 'CHS' },
    awayTeam: { name: 'Rotherham United', tla: 'ROT' },
  },
  {
    id: '2027-02-06-mun-che',
    utcDate: '2027-02-06T15:00Z',
    homeTeam: { name: 'Manchester United', tla: 'MUN' },
    awayTeam: { name: 'Chelsea', tla: 'CHE' },
  },
  {
    id: '2027-02-09-ply-lei',
    utcDate: '2027-02-09T19:45Z',
    homeTeam: { name: 'Plymouth Argyle', tla: 'PLY' },
    awayTeam: { name: 'Leicester City', tla: 'LEI' },
  },
  {
    id: '2027-02-09-stp-lut',
    utcDate: '2027-02-09T19:45Z',
    homeTeam: { name: 'Stockport County', tla: 'STP' },
    awayTeam: { name: 'Luton Town', tla: 'LUT' },
  },
  {
    id: '2027-02-10-new-che',
    utcDate: '2027-02-10T20:00Z',
    homeTeam: { name: 'Newcastle United', tla: 'NEW' },
    awayTeam: { name: 'Chelsea', tla: 'CHE' },
  },
  {
    id: '2027-02-13-bar-chs',
    utcDate: '2027-02-13T15:00Z',
    homeTeam: { name: 'Barnet', tla: 'BAR' },
    awayTeam: { name: 'Chesterfield', tla: 'CHS' },
  },
  {
    id: '2027-02-13-pvl-sal',
    utcDate: '2027-02-13T15:00Z',
    homeTeam: { name: 'Port Vale', tla: 'PVL' },
    awayTeam: { name: 'Salford City', tla: 'SAL' },
  },
  {
    id: '2027-02-13-rot-brst',
    utcDate: '2027-02-13T15:00Z',
    homeTeam: { name: 'Rotherham United', tla: 'ROT' },
    awayTeam: { name: 'Bristol Rovers', tla: 'BRST' },
  },
  {
    id: '2027-02-13-wol-shu',
    utcDate: '2027-02-13T15:00Z',
    homeTeam: { name: 'Wolverhampton Wanderers', tla: 'WOL' },
    awayTeam: { name: 'Sheffield United', tla: 'SHU' },
  },
  {
    id: '2027-02-20-brst-gri',
    utcDate: '2027-02-20T15:00Z',
    homeTeam: { name: 'Bristol Rovers', tla: 'BRST' },
    awayTeam: { name: 'Grimsby Town', tla: 'GRI' },
  },
  {
    id: '2027-02-20-lei-stp',
    utcDate: '2027-02-20T15:00Z',
    homeTeam: { name: 'Leicester City', tla: 'LEI' },
    awayTeam: { name: 'Stockport County', tla: 'STP' },
  },
  {
    id: '2027-02-20-mci-new',
    utcDate: '2027-02-20T15:00Z',
    homeTeam: { name: 'Manchester City', tla: 'MCI' },
    awayTeam: { name: 'Newcastle United', tla: 'NEW' },
  },
  {
    id: '2027-02-20-mid-bir',
    utcDate: '2027-02-20T15:00Z',
    homeTeam: { name: 'Middlesbrough', tla: 'MID' },
    awayTeam: { name: 'Birmingham City', tla: 'BIR' },
  },
  {
    id: '2027-02-20-sal-rot',
    utcDate: '2027-02-20T15:00Z',
    homeTeam: { name: 'Salford City', tla: 'SAL' },
    awayTeam: { name: 'Rotherham United', tla: 'ROT' },
  },
  {
    id: '2027-02-27-avl-che',
    utcDate: '2027-02-27T15:00Z',
    homeTeam: { name: 'Aston Villa', tla: 'AVL' },
    awayTeam: { name: 'Chelsea', tla: 'CHE' },
  },
  {
    id: '2027-02-27-chs-brst',
    utcDate: '2027-02-27T15:00Z',
    homeTeam: { name: 'Chesterfield', tla: 'CHS' },
    awayTeam: { name: 'Bristol Rovers', tla: 'BRST' },
  },
  {
    id: '2027-02-27-mun-ars',
    utcDate: '2027-02-27T15:00Z',
    homeTeam: { name: 'Manchester United', tla: 'MUN' },
    awayTeam: { name: 'Arsenal', tla: 'ARS' },
  },
  {
    id: '2027-02-27-ply-shw',
    utcDate: '2027-02-27T15:00Z',
    homeTeam: { name: 'Plymouth Argyle', tla: 'PLY' },
    awayTeam: { name: 'Sheffield Wednesday', tla: 'SHW' },
  },
  {
    id: '2027-02-27-wol-mid',
    utcDate: '2027-02-27T15:00Z',
    homeTeam: { name: 'Wolverhampton Wanderers', tla: 'WOL' },
    awayTeam: { name: 'Middlesbrough', tla: 'MID' },
  },
  {
    id: '2027-03-03-liv-avl',
    utcDate: '2027-03-03T20:00Z',
    homeTeam: { name: 'Liverpool', tla: 'LIV' },
    awayTeam: { name: 'Aston Villa', tla: 'AVL' },
  },
  {
    id: '2027-03-06-bir-shu',
    utcDate: '2027-03-06T15:00Z',
    homeTeam: { name: 'Birmingham City', tla: 'BIR' },
    awayTeam: { name: 'Sheffield United', tla: 'SHU' },
  },
  {
    id: '2027-03-06-sal-bar',
    utcDate: '2027-03-06T15:00Z',
    homeTeam: { name: 'Salford City', tla: 'SAL' },
    awayTeam: { name: 'Barnet', tla: 'BAR' },
  },
  {
    id: '2027-03-06-stp-ply',
    utcDate: '2027-03-06T15:00Z',
    homeTeam: { name: 'Stockport County', tla: 'STP' },
    awayTeam: { name: 'Plymouth Argyle', tla: 'PLY' },
  },
  {
    id: '2027-03-06-whu-bur',
    utcDate: '2027-03-06T15:00Z',
    homeTeam: { name: 'West Ham United', tla: 'WHU' },
    awayTeam: { name: 'Burnley', tla: 'BUR' },
  },
  {
    id: '2027-03-13-che-ars',
    utcDate: '2027-03-13T15:00Z',
    homeTeam: { name: 'Chelsea', tla: 'CHE' },
    awayTeam: { name: 'Arsenal', tla: 'ARS' },
  },
  {
    id: '2027-03-13-chs-sal',
    utcDate: '2027-03-13T15:00Z',
    homeTeam: { name: 'Chesterfield', tla: 'CHS' },
    awayTeam: { name: 'Salford City', tla: 'SAL' },
  },
  {
    id: '2027-03-13-mid-sou',
    utcDate: '2027-03-13T15:00Z',
    homeTeam: { name: 'Middlesbrough', tla: 'MID' },
    awayTeam: { name: 'Southampton', tla: 'SOU' },
  },
  {
    id: '2027-03-16-sou-wol',
    utcDate: '2027-03-16T19:45Z',
    homeTeam: { name: 'Southampton', tla: 'SOU' },
    awayTeam: { name: 'Wolverhampton Wanderers', tla: 'WOL' },
  },
  {
    id: '2027-03-17-whu-shu',
    utcDate: '2027-03-17T19:45Z',
    homeTeam: { name: 'West Ham United', tla: 'WHU' },
    awayTeam: { name: 'Sheffield United', tla: 'SHU' },
  },
  {
    id: '2027-03-20-lei-hud',
    utcDate: '2027-03-20T15:00Z',
    homeTeam: { name: 'Leicester City', tla: 'LEI' },
    awayTeam: { name: 'Huddersfield Town', tla: 'HUD' },
  },
  {
    id: '2027-03-20-mci-mun',
    utcDate: '2027-03-20T15:00Z',
    homeTeam: { name: 'Manchester City', tla: 'MCI' },
    awayTeam: { name: 'Manchester United', tla: 'MUN' },
  },
  {
    id: '2027-03-20-mid-shu',
    utcDate: '2027-03-20T15:00Z',
    homeTeam: { name: 'Middlesbrough', tla: 'MID' },
    awayTeam: { name: 'Sheffield United', tla: 'SHU' },
  },
  {
    id: '2027-03-20-pvl-bar',
    utcDate: '2027-03-20T15:00Z',
    homeTeam: { name: 'Port Vale', tla: 'PVL' },
    awayTeam: { name: 'Barnet', tla: 'BAR' },
  },
  {
    id: '2027-03-20-rot-gri',
    utcDate: '2027-03-20T15:00Z',
    homeTeam: { name: 'Rotherham United', tla: 'ROT' },
    awayTeam: { name: 'Grimsby Town', tla: 'GRI' },
  },
  {
    id: '2027-03-26-lut-ply',
    utcDate: '2027-03-26T15:00Z',
    homeTeam: { name: 'Luton Town', tla: 'LUT' },
    awayTeam: { name: 'Plymouth Argyle', tla: 'PLY' },
  },
  {
    id: '2027-03-29-gri-sal',
    utcDate: '2027-03-29T14:00Z',
    homeTeam: { name: 'Grimsby Town', tla: 'GRI' },
    awayTeam: { name: 'Salford City', tla: 'SAL' },
  },
  {
    id: '2027-04-03-brst-pvl',
    utcDate: '2027-04-03T14:00Z',
    homeTeam: { name: 'Bristol Rovers', tla: 'BRST' },
    awayTeam: { name: 'Port Vale', tla: 'PVL' },
  },
  {
    id: '2027-04-03-hud-stp',
    utcDate: '2027-04-03T14:00Z',
    homeTeam: { name: 'Huddersfield Town', tla: 'HUD' },
    awayTeam: { name: 'Stockport County', tla: 'STP' },
  },
  {
    id: '2027-04-03-whu-bir',
    utcDate: '2027-04-03T14:00Z',
    homeTeam: { name: 'West Ham United', tla: 'WHU' },
    awayTeam: { name: 'Birmingham City', tla: 'BIR' },
  },
  {
    id: '2027-04-10-gri-chs',
    utcDate: '2027-04-10T14:00Z',
    homeTeam: { name: 'Grimsby Town', tla: 'GRI' },
    awayTeam: { name: 'Chesterfield', tla: 'CHS' },
  },
  {
    id: '2027-04-10-liv-new',
    utcDate: '2027-04-10T14:00Z',
    homeTeam: { name: 'Liverpool', tla: 'LIV' },
    awayTeam: { name: 'Newcastle United', tla: 'NEW' },
  },
  {
    id: '2027-04-10-shw-lei',
    utcDate: '2027-04-10T14:00Z',
    homeTeam: { name: 'Sheffield Wednesday', tla: 'SHW' },
    awayTeam: { name: 'Leicester City', tla: 'LEI' },
  },
  {
    id: '2027-04-10-wol-bir',
    utcDate: '2027-04-10T14:00Z',
    homeTeam: { name: 'Wolverhampton Wanderers', tla: 'WOL' },
    awayTeam: { name: 'Birmingham City', tla: 'BIR' },
  },
  {
    id: '2027-04-13-bar-brst',
    utcDate: '2027-04-13T18:45Z',
    homeTeam: { name: 'Barnet', tla: 'BAR' },
    awayTeam: { name: 'Bristol Rovers', tla: 'BRST' },
  },
  {
    id: '2027-04-13-gri-pvl',
    utcDate: '2027-04-13T18:45Z',
    homeTeam: { name: 'Grimsby Town', tla: 'GRI' },
    awayTeam: { name: 'Port Vale', tla: 'PVL' },
  },
  {
    id: '2027-04-13-lut-hud',
    utcDate: '2027-04-13T18:45Z',
    homeTeam: { name: 'Luton Town', tla: 'LUT' },
    awayTeam: { name: 'Huddersfield Town', tla: 'HUD' },
  },
  {
    id: '2027-04-17-ars-avl',
    utcDate: '2027-04-17T14:00Z',
    homeTeam: { name: 'Arsenal', tla: 'ARS' },
    awayTeam: { name: 'Aston Villa', tla: 'AVL' },
  },
  {
    id: '2027-04-17-stp-shw',
    utcDate: '2027-04-17T14:00Z',
    homeTeam: { name: 'Stockport County', tla: 'STP' },
    awayTeam: { name: 'Sheffield Wednesday', tla: 'SHW' },
  },
  {
    id: '2027-04-20-mid-bur',
    utcDate: '2027-04-20T18:45Z',
    homeTeam: { name: 'Middlesbrough', tla: 'MID' },
    awayTeam: { name: 'Burnley', tla: 'BUR' },
  },
  {
    id: '2027-04-20-sou-bir',
    utcDate: '2027-04-20T18:45Z',
    homeTeam: { name: 'Southampton', tla: 'SOU' },
    awayTeam: { name: 'Birmingham City', tla: 'BIR' },
  },
  {
    id: '2027-04-20-wol-whu',
    utcDate: '2027-04-20T18:45Z',
    homeTeam: { name: 'Wolverhampton Wanderers', tla: 'WOL' },
    awayTeam: { name: 'West Ham United', tla: 'WHU' },
  },
  {
    id: '2027-04-24-bur-sou',
    utcDate: '2027-04-24T14:00Z',
    homeTeam: { name: 'Burnley', tla: 'BUR' },
    awayTeam: { name: 'Southampton', tla: 'SOU' },
  },
  {
    id: '2027-04-24-che-mci',
    utcDate: '2027-04-24T14:00Z',
    homeTeam: { name: 'Chelsea', tla: 'CHE' },
    awayTeam: { name: 'Manchester City', tla: 'MCI' },
  },
  {
    id: '2027-04-24-mid-whu',
    utcDate: '2027-04-24T14:00Z',
    homeTeam: { name: 'Middlesbrough', tla: 'MID' },
    awayTeam: { name: 'West Ham United', tla: 'WHU' },
  },
  {
    id: '2027-05-01-bir-bur',
    utcDate: '2027-05-01T11:30Z',
    homeTeam: { name: 'Birmingham City', tla: 'BIR' },
    awayTeam: { name: 'Burnley', tla: 'BUR' },
  },
  {
    id: '2027-05-01-sou-shu',
    utcDate: '2027-05-01T11:30Z',
    homeTeam: { name: 'Southampton', tla: 'SOU' },
    awayTeam: { name: 'Sheffield United', tla: 'SHU' },
  },
  {
    id: '2027-05-01-liv-che',
    utcDate: '2027-05-01T14:00Z',
    homeTeam: { name: 'Liverpool', tla: 'LIV' },
    awayTeam: { name: 'Chelsea', tla: 'CHE' },
  },
  {
    id: '2027-05-08-mci-liv',
    utcDate: '2027-05-08T14:00Z',
    homeTeam: { name: 'Manchester City', tla: 'MCI' },
    awayTeam: { name: 'Liverpool', tla: 'LIV' },
  },
  {
    id: '2027-05-08-rot-bar',
    utcDate: '2027-05-08T14:00Z',
    homeTeam: { name: 'Rotherham United', tla: 'ROT' },
    awayTeam: { name: 'Barnet', tla: 'BAR' },
  },
  {
    id: '2027-05-15-avl-new',
    utcDate: '2027-05-15T14:00Z',
    homeTeam: { name: 'Aston Villa', tla: 'AVL' },
    awayTeam: { name: 'Newcastle United', tla: 'NEW' },
  },
  {
    id: '2027-05-23-mci-avl',
    utcDate: '2027-05-23T14:00Z',
    homeTeam: { name: 'Manchester City', tla: 'MCI' },
    awayTeam: { name: 'Aston Villa', tla: 'AVL' },
  },
];
