import { gbboSlug } from "./identity";
import { finalSecretsRevealed } from "./final-secrets";
import {
  bakerName,
  companionName,
  companionPortrait,
  companionTotals,
  episodeTheme,
  parseTechnicalPodium,
  podiumBakerNames,
  punishmentExhibits,
  scoreTechnicalPodium,
  teamForWeek,
  technicalPodiumFromEpisode,
  technicalPodiumPrediction,
  technicalPenaltyTarget,
  weeklyLastPlace,
} from "./league";
import { funnyLeagueStats, type FunnyStat } from "./stats";
import type { Companion, LeagueState } from "./types";

export type PodiumRevealRow = {
  companionId: string;
  name: string;
  photo: string;
  /** Flat "A, B and C" for copy / tests. */
  guessed: string | null;
  /** Explicit 1st / 2nd / 3rd baker names from the sealed vote. */
  guessedPlaces: [string, string, string] | null;
  hit: boolean;
  points: number;
  bakerPick: string;
  rankWithBonus: number;
  rankWithoutBonus: number;
  swungTable: boolean;
};

export type WeekTape = {
  id: string;
  label: string;
  src: string | null;
  photo: boolean;
};

export type WeekPunishment = {
  id: string;
  companionName: string;
  kind: "slut_drop" | "beer_baguette" | "technical";
  status: "on tape" | "owed" | "photo in";
  tape: WeekTape | null;
};

export type WeekReel = {
  week: number;
  title: string;
  theme: string;
  starBaker: string | null;
  eliminated: string | null;
  woodenSpoon: string[];
  woodenPoints: number;
  mustBake: string[];
  /** @deprecated Prefer `crimewatch` — kept for older callers/tests. */
  punishments: string[];
  tapes: WeekTape[];
  crimewatch: WeekPunishment[];
};

export type SeasonUnwrappedModel = {
  ready: boolean;
  seasonTitle: string;
  actualPodium: string | null;
  actualPlaces: [string, string, string] | null;
  podiumRows: PodiumRevealRow[];
  /** Companions who locked the exact technical 1-2-3. */
  podiumHits: PodiumRevealRow[];
  weeks: WeekReel[];
  funny: FunnyStat[];
  champion: { companion: Companion; points: number; photo: string } | null;
  woodenSpoon: { companion: Companion; points: number; photo: string } | null;
  table: Array<{ companionId: string; name: string; points: number; photo: string; place: number }>;
};

function rankMap(rows: Array<{ companionId: string; points: number }>): Map<string, number> {
  const sorted = [...rows].sort(
    (a, b) => b.points - a.points || a.companionId.localeCompare(b.companionId),
  );
  const ranks = new Map<string, number>();
  sorted.forEach((row, index) => ranks.set(row.companionId, index + 1));
  return ranks;
}

