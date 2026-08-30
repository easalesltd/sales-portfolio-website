import {
  ENGLISH_PYRAMID_DIVISIONS,
  getDraftDivisionId,
} from '@/app/data/english-pyramid-fantasy';
import {
  flattenDraftClubs,
  formatPpg,
  type DraftClubRow,
} from '@/app/lib/english-pyramid-overachievement';
import type { MatchPointsEntry, PlayerStanding } from '@/app/lib/english-pyramid-scoring';
import { sweepstakeLondonDayKey } from '@/app/lib/sweepstake-datetime';

const DEAD_CLUBS_PER_MANAGER = 2;

export type DeadClub = {
  code: string;
  name: string;
  divisionId: string | null;
  points: number;
  played: number;
  ppg: number;
};

export type DeadClubRow = {
  managerId: string;
  managerName: string;
  teamName: string | null;
  clubs: DeadClub[];
};

export function buildDeadClubs(standings: PlayerStanding[]): DeadClubRow[] {
  return standings.map((player) => {
    const clubs = [...player.teamBreakdown]
      .filter((team) => team.playedMatches > 0)
      .sort(
        (a, b) =>
          a.points - b.points ||
          a.playedMatches - b.playedMatches ||
          a.name.localeCompare(b.name)
      )
      .slice(0, DEAD_CLUBS_PER_MANAGER)
      .map((team) => ({
        code: team.code,
        name: team.name,
        divisionId: getDraftDivisionId(team.code) ?? team.flag ?? null,
        points: team.points,
        played: team.playedMatches,
        ppg: team.playedMatches > 0 ? team.points / team.playedMatches : 0,
      }));
    return {
      managerId: player.id,
      managerName: player.name,
      teamName: player.teamName,
      clubs,
    };
  });
}

export type HeatmapDivision = { id: string; label: string };

export type HeatmapCell = {
  divisionId: string;
  points: number;
  played: number;
  ppg: number;
};

export type HeatmapRow = {
  managerId: string;
  managerName: string;
  teamName: string | null;
  cells: HeatmapCell[];
};

export type DivisionHeatmap = {
  divisions: HeatmapDivision[];
  rows: HeatmapRow[];
  minPpg: number;
  maxPpg: number;
};

export function buildDivisionHeatmap(standings: PlayerStanding[]): DivisionHeatmap {
  const divisions: HeatmapDivision[] = ENGLISH_PYRAMID_DIVISIONS.map((division) => ({
    id: division.id,
    label: division.id === 'NLN' ? 'Nn' : division.id === 'NLS' ? 'Ns' : division.id,
  }));

  const rows: HeatmapRow[] = standings.map((player) => {
    const cells = divisions.map((division) => {
      let points = 0;
      let played = 0;
      for (const team of player.teamBreakdown) {
        if (getDraftDivisionId(team.code) !== division.id) continue;
        points += team.points;
        played += team.playedMatches;
      }
      return {
        divisionId: division.id,
        points,
        played,
        ppg: played > 0 ? points / played : 0,
      };
    });
    return {
      managerId: player.id,
      managerName: player.name,
      teamName: player.teamName,
      cells,
    };
  });

  const live = rows.flatMap((row) => row.cells).filter((cell) => cell.played > 0);
  const ppgs = live.map((cell) => cell.ppg);
  return {
    divisions,
    rows,
    minPpg: ppgs.length ? Math.min(...ppgs) : 0,
    maxPpg: ppgs.length ? Math.max(...ppgs) : 1,
  };
}

export function heatmapCellTone(ppg: number, minPpg: number, maxPpg: number, played: number): string {
  if (played <= 0) return 'bg-[#0a0f1a] text-neutral-600';
  const span = Math.max(maxPpg - minPpg, 0.01);
  const t = (ppg - minPpg) / span;
  if (t >= 0.75) return 'bg-[#d4af37]/35 text-[#f5e2a3]';
  if (t >= 0.5) return 'bg-[#d4af37]/18 text-[#e8dfc8]';
  if (t >= 0.25) return 'bg-[#1a2744] text-[#e8dfc8]/85';
  return 'bg-[#3f1d24] text-[#f0c4cc]';
}

export type SeedFormClub = DraftClubRow & {
  seedAvg: number;
  delta: number;
};

export type SeedForm = {
  over: SeedFormClub[];
  under: SeedFormClub[];
};

export function buildSeedForm(standings: PlayerStanding[], limit = 5): SeedForm {
  const clubs = flattenDraftClubs(standings).filter((club) => club.played > 0);
  const bySlot = new Map<number, { points: number; played: number }>();
  for (const club of clubs) {
    const slot = bySlot.get(club.slotIndex) ?? { points: 0, played: 0 };
    slot.points += club.points;
    slot.played += club.played;
    bySlot.set(club.slotIndex, slot);
  }

  const ranked: SeedFormClub[] = clubs.map((club) => {
    const slot = bySlot.get(club.slotIndex) ?? { points: 0, played: 0 };
    const seedAvg = slot.played > 0 ? slot.points / slot.played : 0;
    return { ...club, seedAvg, delta: club.ppg - seedAvg };
  });

  const over = ranked
    .filter((club) => club.delta > 0)
    .sort((a, b) => b.delta - a.delta || b.ppg - a.ppg)
    .slice(0, limit);
  const under = ranked
    .filter((club) => club.delta < 0)
    .sort((a, b) => a.delta - b.delta || a.ppg - b.ppg)
    .slice(0, limit);

  return { over, under };
}

export type GapToFirstRow = {
  managerId: string;
  managerName: string;
  teamName: string | null;
  seasonPoints: number;
  seasonGap: number;
  matchdaysBehind: number | null;
  leading: boolean;
};

export type GapToFirst = {
  matchdays: number;
  typicalMatchday: number;
  rows: GapToFirstRow[];
} | null;

export function buildGapToFirst(
  standings: PlayerStanding[],
  scoringMatches: MatchPointsEntry[]
): GapToFirst {
  if (standings.length === 0 || scoringMatches.length === 0) return null;
  const matchdays = new Set(scoringMatches.map((entry) => sweepstakeLondonDayKey(entry.match.utcDate))).size;
  if (matchdays <= 0) return null;
  const typicalMatchday =
    standings.reduce((sum, player) => sum + player.points, 0) / standings.length / matchdays;
  const leaderPoints = Math.max(...standings.map((player) => player.points));

  const rows = standings
    .map((player) => {
      const seasonGap = leaderPoints - player.points;
      return {
        managerId: player.id,
        managerName: player.name,
        teamName: player.teamName,
        seasonPoints: player.points,
        seasonGap,
        matchdaysBehind: seasonGap === 0 || typicalMatchday <= 0 ? 0 : seasonGap / typicalMatchday,
        leading: seasonGap === 0,
      };
    })
    .sort((a, b) => a.seasonGap - b.seasonGap || b.seasonPoints - a.seasonPoints);

  return { matchdays, typicalMatchday, rows };
}

export function formatSignedPoints(value: number): string {
  if (value > 0) return `+${value}`;
  return String(value);
}

export { formatPpg };
