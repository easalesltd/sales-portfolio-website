import type { Baker, RecapSuggestion, TechnicalPlace } from "./types";

const STAR_PATTERNS = [
  /star baker(?: of the week)?(?: was| is|:)?\s+([A-Z][a-z]+)/i,
  /([A-Z][a-z]+)\s+(?:was|is)\s+(?:named\s+|crowned\s+|awarded\s+)?star baker/i,
  /([A-Z][a-z]+)\s+(?:was\s+)?(?:named|crowned|awarded)\s+star baker/i,
  /([A-Z][a-z]+)[^.!?]{0,40}star baker/i,
  /star baker[^.!?]{0,40}\b([A-Z][a-z]+)/i,
];

const ELIM_PATTERNS = [
  /(?:said goodbye to|sent home|eliminated|left the tent|was the one to leave)[:\s]+([A-Z][a-z]+)/i,
  /([A-Z][a-z]+)\s+(?:was|is)\s+(?:eliminated|sent home|leaving the tent)/i,
  /([A-Z][a-z]+)[^.!?]{0,70}(?:was\s+)?(?:eliminated|sent home|sent packing)/i,
  /([A-Z][a-z]+)[^.!?]{0,40}(?:left|leaving) the tent/i,
  /goodbye[, ]+([A-Z][a-z]+)/i,
];

const TECH_WIN = [
  /(?:won|wins|winning)\s+(?:the\s+)?technical[^.]{0,40}\b([A-Z][a-z]+)/i,
  /([A-Z][a-z]+)\s+won\s+(?:the\s+)?technical/i,
  /technical(?: challenge)?(?: was)? won by\s+([A-Z][a-z]+)/i,
];

const TECH_LAST = [
  /([A-Z][a-z]+)\s+(?:came|finished|was)\s+(?:last|bottom)\s+(?:in\s+)?(?:the\s+)?technical/i,
  /(?:last|bottom)\s+(?:in\s+)?(?:the\s+)?technical[^.]{0,40}\b([A-Z][a-z]+)/i,
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findBaker(name: string, bakers: Baker[]): Baker | undefined {
  const needle = name.trim().toLowerCase();
  return bakers.find((baker) => baker.name.toLowerCase() === needle);
}

function firstMatch(text: string, patterns: RegExp[], bakers: Baker[]): Baker | undefined {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    const baker = match?.[1] ? findBaker(match[1], bakers) : undefined;
    if (baker) return baker;
  }
  return undefined;
}

function bakerNear(text: string, bakers: Baker[], clue: RegExp): Baker | undefined {
  const ranked = [...bakers].sort((a, b) => b.name.length - a.name.length);
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    if (!clue.test(sentence)) continue;
    const baker = ranked.find((item) => new RegExp(`\\b${escapeRegExp(item.name)}\\b`, "i").test(sentence));
    if (baker) return baker;
  }
  return undefined;
}

function sentencesNear(text: string, baker: Baker): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => new RegExp(`\\b${escapeRegExp(baker.name)}\\b`, "i").test(sentence));
}

function countMentions(text: string, baker: Baker, keywords: RegExp): number {
  return sentencesNear(text, baker).filter((sentence) => keywords.test(sentence)).length;
}

function parseTechnicalRanks(text: string, bakers: Baker[]): TechnicalPlace[] {
  const ranks: TechnicalPlace[] = [];
  const used = new Set<string>();

  const add = (baker: Baker | undefined, place: number) => {
    if (!baker || used.has(baker.id)) return;
    used.add(baker.id);
    ranks.push({ bakerId: baker.id, place });
  };

  add(firstMatch(text, TECH_WIN, bakers), 1);

  const numbered = [
    ...text.matchAll(
      /(?:came|finished|placed|was)\s+(first|second|third|1st|2nd|3rd|last|bottom)\s+(?:in\s+)?(?:the\s+)?technical[^.]{0,30}([A-Z][a-z]+)|([A-Z][a-z]+)\s+(?:came|finished|placed|was)\s+(first|second|third|1st|2nd|3rd|last|bottom)\s+(?:in\s+)?(?:the\s+)?technical/gi,
    ),
  ];

  const placeMap: Record<string, number | "last"> = {
    first: 1,
    "1st": 1,
    second: 2,
    "2nd": 2,
    third: 3,
    "3rd": 3,
    last: "last",
    bottom: "last",
  };

  for (const match of numbered) {
    const placeWord = (match[1] || match[4] || "").toLowerCase();
    const name = match[2] || match[3];
    const baker = name ? findBaker(name, bakers) : undefined;
    const mapped = placeMap[placeWord];
    if (!baker || mapped === undefined) continue;
    add(baker, mapped === "last" ? bakers.length : mapped);
  }

  add(firstMatch(text, TECH_LAST, bakers), bakers.length);

  const listMatch = text.match(
    /technical(?: challenge)?(?: rankings?| results?| order)?[:\s]+([^.]+)/i,
  );
  if (listMatch?.[1]) {
    const names = listMatch[1]
      .split(/,| and |\//)
      .map((part) => part.replace(/^\d+[\).\s-]+/, "").trim())
      .map((part) => findBaker(part, bakers))
      .filter((baker): baker is Baker => Boolean(baker));
    names.forEach((baker, index) => add(baker, index + 1));
  }

  return ranks.sort((a, b) => a.place - b.place);
}

