# Gamefoss

Static relaunch of [gamefoss.com.br](https://gamefoss.com.br), built with Astro, MDX, Tailwind CSS, Pagefind, and the Gamefoss podcast RSS feed.

## Local development

```bash
npm ci
npm run dev
```

Copy `.env.example` to `.env` for environment-specific values. A full production check is available with `npm run validate`.

## Content

- Articles: `src/content/articles/*.mdx`
- Authors: `src/content/authors/*.md`
- Podcast episodes: fetched from Anchor RSS and generated into the ignored `.cache/episodes.json` before development, checks, and builds
- Videos: fetched from the Gamefoss YouTube channel with the YouTube Data API and generated into the ignored `.cache/videos.json`
- MDX components: `YouTube`, `Figure`, `Gallery`, and `Callout` under `src/components/`

Article media lives under `public/images/articles/<article-slug>/`. Production builds run `npm run images:optimize` after Astro copies these assets to `dist/`. The optimizer recompresses supported JPEG, PNG, WebP, and AVIF files only when the result is smaller; source files in `public/` are never modified. SVG, GIF, and animated images are left unchanged.

Run `npm run content:migrate` to repeat the Ludokratia migration defined by `migration/ludokratia-manifest.json`. The command also writes migration diagnostics under `reports/migration/` and a redirect list to `public/legacy-redirects.conf`.

## Styling

`src/styles/global.css` is the single CSS entry point. It imports styles in cascade order from:

- `foundation/` for theme tokens, document defaults, and shared layout primitives
- `components/` for reusable UI
- `pages/` for page-level compositions
- `integrations/` for external services such as Pagefind, ads, and consent handling

Styles are mobile-first and use only Tailwind's default `md` (tablet) and `lg` (desktop) variants. Keep responsive rules beside the selector they modify, prefer shallow native CSS nesting for states and descendants, and use `@apply` only for short, repeated utility recipes. Bespoke visual treatments should remain plain CSS.

## Release flow

1. Open feature pull requests against `release/latest`.
2. Merges to `release/latest` deploy to `https://gamefoss.com.br/dev/`.
3. Promote the exact release through a pull request from `release/latest` to `main`.
4. A human-authored merge to `main` runs `standard-version`, commits the generated version and `changelog.md`, creates a version tag and GitHub Release with a production ZIP, then deploys to `https://gamefoss.com.br/`.

The deployment workflow can also rebuild either environment manually to pick up new podcast episodes and videos. Manual production runs always check out `main`; development runs always check out `release/latest`.

The RSS feed and YouTube channel are the sources of truth for podcast episodes and videos. `npm run dev`, `npm run check`, and `npm run build` synchronize both before Astro starts; generated caches are never committed. Consequently, those commands require network access and fail rather than build stale data when an external source is unavailable.

Create GitHub Environments named `development` and `production`. In each, configure `FTP_SERVER`, `FTP_USERNAME`, `FTP_TARGET_DIR`, and `PUBLIC_CONTACT_EMAIL` as variables and `FTP_PASSWORD` and `YOUTUBE_DATA_API` as secrets. `YOUTUBE_DATA_API` is the API key for a Google Cloud project with YouTube Data API v3 enabled. Production may additionally define `PUBLIC_GTAG_ID`, `PUBLIC_ADSENSE_CLIENT`, and `PUBLIC_ADSENSE_SLOT`. Set the development FTP target explicitly to `/dev/` and production to the hosting web root.

Analytics and advertising values use the identifiers copied from their Google snippets:

- `PUBLIC_GTAG_ID`: the GA4 web stream Measurement ID (`G-...`).
- `PUBLIC_ADSENSE_CLIENT`: the complete AdSense client/publisher value (`ca-pub-...`).
- `PUBLIC_ADSENSE_SLOT`: the numeric `data-ad-slot` value from the responsive display ad unit.

Clicks on elements carrying `data-ga` are reported as the GA4 event `ui_interaction`, with `interaction_name` set to the attribute value and `link_url` included for links. The delegated listener only emits events after Analytics consent has been granted.

Development uses `dangerous-clean-slate` because `/dev/` is an isolated preview target. Production leaves it disabled so server-owned directories such as `/old/` and `/signatures/` are preserved. The isolation of `FTP_TARGET_DIR` between GitHub Environments remains a required deployment safeguard.
