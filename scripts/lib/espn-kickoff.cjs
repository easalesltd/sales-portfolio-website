/**
 * Resolve effective kick-off times when ESPN reports a delayed or moved start.
 */

const KICKOFF_DRIFT_THRESHOLD_MS = 15 * 60 * 1000;

function normalizeEspnEventDate(raw) {
  if (!raw) return null;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function isEspnDelayedStatus(statusName, statusState) {
  const name = String(statusName || '').toUpperCase();
  const state = String(statusState || '').toLowerCase();
  return name.includes('DELAY') || name.includes('POSTPON') || state === 'delayed';
}

function resolveEffectiveKickoff(scheduledUtcDate, espnMatch) {
  const scheduled = new Date(scheduledUtcDate);
  if (Number.isNaN(scheduled.getTime())) {
    throw new Error(`Invalid scheduled utcDate: ${scheduledUtcDate}`);
  }

  const espnKickoff = espnMatch?.utcDate ? new Date(espnMatch.utcDate) : null;
  if (!espnKickoff || Number.isNaN(espnKickoff.getTime())) {
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
    effectiveUtcDate: isDelayed ? espnMatch.utcDate : scheduledUtcDate,
    scheduledUtcDate,
    delayMinutes,
    isDelayed,
    espnKickoff: espnMatch.utcDate,
  };
}

function isFixtureDueByKickoff(effectiveUtcDate, now, updateDelayMinutes, dueLeadMinutes = 0) {
  const kickoff = new Date(effectiveUtcDate);
  if (Number.isNaN(kickoff.getTime())) return false;

  const dueAt = kickoff.getTime() + updateDelayMinutes * 60 * 1000;
  return dueAt <= now.getTime() + dueLeadMinutes * 60 * 1000;
}

function shouldLookupEspnKickoff(scheduledUtcDate, now, updateDelayMinutes) {
  const scheduled = new Date(scheduledUtcDate);
  if (Number.isNaN(scheduled.getTime())) return false;

  const lookupStart = scheduled.getTime() - 2 * 60 * 60 * 1000;
  const lookupEnd = scheduled.getTime() + (updateDelayMinutes + 360) * 60 * 1000;
  return now.getTime() >= lookupStart && now.getTime() <= lookupEnd;
}

function formatKickoffDelayNote(kickoffInfo) {
  if (!kickoffInfo?.isDelayed || !kickoffInfo.espnKickoff) return '';

  return ` delayed ${kickoffInfo.delayMinutes}m (ESPN kick-off ${kickoffInfo.espnKickoff})`;
}

module.exports = {
  KICKOFF_DRIFT_THRESHOLD_MS,
  formatKickoffDelayNote,
  isEspnDelayedStatus,
  isFixtureDueByKickoff,
  normalizeEspnEventDate,
  resolveEffectiveKickoff,
  shouldLookupEspnKickoff,
};