export function parseRecap(text: string, bakers: Baker[], activeCount: number): RecapSuggestion {
  const notes: string[] = [];
  const confidence: RecapSuggestion["confidence"] = {};

  const star = firstMatch(text, STAR_PATTERNS, bakers) ?? bakerNear(text, bakers, /star baker/i);
  const eliminated =
    firstMatch(text, ELIM_PATTERNS, bakers) ??
    bakerNear(text, bakers, /eliminated|sent home|sent packing|left the tent|leaving the tent/i);
  const technical = parseTechnicalRanks(text, bakers);

  confidence.starBaker = star ? "high" : "low";
  confidence.eliminated = eliminated ? "high" : "low";
  confidence.technical = technical.length >= 3 ? "medium" : technical.length > 0 ? "low" : "low";

  if (!star) notes.push("Star Baker was not clearly named in this recap.");
  if (!eliminated) notes.push("The eliminated baker was not clearly named in this recap.");
  if (technical.length < Math.min(3, activeCount)) {
    notes.push("Technical places look incomplete. Recaps often only mention the winner and last place.");
  }

  const handshakes: string[] = [];
  const innuendos: string[] = [];
  const drops: Record<string, number> = {};
  const cries: Record<string, number> = {};

  for (const baker of bakers) {
    const around = sentencesNear(text, baker).join(" ");
    if (
      /\b(handshake|hollywood handshake|paul(?:'s)? handshake)\b/i.test(around) &&
      new RegExp(`\\b${escapeRegExp(baker.name)}\\b`, "i").test(around)
    ) {
      handshakes.push(baker.id);
    }

    if (
      /\b(innuendo|double entendre|flirt(?:ed|ing)?|saucy|naughty|suggestive)\b/i.test(around) &&
      /\b(nigella|lawson)\b/i.test(text)
    ) {
      innuendos.push(baker.id);
    }

    const dropCount = countMentions(
      text,
      baker,
      /\b(drop(?:ped|s|ping)?|on the floor|smash(?:ed)?|fell|spilled)\b/i,
    );
    if (dropCount > 0) drops[baker.id] = dropCount;

    const cryCount = countMentions(
      text,
      baker,
      /\b(cried|crying|tears|tearful|wept|weeping|well(?:ed)? up|emotional)\b/i,
    );
    if (cryCount > 0) cries[baker.id] = cryCount;
  }

  confidence.handshakes = handshakes.length ? "medium" : "low";
  confidence.flavour = "low";
  if (handshakes.length === 0) notes.push("No Hollywood handshake was mentioned. That may simply mean there wasn't one.");
  if (innuendos.length === 0) {
    notes.push("Naughty innuendos are a judgement call. Recaps rarely spell them out — confirm while watching.");
  }
  if (Object.keys(drops).length === 0) {
    notes.push("Dropped items are often missed in write-ups. Watch for utensils, trays and dough on the floor.");
  }
  if (Object.keys(cries).length === 0) {
    notes.push("Crying is easy to miss in print recaps. A welling-up still counts.");
  }

  notes.push("Treat this as a suggested scoresheet. Official results are usually solid; flavour events need a human eye.");

  return {
    starBakerId: star?.id ?? null,
    eliminatedBakerId: eliminated?.id ?? null,
    technical,
    handshakes,
    innuendos,
    drops,
    cries,
    notes,
    confidence,
  };
}

export function suggestionSummary(suggestion: RecapSuggestion, bakers: Baker[]): string {
  const name = (id: string | null) => bakers.find((baker) => baker.id === id)?.name ?? "—";
  return [
    `Star Baker: ${name(suggestion.starBakerId)}`,
    `Eliminated: ${name(suggestion.eliminatedBakerId)}`,
    `Technical mentioned: ${suggestion.technical.length} baker${suggestion.technical.length === 1 ? "" : "s"}`,
    `Handshakes: ${suggestion.handshakes.length}`,
    `Innuendos: ${suggestion.innuendos.length}`,
  ].join(" · ");
}
