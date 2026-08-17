# Research: OryxOS Website Visual Prototype

**Feature**: `002-oryxos-website`

**Date**: 2026-08-14

## Decision 1: Static-site framework and runtime boundary

**Decision**: Use VitePress with Vue 3 and TypeScript under Node.js 24 LTS. Build-time Vue SSR/SSG produces
static HTML, CSS, JavaScript, and assets that are locally previewed below the future GitHub Pages project base. No
Node process or public deployment is part of the completed Feature.

**Rationale**: The product surface combines a branded landing page with a substantial bilingual documentation
tree. VitePress already provides Markdown rendering, build-time SSR, locale-aware navigation, documentation
sidebars, accessibility foundations, and static deployment while allowing focused Vue customization.

**Alternatives considered**:

- **Astro/Starlight**: strong marketing flexibility, but introduces a second component/content model after the
  project already selected VitePress and does not materially improve this documentation-heavy scope.
- **Docusaurus**: mature documentation system but adds React and a larger plugin/runtime surface without a
  project need.
- **Custom Vite SPA**: maximizes visual freedom but loses pre-rendered document semantics and would require the
  team to recreate routing, locale, navigation, and accessibility behavior.

## Decision 2: Extend the VitePress default theme

**Decision**: Extend `DefaultTheme` with a thin custom Layout and focused components for the home page,
capability-state legend, provisional documentation forms, limitations placeholders, and the locale-aware
not-found experience.

**Rationale**: Default-theme navigation, mobile menus, sidebars, outlines, skip links, and keyboard behavior are
mature. Reusing them lowers accessibility and upgrade risk while still permitting an original visual identity.

**Alternatives considered**:

- **Default home template only**: insufficient for the project-status, architecture, and roadmap narrative.
- **Fully custom theme**: duplicates complex navigation and accessibility behavior and creates unnecessary
  maintenance.
- **Replacing VitePress internal components by alias**: rejected because internal component contracts may change
  across minor releases.

## Decision 3: Locale and route architecture

**Decision**: Serve English from the root and Simplified Chinese from an exact `/zh/` mirror. Use stable English
slugs for both locales, a machine-readable page manifest, clean URLs, and `base: '/oryxos/'`.

**Rationale**: Mirrored paths make equivalent-page routing and parity checks deterministic. A route manifest
prevents fragile string replacement and drives navigation, alternate links, validation, and fallback behavior.

**Alternatives considered**:

- **`/en/` plus `/zh/`**: requires a static root redirect and violates the agreed English-root experience.
- **Translated Chinese slugs**: friendlier in isolation but complicates parity, route maintenance, and language
  switching.
- **Two independent builds**: duplicates configuration and makes cross-locale consistency harder.

## Decision 4: Prototype content model

**Decision**: Keep provisional localized prose in Markdown while a small manifest holds page relationships,
global prototype-label requirements, documentation section templates, and approved external links. Demonstrate
Available, In development, Planned, and Vision as a visual legend rather than assigning those states to real
capabilities.

**Rationale**: The user needs to evaluate presentation before final copy exists. A visible draft notice and
machine-checkable page template make provisional content safe without building a premature claim/evidence system.

Every provisional documentation page uses these visible sections:

1. Draft visual prototype notice
2. Overview placeholder
3. Intended design placeholder
4. Status placeholder
5. Limitations placeholder
6. Related navigation

**Alternatives considered**:

- **Full Claim/Evidence registry in the prototype**: too heavy for visual exploration and better handled by the
  later content-publication Feature.
- **All content in JSON**: makes bilingual layout editing unnecessarily difficult.
- **Build-time GitHub API or CMS**: breaks offline reproducibility and introduces external service dependencies.

## Decision 5: Documentation discrepancy handling

**Decision**: Keep a structured discrepancy register in the Feature artifacts, use neutral or visibly provisional
copy in the prototype, and prohibit public deployment. A later Feature owns final copy verification,
authoritative-document reconciliation, and publication.

**Rationale**: The source tree currently verifies fewer runtime capabilities than existing public prose claims.
The prototype should not solve that content program while the user is evaluating visual form, but it must also not
publish contradictory text. Local-only draft labeling provides a safe handoff boundary.

**Alternatives considered**:

- **Copy README claims into the website**: violates content truthfulness.
- **Publicly deploy draft copy with `noindex`**: rejected because noindex is not access control.
- **Expand Feature 002 to rewrite all documents**: rejected because the current goal is visual prototyping.

## Decision 6: Brand asset strategy

**Decision**: Create original SVG source assets for the logo mark, English wordmark, horizontal lockup, and
architecture diagrams. Reproducibly export required raster variants with a locked local SVG renderer.

**Rationale**: SVG is appropriate for scalable marks and diagrams, while PNG remains the reliable format for
Open Graph cards and touch icons. A limited foundational set gives the new site a consistent identity without
turning the Feature into a complete branding program.

**Alternatives considered**:

