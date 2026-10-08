export type GbboOfficialStatement = {
  headline: string;
  issuedOn: string;
  /** Hidden once this week's episode is published. */
  showUntilWeekPublished: number;
  paragraphs: string[];
  resolutions: string[];
  signOff: string;
};

export const GBBO_OFFICIAL_STATEMENT: GbboOfficialStatement | null = {
  headline: "Guns's week 3 side",
  issuedOn: "5 October 2026",
  showUntilWeekPublished: 4,
  paragraphs: [
    "Guns started the series with Danni, Molly and Clara. Danni went home in week 2, so for People's Choice week Guns kept Molly and Clara and put Mo into the empty slot. That was a legal side of three.",
    "The site recorded every team change as one baker in and one baker out. Because nobody was taken out, it wrongly took out the last baker on Guns's list, Clara. Guns played week 3 with only Molly and Mo, scored 0 and was handed the slut drop. That was the site's fault, not Guns's. No other player's side was affected in any week.",
  ],
  resolutions: [
    "Clara is restored to Guns's week 3 side and Guns's week 3 score is now 6.",
    "The week 3 slut drop moves from Guns to Cowie, who now has the fewest points that week (1).",
    "Guns still owes the People's Choice technical. Nobody had Shannon, and Molly was the lowest-placed technical baker anyone had.",
    "Guns's side carries into week 4 as Molly, Clara and Mo.",
    "Filling the slot of a baker who went home no longer drops anyone. The site now refuses to save a side that doesn't match what was picked, and Keep last week is blocked when a player is a baker short.",
  ],
  signOff: "Issued by the Chief.",
};
