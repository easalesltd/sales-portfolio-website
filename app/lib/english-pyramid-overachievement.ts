import {
  getDraftBand,
  getPreSeasonOddsRank,
  getPreSeasonTablePlace,
} from '@/app/data/english-pyramid-fantasy';
import type { PlayerStanding } from '@/app/lib/english-pyramid-scoring';

export type DraftBand = 'title' | 'survival';

export type DraftClubRow = {
  code: string;
  name: string;
  managerId: string;
  managerName: string;
  teamName: string | null;
  band: DraftBand;
  rank: number;
  slotIndex: number;
  slotLabel: string;
  expectedPlace: number | null;
  points: number;
  played: number;
  ppg: number;
};

export type DraftSlotAverage = {
  slotIndex: number;
  slotLabel: string;
  band: DraftBand;
  rank: number;
  clubs: number;
  avgPpg: number;
  totalPoints: number;
  played: number;
};

export type ManagerBandSplit = {
  managerId: string;
  managerName: string;
  teamName: string | null;
  titlePpg: number;
  survivalPpg: number;
  titlePoints: number;
  survivalPoints: number;
  dogsAhead: boolean;
};

export type DraftOverachievement = {
  playedAny: boolean;
  titlePpg: number;
  survivalPpg: number;
  titlePoints: number;
  survivalPoints: number;
  ppgDelta: number;
  dogsOverachieving: boolean;
  slots: DraftSlotAverage[];
  managers: ManagerBandSplit[];
  punchingUp: DraftClubRow[];
};

const SLOT_COUNT = 14;

/** Title #1 → 0 (left, strongest). Survival R#1 → 13 (right, weakest). */
export function draftStrengthSlotIndex(band: DraftBand, rank: number): number {
  if (band === 'title') return rank - 1;
  return 7 + (7 - rank);
}

export function draftSlotLabel(band: DraftBand, rank: number): string {
  return band === 'title' ? `T${rank}` : `R${rank}`;
}

/** Human label: Title #1, Dog #1 (biggest relegation favourite). */
export function draftSlotPlainLabel(band: DraftBand, rank: number): string {
  return band === 'title' ? `Title #${rank}` : `Dog #${rank}`;
}

function ppgOf(points: number, played: number): number {
  return played > 0 ? points / played : 0;
}

function bandTotals(clubs: DraftClubRow[], band: DraftBand): { points: number; played: number; ppg: number } {
  let points = 0;
  let played = 0;
  for (const club of clubs) {
    if (club.band !== band) continue;
    points += club.points;
    played += club.played;
  }
  return { points, played, ppg: ppgOf(points, played) };
}

export function flattenDraftClubs(standings: PlayerStanding[]): DraftClubRow[] {
  const rows: DraftClubRow[] = [];
  for (const player of standings) {
    for (const team of player.teamBreakdown) {
      const band = getDraftBand(team.code);
      const rank = getPreSeasonOddsRank(team.code);
      if (band == null || rank == null) continue;
      rows.push({
        code: team.code,
        name: team.name,
        managerId: player.id,
        managerName: player.name,
        teamName: player.teamName,
        band,
        rank,
        slotIndex: draftStrengthSlotIndex(band, rank),
        slotLabel: draftSlotLabel(band, rank),
        expectedPlace: getPreSeasonTablePlace(team.code),
        points: team.points,
        played: team.playedMatches,
        ppg: ppgOf(team.points, team.playedMatches),
      });
    }
  }
  return rows;
}

function emptySlots(): DraftSlotAverage[] {
  return Array.from({ length: SLOT_COUNT }, (_, slotIndex) => {
    const band: DraftBand = slotIndex < 7 ? 'title' : 'survival';
    const rank = band === 'title' ? slotIndex + 1 : 14 - slotIndex;
    return {
      slotIndex,
      slotLabel: draftSlotLabel(band, rank),
      band,
      rank,
      clubs: 0,
      avgPpg: 0,
      totalPoints: 0,
      played: 0,
    };
  });
}

export function buildDraftOverachievement(standings: PlayerStanding[]): DraftOverachievement {
  const clubs = flattenDraftClubs(standings);
  const title = bandTotals(clubs, 'title');
  const survival = bandTotals(clubs, 'survival');
  const slots = emptySlots();

  for (const club of clubs) {
    const slot = slots[club.slotIndex];
    if (!slot) continue;
    slot.clubs += 1;
    slot.totalPoints += club.points;
    slot.played += club.played;
  }
  for (const slot of slots) {
    slot.avgPpg = ppgOf(slot.totalPoints, slot.played);
  }

  const managers: ManagerBandSplit[] = standings.map((player) => {
    const owned = clubs.filter((club) => club.managerId === player.id);
    const titleBand = bandTotals(owned, 'title');
    const survivalBand = bandTotals(owned, 'survival');
    return {
      managerId: player.id,
      managerName: player.name,
      teamName: player.teamName,
      titlePpg: titleBand.ppg,
      survivalPpg: survivalBand.ppg,
      titlePoints: titleBand.points,
      survivalPoints: survivalBand.points,
      dogsAhead: survivalBand.ppg > titleBand.ppg,
    };
  });
  managers.sort((a, b) => b.survivalPpg - b.titlePpg - (a.survivalPpg - a.titlePpg));

  const punchingUp = clubs
    .filter(
      (club) =>
        club.band === 'survival' &&
        club.played > 0 &&
        title.played > 0 &&
        club.ppg > title.ppg
    )
    .sort((a, b) => b.ppg - a.ppg || b.points - a.points);

  return {
    playedAny: clubs.some((club) => club.played > 0),
    titlePpg: title.ppg,
    survivalPpg: survival.ppg,
    titlePoints: title.points,
    survivalPoints: survival.points,
    ppgDelta: survival.ppg - title.ppg,
    dogsOverachieving: title.played > 0 && survival.played > 0 && survival.ppg > title.ppg,
    slots,
    managers,
    punchingUp,
  };
}

export function formatPpg(value: number): string {
  return value.toFixed(2);
}

/** Shared bar scale so one manager's 2.53 is visibly longer than another's 1.30. */
export function managerBandChartMax(managers: readonly ManagerBandSplit[]): number {
  if (managers.length === 0) return 0.01;
  return Math.max(...managers.flatMap((row) => [row.titlePpg, row.survivalPpg]), 0.01);
}
