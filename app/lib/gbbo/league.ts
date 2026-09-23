import { uid } from "./ids";
import type {
  Baker,
  Companion,
  CompanionWeekScore,
  EpisodeScore,
  LeagueState,
  Penalty,
  ScoreLine,
  SlutDrop,
  Substitution,
} from "./types";
import { episodeStartsAt } from "./window";

export function activeBakersAtWeek(league: LeagueState, week: number): Baker[] {
  return league.bakers.filter(
    (baker) => baker.eliminatedInWeek === null || baker.eliminatedInWeek >= week,
  );
}

export function teamSizeForWeek(league: LeagueState, week: number): number {
  if (week > league.totalWeeks - 2) return 1;
  if (activeBakersAtWeek(league, week).length <= 6) return 2;
  return 3;
}

export function draftOrder(companions: Companion[]): Companion[] {
  return [...companions].sort((a, b) => b.lastYearPlace - a.lastYearPlace);
}

export function bakerStillIn(league: LeagueState, bakerId: string, week: number): boolean {
  const baker = league.bakers.find((item) => item.id === bakerId);
  if (!baker) return false;
  return baker.eliminatedInWeek === null || baker.eliminatedInWeek >= week;
}

export function bakerEliminatedIn(league: LeagueState, bakerId: string): number | null {
  const baker = league.bakers.find((item) => item.id === bakerId);
  if (baker?.eliminatedInWeek) return baker.eliminatedInWeek;
  return league.episodes.find((episode) => episode.published && episode.eliminatedBakerId === bakerId)?.week ?? null;
}

export function runDraft(league: LeagueState): { teams: { companionId: string; bakerIds: string[] }[]; leftoverNotes: string[] } {
  const leftoverNotes = [
    "Week 1 teams are each companion's top three preferences. The same baker may sit in more than one tent — with six companions, that is the only way everyone can field three bakers.",
  ];

  const teams = league.companions.map((companion) => {
    const ranking = league.draftRankings[companion.id] ?? league.bakers.map((baker) => baker.id);
    return { companionId: companion.id, bakerIds: ranking.slice(0, 3) };
  });

  return { teams, leftoverNotes };
}

export function bakerName(league: LeagueState, bakerId: string | null): string {
  if (!bakerId) return "Unknown baker";
  return league.bakers.find((baker) => baker.id === bakerId)?.name ?? "Unknown baker";
}

export function companionName(league: LeagueState, companionId: string): string {
  return league.companions.find((companion) => companion.id === companionId)?.name ?? "Companion";
}

export function carriedTeam(league: LeagueState, companionId: string, week: number): string[] {
  if (week <= 1) {
    return (league.initialTeams.find((team) => team.companionId === companionId)?.bakerIds ?? []).filter((bakerId) =>
      bakerStillIn(league, bakerId, week),
    );
  }
  return teamForWeek(league, companionId, week - 1).filter((bakerId) => bakerStillIn(league, bakerId, week));
}

export function teamForWeek(league: LeagueState, companionId: string, week: number): string[] {
  const size = teamSizeForWeek(league, week);
  let roster = carriedTeam(league, companionId, week);
  const change = league.substitutions.find((sub) => sub.companionId === companionId && sub.week === week);
  if (change) {
    roster = roster.filter((id) => id !== change.outBakerId);
    if (change.inBakerId && bakerStillIn(league, change.inBakerId, week) && !roster.includes(change.inBakerId)) {
      roster.push(change.inBakerId);
    }
  }
  return roster.slice(0, size);
}

export function lineupChanges(previous: string[], next: string[]): number {
  const kept = next.filter((id) => previous.includes(id)).length;
  return next.length - kept;
}

export function selectableBakers(league: LeagueState, week: number): Baker[] {
  return activeBakersAtWeek(league, week);
}

export function jokerForCompanion(league: LeagueState, companionId: string): { week: number; autoApplied: boolean } | null {
  return league.jokers.find((joker) => joker.companionId === companionId) ?? null;
}

export function ruleApproved(league: LeagueState, ruleId: string): boolean {
  const rule = league.adHocRules.find((item) => item.id === ruleId);
  if (!rule) return false;
  const votes = Object.values(rule.votes);
  if (league.companions.length === 0 || votes.length === 0) return false;
  const yes = votes.filter((vote) => vote === "yes").length;
  return yes / league.companions.length >= 2 / 3;
}

export function technicalPoints(place: number, fieldSize: number): number {
  let points = 0;
  if (place === 1) points += 3;
  if (place === 2) points += 2;
  if (place === 3) points += 1;
  if (place === fieldSize) points -= 3;
  if (place === fieldSize - 1) points -= 2;
  if (place === fieldSize - 2) points -= 1;
  return points;
}

