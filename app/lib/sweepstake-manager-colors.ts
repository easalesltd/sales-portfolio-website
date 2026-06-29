import type { SweepstakeFantasyThemeId } from './sweepstake-fantasy-theme';

/** Distinct, readable manager colours — aligned with progress-chart palette per game. */
const WORLD_CUP_MANAGER_COLORS: Record<string, string> = {
  ash: '#2dd4bf',
  jon: '#84cc16',
  nest: '#38bdf8',
  chris: '#facc15',
  scott: '#f43f5e',
  dave: '#c084fc',
  ben: '#fb923c',
};

const ENGLISH_PYRAMID_MANAGER_COLORS: Record<string, string> = {
  ash: '#d4af37',
  jon: '#60a5fa',
  nest: '#c084fc',
  chris: '#facc15',
  scott: '#f43f5e',
  dave: '#a3e635',
  ben: '#2dd4bf',
};

export function managerColorForPlayer(
  playerId: string,
  themeId: SweepstakeFantasyThemeId
): string | undefined {
  const map =
    themeId === 'english-pyramid' ? ENGLISH_PYRAMID_MANAGER_COLORS : WORLD_CUP_MANAGER_COLORS;
  return map[playerId];
}
