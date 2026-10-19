# AGENTS.md

Guidance for coding agents working in this repository.

## Project overview

Gamefoss is a Portuguese-language static publication built with Astro 7, MDX,
React islands, Tailwind CSS 4, and Pagefind. It contains editorial articles and
a podcast whose episode data is fetched from an external RSS feed at build time.

Use Node.js 22 and npm. Install dependencies with `npm ci`.

## Repository map

- `src/pages/`: Astro routes. The site uses trailing slashes.
- `src/layouts/`: shared page shells and metadata.
- `src/components/`: Astro components and small React components/islands.
- `src/lib/`: framework-independent helpers and podcast/analytics logic.
- `src/content/`: articles, authors, and categories managed through Astro
  content collections.
- `src/styles/`: the CSS cascade, imported through `src/styles/global.css`.
- `public/`: static assets, article images, crawler files, and redirects.
- `scripts/`: podcast sync, WordPress migration, and generated-link validation.
- `migration/`: source manifest for the legacy Ludokratia migration.
- `.github/workflows/`: validation, development deployment, and release flow.

Generated directories (`.astro/`, `.cache/`, `dist/`, and `coverage/`) are not
source. Do not commit them.

## Working conventions

- Preserve the existing TypeScript strictness, two-space indentation, single
  quotes, and Prettier formatting.
- Prefer the `@/` alias for imports from `src/` and `@generated/` for files in
  `.cache/`.
- Keep the user-facing language in Brazilian Portuguese. Code identifiers and
  developer documentation may remain in English.
- Preserve accessibility semantics: descriptive alternative text, keyboard
  behavior, visible focus states, labels for icon-only controls, and the
  existing reduced-motion behavior.
- Use `withBase()` for internal URLs assembled in TypeScript or component
  expressions. The same build must work at both `/` in production and `/dev/`
  in preview; do not hard-code the preview prefix.
- Keep canonical URLs production-oriented. Preview builds are intentionally
  `noindex`.
- Treat the podcast RSS feed as the source of truth. Do not hand-edit
  `.cache/episodes.json`.
- Never commit `.env` or real secrets. Document new environment variables in
  `.env.example` and wire them into the relevant GitHub workflows when needed.

## Components and styling

- Use Astro components by default. Add React only where client-side state or
  interaction requires it, and keep hydration directives as narrow as possible.
- Reuse existing components and variants before introducing parallel markup or
  styles.
- `src/styles/global.css` is the only CSS entry point. Maintain its cascade:
  `foundation/`, then `components/`, then `pages/`, then `integrations/`.
- Write mobile-first styles and use the established `md` and `lg` breakpoints.
  Keep responsive rules beside the selector they modify.
- Prefer shallow native CSS nesting. Use `@apply` only for short, repeated
  utility recipes; keep bespoke visual treatments in plain CSS.

## Content changes

- Content collection schemas live in `src/content.config.ts`; update the schema
  and affected content together.
- Articles may be `.md` or `.mdx`. Use the existing `YouTube`, `Figure`, and
  `Callout` components for rich MDX content.
- A defined article `cover` requires `coverAlt`. Keep dates and editorial copy
  accurate rather than inventing missing metadata.
- Put article media under `public/images/articles/<article-slug>/` and author
  media under `public/images/authors/`.
- Do not run `npm run content:migrate` as a routine check. It can rewrite
  migrated content, migration reports, and legacy redirects; run it only when
  the task explicitly concerns the migration.

## Validation

Run the smallest relevant checks while iterating, then broaden them according
to the change:

- `npm test -- --run <path>` for a focused test file.
- `npm test` for the Vitest suite.
- `npm run format:check` for formatting.
- `npm run check` for Astro and TypeScript validation.
- `npm run build && npm run validate:links` for routes, base-path changes,
  content changes, and production-facing work.
- `npm run validate` for the full local validation sequence.

`dev`, `check`, `build`, and therefore `validate` synchronize the podcast first
and require network access. If the RSS feed is unavailable, report that as an
external validation limitation; do not fabricate or commit a cache to bypass
the failure. Unit tests and `format:check` do not require the feed.

When changing URL generation or deployment behavior, verify both environments:

```bash
DEPLOY_ENV=production PUBLIC_SITE_URL=https://gamefoss.com.br PUBLIC_BASE_PATH=/ npm run build
PUBLIC_BASE_PATH=/ npm run validate:links

DEPLOY_ENV=development PUBLIC_SITE_URL=https://gamefoss.com.br/dev PUBLIC_BASE_PATH=/dev npm run build
PUBLIC_BASE_PATH=/dev npm run validate:links
```

## Tests

- Add or update Vitest coverage for behavior in `src/lib/`, React components,
  and scripts when practical.
- Keep tests deterministic. Mock RSS/network input rather than depending on the
  live feed.
- Test observable behavior and edge cases, especially sanitization, slugging,
  date handling, URL prefixes, and content parsing.

## Release safety

- Feature work targets `release/latest`; `main` is the production promotion
  branch.
- Do not run `npm run release`, create version tags, deploy over FTP, or edit
  generated release notes unless the user explicitly requests release work.
- Keep `changelog.md` in its existing lowercase form.
- Do not weaken the separation between development and production FTP targets.
  Production intentionally preserves server-owned directories.

## Before handing off

- Review the diff and preserve unrelated user changes.
- Format touched files and run the checks appropriate to the change.
- Summarize modified files, validations run, and any checks blocked by the live
  podcast feed or another external dependency.