export function scoreEpisodeForBaker(league: LeagueState, episode: EpisodeScore, bakerId: string): ScoreLine[] {
  const lines: ScoreLine[] = [];
  const baker = bakerName(league, bakerId);

  if (episode.handshakes.includes(bakerId)) {
    lines.push({ label: `${baker} received a Hollywood handshake`, bakerId, points: 5, kind: "plus" });
  }
  if (episode.innuendos.includes(bakerId)) {
    lines.push({ label: `${baker} shared a naughty innuendo with Nigella`, bakerId, points: 5, kind: "plus" });
  }
  if (episode.starBakerId === bakerId) {
    lines.push({ label: `${baker} was Star Baker`, bakerId, points: 5, kind: "plus" });
  }

  const fieldSize = activeBakersAtWeek(league, episode.week).length;
  const technical = episode.technical.find((entry) => entry.bakerId === bakerId);
  if (technical) {
    const points = technicalPoints(technical.place, fieldSize);
    if (points !== 0) {
      lines.push({
        label: `${baker} finished ${ordinal(technical.place)} in the technical`,
        bakerId,
        points,
        kind: points > 0 ? "plus" : "minus",
      });
    }
  }

  if (episode.eliminatedBakerId === bakerId) {
    lines.push({ label: `${baker} was eliminated`, bakerId, points: -5, kind: "minus" });
  }

  const drops = episode.drops[bakerId] ?? 0;
  if (drops > 0) {
    lines.push({
      label: `${baker} dropped something ${drops} ${drops === 1 ? "time" : "times"}`,
      bakerId,
      points: -3 * drops,
      kind: "minus",
    });
  }

  const cries = episode.cries[bakerId] ?? 0;
  if (cries > 0) {
    lines.push({
      label: `${baker} cried ${cries} ${cries === 1 ? "time" : "times"}`,
      bakerId,
      points: -3 * cries,
      kind: "minus",
    });
  }

  for (const award of episode.adHoc) {
    if (award.bakerId !== bakerId) continue;
    const rule = league.adHocRules.find((item) => item.id === award.ruleId);
    if (!rule || !ruleApproved(league, rule.id)) continue;
    lines.push({
      label: `${baker}: ${rule.description}${award.note ? ` (${award.note})` : ""}`,
      bakerId,
      points: rule.points,
      kind: rule.points >= 0 ? "plus" : "minus",
    });
  }

  return lines;
}

export function scoreCompanionWeek(league: LeagueState, companionId: string, week: number): CompanionWeekScore {
  const episode = league.episodes.find((item) => item.week === week);
  const bakerIds = teamForWeek(league, companionId, week);
  const lines = episode ? bakerIds.flatMap((bakerId) => scoreEpisodeForBaker(league, episode, bakerId)) : [];
  const rawPoints = lines.reduce((sum, line) => sum + line.points, 0);
  const joker = league.jokers.some((item) => item.companionId === companionId && item.week === week);
  return {
    companionId,
    week,
    bakerIds,
    lines,
    rawPoints,
    joker,
    points: joker ? rawPoints * 2 : rawPoints,
  };
}

export function sideConfirmed(league: LeagueState, companionId: string, week: number): boolean {
  return (league.sideConfirmations ?? []).some((item) => item.companionId === companionId && item.week === week);
}

export function slutDropsOf(league: LeagueState): SlutDrop[] {
  return league.slutDrops ?? [];
}

export function slutDropFor(league: LeagueState, companionId: string, week: number): SlutDrop | undefined {
  return slutDropsOf(league).find((item) => item.companionId === companionId && item.week === week);
}

export function owesSlutDrop(league: LeagueState, companionId: string, week: number): boolean {
  const episode = league.episodes.find((item) => item.week === week);
  if (!episode?.published) return false;
  return lowestScorersForWeek(league, week).some((score) => score.companionId === companionId);
}

export function slutDropWeeksFor(league: LeagueState, companionId: string): number[] {
  return league.episodes
    .filter((episode) => owesSlutDrop(league, companionId, episode.week))
    .map((episode) => episode.week)
    .sort((a, b) => a - b);
}

export function outstandingSlutDropWeek(league: LeagueState, companionId: string): number | null {
  return slutDropWeeksFor(league, companionId).find((week) => !slutDropFor(league, companionId, week)?.completed) ?? null;
}

export function latestSlutDropWeek(league: LeagueState, companionId: string): number | null {
  const weeks = slutDropWeeksFor(league, companionId);
  return weeks.at(-1) ?? null;
}

export function slutDropVideoSrc(drop: SlutDrop): string | null {
  return drop.videoId ? `/api/gbbo-league/video?id=${encodeURIComponent(drop.videoId)}` : null;
}