export function buildSeasonUnwrapped(
  league: LeagueState,
  opts: { preview?: boolean } = {},
): SeasonUnwrappedModel {
  const week = league.totalWeeks;
  const final = league.episodes.find((episode) => episode.week === week);
  const ready = Boolean(final?.published) || Boolean(opts.preview);
  const totals = companionTotals(league);
  const withRanks = rankMap(totals);

  const withoutBonus = totals.map((row) => {
    const podium = scoreTechnicalPodium(league, row.companionId, week);
    const bonus = podium && podium.points > 0 ? podium.points : 0;
    return { companionId: row.companionId, points: row.points - bonus };
  });
  const withoutRanks = rankMap(withoutBonus);

  const actualIds = final ? technicalPodiumFromEpisode(final) : null;
  const actualPlaces = actualIds
    ? ([bakerName(league, actualIds[0]), bakerName(league, actualIds[1]), bakerName(league, actualIds[2])] as [
        string,
        string,
        string,
      ])
    : null;
  const actualPodium = actualIds ? podiumBakerNames(league, actualIds) : null;

  const podiumRows: PodiumRevealRow[] = league.companions
    .map((companion) => {
      const pick = technicalPodiumPrediction(league, companion.id, week);
      const guessedIds = pick ? parseTechnicalPodium(pick) : null;
      const line = scoreTechnicalPodium(league, companion.id, week);
      const hit = Boolean(line && line.points > 0);
      const bakerPick = teamForWeek(league, companion.id, week)
        .map((id) => bakerName(league, id))
        .join(" · ");
      const rankWithBonus = withRanks.get(companion.id) ?? 0;
      const rankWithoutBonus = withoutRanks.get(companion.id) ?? 0;
      const guessedPlaces = guessedIds
        ? ([bakerName(league, guessedIds[0]), bakerName(league, guessedIds[1]), bakerName(league, guessedIds[2])] as [
            string,
            string,
            string,
          ])
        : null;
      return {
        companionId: companion.id,
        name: companion.name,
        photo: companionPortrait(companion, false),
        guessed: guessedIds ? podiumBakerNames(league, guessedIds) : null,
        guessedPlaces,
        hit,
        points: line?.points ?? 0,
        bakerPick: bakerPick || "No baker locked",
        rankWithBonus,
        rankWithoutBonus,
        swungTable: rankWithBonus !== rankWithoutBonus,
      };
    })
    .sort((a, b) => {
      // Hits first — the unwrapped reveal is "who got it right", then everyone else's sealed vote.
      if (a.hit !== b.hit) return a.hit ? -1 : 1;
      return a.rankWithBonus - b.rankWithBonus || a.name.localeCompare(b.name);
    });
  const podiumHits = podiumRows.filter((row) => row.hit);

  const wooden = weeklyLastPlace(league);
  const exhibits = punishmentExhibits(league);
  const weeks: WeekReel[] = league.episodes
    .filter((episode) => episode.published)
    .sort((a, b) => a.week - b.week)
    .map((episode) => {
      const spoon = wooden.find((row) => row.week === episode.week);
      const target = technicalPenaltyTarget(league, episode);
      const weekExhibits = exhibits.filter((item) => item.week === episode.week);
      const crimewatch: WeekPunishment[] = weekExhibits.map((item) => {
        const who = companionName(league, item.companionId);
        const kindLabel =
          item.kind === "slut_drop"
            ? "slut drop"
            : item.kind === "beer_baguette"
              ? "beer baguette"
              : "technical bake";
        const status: WeekPunishment["status"] = !item.src
          ? "owed"
          : item.kind === "technical"
            ? "photo in"
            : "on tape";
        const tape: WeekTape | null = item.src
          ? {
              id: item.id,
              label: `${who} · ${kindLabel}`,
              src: item.src,
              photo: item.photo,
            }
          : null;
        return {
          id: item.id,
          companionName: who,
          kind: item.kind,
          status,
          tape,
        };
      });
      const punishments = crimewatch.map((item) => {
        const kindLabel =
          item.kind === "slut_drop"
            ? "slut drop"
            : item.kind === "beer_baguette"
              ? "beer baguette"
              : "technical bake";
        return `${item.companionName}: ${kindLabel} ${item.status}`;
      });
      const tapes = crimewatch.flatMap((item) => (item.tape ? [item.tape] : []));
      return {
        week: episode.week,
        title: episode.title,
        theme: episodeTheme(league, episode.week) || episode.theme,
        starBaker: episode.starBakerId ? bakerName(league, episode.starBakerId) : null,
        eliminated: episode.eliminatedBakerId ? bakerName(league, episode.eliminatedBakerId) : null,
        woodenSpoon: spoon?.holders.map((holder) => companionName(league, holder.companionId)) ?? [],
        woodenPoints: spoon?.points ?? 0,
        mustBake: target?.owners.map((owner) => owner.name) ?? [],
        punishments,
        tapes,
        crimewatch,
      };
    });

  const championRow = totals[0] ?? null;
  const woodenRow = totals.at(-1) ?? null;
  const championCompanion = championRow
    ? league.companions.find((item) => item.id === championRow.companionId) ?? null
    : null;
  const woodenCompanion = woodenRow
    ? league.companions.find((item) => item.id === woodenRow.companionId) ?? null
    : null;

  return {
    ready,
    seasonTitle: league.name || "Companion League 2026",
    actualPodium,
    actualPlaces,
    podiumRows,
    podiumHits,
    weeks,
    funny: funnyLeagueStats(league).slice(0, 8),
    champion: championCompanion && championRow
      ? {
          companion: championCompanion,
          points: championRow.points,
          photo: companionPortrait(championCompanion, false),
        }
      : null,
    woodenSpoon: woodenCompanion && woodenRow
      ? {
          companion: woodenCompanion,
          points: woodenRow.points,
          photo: companionPortrait(woodenCompanion, true),
        }
      : null,
    table: totals.map((row, index) => {
      const companion = league.companions.find((item) => item.id === row.companionId);
      return {
        companionId: row.companionId,
        name: companionName(league, row.companionId),
        points: row.points,
        photo: companionPortrait(companion, index === totals.length - 1),
        place: index + 1,
      };
    }),
  };
}

/** True when this companion's Final baker / 1-2-3 may be shown. */
export function canViewFinalPick(
  league: LeagueState,
  companionId: string,
  opts: { isChief: boolean; playerSlug: string | null },
): boolean {
  if (finalSecretsRevealed(league)) return true;
  if (opts.isChief) return true;
  if (!opts.playerSlug) return false;
  const companion = league.companions.find((item) => item.id === companionId);
  return Boolean(companion && gbboSlug(companion.name) === gbboSlug(opts.playerSlug));
}

export { finalSecretsRevealed };
