# Tasks: OryxOS Website Visual Prototype

**Input**: Design documents from `/specs/002-oryxos-website/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`, and
`discrepancy-register.yaml`

**Tests**: Focused automated tests are required for routes, bilingual navigation, draft labeling, project-base
behavior, keyboard use, accessibility, responsive overflow, asset generation, and non-deployment policy. Each
story's focused tests are written and observed failing before that story's implementation begins. A failing test
may be fixed in any implementation file owned by the story; tests must not be weakened merely to obtain a pass.

**Prototype boundary**: The goal is to evaluate page presentation and interaction. Provisional copy is allowed
when visibly labeled and conservative. This Feature must not read `.website.bak`, run Runtime Maven verification,
or deploy to GitHub Pages or another public address.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel after its phase prerequisites because it changes different files.
- **[Story]**: Maps the task to a user story from `spec.md`.
- Every task includes exact target paths.

## Phase 1: Setup

**Purpose**: Establish a clean, reproducible VitePress project without restoring or inspecting retired content.

- [x] T001 Create the complete from-scratch source tree under `website/`, including every nested English and Chinese documentation directory, `.vitepress/config/`, `.vitepress/theme/components/`, `.vitepress/theme/styles/`, `test-fixtures/`, `data/`, `public/brand/`, `public/icons/`, `public/diagrams/`, `public/social/`, `scripts/`, `tests/scripts/`, and `tests/e2e/`, without reading or importing `.website.bak`
- [x] T002 Resolve and pin the exact current Node.js 24 LTS release in `website/.nvmrc`, enable strict engine enforcement in `website/.npmrc`, and declare the matching Node range plus npm package manager in `website/package.json`
- [x] T003 Initialize `website/package.json` and generate `website/package-lock.json` with exact compatible VitePress, Vue 3, TypeScript, `@types/node`, `vue-tsc`, `@playwright/test`, `@axe-core/playwright`, `yaml`, and `@resvg/resvg-js` dependencies using Node.js 24
- [x] T004 [P] Configure strict TypeScript and Vue declarations in `website/tsconfig.json` and `website/env.d.ts`
- [x] T005 [P] Create the VitePress entry and delegated configuration with `base: '/oryxos/'`, clean URLs, light-only appearance, and dead-link checking enabled in `website/.vitepress/config.mts` and `website/.vitepress/config/index.ts`
- [x] T006 [P] Configure the locked Playwright Chromium project for CI and local review, running an explicit production build before `vitepress preview` below `/oryxos/`, in `website/playwright.config.ts`
- [x] T007 Update `.gitignore` for website build/test artifacts, remove `.github/workflows/deploy-pages.yml`, and create safe read-only skeletons for `.github/workflows/website-ci.yml` plus `.github/workflows/website-prototype-artifact.yml` that already use `node-version-file: website/.nvmrc`, only `contents: read`, and no deployment actions without reverting unrelated entries

**Checkpoint**: Node/npm metadata and the complete empty source tree are reproducible.

---

## Phase 2: Foundational Prototype Infrastructure

**Purpose**: Make the full route skeleton buildable before navigation or story work, then establish shared theme,
content, asset, and test infrastructure.

**CRITICAL**: No story implementation begins until the complete route skeleton passes the production build.

