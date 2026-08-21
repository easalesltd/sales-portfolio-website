import type { MatchPointsEntry, PlayerStanding } from '@/app/lib/english-pyramid-scoring';
import { teamCodeMatches } from '@/app/data/english-pyramid-fantasy';

export type SweepstakeAwardId =
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

export type SweepstakeAwardDirection = 'max' | 'min';

export type SweepstakeAwardConfig = {
  id: SweepstakeAwardId;
  title: string;
  shortTitle: string;
  emoji: string;
  statLabel: string;
  description: string;
  direction?: SweepstakeAwardDirection;
};

export type SweepstakeAwardResult = SweepstakeAwardConfig & {
  value: number;
  winners: PlayerStanding[];
};

export const SWEEPSTAKE_AWARDS_CONFIG: readonly SweepstakeAwardConfig[] = [
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

export function computeSweepstakeAwards(
  standings: PlayerStanding[],
  scoringMatches: MatchPointsEntry[]
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

  const mapForAward: Record<SweepstakeAwardId, Map<string, number>> = {
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

  return SWEEPSTAKE_AWARDS_CONFIG.map((award) => {
    const leaders = leadersFromMap(standings, mapForAward[award.id], award.direction ?? 'max');
    return { ...award, ...leaders };
  });
}

export function awardWinnerLabel(winners: PlayerStanding[]): string {
  return winners.map((winner) => winner.teamName ?? winner.name).join(' & ');
}
