# KINGAI Global Intelligence

Public, static-first frontend and published data for the KINGAI global intelligence project.

## Architecture

This repository is intentionally public and contains only material safe for public release:

- static website UI
- public country profiles and rankings
- public methodology and source registry
- sanitized/generated JSON snapshots
- English and Chinese localization assets

Private collectors, normalization logic, scoring internals, unpublished evidence, credentials, and automation live in the private `kingai-intelligence-core` repository.

## Language policy

- Canonical/default language: English (`en`)
- Chinese: Simplified Chinese (`zh-CN`)
- Browser language is detected on first visit.
- A manual language switch always overrides auto-detection and is stored locally.
- Public data records use stable ISO country codes; labels are localized at render time.

## Static data contract

Generated public data is written under `data/`.

- `data/manifest.json` — build metadata and data freshness
- `data/countries.json` — country/territory metadata
- `data/rankings.json` — published index values only
- `data/events/latest.json` — sanitized recent events
- `data/sources.json` — public source provenance

No score should be invented when a source is missing. Missing values must remain `null` and show as “Data unavailable”.

## Deployment

Designed for GitHub + Cloudflare Pages with no runtime database and no required server-side API.

The private core repository periodically fetches and validates upstream datasets, generates sanitized static JSON, and publishes only approved outputs into this repository.

## License and methodology

Source-specific licensing and attribution requirements must be preserved in `data/sources.json` and the methodology pages. The KINGAI composite methodology should be versioned so every published score can be traced to a methodology version and source snapshot.