- [x] T008 [P] Write failing Node tests for route uniqueness, all 18 English/Chinese Page pairs, counterpart templates, every page's draft-notice requirement, documentation section requirements, prohibited runnable interfaces, and any real-capability state assignment in `website/tests/scripts/check-content.test.mjs`
- [x] T009 [P] Write fixture-based failing Node tests for generated-output validation: global localized draft notices, a bilingual prototype notice in `404.html`, unique per-locale titles and descriptions, correct `lang` and `og:locale`, relative counterpart metadata, localized Open Graph/Twitter image-alt metadata, `/oryxos/` asset paths, the bilingual 404 exception, favicon/touch/social assets, and missing internal targets in `website/tests/scripts/verify-build.test.mjs`
- [x] T010 [P] Write failing Node tests that scan all YAML files under `.github/workflows/`, reject Pages write permissions/actions/Environments and public-deployment jobs, reject `id-token: write` in both website workflows, and require both website workflows to use `node-version-file: website/.nvmrc` in `website/tests/scripts/workflow-policy.test.mjs`
- [x] T011 [P] Define all required English/Chinese Page records, fallback records, the hidden optional English-only locale-fallback fixture, the bilingual site-level 404 recovery artifact, templates, content statuses, counterpart relationships, and CTA-purpose keys in `website/data/pages.json`
- [x] T012 [P] Define localized draft notices, provisional section keys, four non-claim capability-legend items, roadmap visual stages, and approved external destinations in `website/data/prototype-content.json` and `website/data/external-links.json`
- [x] T013 Create buildable Markdown skeletons for all 36 required localized routes, both translation fallbacks, the hidden English-only `website/test-fixtures/locale-fallback.md` Page, and the bilingual site-level not-found source at the exact paths in `contracts/route-map.md`; every locale-owned skeleton must declare prototype content status and every documentation skeleton must include the required section headings
- [x] T014 Implement manifest, Markdown, YAML discrepancy, prohibited-content, and workflow-policy validation for T008 and T010 using the `yaml` package in `website/scripts/check-content.mjs` and `website/scripts/check-workflows.mjs`
- [x] T015 [P] Write fixture-based asset-export tests and implement deterministic SVG-to-PNG export, dimension/file-signature checks, and complete required-inventory/manifest-schema validation for asset ID, kind, source, outputs, locale, dimensions, alt key, and ownership with `@resvg/resvg-js` in `website/tests/scripts/export-assets.test.mjs`, `website/scripts/export-assets.mjs`, and `website/scripts/verify-assets.mjs`
- [x] T016 Implement generated-output validation for T009, including an internal route/fragment graph check over built HTML, in `website/scripts/verify-build.mjs`
- [x] T017 Configure shared identity, complete root/`zh` locales, localized labels, full primary navigation, full sidebars, footer behavior, and `/oryxos/` helpers against the existing skeleton routes in `website/.vitepress/config/shared.ts`, `website/.vitepress/config/locales.ts`, and `website/.vitepress/config/navigation.ts`
- [x] T018 [P] Implement localized title, description, language, counterpart, Open Graph, Twitter, favicon, and Apple Touch metadata without a placeholder public canonical origin in `website/.vitepress/config/metadata.ts`
- [x] T019 Extend the default VitePress theme with an SSR-safe wrapper, create empty imported story style entrypoints, and explicitly import `tokens.css`, `base.css`, `default-theme.css`, `responsive.css`, `home.css`, `architecture-roadmap.css`, `locale.css`, `documentation.css`, `community.css`, and `not-found.css` from `website/.vitepress/theme/index.ts`
- [x] T020 Implement the localized draft notice, provisional page shell, capability-state legend, related-navigation, and limitation-placeholder components in `website/.vitepress/theme/components/DraftNotice.vue`, `website/.vitepress/theme/components/PrototypeDocShell.vue`, `website/.vitepress/theme/components/CapabilityLegend.vue`, `website/.vitepress/theme/components/RelatedNavigation.vue`, and `website/.vitepress/theme/components/LimitationsPlaceholder.vue`, then mount the SSR-rendered DraftNotice for every locale-owned page in `website/.vitepress/theme/Layout.vue`
- [x] T021 [P] Define light enterprise tokens, typography, visible focus, reduced motion, base layout, default-theme overrides, and baseline overflow protection in `website/.vitepress/theme/styles/tokens.css`, `website/.vitepress/theme/styles/base.css`, `website/.vitepress/theme/styles/default-theme.css`, and `website/.vitepress/theme/styles/responsive.css`
- [x] T022 [P] Create page-manifest loading, preview-error capture, axe configuration, keyboard helpers, and the 320/375/390/768/1024/1280/1440 viewport matrix in `website/tests/e2e/site-fixtures.ts`, `website/tests/e2e/accessibility.ts`, and `website/tests/e2e/viewports.ts`
- [x] T023 Add `docs:dev`, `docs:typecheck`, `docs:build`, `docs:preview`, `assets:build`, `assets:verify`, `test:scripts`, `test:workflow-policy`, `check:content`, `verify:build`, `test:e2e:ci`, `test:e2e:release`, and `test:quality` commands with build-before-preview ordering in `website/package.json`
- [x] T024 Run script unit tests, workflow-policy tests, type checking, and `docs:build`; fix any foundational regression in the files owned by T011-T023 without disabling dead-link or policy checks, while deferring required production-asset verification until all localized sources exist

