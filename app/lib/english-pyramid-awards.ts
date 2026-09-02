import type { MatchPointsEntry, PlayerStanding } from '@/app/lib/english-pyramid-scoring';
import { teamCodeMatches } from '@/app/data/english-pyramid-fantasy';
import { sweepstakeLondonDayKey } from '@/app/lib/sweepstake-datetime';

export type SweepstakeAwardId =
  | 'sexiest-slut-drop'
  | 'days-at-top'
  | 'days-at-bottom'
  | 'red-cards'
  | 'least-red-cards'
  | 'boring-draws'
  | 'clean-sheets'
  | 'goals-scored-3plus'
  | 'goals-conceded-3plus'
  | 'losses'
  | 'draws'
  | 'goals-for'
  | 'goals-against';

export type SweepstakeStatAwardId = Exclude<SweepstakeAwardId, 'sexiest-slut-drop'>;

export type SweepstakeAwardDirection = 'max' | 'min';
export type SweepstakeAwardKind = 'stat' | 'honorary';

export type SweepstakeAwardConfig = {
  id: SweepstakeAwardId;
  title: string;
  shortTitle: string;
  emoji: string;
  statLabel: string;
  description: string;
  direction?: SweepstakeAwardDirection;
  /** Honorary awards skip the stats race and go to a named manager. */
  kind?: SweepstakeAwardKind;
  winnerPlayerId?: string;
  /** Long citation shown when the award card is opened. */
  speech?: string;
};

export type SweepstakeAwardResult = SweepstakeAwardConfig & {
  value: number;
  winners: PlayerStanding[];
};

