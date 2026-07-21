---
name: tournament-sweepstake-euros
description: >-
  Rebuild a FIFA World Cup / UEFA European Championship nation sweepstake on
  this site (like World Cup 2026). Use when adding a Euros or World Cup fantasy
  game, restoring the archived 2026 World Cup sweepstake, or wiring knockout
  brackets, ESPN sync, and daily roasts for an international tournament.
---

# Tournament sweepstake (World Cup / Euros)

## Where the 2026 World Cup game lives

The live site retired the World Cup sweepstake after the 2026 final. A full
snapshot is preserved as a **git tag**:

```bash
git fetch --tags
git show archive/world-cup-sweepstake-2026 --stat
```

Restore the game files onto a branch (do not dump them onto `main` casually):

```bash
git checkout -b feature/euros-sweepstake
git checkout archive/world-cup-sweepstake-2026 -- \
  app/data/world-cup-fantasy.ts \
  app/api/world-cup-fantasy \
  app/lib/world-cup-scoring.ts \
  app/lib/world-cup-knockout-bracket.ts \
  app/lib/world-cup-live-scores.ts \
  app/lib/world-cup-espn-scoreboard.ts \
  app/lib/world-cup-espn-finals.ts \
  app/lib/world-cup-scoring.test.ts \
  app/lib/world-cup-knockout-bracket.test.ts \
  app/lib/world-cup-live-scores.test.ts \
  app/lib/world-cup-espn-scoreboard.test.ts \
  app/lib/world-cup-espn-finals.test.ts \
  app/lib/world-cup-daily-roast-validation.test.ts \
  scripts/world-cup-*.cjs \
  scripts/lib/world-cup-*.cjs \
  .github/workflows/world-cup-score-agent.yml \
  .github/workflows/world-cup-health-check.yml \
  .cursor/rules/world-cup-sweepstake-manual-updates.mdc \
  public/images/world-cup-fantasy
```

Then re-wire `HeaderLogo` (triple-click / picker) and `package.json` scripts from
that tag’s versions.

## Architecture (keep this pattern)

| Piece | Role |
| --- | --- |
| `app/data/*-fantasy.ts` | Players, teams, fixtures, manual ledger, daily roast, scoring constants |
| `app/lib/*-scoring.ts` | `computeStandings`, matchday schedule, team match display |
| `app/lib/*-knockout-bracket.ts` | Generates R16→final placeholders from slot winners |
| `app/api/*-fantasy/route.ts` | JSON for the modal (standings + schedule + roast) |
| `app/components/WorldCupFantasy.tsx` | **Shared** modal UI (pyramid still uses this) |
| `EnglishPyramidFantasy.tsx` pattern | Thin wrapper: theme, API path, scoring rules, helpers |
| GitHub Actions `*-score-agent.yml` | ESPN sync + optional Cursor roast agent |
| `.cursor/rules/*-manual-updates.mdc` | Agent rules for ledger append + roast validation |

## Scoring model (2026 World Cup)

- Group: 3 win / 1 draw
- Knockout: 3 win / 0 loss (record AET score; pens in `homePenalties`/`awayPenalties`)
- +1 for 3+ goals scored; −1 for 3+ conceded; −1 per red
- Champion banner when ledger contains `2026-07-19-final` (rename for Euros final id)

## Shared pieces still on main

Do **not** delete these when building Euros — pyramid depends on them:

- `app/components/WorldCupFantasy.tsx` + `sweepstake-fantasy-theme.ts` (`world-cup` theme still defined for reuse)
- `app/lib/world-cup-espn-finals.ts` + `scripts/lib/world-cup-espn-finals.cjs`
- `app/lib/espn-red-cards.ts` + `scripts/lib/espn-red-cards.cjs`
- `scripts/lib/world-cup-ledger-write.cjs` (`findManualMatchesArrayOpen` used by pyramid)
- Manager portraits under `public/images/english-pyramid-fantasy/` (copied from WC)

## Euros checklist

1. Restore archive files onto a feature branch.
2. Rename data/API/scripts from `world-cup` → `euros-YEAR` (or keep names and retitle copy).
3. Replace team codes, draft, fixtures; wipe the manual ledger.
4. Rebuild knockout bracket templates for the Euros draw.
5. Point ESPN sync at the correct tournament scoreboard.
6. Re-enable HeaderLogo entry + npm scripts + workflows.
7. Copy rule file; update roast/champion fixture id.
8. Add manager top/bottom portraits if new players join.
