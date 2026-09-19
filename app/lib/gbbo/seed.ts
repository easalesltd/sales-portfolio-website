import { bakerIdForName, companionIdForName } from "./identity";
import type { Baker, EpisodeScore, LeagueState } from "./types";

export const SERIES_17_BAKERS: Omit<Baker, "id" | "eliminatedInWeek">[] = [
  {
    name: "Clara",
    age: 24,
    hometown: "Hertfordshire",
    job: "Marketing graduate",
    photo: "/gbbo/bakers/clara.jpg",
    bio: "A Portuguese pocket rocket from Aveiro, Clara moved to the UK at 18 and bakes with colour, fruit and a bit of chaos. She started two years ago, often making pastéis de nata for her fiancé Kieran, and shares a home with spaniel Gigi and hedgehog Pecan.",
  },
  {
    name: "Connie",
    age: 63,
    hometown: "London",
    job: "NHS hospital discharge lead",
    photo: "/gbbo/bakers/connie.jpg",
    bio: "London’s Cake Lady has baked her whole life and unwinds after NHS shifts with rum fruit, lemon and lavender cakes. Married to musician Myke for 23 years, she tests new recipes on students at the music centre they run together.",
  },
  {
    name: "Danni",
    age: 25,
    hometown: "Dorset",
    job: "HGV service centre administrator",
    photo: "/gbbo/bakers/danni.jpg",
    bio: "A curious forager who pairs magnolia, chestnut and dandelion with ube and red bean. Danni works with their dad at an HGV centre, doodles anime, and dresses bakes like video games and cartoons.",
  },
  {
    name: "Gabe",
    age: 32,
    hometown: "West Midlands",
    job: "Artist and drag king",
    photo: "/gbbo/bakers/gabe.jpg",
    bio: "Self-styled daddy of Birmingham drag, Gabe fell for baking watching series one at 13. Their style is gorgeous but homemade, with savoury pies and a meringue habit. They perform as Blü Romantic and live with partners Ellis and Tyler plus sausage dogs Dill and Sage.",
  },
  {
    name: "Gary",
    age: 67,
    hometown: "Nottinghamshire",
    job: "Retired garment technologist",
    photo: "/gbbo/bakers/gary.jpg",
    bio: "A precise baker who found the hobby later in life and leans on citrus and neat presentation. Gary lives on a smallholding with wife Donna, a menagerie of animals, and collies Ollie and Alfie, and raises money for cancer charities after beating prostate cancer.",
  },
  {
    name: "Molly",
    age: 31,
    hometown: "London",
    job: "Accessibility coordinator",
    photo: "/gbbo/bakers/molly.jpg",
    bio: "Molly started baking with her grandmother more than 25 years ago and loves hazelnut, fruit and mint. She reviews transport accessibility, lives with husband Ash and sausage dog Lando, and is a musical-theatre and Formula 1 devotee.",
  },
  {
    name: "Moyin",
    age: 22,
    hometown: "Essex",
    job: "Political economy student",
    photo: "/gbbo/bakers/moyin.jpg",
    bio: "A sprinter and macaron nerd who started baking with his mum at five. Moyin’s flavours lean on Nigerian heritage — grains of paradise, groundnuts — around lectures, vinyl, comedy clubs and a standing matcha order.",
  },
  {
    name: "Mo",
    age: 21,
    hometown: "West Midlands",
    job: "Law student",
    photo: "/gbbo/bakers/mo.jpg",
    bio: "A self-confessed chaotic baker who began with Play-Doh and mug cakes and now folds Asian flavours into British classics. Mo lives with his family and three cats, studies law, and lifts when he is not at the bench.",
  },
  {
    name: "Nikki",
    age: 50,
    hometown: "London",
    job: "Advertising post-producer",
    photo: "/gbbo/bakers/nikki.jpg",
    bio: "Nikki has baked with her mum since she was seven and still treats the kitchen as therapy. She feeds family and friends, has been with Tom for 22 years, and still hits the R&B dancefloor after a 90s spell as a podium dancer.",
  },
  {
    name: "Shannon",
    age: 29,
    hometown: "Gloucestershire",
    job: "Project planner",
    photo: "/gbbo/bakers/shannon.jpg",
    bio: "A countryside foodie who wants to bring a little forest magic to the tent. Shannon bakes rustic, quirky cakes learned from her nan, lives with fiancé Scott, two Staffies and Tyrone the tortoise, and once rode a horse through a drive-thru.",
  },
  {
    name: "Tom",
    age: 25,
    hometown: "West Yorkshire",
    job: "Hairdresser",
    photo: "/gbbo/bakers/tom.jpg",
    bio: "A self-proclaimed northern diva who wants bakes that are witty, pretty and delicious. Tom learned brandy snaps at his nan’s before he was ten, feeds the salon salted caramel brownies, and is house-hunting with boyfriend Alex after seven months in Southeast Asia.",
  },
  {
    name: "Yannis",
    age: 28,
    hometown: "London",
    job: "Paediatric doctor",
    photo: "/gbbo/bakers/yannis.jpg",
    bio: "A NICU doctor who swears a cake can lift a whole ward. Born in Vienna and raised in London, Yannis learned English partly from Bake Off, makes bhapa pitha with his grandmother’s memory in mind, and is also a legendary wedding bhangra dancer.",
  },
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

/** Week 1 sides from the companions' first squads. */
export const OPENING_SQUADS: Record<(typeof COMPANIONS)[number], readonly string[]> = {
  Dave: ["Shannon", "Mo", "Connie"],
  Cowie: ["Clara", "Yannis", "Molly"],
  Guns: ["Danni", "Molly", "Clara"],
  Shuker: ["Connie", "Gabe", "Tom"],
  Lee: ["Moyin", "Tom", "Yannis"],
  Nest: ["Gary", "Nikki", "Gabe"],
};

export const COMPANION_PHOTOS: Partial<Record<(typeof COMPANIONS)[number], string>> = {
  Dave: "/gbbo/companions/dave.jpg",
  Cowie: "/gbbo/companions/cowie.jpg",
  Guns: "/gbbo/companions/guns.jpg",
  Shuker: "/gbbo/companions/shuker.jpg",
  Lee: "/gbbo/companions/lee.jpg",
  Nest: "/gbbo/companions/nest.jpg",
};

export function createCompanions() {
  return COMPANIONS.map((name, index) => ({
    id: companionIdForName(name),
    name,
    lastYearPlace: index + 1,
    isChief: name === "Dave",
    isDraftMaster: name === "Dave",
    photo: COMPANION_PHOTOS[name] ?? "",
  }));
}

function rankingForSquad(bakers: Baker[], names: readonly string[]) {
  const preferred = names.map((name) => bakerIdForName(name));
  const rest = bakers.map((baker) => baker.id).filter((id) => !preferred.includes(id));
  return [...preferred, ...rest];
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
      companions.map((companion) => [
        companion.id,
        rankingForSquad(bakers, OPENING_SQUADS[companion.name as (typeof COMPANIONS)[number]]),
      ]),
    ),
    draftComplete: true,
    initialTeams: companions.map((companion) => ({
      companionId: companion.id,
      bakerIds: OPENING_SQUADS[companion.name as (typeof COMPANIONS)[number]].map((name) => bakerIdForName(name)),
    })),
    substitutions: [],
    sideConfirmations: [],
    jokers: [],
    episodes: Array.from({ length: 10 }, (_, index) => emptyEpisode(index + 1, 10)),
    adHocRules: [],
    penalties: [],
    technicalRecipes: [],
    technicalCatalogue: [],
  };
}

export function createDemoLeague(): LeagueState {
  return createEmptyLeague();
}
