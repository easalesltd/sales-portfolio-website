# Bing + IndexNow Setup (Next.js stack)

This project already has:

- `robots.txt` at `app/robots.ts`
- `sitemap.xml` at `app/sitemap.ts`
- canonical host redirects and CSP via `proxy.ts`

Use the steps below to wire Bing + IndexNow end-to-end.

## 1) Verify the site in Bing Webmaster Tools

1. Open [https://www.bing.com/webmasters](https://www.bing.com/webmasters)
2. Add property: `https://www.easalesltd.co.uk`
3. Choose **HTML Meta Tag** verification.
4. Copy the token value from:
   `<meta name="msvalidate.01" content="YOUR_TOKEN" />`
5. Set environment variable:
   - `NEXT_PUBLIC_BING_VERIFICATION_CODE=YOUR_TOKEN`
6. Redeploy.

This repo now outputs the Bing verification tag from `app/layout.tsx`.

## 2) Configure IndexNow key

1. Generate a key (32+ chars; letters/numbers).
2. Create a file in `public` named:
   - `public/<YOUR_INDEXNOW_KEY>.txt`
3. File contents must be exactly the same key (single line).

Example:

- filename: `public/0123456789abcdef0123456789abcdef.txt`
- content: `0123456789abcdef0123456789abcdef`

4. Set env vars:
   - `INDEXNOW_KEY=<YOUR_INDEXNOW_KEY>`
   - `INDEXNOW_KEY_LOCATION=https://www.easalesltd.co.uk/<YOUR_INDEXNOW_KEY>.txt`

## 3) Submit changed URLs with the built-in script

This repo now includes:

- script: `scripts/submit-indexnow.mjs`
- npm command: `npm run seo:indexnow`

Examples:

```bash
# Submit specific pages after a release
npm run seo:indexnow -- --url /about --url /contact --url /temporary-rep-cover

# Full URLs are also accepted
npm run seo:indexnow -- https://www.easalesltd.co.uk/display-solutions
```

Notes:

- If you pass no URL, it submits the homepage.
- Paths are resolved against `NEXT_PUBLIC_SITE_URL`.

## 4) Recommended release workflow

After each production deploy:

1. Submit your changed URLs via `npm run seo:indexnow`.
2. In Bing Webmaster Tools:
   - submit `https://www.easalesltd.co.uk/sitemap.xml` (once)
   - run URL Inspection for critical pages if needed.

## 5) Optional automation

If you deploy from CI/CD, run this post-deploy command with changed paths:

```bash
npm run seo:indexnow -- --url / --url /about --url /what-is-a-sales-agent
```

You can keep a small list of "high-value pages" and always submit them after deploy.
