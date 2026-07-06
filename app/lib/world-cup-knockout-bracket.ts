import {
  WORLD_CUP_TEAM_BY_CODE,
  teamCodeMatches,
  type WorldCupFantasyFixture,
} from '@/app/data/world-cup-fantasy';
import type { WorldCupMatchResult } from '@/app/lib/world-cup-scoring';

export const WORLD_CUP_BRACKET_TBD_TLA = 'TBD';

export type KnockoutRound = 'R32' | 'R16' | 'QF' | 'SF' | 'F' | '3P';

export const KNOCKOUT_ROUND_LABELS: Record<KnockoutRound, string> = {
  R32: 'Round of 32',
  R16: 'Round of 16',
  QF: 'Quarter-final',
  SF: 'Semi-final',
  F: 'Final',
  '3P': 'Third-place play-off',
};

type BracketSideSource =
  | { kind: 'fixture'; fixtureId: string; side: 'home' | 'away' }
  | { kind: 'winner'; slot: string };

type BracketTemplate = {
  id: string;
  utcDate: string;
  round: KnockoutRound;
  home: BracketSideSource;
  away: BracketSideSource;
  /** Shown under the result once this tie is finished. */
  winnerPathLabel?: string;
};

/** ESPN 2026 bracket slot for each round-of-32 fixture id (kickoff order). */
export const WORLD_CUP_R32_FIXTURE_IDS = [
  '2026-06-28-rsa-can',
  '2026-06-29-bra-jpn',
  '2026-06-29-ger-par',
  '2026-06-30-ned-mar',
  '2026-06-30-civ-nor',
  '2026-06-30-fra-swe',
  '2026-07-01-mex-ecu',
  '2026-07-01-eng-cod',
  '2026-07-01-bel-sen',
  '2026-07-02-usa-bih',
  '2026-07-02-esp-aut',
  '2026-07-02-por-cro',
  '2026-07-03-sui-alg',
  '2026-07-03-aus-egy',
  '2026-07-03-arg-cpv',
  '2026-07-04-col-gha',
] as const;

const R32_SLOT_BY_FIXTURE_ID: Record<string, string> = {
  '2026-06-28-rsa-can': 'R32-1',
  '2026-06-29-bra-jpn': 'R32-2',
  '2026-06-29-ger-par': 'R32-3',
  '2026-06-30-ned-mar': 'R32-4',
  '2026-06-30-civ-nor': 'R32-5',
  '2026-06-30-fra-swe': 'R32-6',
  '2026-07-01-mex-ecu': 'R32-7',
  '2026-07-01-eng-cod': 'R32-8',
  '2026-07-01-bel-sen': 'R32-9',
  '2026-07-02-usa-bih': 'R32-10',
  '2026-07-02-esp-aut': 'R32-11',
  '2026-07-02-por-cro': 'R32-12',
  '2026-07-03-sui-alg': 'R32-13',
  '2026-07-03-aus-egy': 'R32-14',
  '2026-07-03-arg-cpv': 'R32-15',
  '2026-07-04-col-gha': 'R32-16',
};

