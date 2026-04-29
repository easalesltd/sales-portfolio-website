#!/usr/bin/env node

/**
 * Submit changed URLs to IndexNow (Bing/Yandex and supporting engines).
 *
 * Usage examples:
 *   npm run seo:indexnow -- --url /about --url /temporary-rep-cover
 *   npm run seo:indexnow -- https://www.easalesltd.co.uk/about
 */

const DEFAULT_SITE = 'https://www.easalesltd.co.uk';

function getSiteBaseUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  return fromEnv || DEFAULT_SITE;
}

function parseUrls(argv, siteBaseUrl) {
  const urls = [];

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--url' && argv[i + 1]) {
      urls.push(argv[i + 1]);
      i += 1;
      continue;
    }
    if (token.startsWith('--')) {
      continue;
    }
    urls.push(token);
  }

  if (urls.length === 0) {
    return [`${siteBaseUrl}/`];
  }

  return [...new Set(urls.map((value) => new URL(value, `${siteBaseUrl}/`).toString()))];
}

async function main() {
  const siteBaseUrl = getSiteBaseUrl();
  const host = new URL(siteBaseUrl).host;
  const key = process.env.INDEXNOW_KEY;
  const keyLocation =
    process.env.INDEXNOW_KEY_LOCATION || `${siteBaseUrl}/${key || 'REPLACE_WITH_KEY'}.txt`;
  const endpoint = process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow';

  if (!key) {
    console.error('Missing INDEXNOW_KEY in environment.');
    process.exit(1);
  }

  const urlList = parseUrls(process.argv.slice(2), siteBaseUrl);
  const payload = {
    host,
    key,
    keyLocation,
    urlList,
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`IndexNow request failed (${response.status}): ${body}`);
    process.exit(1);
  }

  console.log(`IndexNow submitted ${urlList.length} URL(s).`);
  for (const url of urlList) {
    console.log(`- ${url}`);
  }
}

main().catch((error) => {
  console.error('IndexNow submit failed:', error);
  process.exit(1);
});
