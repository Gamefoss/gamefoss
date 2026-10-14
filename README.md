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
- MDX components: `YouTube`, `Figure`, and `Callout` under `src/components/`

Run `npm run content:migrate` to repeat the Ludokratia migration defined by `migration/ludokratia-manifest.json`. The command also writes migration diagnostics under `reports/migration/` and a redirect list to `public/legacy-redirects.conf`.

## Release flow

1. Open feature pull requests against `release/latest`.
2. Merges to `release/latest` deploy to `https://gamefoss.com.br/dev/`.
3. Promote the exact release through a pull request from `release/latest` to `main`.
4. A human-authored merge to `main` runs `standard-version`, commits the generated version and `changelog.md`, creates a version tag and GitHub Release with a production ZIP, then deploys to `https://gamefoss.com.br/`.

The deployment workflow can also rebuild either environment manually to pick up new podcast episodes. Manual production runs always check out `main`; development runs always check out `release/latest`.

The RSS feed is the only podcast source of truth. `npm run dev`, `npm run check`, and `npm run build` fetch it before Astro starts; the generated cache is never committed. Consequently, those commands require network access and fail rather than build stale episode data when the feed is unavailable.

Create GitHub Environments named `development` and `production`. In each, configure `FTP_SERVER`, `FTP_USERNAME`, `FTP_TARGET_DIR`, and `PUBLIC_CONTACT_EMAIL` as variables and `FTP_PASSWORD` as a secret. Production may additionally define `PUBLIC_GTAG_ID`, `PUBLIC_ADSENSE_CLIENT`, and `PUBLIC_ADSENSE_SLOT`. Set the development FTP target explicitly to `/dev/` and production to the hosting web root.

Analytics and advertising values use the identifiers copied from their Google snippets:

- `PUBLIC_GTAG_ID`: the GA4 web stream Measurement ID (`G-...`).
- `PUBLIC_ADSENSE_CLIENT`: the complete AdSense client/publisher value (`ca-pub-...`).
- `PUBLIC_ADSENSE_SLOT`: the numeric `data-ad-slot` value from the responsive display ad unit.

Clicks on elements carrying `data-ga` are reported as the GA4 event `ui_interaction`, with `interaction_name` set to the attribute value and `link_url` included for links. The delegated listener only emits events after Analytics consent has been granted.

Development uses `dangerous-clean-slate` because `/dev/` is an isolated preview target. Production leaves it disabled so server-owned directories such as `/old/` and `/signatures/` are preserved. The isolation of `FTP_TARGET_DIR` between GitHub Environments remains a required deployment safeguard.
