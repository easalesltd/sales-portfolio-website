import { bakerIdForName, companionIdForName } from "./identity";
import type { Baker, EpisodeScore, LeagueState } from "./types";

export const SERIES_17_BAKERS: Omit<Baker, "id" | "eliminatedInWeek">[] = [
  { name: "Clara", age: 24, bio: "Portuguese marketing graduate from Hertfordshire" },
  { name: "Connie", age: 63, bio: "London's Cake Lady, after 20 years with the NHS" },
  { name: "Danni", age: 25, bio: "Dorset forager at an HGV service centre" },
  { name: "Gabe", age: 32, bio: "West Midlands costume designer and drag king" },
  { name: "Gary", age: 67, bio: "Nottinghamshire smallholder and precise baker" },
  { name: "Molly", age: 31, bio: "London accessibility reviewer and theatre fan" },
  { name: "Moyin", age: 22, bio: "Essex student, sprinter and macaron devotee" },
  { name: "Mo", age: 21, bio: "West Midlands law student" },
  { name: "Nikki", age: 50, bio: "London baker who treats the kitchen as therapy" },
  { name: "Shannon", age: 29, bio: "Gloucestershire foodie chasing a little forest magic" },
  { name: "Tom", age: 25, bio: "West Yorkshire salon stylist and northern diva" },
  { name: "Yannis", age: 28, bio: "London NICU doctor and bhangra dancer" },
];

export const WEEK_THEMES = [
  "Cake",
  "Biscuits",
  "Bread",
  "Desserts",
  "Pastry",
  "Botanical",
  "Caramel",
  "Pâtisserie",
  "Semi-final",
  "Final",
];

export function emptyEpisode(week: number, totalWeeks: number): EpisodeScore {
  const theme = WEEK_THEMES[week - 1] ?? `Week ${week}`;
  return {
    week,
    title: week === totalWeeks ? "The Final" : `Episode ${week}`,
    theme,
    deadline: "",
    published: false,
    starBakerId: null,
    eliminatedBakerId: null,
    technical: [],
    handshakes: [],
    innuendos: [],
    drops: {},
    cries: {},
    adHoc: [],
    recapSource: "",
    recapNotes: "",
  };
}

export const COMPANIONS = ["Dave", "Cowie", "Guns", "Shuker", "Lee", "Nest"] as const;

export function createCompanions() {
  return COMPANIONS.map((name, index) => ({
    id: companionIdForName(name),
    name,
    lastYearPlace: index + 1,
    isChief: name === "Dave",
    isDraftMaster: name === "Dave",
  }));
}

export function createEmptyLeague(): LeagueState {
  const companions = createCompanions();
  const bakers = SERIES_17_BAKERS.map((baker) => ({
    ...baker,
    id: bakerIdForName(baker.name),
    eliminatedInWeek: null,
  }));
  return {
    name: "The Companions' Tent",
    seriesYear: 2026,
    currentWeek: 1,
    totalWeeks: 10,
    companions,
    bakers,
    draftRankings: Object.fromEntries(
      companions.map((companion) => [companion.id, bakers.map((baker) => baker.id)]),
    ),
    draftComplete: false,
    initialTeams: [],
    substitutions: [],
    jokers: [],
    episodes: Array.from({ length: 10 }, (_, index) => emptyEpisode(index + 1, 10)),
    adHocRules: [],
    penalties: [],
  };
}

export function createDemoLeague(): LeagueState {
  return createEmptyLeague();
}