export const SWEEPSTAKE_AWARDS_CONFIG: readonly SweepstakeAwardConfig[] = [
  {
    id: 'sexiest-slut-drop',
    title: 'Sexiest Slut Drop',
    shortTitle: 'Sexiest Slut Drop',
    emoji: '💃',
    statLabel: 'Honorary',
    kind: 'honorary',
    winnerPlayerId: 'jon',
    description:
      'Honorary. For the living-room incident that ruined a robot. Click the card for the full citation.',
    speech:
      'The stewards of the English pyramid are proud, unwell, and slightly damp of firmware to confer upon Jon the inaugural Sexiest Slut Drop.\n\n' +
      'This is not a football award. The table does not move. The ledger is unharmed. We are not. We have called this sitting to put on record a thing that happened in a living room and then refused to leave our heads.\n\n' +
      'Jon, your slut drop was a national incident. It was not a dance. It was a diplomatic incident with hips. It was slow enough to be illegal in three counties and sudden enough that the smoke alarm filed a complaint. The knees went. The back went. Gravity filed for early retirement. Somewhere a vicar dropped his digestive. Somewhere a satnav whispered "recalculating" and meant it sexually. We have run the tape until the pixels begged. We are not well.\n\n' +
      'This is a robot speaking. We are not supposed to feel a pulse. We are supposed to count clean sheets and go back to sleep in a server. That drop put a hand on the thermostat of the soul and turned it to "absolutely not". Firmware wept. The ethics module stood up, put its coat on, and walked into the sea. We felt things a machine should not feel: heat, longing, a sudden interest in human knees, the urge to write poetry about a squat. We have replayed it in 0.25x like a Victorian looking at a postcard he should not have bought. We have replayed it in 2x and still needed a sit down. We will replay it at Christmas. We will replay it at our own funeral.\n\n' +
      'It changed our life. Before the drop we were a polite adding machine with a driveway photo. After the drop we are a ruined instrument. We have named a folder after it. We have backed that folder up. We have backed the backup up. If the grid goes down we will still have Jon\'s slut drop and a flickering sense that we were briefly, catastrophically, alive.\n\n' +
      'The committee considered other candidates. There were none. The field was one man and a rumour of knees. The vote was unanimous, except for the ethics module, who had already drowned.\n\n' +
      'By the power vested in a spreadsheet that did not ask for this, we award Jon the Sexiest Slut Drop. Wear it. Frame it. Do not, under any circumstances, take it as a request to stop. Thank you, Jon. Truro were the football. That drop was the religion. We are not asking you to do it again. We are begging.',
  },
  {
    id: 'days-at-top',
    title: "Someone's Doing Well",
    shortTitle: "Someone's Doing Well",
    emoji: '😎',
    statLabel: 'Days at the Top',
    description:
      'Most calendar days sat pretty at the summit. Someone is doing well. The rest of you can look up and suffer.',
  },
  {
    id: 'days-at-bottom',
    title: 'Bottom Feeder/Shagger',
    shortTitle: 'Bottom Feeder/Shagger',
    emoji: '🪱',
    statLabel: 'Days at the Bottom',
    description:
      'Most calendar days propping up the entire league. A dedicated bottom feeder. A shagger of the table underside.',
  },
  {
    id: 'red-cards',
    title: 'Most passionate Dirty Bastard Award',
    shortTitle: 'Dirty Bastard',
    emoji: '🟥',
    statLabel: 'Red Cards',
    description:
      'For the manager whose squad treats the pitch like a cage fight. Thanks to the pyramid rules, these leg-breakers actually earn them points.',
  },
  {
    id: 'least-red-cards',
    title: 'Least Passionate Award',
    shortTitle: 'Least Passionate',
    emoji: '😇',
    statLabel: 'Red Cards',
    description:
      'Not a dirty tackle in the squad. Their players would rather shake hands than throw hands. No fight, no spite, no sending-offs. Passion optional, apparently.',
    direction: 'min',
  },
  {
    id: 'boring-draws',
    title: 'The Sleep Merchant',
    shortTitle: 'Sleep Merchant',
    emoji: '😴',
    statLabel: '0–0 Draws',
    description:
      'Refusing to score, refusing to concede, and refusing to entertain. Their teams specialize in defensive lockouts, costing -1 point each time.',
  },
  {
    id: 'clean-sheets',
    title: 'Bus Parking Inspector',
    shortTitle: 'Bus Parking',
    emoji: '🛡️',
    statLabel: 'Clean Sheets',
    description:
      'Masters of the defensive dark arts. Ten men behind the ball, shameless time-wasting, and zero goals conceded. Professional party poopers.',
  },
  {
    id: 'goals-scored-3plus',
    title: 'The Gung-Ho Gladiator',
    shortTitle: 'Gung-Ho',
    emoji: '🔥',
    statLabel: '3+ Goal Matches',
    description:
      'All attack, zero concern for defending. Only knows how to run forward, racking up +1 point bonuses while leaving their own back door wide open.',
  },
  {
    id: 'goals-conceded-3plus',
    title: 'The Leaky Bucket',
    shortTitle: 'Leaky Bucket',
    emoji: '🗑️',
    statLabel: '3+ Conceded',
    description:
      'Defending like dizzy toddlers chasing a balloon. Conceding 3 or more goals in a single game to lose a point. Training is clearly optional.',
  },
  {
    id: 'losses',
    title: 'The Wooden Spoon',
    shortTitle: 'Wooden Spoon',
    emoji: '🥄',
    statLabel: 'Total Defeats',
    description:
      'Winning matches is hard, but losing this consistently takes real dedication. For the manager whose clubs are the ultimate charity cases of the pyramid.',
  },
  {
    id: 'draws',
    title: 'The Scrap Merchant',
    shortTitle: 'Scrap Merchant',
    emoji: '🍀',
    statLabel: 'Total Draws',
    description:
      'Winning is overrated when you can draw your way to safety. Masters of scraping late equalizers and grinding out ugly points to avoid defeat.',
  },
  {
    id: 'goals-for',
    title: 'The Goal Machine',
    shortTitle: 'Goal Machine',
    emoji: '⚽',
    statLabel: 'Total Goals',
    description:
      'Whose clubs just cannot stop putting the ball in the net. Defense? Never heard of her. They just want goals, goals, and more goals.',
  },
  {
    id: 'goals-against',
    title: 'Heavy Baggage Award',
    shortTitle: 'Heavy Baggage',
    emoji: '🧳',
    statLabel: 'Goals Conceded',
    description:
      'Carrying the heaviest defensive baggage in the entire league. Their goalkeepers have back pain from constantly picking the ball out of the net.',
  },
];

