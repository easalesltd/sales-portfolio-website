/** Playable Sales Agent Dash venues — keep in sync with menu / spawn logic. */
export const GAME_LEVEL_IDS = ['road', 'nec', 'harrogate'] as const;
export type GameLevelId = (typeof GAME_LEVEL_IDS)[number];

export function isGameLevelId(value: string): value is GameLevelId {
  return (GAME_LEVEL_IDS as readonly string[]).includes(value);
}
