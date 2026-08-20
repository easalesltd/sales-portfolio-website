/** Homage to James Alexander Gordon's classified football results cadence. */

export type VoiceLike = {
  name: string;
  lang: string;
  localService?: boolean;
};

export const CLASSIFIED_ROAST_INTRO = 'And now. The classified football roast.';

const ONES = [
  'nil',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
] as const;

function numberWord(value: string): string {
  const n = Number.parseInt(value, 10);
  if (n === 0) return 'nil';
  if (n > 0 && n < ONES.length) return ONES[n];
  return value;
}

function scorePhrase(home: string, away: string): string {
  return `${numberWord(home)}, ${numberWord(away)}`;
}

export function formatRoastForClassifiedSpeech(roast: string): string[] {
  const paragraphs = roast
    .split(/\n+/)
    .map((paragraph) =>
      paragraph
        .replace(/\u2014/g, '. ')
        .replace(/\u2013/g, '-')
        .replace(/\b0-0\b/g, 'nil, nil')
        .replace(/\b(\d+)-(\d+)\b/g, (_, home: string, away: string) => scorePhrase(home, away))
        .replace(/\bpts\b/gi, 'points')
        .replace(/\bppg\b/gi, 'points per game')
        .replace(/&/g, ' and ')
        .replace(/\s+/g, ' ')
        .trim()
    )
    .filter(Boolean);

  return paragraphs.length > 0 ? [CLASSIFIED_ROAST_INTRO, ...paragraphs] : [CLASSIFIED_ROAST_INTRO];
}

export function scoreClassifiedVoice(voice: VoiceLike): number {
  const name = voice.name.toLowerCase();
  const lang = voice.lang.toLowerCase().replace('_', '-');
  let score = 0;

  if (lang.startsWith('en-gb') || lang === 'en-uk') score += 8;
  if (lang.includes('scotland') || name.includes('scottish') || name.includes('scotland')) score += 14;
  if (name.includes('daniel')) score += 12;
  if (name.includes('george') && (lang.startsWith('en-gb') || name.includes('uk'))) score += 9;
  if (name.includes('uk english male') || name.includes('english united kingdom')) score += 10;
  if (name.includes('male') && lang.startsWith('en-gb')) score += 4;
  if (name.includes('gordon')) score += 3;
  if (voice.localService) score += 2;
  if (
    name.includes('female') ||
    name.includes('zira') ||
    name.includes('samantha') ||
    name.includes('moira') ||
    name.includes('fiona') ||
    name.includes('karen') ||
    name.includes('serena') ||
    name.includes('martha')
  ) {
    score -= 10;
  }

  return score;
}

export function pickClassifiedVoice<T extends VoiceLike>(voices: readonly T[]): T | null {
  if (voices.length === 0) return null;
  const ranked = [...voices].sort((a, b) => scoreClassifiedVoice(b) - scoreClassifiedVoice(a));
  return ranked[0] ?? null;
}

export const CLASSIFIED_SPEECH = {
  rate: 0.78,
  pitch: 0.86,
  volume: 1,
} as const;
