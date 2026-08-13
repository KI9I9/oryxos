# Implementation Plan: New OryxOS Website

**Branch**: `002-oryxos-website` | **Date**: 2026-08-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-oryxos-website/spec.md`

## Summary

Build a completely new bilingual OryxOS public website as an independent static VitePress project under
`website/`. English is served from the site root and Simplified Chinese from `/zh/`; all public paths are
compatible with the GitHub Pages project base `/oryxos/`. The site extends the VitePress default theme with
a custom light enterprise landing page, capability-status presentation, locale-aware 404 experience, and an
original foundational brand asset set.

Product claims are governed through machine-readable page, capability, claim, evidence, and discrepancy
manifests. Dedicated documentation pages cover both verified behavior and target designs without presenting
unfinished features as runnable. Pull requests receive automated static-build, content-contract, browser,
accessibility, and responsive checks. GitHub Pages deployment remains manual-only and produces a no-index
validation site until blocking documentation discrepancies are resolved by a separate feature.

## Technical Context

**Language/Version**: Node.js 24 LTS; TypeScript; Vue single-file components; Markdown content

**Primary Dependencies**: VitePress, Vue 3, TypeScript, `vue-tsc`, Playwright, and
`@axe-core/playwright`; exact compatible versions are resolved by npm and committed in `package-lock.json`

**Storage**: Repository-owned Markdown, JSON/YAML governance manifests, TypeScript configuration, and
SVG/PNG static assets; no database, remote CMS, browser persistence, or runtime data service

**Testing**: VitePress production build and dead-link checks; Node.js `node:test` for custom validators;
Playwright against `vitepress preview`; axe accessibility scans; manual bilingual, 200% zoom, focus-quality,
claim-accuracy, external-link, and release-review checks

**Target Platform**: GitHub Pages project site hosted below `/oryxos/`, with evergreen desktop and mobile
browsers; build and CI run on Linux with Node.js 24 LTS

**Project Type**: Independent bilingual static documentation and official open-source project website

**Performance Goals**: Pre-render all core content into HTML; make core navigation and information usable
without a Runtime service or runtime data fetch; add no analytics, externally hosted fonts, CMS SDK, or other
blocking third-party script

**Constraints**: English root locale, Chinese `/zh/`, clean project-path URLs, light-only visual system,
WCAG 2.2 AA, keyboard operation, 320–1440 CSS-pixel responsive coverage, 200% zoom review, SSR-compatible
theme code, no internal OryxOS API calls, no use of `.website.bak`, no modification of README or existing
authoritative documents

**Scale/Scope**: 18 required pages per locale (36 localized pages), explicit locale fallback pages, one
locale-aware GitHub Pages 404 document, five primary navigation destinations, thirteen documentation topics,
four capability states, and a foundational logo/wordmark/favicon/social/diagram asset set

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

### Pre-research gate

| Constitution requirement | Plan response | Status |
|---|---|---|
| `website/` is an independent Node.js 24 LTS, npm, VitePress, Vue 3, TypeScript static project | The source tree, package lifecycle, CI, and deployment are isolated under `website/` and website-specific workflows | PASS |
| Commit `package-lock.json`; use `npm ci` and `npm run docs:build` | Lockfile and both commands are mandatory implementation and CI artifacts | PASS |
| Website is not a Maven module or Runtime JAR asset | Root `pom.xml` and all Runtime modules remain outside this feature | PASS |
| No server runtime, CMS, database, login, user storage, or Runtime dependency | Build-time SSG produces only static files and performs no runtime API access | PASS |
| Claims use Available / In development / Planned / Vision and match verifiable evidence | Central claim/evidence manifests and fixed incomplete-capability page sections enforce this | PASS |
| README and authoritative-document conflicts become explicit follow-up work | A discrepancy register records conflicts; this feature does not edit those documents | PASS |
| English/Chinese semantic parity, keyboard use, WCAG AA, responsive and metadata checks | Route manifest, content validator, Playwright, axe, and manual release review cover each gate | PASS |
| No secrets, private data, internal addresses, tracking, or privileged Runtime calls | Static source and build validators prohibit these classes of content and behavior | PASS |
| Spec-Driven Development with one active feature | Active feature is `specs/002-oryxos-website` and no implementation begins before tasks | PASS |

### Post-design gate

Phase 1 artifacts preserve all pre-research decisions. Route, locale, content-governance, brand, SEO,
validation-deployment, and data contracts define testable enforcement points without introducing a backend or
coupling to Maven. The public Agent concept is documented as `Skill + Profile = Agent`, while the Profile stays
the authoritative runtime configuration entry that declares or references its Skill; the remaining wording
difference with the current Constitution is recorded as a formal-publication discrepancy rather than silently
overriding governance. **Result: PASS for implementation planning; formal publication remains gated by the
discrepancy register.**

## Project Structure

### Documentation (this feature)

```text
specs/002-oryxos-website/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── discrepancy-register.yaml
├── quickstart.md
├── checklists/
│   └── requirements.md
├── contracts/
│   ├── route-map.md
│   ├── content-governance.md
│   ├── locale-parity.md
│   ├── brand-assets.md
│   └── seo-and-deployment.md
└── tasks.md             # Created later by /speckit-tasks
```

### Source Code (repository root)

```text
website/
├── .nvmrc
├── .npmrc
├── package.json
├── package-lock.json
├── tsconfig.json
├── env.d.ts
├── index.md
├── architecture.md
├── roadmap.md
├── community.md
├── 404.md
├── translation-unavailable.md
├── docs/
│   ├── index.md
│   ├── concepts/
│   ├── project/
│   ├── getting-started/
│   ├── runtime/
│   ├── interfaces/
│   └── contributing.md
├── zh/                  # Exact route mirror of the English content tree
├── data/
│   ├── pages.json
│   ├── capabilities.json
│   ├── claims.json
│   ├── evidence.json
│   └── external-links.json
├── public/
│   ├── brand/
│   ├── icons/
│   ├── diagrams/
│   ├── social/
│   └── robots.txt
├── scripts/
│   ├── check-content.mjs
│   └── verify-build.mjs
├── tests/
│   ├── scripts/
│   └── e2e/
├── playwright.config.ts
└── .vitepress/
    ├── config/
    └── theme/

.github/workflows/
├── website-ci.yml       # Path-filtered validation; never deploys
└── deploy-pages.yml     # workflow_dispatch only; protected manual deployment
```

**Structure Decision**: Use one independent static-site project under `website/`, extend the VitePress default
theme rather than replacing it, mirror English and Chinese content paths, keep long-form localized content in
Markdown, and centralize machine-verifiable routes and claims in small repository-owned manifests. Automated
tests validate the generated static output rather than coupling tests to the development server. Runtime Java
modules and Maven configuration are not part of the implementation surface.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No Constitution violations require an exception. The route and evidence manifests add governance complexity,
but they directly implement mandatory bilingual parity and claim-truthfulness requirements and use plain static
files plus Node standard-library validation rather than a service or framework.
