export type Id = string;

export type Companion = {
  id: Id;
  name: string;
  lastYearPlace: number;
  isChief: boolean;
  isDraftMaster: boolean;
};

export type Baker = {
  id: Id;
  name: string;
  bio: string;
  age: number | null;
  eliminatedInWeek: number | null;
};

export type TeamAssignment = {
  companionId: Id;
  bakerIds: Id[];
};

export type Substitution = {
  id: Id;
  week: number;
  companionId: Id;
  outBakerId: Id;
  inBakerId: Id | null;
  autoByChief: boolean;
};

export type JokerPlay = {
  companionId: Id;
  week: number;
  autoApplied: boolean;
};

export type TechnicalPlace = {
  bakerId: Id;
  place: number;
};

export type AdHocAward = {
  bakerId: Id;
  ruleId: Id;
  note?: string;
};

export type EpisodeScore = {
  week: number;
  title: string;
  theme: string;
  deadline: string;
  published: boolean;
  starBakerId: Id | null;
  eliminatedBakerId: Id | null;
  technical: TechnicalPlace[];
  handshakes: Id[];
  innuendos: Id[];
  drops: Record<Id, number>;
  cries: Record<Id, number>;
  adHoc: AdHocAward[];
  recapSource: string;
  recapNotes: string;
};

export type AdHocRule = {
  id: Id;
  week: number;
  description: string;
  points: number;
  votes: Record<Id, "yes" | "no">;
};

export type Penalty = {
  id: Id;
  week: number;
  companionId: Id;
  bakerId: Id;
  kind: "technical" | "beer_baguette";
  deadline: string;
  completed: boolean;
  note: string;
};

export type RecapSuggestion = {
  starBakerId: Id | null;
  eliminatedBakerId: Id | null;
  technical: TechnicalPlace[];
  handshakes: Id[];
  innuendos: Id[];
  drops: Record<Id, number>;
  cries: Record<Id, number>;
  notes: string[];
  confidence: Record<string, "high" | "medium" | "low">;
};

export type LeagueState = {
  name: string;
  seriesYear: number;
  currentWeek: number;
  totalWeeks: number;
  companions: Companion[];
  bakers: Baker[];
  draftRankings: Record<Id, Id[]>;
  draftComplete: boolean;
  initialTeams: TeamAssignment[];
  substitutions: Substitution[];
  jokers: JokerPlay[];
  episodes: EpisodeScore[];
  adHocRules: AdHocRule[];
  penalties: Penalty[];
};

export type ScoreLine = {
  label: string;
  bakerId: Id | null;
  points: number;
  kind: "plus" | "minus" | "info";
};

export type CompanionWeekScore = {
  companionId: Id;
  week: number;
  bakerIds: Id[];
  lines: ScoreLine[];
  rawPoints: number;
  joker: boolean;
  points: number;
};
