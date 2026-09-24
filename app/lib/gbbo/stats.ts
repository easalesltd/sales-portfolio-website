import {
  activeBakersAtWeek,
  bakerEliminatedIn,
  bakerName,
  companionsOwningBaker,
  scoreCompanionWeek,
  scoreEpisodeForBaker,
  teamForWeek,
} from "./league";
import { WEEK_THEMES } from "./seed";
import type { LeagueState, ScoreLine } from "./types";
import { teamWindow } from "./window";

export type BakerWeekCard = {
  week: number;
  theme: string;
  title: string;
  points: number;
  lines: ScoreLine[];
};

export type BakerLedger = {
  bakerId: string;
  name: string;
  photo: string;
  job: string;
  hometown: string;
  eliminatedInWeek: number | null;
  points: number;
  plus: number;
  minus: number;
  weeks: BakerWeekCard[];
  drops: number;
  cries: number;
  handshakes: number;
  innuendos: number;
  starBaker: number;
  technicalFirst: number;
  technicalPodium: number;
  technicalLast: number;
  owners: string[];
};

export type FunnyStat = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  names: string[];
  value: string;
};

function publishedEpisodes(league: LeagueState) {
  return league.episodes.filter((episode) => episode.published).sort((a, b) => a.week - b.week);
}

export function bakerLedger(league: LeagueState, bakerId: string): BakerLedger {
  const baker = league.bakers.find((item) => item.id === bakerId);
  const weeks: BakerWeekCard[] = [];
  let drops = 0;
  let cries = 0;
  let handshakes = 0;
  let innuendos = 0;
  let starBaker = 0;
  let technicalFirst = 0;
  let technicalPodium = 0;
  let technicalLast = 0;

  for (const episode of publishedEpisodes(league)) {
    const lines = scoreEpisodeForBaker(league, episode, bakerId);
    const points = lines.reduce((sum, line) => sum + line.points, 0);
    drops += episode.drops[bakerId] ?? 0;
    cries += episode.cries[bakerId] ?? 0;
    if (episode.handshakes.includes(bakerId)) handshakes += 1;
    if (episode.innuendos.includes(bakerId)) innuendos += 1;
    if (episode.starBakerId === bakerId) starBaker += 1;
    if (baker?.eliminatedInWeek && baker.eliminatedInWeek < episode.week) continue;
    const field = activeBakersAtWeek(league, episode.week).length;
    const place = episode.technical.find((entry) => entry.bakerId === bakerId)?.place;
    if (place === 1) technicalFirst += 1;
    if (place && place <= 3) technicalPodium += 1;
    if (place === field) technicalLast += 1;
    weeks.push({
      week: episode.week,
      theme: episode.theme || WEEK_THEMES[episode.week - 1] || `Week ${episode.week}`,
      title: episode.title,
      points,
      lines,
    });
  }

  const plus = weeks.flatMap((week) => week.lines).filter((line) => line.points > 0).reduce((sum, line) => sum + line.points, 0);
  const minus = weeks.flatMap((week) => week.lines).filter((line) => line.points < 0).reduce((sum, line) => sum + line.points, 0);

  return {
    bakerId,
    name: baker?.name ?? bakerName(league, bakerId),
    photo: baker?.photo ?? "",
    job: baker?.job ?? "",
    hometown: baker?.hometown ?? "",
    eliminatedInWeek: bakerEliminatedIn(league, bakerId),
    points: plus + minus,
    plus,
    minus,
    weeks,
    drops,
    cries,
    handshakes,
    innuendos,
    starBaker,
    technicalFirst,
    technicalPodium,
    technicalLast,
    owners: companionsOwningBaker(
      league,
      bakerId,
      teamWindow(new Date(), league.totalWeeks).week,
    ).map((companion) => companion.name),
  };
}

export function bakerLedgers(league: LeagueState): BakerLedger[] {
  return league.bakers
    .map((baker) => bakerLedger(league, baker.id))
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
}

export function bakerScoreSummary(ledger: BakerLedger): string {
  if (ledger.weeks.length === 0 && ledger.points === 0) {
    return `${ledger.name} has not troubled the scorers. Invisible, or lucky.`;
  }
  const bits: string[] = [];
  if (ledger.starBaker) bits.push(`Star Baker ${ledger.starBaker === 1 ? "once" : `${ledger.starBaker} times`}`);
  if (ledger.handshakes) bits.push(`${ledger.handshakes} Hollywood handshake${ledger.handshakes === 1 ? "" : "s"}`);
  if (ledger.innuendos) bits.push(`${ledger.innuendos} Nigella innuendo${ledger.innuendos === 1 ? "" : "s"}`);
  if (ledger.technicalFirst) bits.push("won a technical");
  if (ledger.technicalLast) bits.push(`coming last in the technical ${ledger.technicalLast === 1 ? "once" : `${ledger.technicalLast} times`}`);
  if (ledger.drops) bits.push(`dropping ${ledger.drops === 1 ? "something" : `${ledger.drops} things`}`);
  if (ledger.cries) bits.push(`crying`);
  if (bits.length === 0) return `${ledger.name} is on ${ledger.points}.`;
  const list = bits.length === 1 ? bits[0] : `${bits.slice(0, -1).join(", ")} and ${bits.at(-1)}`;
  return `${ledger.name} scored ${ledger.points} for ${list}.`;
}

