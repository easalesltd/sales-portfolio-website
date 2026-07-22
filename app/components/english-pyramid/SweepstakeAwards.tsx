'use client';

import { useMemo } from 'react';
import type { PlayerStanding, MatchPointsEntry } from '@/app/lib/english-pyramid-scoring';
import { useSweepstakeTheme } from '@/app/components/SweepstakeThemeContext';
import { teamCodeMatches } from '@/app/data/english-pyramid-fantasy';
import { managerColorForPlayer } from '@/app/lib/sweepstake-manager-colors';

type Props = {
  standings: PlayerStanding[];
  scoringMatches: MatchPointsEntry[];
};

type Award = {
  id: string;
  title: string;
  emoji: string;
  statLabel: string;
  description: string;
};

const AWARDS_CONFIG: Award[] = [
  {
    id: 'red-cards',
    title: 'Most passionate Dirty Bastard Award',
    emoji: '🟥',
    statLabel: 'Red Cards',
    description: 'For the manager whose squad treats the pitch like a cage fight. Thanks to the pyramid rules, these leg-breakers actually earn them points.',
  },
  {
    id: 'boring-draws',
    title: 'The Sleep Merchant',
    emoji: '😴',
    statLabel: '0–0 Draws',
    description: 'Refusing to score, refusing to concede, and refusing to entertain. Their teams specialize in defensive lockouts, costing -1 point each time.',
  },
  {
    id: 'clean-sheets',
    title: 'Bus Parking Inspector',
    emoji: '🛡️',
    statLabel: 'Clean Sheets',
    description: 'Masters of the defensive dark arts. Ten men behind the ball, shameless time-wasting, and zero goals conceded. Professional party poopers.',
  },
  {
    id: 'goals-scored-3plus',
    title: 'The Gung-Ho Gladiator',
    emoji: '🔥',
    statLabel: '3+ Goal Matches',
    description: 'All attack, zero concern for defending. Only knows how to run forward, racking up +1 point bonuses while leaving their own back door wide open.',
  },
  {
    id: 'goals-conceded-3plus',
    title: 'The Leaky Bucket',
    emoji: '🗑️',
    statLabel: '3+ Conceded',
    description: 'Defending like dizzy toddlers chasing a balloon. Conceding 3 or more goals in a single game to lose a point. Training is clearly optional.',
  },
  {
    id: 'losses',
    title: 'The Wooden Spoon',
    emoji: '🥄',
    statLabel: 'Total Defeats',
    description: 'Winning matches is hard, but losing this consistently takes real dedication. For the manager whose clubs are the ultimate charity cases of the pyramid.',
  },
  {
    id: 'draws',
    title: 'The Scrap Merchant',
    emoji: '🍀',
    statLabel: 'Total Draws',
    description: 'Winning is overrated when you can draw your way to safety. Masters of scraping late equalizers and grinding out ugly points to avoid defeat.',
  },
  {
    id: 'goals-for',
    title: 'The Goal Machine',
    emoji: '⚽',
    statLabel: 'Total Goals',
    description: 'Whose clubs just cannot stop putting the ball in the net. Defense? Never heard of her. They just want goals, goals, and more goals.',
  },
  {
    id: 'goals-against',
    title: 'Heavy Baggage Award',
    emoji: '🧳',
    statLabel: 'Goals Conceded',
    description: 'Carrying the heaviest defensive baggage in the entire league. Their goalkeepers have back pain from constantly picking the ball out of the net.',
  },
];