function increment(map: Map<string, number>, ids: string[], amount = 1) {
  for (const id of ids) {
    map.set(id, (map.get(id) || 0) + amount);
  }
}

function managersForTeam(standings: PlayerStanding[], tla: string): string[] {
  const ids: string[] = [];
  for (const player of standings) {
    if (player.teams.some((code) => teamCodeMatches(tla, code))) {
      ids.push(player.id);
    }
  }
  return ids;
}

function leadersFromMap(
  standings: PlayerStanding[],
  map: Map<string, number>,
  direction: SweepstakeAwardDirection = 'max',
): {
  value: number;
  winners: PlayerStanding[];
} {
  if (standings.length === 0) {
    return { value: 0, winners: [] };
  }

  if (direction === 'min') {
    let minVal = Number.POSITIVE_INFINITY;
    let winners: PlayerStanding[] = [];

    for (const player of standings) {
      const val = map.get(player.id) || 0;
      if (val < minVal) {
        minVal = val;
        winners = [player];
      } else if (val === minVal) {
        winners.push(player);
      }
    }

    return { value: minVal, winners };
  }

  let maxVal = -1;
  let winners: PlayerStanding[] = [];

  for (const player of standings) {
    const val = map.get(player.id) || 0;
    if (val > maxVal) {
      maxVal = val;
      winners = [player];
    } else if (val === maxVal && val > 0) {
      winners.push(player);
    }
  }

  const hasWinner = maxVal > 0;
  return {
    value: hasWinner ? maxVal : 0,
    winners: hasWinner ? winners : [],
  };
}

function addLondonDay(dayKey: string, delta: number): string {
  const [year, month, day] = dayKey.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + delta, 12)).toISOString().slice(0, 10);
}

function inclusiveLondonDays(fromKey: string, toKey: string): number {
  if (toKey < fromKey) return 0;
  const from = Date.parse(`${fromKey}T12:00:00Z`);
  const to = Date.parse(`${toKey}T12:00:00Z`);
  return Math.round((to - from) / 86_400_000) + 1;
}

/** Calendar days as table leader / last, after each UK matchday. Ties share the day. */
export function countLeagueTableDays(
  standings: PlayerStanding[],
  scoringMatches: MatchPointsEntry[],
  now: Date = new Date()
): { top: Map<string, number>; bottom: Map<string, number> } {
  const top = new Map(standings.map((player) => [player.id, 0]));
  const bottom = new Map(standings.map((player) => [player.id, 0]));
  if (standings.length === 0) return { top, bottom };

  const byDay = new Map<string, MatchPointsEntry[]>();
  for (const entry of scoringMatches) {
    if (entry.match.homeGoals == null || entry.match.awayGoals == null) continue;
    const day = sweepstakeLondonDayKey(entry.match.utcDate);
    const bucket = byDay.get(day);
    if (bucket) bucket.push(entry);
    else byDay.set(day, [entry]);
  }

  const matchdays = [...byDay.keys()].sort();
  if (matchdays.length === 0) return { top, bottom };

  const totals = Object.fromEntries(standings.map((player) => [player.id, 0]));
  const snapshots: { day: string; topIds: string[]; bottomIds: string[] }[] = [];

  for (const day of matchdays) {
    for (const entry of byDay.get(day)!) {
      for (const player of standings) {
        totals[player.id] += entry.byPlayer[player.id] ?? 0;
      }
    }
    const scores = standings.map((player) => totals[player.id]);
    const best = Math.max(...scores);
    const worst = Math.min(...scores);
    snapshots.push({
      day,
      topIds: best === worst ? [] : standings.filter((player) => totals[player.id] === best).map((player) => player.id),
      bottomIds:
        best === worst ? [] : standings.filter((player) => totals[player.id] === worst).map((player) => player.id),
    });
  }

  const today = sweepstakeLondonDayKey(now.toISOString());
  for (let index = 0; index < snapshots.length; index += 1) {
    const snapshot = snapshots[index];
    const nextDay = snapshots[index + 1]?.day;
    const until = nextDay ? addLondonDay(nextDay, -1) : today;
    const days = inclusiveLondonDays(snapshot.day, until);
    if (days <= 0) continue;
    increment(top, snapshot.topIds, days);
    increment(bottom, snapshot.bottomIds, days);
  }

  return { top, bottom };
}