**Checkpoint**: Every required route exists, shared navigation is valid, and the complete skeleton builds below
`/oryxos/` before story-specific content work begins.

---

## Phase 3: User Story 1 - Home Presentation (Priority: P1) MVP

**Goal**: Present a distinctive English home page that communicates Java, self-hosting, pre-alpha maturity,
single-node focus, a non-claim state legend, and distributed collaboration as a prose-only long-term direction.

### Tests for User Story 1

- [x] T025 [P] [US1] Write failing Playwright assertions for the global draft notice, five positioning cues, Agent OS comparison, four-state non-claim visual legend, distributed long-term-direction wording without a real state badge, primary CTAs, and keyboard reachability in `website/tests/e2e/home.spec.ts`
- [x] T026 [P] [US1] Write a failing no-JavaScript test proving the home positioning and ordinary links are present in pre-rendered HTML in `website/tests/e2e/static-content.spec.ts`

### Implementation for User Story 1

- [x] T027 [P] [US1] Create original SVG sources for the logo mark, English wordmark, horizontal lockup, monochrome mark, favicon, Apple Touch icon, and English social card in `website/public/brand/*.svg`, `website/public/icons/*.svg`, and `website/public/social/og-default-en.svg`
- [x] T028 [P] [US1] Implement the SSR-rendered hero, positioning, Agent OS comparison, non-claim capability-state legend, architecture preview, long-term-direction boundary, and CTA composition in `website/.vitepress/theme/components/HomeLanding.vue`
- [x] T029 [P] [US1] Replace the English home skeleton with conservative prototype copy and localized metadata in `website/index.md`
- [x] T030 [P] [US1] Implement responsive home presentation, decorative geometry, card hierarchy, and CTA states in the already imported `website/.vitepress/theme/styles/home.css`
- [x] T031 [US1] Integrate `HomeLanding.vue`, manifest data, and brand assets through the existing frontmatter-aware logic in `website/.vitepress/theme/Layout.vue` without changing the global DraftNotice behavior
- [x] T032 [US1] Run a production build, start preview, execute `home.spec.ts` and `static-content.spec.ts`, and fix User Story 1 implementation files until the focused tests pass without weakening assertions

**Checkpoint**: The English home page is a locally reviewable visual MVP.

---

## Phase 4: User Story 2 - Architecture and Roadmap Presentation (Priority: P2)

**Goal**: Present a Constitution-aligned Agent/Profile/Skill relationship, provisional module architecture,
state legend, limitations, and staged roadmap as coherent visual forms.

### Tests for User Story 2

- [x] T033 [P] [US2] Write failing Playwright tests for Profile-defined Agent wording, Skill prompt-context wording, module boundaries, capability legend, roadmap stages, known limitations, and two-action navigation reachability in `website/tests/e2e/architecture-roadmap.spec.ts`

### Implementation for User Story 2

- [x] T034 [P] [US2] Create original accessible system-architecture, Profile/Skill relationship, and ReAct target-design diagrams in `website/public/diagrams/system-architecture.svg`, `website/public/diagrams/agent-skill-profile.svg`, and `website/public/diagrams/react-loop.svg`
- [x] T035 [P] [US2] Implement a data-driven architecture/module presentation in `website/.vitepress/theme/components/ArchitectureMap.vue`
- [x] T036 [P] [US2] Implement a data-driven staged-roadmap component that uses provisional horizons and implies no dates in `website/.vitepress/theme/components/RoadmapTimeline.vue`
- [x] T037 [P] [US2] Replace the English Architecture skeleton with Profile-defined Agent wording, Skill prompt-context explanation, module boundaries, draft architecture, visible limitations, and local imports/rendering for `ArchitectureMap.vue` plus all relevant T034 diagrams in `website/architecture.md`
- [x] T038 [P] [US2] Replace the English Roadmap skeleton with provisional visual horizons for current foundations, active runtime-kernel work, enterprise-hardening goals, the distributed long-term direction, limitations without real capability-state badges, and a local import/rendering for `RoadmapTimeline.vue` in `website/roadmap.md`
- [x] T039 [P] [US2] Implement responsive diagram, module-grid, legend, and roadmap presentation in the already imported `website/.vitepress/theme/styles/architecture-roadmap.css`
- [x] T040 [US2] Run a production build and `architecture-roadmap.spec.ts`, verify the locally imported ArchitectureMap, RoadmapTimeline, and three T034 diagrams are rendered, and fix User Story 2 files until the focused tests pass

