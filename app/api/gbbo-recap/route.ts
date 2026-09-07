import { NextResponse } from 'next/server';

function extractText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 40000);
}

export async function POST(request: Request) {
  const body = (await request.json()) as { url?: string };
  const url = body.url?.trim();
  if (!url) return NextResponse.json({ error: 'A recap URL is required.' }, { status: 400 });

  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return NextResponse.json({ error: 'Only http and https URLs can be fetched.' }, { status: 400 });
    }

    const response = await fetch(parsed.toString(), {
      headers: {
        'User-Agent': 'GBBO Companion League/1.0',
        Accept: 'text/html',
      },
    });
    if (!response.ok) {
      return NextResponse.json({ error: `Could not fetch that recap (${response.status}).` }, { status: 502 });
    }
    const html = await response.text();
    return NextResponse.json({ text: extractText(html), source: parsed.toString() });
  } catch {
    return NextResponse.json({ error: 'That recap could not be opened.' }, { status: 502 });
  }
}
