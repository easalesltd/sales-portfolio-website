/**
 * Secret sweepstake config — team codes plus aliases for score matching.
 */
export type WorldCupTeamMeta = {
  code: string;
  name: string;
  flag: string;
  /** Extra API codes that should count as this team. */
  aliases?: readonly string[];
};

export const WORLD_CUP_TEAM_BY_CODE: Record<string, WorldCupTeamMeta> = {
  ARG: { code: 'ARG', name: 'Argentina', flag: '🇦🇷' },
  USA: { code: 'USA', name: 'USA', flag: '🇺🇸' },
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
  KOR: { code: 'KOR', name: 'South Korea', flag: '🇰🇷' },
  CMR: { code: 'CMR', name: 'Cameroon', flag: '🇨🇲' },
  CAN: { code: 'CAN', name: 'Canada', flag: '🇨🇦' },
  ESP: { code: 'ESP', name: 'Spain', flag: '🇪🇸' },
  NED: { code: 'NED', name: 'Netherlands', flag: '🇳🇱', aliases: ['HOL'] },
  ECU: { code: 'ECU', name: 'Ecuador', flag: '🇪🇨' },
  GHA: { code: 'GHA', name: 'Ghana', flag: '🇬🇭' },
  COL: { code: 'COL', name: 'Colombia', flag: '🇨🇴' },
  SWE: { code: 'SWE', name: 'Sweden', flag: '🇸🇪' },
  SCO: { code: 'SCO', name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  NOR: { code: 'NOR', name: 'Norway', flag: '🇳🇴' },
  TUR: { code: 'TUR', name: 'Turkey', flag: '🇹🇷' },
  CIV: { code: 'CIV', name: 'Ivory Coast', flag: '🇨🇮' },
  WAL: { code: 'WAL', name: 'Wales', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', aliases: ['WLS'] },
  ENG: { code: 'ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  CRO: { code: 'CRO', name: 'Croatia', flag: '🇭🇷' },
  URU: { code: 'URU', name: 'Uruguay', flag: '🇺🇾', aliases: ['URY'] },
  IRN: { code: 'IRN', name: 'Iran', flag: '🇮🇷', aliases: ['IRA'] },
  AUS: { code: 'AUS', name: 'Australia', flag: '🇦🇺' },
  SRB: { code: 'SRB', name: 'Serbia', flag: '🇷🇸', aliases: ['SER'] },
  POR: { code: 'POR', name: 'Portugal', flag: '🇵🇹' },
  GER: { code: 'GER', name: 'Germany', flag: '🇩🇪' },
  BEL: { code: 'BEL', name: 'Belgium', flag: '🇧🇪' },
  MEX: { code: 'MEX', name: 'Mexico', flag: '🇲🇽' },
  DEN: { code: 'DEN', name: 'Denmark', flag: '🇩🇰' },
  ALG: { code: 'ALG', name: 'Algeria', flag: '🇩🇿' },
  AUT: { code: 'AUT', name: 'Austria', flag: '🇦🇹' },
  BIH: { code: 'BIH', name: 'Bosnia-Herzegovina', flag: '🇧🇦' },
  COD: { code: 'COD', name: 'Congo DR', flag: '🇨🇩' },
  CPV: { code: 'CPV', name: 'Cape Verde', flag: '🇨🇻' },
  CUW: { code: 'CUW', name: 'Curaçao', flag: '🇨🇼' },
  CZE: { code: 'CZE', name: 'Czechia', flag: '🇨🇿' },
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

export const WORLD_CUP_SWEEPSTAKE_INTRO =
  'Six players, eight nations each — the full 48-team World Cup sweepstake. Points follow your teams’ real results throughout the tournament.';

export const WORLD_CUP_SWEEPSTAKE_FAIRNESS =
  'All 48 qualified nations were ranked by strength, then split in a serpentine (snake) draft — so every player gets one elite pick, one mid-tier side, and one long shot per round. Nobody ends up with eight outsiders.';

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
    clubCrest: '/images/world-cup-fantasy/crests/jon.png',
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
    clubCrest: '/images/world-cup-fantasy/crests/objection-overruled-v3.png',
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
];