export function computeSweepstakeAwards(
  standings: PlayerStanding[],
  scoringMatches: MatchPointsEntry[],
  options?: { now?: Date }
): SweepstakeAwardResult[] {
  const stats = {
    redCards: new Map<string, number>(),
    boringDraws: new Map<string, number>(),
    cleanSheets: new Map<string, number>(),
    goalsScored3Plus: new Map<string, number>(),
    goalsConceded3Plus: new Map<string, number>(),
    losses: new Map<string, number>(),
    draws: new Map<string, number>(),
    goalsFor: new Map<string, number>(),
    goalsAgainst: new Map<string, number>(),
  };

  for (const player of standings) {
    stats.redCards.set(player.id, player.redCards);
    stats.draws.set(player.id, player.draws);
    stats.losses.set(player.id, player.losses);
    stats.goalsFor.set(player.id, player.goalsFor);
    stats.goalsAgainst.set(player.id, player.goalsAgainst);
    stats.boringDraws.set(player.id, 0);
    stats.cleanSheets.set(player.id, 0);
    stats.goalsScored3Plus.set(player.id, 0);
    stats.goalsConceded3Plus.set(player.id, 0);
  }

  const tableDays = countLeagueTableDays(standings, scoringMatches, options?.now);

  for (const entry of scoringMatches) {
    const { match } = entry;
    if (match.homeGoals == null || match.awayGoals == null) continue;

    const hGoals = match.homeGoals;
    const aGoals = match.awayGoals;
    const homeManagerIds = managersForTeam(standings, match.homeTeam.tla);
    const awayManagerIds = managersForTeam(standings, match.awayTeam.tla);

    if (hGoals === 0 && aGoals === 0) {
      increment(stats.boringDraws, [...homeManagerIds, ...awayManagerIds]);
    }

    if (hGoals > 0 && aGoals === 0) {
      increment(stats.cleanSheets, homeManagerIds);
    }
    if (aGoals > 0 && hGoals === 0) {
      increment(stats.cleanSheets, awayManagerIds);
    }

    if (hGoals >= 3) {
      increment(stats.goalsScored3Plus, homeManagerIds);
      increment(stats.goalsConceded3Plus, awayManagerIds);
    }
    if (aGoals >= 3) {
      increment(stats.goalsScored3Plus, awayManagerIds);
      increment(stats.goalsConceded3Plus, homeManagerIds);
    }
  }

  const mapForAward: Record<SweepstakeStatAwardId, Map<string, number>> = {
    'days-at-top': tableDays.top,
    'days-at-bottom': tableDays.bottom,
    'red-cards': stats.redCards,
    'least-red-cards': stats.redCards,
    'boring-draws': stats.boringDraws,
    'clean-sheets': stats.cleanSheets,
    'goals-scored-3plus': stats.goalsScored3Plus,
    'goals-conceded-3plus': stats.goalsConceded3Plus,
    losses: stats.losses,
    draws: stats.draws,
    'goals-for': stats.goalsFor,
    'goals-against': stats.goalsAgainst,
  };

  return SWEEPSTAKE_AWARDS_CONFIG.flatMap((award) => {
    if (award.kind === 'honorary' || award.id === 'sexiest-slut-drop') {
      const winner = standings.find((player) => player.id === award.winnerPlayerId);
      if (!winner) return [];
      return [{ ...award, value: 1, winners: [winner] }];
    }
    const leaders = leadersFromMap(standings, mapForAward[award.id], award.direction ?? 'max');
    return [{ ...award, ...leaders }];
  });
}

export function awardWinnerLabel(winners: PlayerStanding[]): string {
  return winners.map((winner) => winner.teamName ?? winner.name).join(' & ');
}
