const KICKOFF_DRIFT_THRESHOLD_MS = 15 * 60 * 1000;

export type EspnKickoffSource = {
  utcDate: string | null;
  statusName?: string;
  statusState?: string;
};

export function normalizeEspnEventDate(raw: string | undefined): string | null {
  if (!raw) return null;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

export function isEspnDelayedStatus(statusName?: string, statusState?: string): boolean {
  const name = String(statusName || '').toUpperCase();
  const state = String(statusState || '').toLowerCase();
  return name.includes('DELAY') || name.includes('POSTPON') || state === 'delayed';
}

export type EffectiveKickoff = {
  effectiveUtcDate: string;
  scheduledUtcDate: string;
  delayMinutes: number;
  isDelayed: boolean;
  espnKickoff: string | null;
};

export function resolveEffectiveKickoff(
  scheduledUtcDate: string,
  espnMatch: EspnKickoffSource | null | undefined
): EffectiveKickoff {
  const scheduled = new Date(scheduledUtcDate);
  if (Number.isNaN(scheduled.getTime())) {
    throw new Error(`Invalid scheduled utcDate: ${scheduledUtcDate}`);
  }

  const espnKickoff = espnMatch?.utcDate ? new Date(espnMatch.utcDate) : null;
  if (!espnMatch || !espnMatch.utcDate || !espnKickoff || Number.isNaN(espnKickoff.getTime())) {
    return {
      effectiveUtcDate: scheduledUtcDate,
      scheduledUtcDate,
      delayMinutes: 0,
      isDelayed: false,
      espnKickoff: null,
    };
  }

  const driftMs = espnKickoff.getTime() - scheduled.getTime();
  const delayMinutes = Math.round(driftMs / 60000);
  const drifted = Math.abs(driftMs) >= KICKOFF_DRIFT_THRESHOLD_MS;
  const isDelayed =
    drifted &&
    (delayMinutes > 0 || isEspnDelayedStatus(espnMatch.statusName, espnMatch.statusState));

  return {
    effectiveUtcDate: isDelayed && espnMatch.utcDate ? espnMatch.utcDate : scheduledUtcDate,
    scheduledUtcDate,
    delayMinutes: Math.round(driftMs / 60000),
    isDelayed,
    espnKickoff: espnMatch.utcDate ?? null,
  };
}