export type CategoryBar = { label: string; points: number };

export function bakerCategoryBars(ledger: BakerLedger): CategoryBar[] {
  const buckets = new Map<string, number>();
  for (const week of ledger.weeks) {
    for (const line of week.lines) {
      const label = line.label.includes("handshake")
        ? "Handshakes"
        : line.label.includes("Nigella")
          ? "Nigella"
          : line.label.includes("Star Baker")
            ? "Star Baker"
            : line.label.includes("technical")
              ? "Technical"
              : line.label.includes("dropped")
                ? "Drops"
                : line.label.includes("cried")
                  ? "Tears"
                  : line.label.includes("eliminated")
                    ? "Sent home"
                    : "Extras";
      buckets.set(label, (buckets.get(label) ?? 0) + line.points);
    }
  }
  return [...buckets.entries()]
    .map(([label, points]) => ({ label, points }))
    .sort((a, b) => Math.abs(b.points) - Math.abs(a.points));
}

function topBy<T>(rows: T[], score: (row: T) => number, name: (row: T) => string) {
  if (rows.length === 0) return { names: [] as string[], value: 0 };
  const best = Math.max(...rows.map(score));
  if (best <= 0) return { names: [], value: 0 };
  return { names: rows.filter((row) => score(row) === best).map(name), value: best };
}

function bottomBy<T>(rows: T[], score: (row: T) => number, name: (row: T) => string) {
  if (rows.length === 0) return { names: [] as string[], value: 0 };
  const worst = Math.min(...rows.map(score));
  return { names: rows.filter((row) => score(row) === worst).map(name), value: worst };
}