export function penaltyVideoSrc(penalty: Penalty): string | null {
  return penalty.videoId ? `/api/gbbo-league/video?id=${encodeURIComponent(penalty.videoId)}` : null;
}

export function resetVideolessSlutDrops(league: LeagueState): boolean {
  let changed = false;
  for (const drop of league.slutDrops ?? []) {
    if (drop.completed && !drop.videoId) {
      drop.completed = false;
      drop.completedAt = null;
      changed = true;
    }
  }
  return changed;
}

export function applySlutDropEscalations(league: LeagueState, now = new Date()): boolean {
  let changed = false;
  league.slutDrops = league.slutDrops ?? [];
  league.penalties = league.penalties ?? [];
  for (const episode of league.episodes.filter((item) => item.published)) {
    for (const holder of lowestScorersForWeek(league, episode.week)) {
      if (league.slutDrops.some((item) => item.week === episode.week && item.companionId === holder.companionId)) {
        continue;
      }
      league.slutDrops.push({
        week: episode.week,
        companionId: holder.companionId,
        completed: false,
        completedAt: null,
        videoId: null,
        escalated: false,
      });
      changed = true;
    }
  }
  for (const drop of league.slutDrops) {
    if (drop.escalated) continue;
    if (!owesSlutDrop(league, drop.companionId, drop.week)) continue;
    const nextWeek = drop.week + 1;
    if (nextWeek > league.totalWeeks) continue;
    const deadline = episodeStartsAt(nextWeek);
    if (now < deadline) continue;
    const doneInTime =
      drop.completed &&
      Boolean(drop.videoId) &&
      Boolean(drop.completedAt) &&
      new Date(drop.completedAt as string) < deadline;
    if (doneInTime) continue;
    drop.escalated = true;
    changed = true;
    const already = league.penalties.some(
      (penalty) =>
        penalty.kind === "beer_baguette" &&
        penalty.companionId === drop.companionId &&
        penalty.week === drop.week &&
        penalty.note.includes("slut drop"),
    );
    if (already) continue;
    const name = companionName(league, drop.companionId);
    league.penalties.push({
      id: uid("pen"),
      week: drop.week,
      companionId: drop.companionId,
      bakerId: "",
      kind: "beer_baguette",
      deadline: "",
      completed: false,
      videoId: null,
      note: `${name} missed the slut drop before the next episode, so a filmed Beer Baguette is now also owed.`,
    });
  }
  return changed;
}

export function lowestScorersForWeek(league: LeagueState, week: number): CompanionWeekScore[] {
  const scores = league.companions.map((companion) => scoreCompanionWeek(league, companion.id, week));
  if (scores.length === 0) return [];
  const lowest = Math.min(...scores.map((score) => score.points));
  return scores.filter((score) => score.points === lowest);
}

export function companionTotals(league: LeagueState): { companionId: string; points: number; weeks: CompanionWeekScore[] }[] {
  return league.companions.map((companion) => {
    const weeks = league.episodes
      .filter((episode) => episode.published)
      .map((episode) => scoreCompanionWeek(league, companion.id, episode.week));
    return {
      companionId: companion.id,
      points: weeks.reduce((sum, week) => sum + week.points, 0),
      weeks,
    };
  }).sort((a, b) => b.points - a.points || companionName(league, a.companionId).localeCompare(companionName(league, b.companionId)));
}

export function companionInDisgrace(league: LeagueState, companionId: string): boolean {
  const table = companionTotals(league);
  if (table.length === 0) return false;
  const lowest = Math.min(...table.map((row) => row.points));
  return table.some((row) => row.companionId === companionId && row.points === lowest);
}

export function companionPortrait(companion: Companion | undefined, disgrace = false): string {
  if (!companion) return "";
  if (disgrace && companion.disgracePhoto) return companion.disgracePhoto;
  return companion.photo || "";
}

export function lowestTechnicalBaker(episode: EpisodeScore): string | null {
  if (episode.technical.length === 0) return null;
  return [...episode.technical].sort((a, b) => b.place - a.place)[0]?.bakerId ?? null;
}

export function companionsOwningBaker(league: LeagueState, bakerId: string, week: number): Companion[] {
  return league.companions.filter((companion) => teamForWeek(league, companion.id, week).includes(bakerId));
}

export function companionOwningBaker(league: LeagueState, bakerId: string, week: number): Companion | null {
  return companionsOwningBaker(league, bakerId, week)[0] ?? null;
}