const KNOCKOUT_BRACKET_TEMPLATES: readonly BracketTemplate[] = [
  {
    id: '2026-07-04-r16-1',
    utcDate: '2026-07-04T17:00:00Z',
    round: 'R16',
    home: { kind: 'winner', slot: 'R32-1' },
    away: { kind: 'winner', slot: 'R32-4' },
    winnerPathLabel: 'Quarter-final · Thu 9 Jul',
  },
  {
    id: '2026-07-04-r16-2',
    utcDate: '2026-07-04T21:00:00Z',
    round: 'R16',
    home: { kind: 'winner', slot: 'R32-3' },
    away: { kind: 'winner', slot: 'R32-6' },
    winnerPathLabel: 'Quarter-final · Thu 9 Jul',
  },
  {
    id: '2026-07-05-r16-3',
    utcDate: '2026-07-05T20:00:00Z',
    round: 'R16',
    home: { kind: 'winner', slot: 'R32-2' },
    away: { kind: 'winner', slot: 'R32-5' },
    winnerPathLabel: 'Quarter-final · Sat 11 Jul',
  },
  {
    id: '2026-07-06-r16-4',
    utcDate: '2026-07-06T01:00:00Z',
    round: 'R16',
    home: { kind: 'winner', slot: 'R32-8' },
    away: { kind: 'winner', slot: 'R32-7' },
    winnerPathLabel: 'Quarter-final · Sat 11 Jul',
  },
  {
    id: '2026-07-06-r16-5',
    utcDate: '2026-07-06T19:00:00Z',
    round: 'R16',
    home: { kind: 'winner', slot: 'R32-12' },
    away: { kind: 'winner', slot: 'R32-11' },
    winnerPathLabel: 'Quarter-final · Fri 10 Jul',
  },
  {
    id: '2026-07-07-r16-6',
    utcDate: '2026-07-07T00:00:00Z',
    round: 'R16',
    home: { kind: 'winner', slot: 'R32-10' },
    away: { kind: 'winner', slot: 'R32-9' },
    winnerPathLabel: 'Quarter-final · Fri 10 Jul',
  },
  {
    id: '2026-07-07-r16-7',
    utcDate: '2026-07-07T16:00:00Z',
    round: 'R16',
    home: { kind: 'winner', slot: 'R32-15' },
    away: { kind: 'winner', slot: 'R32-14' },
    winnerPathLabel: 'Quarter-final · Sun 12 Jul',
  },
  {
    id: '2026-07-07-r16-8',
    utcDate: '2026-07-07T20:00:00Z',
    round: 'R16',
    home: { kind: 'winner', slot: 'R32-13' },
    away: { kind: 'winner', slot: 'R32-16' },
    winnerPathLabel: 'Quarter-final · Sun 12 Jul',
  },
  {
    id: '2026-07-09-qf-1',
    utcDate: '2026-07-09T20:00:00Z',
    round: 'QF',
    home: { kind: 'winner', slot: 'R16-2' },
    away: { kind: 'winner', slot: 'R16-1' },
    winnerPathLabel: 'Semi-final · Tue 14 Jul',
  },
  {
    id: '2026-07-10-qf-2',
    utcDate: '2026-07-10T19:00:00Z',
    round: 'QF',
    home: { kind: 'winner', slot: 'R16-6' },
    away: { kind: 'winner', slot: 'R16-5' },
    winnerPathLabel: 'Semi-final · Tue 14 Jul',
  },
  {
    id: '2026-07-11-qf-3',
    utcDate: '2026-07-11T21:00:00Z',
    round: 'QF',
    home: { kind: 'winner', slot: 'R16-4' },
    away: { kind: 'winner', slot: 'R16-3' },
    winnerPathLabel: 'Semi-final · Wed 15 Jul',
  },
  {
    id: '2026-07-12-qf-4',
    utcDate: '2026-07-12T01:00:00Z',
    round: 'QF',
    home: { kind: 'winner', slot: 'R16-8' },
    away: { kind: 'winner', slot: 'R16-7' },
    winnerPathLabel: 'Semi-final · Wed 15 Jul',
  },
  {
    id: '2026-07-14-sf-1',
    utcDate: '2026-07-14T19:00:00Z',
    round: 'SF',
    home: { kind: 'winner', slot: 'QF-2' },
    away: { kind: 'winner', slot: 'QF-1' },
    winnerPathLabel: 'Final · Sun 19 Jul',
  },
  {
    id: '2026-07-15-sf-2',
    utcDate: '2026-07-15T19:00:00Z',
    round: 'SF',
    home: { kind: 'winner', slot: 'QF-4' },
    away: { kind: 'winner', slot: 'QF-3' },
    winnerPathLabel: 'Final · Sun 19 Jul',
  },
  {
    id: '2026-07-18-3p',
    utcDate: '2026-07-18T21:00:00Z',
    round: '3P',
    home: { kind: 'winner', slot: 'SF-2-L' },
    away: { kind: 'winner', slot: 'SF-1-L' },
  },
  {
    id: '2026-07-19-final',
    utcDate: '2026-07-19T19:00:00Z',
    round: 'F',
    home: { kind: 'winner', slot: 'SF-2' },
    away: { kind: 'winner', slot: 'SF-1' },
  },
];