**Checkpoint**: Architecture and Roadmap are locally reviewable and Constitution-aligned.

---

## Phase 5: User Story 3 - Equivalent English and Chinese Journeys (Priority: P2)

**Goal**: Provide equivalent bilingual page forms, navigation, language switching, fallback behavior, and social
presentation.

### Tests for User Story 3

- [x] T041 [P] [US3] Write failing Playwright tests for all required counterpart routes, language-switch targets, keyboard activation, active-language labels, locale isolation, and the real missing-counterpart branch from `/test-fixtures/locale-fallback` to `/zh/translation-unavailable` in `website/tests/e2e/locale-switching.spec.ts`
- [x] T042 [P] [US3] Extend `website/tests/scripts/check-content.test.mjs` with failing assertions for shared page templates, CTA-purpose keys, roadmap-stage keys, draft status, and capability-legend parity across locales

### Implementation for User Story 3

- [x] T043 [P] [US3] Replace the Chinese home skeleton with equivalent conservative positioning and page composition in `website/zh/index.md`
- [x] T044 [P] [US3] Replace the Chinese Architecture and Roadmap skeletons with equivalent Profile/Skill semantics, provisional visual horizons, long-term-direction boundary, and limitations without real capability-state badges in `website/zh/architecture.md` and `website/zh/roadmap.md`
- [x] T045 [P] [US3] Create the Chinese social-card SVG source and localized social metadata in `website/public/social/og-default-zh.svg` and `website/.vitepress/config/metadata.ts`
- [x] T046 [P] [US3] Implement manifest-driven equivalent-page and missing-counterpart fallback resolution in `website/.vitepress/theme/components/LocaleSwitcher.vue` and mount its accessible mobile/desktop controls through the appropriate default-theme slots in `website/.vitepress/theme/Layout.vue`
- [x] T047 [P] [US3] Implement explicit English and Chinese translation-unavailable pages and locale-aware recovery content in `website/translation-unavailable.md`, `website/zh/translation-unavailable.md`, and `website/404.md`
- [x] T048 [P] [US3] Implement localized navigation, switcher, fallback, and CJK typography refinements in the already imported `website/.vitepress/theme/styles/locale.css`
- [x] T049 [US3] Run content tests, production build, and `locale-switching.spec.ts`; fix User Story 3 implementation files until route parity and language switching pass

**Checkpoint**: Home, Architecture, Roadmap, fallback, and navigation work equivalently in both locales.

---

## Phase 6: User Story 4 - Documentation and Community Page Forms (Priority: P3)

**Goal**: Fill every required documentation and community route with coherent visual forms and visibly
provisional, non-runnable copy.

### Tests for User Story 4

- [x] T050 [P] [US4] Write failing Playwright tests for Documentation index hierarchy, all required topic routes, visible localized draft notices, required documentation sections, related navigation, Community destinations, and absence of runnable CLI/API presentation in `website/tests/e2e/documentation-community.spec.ts`

### Implementation for User Story 4

