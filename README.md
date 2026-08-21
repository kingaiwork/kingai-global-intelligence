# KINGAI Global Intelligence

**See the world through evidence, not headlines.**

KINGAI Global Intelligence is a public, evidence-linked global intelligence product for people who need a clearer way to compare countries, understand fast-moving risk, inspect media coverage and trace conclusions back to transparent public sources.

**Live product:** https://intel.kingai.work/  
**Business, research & strategic collaboration:** vip@kingai.work

> This repository contains only the public delivery surface and sanitized published intelligence. Private collection systems, proprietary scoring implementation, unpublished evidence, credentials, internal automation, infrastructure topology and security controls remain private.

## Why people use it

Global information is abundant but difficult to compare. A single headline can exaggerate a trend, a ranking can hide its assumptions, and a high volume of coverage can be mistaken for proof.

KINGAI Global Intelligence is designed around a different experience:

- compare countries under the same public framework;
- separate structural conditions from fast-moving risk;
- see evidence coverage instead of pretending missing data is certainty;
- inspect source provenance and methodology;
- explore multilingual media signals without treating media volume as truth;
- keep public scoring rules consistent across countries;
- make uncertainty visible rather than burying it.

The product is intended to help users understand context faster, not to replace primary-source verification or professional judgment in high-stakes decisions.

## Who it is for

### Individuals and travelers
Use country profiles and comparison views to build a broader picture of safety, wellbeing, governance, expression and live risk before making plans or learning about a place.

### Researchers and students
Use versioned methodology, source provenance and public snapshots as a transparent starting point for comparative research.

### Journalists, creators and media teams
Use cross-source media views, topic clusters and source diversity to understand how a story is spreading without confusing repetition with independent corroboration.

### Companies with international exposure
Use country comparison and risk context as one input for market review, expansion research, supplier analysis, workforce planning and global operations.

### Risk, policy and strategy teams
Use consistent country-level views, evidence coverage and fast-moving signals to accelerate initial screening before deeper diligence.

### Developers and data partners
Use the public static data contract and published source registry to build approved downstream experiences without requiring access to private production systems.

## Product experience

### World ranking and country profiles
Explore countries and territories across a common public framework. Scores are published only where source coverage and validation requirements are satisfied.

### Country comparison
Compare two countries under the same snapshot and methodology instead of mixing unrelated rankings.

### Media intelligence
Explore multilingual media discovery, source diversity, trend acceleration, cross-source clusters, syndication risk and public collection health.

### Methodology
See how indicators are interpreted, how missing data is handled and why raw public discussion does not directly rewrite country scores.

### Source registry
Follow public provenance and understand which source classes contribute to which parts of the experience.

## The product promise

KINGAI Global Intelligence is built around five public principles:

1. **No invented certainty** — missing values stay missing.
2. **Evidence before opinion** — measurable scores come from versioned rules and attributable public data.
3. **Same core rules** — countries are evaluated under a consistent framework.
4. **Uncertainty stays visible** — evidence coverage is shown separately from country performance.
5. **Source volume is not truth** — repeated reporting and public discussion are context signals, not automatic proof.

## Why this can become commercially valuable

The public product is designed to remain useful on its own. Commercial value can grow around higher-frequency professional needs without weakening public transparency.

Potential commercial paths may include:

- professional research workspaces;
- saved watchlists and monitoring;
- organization-level dashboards;
- scheduled intelligence briefs;
- data and API licensing where formally supported;
- custom country, sector or market views;
- enterprise governance and access controls;
- research partnerships;
- media and data partnerships;
- custom intelligence projects built from approved public and licensed sources.

These are commercial directions, not claims that every feature is currently released. Current availability should always be verified through the live product or an approved business discussion.

See [BUSINESS.md](BUSINESS.md) for the full commercial thesis and [USE-CASES.md](USE-CASES.md) for user journeys.

## Why an investor may care

The opportunity is not another static ranking website. The larger product direction is a reusable public-intelligence layer built around:

- comparable country context;
- transparent source provenance;
- continuous publication of sanitized evidence;
- media and event intelligence;
- professional monitoring workflows;
- data products and partner distribution;
- a public trust model that can support deeper paid experiences.

A strong long-term business would be measured by repeat professional use, data usefulness, monitoring depth, enterprise adoption, partner distribution and the ability to create paid workflow value without compromising methodological credibility.

No public material should invent users, revenue, customers, partnerships, funding, certifications or market leadership.

## Public trust boundary

The public repository intentionally explains the product while protecting implementation and operational security.

### Public

- static website UI;
- public country profiles and rankings;
- country comparison;
- global media-intelligence UI;
- bilingual methodology;
- public source registry;
- sanitized/generated JSON snapshots;
- English and Simplified Chinese localization assets;
- PWA/offline shell;
- AI/search-engine readable `llms.txt`;
- public documentation and commercial positioning.

### Private

- private collectors;
- normalization and scoring implementation;
- unpublished evidence;
- credentials;
- internal provider configuration;
- internal automation;
- anti-abuse logic;
- production topology;
- proprietary security controls;
- confidential partner or customer information.

The public repository must not identify private repository locations, private service bindings, credentials, unpublished evidence paths or sensitive internal security implementation.

## Public data publication model

Public data is published one way:

`private production pipeline -> validate -> sanitize -> approved public snapshot -> this repository -> static delivery`

This keeps the public product independently deployable while preventing the public repository from becoming an authority over private collection or production infrastructure.

## Core public pages

- `/` — world ranking, country/territory coverage and product discovery
- `/country.html?c=CHN` — country intelligence profile
- `/compare.html` — compare two countries under the same public snapshot
- `/media.html` — global media intelligence, source discovery and trend context
- `/methodology.html` — bilingual public methodology
- `/sources.html` — public source/evidence registry
- `/llms.txt` — concise machine-readable site and data guide

## Language policy

- Canonical/default language: English (`en`)
- Chinese: Simplified Chinese (`zh-CN`)
- Browser language is detected on first visit.
- A manual language switch overrides auto-detection and is stored locally.
- Public data records use stable country codes; labels are localized at render time.

## Static data contract

Generated public data is written under `data/`.

### Global and country data

- `data/manifest.json` — build metadata and freshness
- `data/countries.json` — country/territory metadata and public context indicators
- `data/rankings.json` — published KINGAI index values only
- `data/confidence.json` — evidence coverage confidence, not country performance
- `data/events/latest.json` — sanitized recent event evidence
- `data/internet/latest.json` — public network-interference signals
- `data/assessments/latest.json` — attributable institutional, technical and official assessments
- `data/discourse/latest.json` — unverified public web/social discourse with direct score weight 0
- `data/sources.json` — public source provenance and runtime source status

### Media-intelligence data

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

The repository validation workflow checks required pages/assets, parses public JSON/i18n documents and rejects unsafe or malformed public material such as:

- private repository paths or internal topology markers;
- private keys or access-token patterns;
- raw/private/unpublished directories;
- credentials or secret-like assignments;
- malformed public JSON;
- missing critical static-site assets.

## Production delivery

- Canonical production site: https://intel.kingai.work/
- Canonical public source: this repository's `main` branch
- Preferred delivery: Git-integrated static hosting
- Build command: `npm run build`
- Build output directory: `dist`

Provider-specific recovery and private production controllers remain outside this public repository.

A successful commit or build is not production proof; the canonical domain should be smoke-tested after deployment.

## Explore the business and trust model

- [BUSINESS.md](BUSINESS.md) — commercial opportunity, monetization directions and investor lens
- [USE-CASES.md](USE-CASES.md) — practical user, research and business journeys
- [TRUST.md](TRUST.md) — public methodology, claims and disclosure boundary
- [methodology.html](methodology.html) — live public methodology page

## License and attribution

Source-specific licensing and attribution requirements must be preserved in `data/sources.json` and public methodology. The KINGAI composite methodology is versioned so every published score can be traced to a methodology version and source snapshot.

## Strategic collaboration

For research, data, enterprise, distribution, media or investment discussions:

**vip@kingai.work**