const SLOT_LABELS: Record<string, string> = {
  'R32-1': 'Winner · RSA vs CAN',
  'R32-2': 'Winner · BRA vs JPN',
  'R32-3': 'Winner · GER vs PAR',
  'R32-4': 'Winner · NED vs MAR',
  'R32-5': 'Winner · CIV vs NOR',
  'R32-6': 'Winner · FRA vs SWE',
  'R32-7': 'Winner · MEX vs ECU',
  'R32-8': 'Winner · ENG vs COD',
  'R32-9': 'Winner · BEL vs SEN',
  'R32-10': 'Winner · USA vs BIH',
  'R32-11': 'Winner · ESP vs AUT',
  'R32-12': 'Winner · POR vs CRO',
  'R32-13': 'Winner · SUI vs ALG',
  'R32-14': 'Winner · AUS vs EGY',
  'R32-15': 'Winner · ARG vs CPV',
  'R32-16': 'Winner · COL vs GHA',
  'R16-1': 'Winner · R16 tie 1',
  'R16-2': 'Winner · R16 tie 2',
  'R16-3': 'Winner · R16 tie 3',
  'R16-4': 'Winner · R16 tie 4',
  'R16-5': 'Winner · R16 tie 5',
  'R16-6': 'Winner · R16 tie 6',
  'R16-7': 'Winner · R16 tie 7',
  'R16-8': 'Winner · R16 tie 8',
  'QF-1': 'Winner · QF tie 1',
  'QF-2': 'Winner · QF tie 2',
  'QF-3': 'Winner · QF tie 3',
  'QF-4': 'Winner · QF tie 4',
  'SF-1': 'Winner · SF tie 1',
  'SF-2': 'Winner · SF tie 2',
  'SF-1-L': 'SF tie 1 loser',
  'SF-2-L': 'SF tie 2 loser',
};

export type ResolvedKnockoutFixture = WorldCupFantasyFixture & {
  round: KnockoutRound;
  winnerPathLabel?: string;
  placeholderSide?: 'home' | 'away' | 'both';
};

function normalizeTeamCode(tla: string): string {
  const upper = tla.trim().toUpperCase();
  if (WORLD_CUP_TEAM_BY_CODE[upper]) return upper;
  for (const [code, meta] of Object.entries(WORLD_CUP_TEAM_BY_CODE)) {
    if (meta.aliases?.some((alias) => alias.toUpperCase() === upper)) return code;
  }
  return upper;
}

function matchWinner(
  match: WorldCupMatchResult
): { code: string; name: string } | null {
  if (match.homeGoals == null || match.awayGoals == null) return null;
  if (match.homeGoals === match.awayGoals) return null;

  const winner = match.homeGoals > match.awayGoals ? match.homeTeam : match.awayTeam;
  return { code: normalizeTeamCode(winner.tla), name: winner.name };
}

function matchLoser(
  match: WorldCupMatchResult
): { code: string; name: string } | null {
  if (match.homeGoals == null || match.awayGoals == null) return null;
  if (match.homeGoals === match.awayGoals) return null;

  const loser = match.homeGoals > match.awayGoals ? match.awayTeam : match.homeTeam;
  return { code: normalizeTeamCode(loser.tla), name: loser.name };
}

function isFinishedMatch(match: WorldCupMatchResult): boolean {
  return match.homeGoals != null && match.awayGoals != null && match.homeGoals !== match.awayGoals;
}

function buildSlotWinners(
  baseFixtures: readonly WorldCupFantasyFixture[],
  matches: readonly WorldCupMatchResult[]
): Map<string, { code: string; name: string }> {
  const winners = new Map<string, { code: string; name: string }>();
  const matchesById = new Map(matches.map((match) => [match.id, match] as const));

  for (const fixture of baseFixtures) {
    if (fixture.stage !== 'knockout') continue;
    const slot = R32_SLOT_BY_FIXTURE_ID[fixture.id];
    if (!slot) continue;

    const match = matchesById.get(fixture.id);
    const winner = match ? matchWinner(match) : null;
    if (winner) winners.set(slot, winner);
  }

  for (const template of KNOCKOUT_BRACKET_TEMPLATES) {
    const match = matchesById.get(template.id);
    if (!match || !isFinishedMatch(match)) continue;

    const winner = matchWinner(match);
    if (!winner) continue;

    if (template.round === 'R16') {
      winners.set(`R16-${template.id.split('-').at(-1)}`, winner);
      continue;
    }

    if (template.round === 'QF') {
      winners.set(`QF-${template.id.split('-').at(-1)}`, winner);
      continue;
    }

    if (template.round === 'SF') {
      const sfSlot = template.id.endsWith('sf-1') ? 'SF-1' : 'SF-2';
      winners.set(sfSlot, winner);
      const loser = matchLoser(match);
      if (loser) winners.set(`${sfSlot}-L`, loser);
    }
  }

  return winners;
}

function resolveSide(
  source: BracketSideSource,
  baseFixtures: readonly WorldCupFantasyFixture[],
  slotWinners: Map<string, { code: string; name: string }>
): { team: WorldCupFantasyFixture['homeTeam']; placeholder: boolean } {
  if (source.kind === 'fixture') {
    const fixture = baseFixtures.find((entry) => entry.id === source.fixtureId);
    const team = source.side === 'home' ? fixture?.homeTeam : fixture?.awayTeam;
    if (team) return { team, placeholder: false };
    return { team: { name: 'TBD', tla: WORLD_CUP_BRACKET_TBD_TLA }, placeholder: true };
  }

  const winner = slotWinners.get(source.slot);
  if (winner) {
    const meta = WORLD_CUP_TEAM_BY_CODE[winner.code];
    return {
      team: { name: meta?.name ?? winner.name, tla: winner.code },
      placeholder: false,
    };
  }

  return {
    team: { name: SLOT_LABELS[source.slot] ?? `Winner ${source.slot}`, tla: WORLD_CUP_BRACKET_TBD_TLA },
    placeholder: true,
  };
}

