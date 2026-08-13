# Research: New OryxOS Website

**Feature**: `002-oryxos-website`

**Date**: 2026-08-14

## Decision 1: Static-site framework and runtime boundary

**Decision**: Use VitePress with Vue 3 and TypeScript under Node.js 24 LTS. Build-time Vue SSR/SSG produces
static HTML, CSS, JavaScript, and assets for GitHub Pages. No Node process exists after deployment.

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
capability states, evidence/limitations summaries, and the locale-aware not-found experience.

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

## Decision 4: Content and capability governance

**Decision**: Keep localized prose in Markdown while central manifests hold page relationships, atomic capability
states, claims, evidence, and approved external links. Capability states are restricted to `available`,
`in-development`, `planned`, and `vision`.

**Rationale**: The same capability appears on the home page, Architecture, Roadmap, and dedicated documentation.
A central machine-readable state prevents contradictory labels while preserving natural localized writing.

Every incomplete capability page uses these visible sections:

1. Publication state
2. Verified current behavior
3. Target design
4. Known limitations
5. What is not currently available
6. Related evidence and concepts

**Alternatives considered**:

- **Frontmatter-only status**: easy to author but duplicates capability state across multiple pages.
- **All content in JSON**: makes bilingual long-form editing and review unnecessarily difficult.
- **Build-time GitHub API or CMS**: breaks offline reproducibility and introduces external service dependencies.

## Decision 5: Documentation discrepancy handling

**Decision**: Store a structured discrepancy register in the Feature artifacts. Website implementation may show
only verified claims; it does not edit README or existing authoritative documents. Any conflict that would create
contradictory public facts blocks formal publication until a separate feature resolves it.

**Rationale**: The source tree currently verifies fewer runtime capabilities than existing public prose claims.
The Feature explicitly excludes modifying those documents, so the discrepancy register is the traceable handoff
mechanism required by Constitution v1.1.0.

**Alternatives considered**:

- **Copy README claims into the website**: violates content truthfulness.
- **Silently use website wording and ignore repository conflicts**: violates the documentation consistency gate.
- **Expand Feature 002 to rewrite all documents**: rejected by clarification; it would obscure the website scope.

## Decision 6: Brand asset strategy

**Decision**: Create original SVG source assets for the logo mark, English wordmark, horizontal lockup, and
architecture diagrams. Export required raster variants for browser icons and localized 1200×630 social images.

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
3. Playwright against `vitepress preview`, with Chromium on pull requests and a full browser matrix for manual
   release validation.
4. `@axe-core/playwright` plus manual bilingual, zoom, focus-quality, contrast, external-link, and claim review.

**Rationale**: This validates the deployable static output rather than a development server. Node scripts are
enough for deterministic manifests, while Playwright covers project-base routing, deep links, browser behavior,
metadata, responsive behavior, and keyboard workflows.

**Alternatives considered**:

- **Vitest**: deferred until custom Vue logic becomes complex enough to justify another runner.
- **Cypress or Pa11y**: overlaps Playwright and axe.
- **Lighthouse score as a hard gate**: environment-sensitive and less precise than direct assertions.
- **Every-width visual snapshots**: high-maintenance and noisy for a bilingual content site.
- **`ignoreDeadLinks: true`**: directly violates the link-integrity requirement.

## Decision 9: Automated versus manual checks

**Decision**: Automate reproducible structural facts and keep semantic judgments in release review.

**Automated blocking checks**:

- reproducible install, type checking, content validators, and static build;
- route/page parity and allowed capability states;
- expected output files, 404, brand assets, and `/oryxos/` base handling;
- title, description, Open Graph metadata, language attributes, and image alt attributes;
- internal navigation, locale switching, keyboard activation, axe findings, browser errors, failed site requests;
- representative viewport/breakpoint overflow checks.

**Manual release checks**:

- actual English/Chinese semantic equivalence;
- claim accuracy and discrepancy review;
- meaningful alternative text and diagram comprehension;
- visual focus clarity and real browser 200% zoom in Chrome and Firefox;
- interactive-state contrast and final responsive composition;
- external GitHub/community links and brand originality.

**Rationale**: Translation meaning, truthful product claims, useful alt text, and true browser zoom cannot be
reliably certified by deterministic scripts alone.

## Decision 10: CI and GitHub Pages deployment

**Decision**: Add a path-filtered website validation workflow that never deploys. Convert the existing Pages
workflow to `workflow_dispatch` only, use Node.js 24 from the repository version file, validate and build before
upload, and require approval through the protected `github-pages` Environment.

Manual deployment records must identify the source commit, release-review record, discrepancy snapshot, and
explicit acknowledgement that the validation URL may be public. Validation deployments use `noindex` and a
disallowing `robots.txt`.

**Rationale**: Automatic validation gives rapid feedback; manual protected deployment enforces the clarified
publication boundary. `noindex` reduces accidental discovery but is not treated as access control.

**Alternatives considered**:

- **Deploy on every main push**: explicitly rejected by the Feature.
- **No Pages deployment at all**: prevents validating the real project base and deep-link behavior.
- **Rely only on `workflow_dispatch` without Environment approval**: manual start is not equivalent to release
  authorization.

## Decision 11: SEO and social metadata

**Decision**: Generate localized title, description, canonical URL, `hreflang`, Open Graph, and Twitter metadata
from frontmatter plus shared configuration. Use absolute social URLs under the confirmed Pages origin. During the
validation phase, emit `noindex,nofollow,noarchive` and a fully disallowing `robots.txt`.

**Rationale**: Central generation avoids metadata drift and supports equivalent locale URLs. Validation content
must not be intentionally indexed before formal publication blockers are resolved.

**Alternatives considered**:

- **Hand-author all metadata on every page**: repetitive and error-prone.
- **Canonicalize Chinese pages to English**: incorrectly collapses distinct localized content.
- **Treat robots rules as privacy**: rejected because public Pages URLs remain accessible.

## Decision 12: Search

**Decision**: Do not include search in the first release. Reassess VitePress local search after content and
Chinese tokenization needs are observed.

**Rationale**: The first-release navigation and documentation scope are manageable without search, and omitting it
avoids external services, credentials, indexing drift, and additional client assets.

**Alternatives considered**:

- **Algolia**: external account, network, indexing, and privacy surface.
- **Immediate local search**: possible, but not required by the Spec and should first be validated for Chinese
  usefulness.