- [x] T051 [P] [US4] Replace the English Documentation index and concept skeletons for What is OryxOS, Why Java, and Design Principles in `website/docs/index.md` and `website/docs/concepts/*.md`
- [x] T052 [P] [US4] Replace the English Project Status, Build from Source, and Contributing skeletons with safe prototype forms that omit unverified commands in `website/docs/project/project-status.md`, `website/docs/getting-started/build-from-source.md`, and `website/docs/contributing.md`
- [x] T053 [P] [US4] Replace the English Provider, ReAct Loop, Tool, Memory, and Skill/Profile skeletons with labeled intended-design forms in `website/docs/runtime/*.md`
- [x] T054 [P] [US4] Replace the English CLI and REST API skeletons with non-executable labeled placeholders and limitations in `website/docs/interfaces/cli.md` and `website/docs/interfaces/rest-api.md`
- [x] T055 [P] [US4] Replace the Chinese Documentation index and concept skeletons with equivalent visual forms in `website/zh/docs/index.md` and `website/zh/docs/concepts/*.md`
- [x] T056 [P] [US4] Replace the Chinese Project Status, Build from Source, and Contributing skeletons with equivalent safe prototype forms in `website/zh/docs/project/project-status.md`, `website/zh/docs/getting-started/build-from-source.md`, and `website/zh/docs/contributing.md`
- [x] T057 [P] [US4] Replace the Chinese Runtime, CLI, and REST API skeletons with equivalent labeled intended-design forms in `website/zh/docs/runtime/*.md` and `website/zh/docs/interfaces/*.md`
- [x] T058 [P] [US4] Replace both Community skeletons with approved repository, license, issue/discussion, governance, oryx-labs, and future-ASF-aspiration presentation in `website/community.md` and `website/zh/community.md`
- [x] T059 [US4] Implement Documentation landing/topic-card presentation and community-link grouping in `website/.vitepress/theme/components/DocumentationLanding.vue`, `website/.vitepress/theme/components/TopicGrid.vue`, and `website/.vitepress/theme/components/CommunityLinks.vue`; locally import and render them from both localized Documentation indexes and Community pages
- [x] T060 [P] [US4] Implement documentation templates, draft notices, topic cards, tables, placeholder examples, and community layouts in the already imported `website/.vitepress/theme/styles/documentation.css` and `website/.vitepress/theme/styles/community.css`
- [x] T061 [US4] Run content tests, production build, and `documentation-community.spec.ts`; fix User Story 4 implementation files until all required page forms pass without adding runnable unverified interfaces

**Checkpoint**: All 36 required localized routes contain complete visual page forms.

---

## Phase 7: Quality, Assets, CI, and Local Approval

**Purpose**: Validate the complete prototype as a static, accessible, responsive, non-deploying site.

