# AGENTS.md

Repo-specific guidance for agents working on the East Anglian Sales LTD website
(`sales-portfolio-website`). See `README.md` for the standard project overview and
`.cursor/rules/*` for the World Cup / English Pyramid sweepstake data workflows.

## Cursor Cloud specific instructions

Single Next.js 16 app (App Router, React 18, TypeScript, Tailwind, Turbopack). One
process serves the marketing site plus several embedded interactive sub-products
(Request an Agent Visit / Order confirm-by-email flows, the hidden "Sales Agent Dash"
game, and the World Cup / English Pyramid sweepstake modals). There is no separate
backend and no database — persistence is static data files, with optional Upstash/KV
Redis only for the game leaderboard. Node 22 is fine.

### Run / build / test / lint

Standard commands live in `package.json` `scripts`. Notes and gotchas:

- **Run (dev):** `npm run dev` → serves on `http://localhost:3000` (Turbopack). This is
  the command to use for development. All external services are optional; the site runs
  with zero env vars.
- **Build:** `npm run build` works as-is.
- **Test:** `npm test` (Jest). The suite is pure-logic tests under `app/lib/*.test.ts`.
  Note: several World Cup tests are **time/data-dependent** — they assert against the
  current sweepstake ledger/fixtures and today's date, so a handful can fail as fixture
  dates move into the past. Those failures are pre-existing data drift, not a broken
  environment.
- **Lint:** the packaged `npm run lint` (`next lint`) is **removed in Next.js 16** and
  fails with `Invalid project directory ... /lint`. The working invocation uses the
  legacy `.eslintrc.json` (the flat `eslint.config.mjs` references `next/typescript`,
  which is not available in the pinned `eslint-config-next@14.1.0`):
  `ESLINT_USE_FLAT_CONFIG=false npx eslint . --ext .js,.jsx,.ts,.tsx`
  It reports pre-existing lint findings in the repo — that is the linter working, not a
  setup problem.

### Gotchas

- **Do NOT actually submit the "Request an Agent Visit" or contact forms during
  testing.** When email env is not configured the API returns a fallback and the client
  sends via `@emailjs/browser` using **hardcoded production EmailJS credentials**
  (`app/components/RequestVisitForm.tsx`), which emails the real business. Test other
  flows instead.
- **Hidden interactive features (no external side effects, safe to demo):** on the site
  logo (top-left header, `app/components/HeaderLogo.tsx`) **double-click** opens the
  "Sales Agent Dash" endless-runner game (Space/click to jump); **triple-click** opens
  the sweepstake picker (World Cup / English Pyramid league tables).
- **Optional services** (all gated, site degrades gracefully): Resend/EmailJS for the
  confirm-by-email flows, Upstash/Vercel KV Redis for the game leaderboard, Cloudflare
  Turnstile for form anti-bot. See `.env.example` and `CONFIRM_EMAIL_SIMPLE.md`.
- **Sweepstake data updates** (World Cup / English Pyramid) have their own detailed
  workflows and validation scripts — follow `.cursor/rules/world-cup-sweepstake-manual-updates.mdc`
  and `.cursor/rules/english-pyramid-sweepstake-manual-updates.mdc`.
