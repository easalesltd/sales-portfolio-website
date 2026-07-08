const WORLD_CUP_BRACKET_TBD_TLA = 'TBD';

const R32_SLOT_BY_FIXTURE_ID = {
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

const KNOCKOUT_BRACKET_TEMPLATES = [
  {
    id: '2026-07-04-r16-1',
    utcDate: '2026-07-04T17:00:00Z',
    round: 'R16',
    home: { kind: 'winner', slot: 'R32-1' },
    away: { kind: 'winner', slot: 'R32-4' },
  },
  {
    id: '2026-07-04-r16-2',
    utcDate: '2026-07-04T21:00:00Z',
    round: 'R16',
    home: { kind: 'winner', slot: 'R32-3' },
    away: { kind: 'winner', slot: 'R32-6' },
  },
  {
    id: '2026-07-05-r16-3',
    utcDate: '2026-07-05T20:00:00Z',
    round: 'R16',
    home: { kind: 'winner', slot: 'R32-2' },
    away: { kind: 'winner', slot: 'R32-5' },
  },
  {
    id: '2026-07-06-r16-4',
    utcDate: '2026-07-06T01:00:00Z',
    round: 'R16',
    home: { kind: 'winner', slot: 'R32-8' },
    away: { kind: 'winner', slot: 'R32-7' },
  },
  {
    id: '2026-07-06-r16-5',
    utcDate: '2026-07-06T19:00:00Z',
    round: 'R16',
    home: { kind: 'winner', slot: 'R32-12' },
    away: { kind: 'winner', slot: 'R32-11' },
  },
  {
    id: '2026-07-07-r16-6',
    utcDate: '2026-07-07T00:00:00Z',
    round: 'R16',
    home: { kind: 'winner', slot: 'R32-10' },
    away: { kind: 'winner', slot: 'R32-9' },
  },
  {
    id: '2026-07-07-r16-7',
    utcDate: '2026-07-07T16:00:00Z',
    round: 'R16',
    home: { kind: 'winner', slot: 'R32-15' },
    away: { kind: 'winner', slot: 'R32-14' },
  },
  {
    id: '2026-07-07-r16-8',
    utcDate: '2026-07-07T20:00:00Z',
    round: 'R16',
    home: { kind: 'winner', slot: 'R32-13' },
    away: { kind: 'winner', slot: 'R32-16' },
  },
  {
    id: '2026-07-09-qf-1',
    utcDate: '2026-07-09T20:00:00Z',
    round: 'QF',
    home: { kind: 'winner', slot: 'R16-2' },
    away: { kind: 'winner', slot: 'R16-1' },
  },
  {
    id: '2026-07-10-qf-2',
    utcDate: '2026-07-10T19:00:00Z',
    round: 'QF',
    home: { kind: 'winner', slot: 'R16-6' },
    away: { kind: 'winner', slot: 'R16-5' },
  },
  {
    id: '2026-07-11-qf-3',
    utcDate: '2026-07-11T21:00:00Z',
    round: 'QF',
    home: { kind: 'winner', slot: 'R16-4' },
    away: { kind: 'winner', slot: 'R16-3' },
  },
  {
    id: '2026-07-12-qf-4',
    utcDate: '2026-07-12T01:00:00Z',
    round: 'QF',
    home: { kind: 'winner', slot: 'R16-8' },
    away: { kind: 'winner', slot: 'R16-7' },
  },
  {
    id: '2026-07-14-sf-1',
    utcDate: '2026-07-14T19:00:00Z',
    round: 'SF',
    home: { kind: 'winner', slot: 'QF-2' },
    away: { kind: 'winner', slot: 'QF-1' },
  },
  {
    id: '2026-07-15-sf-2',
    utcDate: '2026-07-15T19:00:00Z',
    round: 'SF',
    home: { kind: 'winner', slot: 'QF-4' },
    away: { kind: 'winner', slot: 'QF-3' },
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

const SLOT_LABELS = {
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

function normalizeTeamCode(tla, teamByCode) {
  const upper = tla.trim().toUpperCase();
  if (teamByCode[upper]) return upper;

  for (const [code, meta] of Object.entries(teamByCode)) {
    if ((meta.aliases ?? []).some((alias) => alias.toUpperCase() === upper)) return code;
  }

  return upper;
}

function matchHomeWon(match) {
  if (match.homeGoals == null || match.awayGoals == null) return null;
  if (match.homeGoals !== match.awayGoals) return match.homeGoals > match.awayGoals;

  if (
    match.homePenalties != null &&
    match.awayPenalties != null &&
    match.homePenalties !== match.awayPenalties
  ) {
    return match.homePenalties > match.awayPenalties;
  }

  return null;
}

function matchWinner(match, teamByCode) {
  const homeWon = matchHomeWon(match);
  if (homeWon == null) return null;

  const winner = homeWon ? match.homeTeam : match.awayTeam;
  return {
    code: normalizeTeamCode(winner.tla, teamByCode),
    name: winner.name,
  };
}

function matchLoser(match, teamByCode) {
  const homeWon = matchHomeWon(match);
  if (homeWon == null) return null;

  const loser = homeWon ? match.awayTeam : match.homeTeam;
  return {
    code: normalizeTeamCode(loser.tla, teamByCode),
    name: loser.name,
  };
}

function isFinishedMatch(match) {
  return matchHomeWon(match) != null;
}

function buildSlotWinners(baseFixtures, matches, teamByCode) {
  const winners = new Map();
  const matchesById = new Map(matches.map((match) => [match.id, match]));

  for (const fixture of baseFixtures) {
    if (fixture.stage !== 'knockout') continue;
    const slot = R32_SLOT_BY_FIXTURE_ID[fixture.id];
    if (!slot) continue;

    const match = matchesById.get(fixture.id);
    const winner = match ? matchWinner(match, teamByCode) : null;
    if (winner) winners.set(slot, winner);
  }

  for (const template of KNOCKOUT_BRACKET_TEMPLATES) {
    const match = matchesById.get(template.id);
    if (!match || !isFinishedMatch(match)) continue;

    const winner = matchWinner(match, teamByCode);
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
      const loser = matchLoser(match, teamByCode);
      if (loser) winners.set(`${sfSlot}-L`, loser);
    }
  }

  return winners;
}

function resolveSide(source, baseFixtures, slotWinners, teamByCode) {
  if (source.kind === 'fixture') {
    const fixture = baseFixtures.find((entry) => entry.id === source.fixtureId);
    const team = source.side === 'home' ? fixture?.homeTeam : fixture?.awayTeam;
    if (team) return { team, placeholder: false };
    return { team: { name: 'TBD', tla: WORLD_CUP_BRACKET_TBD_TLA }, placeholder: true };
  }

  const winner = slotWinners.get(source.slot);
  if (winner) {
    const meta = teamByCode[winner.code];
    return {
      team: { name: meta?.name ?? winner.name, tla: winner.code },
      placeholder: false,
    };
  }

  return {
    team: {
      name: SLOT_LABELS[source.slot] ?? `Winner ${source.slot}`,
      tla: WORLD_CUP_BRACKET_TBD_TLA,
    },
    placeholder: true,
  };
}

function resolveWorldCupKnockoutFixtures(baseFixtures, matches, teamByCode) {
  const slotWinners = buildSlotWinners(baseFixtures, matches, teamByCode);
  const resolved = baseFixtures
    .filter((fixture) => fixture.stage === 'knockout')
    .map((fixture) => ({
      id: fixture.id,
      utcDate: fixture.utcDate,
      stage: fixture.stage,
      homeTeam: fixture.homeTeam,
      awayTeam: fixture.awayTeam,
      homeTla: fixture.homeTeam.tla,
      awayTla: fixture.awayTeam.tla,
      homeName: fixture.homeTeam.name,
      awayName: fixture.awayTeam.name,
    }));

  for (const template of KNOCKOUT_BRACKET_TEMPLATES) {
    const home = resolveSide(template.home, baseFixtures, slotWinners, teamByCode);
    const away = resolveSide(template.away, baseFixtures, slotWinners, teamByCode);

    resolved.push({
      id: template.id,
      utcDate: template.utcDate,
      stage: 'knockout',
      homeTeam: home.team,
      awayTeam: away.team,
      homeTla: home.team.tla,
      awayTla: away.team.tla,
      homeName: home.team.name,
      awayName: away.team.name,
    });
  }

  return resolved.sort((a, b) => a.utcDate.localeCompare(b.utcDate));
}

function resolveWorldCupScheduleFixtures(baseFixtures, matches, teamByCode) {
  const groupFixtures = baseFixtures
    .filter((fixture) => fixture.stage !== 'knockout')
    .map((fixture) => ({
      ...fixture,
      homeTla: fixture.homeTeam.tla,
      awayTla: fixture.awayTeam.tla,
      homeName: fixture.homeTeam.name,
      awayName: fixture.awayTeam.name,
    }));
  const knockoutFixtures = resolveWorldCupKnockoutFixtures(baseFixtures, matches, teamByCode);
  return [...groupFixtures, ...knockoutFixtures];
}

module.exports = {
  WORLD_CUP_BRACKET_TBD_TLA,
  KNOCKOUT_BRACKET_TEMPLATES,
  resolveWorldCupKnockoutFixtures,
  resolveWorldCupScheduleFixtures,
};
