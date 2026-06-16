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
  'Saudi Arabia and Uruguay have shared the points after spending the evening treating a winner like a suspicious kebab. Nest pockets one, Scott pockets one, and Scott still stays bottom on goal difference, which is less a comeback than finding 20p under the fruit machine and calling it a pension plan.';

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
    teamName: 'Summer Soul Vibes UTD',
    managerImage: '/images/world-cup-fantasy/managers/nest.png',
    clubCrest: '/images/world-cup-fantasy/crests/nest.png',
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
    teamName: 'Creamy Creamers FC',
    managerImage: '/images/world-cup-fantasy/managers/dave.png',
    clubCrest: '/images/world-cup-fantasy/crests/dave.png',
    teams: ['GER', 'POR', 'SEN', 'KOR', 'IRN', 'ALG', 'PAN', 'COD'],
    draftNote:
      'Germany and Portugal cream the competition on paper, Senegal and South Korea add knockout nous, Algeria and Iran keep the Middle East covered — Panama and Congo DR are the dreamers.',
  },
] as const;

export const WORLD_CUP_FANTASY_SCORING = {
  win: 3,
  draw: 1,
  loss: 0,
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
  homeGoals: number;
  awayGoals: number;
  /** Red cards shown by this team (defaults to 0). */
  homeRedCards?: number;
  awayRedCards?: number;
};

export type WorldCupFantasyFixture = {
  id: string;
  utcDate: string;
  homeTeam: { name: string; tla: string };
  awayTeam: { name: string; tla: string };
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
];
