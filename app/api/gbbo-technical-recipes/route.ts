import { NextResponse } from "next/server";
import { isGbboChiefRequest } from "@/app/lib/gbbo/chief";
import {
  applyTechnicalListing,
  attachMissingRecipePhotos,
  fetchOfficialTechnicals,
  fetchRecipePhoto,
  pinTechnicalRecipe,
} from "@/app/lib/gbbo/recipes";
import { readGbboLeague, writeGbboLeague } from "@/app/lib/gbbo/persist";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const league = await readGbboLeague();
  const body = (await request.json().catch(() => ({}))) as {
    week?: number;
    url?: string;
    title?: string;
    photo?: string;
  };

  if (body.week && body.url) {
    if (!(await isGbboChiefRequest(request))) {
      return NextResponse.json({ error: "Only the Chief Companion can pin a recipe." }, { status: 401 });
    }
    pinTechnicalRecipe(league, Number(body.week), {
      title: body.title?.trim() || "This week's technical",
      url: body.url.trim(),
      photo: body.photo?.trim() || (await fetchRecipePhoto(body.url.trim())),
    });
    await writeGbboLeague(league);
    return NextResponse.json({ league, assignedWeeks: [Number(body.week)], seeded: false });
  }

  try {
    const listing = await fetchOfficialTechnicals();
    const result = applyTechnicalListing(league, listing);
    await attachMissingRecipePhotos(league);
    await writeGbboLeague(league);
    return NextResponse.json({ league, listing, ...result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not read the official recipes." },
      { status: 502 },
    );
  }
}
