/**
 * Secret sweepstake config — team codes plus aliases for score matching.
 */
export type WorldCupTeamMeta = {
  code: string;
  name: string;
  flag: string;
  /** Extra API codes that should count as this team. */
  aliases?: readonly string[];
  /** Common official/source spellings to use when manually checking score sites. */
  searchNames?: readonly string[];
};

export const WORLD_CUP_TEAM_BY_CODE: Record<string, WorldCupTeamMeta> = {
  ARG: { code: 'ARG', name: 'Argentina', flag: '🇦🇷' },
  USA: {
    code: 'USA',
    name: 'USA',
    flag: '🇺🇸',
    searchNames: ['United States', 'United States of America'],
  },
  SUI: { code: 'SUI', name: 'Switzerland', flag: '🇨🇭', aliases: ['SWI'] },
  TUN: { code: 'TUN', name: 'Tunisia', flag: '🇹🇳' },
  CRC: { code: 'CRC', name: 'Costa Rica', flag: '🇨🇷', aliases: ['COS'] },
  BRA: { code: 'BRA', name: 'Brazil', flag: '🇧🇷' },
  MAR: { code: 'MAR', name: 'Morocco', flag: '🇲🇦', aliases: ['MOR'] },
  POL: { code: 'POL', name: 'Poland', flag: '🇵🇱' },
  SEN: { code: 'SEN', name: 'Senegal', flag: '🇸🇳' },
  KSA: { code: 'KSA', name: 'Saudi Arabia', flag: '🇸🇦', aliases: ['SAU'] },
  QAT: { code: 'QAT', name: 'Qatar', flag: '🇶🇦' },
  FRA: { code: 'FRA', name: 'France', flag: '🇫🇷' },
  JPN: { code: 'JPN', name: 'Japan', flag: '🇯🇵', aliases: ['JAP'] },
  KOR: {
    code: 'KOR',
    name: 'South Korea',
    flag: '🇰🇷',
    searchNames: ['Korea Republic', 'Republic of Korea'],
  },
  CMR: { code: 'CMR', name: 'Cameroon', flag: '🇨🇲' },
  CAN: { code: 'CAN', name: 'Canada', flag: '🇨🇦' },
  ESP: { code: 'ESP', name: 'Spain', flag: '🇪🇸' },
  NED: {
    code: 'NED',
    name: 'Netherlands',
    flag: '🇳🇱',
    aliases: ['HOL'],
    searchNames: ['Holland'],
  },
  ECU: { code: 'ECU', name: 'Ecuador', flag: '🇪🇨' },
  GHA: { code: 'GHA', name: 'Ghana', flag: '🇬🇭' },
  COL: { code: 'COL', name: 'Colombia', flag: '🇨🇴' },
  SWE: { code: 'SWE', name: 'Sweden', flag: '🇸🇪' },
  SCO: { code: 'SCO', name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  NOR: { code: 'NOR', name: 'Norway', flag: '🇳🇴' },
  TUR: { code: 'TUR', name: 'Turkey', flag: '🇹🇷', searchNames: ['Türkiye', 'Turkiye'] },
  CIV: {
    code: 'CIV',
    name: 'Ivory Coast',
    flag: '🇨🇮',
    searchNames: ["Côte d'Ivoire", "Cote d'Ivoire"],
  },
  WAL: { code: 'WAL', name: 'Wales', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', aliases: ['WLS'] },
  ENG: { code: 'ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  CRO: { code: 'CRO', name: 'Croatia', flag: '🇭🇷' },
  URU: { code: 'URU', name: 'Uruguay', flag: '🇺🇾', aliases: ['URY'] },
  IRN: {
    code: 'IRN',
    name: 'Iran',
    flag: '🇮🇷',
    aliases: ['IRA'],
    searchNames: ['IR Iran', 'Islamic Republic of Iran'],
  },
  AUS: { code: 'AUS', name: 'Australia', flag: '🇦🇺' },
  SRB: { code: 'SRB', name: 'Serbia', flag: '🇷🇸', aliases: ['SER'] },
  POR: { code: 'POR', name: 'Portugal', flag: '🇵🇹' },
  GER: { code: 'GER', name: 'Germany', flag: '🇩🇪' },
  BEL: { code: 'BEL', name: 'Belgium', flag: '🇧🇪' },
  MEX: { code: 'MEX', name: 'Mexico', flag: '🇲🇽' },
  DEN: { code: 'DEN', name: 'Denmark', flag: '🇩🇰' },
  ALG: { code: 'ALG', name: 'Algeria', flag: '🇩🇿' },
  AUT: { code: 'AUT', name: 'Austria', flag: '🇦🇹' },
  BIH: {
    code: 'BIH',
    name: 'Bosnia-Herzegovina',
    flag: '🇧🇦',
    searchNames: ['Bosnia and Herzegovina'],
  },
  COD: {
    code: 'COD',
    name: 'Congo DR',
    flag: '🇨🇩',
    searchNames: ['DR Congo', 'Democratic Republic of the Congo'],
  },
  CPV: { code: 'CPV', name: 'Cape Verde', flag: '🇨🇻', searchNames: ['Cabo Verde'] },
  CUW: { code: 'CUW', name: 'Curaçao', flag: '🇨🇼', searchNames: ['Curacao'] },
  CZE: { code: 'CZE', name: 'Czechia', flag: '🇨🇿', searchNames: ['Czech Republic'] },
  EGY: { code: 'EGY', name: 'Egypt', flag: '🇪🇬' },
  HAI: { code: 'HAI', name: 'Haiti', flag: '🇭🇹' },
  IRQ: { code: 'IRQ', name: 'Iraq', flag: '🇮🇶' },
  JOR: { code: 'JOR', name: 'Jordan', flag: '🇯🇴' },
  NZL: { code: 'NZL', name: 'New Zealand', flag: '🇳🇿' },
  PAN: { code: 'PAN', name: 'Panama', flag: '🇵🇦' },
  PAR: { code: 'PAR', name: 'Paraguay', flag: '🇵🇾' },
  RSA: { code: 'RSA', name: 'South Africa', flag: '🇿🇦' },
  UZB: { code: 'UZB', name: 'Uzbekistan', flag: '🇺🇿' },
};

export function teamCodeMatches(matchTla: string, playerTeamCode: string): boolean {
  const meta = WORLD_CUP_TEAM_BY_CODE[playerTeamCode];
  const normalized = matchTla.trim().toUpperCase();
  if (playerTeamCode.toUpperCase() === normalized) return true;
  return (meta?.aliases ?? []).some((alias) => alias.toUpperCase() === normalized);
}

export function getWorldCupTeamSearchTerms(code: string): string[] {
  const meta = WORLD_CUP_TEAM_BY_CODE[code];
  if (!meta) return [code];

  return [...new Set([meta.code, meta.name, ...(meta.aliases ?? []), ...(meta.searchNames ?? [])])];
}

export function formatTeamLabel(code: string): string {
  const meta = WORLD_CUP_TEAM_BY_CODE[code];
  if (!meta) return code;
  return `${meta.flag} ${meta.name}`;
}

export type WorldCupFantasyPlayer = {
  id: string;
  name: string;
  /** Optional fantasy club name shown above the manager's real name. */
  teamName?: string;
  /** Manager portrait shown in the player squad section. */
  managerImage: string;
  /** Fantasy club crest shown beside the manager portrait. */
  clubCrest: string;
  teams: readonly string[];
  draftNote: string;
};

export const WORLD_CUP_FANTASY_DAILY_UPDATE =
  'Friday\'s quarter-final trimmed the survival list again: Belgium went down 1-2 to Spain in the evening slot, sending Nest\'s Belgians home while Ash pins the entire revival on Spain as his one remaining live nation. Nest leads on 56 with only three survivors left, Chris has 49, Scott has 46, Jon has 43, Ash has 36, and Dave remains bottom on 31 — every nation of his buried weeks ago, yet still welded to last place like a training cone parked on the goal-line nobody has the heart to move.';

export const WORLD_CUP_FANTASY_PLAYERS: readonly WorldCupFantasyPlayer[] = [
  {
    id: 'ash',
    name: 'Ash',
    teamName: 'FC Cajuicey',
    managerImage: '/images/world-cup-fantasy/managers/ash.png',
    clubCrest: '/images/world-cup-fantasy/crests/ash.png',
    teams: ['ESP', 'NED', 'JPN', 'ECU', 'GHA', 'CZE', 'NZL', 'UZB'],
    draftNote:
      'Spain and the Netherlands carry the headline acts, Japan bring pace from Asia, and Ghana plus Czechia offer steady group-stage points — with New Zealand and Uzbekistan as the wildcard juice.',
  },
  {
    id: 'jon',
    name: 'Jon',
    teamName: 'Team Noah',
    managerImage: '/images/world-cup-fantasy/managers/jon.png',
    clubCrest: '/images/world-cup-fantasy/crests/team-noah-fc.png',
    teams: ['BRA', 'USA', 'MAR', 'SWE', 'CIV', 'RSA', 'JOR', 'CUW'],
    draftNote:
      'Brazil and the USA lead Team Noah, Morocco and Sweden bring proven tournament pedigree, Ivory Coast and South Africa add African fire — Jordan and Curaçao are the long-shot charm.',
  },
  {
    id: 'nest',
    name: 'Nest',
    teamName: 'The Pterotractoryls',
    managerImage: '/images/world-cup-fantasy/managers/nest.png',
    clubCrest: '/images/world-cup-fantasy/crests/the-pterotractoryls-fc.png?v=1',
    teams: ['ENG', 'BEL', 'SUI', 'NOR', 'SCO', 'TUN', 'KSA', 'CPV'],
    draftNote:
      'England and Belgium set the vibe, Switzerland and Norway keep the European groove going, Scotland brings passion, and Cape Verde is the soulful wildcard from the Atlantic.',
  },
  {
    id: 'chris',
    name: 'Chris',
    teamName: 'Saka Potatoes',
    managerImage: '/images/world-cup-fantasy/managers/chris.png',
    clubCrest: '/images/world-cup-fantasy/crests/saka-potatoes-fc.png',
    teams: ['FRA', 'MEX', 'COL', 'AUS', 'TUR', 'BIH', 'IRQ', 'HAI'],
    draftNote:
      'France and Mexico are the heavy hitters, Colombia and Australia cover the Americas and Pacific, Turkey and Bosnia add Balkan grit — Iraq and Haiti are pure upside.',
  },
  {
    id: 'scott',
    name: 'Scott',
    teamName: 'Objection Overruled FC',
    managerImage: '/images/world-cup-fantasy/managers/scott.png',
    clubCrest: '/images/world-cup-fantasy/crests/objection-overruled.png',
    teams: ['ARG', 'CRO', 'URU', 'AUT', 'CAN', 'EGY', 'PAR', 'QAT'],
    draftNote:
      'Argentina and Croatia are the crown jewels, Uruguay and Austria add steady continental class, Canada brings host energy, and Qatar is the ultimate lottery ticket.',
  },
  {
    id: 'dave',
    name: 'Dave',
    teamName: 'The Creamy Creamers FC',
    managerImage: '/images/world-cup-fantasy/managers/dave.png',
    clubCrest: '/images/world-cup-fantasy/crests/the-creamy-creamers-fc.png?v=1',
    teams: ['GER', 'POR', 'SEN', 'KOR', 'IRN', 'ALG', 'PAN', 'COD'],
    draftNote:
      'Germany and Portugal cream the competition on paper, Senegal and South Korea add knockout nous, Algeria and Iran keep the Middle East covered — Panama and Congo DR are the dreamers.',
  },
] as const;

export const WORLD_CUP_FANTASY_SCORING = {
  win: 3,
  draw: 1,
  loss: 0,
  /** Knockout ties — no draw points; final result after ET/pens only. */
  knockoutDraw: 0,
  /** +1 when the team scores strictly more than 2 goals (i.e. 3+). */
  highScoringBonusMinGoals: 3,
  highScoringBonus: 1,
  /** −1 pt for each red card (including second-yellow dismissals) in the final result. */
  redCardPenalty: -1,
  /** −1 pt when the team concedes 3 or more goals in a match. */
  highConcededPenaltyMinGoals: 3,
  highConcededPenalty: -1,
} as const;

/**
 * Manual results ledger.
 * Add only newly finished matches here, and leave previous entries as the source of truth.
 * `id` should be unique; use a stable date/team key such as `2026-06-11-mex-rsa`.
 */
export type WorldCupFantasyManualMatch = {
  id: string;
  utcDate: string;
  homeTeam: { name: string; tla: string };
  awayTeam: { name: string; tla: string };
  /** Goals after 90 minutes and any extra time (before a shootout). */
  homeGoals: number;
  awayGoals: number;
  /** Red cards shown by this team (defaults to 0). */
  homeRedCards?: number;
  awayRedCards?: number;
  /**
   * Penalty shootout tallies for a knockout tie that finished level after
   * extra time. Only set when the tie was decided on penalties; the shootout
   * winner takes the knockout win (3 pts) even though `homeGoals`/`awayGoals`
   * stay level.
   */
  homePenalties?: number;
  awayPenalties?: number;
};

export type WorldCupFantasyFixture = {
  id: string;
  utcDate: string;
  /** Knockout ties from the round of 32 onward (group games omit this). */
  stage?: 'knockout';
  round?: 'R32' | 'R16' | 'QF' | 'SF' | 'F' | '3P';
  homeTeam: { name: string; tla: string };
  awayTeam: { name: string; tla: string };
  /** Populated on resolved bracket ties once a winner is known. */
  winnerPathLabel?: string;
  placeholderSide?: 'home' | 'away' | 'both';
};

/**
 * Upcoming fixtures shown above the standings.
 * Keep this rolling forward during score updates so today's box stays useful.
 */
export const WORLD_CUP_FANTASY_FIXTURES: readonly WorldCupFantasyFixture[] = [
  {
    id: '2026-06-15-ksa-uru',
    utcDate: '2026-06-15T22:00:00Z',
    homeTeam: { name: 'Saudi Arabia', tla: 'KSA' },
    awayTeam: { name: 'Uruguay', tla: 'URU' },
  },
  {
    id: '2026-06-16-irn-nzl',
    utcDate: '2026-06-16T01:00:00Z',
    homeTeam: { name: 'Iran', tla: 'IRN' },
    awayTeam: { name: 'New Zealand', tla: 'NZL' },
  },
  {
    id: '2026-06-16-fra-sen',
    utcDate: '2026-06-16T19:00:00Z',
    homeTeam: { name: 'France', tla: 'FRA' },
    awayTeam: { name: 'Senegal', tla: 'SEN' },
  },
  {
    id: '2026-06-16-irq-nor',
    utcDate: '2026-06-16T22:00:00Z',
    homeTeam: { name: 'Iraq', tla: 'IRQ' },
    awayTeam: { name: 'Norway', tla: 'NOR' },
  },
  {
    id: '2026-06-17-arg-alg',
    utcDate: '2026-06-17T01:00:00Z',
    homeTeam: { name: 'Argentina', tla: 'ARG' },
    awayTeam: { name: 'Algeria', tla: 'ALG' },
  },
  {
    id: '2026-06-17-aut-jor',
    utcDate: '2026-06-17T04:00:00Z',
    homeTeam: { name: 'Austria', tla: 'AUT' },
    awayTeam: { name: 'Jordan', tla: 'JOR' },
  },
  {
    id: '2026-06-17-por-cod',
    utcDate: '2026-06-17T17:00:00Z',
    homeTeam: { name: 'Portugal', tla: 'POR' },
    awayTeam: { name: 'Congo DR', tla: 'COD' },
  },
  {
    id: '2026-06-17-eng-cro',
    utcDate: '2026-06-17T20:00:00Z',
    homeTeam: { name: 'England', tla: 'ENG' },
    awayTeam: { name: 'Croatia', tla: 'CRO' },
  },
  {
    id: '2026-06-17-gha-pan',
    utcDate: '2026-06-17T23:00:00Z',
    homeTeam: { name: 'Ghana', tla: 'GHA' },
    awayTeam: { name: 'Panama', tla: 'PAN' },
  },
  {
    id: '2026-06-18-uzb-col',
    utcDate: '2026-06-18T02:00:00Z',
    homeTeam: { name: 'Uzbekistan', tla: 'UZB' },
    awayTeam: { name: 'Colombia', tla: 'COL' },
  },
  {
    id: '2026-06-18-cze-rsa',
    utcDate: '2026-06-18T16:00:00Z',
    homeTeam: { name: 'Czechia', tla: 'CZE' },
    awayTeam: { name: 'South Africa', tla: 'RSA' },
  },
  {
    id: '2026-06-18-can-qat',
    utcDate: '2026-06-18T22:00:00Z',
    homeTeam: { name: 'Canada', tla: 'CAN' },
    awayTeam: { name: 'Qatar', tla: 'QAT' },
  },
  {
    id: '2026-06-19-mex-kor',
    utcDate: '2026-06-19T01:00:00Z',
    homeTeam: { name: 'Mexico', tla: 'MEX' },
    awayTeam: { name: 'South Korea', tla: 'KOR' },
  },
  {
    id: '2026-06-19-usa-aus',
    utcDate: '2026-06-19T19:00:00Z',
    homeTeam: { name: 'USA', tla: 'USA' },
    awayTeam: { name: 'Australia', tla: 'AUS' },
  },
  {
    id: '2026-06-19-sco-mar',
    utcDate: '2026-06-19T22:00:00Z',
    homeTeam: { name: 'Scotland', tla: 'SCO' },
    awayTeam: { name: 'Morocco', tla: 'MAR' },
  },
  {
    id: '2026-06-19-bra-hai',
    utcDate: '2026-06-20T01:00:00Z',
    homeTeam: { name: 'Brazil', tla: 'BRA' },
    awayTeam: { name: 'Haiti', tla: 'HAI' },
  },
  {
    id: '2026-06-19-tur-par',
    utcDate: '2026-06-20T03:00:00Z',
    homeTeam: { name: 'Turkey', tla: 'TUR' },
    awayTeam: { name: 'Paraguay', tla: 'PAR' },
  },
  {
    id: '2026-06-20-ned-swe',
    utcDate: '2026-06-20T17:00:00Z',
    homeTeam: { name: 'Netherlands', tla: 'NED' },
    awayTeam: { name: 'Sweden', tla: 'SWE' },
  },
  {
    id: '2026-06-20-ecu-cuw',
    utcDate: '2026-06-21T00:00:00Z',
    homeTeam: { name: 'Ecuador', tla: 'ECU' },
    awayTeam: { name: 'Curaçao', tla: 'CUW' },
  },
  {
    id: '2026-06-20-tun-jpn',
    utcDate: '2026-06-21T03:00:00Z',
    homeTeam: { name: 'Tunisia', tla: 'TUN' },
    awayTeam: { name: 'Japan', tla: 'JPN' },
  },
  {
    id: '2026-06-21-esp-ksa',
    utcDate: '2026-06-21T16:00:00Z',
    homeTeam: { name: 'Spain', tla: 'ESP' },
    awayTeam: { name: 'Saudi Arabia', tla: 'KSA' },
  },
  {
    id: '2026-06-21-bel-irn',
    utcDate: '2026-06-21T19:00:00Z',
    homeTeam: { name: 'Belgium', tla: 'BEL' },
    awayTeam: { name: 'Iran', tla: 'IRN' },
  },
  {
    id: '2026-06-22-nzl-egy',
    utcDate: '2026-06-22T01:00:00Z',
    homeTeam: { name: 'New Zealand', tla: 'NZL' },
    awayTeam: { name: 'Egypt', tla: 'EGY' },
  },
  {
    id: '2026-06-22-arg-aut',
    utcDate: '2026-06-22T17:00:00Z',
    homeTeam: { name: 'Argentina', tla: 'ARG' },
    awayTeam: { name: 'Austria', tla: 'AUT' },
  },
  {
    id: '2026-06-22-fra-irq',
    utcDate: '2026-06-22T21:00:00Z',
    homeTeam: { name: 'France', tla: 'FRA' },
    awayTeam: { name: 'Iraq', tla: 'IRQ' },
  },
  {
    id: '2026-06-23-nor-sen',
    utcDate: '2026-06-23T00:00:00Z',
    homeTeam: { name: 'Norway', tla: 'NOR' },
    awayTeam: { name: 'Senegal', tla: 'SEN' },
  },
  {
    id: '2026-06-23-jor-alg',
    utcDate: '2026-06-23T03:00:00Z',
    homeTeam: { name: 'Jordan', tla: 'JOR' },
    awayTeam: { name: 'Algeria', tla: 'ALG' },
  },
  {
    id: '2026-06-23-por-uzb',
    utcDate: '2026-06-23T17:00:00Z',
    homeTeam: { name: 'Portugal', tla: 'POR' },
    awayTeam: { name: 'Uzbekistan', tla: 'UZB' },
  },
  {
    id: '2026-06-23-eng-gha',
    utcDate: '2026-06-23T20:00:00Z',
    homeTeam: { name: 'England', tla: 'ENG' },
    awayTeam: { name: 'Ghana', tla: 'GHA' },
  },
  {
    id: '2026-06-23-pan-cro',
    utcDate: '2026-06-23T23:00:00Z',
    homeTeam: { name: 'Panama', tla: 'PAN' },
    awayTeam: { name: 'Croatia', tla: 'CRO' },
  },
  {
    id: '2026-06-24-col-cod',
    utcDate: '2026-06-24T02:00:00Z',
    homeTeam: { name: 'Colombia', tla: 'COL' },
    awayTeam: { name: 'Congo DR', tla: 'COD' },
  },
  {
    id: '2026-06-24-sui-can',
    utcDate: '2026-06-24T19:00:00Z',
    homeTeam: { name: 'Switzerland', tla: 'SUI' },
    awayTeam: { name: 'Canada', tla: 'CAN' },
  },
  {
    id: '2026-06-24-bih-qat',
    utcDate: '2026-06-24T19:00:00Z',
    homeTeam: { name: 'Bosnia-Herzegovina', tla: 'BIH' },
    awayTeam: { name: 'Qatar', tla: 'QAT' },
  },
  {
    id: '2026-06-24-sco-bra',
    utcDate: '2026-06-24T22:00:00Z',
    homeTeam: { name: 'Scotland', tla: 'SCO' },
    awayTeam: { name: 'Brazil', tla: 'BRA' },
  },
  {
    id: '2026-06-24-mar-hai',
    utcDate: '2026-06-24T22:00:00Z',
    homeTeam: { name: 'Morocco', tla: 'MAR' },
    awayTeam: { name: 'Haiti', tla: 'HAI' },
  },
  {
    id: '2026-06-24-cze-mex',
    utcDate: '2026-06-25T01:00:00Z',
    homeTeam: { name: 'Czechia', tla: 'CZE' },
    awayTeam: { name: 'Mexico', tla: 'MEX' },
  },
  {
    id: '2026-06-24-rsa-kor',
    utcDate: '2026-06-25T01:00:00Z',
    homeTeam: { name: 'South Africa', tla: 'RSA' },
    awayTeam: { name: 'South Korea', tla: 'KOR' },
  },
  {
    id: '2026-06-25-cuw-civ',
    utcDate: '2026-06-25T20:00:00Z',
    homeTeam: { name: 'Curaçao', tla: 'CUW' },
    awayTeam: { name: 'Ivory Coast', tla: 'CIV' },
  },
  {
    id: '2026-06-25-ecu-ger',
    utcDate: '2026-06-25T20:00:00Z',
    homeTeam: { name: 'Ecuador', tla: 'ECU' },
    awayTeam: { name: 'Germany', tla: 'GER' },
  },
  {
    id: '2026-06-25-jpn-swe',
    utcDate: '2026-06-25T23:00:00Z',
    homeTeam: { name: 'Japan', tla: 'JPN' },
    awayTeam: { name: 'Sweden', tla: 'SWE' },
  },
  {
    id: '2026-06-25-tun-ned',
    utcDate: '2026-06-25T23:00:00Z',
    homeTeam: { name: 'Tunisia', tla: 'TUN' },
    awayTeam: { name: 'Netherlands', tla: 'NED' },
  },
  {
    id: '2026-06-25-tur-usa',
    utcDate: '2026-06-26T02:00:00Z',
    homeTeam: { name: 'Turkey', tla: 'TUR' },
    awayTeam: { name: 'USA', tla: 'USA' },
  },
  {
    id: '2026-06-25-par-aus',
    utcDate: '2026-06-26T02:00:00Z',
    homeTeam: { name: 'Paraguay', tla: 'PAR' },
    awayTeam: { name: 'Australia', tla: 'AUS' },
  },
  {
    id: '2026-06-26-nor-fra',
    utcDate: '2026-06-26T19:00:00Z',
    homeTeam: { name: 'Norway', tla: 'NOR' },
    awayTeam: { name: 'France', tla: 'FRA' },
  },
  {
    id: '2026-06-26-sen-irq',
    utcDate: '2026-06-26T19:00:00Z',
    homeTeam: { name: 'Senegal', tla: 'SEN' },
    awayTeam: { name: 'Iraq', tla: 'IRQ' },
  },
  {
    id: '2026-06-26-cpv-ksa',
    utcDate: '2026-06-27T00:00:00Z',
    homeTeam: { name: 'Cape Verde', tla: 'CPV' },
    awayTeam: { name: 'Saudi Arabia', tla: 'KSA' },
  },
  {
    id: '2026-06-26-uru-esp',
    utcDate: '2026-06-27T00:00:00Z',
    homeTeam: { name: 'Uruguay', tla: 'URU' },
    awayTeam: { name: 'Spain', tla: 'ESP' },
  },
  {
    id: '2026-06-26-egy-irn',
    utcDate: '2026-06-27T03:00:00Z',
    homeTeam: { name: 'Egypt', tla: 'EGY' },
    awayTeam: { name: 'Iran', tla: 'IRN' },
  },
  {
    id: '2026-06-26-nzl-bel',
    utcDate: '2026-06-27T03:00:00Z',
    homeTeam: { name: 'New Zealand', tla: 'NZL' },
    awayTeam: { name: 'Belgium', tla: 'BEL' },
  },
  {
    id: '2026-06-27-pan-eng',
    utcDate: '2026-06-27T21:00:00Z',
    homeTeam: { name: 'Panama', tla: 'PAN' },
    awayTeam: { name: 'England', tla: 'ENG' },
  },
  {
    id: '2026-06-27-cro-gha',
    utcDate: '2026-06-27T21:00:00Z',
    homeTeam: { name: 'Croatia', tla: 'CRO' },
    awayTeam: { name: 'Ghana', tla: 'GHA' },
  },
  {
    id: '2026-06-27-col-por',
    utcDate: '2026-06-27T23:30:00Z',
    homeTeam: { name: 'Colombia', tla: 'COL' },
    awayTeam: { name: 'Portugal', tla: 'POR' },
  },
  {
    id: '2026-06-27-cod-uzb',
    utcDate: '2026-06-27T23:30:00Z',
    homeTeam: { name: 'Congo DR', tla: 'COD' },
    awayTeam: { name: 'Uzbekistan', tla: 'UZB' },
  },
  {
    id: '2026-06-27-alg-aut',
    utcDate: '2026-06-28T02:00:00Z',
    homeTeam: { name: 'Algeria', tla: 'ALG' },
    awayTeam: { name: 'Austria', tla: 'AUT' },
  },
  {
    id: '2026-06-27-jor-arg',
    utcDate: '2026-06-28T02:00:00Z',
    homeTeam: { name: 'Jordan', tla: 'JOR' },
    awayTeam: { name: 'Argentina', tla: 'ARG' },
  },
  {
    id: '2026-06-28-rsa-can',
    utcDate: '2026-06-28T19:00:00Z',
    stage: 'knockout',
    homeTeam: { name: 'South Africa', tla: 'RSA' },
    awayTeam: { name: 'Canada', tla: 'CAN' },
  },
  {
    id: '2026-06-29-bra-jpn',
    utcDate: '2026-06-29T17:00:00Z',
    stage: 'knockout',
    homeTeam: { name: 'Brazil', tla: 'BRA' },
    awayTeam: { name: 'Japan', tla: 'JPN' },
  },
  {
    id: '2026-06-29-ger-par',
    utcDate: '2026-06-29T20:30:00Z',
    stage: 'knockout',
    homeTeam: { name: 'Germany', tla: 'GER' },
    awayTeam: { name: 'Paraguay', tla: 'PAR' },
  },
  {
    id: '2026-06-30-ned-mar',
    utcDate: '2026-06-30T01:00:00Z',
    stage: 'knockout',
    homeTeam: { name: 'Netherlands', tla: 'NED' },
    awayTeam: { name: 'Morocco', tla: 'MAR' },
  },
  {
    id: '2026-06-30-civ-nor',
    utcDate: '2026-06-30T17:00:00Z',
    stage: 'knockout',
    homeTeam: { name: 'Ivory Coast', tla: 'CIV' },
    awayTeam: { name: 'Norway', tla: 'NOR' },
  },
  {
    id: '2026-06-30-fra-swe',
    utcDate: '2026-06-30T21:00:00Z',
    stage: 'knockout',
    homeTeam: { name: 'France', tla: 'FRA' },
    awayTeam: { name: 'Sweden', tla: 'SWE' },
  },
  {
    id: '2026-07-01-mex-ecu',
    utcDate: '2026-07-01T01:00:00Z',
    stage: 'knockout',
    homeTeam: { name: 'Mexico', tla: 'MEX' },
    awayTeam: { name: 'Ecuador', tla: 'ECU' },
  },
  {
    id: '2026-07-01-eng-cod',
    utcDate: '2026-07-01T16:00:00Z',
    stage: 'knockout',
    homeTeam: { name: 'England', tla: 'ENG' },
    awayTeam: { name: 'Congo DR', tla: 'COD' },
  },
  {
    id: '2026-07-01-bel-sen',
    utcDate: '2026-07-01T20:00:00Z',
    stage: 'knockout',
    homeTeam: { name: 'Belgium', tla: 'BEL' },
    awayTeam: { name: 'Senegal', tla: 'SEN' },
  },
  {
    id: '2026-07-02-usa-bih',
    utcDate: '2026-07-02T00:00:00Z',
    stage: 'knockout',
    homeTeam: { name: 'USA', tla: 'USA' },
    awayTeam: { name: 'Bosnia-Herzegovina', tla: 'BIH' },
  },
  {
    id: '2026-07-02-esp-aut',
    utcDate: '2026-07-02T19:00:00Z',
    stage: 'knockout',
    homeTeam: { name: 'Spain', tla: 'ESP' },
    awayTeam: { name: 'Austria', tla: 'AUT' },
  },
  {
    id: '2026-07-02-por-cro',
    utcDate: '2026-07-02T23:00:00Z',
    stage: 'knockout',
    homeTeam: { name: 'Portugal', tla: 'POR' },
    awayTeam: { name: 'Croatia', tla: 'CRO' },
  },
  {
    id: '2026-07-03-sui-alg',
    utcDate: '2026-07-03T03:00:00Z',
    stage: 'knockout',
    homeTeam: { name: 'Switzerland', tla: 'SUI' },
    awayTeam: { name: 'Algeria', tla: 'ALG' },
  },
  {
    id: '2026-07-03-aus-egy',
    utcDate: '2026-07-03T18:00:00Z',
    stage: 'knockout',
    homeTeam: { name: 'Australia', tla: 'AUS' },
    awayTeam: { name: 'Egypt', tla: 'EGY' },
  },
  {
    id: '2026-07-03-arg-cpv',
    utcDate: '2026-07-03T22:00:00Z',
    stage: 'knockout',
    homeTeam: { name: 'Argentina', tla: 'ARG' },
    awayTeam: { name: 'Cape Verde', tla: 'CPV' },
  },
  {
    id: '2026-07-04-col-gha',
    utcDate: '2026-07-04T01:30:00Z',
    stage: 'knockout',
    homeTeam: { name: 'Colombia', tla: 'COL' },
    awayTeam: { name: 'Ghana', tla: 'GHA' },
  },
];

export const WORLD_CUP_FANTASY_MANUAL_MATCHES: readonly WorldCupFantasyManualMatch[] = [
  {
    /** Verified final result. */
    id: '2026-06-11-mex-rsa',
    utcDate: '2026-06-11T19:00:00Z',
    homeTeam: { name: 'Mexico', tla: 'MEX' },
    awayTeam: { name: 'South Africa', tla: 'RSA' },
    homeGoals: 2,
    awayGoals: 0,
    homeRedCards: 1,
    awayRedCards: 2,
  },
  {
    /** Verified final result. */
    id: '2026-06-12-kor-cze',
    utcDate: '2026-06-12T02:00:00Z',
    homeTeam: { name: 'South Korea', tla: 'KOR' },
    awayTeam: { name: 'Czechia', tla: 'CZE' },
    homeGoals: 2,
    awayGoals: 1,
  },
  {
    /** Verified final result. */
    id: '2026-06-12-can-bih',
    utcDate: '2026-06-12T19:00:00Z',
    homeTeam: { name: 'Canada', tla: 'CAN' },
    awayTeam: { name: 'Bosnia-Herzegovina', tla: 'BIH' },
    homeGoals: 1,
    awayGoals: 1,
  },
  {
    /** Verified final result. */
    id: '2026-06-13-usa-par',
    utcDate: '2026-06-13T01:00:00Z',
    homeTeam: { name: 'USA', tla: 'USA' },
    awayTeam: { name: 'Paraguay', tla: 'PAR' },
    homeGoals: 4,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-13-qat-sui',
    utcDate: '2026-06-13T19:00:00Z',
    homeTeam: { name: 'Qatar', tla: 'QAT' },
    awayTeam: { name: 'Switzerland', tla: 'SUI' },
    homeGoals: 1,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-13-bra-mar',
    utcDate: '2026-06-13T22:00:00Z',
    homeTeam: { name: 'Brazil', tla: 'BRA' },
    awayTeam: { name: 'Morocco', tla: 'MAR' },
    homeGoals: 1,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-14-hai-sco',
    utcDate: '2026-06-14T01:00:00Z',
    homeTeam: { name: 'Haiti', tla: 'HAI' },
    awayTeam: { name: 'Scotland', tla: 'SCO' },
    homeGoals: 0,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-14-aus-tur',
    utcDate: '2026-06-14T04:00:00Z',
    homeTeam: { name: 'Australia', tla: 'AUS' },
    awayTeam: { name: 'Turkey', tla: 'TUR' },
    homeGoals: 2,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-14-ger-cuw',
    utcDate: '2026-06-14T17:00:00Z',
    homeTeam: { name: 'Germany', tla: 'GER' },
    awayTeam: { name: 'Curaçao', tla: 'CUW' },
    homeGoals: 7,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-14-ned-jpn',
    utcDate: '2026-06-14T20:00:00Z',
    homeTeam: { name: 'Netherlands', tla: 'NED' },
    awayTeam: { name: 'Japan', tla: 'JPN' },
    homeGoals: 2,
    awayGoals: 2,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-14-civ-ecu',
    utcDate: '2026-06-14T23:00:00Z',
    homeTeam: { name: 'Ivory Coast', tla: 'CIV' },
    awayTeam: { name: 'Ecuador', tla: 'ECU' },
    homeGoals: 1,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-15-swe-tun',
    utcDate: '2026-06-15T02:00:00Z',
    homeTeam: { name: 'Sweden', tla: 'SWE' },
    awayTeam: { name: 'Tunisia', tla: 'TUN' },
    homeGoals: 5,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-15-esp-cpv',
    utcDate: '2026-06-15T16:00:00Z',
    homeTeam: { name: 'Spain', tla: 'ESP' },
    awayTeam: { name: 'Cape Verde', tla: 'CPV' },
    homeGoals: 0,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-15-bel-egy',
    utcDate: '2026-06-15T19:00:00Z',
    homeTeam: { name: 'Belgium', tla: 'BEL' },
    awayTeam: { name: 'Egypt', tla: 'EGY' },
    homeGoals: 1,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-15-ksa-uru',
    utcDate: '2026-06-15T22:00:00Z',
    homeTeam: { name: 'Saudi Arabia', tla: 'KSA' },
    awayTeam: { name: 'Uruguay', tla: 'URU' },
    homeGoals: 1,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-16-irn-nzl',
    utcDate: '2026-06-16T01:00:00Z',
    homeTeam: { name: 'Iran', tla: 'IRN' },
    awayTeam: { name: 'New Zealand', tla: 'NZL' },
    homeGoals: 2,
    awayGoals: 2,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-16-fra-sen',
    utcDate: '2026-06-16T19:00:00Z',
    homeTeam: { name: 'France', tla: 'FRA' },
    awayTeam: { name: 'Senegal', tla: 'SEN' },
    homeGoals: 3,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-16-irq-nor',
    utcDate: '2026-06-16T22:00:00Z',
    homeTeam: { name: 'Iraq', tla: 'IRQ' },
    awayTeam: { name: 'Norway', tla: 'NOR' },
    homeGoals: 1,
    awayGoals: 4,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-17-arg-alg',
    utcDate: '2026-06-17T01:00:00Z',
    homeTeam: { name: 'Argentina', tla: 'ARG' },
    awayTeam: { name: 'Algeria', tla: 'ALG' },
    homeGoals: 3,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-17-aut-jor',
    utcDate: '2026-06-17T04:00:00Z',
    homeTeam: { name: 'Austria', tla: 'AUT' },
    awayTeam: { name: 'Jordan', tla: 'JOR' },
    homeGoals: 3,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-17-por-cod',
    utcDate: '2026-06-17T17:00:00Z',
    homeTeam: { name: 'Portugal', tla: 'POR' },
    awayTeam: { name: 'Congo DR', tla: 'COD' },
    homeGoals: 1,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-17-eng-cro',
    utcDate: '2026-06-17T20:00:00Z',
    homeTeam: { name: 'England', tla: 'ENG' },
    awayTeam: { name: 'Croatia', tla: 'CRO' },
    homeGoals: 4,
    awayGoals: 2,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-17-gha-pan',
    utcDate: '2026-06-17T23:00:00Z',
    homeTeam: { name: 'Ghana', tla: 'GHA' },
    awayTeam: { name: 'Panama', tla: 'PAN' },
    homeGoals: 1,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-18-uzb-col',
    utcDate: '2026-06-18T02:00:00Z',
    homeTeam: { name: 'Uzbekistan', tla: 'UZB' },
    awayTeam: { name: 'Colombia', tla: 'COL' },
    homeGoals: 1,
    awayGoals: 3,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-18-cze-rsa',
    utcDate: '2026-06-18T16:00:00Z',
    homeTeam: { name: 'Czechia', tla: 'CZE' },
    awayTeam: { name: 'South Africa', tla: 'RSA' },
    homeGoals: 1,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-18-sui-bih',
    utcDate: '2026-06-18T19:00:00Z',
    homeTeam: { name: 'Switzerland', tla: 'SUI' },
    awayTeam: { name: 'Bosnia-Herzegovina', tla: 'BIH' },
    homeGoals: 4,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 1,
  },
  {
    /** Verified final result. */
    id: '2026-06-18-can-qat',
    utcDate: '2026-06-18T22:00:00Z',
    homeTeam: { name: 'Canada', tla: 'CAN' },
    awayTeam: { name: 'Qatar', tla: 'QAT' },
    homeGoals: 6,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 2,
  },
  {
    /** Verified final result. */
    id: '2026-06-19-mex-kor',
    utcDate: '2026-06-19T01:00:00Z',
    homeTeam: { name: 'Mexico', tla: 'MEX' },
    awayTeam: { name: 'South Korea', tla: 'KOR' },
    homeGoals: 1,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-19-usa-aus',
    utcDate: '2026-06-19T19:00:00Z',
    homeTeam: { name: 'USA', tla: 'USA' },
    awayTeam: { name: 'Australia', tla: 'AUS' },
    homeGoals: 2,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-19-sco-mar',
    utcDate: '2026-06-19T22:00:00Z',
    homeTeam: { name: 'Scotland', tla: 'SCO' },
    awayTeam: { name: 'Morocco', tla: 'MAR' },
    homeGoals: 0,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-19-bra-hai',
    utcDate: '2026-06-20T01:00:00Z',
    homeTeam: { name: 'Brazil', tla: 'BRA' },
    awayTeam: { name: 'Haiti', tla: 'HAI' },
    homeGoals: 3,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-19-tur-par',
    utcDate: '2026-06-20T03:00:00Z',
    homeTeam: { name: 'Turkey', tla: 'TUR' },
    awayTeam: { name: 'Paraguay', tla: 'PAR' },
    homeGoals: 0,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 1,
  },
  {
    /** Verified final result. */
    id: '2026-06-20-ned-swe',
    utcDate: '2026-06-20T17:00:00Z',
    homeTeam: { name: 'Netherlands', tla: 'NED' },
    awayTeam: { name: 'Sweden', tla: 'SWE' },
    homeGoals: 5,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-20-ger-civ',
    utcDate: '2026-06-20T20:00:00Z',
    homeTeam: { name: 'Germany', tla: 'GER' },
    awayTeam: { name: 'Ivory Coast', tla: 'CIV' },
    homeGoals: 2,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-20-ecu-cuw',
    utcDate: '2026-06-21T00:00:00Z',
    homeTeam: { name: 'Ecuador', tla: 'ECU' },
    awayTeam: { name: 'Curaçao', tla: 'CUW' },
    homeGoals: 0,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-20-tun-jpn',
    utcDate: '2026-06-21T03:00:00Z',
    homeTeam: { name: 'Tunisia', tla: 'TUN' },
    awayTeam: { name: 'Japan', tla: 'JPN' },
    homeGoals: 0,
    awayGoals: 4,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-21-esp-ksa',
    utcDate: '2026-06-21T16:00:00Z',
    homeTeam: { name: 'Spain', tla: 'ESP' },
    awayTeam: { name: 'Saudi Arabia', tla: 'KSA' },
    homeGoals: 4,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-21-bel-irn',
    utcDate: '2026-06-21T19:00:00Z',
    homeTeam: { name: 'Belgium', tla: 'BEL' },
    awayTeam: { name: 'Iran', tla: 'IRN' },
    homeGoals: 0,
    awayGoals: 0,
    homeRedCards: 1,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-21-uru-cpv',
    utcDate: '2026-06-21T22:00:00Z',
    homeTeam: { name: 'Uruguay', tla: 'URU' },
    awayTeam: { name: 'Cape Verde', tla: 'CPV' },
    homeGoals: 2,
    awayGoals: 2,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-22-nzl-egy',
    utcDate: '2026-06-22T01:00:00Z',
    homeTeam: { name: 'New Zealand', tla: 'NZL' },
    awayTeam: { name: 'Egypt', tla: 'EGY' },
    homeGoals: 1,
    awayGoals: 3,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-22-arg-aut',
    utcDate: '2026-06-22T17:00:00Z',
    homeTeam: { name: 'Argentina', tla: 'ARG' },
    awayTeam: { name: 'Austria', tla: 'AUT' },
    homeGoals: 2,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-22-fra-irq',
    utcDate: '2026-06-22T21:00:00Z',
    homeTeam: { name: 'France', tla: 'FRA' },
    awayTeam: { name: 'Iraq', tla: 'IRQ' },
    homeGoals: 3,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-23-nor-sen',
    utcDate: '2026-06-23T00:00:00Z',
    homeTeam: { name: 'Norway', tla: 'NOR' },
    awayTeam: { name: 'Senegal', tla: 'SEN' },
    homeGoals: 3,
    awayGoals: 2,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-23-jor-alg',
    utcDate: '2026-06-23T03:00:00Z',
    homeTeam: { name: 'Jordan', tla: 'JOR' },
    awayTeam: { name: 'Algeria', tla: 'ALG' },
    homeGoals: 1,
    awayGoals: 2,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-23-por-uzb',
    utcDate: '2026-06-23T17:00:00Z',
    homeTeam: { name: 'Portugal', tla: 'POR' },
    awayTeam: { name: 'Uzbekistan', tla: 'UZB' },
    homeGoals: 5,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-23-eng-gha',
    utcDate: '2026-06-23T20:00:00Z',
    homeTeam: { name: 'England', tla: 'ENG' },
    awayTeam: { name: 'Ghana', tla: 'GHA' },
    homeGoals: 0,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-23-pan-cro',
    utcDate: '2026-06-23T23:00:00Z',
    homeTeam: { name: 'Panama', tla: 'PAN' },
    awayTeam: { name: 'Croatia', tla: 'CRO' },
    homeGoals: 0,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-24-col-cod',
    utcDate: '2026-06-24T02:00:00Z',
    homeTeam: { name: 'Colombia', tla: 'COL' },
    awayTeam: { name: 'Congo DR', tla: 'COD' },
    homeGoals: 1,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-24-sui-can',
    utcDate: '2026-06-24T19:00:00Z',
    homeTeam: { name: 'Switzerland', tla: 'SUI' },
    awayTeam: { name: 'Canada', tla: 'CAN' },
    homeGoals: 2,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-24-bih-qat',
    utcDate: '2026-06-24T19:00:00Z',
    homeTeam: { name: 'Bosnia-Herzegovina', tla: 'BIH' },
    awayTeam: { name: 'Qatar', tla: 'QAT' },
    homeGoals: 3,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-24-sco-bra',
    utcDate: '2026-06-24T22:00:00Z',
    homeTeam: { name: 'Scotland', tla: 'SCO' },
    awayTeam: { name: 'Brazil', tla: 'BRA' },
    homeGoals: 0,
    awayGoals: 3,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-24-mar-hai',
    utcDate: '2026-06-24T22:00:00Z',
    homeTeam: { name: 'Morocco', tla: 'MAR' },
    awayTeam: { name: 'Haiti', tla: 'HAI' },
    homeGoals: 4,
    awayGoals: 2,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-24-cze-mex',
    utcDate: '2026-06-25T01:00:00Z',
    homeTeam: { name: 'Czechia', tla: 'CZE' },
    awayTeam: { name: 'Mexico', tla: 'MEX' },
    homeGoals: 0,
    awayGoals: 3,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-24-rsa-kor',
    utcDate: '2026-06-25T01:00:00Z',
    homeTeam: { name: 'South Africa', tla: 'RSA' },
    awayTeam: { name: 'South Korea', tla: 'KOR' },
    homeGoals: 1,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-25-cuw-civ',
    utcDate: '2026-06-25T20:00:00Z',
    homeTeam: { name: 'Curaçao', tla: 'CUW' },
    awayTeam: { name: 'Ivory Coast', tla: 'CIV' },
    homeGoals: 0,
    awayGoals: 2,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-25-ecu-ger',
    utcDate: '2026-06-25T20:00:00Z',
    homeTeam: { name: 'Ecuador', tla: 'ECU' },
    awayTeam: { name: 'Germany', tla: 'GER' },
    homeGoals: 2,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-25-jpn-swe',
    utcDate: '2026-06-25T23:00:00Z',
    homeTeam: { name: 'Japan', tla: 'JPN' },
    awayTeam: { name: 'Sweden', tla: 'SWE' },
    homeGoals: 1,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-25-tun-ned',
    utcDate: '2026-06-25T23:00:00Z',
    homeTeam: { name: 'Tunisia', tla: 'TUN' },
    awayTeam: { name: 'Netherlands', tla: 'NED' },
    homeGoals: 1,
    awayGoals: 3,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-25-tur-usa',
    utcDate: '2026-06-26T02:00:00Z',
    homeTeam: { name: 'Turkey', tla: 'TUR' },
    awayTeam: { name: 'USA', tla: 'USA' },
    homeGoals: 3,
    awayGoals: 2,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-25-par-aus',
    utcDate: '2026-06-26T02:00:00Z',
    homeTeam: { name: 'Paraguay', tla: 'PAR' },
    awayTeam: { name: 'Australia', tla: 'AUS' },
    homeGoals: 0,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-26-nor-fra',
    utcDate: '2026-06-26T19:00:00Z',
    homeTeam: { name: 'Norway', tla: 'NOR' },
    awayTeam: { name: 'France', tla: 'FRA' },
    homeGoals: 1,
    awayGoals: 4,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-26-sen-irq',
    utcDate: '2026-06-26T19:00:00Z',
    homeTeam: { name: 'Senegal', tla: 'SEN' },
    awayTeam: { name: 'Iraq', tla: 'IRQ' },
    homeGoals: 5,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 1,
  },
  {
    /** Verified final result. */
    id: '2026-06-26-cpv-ksa',
    utcDate: '2026-06-27T00:00:00Z',
    homeTeam: { name: 'Cape Verde', tla: 'CPV' },
    awayTeam: { name: 'Saudi Arabia', tla: 'KSA' },
    homeGoals: 0,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-26-uru-esp',
    utcDate: '2026-06-27T00:00:00Z',
    homeTeam: { name: 'Uruguay', tla: 'URU' },
    awayTeam: { name: 'Spain', tla: 'ESP' },
    homeGoals: 0,
    awayGoals: 1,
    homeRedCards: 1,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-26-egy-irn',
    utcDate: '2026-06-27T03:00:00Z',
    homeTeam: { name: 'Egypt', tla: 'EGY' },
    awayTeam: { name: 'Iran', tla: 'IRN' },
    homeGoals: 1,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-26-nzl-bel',
    utcDate: '2026-06-27T03:00:00Z',
    homeTeam: { name: 'New Zealand', tla: 'NZL' },
    awayTeam: { name: 'Belgium', tla: 'BEL' },
    homeGoals: 1,
    awayGoals: 5,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-27-pan-eng',
    utcDate: '2026-06-27T21:00:00Z',
    homeTeam: { name: 'Panama', tla: 'PAN' },
    awayTeam: { name: 'England', tla: 'ENG' },
    homeGoals: 0,
    awayGoals: 2,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-27-cro-gha',
    utcDate: '2026-06-27T21:00:00Z',
    homeTeam: { name: 'Croatia', tla: 'CRO' },
    awayTeam: { name: 'Ghana', tla: 'GHA' },
    homeGoals: 2,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-27-col-por',
    utcDate: '2026-06-27T23:30:00Z',
    homeTeam: { name: 'Colombia', tla: 'COL' },
    awayTeam: { name: 'Portugal', tla: 'POR' },
    homeGoals: 0,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-27-cod-uzb',
    utcDate: '2026-06-27T23:30:00Z',
    homeTeam: { name: 'Congo DR', tla: 'COD' },
    awayTeam: { name: 'Uzbekistan', tla: 'UZB' },
    homeGoals: 3,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-27-alg-aut',
    utcDate: '2026-06-28T02:00:00Z',
    homeTeam: { name: 'Algeria', tla: 'ALG' },
    awayTeam: { name: 'Austria', tla: 'AUT' },
    homeGoals: 3,
    awayGoals: 3,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-27-jor-arg',
    utcDate: '2026-06-28T02:00:00Z',
    homeTeam: { name: 'Jordan', tla: 'JOR' },
    awayTeam: { name: 'Argentina', tla: 'ARG' },
    homeGoals: 1,
    awayGoals: 3,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-28-rsa-can',
    utcDate: '2026-06-28T19:00:00Z',
    homeTeam: { name: 'South Africa', tla: 'RSA' },
    awayTeam: { name: 'Canada', tla: 'CAN' },
    homeGoals: 0,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-29-bra-jpn',
    utcDate: '2026-06-29T17:00:00Z',
    homeTeam: { name: 'Brazil', tla: 'BRA' },
    awayTeam: { name: 'Japan', tla: 'JPN' },
    homeGoals: 2,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result (1-1 aet, Paraguay won 4-3 on penalties). */
    id: '2026-06-29-ger-par',
    utcDate: '2026-06-29T20:30:00Z',
    homeTeam: { name: 'Germany', tla: 'GER' },
    awayTeam: { name: 'Paraguay', tla: 'PAR' },
    homeGoals: 1,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
    homePenalties: 3,
    awayPenalties: 4,
  },
  {
    /** Verified final result (1-1 aet, Morocco won 3-2 on penalties). */
    id: '2026-06-30-ned-mar',
    utcDate: '2026-06-30T01:00:00Z',
    homeTeam: { name: 'Netherlands', tla: 'NED' },
    awayTeam: { name: 'Morocco', tla: 'MAR' },
    homeGoals: 1,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
    homePenalties: 2,
    awayPenalties: 3,
  },
  {
    /** Verified final result. */
    id: '2026-06-30-civ-nor',
    utcDate: '2026-06-30T17:00:00Z',
    homeTeam: { name: 'Ivory Coast', tla: 'CIV' },
    awayTeam: { name: 'Norway', tla: 'NOR' },
    homeGoals: 1,
    awayGoals: 2,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. */
    id: '2026-06-30-fra-swe',
    utcDate: '2026-06-30T21:00:00Z',
    homeTeam: { name: 'France', tla: 'FRA' },
    awayTeam: { name: 'Sweden', tla: 'SWE' },
    homeGoals: 3,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. Piero Hincapie sent off stoppage time (mouth-covering rule). */
    id: '2026-07-01-mex-ecu',
    utcDate: '2026-07-01T01:00:00Z',
    homeTeam: { name: 'Mexico', tla: 'MEX' },
    awayTeam: { name: 'Ecuador', tla: 'ECU' },
    homeGoals: 2,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 1,
  },
  {
    /** Verified final result. Kane brace (75′, 86′) after Cipenga opener (7′). */
    id: '2026-07-01-eng-cod',
    utcDate: '2026-07-01T16:00:00Z',
    homeTeam: { name: 'England', tla: 'ENG' },
    awayTeam: { name: 'Congo DR', tla: 'COD' },
    homeGoals: 2,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. Lukaku and Tielemans (89′) rescue 2–2; Tielemans pen winner (120+5′). */
    id: '2026-07-01-bel-sen',
    utcDate: '2026-07-01T20:00:00Z',
    homeTeam: { name: 'Belgium', tla: 'BEL' },
    awayTeam: { name: 'Senegal', tla: 'SEN' },
    homeGoals: 3,
    awayGoals: 2,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. Balogun opener (45′), straight red (64′); Tillman free-kick seals it (82′). */
    id: '2026-07-02-usa-bih',
    utcDate: '2026-07-02T00:00:00Z',
    homeTeam: { name: 'USA', tla: 'USA' },
    awayTeam: { name: 'Bosnia-Herzegovina', tla: 'BIH' },
    homeGoals: 2,
    awayGoals: 0,
    homeRedCards: 1,
    awayRedCards: 0,
  },
  {
    /** Verified final result. Oyarzabal brace (36′, 89′); Porro header (66′). */
    id: '2026-07-02-esp-aut',
    utcDate: '2026-07-02T19:00:00Z',
    homeTeam: { name: 'Spain', tla: 'ESP' },
    awayTeam: { name: 'Austria', tla: 'AUT' },
    homeGoals: 3,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. Perisic (53′); Ronaldo pen (68′); Ramos header winner (90+4′); Gvardiol goal disallowed (VAR). */
    id: '2026-07-02-por-cro',
    utcDate: '2026-07-02T23:00:00Z',
    homeTeam: { name: 'Portugal', tla: 'POR' },
    awayTeam: { name: 'Croatia', tla: 'CRO' },
    homeGoals: 2,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. Embolo (10′); Ndoye (46′). */
    id: '2026-07-03-sui-alg',
    utcDate: '2026-07-03T03:00:00Z',
    homeTeam: { name: 'Switzerland', tla: 'SUI' },
    awayTeam: { name: 'Algeria', tla: 'ALG' },
    homeGoals: 2,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. Ashour (13′); Hany OG (55′); Egypt advance 4–2 on penalties. */
    id: '2026-07-03-aus-egy',
    utcDate: '2026-07-03T18:00:00Z',
    homeTeam: { name: 'Australia', tla: 'AUS' },
    awayTeam: { name: 'Egypt', tla: 'EGY' },
    homeGoals: 1,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
    homePenalties: 2,
    awayPenalties: 4,
  },
  {
    /** Verified final result. Messi (29′); Duarte (59′); Martinez (103′); Cabral (103′); Borges OG (111′). AET. */
    id: '2026-07-03-arg-cpv',
    utcDate: '2026-07-03T22:00:00Z',
    homeTeam: { name: 'Argentina', tla: 'ARG' },
    awayTeam: { name: 'Cape Verde', tla: 'CPV' },
    homeGoals: 3,
    awayGoals: 2,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. Arias (14′); Colombia advance to face Switzerland. */
    id: '2026-07-04-col-gha',
    utcDate: '2026-07-04T01:30:00Z',
    homeTeam: { name: 'Colombia', tla: 'COL' },
    awayTeam: { name: 'Ghana', tla: 'GHA' },
    homeGoals: 1,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. Morocco advance to face France in the quarter-finals. */
    id: '2026-07-04-r16-1',
    utcDate: '2026-07-04T17:00:00Z',
    homeTeam: { name: 'Canada', tla: 'CAN' },
    awayTeam: { name: 'Morocco', tla: 'MAR' },
    homeGoals: 0,
    awayGoals: 3,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result. France advance to face Morocco in the quarter-finals. */
    id: '2026-07-04-r16-2',
    utcDate: '2026-07-04T21:00:00Z',
    homeTeam: { name: 'Paraguay', tla: 'PAR' },
    awayTeam: { name: 'France', tla: 'FRA' },
    homeGoals: 0,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result (ESPN sync). Norway knock Brazil out in the last sixteen. */
    id: '2026-07-05-r16-3',
    utcDate: '2026-07-05T20:00:00Z',
    homeTeam: { name: 'Brazil', tla: 'BRA' },
    awayTeam: { name: 'Norway', tla: 'NOR' },
    homeGoals: 1,
    awayGoals: 2,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result (ESPN sync). */
    id: '2026-07-06-r16-4',
    utcDate: '2026-07-06T01:00:00Z',
    homeTeam: { name: 'England', tla: 'ENG' },
    awayTeam: { name: 'Mexico', tla: 'MEX' },
    homeGoals: 3,
    awayGoals: 2,
    homeRedCards: 1,
    awayRedCards: 0,
  },
  {
    /** Verified final result (ESPN sync). Spain knock Portugal out; Dave's last nation gone. */
    id: '2026-07-06-r16-5',
    utcDate: '2026-07-06T19:00:00Z',
    homeTeam: { name: 'Portugal', tla: 'POR' },
    awayTeam: { name: 'Spain', tla: 'ESP' },
    homeGoals: 0,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result (ESPN sync). */
    id: '2026-07-07-r16-6',
    utcDate: '2026-07-07T00:00:00Z',
    homeTeam: { name: 'USA', tla: 'USA' },
    awayTeam: { name: 'Belgium', tla: 'BEL' },
    homeGoals: 1,
    awayGoals: 4,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result (ESPN sync). */
    id: '2026-07-07-r16-7',
    utcDate: '2026-07-07T16:00:00Z',
    homeTeam: { name: 'Argentina', tla: 'ARG' },
    awayTeam: { name: 'Egypt', tla: 'EGY' },
    homeGoals: 3,
    awayGoals: 2,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result (0-0 aet, Switzerland won 4-3 on penalties). */
    id: '2026-07-07-r16-8',
    utcDate: '2026-07-07T20:00:00Z',
    homeTeam: { name: 'Switzerland', tla: 'SUI' },
    awayTeam: { name: 'Colombia', tla: 'COL' },
    homeGoals: 0,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
    homePenalties: 4,
    awayPenalties: 3,
  },
  {
    /** Verified final result (ESPN sync). */
    id: '2026-07-09-qf-1',
    utcDate: '2026-07-09T20:00:00Z',
    homeTeam: { name: 'France', tla: 'FRA' },
    awayTeam: { name: 'Morocco', tla: 'MAR' },
    homeGoals: 2,
    awayGoals: 0,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result (ESPN sync). */
    id: '2026-07-10-qf-2',
    utcDate: '2026-07-10T19:00:00Z',
    homeTeam: { name: 'Belgium', tla: 'BEL' },
    awayTeam: { name: 'Spain', tla: 'ESP' },
    homeGoals: 1,
    awayGoals: 2,
    homeRedCards: 0,
    awayRedCards: 0,
  },
  {
    /** Verified final result (ESPN sync). */
    id: '2026-07-11-qf-3',
    utcDate: '2026-07-11T21:00:00Z',
    homeTeam: { name: 'England', tla: 'ENG' },
    awayTeam: { name: 'Norway', tla: 'NOR' },
    homeGoals: 2,
    awayGoals: 1,
    homeRedCards: 0,
    awayRedCards: 0,
  },
];
