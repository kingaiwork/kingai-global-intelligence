# KINGAI Global Intelligence

Public, static-first frontend and published intelligence snapshots for KINGAI Global Intelligence.

## Production delivery

- Canonical production site: https://intel.kingai.work/
- Canonical source for the public delivery surface: this repository's `main` branch.
- Preferred deployment path: Cloudflare Pages Git integration.
- Build command: `npm run build`
- Build output directory: `dist`
- A Direct Upload workflow exists only as an explicit disaster-recovery/fallback path.

The public site must remain independently deployable and must not require a VPS, a private runtime service, or access to unpublished intelligence data.

## Public/private boundary

This repository is intentionally public. It contains only material approved for public release:

- static website UI;
- public country profiles and rankings;
- global media intelligence UI;
- country comparison;
- bilingual methodology and public source registry;
- sanitized/generated JSON snapshots;
- English and Simplified Chinese localization assets;
- installable PWA/offline shell with network-first live-data caching;
- AI/search-engine readable `llms.txt`.

Private collectors, normalization logic, scoring implementation, unpublished evidence, credentials, anti-abuse logic and internal automation remain in the private production pipeline. This public repository must not identify private repository locations, internal topology, private provider bindings, credentials, unpublished evidence paths or internal security implementation.

Public data publication is one-way:

`private production pipeline -> normalize -> validate -> sanitize -> public snapshot -> this repository -> static CDN`

## Core public pages

- `/` — global country/territory ranking and evidence coverage
- `/country.html?c=CHN` — country intelligence profile
- `/compare.html` — compare two countries under the same public snapshot
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
- `data/internet/latest.json` — public network-interference signals
- `data/assessments/latest.json` — attributed institutional, technical and official assessments
- `data/discourse/latest.json` — unverified public web/social discourse with direct score weight 0
- `data/sources.json` — public source provenance and runtime source status

### Media intelligence data

- `data/media/latest.json` — normalized public media evidence
- `data/media/global-news.json` — multilingual global media discovery
- `data/media/sources.json` — public source directory
- `data/media/manifest.json` — media snapshot coverage
- `data/media/health.json` — public collection health summary
- `data/media/clusters.json` — cross-source story clusters
- `data/media/syndication.json` — near-duplicate/republication risk
- `data/media/domain-index.json` — discovered public media domains
- `data/media/coverage.json` — country/language coverage gaps
- `data/media/trends.json` — topic acceleration and source diversity
- `data/media/country-index.json` — media evidence with explicit country links

## Evidence rules

1. No country score is invented when source data is missing. Missing values remain `null`.
2. Raw news, videos, public posts and media volume have direct score weight `0`.
3. Publisher ownership labels describe source context; they are not reliability scores.
4. Multiple domains reporting a similar story measure source breadth, not factual truth.
5. Syndicated copies of the same wire story must not be treated as fully independent corroboration.
6. Government responses and external critical assessments remain separately attributable.
7. Evidence coverage confidence measures how much public evidence exists, not whether a country is good, free, safe or rights-respecting.
8. All countries use the same source-class and scoring rules when adapters support them.

## Public repository safety gate

The repository validation workflow checks required pages/assets, parses all public JSON/i18n documents and rejects:

- private repository paths or internal topology markers;
- private keys or GitHub access-token patterns;
- raw/private/unpublished directories;
- credentials or secret-like assignments;
- malformed public JSON;
- missing critical static-site assets.

## Deployment recovery

The canonical production path is Git-backed static deployment from `main`. The Direct Upload workflow is intentionally manual-only and may be used for recovery when the normal Git-integrated provider path is unavailable. A successful commit or build is not production proof; the canonical domain must be smoke-tested after deployment.

## License and methodology

Source-specific licensing and attribution requirements must be preserved in `data/sources.json` and public methodology. The KINGAI composite methodology is versioned so every published score can be traced to a methodology version and source snapshot.