export function isPlaceholderTeamTla(tla: string): boolean {
  return tla.trim().toUpperCase() === WORLD_CUP_BRACKET_TBD_TLA;
}

export function isKnockoutPhase(fixtures: readonly Pick<WorldCupFantasyFixture, 'stage'>[]): boolean {
  return fixtures.some((fixture) => fixture.stage === 'knockout');
}

export function annotateBaseKnockoutFixtures(
  baseFixtures: readonly WorldCupFantasyFixture[]
): WorldCupFantasyFixture[] {
  return baseFixtures.map((fixture) => {
    if (fixture.stage !== 'knockout') return fixture;
    return { ...fixture, round: 'R32' as const };
  });
}

export function resolveWorldCupKnockoutFixtures(
  baseFixtures: readonly WorldCupFantasyFixture[],
  matches: readonly WorldCupMatchResult[]
): ResolvedKnockoutFixture[] {
  const annotatedBase = annotateBaseKnockoutFixtures(baseFixtures);
  const slotWinners = buildSlotWinners(baseFixtures, matches);
  const resolved: ResolvedKnockoutFixture[] = annotatedBase
    .filter((fixture) => fixture.stage === 'knockout')
    .map((fixture) => ({
      ...fixture,
      round: 'R32',
      winnerPathLabel: (() => {
        const slot = R32_SLOT_BY_FIXTURE_ID[fixture.id];
        if (!slot) return undefined;
        const template = KNOCKOUT_BRACKET_TEMPLATES.find(
          (entry) =>
            (entry.home.kind === 'winner' && entry.home.slot === slot) ||
            (entry.away.kind === 'winner' && entry.away.slot === slot)
        );
        return template ? `Round of 16 · ${formatPathDate(template.utcDate)}` : undefined;
      })(),
    }));

  for (const template of KNOCKOUT_BRACKET_TEMPLATES) {
    const home = resolveSide(template.home, baseFixtures, slotWinners);
    const away = resolveSide(template.away, baseFixtures, slotWinners);
    const placeholderSide =
      home.placeholder && away.placeholder
        ? 'both'
        : home.placeholder
          ? 'home'
          : away.placeholder
            ? 'away'
            : undefined;

    resolved.push({
      id: template.id,
      utcDate: template.utcDate,
      stage: 'knockout',
      round: template.round,
      homeTeam: home.team,
      awayTeam: away.team,
      winnerPathLabel: template.winnerPathLabel,
      placeholderSide,
    });
  }

  return resolved.sort((a, b) => a.utcDate.localeCompare(b.utcDate));
}

export function resolveWorldCupScheduleFixtures(
  baseFixtures: readonly WorldCupFantasyFixture[],
  matches: readonly WorldCupMatchResult[]
): WorldCupFantasyFixture[] {
  const groupFixtures = baseFixtures.filter((fixture) => fixture.stage !== 'knockout');
  const knockoutFixtures = resolveWorldCupKnockoutFixtures(baseFixtures, matches);
  return [...groupFixtures, ...knockoutFixtures];
}

export function knockoutFixturesForElimination(
  baseFixtures: readonly WorldCupFantasyFixture[],
  matches: readonly WorldCupMatchResult[]
): WorldCupFantasyFixture[] {
  return resolveWorldCupKnockoutFixtures(baseFixtures, matches);
}

export function countTeamsStillAlive(
  teamCodes: readonly string[],
  eliminated: ReadonlySet<string>
): number {
  return teamCodes.filter((code) => !eliminated.has(code)).length;
}

function formatPathDate(utcDate: string): string {
  return new Date(utcDate).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}

export function teamCodeInResolvedFixture(
  fixture: Pick<WorldCupFantasyFixture, 'homeTeam' | 'awayTeam'>,
  teamCode: string
): boolean {
  if (isPlaceholderTeamTla(fixture.homeTeam.tla) || isPlaceholderTeamTla(fixture.awayTeam.tla)) {
    return false;
  }
  return teamCodeMatches(fixture.homeTeam.tla, teamCode) || teamCodeMatches(fixture.awayTeam.tla, teamCode);
}
