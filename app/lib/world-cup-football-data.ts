import type { WorldCupMatchResult } from '@/app/lib/world-cup-scoring';

const FOOTBALL_DATA_BASE = 'https://api.football-data.org/v4';

type FootballDataTeam = {
  id?: number;
  name?: string;
  tla?: string;
  shortName?: string;
};

type FootballDataBooking = {
  card?: string;
  team?: FootballDataTeam;
};

type FootballDataMatch = {
  id?: number;
  utcDate?: string;
  status?: string;
  stage?: string;
  homeTeam?: FootballDataTeam;
  awayTeam?: FootballDataTeam;
  score?: {
    fullTime?: {
      home?: number | null;
      away?: number | null;
    };
  };
  bookings?: FootballDataBooking[];
};

function normalizeTla(team: FootballDataTeam | undefined, fallbackName: string): string {
  const tla = team?.tla?.trim().toUpperCase();
  if (tla) return tla;
  return fallbackName.slice(0, 3).toUpperCase();
}

function isRedBooking(card: string | undefined): boolean {
  return card === 'RED' || card === 'YELLOW_RED';
}

function countRedCardsForSide(
  bookings: FootballDataBooking[] | undefined,
  side: FootballDataTeam | undefined
): number {
  if (!bookings?.length || !side) return 0;
  const sideId = side.id;
  const sideName = side.name?.trim().toLowerCase();

  return bookings.filter((booking) => {
    if (!isRedBooking(booking.card)) return false;
    const team = booking.team;
    if (sideId != null && team?.id != null) return team.id === sideId;
    if (sideName && team?.name) return team.name.trim().toLowerCase() === sideName;
    return false;
  }).length;
}

function parseFootballDataMatch(raw: FootballDataMatch): WorldCupMatchResult | null {
  if (raw.id == null || !raw.utcDate || !raw.status) return null;
  const homeName = raw.homeTeam?.name ?? raw.homeTeam?.shortName ?? 'Home';
  const awayName = raw.awayTeam?.name ?? raw.awayTeam?.shortName ?? 'Away';

  return {
    id: String(raw.id),
    utcDate: raw.utcDate,
    status: raw.status,
    stage: raw.stage,
    homeTeam: {
      name: homeName,
      tla: normalizeTla(raw.homeTeam, homeName),
    },
    awayTeam: {
      name: awayName,
      tla: normalizeTla(raw.awayTeam, awayName),
    },
    homeGoals: raw.score?.fullTime?.home ?? null,
    awayGoals: raw.score?.fullTime?.away ?? null,
    homeRedCards: countRedCardsForSide(raw.bookings, raw.homeTeam),
    awayRedCards: countRedCardsForSide(raw.bookings, raw.awayTeam),
  };
}

export function footballDataApiConfigured(): boolean {
  return Boolean(process.env.FOOTBALL_DATA_API_TOKEN?.trim());
}

export async function fetchWorldCupMatchesFromFootballData(): Promise<WorldCupMatchResult[]> {
  const token = process.env.FOOTBALL_DATA_API_TOKEN?.trim();
  if (!token) return [];

  const response = await fetch(`${FOOTBALL_DATA_BASE}/competitions/WC/matches?season=2026`, {
    headers: {
      'X-Auth-Token': token,
      'X-Unfold-Bookings': 'true',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`football-data.org responded with ${response.status}`);
  }

  const payload = (await response.json()) as { matches?: FootballDataMatch[] };
  const matches = payload.matches ?? [];

  return matches
    .map(parseFootballDataMatch)
    .filter((match): match is WorldCupMatchResult => match != null);
}
