# Bing + IndexNow Setup (Next.js stack)

This project already has:

- `robots.txt` from `app/robots.ts` (source of truth — do **not** add a conflicting `public/robots.txt`)
- `sitemap.xml` from `app/sitemap.ts`
- canonical host redirects and CSP via `proxy.ts`
- IndexNow key file committed at `public/c509aba8456d5c87cdfe9b6e74c11f7d.txt`
- submit script: `npm run seo:indexnow`

## 1) Verify the site in Bing Webmaster Tools

1. Open [https://www.bing.com/webmasters](https://www.bing.com/webmasters)
2. Add property: `https://www.easalesltd.co.uk`
3. Choose **HTML Meta Tag** verification.
4. Copy the token value from:
   `<meta name="msvalidate.01" content="YOUR_TOKEN" />`
5. Set environment variable on Vercel (and locally if needed):
   - `NEXT_PUBLIC_BING_VERIFICATION_CODE=YOUR_TOKEN`
6. Redeploy.

This repo outputs the Bing verification tag from `app/layout.tsx` when that env var is set.

## 2) IndexNow key (already done in-repo)

| Item | Value |
|------|--------|
| Key | `c509aba8456d5c87cdfe9b6e74c11f7d` |
| Public file | `https://www.easalesltd.co.uk/c509aba8456d5c87cdfe9b6e74c11f7d.txt` |
| Optional env | `INDEXNOW_KEY` / `INDEXNOW_KEY_LOCATION` (script falls back to the committed key) |

The key file must stay publicly reachable and its contents must match the filename (IndexNow protocol).

## 3) Submit changed URLs

```bash
# After a content/SEO deploy — high-value pages + sitemap/llms
npm run seo:indexnow -- --sitemap

# Specific pages
npm run seo:indexnow -- --url /about --url /contact --url /blog

# Full URLs also work
npm run seo:indexnow -- https://www.easalesltd.co.uk/display-solutions
```

Notes:

- With no args, only the homepage is submitted.
- Paths resolve against `NEXT_PUBLIC_SITE_URL` (default `https://www.easalesltd.co.uk`).

## 4) Recommended release workflow

After each production deploy:

1. `npm run seo:indexnow -- --sitemap`
2. In Bing Webmaster Tools (once): submit `https://www.easalesltd.co.uk/sitemap.xml`

## 5) Optional CI post-deploy

```bash
npm run seo:indexnow -- --sitemap
```