- **Text-only identity**: does not meet the clarified brand-asset scope.
- **Runtime-generated Canvas/WebGL artwork**: harms static resilience, accessibility, and performance.
- **Third-party icon or illustration packs**: dilute originality and add licensing/supply-chain review.

## Decision 7: CSS, appearance, and client-side dependencies

**Decision**: Use semantic CSS custom properties and plain CSS. Ship a light-only theme in this Feature and keep
custom Vue components SSR-compatible. Do not add Tailwind, Sass, a UI library, state management, animation
libraries, analytics, remote fonts, or a CMS SDK.

**Rationale**: The site has a small, purpose-built component surface. Fewer dependencies improve reproducibility,
reduce CSS conflicts, and narrow the accessibility and security review.

**Alternatives considered**:

- **Tailwind or a component library**: unnecessary build and upgrade surface for a documentation site.
- **Light and dark modes together**: doubles contrast and diagram validation without being part of the agreed
  first-release visual direction.
- **Analytics SDK**: prohibited unless separately approved.

## Decision 8: Quality validation stack

**Decision**: Use four layers:

1. VitePress production build with dead-link checking enabled.
2. Node.js standard-library content and build validators, tested with `node:test`.
3. A locked Playwright Chromium project in CI and local review against `vitepress preview` after an explicit
   production build. Firefox is not part of this visual-prototype approval matrix.
4. `@axe-core/playwright` plus manual bilingual, zoom, focus-quality, contrast, and visual-form review.

**Rationale**: This validates the production-build output rather than a development server. Node scripts are
enough for deterministic manifests, while Playwright covers project-base routing, deep links, browser behavior,
metadata, responsive behavior, and keyboard workflows.

**Alternatives considered**:

- **Vitest**: deferred until custom Vue logic becomes complex enough to justify another runner.
- **Cypress or Pa11y**: overlaps Playwright and axe.
- **Lighthouse score as a hard gate**: environment-sensitive and less precise than direct assertions.
- **Every-width visual snapshots**: high-maintenance and noisy for a bilingual content site.
- **`ignoreDeadLinks: true`**: directly violates the link-integrity requirement.

## Decision 9: Automated versus manual checks

**Decision**: Automate reproducible structural facts and keep semantic and visual judgments in local prototype
review.

**Automated blocking checks**:

- reproducible install, type checking, content validators, and static build;
- route/page parity, draft notices, required page forms, and the four-item visual legend;
- expected output files, 404, brand assets, and `/oryxos/` base handling;
- title, description, Open Graph metadata, language attributes, and image alt attributes;
- internal navigation, locale switching, keyboard activation, axe findings, browser errors, failed site requests;
- representative viewport/breakpoint overflow checks.

**Manual prototype checks**:

- actual English/Chinese semantic equivalence;
- conservative provisional wording and discrepancy review;
- meaningful alternative text and diagram comprehension;
- visual focus clarity and real browser 200% zoom in the locked Playwright Chromium browser;
- interactive-state contrast and final responsive composition;
- external GitHub/community links and brand originality.

**Rationale**: Translation meaning, truthful product claims, useful alt text, and true browser zoom cannot be
reliably certified by deterministic scripts alone.

## Decision 10: CI and GitHub Pages deployment

**Decision**: Add a path-filtered website validation workflow that never deploys. Remove the existing Pages
workflow and replace it with a manually triggered, read-only prototype artifact workflow with no Pages
permissions, `actions/upload-pages-artifact`, or `actions/deploy-pages`. Use Node.js 24 from the repository version
file and upload only a regular CI artifact when manual inspection is needed.

**Rationale**: Automatic validation gives rapid feedback without creating a public website. Public deployment and
repository Environment configuration belong to the later publication Feature.

**Alternatives considered**:

- **Deploy on every main push**: explicitly rejected by the Feature.
- **Manual public validation deployment**: rejected because the prototype contains provisional content.
- **Local preview only without CI**: possible, but a non-deploying CI build catches reproducibility regressions.

## Decision 11: SEO and social metadata

**Decision**: Generate localized title, description, language tags, and basic relative Open Graph/Twitter image
metadata from frontmatter plus shared configuration. Defer public canonical URLs, sitemap hostname, and searchable
indexing configuration until a deployment origin is approved.

**Rationale**: Central generation avoids metadata drift while preventing placeholder production origins from
entering a local-only prototype.

**Alternatives considered**:

- **Hand-author all metadata on every page**: repetitive and error-prone.
- **Canonicalize Chinese pages to English**: incorrectly collapses distinct localized content.
- **Treat robots rules as privacy**: rejected because public Pages URLs remain accessible.

## Decision 12: Search

**Decision**: Do not include search in the visual prototype. Reassess VitePress local search after content and
Chinese tokenization needs are observed.

**Rationale**: The prototype navigation and documentation scope are manageable without search, and omitting it
avoids external services, credentials, indexing drift, and additional client assets.

**Alternatives considered**:

- **Algolia**: external account, network, indexing, and privacy surface.
- **Immediate local search**: possible, but not required by the Spec and should first be validated for Chinese
  usefulness.
