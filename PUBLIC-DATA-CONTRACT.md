# KINGAI Global Intelligence — Public Data Contract

**Canonical product:** https://intel.kingai.work/  
**Reviewed against the current private publication authority:** 2026-08-20

This document describes what the public product publishes and how downstream users should interpret it. It deliberately does **not** expose private collectors, unpublished evidence, credentials, proprietary scoring implementation, internal automation, provider configuration, private topology or anti-abuse/security internals.

## Publication principle

The public product receives only approved, sanitized output.

Conceptually:

**public sources → private validation/normalization/analysis → sanitization → approved static public snapshot → public repository → static delivery**

The public repository is a delivery and transparency surface. It is not the authority over private collection systems.

## Current public data families

### Global/country foundation

`/data/manifest.json`  
Snapshot/build metadata, public freshness and version context.

`/data/countries.json`  
Country/territory metadata and approved public context fields.

`/data/rankings.json`  
Published KINGAI index values only where methodology/source requirements are met.

`/data/confidence.json`  
Evidence-coverage confidence. This describes how much appropriate evidence is available; it is **not** a country-quality score.

### Event / evidence context

`/data/events/latest.json`  
Sanitized recent event evidence.

`/data/internet/latest.json`  
Public network/internet-interference evidence where available.

`/data/assessments/latest.json`  
Attributable institutional, technical, NGO, official or other approved assessments.

`/data/discourse/latest.json`  
Unverified public-web/social discourse used as context only. Direct country-score weight is 0.

### Media intelligence

`/data/media/latest.json`  
Normalized public media evidence.

`/data/media/global-news.json`  
Multilingual global media discovery output.

`/data/media/sources.json`  
Public media-source directory/metadata.

`/data/media/manifest.json`  
Media snapshot metadata and coverage context.

`/data/media/health.json`  
Public collection-health summary.

`/data/media/clusters.json`  
Cross-source story/event clusters.

`/data/media/syndication.json`  
Near-duplicate, republication and syndication context.

`/data/media/domain-index.json`  
Discovered public media-domain index.

`/data/media/coverage.json`  
Country/language media-coverage gaps.

`/data/media/trends.json`  
Topic acceleration and source-diversity trend context.

`/data/media/country-index.json`  
Media evidence carrying explicit country relationships.

## Non-negotiable interpretation rules

### 1. Missing remains missing
If required evidence is unavailable, the public system must preserve missing/null state rather than manufacture a score.

### 2. AI does not invent measured scores
AI may help classify, summarize or organize evidence, but published measured country scores must come from versioned methodology and attributable data—not generated guesses.

### 3. Raw media/discourse does not directly change country scores
Raw news, videos, public posts and general media volume have direct country-score weight **0**. They provide event/context signals and can guide further evidence review.

### 4. Source breadth is not truth
Multiple sources mentioning a story can measure breadth of reporting. It does not automatically prove the underlying claim.

### 5. Syndication is treated separately
Near-duplicate or syndicated copies of one original story should not be counted as fully independent corroboration.

### 6. Source context is not a truth score
Publisher ownership, location or source-class labels describe context. They must not automatically become a universal reliability/truth rating.

### 7. Evidence coverage is not country performance
High evidence coverage means more/stronger available evidence under the methodology. It does not mean a country is better or worse.

### 8. Same core methodology
Countries covered by the same indicators/source classes are evaluated using the same core rules. Country names, political preference or media attention should not change the underlying method.

## Stable identifiers

Public country identity should rely on stable ISO country/territory codes rather than translated names. User-interface labels may be localized while underlying identifiers remain stable.

## Freshness and provenance

Downstream users should inspect:
- snapshot/manifest freshness;
- source dates;
- methodology version;
- evidence coverage;
- source links/provenance;
- whether a signal is structural, live-risk, institutional assessment, technical evidence, media or discourse.

A numeric value without freshness/methodology/provenance context should not be treated as self-explanatory truth.

## Recommended downstream use

Good uses include:
- country comparison as an initial screening layer;
- research starting points;
- media/narrative comparison;
- market/supplier/workforce context;
- strategy/risk triage;
- approved data visualization;
- monitoring/history products where formally licensed and released.

High-stakes legal, immigration, medical, safety, security, investment or government decisions should verify primary evidence and use appropriate professional expertise.

## Professional and data-product direction

Public transparency should remain useful without payment. Commercial value can grow around workflow depth such as:
- recurring monitoring;
- historical depth;
- scheduled briefs;
- organization workspaces;
- stable data delivery;
- exports/API where formally released;
- custom views/research;
- support and appropriate licensing.

These are directions unless current product evidence or a formal agreement confirms availability.

## Public/private boundary

### Public
- approved static UI;
- sanitized static snapshots;
- methodology;
- source roles and public provenance;
- safe schema/data contracts;
- commercial/use-case documentation.

### Private
- collectors/adapters not intended for public source;
- credentials and API keys;
- unpublished/raw evidence;
- proprietary normalization/scoring implementation;
- internal automation/provider configuration;
- private infrastructure topology;
- anti-abuse/security internals;
- confidential customer/partner data.

## Integrity

Do not infer or invent users, customers, revenue, partnerships, funding, certifications, market leadership or capabilities not supported by the current public product.
