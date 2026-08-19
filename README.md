# KINGAI Global Intelligence

Public, static-first frontend and published intelligence snapshots for the KINGAI global intelligence project.

## Deployment

- Canonical production target: https://intel.kingai.work/
- Cloudflare Pages production mirror: https://os.kingai.work/global-intelligence/
- Source of truth: this repository's `main` branch.

The mirror is isolated under `/global-intelligence/` and does not replace the existing KINGAI OS `/intelligence/` product page. It loads the current public source snapshot while the dedicated `intel.kingai.work` Pages project remains separately deployable.

## Architecture

This repository is intentionally public and contains only material safe for public release:

- static website UI
- public country profiles and rankings
- global media intelligence UI
- country comparison
- bilingual methodology and source registry
- sanitized/generated JSON snapshots
- English and Simplified Chinese localization assets
- installable PWA/offline shell with network-first live-data caching
- AI/search-engine readable `llms.txt`

Private collectors, normalization logic, source adapters, scoring internals, unpublished evidence, credentials, automation and anti-abuse logic live in the private `kingai-intelligence-core` repository.

## Core public pages

- `/` — global country/territory ranking and evidence coverage
- `/country.html?c=CHN` — country intelligence profile
- `/compare.html` — compare any two countries under the same public snapshot
- `/media.html` — global media intelligence, source discovery, trend radar and cross-source analysis
- `/methodology.html` — full bilingual methodology
- `/sources.html` — public source/evidence registry
- `/llms.txt` — concise machine-readable site and data guide

## Language policy

- Canonical/default language: English (`en`)
- Chinese: Simplified Chinese (`zh-CN`)
- Browser language is detected on first visit.
- A manual language switch overrides auto-detection and is stored locally.
- Public data records use stable ISO country codes; labels are localized at render time.

## Static data contract

Generated public data is written under `data/`.

### Global and country data

- `data/manifest.json` — build metadata and freshness
- `data/countries.json` — country/territory metadata and public context indicators
- `data/rankings.json` — published KINGAI index values only
- `data/confidence.json` — evidence coverage confidence, not a country-performance score
- `data/events/latest.json` — sanitized recent event evidence
- `data/internet/latest.json` — OONI network-interference signals
- `data/assessments/latest.json` — attributed institutional, technical and official assessments
- `data/discourse/latest.json` — unverified public web/social discourse with direct score weight 0
- `data/sources.json` — public source provenance and runtime source status

### Media intelligence data

- `data/media/latest.json` — normalized publisher feeds, open web, public social, event links and optional video
- `data/media/global-news.json` — multilingual global media discovery
- `data/media/sources.json` — collector registry and seed outlet directory
- `data/media/manifest.json` — media snapshot coverage
- `data/media/health.json` — collector/feed/query health
- `data/media/clusters.json` — cross-source story clusters
- `data/media/syndication.json` — near-duplicate/republication risk
- `data/media/domain-index.json` — automatically discovered media domains
- `data/media/coverage.json` — country/language coverage gaps
- `data/media/trends.json` — 6h/24h topic acceleration and source diversity
- `data/media/country-index.json` — media evidence with an explicit country link

## Evidence rules

1. No country score is invented when source data is missing. Missing values remain `null`.
2. Raw news, videos, public posts and media volume have direct score weight `0`.
3. Publisher ownership labels describe source context; they are not reliability scores.
4. Multiple domains reporting a similar story measure source breadth, not factual truth.
5. Syndicated copies of the same wire story must not be treated as fully independent corroboration.
6. Government responses and external critical assessments remain separately attributable.
7. Evidence coverage confidence measures how much public evidence exists, not whether a country is good, free, safe or rights-respecting.
8. All countries use the same source-class and scoring rules when adapters support them.

## Static-site validation

`.github/workflows/static-site-check.yml` runs on pushes and pull requests. It checks required pages/assets, parses all public JSON/i18n documents and verifies basic HTML requirements before deployment.

## Dedicated Cloudflare Pages deployment

`.github/workflows/deploy-cloudflare-pages.yml` can deploy this repository as a Direct Upload Cloudflare Pages site using Wrangler. It builds a clean `_site` directory and excludes repository-only files.

Required GitHub Actions secrets for the dedicated project:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Optional repository variable:

- `CLOUDFLARE_PAGES_PROJECT` — defaults to `kingai-global-intelligence` when omitted.

The private core publication pipeline remains separate: it periodically generates validated public `data/` snapshots and can push them into this repository using its own restricted `PUBLIC_REPO_TOKEN`.

## Runtime model

Production remains static:

`private collectors -> validate/normalize -> sanitized JSON -> public GitHub repository -> Cloudflare Pages CDN -> browser-side rendering`

No runtime database or mandatory server-side API is required for the public site.

## License and methodology

Source-specific licensing and attribution requirements must be preserved in `data/sources.json` and public methodology. The KINGAI composite methodology is versioned so every published score can be traced to a methodology version and source snapshot.