export function funnyLeagueStats(league: LeagueState): FunnyStat[] {
  const ledgers = bakerLedgers(league);
  if (ledgers.every((row) => row.weeks.length === 0)) return [];

  const clumsy = topBy(ledgers, (row) => row.drops, (row) => row.name);
  const tears = topBy(ledgers, (row) => row.cries, (row) => row.name);
  const hollywood = topBy(ledgers, (row) => row.handshakes, (row) => row.name);
  const nigella = topBy(ledgers, (row) => row.innuendos, (row) => row.name);
  const glory = topBy(ledgers, (row) => row.points, (row) => row.name);
  const liability = bottomBy(ledgers, (row) => row.points, (row) => row.name);
  const shared = topBy(ledgers, (row) => row.owners.length, (row) => row.name);
  const peasant = topBy(ledgers, (row) => row.technicalLast, (row) => row.name);
  const ghost = ledgers.filter((row) => row.points === 0 && !row.eliminatedInWeek && row.weeks.every((week) => week.lines.length === 0));
  const disaster = topBy(ledgers, (row) => row.drops + row.cries + row.technicalLast, (row) => row.name);

  const companions = league.companions.map((companion) => {
    const bakerIds = new Set(
      publishedEpisodes(league).flatMap((episode) => teamForWeek(league, companion.id, episode.week)),
    );
    const bakers = [...bakerIds].map((id) => bakerLedger(league, id));
    return {
      name: companion.name,
      drops: bakers.reduce((sum, baker) => sum + baker.drops, 0),
      cries: bakers.reduce((sum, baker) => sum + baker.cries, 0),
      points: bakers.reduce((sum, baker) => sum + baker.points, 0),
    };
  });
  const wettestTent = topBy(companions, (row) => row.cries, (row) => row.name);
  const clumsiestTent = topBy(companions, (row) => row.drops, (row) => row.name);

  const stats: FunnyStat[] = [];
  const join = (names: string[]) =>
    names.length <= 1 ? names[0] ?? "Nobody" : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;

  if (glory.names.length) {
    stats.push({
      id: "glory",
      eyebrow: "Flavour of the week",
      title: join(glory.names),
      body: "Most points scored in the tent so far. Hollywood would pretend not to be impressed.",
      names: glory.names,
      value: `${glory.value > 0 ? "+" : ""}${glory.value}`,
    });
  }
  if (liability.names.length) {
    stats.push({
      id: "liability",
      eyebrow: "Soggy bottom of the class",
      title: join(liability.names),
      body: "Fewest points. If they were a cake, they would be in the bin and Paul would be pointing at them.",
      names: liability.names,
      value: String(liability.value),
    });
  }
  if (clumsy.names.length) {
    stats.push({
      id: "drops",
      eyebrow: "Butterfingers",
      title: join(clumsy.names),
      body: "Most things sent to the floor. Gravity is their only consistent technical.",
      names: clumsy.names,
      value: `${clumsy.value} drop${clumsy.value === 1 ? "" : "s"}`,
    });
  }
  if (tears.names.length) {
    stats.push({
      id: "cries",
      eyebrow: "The waterworks",
      title: join(tears.names),
      body: "Most cries. Salt is a seasoning. They are over-seasoning.",
      names: tears.names,
      value: `${tears.value} ${tears.value === 1 ? "cry" : "cries"}`,
    });
  }
  if (hollywood.names.length) {
    stats.push({
      id: "handshake",
      eyebrow: "Hollywood's pet",
      title: join(hollywood.names),
      body: "Most handshakes. Paul has briefly become a human being.",
      names: hollywood.names,
      value: String(hollywood.value),
    });
  }
  if (nigella.names.length) {
    stats.push({
      id: "nigella",
      eyebrow: "Nigella's type",
      title: join(nigella.names),
      body: "Most naughty innuendos. The tent is not a family show and Nigella knows it.",
      names: nigella.names,
      value: String(nigella.value),
    });
  }
  if (peasant.names.length) {
    stats.push({
      id: "technical",
      eyebrow: "Technical peasant",
      title: join(peasant.names),
      body: "Last in the technical the most times. They must bake it, and the village will watch.",
      names: peasant.names,
      value: String(peasant.value),
    });
  }
  if (shared.names.length && shared.value > 1) {
    stats.push({
      id: "shared",
      eyebrow: "Passed around the tent",
      title: join(shared.names),
      body: "In the most companion sides at once. Popular, or nobody could agree who was worse.",
      names: shared.names,
      value: `${shared.value} tents`,
    });
  }
  if (disaster.names.length && disaster.value > 0) {
    stats.push({
      id: "disaster",
      eyebrow: "Walking health and safety breach",
      title: join(disaster.names),
      body: "Drops, tears and last-place technicals added together. Do not give them a hot tray.",
      names: disaster.names,
      value: String(disaster.value),
    });
  }
  if (ghost.length) {
    stats.push({
      id: "ghost",
      eyebrow: "The invisible bake",
      title: join(ghost.map((row) => row.name)),
      body: "Still in the tent and yet to score a single event. They may be a hologram.",
      names: ghost.map((row) => row.name),
      value: "0",
    });
  }
  if (clumsiestTent.names.length) {
    stats.push({
      id: "clumsy-tent",
      eyebrow: "Clumsiest companion",
      title: join(clumsiestTent.names),
      body: "Their bakers have dropped the most things. The floor is part of the team.",
      names: clumsiestTent.names,
      value: String(clumsiestTent.value),
    });
  }
  if (wettestTent.names.length) {
    stats.push({
      id: "wet-tent",
      eyebrow: "Dampest companion",
      title: join(wettestTent.names),
      body: "Their bakers have cried the most. Bring a tea towel, and not for the washing up.",
      names: wettestTent.names,
      value: String(wettestTent.value),
    });
  }

  const tearsPerPoint = ledgers
    .filter((row) => row.cries > 0)
    .map((row) => ({ name: row.name, rate: row.points / row.cries, cries: row.cries }));
  if (tearsPerPoint.length) {
    const worst = tearsPerPoint.reduce((a, b) => (a.rate <= b.rate ? a : b));
    stats.push({
      id: "tear-rate",
      eyebrow: "Points per sob",
      title: worst.name,
      body: "The worst return on crying. The tears are not even helping.",
      names: [worst.name],
      value: `${worst.rate.toFixed(1)} pts/cry`,
    });
  }

  return stats;
}

export type ChargeSheetRow = {
  week: number;
  theme: string;
  bakerId: string;
  baker: string;
  label: string;
  points: number;
};

export function chargeSheet(league: LeagueState): ChargeSheetRow[] {
  return publishedEpisodes(league).flatMap((episode) =>
    league.bakers.flatMap((baker) =>
      scoreEpisodeForBaker(league, episode, baker.id).map((line) => ({
        week: episode.week,
        theme: episode.theme || WEEK_THEMES[episode.week - 1] || `Week ${episode.week}`,
        bakerId: baker.id,
        baker: baker.name,
        label: line.label,
        points: line.points,
      })),
    ),
  );
}

export function companionForm(league: LeagueState) {
  return league.companions
    .map((companion) => {
      const weeks = publishedEpisodes(league).map((episode) => {
        const score = scoreCompanionWeek(league, companion.id, episode.week);
        return {
          week: episode.week,
          theme: episode.theme || WEEK_THEMES[episode.week - 1] || `Week ${episode.week}`,
          points: score.points,
          raw: score.rawPoints,
          joker: score.joker,
        };
      });
      return {
        companionId: companion.id,
        name: companion.name,
        weeks,
        total: weeks.reduce((sum, week) => sum + week.points, 0),
      };
    })
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
}