export function neededAutoDrops(league: LeagueState, week: number): Substitution[] {
  const size = teamSizeForWeek(league, week);
  const drops: Substitution[] = [];
  for (const companion of league.companions) {
    const roster = teamForWeek(league, companion.id, week);
    if (roster.length <= size) continue;
    const alreadyHandled = league.substitutions.some(
      (sub) => sub.companionId === companion.id && sub.week === week,
    );
    if (alreadyHandled) continue;
    drops.push({
      id: `auto_${companion.id}_${week}`,
      week,
      companionId: companion.id,
      outBakerId: roster[roster.length - 1],
      inBakerId: null,
      autoByChief: true,
    });
  }
  return drops;
}

export function episodeScoringLines(league: LeagueState, episode: EpisodeScore): string[] {
  const lines: string[] = [];
  const name = (id: string | null) => bakerName(league, id);
  const field = activeBakersAtWeek(league, episode.week).length;

  if (episode.starBakerId) lines.push(`${name(episode.starBakerId)} was Star Baker (+5).`);
  else lines.push("No Star Baker was awarded.");

  if (episode.eliminatedBakerId) lines.push(`${name(episode.eliminatedBakerId)} left the tent (−5).`);
  else lines.push("Nobody went home.");

  const technical = [...episode.technical].sort((a, b) => a.place - b.place);
  for (const entry of technical) {
    const points = technicalPoints(entry.place, field);
    if (points === 0) continue;
    lines.push(`${name(entry.bakerId)} finished ${ordinal(entry.place)} in the technical (${points > 0 ? "+" : ""}${points}).`);
  }

  for (const bakerId of episode.handshakes) {
    lines.push(`${name(bakerId)} received a Hollywood handshake (+5).`);
  }
  for (const bakerId of episode.innuendos) {
    lines.push(`${name(bakerId)} shared a naughty innuendo with Nigella (+5).`);
  }
  for (const [bakerId, count] of Object.entries(episode.drops)) {
    if (count > 0) lines.push(`${name(bakerId)} dropped something ${count === 1 ? "once" : `${count} times`} (${-3 * count}).`);
  }
  for (const [bakerId, count] of Object.entries(episode.cries)) {
    if (count > 0) lines.push(`${name(bakerId)} cried ${count === 1 ? "once" : `${count} times`} (${-3 * count}).`);
  }

  return lines;
}

export function publishEpisode(league: LeagueState, week: number): void {
  const row = league.episodes.find((item) => item.week === week);
  if (!row) return;
  row.published = true;
  if (row.eliminatedBakerId) {
    const baker = league.bakers.find((item) => item.id === row.eliminatedBakerId);
    if (baker) baker.eliminatedInWeek = week;
  }
  league.jokers = league.jokers.filter((joker) => joker.week !== week || !joker.autoApplied);
  if (week === 4) {
    for (const companion of league.companions) {
      if (!league.jokers.some((joker) => joker.companionId === companion.id)) {
        league.jokers.push({ companionId: companion.id, week: 4, autoApplied: true });
      }
    }
  }
  const last = lowestTechnicalBaker(row);
  const owners = last ? companionsOwningBaker(league, last, week) : [];
  league.penalties = league.penalties.filter(
    (penalty) => penalty.week !== week || (penalty.kind === "beer_baguette" && penalty.note.includes("slut drop")),
  );
  if (last) {
    for (const owner of owners) {
      league.penalties.push({
        id: uid("pen"),
        week,
        companionId: owner.id,
        bakerId: last,
        kind: "technical",
        deadline: row.deadline,
        completed: false,
        note: `${owner.name} must bake this week's technical because ${bakerName(league, last)} came last.`,
        videoId: null,
      });
    }
  }
  for (const drop of neededAutoDrops(league, Math.min(week + 1, league.totalWeeks))) {
    if (!league.substitutions.some((sub) => sub.companionId === drop.companionId && sub.week === drop.week)) {
      league.substitutions.push(drop);
    }
  }
  league.slutDrops = league.slutDrops ?? [];
  const holders = lowestScorersForWeek(league, week);
  league.slutDrops = league.slutDrops.filter((item) => {
    if (item.week !== week) return true;
    return holders.some((holder) => holder.companionId === item.companionId);
  });
  for (const holder of holders) {
    if (!league.slutDrops.some((item) => item.week === week && item.companionId === holder.companionId)) {
      league.slutDrops.push({
        week,
        companionId: holder.companionId,
        completed: false,
        completedAt: null,
        videoId: null,
        escalated: false,
      });
    }
  }
  league.currentWeek = Math.min(week + 1, league.totalWeeks);
}

export function ordinal(value: number): string {
  const remainder = value % 100;
  if (remainder >= 11 && remainder <= 13) return `${value}th`;
  switch (value % 10) {
    case 1:
      return `${value}st`;
    case 2:
      return `${value}nd`;
    case 3:
      return `${value}rd`;
    default:
      return `${value}th`;
  }
}