- [x] T062 [P] Write full-site keyboard, focus, landmark, heading, image-alt, and axe checks across representative page types and both locales in `website/tests/e2e/accessibility.spec.ts`
- [x] T063 [P] Write the full viewport-matrix overflow, long-code/table/URL, mobile navigation, reduced-motion, and responsive composition checks in `website/tests/e2e/responsive.spec.ts`
- [x] T064 [P] Write a full required-route and fragment crawl with required-resource, console-error, failed-request, unique metadata, locale metadata, counterpart metadata, and localized social-image-alt assertions in `website/tests/e2e/site-integrity.spec.ts`
- [x] T065 Generate all favicon, Apple Touch, English/Chinese social PNG outputs and `website/public/brand/asset-manifest.json`; run the full required source/export inventory and manifest-schema validator across marks, wordmark, lockup, favicon, social cards, and diagrams; then register favicon and touch-icon links through `website/.vitepress/config/metadata.ts`
- [x] T066 Refine the complete visual system for consistent spacing, typography, focus, hover, active states, 320-1440 layouts, and 200% zoom in the already imported files under `website/.vitepress/theme/styles/`
- [x] T067 Complete the SSR-rendered bilingual prototype notice, English/Chinese recovery groups, optional retained-path locale prioritization, and not-found presentation in `website/.vitepress/theme/components/NotFoundExperience.vue`, mount it through the VitePress not-found layout path in `website/.vitepress/theme/Layout.vue`, and integrate `website/404.md` plus `website/.vitepress/theme/styles/not-found.css`
- [x] T068 Harden the Setup-created path-filtered, read-only website validation pipeline so it configures Node with `node-version-file: website/.nvmrc`, runs `npm ci`, installs Playwright Chromium, executes `npm run test:quality`, and optionally uploads an ordinary artifact in `.github/workflows/website-ci.yml`
- [x] T069 Harden the Setup-created `.github/workflows/website-prototype-artifact.yml` so it configures Node with `node-version-file: website/.nvmrc`, runs `npm ci` and the complete quality sequence, uploads only an ordinary Actions artifact, and retains no Pages permission, OIDC write permission, Pages action, deployment Environment, or public deployment path
- [x] T070 Run `npm run test:workflow-policy`, fix `.github/workflows/website-ci.yml`, `.github/workflows/website-prototype-artifact.yml`, or the policy implementation until all workflows prove non-deploying, then set `DISC-DEPLOYMENT-001` to `prototype_handling: resolved`, `public_deployment_blocked: false`, and `status: resolved` in `specs/002-oryxos-website/discrepancy-register.yaml`
- [x] T071 Run accessibility, responsive, and site-integrity suites against a fresh production build; fix affected components, Markdown, configuration, data, assets, or imported styles until the suites pass without weakening checks
- [x] T072 Run `npm ci` followed by `npm run test:quality` from `website/` with no Runtime process, database, private credential, or Maven command; fix reproducibility failures in website-owned files
- [x] T073 Manually verify approved external repository, license, issue/discussion, governance, and organization destinations and update only `website/data/external-links.json` plus affected localized pages when a destination is invalid
- [x] T074 Complete discrepancy and external-link discovery before approval, run the locked Chromium local-review suite, and perform the bilingual visual review from `quickstart.md`; record the final discrepancy snapshot, brand creator/generation process, third-party license statement, size-specific asset legibility, and concrete results in `website/data/prototype-review.json`, repeating automated and manual review after every fix until it records `approved-for-prototype`
- [x] T075 After the final review edit, run fresh `npm ci`, `npm run test:quality`, and `npm run test:workflow-policy`; verify the diff does not modify README or Runtime sources, implementation files do not reference retired-site content, and workflows cannot deploy. If this check discovers an issue requiring any file mutation, return to T074, refresh the review snapshot and approval, then repeat T075; T075 completes only without further mutations

**Final Checkpoint**: The complete bilingual visual prototype builds and passes local/CI quality checks under
`/oryxos/`, has an approved local visual review, and remains impossible to publish through repository workflows.

---

## Dependencies and Execution Order

### Phase dependencies

- Phase 1 has no dependencies.
- Phase 2 depends on Phase 1 and blocks all user stories.
- User Stories 1 and 2 may proceed in parallel after Phase 2 because their implementation files do not overlap.
- User Story 3 depends on the English Home, Architecture, and Roadmap forms from User Stories 1 and 2.
- User Story 4 depends only on Phase 2 and may run in parallel with User Stories 1 and 2, but its final locale test runs after User Story 3 switching is available.
- Phase 7 depends on all user stories.

### Required command ordering

1. `npm ci`
2. `npm run test:scripts`
3. `npm run check:content`
4. `npm run assets:build && npm run assets:verify`
5. `npm run docs:typecheck`
6. `npm run docs:build`
7. Start `npm run docs:preview`
8. Run Playwright/axe against that production preview

The development server is for authoring only and is never the release-quality test target.

### Parallel examples

- T008, T009, and T010 may be written in parallel.
- T027-T030 may run in parallel after the User Story 1 tests fail as expected.
- T034-T039 may run in parallel after T033 fails as expected.
- T043-T048 may run in parallel after T041 and T042 fail as expected.
- T051-T058 and T060 may run in parallel after T050 fails as expected; T059 then integrates the components into
  the content files created by those tasks.
- T062-T064 may be written in parallel before full-site execution.

## Implementation Strategy

### Visual MVP

1. Complete Phase 1 and Phase 2, including every route skeleton.
2. Complete User Story 1 and review the English home presentation locally.
3. Complete User Story 2 and review the visual architecture/roadmap language.
4. Do not publish this partial result.

### Complete prototype

1. Add bilingual journeys and all documentation/community page forms.
2. Run complete browser, accessibility, responsive, route, asset, and workflow checks.
3. Record and close the local visual review loop.
4. Hand unresolved copy/evidence/deployment work to a separate content-and-publication Feature.
