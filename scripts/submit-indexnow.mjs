#!/usr/bin/env node

/**
 * Submit changed URLs to IndexNow (Bing/Yandex and supporting engines).
 *
 * Usage examples:
 *   npm run seo:indexnow -- --url /about --url /temporary-rep-cover
 *   npm run seo:indexnow -- https://www.easalesltd.co.uk/about
 *   npm run seo:indexnow -- --sitemap
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_SITE = 'https://www.easalesltd.co.uk';
const DEFAULT_KEY = 'c509aba8456d5c87cdfe9b6e74c11f7d';
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function getSiteBaseUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  return fromEnv || DEFAULT_SITE;
}

function resolveIndexNowKey() {
  if (process.env.INDEXNOW_KEY) return process.env.INDEXNOW_KEY;

  const keyFile = path.join(repoRoot, 'public', `${DEFAULT_KEY}.txt`);
  if (fs.existsSync(keyFile)) {
    const fromFile = fs.readFileSync(keyFile, 'utf8').trim();
    if (fromFile) return fromFile;
  }

  return DEFAULT_KEY;
}

function parseArgs(argv) {
  const urls = [];
  let submitSitemap = false;

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--sitemap') {
      submitSitemap = true;
      continue;
    }
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

  return { urls, submitSitemap };
}

function resolveUrlList(rawUrls, siteBaseUrl, submitSitemap) {
  const urls = [...rawUrls];
  if (submitSitemap) {
    urls.push('/sitemap.xml', '/llms.txt', '/', '/about', '/contact', '/what-is-a-sales-agent');
  }

  if (urls.length === 0) {
    return [`${siteBaseUrl}/`];
  }

  return [...new Set(urls.map((value) => new URL(value, `${siteBaseUrl}/`).toString()))];
}

async function main() {
  const siteBaseUrl = getSiteBaseUrl();
  const host = new URL(siteBaseUrl).host;
  const key = resolveIndexNowKey();
  const keyLocation =
    process.env.INDEXNOW_KEY_LOCATION || `${siteBaseUrl}/${key}.txt`;
  const endpoint = process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow';
  const { urls, submitSitemap } = parseArgs(process.argv.slice(2));
  const urlList = resolveUrlList(urls, siteBaseUrl, submitSitemap);

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

  console.log(`IndexNow submitted ${urlList.length} URL(s) (key ${key.slice(0, 8)}…).`);
  for (const url of urlList) {
    console.log(`- ${url}`);
  }
}

main().catch((error) => {
  console.error('IndexNow submit failed:', error);
  process.exit(1);
});
