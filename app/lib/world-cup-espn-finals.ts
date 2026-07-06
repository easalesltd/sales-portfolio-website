import type { EspnParsedEvent } from '@/app/lib/world-cup-espn-scoreboard';

export function isEspnFullTimePeriod(period: string): boolean {
  const normalized = period.trim().toLowerCase();
  if (!normalized) return false;

  return (
    normalized === 'ft' ||
    normalized === 'full time' ||
    normalized === 'final' ||
    normalized.startsWith('status_full') ||
    /^full.?time\b/.test(normalized) ||
    /\bft\b/.test(normalized)
  );
}

export function isEspnFinalPeriod(
  period: string,
  status?: { statusState?: string; statusName?: string }
): boolean {
  const state = String(status?.statusState || '').toLowerCase();
  if (state === 'post') return true;

  const statusName = String(status?.statusName || '').toUpperCase();
  if (statusName.includes('FULL_TIME') || statusName.includes('FINAL')) return true;

  const normalized = period.trim().toLowerCase();
  if (!normalized) return false;
  if (isEspnFullTimePeriod(period)) return true;

  return (
    normalized === 'ft-pens' ||
    normalized.includes('after pen') ||
    (normalized.includes('pen') &&
      (normalized.includes('ft') || normalized.includes('final') || normalized.includes('score')))
  );
}

export function resolveLedgerGoalsFromEspnMatch(
  espnMatch: Pick<
    EspnParsedEvent,
    'homeGoals' | 'awayGoals' | 'homeWinner' | 'awayWinner'
  >,
  isKnockout: boolean
): { homeGoals: number; awayGoals: number } | null {
  let homeGoals = espnMatch.homeGoals;
  let awayGoals = espnMatch.awayGoals;

  if (isKnockout && homeGoals === awayGoals) {
    const homeWinner = espnMatch.homeWinner === true;
    const awayWinner = espnMatch.awayWinner === true;

    if (homeWinner && !awayWinner) {
      homeGoals = awayGoals + 1;
    } else if (awayWinner && !homeWinner) {
      awayGoals = homeGoals + 1;
    } else {
      return null;
    }
  }

  if (isKnockout && homeGoals === awayGoals) {
    return null;
  }

  return { homeGoals, awayGoals };
}
