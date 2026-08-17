# Implementation Plan: OryxOS Website Visual Prototype

**Branch**: `002-oryxos-website` | **Date**: 2026-08-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-oryxos-website/spec.md`

## Summary

Build a completely new bilingual OryxOS website visual prototype as an independent static VitePress project under
`website/`. English is served from the site root and Simplified Chinese from `/zh/`; local production preview
simulates the future GitHub Pages base `/oryxos/`. The prototype extends the VitePress default theme with a custom
light enterprise landing page, reusable page forms, capability-status visual treatments, locale-aware recovery,
and an original foundational brand asset set.

The implementation prioritizes visual hierarchy, navigation, responsiveness, accessibility basics, and bilingual
page structure. Long-form copy may be provisional when every affected page is visibly labeled as a draft visual
prototype and does not claim unverified behavior is runnable or available. This Feature disables public Pages
deployment; final content verification, authoritative-document alignment, canonical SEO, and publication are
deferred to a separate Feature.

## Technical Context

**Language/Version**: Node.js 24 LTS; TypeScript; Vue single-file components; Markdown content

**Primary Dependencies**: VitePress, Vue 3, TypeScript, `@types/node`, `vue-tsc`, `@playwright/test`,
`@axe-core/playwright`, `yaml`, and `@resvg/resvg-js`; exact compatible versions are resolved by npm and committed
in `package-lock.json`

**Storage**: Repository-owned Markdown, a JSON page manifest, YAML discrepancy tracking, TypeScript
configuration, and reproducibly exported SVG/PNG static assets; no database, remote CMS, browser persistence, or
runtime data service

**Testing**: VitePress production build and dead-link checks; Node.js `node:test` for route, draft-label, workflow,
and asset validators; locked Playwright Chromium validation in CI and local review against `vitepress preview`;
axe accessibility scans; manual bilingual, 200% zoom, focus-quality, visual-consistency, and prototype-copy review

**Target Platform**: Local and CI-hosted static build preview below `/oryxos/`, with evergreen desktop and mobile
browsers; build and CI run on Linux with Node.js 24 LTS; no public hosting in this Feature

**Project Type**: Independent bilingual static website and documentation visual prototype

**Performance Goals**: Pre-render every route into HTML; keep core navigation and layout usable without a Runtime
service or runtime data fetch; add no analytics, externally hosted fonts, CMS SDK, or blocking third-party script

**Constraints**: English root locale, Chinese `/zh/`, clean project-path URLs, light-only visual system,
WCAG 2.2 AA, keyboard operation, 320-1440 CSS-pixel responsive coverage, 200% zoom review, SSR-compatible theme
code, visible draft labels on provisional pages, no internal OryxOS API calls, no public deployment, no use of
`.website.bak`, and no modification of README or existing authoritative documents

**Scale/Scope**: 18 required page forms per locale (36 localized routes), explicit locale fallback pages, one
hidden English-only fallback test Page, one bilingual site-level 404 document, five primary navigation
destinations, thirteen documentation templates, a visual legend for four capability states, and a foundational
logo/wordmark/favicon/social/diagram asset set

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

### Pre-research gate

| Constitution requirement | Plan response | Status |
|---|---|---|
| `website/` is an independent Node.js 24 LTS, npm, VitePress, Vue 3, TypeScript static project | The source tree, package lifecycle, CI, and non-deployment artifact workflows are isolated under `website/` and website-specific files | PASS |
| Commit `package-lock.json`; use `npm ci` and `npm run docs:build` | Lockfile and both commands are mandatory implementation and CI artifacts | PASS |
| Website is not a Maven module or Runtime JAR asset | Root `pom.xml` and all Runtime modules remain outside this feature | PASS |
| No server runtime, CMS, database, login, user storage, Runtime build, or Runtime dependency | Build-time SSG produces only static files; the Feature consumes no new Runtime build evidence and performs no Runtime API access | PASS |
| Product claims use Available / In development / Planned / Vision and match verifiable evidence | Prototype pages use visible draft labels and do not assign a state to a real capability; the state component is demonstrated through a non-claim legend | PASS |
| README and authoritative-document conflicts do not create a public contradiction | The prototype is not publicly deployed, uses conservative draft copy, and records final-content work in the discrepancy register | PASS |
| English/Chinese semantic parity, keyboard use, WCAG AA, responsive and metadata checks | Route manifest, content validator, Playwright, axe, and local prototype review cover each gate | PASS |
| No secrets, private data, internal addresses, tracking, or privileged Runtime calls | Static source and build validators prohibit these classes of content and behavior | PASS |
| Spec-Driven Development with one active feature | Active feature is `specs/002-oryxos-website` and no implementation begins before tasks | PASS |

### Post-design gate

Phase 1 artifacts define testable route, locale, prototype-copy, brand, accessibility, and local-preview contracts
without introducing a backend, coupling to Maven, or publishing to a public address. Architecture copy now follows
Principle VIII: one YAML Profile completely defines an Agent and may declare or reference a Skill loaded as prompt
context. **Result: PASS for visual-prototype implementation. Public content finalization and deployment remain
outside this Feature and require a new Constitution-compliant Feature.**

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
├── test-fixtures/
│   └── locale-fallback.md  # Hidden optional Page for real fallback-path validation
├── data/
│   ├── pages.json
│   ├── prototype-content.json
│   ├── external-links.json
│   └── prototype-review.json
├── public/
│   ├── brand/
│   ├── icons/
│   ├── diagrams/
│   └── social/
├── scripts/
│   ├── check-content.mjs
│   ├── check-workflows.mjs
│   ├── export-assets.mjs
│   ├── verify-assets.mjs
│   └── verify-build.mjs
├── tests/
│   ├── scripts/
│   └── e2e/
├── playwright.config.ts
└── .vitepress/
    ├── config/
    └── theme/

.github/workflows/
├── website-ci.yml       # Path-filtered build and browser validation; never deploys
└── website-prototype-artifact.yml  # Manual ordinary artifact build; never deploys
```

**Structure Decision**: Use one independent static-site project under `website/`, extend the VitePress default
theme rather than replacing it, mirror English and Chinese content paths, keep provisional localized copy in
Markdown, and centralize route relationships plus draft-label expectations in small repository-owned manifests.
Automated tests validate generated static output rather than the development server. Runtime Java modules, Maven
verification, public deployment, and final content publication are not part of the implementation surface.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No Constitution violations require an exception. Draft-label and route manifests use plain static files and local
validation rather than a service, Runtime build, or public deployment.
