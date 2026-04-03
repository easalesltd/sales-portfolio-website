import { Filter } from 'bad-words';

/**
 * Replaces blocked words with `*` (per-word, via `bad-words`).
 * If nothing readable remains, falls back to `Anonymous`.
 */
const filter = new Filter({ placeHolder: '*' });

export function redactLeaderboardDisplayName(name: string, maxLen: number): string {
  const t = name.trim().slice(0, maxLen);
  if (!t) return 'Anonymous';

  let out = filter.isProfane(t) ? filter.clean(t) : t;
  out = out.trim().slice(0, maxLen);

  const visible = out.replace(/\*/g, '').trim();
  if (!visible || !/[\p{L}\p{N}._-]/u.test(visible)) return 'Anonymous';

  return out;
}