export default function SweepstakeAwards({ standings, scoringMatches }: Props) {
  const t = useSweepstakeTheme();

  const awardsData = useMemo(() => {
    // 1. Initialise player stat trackers
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

    // Prepopulate maps with all players in standings
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

    // Helper to find which manager(s) own a team TLA in the draft pool
    const getManagersForTeam = (tla: string): string[] => {
      const ids: string[] = [];
      for (const player of standings) {
        if (player.teams.some((code) => teamCodeMatches(tla, code))) {
          ids.push(player.id);
        }
      }
      return ids;
    };

    // 2. Scan finished matches to compute match-specific achievements
    for (const entry of scoringMatches) {
      const { match } = entry;
      if (match.homeGoals == null || match.awayGoals == null) continue;

      const hGoals = match.homeGoals;
      const aGoals = match.awayGoals;

      const homeManagerIds = getManagersForTeam(match.homeTeam.tla);
      const awayManagerIds = getManagersForTeam(match.awayTeam.tla);

      // Boring 0-0 Draws
      if (hGoals === 0 && aGoals === 0) {
        for (const id of [...homeManagerIds, ...awayManagerIds]) {
          stats.boringDraws.set(id, (stats.boringDraws.get(id) || 0) + 1);
        }
      }

      // Clean Sheets (Goals Conceded = 0, Goals Scored > 0)
      if (hGoals > 0 && aGoals === 0) {
        for (const id of homeManagerIds) {
          stats.cleanSheets.set(id, (stats.cleanSheets.get(id) || 0) + 1);
        }
      }
      if (aGoals > 0 && hGoals === 0) {
        for (const id of awayManagerIds) {
          stats.cleanSheets.set(id, (stats.cleanSheets.get(id) || 0) + 1);
        }
      }

      // 3+ goals scored
      if (hGoals >= 3) {
        for (const id of homeManagerIds) {
          stats.goalsScored3Plus.set(id, (stats.goalsScored3Plus.get(id) || 0) + 1);
        }
      }
      if (aGoals >= 3) {
        for (const id of awayManagerIds) {
          stats.goalsScored3Plus.set(id, (stats.goalsScored3Plus.get(id) || 0) + 1);
        }
      }

      // 3+ goals conceded
      if (aGoals >= 3) {
        for (const id of homeManagerIds) {
          stats.goalsConceded3Plus.set(id, (stats.goalsConceded3Plus.get(id) || 0) + 1);
        }
      }
      if (hGoals >= 3) {
        for (const id of awayManagerIds) {
          stats.goalsConceded3Plus.set(id, (stats.goalsConceded3Plus.get(id) || 0) + 1);
        }
      }

      // We no longer track flat-track wins since it was replaced by total losses (pre-aggregated on PlayerStanding)
    }

    // 3. Select winners for each award type
    return AWARDS_CONFIG.map((award) => {
      let mapToUse: Map<string, number>;
      switch (award.id) {
        case 'red-cards':
          mapToUse = stats.redCards;
          break;
        case 'boring-draws':
          mapToUse = stats.boringDraws;
          break;
        case 'clean-sheets':
          mapToUse = stats.cleanSheets;
          break;
        case 'goals-scored-3plus':
          mapToUse = stats.goalsScored3Plus;
          break;
        case 'goals-conceded-3plus':
          mapToUse = stats.goalsConceded3Plus;
          break;
        case 'losses':
          mapToUse = stats.losses;
          break;
        case 'draws':
          mapToUse = stats.draws;
          break;
        case 'goals-for':
          mapToUse = stats.goalsFor;
          break;
        case 'goals-against':
          mapToUse = stats.goalsAgainst;
          break;
        default:
          mapToUse = new Map();
      }

      let maxVal = -1;
      let winners: PlayerStanding[] = [];

      for (const player of standings) {
        const val = mapToUse.get(player.id) || 0;
        if (val > maxVal) {
          maxVal = val;
          winners = [player];
        } else if (val === maxVal && val > 0) {
          winners.push(player);
        }
      }

      const hasWinner = maxVal > 0;

      return {
        ...award,
        value: hasWinner ? maxVal : 0,
        winners: hasWinner ? winners : [],
      };
    });
  }, [standings, scoringMatches]);

  const hasMatches = scoringMatches.length > 0;

  return (
    <section aria-labelledby="sweepstake-awards-title" className="mt-6">
      <h3 id="sweepstake-awards-title" className={`mb-3 ${t.c.sectionHeading}`}>
        Stats Corner &amp; Awards
      </h3>
      {!hasMatches ? (
        <div className={`${t.c.squadCard} p-4 text-center text-xs text-neutral-400 sm:text-sm`}>
          Awards will fill in once the first league matches are played and stats are recorded.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {awardsData.map((award) => {
            const hasWinners = award.winners.length > 0;
            return (
              <article
                key={award.id}
                className={`${t.c.squadCard} flex flex-col justify-between overflow-hidden p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-2xl" role="img" aria-hidden="true">
                        {award.emoji}
                      </span>
                      <h4 className="mt-1 text-sm font-bold text-white leading-tight">
                        {award.title}
                      </h4>
                    </div>
                    {hasWinners ? (
                      <span className={`text-xl font-black tabular-nums ${t.c.points}`}>
                        {award.value}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-neutral-500 uppercase">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-neutral-400 leading-normal">
                    {award.description}
                  </p>
                </div>
                <div className="mt-4 border-t border-neutral-800/60 pt-2.5">
                  <span className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">
                    {hasWinners ? 'Leader(s)' : 'Status'}
                  </span>
                  <div className="mt-0.5 min-w-0 truncate">
                    {hasWinners ? (
                      award.winners.map((winner, idx) => {
                        const color = managerColorForPlayer(winner.id, t.id);
                        return (
                          <span key={winner.id} className="inline text-xs font-semibold">
                            {idx > 0 ? <span className="text-neutral-500"> &amp; </span> : null}
                            <span style={color ? { color } : undefined}>
                              {winner.teamName ?? winner.name}
                            </span>
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-xs font-medium text-neutral-400">
                        Pending league fixtures
                      </span>
                    )}
                  </div>
                  {hasWinners && (
                    <span className="mt-0.5 block text-[10px] text-neutral-500">
                      {award.value} {award.statLabel.toLowerCase()}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
