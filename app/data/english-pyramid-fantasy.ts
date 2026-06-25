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
    clubCrest: '/images/world-cup-fantasy/crests/mulletman-fc.png',
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

/** Upcoming sweepstake fixtures — populate before the season; the score agent rolls this forward. */
export const ENGLISH_PYRAMID_FIXTURES: readonly EnglishPyramidFixture[] = [];
