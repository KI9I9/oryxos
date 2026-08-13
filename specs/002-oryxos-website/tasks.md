# Tasks: New OryxOS Website

**Input**: Design documents from `/specs/002-oryxos-website/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`, and
`discrepancy-register.yaml`

**Tests**: Automated tests are included because the specification and Constitution require link, route, locale,
keyboard, accessibility, responsive, metadata, asset, content-truthfulness, and deployment-policy validation.
Story-specific tests must be written first and observed failing before their implementation tasks begin.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated as an explicit
increment. The retired `.website.bak` directory remains excluded from every task and must not be read, searched,
copied, or adapted.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel after its phase prerequisites because it changes different files.
- **[Story]**: Maps the task to a user story from `spec.md`.
- Every task includes the exact target path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish a clean, reproducible VitePress project without restoring or referencing the retired site.

- [ ] T001 Create the from-scratch directory structure under `website/`, including `.vitepress/config/`, `.vitepress/theme/components/`, `.vitepress/theme/lib/`, `.vitepress/theme/styles/`, `data/`, `docs/`, `zh/`, `public/brand/`, `public/icons/`, `public/diagrams/`, `public/social/`, `scripts/`, `tests/scripts/`, and `tests/e2e/`, without reading or importing `.website.bak`
- [ ] T002 Resolve and pin the exact current Node.js 24 LTS release in `website/.nvmrc`, enable strict engine enforcement in `website/.npmrc`, and document the matching Node range and npm package manager in `website/package.json`
- [ ] T003 Initialize the independent npm project with exact compatible VitePress, Vue 3, TypeScript, `vue-tsc`, Playwright, and `@axe-core/playwright` dependencies in `website/package.json` and generate `website/package-lock.json` using Node.js 24
- [ ] T004 [P] Configure strict TypeScript and Vue declarations in `website/tsconfig.json` and `website/env.d.ts`
- [ ] T005 [P] Create the auto-discovered VitePress entry and delegated configuration with `base: '/oryxos/'`, clean URLs, light-only appearance, and dead-link checking enabled in `website/.vitepress/config.mts` and `website/.vitepress/config/index.ts`
- [ ] T006 [P] Configure Playwright to test `vitepress preview` below `/oryxos/`, use Chromium for CI, and expose a release browser matrix in `website/playwright.config.ts`
- [ ] T007 Update repository ignore rules for `website/node_modules/`, `website/.vitepress/cache/`, `website/.vitepress/dist/`, Playwright reports, and test artifacts in `.gitignore` without reverting unrelated existing entries

**Checkpoint**: Node and npm metadata are reproducible, the new source tree exists, and no retired website input has been used.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement the route, claim, metadata, theme, and validation infrastructure required by every story.

**CRITICAL**: No user story implementation begins until this phase is complete. Fixture tests may pass here, but
the full live-site content validator is expected to remain red until all required story pages exist.

- [ ] T008 [P] Write failing Node tests for route uniqueness, locale pairing, capability-state enums, shared Claim IDs, evidence requirements, incomplete-page sections, and blocked publication claims in `website/tests/scripts/check-content.test.mjs`
- [ ] T009 [P] Write failing Node tests for expected HTML outputs, `/oryxos/` asset paths, `404.html`, metadata, required assets, and prohibited runtime/tracking URLs in `website/tests/scripts/verify-build.test.mjs`
- [ ] T010 [P] Define all 18 required English/Chinese Page ID pairs plus fallback and not-found records in `website/data/pages.json` according to `contracts/route-map.md`
- [ ] T011 [P] Define atomic capability states, public Claims, supporting/contradicting Evidence, limitations, affected pages, and publication decisions in `website/data/capabilities.json`, `website/data/claims.json`, and `website/data/evidence.json`
- [ ] T012 [P] Create the approved repository, license, issue, organization, governance, and contribution destination registry in `website/data/external-links.json`, excluding unverified destinations
- [ ] T013 Implement manifest and Markdown validation for the T008 cases in `website/scripts/check-content.mjs`, with deterministic errors that name the invalid Page, Capability, Claim, Evidence, or discrepancy reference
- [ ] T014 Implement generated-output validation for the T009 cases in `website/scripts/verify-build.mjs`, using only Node.js standard-library APIs
- [ ] T015 Configure shared site identity, root and `zh` locales, localized labels, navigation data sources, sidebars, footer behavior, and `/oryxos/` URL helpers in `website/.vitepress/config/shared.ts`, `website/.vitepress/config/locales.ts`, and `website/.vitepress/config/navigation.ts`
- [ ] T016 Implement localized canonical, `hreflang`, Open Graph, Twitter, robots, and structured-metadata generation from Page records and frontmatter in `website/.vitepress/config/metadata.ts`
- [ ] T017 Extend the VitePress default theme with an SSR-safe thin layout wrapper in `website/.vitepress/theme/index.ts` and `website/.vitepress/theme/Layout.vue`
- [ ] T018 [P] Implement evidence-backed status presentation primitives in `website/.vitepress/theme/components/CapabilityStatus.vue`, `website/.vitepress/theme/components/EvidenceSummary.vue`, and `website/.vitepress/theme/components/KnownLimitations.vue`
- [ ] T019 [P] Define light enterprise design tokens, base typography, visible focus treatment, reduced-motion behavior, and default-theme overrides in `website/.vitepress/theme/styles/tokens.css`, `website/.vitepress/theme/styles/base.css`, and `website/.vitepress/theme/styles/default-theme.css`
- [ ] T020 [P] Create reusable Page manifest loading, preview error capture, axe setup, and viewport data helpers in `website/tests/e2e/site-fixtures.ts` and `website/tests/e2e/accessibility.ts`
- [ ] T021 Add `docs:dev`, `docs:typecheck`, `docs:build`, `docs:preview`, `test:scripts`, `check:content`, `verify:build`, `test:e2e:ci`, `test:e2e:release`, and `test:quality` commands in `website/package.json`

**Checkpoint**: The shared static-site foundation is ready; User Stories 1 and 2 can begin in parallel.

---

## Phase 3: User Story 1 - Understand OryxOS and Its Current Status (Priority: P1) MVP

**Goal**: Deliver an English home page that lets a first-time visitor identify OryxOS as a Java-oriented,
self-hosted Agent OS foundation in pre-alpha, understand Agent OS versus Agent Runtime/framework, and distinguish
the single-node current focus from the distributed Vision.

**Independent Test**: Open only the English home page under `/oryxos/`, including once with JavaScript disabled.
A reviewer can identify the product category, audience, maturity, current focus, and long-term direction; all
displayed capability labels match the registered evidence-backed state.

### Tests for User Story 1

- [ ] T022 [P] [US1] Write failing Playwright assertions for the pre-alpha statement, Java/self-hosted positioning, Agent OS comparison, single-node focus, four exact state labels, distributed Vision wording, primary calls to action, and keyboard reachability in `website/tests/e2e/home.spec.ts`
- [ ] T023 [P] [US1] Write a failing no-JavaScript test proving that home-page positioning, status, and ordinary links remain in the pre-rendered HTML in `website/tests/e2e/static-content.spec.ts`

### Implementation for User Story 1

- [ ] T024 [P] [US1] Create the original logo mark, English wordmark, horizontal lockup, monochrome mark, and SVG favicon in `website/public/brand/logo-mark.svg`, `website/public/brand/wordmark-en.svg`, `website/public/brand/lockup-horizontal.svg`, `website/public/brand/logo-mark-monochrome.svg`, and `website/public/icons/favicon.svg`
- [ ] T025 [P] [US1] Create the editable English social-card source and final 1200x630 PNG with visible Pre-alpha positioning in `website/public/social/og-default-en.svg` and `website/public/social/og-default-en.png`
- [ ] T026 [P] [US1] Implement the SSR-rendered landing-page composition, value proposition, Agent OS comparison, capability snapshot, vision boundary, and CTA layout in `website/.vitepress/theme/components/HomeLanding.vue`
- [ ] T027 [P] [US1] Author the evidence-backed English home content and localized metadata in `website/index.md`
- [ ] T028 [P] [US1] Implement the responsive visual treatment for the hero, comparison, capability, architecture-preview, and CTA sections in `website/.vitepress/theme/styles/home.css`
- [ ] T029 [US1] Integrate `HomeLanding.vue`, English brand assets, home styles, and Page/Claim data through `website/.vitepress/theme/Layout.vue` and `website/.vitepress/theme/index.ts`
- [ ] T030 [US1] Run `home.spec.ts` and `static-content.spec.ts` against the production preview and fix only User Story 1 regressions in `website/tests/e2e/home.spec.ts` and `website/tests/e2e/static-content.spec.ts`

**Checkpoint**: The English home page is a locally testable MVP. It is not yet eligible for Pages deployment
because the full bilingual route set, documentation, and release checks are incomplete.

---

## Phase 4: User Story 2 - Evaluate Architecture and Roadmap (Priority: P2)

**Goal**: Let technical visitors inspect the canonical Agent model, module boundaries, evidence-backed capability
states, known limitations, phased roadmap, and validation-only deployment policy.

**Independent Test**: Open Architecture and Roadmap directly, navigate between them, and confirm that the pages
explain Skill + Profile, Runtime concepts, Java modules, four delivery states, current foundations, active kernel
work, enterprise-hardening goals, distributed Vision, and publication blockers without presenting unfinished
behavior as operational. Workflow-policy tests prove no main push can deploy Pages.

### Tests for User Story 2

- [ ] T031 [P] [US2] Write failing Playwright tests for the Architecture model, module boundaries, capability states, Roadmap stages, known limitations, and navigation reachability in `website/tests/e2e/architecture-roadmap.spec.ts`
- [ ] T032 [P] [US2] Write failing Node tests that reject a Pages push trigger, Node versions other than the repository-pinned Node 24 release, missing manual inputs, missing exact-ref checkout, or missing protected Environment use in `website/tests/scripts/workflow-policy.test.mjs`

### Implementation for User Story 2

- [ ] T033 [P] [US2] Create original accessible system-architecture and Skill/Profile Agent-definition diagrams in `website/public/diagrams/system-architecture.svg` and `website/public/diagrams/agent-skill-profile.svg`
- [ ] T034 [P] [US2] Implement a data-driven capability matrix that renders state text, non-color indicators, limitations, and evidence links in `website/.vitepress/theme/components/CapabilityMatrix.vue`
- [ ] T035 [P] [US2] Implement a data-driven staged-roadmap component that does not imply unapproved dates or commitments in `website/.vitepress/theme/components/RoadmapTimeline.vue`
- [ ] T036 [P] [US2] Author the English Architecture page with Skill + Profile, Profile-entry-point caveat, Runtime concepts, Java module boundaries, current evidence, target design, and known limitations in `website/architecture.md`
- [ ] T037 [P] [US2] Author the English Roadmap page with current foundations, active Runtime Kernel work, enterprise hardening, distributed Vision, and explicit limitations in `website/roadmap.md`
- [ ] T038 [P] [US2] Add responsive architecture, diagram, capability-matrix, and roadmap styling in `website/.vitepress/theme/styles/architecture-roadmap.css`
- [ ] T039 [US2] Add Architecture and Roadmap to the English primary navigation and wire their components/styles through `website/.vitepress/config/navigation.ts` and `website/.vitepress/theme/index.ts`
- [ ] T040 [P] [US2] Create the immutable-ref, discrepancy-snapshot, claim-accuracy, accessibility, public-access, and reviewer checklist template in `.github/WEBSITE_VALIDATION_REVIEW.md`
- [ ] T041 [P] [US2] Add a path-filtered, read-only website validation workflow that runs Node 24, `npm ci`, script tests, content checks, type checks, build, build verification, Chromium, and axe without Pages permissions in `.github/workflows/website-ci.yml`
- [ ] T042 [US2] Replace automatic Pages publication with a `workflow_dispatch`-only exact-ref validation workflow, required review inputs, Node 24 version-file use, quality gates, protected `github-pages` Environment, and artifact deployment in `.github/workflows/deploy-pages.yml`
- [ ] T043 [US2] Run `architecture-roadmap.spec.ts` and `workflow-policy.test.mjs`, confirm zero push deployment path remains, and fix User Story 2 regressions in `website/tests/e2e/architecture-roadmap.spec.ts` and `website/tests/scripts/workflow-policy.test.mjs`

**Checkpoint**: Architecture, Roadmap, and the manual-only deployment mechanism are independently reviewable.

---

## Phase 5: User Story 3 - Browse Equivalent English and Chinese Content (Priority: P2)

**Goal**: Deliver equivalent English and Chinese core journeys, Page-ID-based language switching, explicit
translation fallback, and a locale-aware not-found experience.

**Independent Test**: Visit Home, Architecture, Roadmap, Documentation, and Community in both locales, switch
language from every page, and confirm matching states, claims, actions, route purpose, metadata, and fallback
behavior under `/oryxos/`.

### Tests for User Story 3

- [ ] T044 [P] [US3] Write failing Node tests for equal required Page ID sets, counterpart source paths, Claim/state/action parity, translation review state, unique localized metadata, and fallback restrictions in `website/tests/scripts/locale-parity.test.mjs`
- [ ] T045 [P] [US3] Write failing Playwright tests for English-root behavior, `/zh/` deep links, Page-ID-equivalent switching, keyboard locale-menu operation, fallback handling, locale metadata, and active-language 404 recovery in `website/tests/e2e/locale-navigation.spec.ts`

### Implementation for User Story 3

- [ ] T046 [US3] Author the semantically equivalent Chinese home page with matching capability states, Claim IDs, primary actions, and Pre-alpha/single-node/Distributed Vision boundaries in `website/zh/index.md`
- [ ] T047 [P] [US3] Author the semantically equivalent Chinese Architecture page in `website/zh/architecture.md`
- [ ] T048 [P] [US3] Author the semantically equivalent Chinese Roadmap page in `website/zh/roadmap.md`
- [ ] T049 [P] [US3] Create concise equivalent English and Chinese core Documentation and Community entry pages in `website/docs/index.md`, `website/zh/docs/index.md`, `website/community.md`, and `website/zh/community.md`
- [ ] T050 [US3] Implement Page-manifest-based counterpart resolution and the accessible desktop/mobile locale control in `website/.vitepress/theme/lib/locale-routes.ts` and `website/.vitepress/theme/components/LocaleSwitcher.vue`
- [ ] T051 [P] [US3] Author explicit English and Chinese translation-unavailable recovery pages in `website/translation-unavailable.md` and `website/zh/translation-unavailable.md`
- [ ] T052 [US3] Implement a root `404.html` source with static bilingual recovery links and locale-prioritized progressive enhancement in `website/404.md` and `website/.vitepress/theme/components/NotFoundPage.vue`
- [ ] T053 [P] [US3] Create the editable Chinese social-card source and final 1200x630 PNG with equivalent Pre-alpha meaning in `website/public/social/og-default-zh.svg` and `website/public/social/og-default-zh.png`
- [ ] T054 [US3] Complete localized core navigation, Page counterpart metadata, social defaults, and reviewed translation states in `website/.vitepress/config/locales.ts`, `website/.vitepress/config/navigation.ts`, and `website/data/pages.json`
- [ ] T055 [US3] Run `locale-parity.test.mjs` and `locale-navigation.spec.ts` against all five core Page IDs and fix User Story 3 regressions in `website/tests/scripts/locale-parity.test.mjs` and `website/tests/e2e/locale-navigation.spec.ts`

**Checkpoint**: All five core journeys work in English and Chinese with explicit equivalent-page behavior.

---

## Phase 6: User Story 4 - Learn and Join the Project (Priority: P3)

**Goal**: Deliver the complete bilingual conceptual/runtime documentation set, verified source-build guidance,
honest CLI/REST limitations, contribution guidance, license/governance context, and approved community links.

**Independent Test**: Starting at Documentation or Community, a visitor can reach every required topic in both
languages, distinguish current behavior from target design, build the source using verified instructions, and
reach reviewed repository/license/contribution destinations without encountering a runnable claim for an
unavailable CLI command, API, MCP flow, or Runtime workflow.

### Tests for User Story 4

- [ ] T056 [P] [US4] Write failing Node tests for all thirteen documentation topic pairs, required incomplete-capability sections, evidence refs, non-runnable design labels, approved external destinations, and bilingual sidebar coverage in `website/tests/scripts/documentation-contract.test.mjs`
- [ ] T057 [P] [US4] Write failing Playwright tests for documentation discovery, sidebar navigation, build guidance, incomplete Provider/ReAct/Tool/Memory/Skill/Profile/CLI/REST disclosures, Community links, license, oryx-labs relationship, and ASF aspiration wording in `website/tests/e2e/documentation-community.spec.ts`

### Implementation for User Story 4

- [ ] T058 [US4] Run the repository wrapper verification required for source-build evidence and record the exact command, ref, result, and limitations in `website/data/evidence.json` before authoring runnable build guidance
- [ ] T059 [P] [US4] Author equivalent What is OryxOS, Why Java, and Design Principles page pairs in `website/docs/concepts/what-is-oryxos.md`, `website/zh/docs/concepts/what-is-oryxos.md`, `website/docs/concepts/why-java.md`, `website/zh/docs/concepts/why-java.md`, `website/docs/concepts/design-principles.md`, and `website/zh/docs/concepts/design-principles.md`
- [ ] T060 [US4] Author equivalent Project Status and verified Build from Source page pairs using T058 evidence in `website/docs/project/project-status.md`, `website/zh/docs/project/project-status.md`, `website/docs/getting-started/build-from-source.md`, and `website/zh/docs/getting-started/build-from-source.md`
- [ ] T061 [P] [US4] Author equivalent Contributing pages and expand both Community pages with reviewed repository, issue, license, governance, oryx-labs, and ASF-aspiration wording in `website/docs/contributing.md`, `website/zh/docs/contributing.md`, `website/community.md`, and `website/zh/community.md`
- [ ] T062 [P] [US4] Author evidence-backed Provider and ReAct Loop page pairs with publication state, current behavior, target design, limitations, unavailable behavior, and evidence in `website/docs/runtime/provider.md`, `website/zh/docs/runtime/provider.md`, `website/docs/runtime/react-loop.md`, and `website/zh/docs/runtime/react-loop.md`
- [ ] T063 [P] [US4] Author evidence-backed Tool and Memory page pairs with the required incomplete-capability sections in `website/docs/runtime/tool.md`, `website/zh/docs/runtime/tool.md`, `website/docs/runtime/memory.md`, and `website/zh/docs/runtime/memory.md`
- [ ] T064 [P] [US4] Author the Skill/Profile page pair using the canonical public equation, Profile-entry-point caveat, governance discrepancy, and verified implementation limits in `website/docs/runtime/skill-profile.md` and `website/zh/docs/runtime/skill-profile.md`
- [ ] T065 [P] [US4] Author CLI and REST API page pairs that distinguish verified help/version and response/error infrastructure from unavailable subcommands and business endpoints in `website/docs/interfaces/cli.md`, `website/zh/docs/interfaces/cli.md`, `website/docs/interfaces/rest-api.md`, and `website/zh/docs/interfaces/rest-api.md`
- [ ] T066 [P] [US4] Create an original accessible ReAct target-design diagram with no implication of current runnable completeness in `website/public/diagrams/react-loop.svg`
- [ ] T067 [US4] Complete the bilingual documentation indexes, grouped sidebars, previous/next links, Page/Claim mappings, and navigation destinations in `website/docs/index.md`, `website/zh/docs/index.md`, `website/.vitepress/config/navigation.ts`, and `website/data/pages.json`
- [ ] T068 [US4] Review every Community and documentation external destination, remove or replace invalid targets, and record the publication-time result in `website/data/external-links.json`
- [ ] T069 [US4] Run `documentation-contract.test.mjs` and `documentation-community.spec.ts`, then fix only User Story 4 content, route, evidence, and navigation regressions in `website/tests/scripts/documentation-contract.test.mjs` and `website/tests/e2e/documentation-community.spec.ts`

**Checkpoint**: The complete first-release bilingual documentation and participation journey is independently usable.

---

## Phase 7: Polish, Quality Gates, and Validation Deployment

**Purpose**: Apply cross-story accessibility, responsive, metadata, security, asset, truthfulness, and deployment
gates to the complete static site.

- [ ] T070 [P] Add breakpoint-edge, long code/table/URL, 320-1440 CSS-pixel, 200%-reflow proxy, and print-safe layout rules in `website/.vitepress/theme/styles/responsive.css`
- [ ] T071 [P] Add whole-route keyboard, mobile-menu, locale-menu, focus-return, visible-focus, reduced-motion, and axe scans for initial and open-menu states in `website/tests/e2e/accessibility.spec.ts`
- [ ] T072 [P] Add whole-route checks for direct `/oryxos/` entry, unique metadata, canonical/hreflang, social images, favicon/diagram loading, alt attributes, JavaScript-disabled content, browser errors, and failed required requests in `website/tests/e2e/site-quality.spec.ts`
- [ ] T073 Export and register PNG favicons, the 180x180 touch icon, social-image dimensions, asset ownership, locale, purpose, and accessibility treatment in `website/public/icons/favicon-16.png`, `website/public/icons/favicon-32.png`, `website/public/icons/apple-touch-icon.png`, and `website/public/brand/asset-manifest.json`
- [ ] T074 Enforce validation-site indexing controls through page metadata and a full crawler disallow rule in `website/.vitepress/config/metadata.ts` and `website/public/robots.txt`
- [ ] T075 Extend content-validator tests and implementation to reject likely secrets, private credentials, internal network addresses, analytics/tracking scripts, remote CMS dependencies, and internal Agent/Tool/Memory/Profile API calls in `website/tests/scripts/check-content.test.mjs` and `website/scripts/check-content.mjs`
- [ ] T076 Run `npm ci`, script tests, content validation, type checking, VitePress build, output verification, Chromium/axe tests, and the full release browser matrix, then record commands and results in `specs/002-oryxos-website/checklists/implementation-validation.md`
- [ ] T077 Perform and record the manual bilingual semantic, Claim/Evidence, discrepancy, external-link, brand-originality, and asset-consistency review in `specs/002-oryxos-website/checklists/release-review.md`
- [ ] T078 Perform and record real Chrome and Firefox 200% zoom, keyboard-only journeys, visible-focus quality, WCAG 2.2 AA contrast, 320-1440 layout, diagram comprehension, and alt-text usefulness review in `specs/002-oryxos-website/checklists/release-review.md`
- [ ] T079 Conduct the representative 60-second first-visit review for SC-001 and record participant count, prompts, raw outcomes, and the percentage correctly identifying all five positioning attributes in `specs/002-oryxos-website/checklists/first-visit-review.md`
- [ ] T080 After Node 24 and workflow-policy validation pass, mark `DISC-DEPLOY-002` resolved and advance `DISC-DEPLOY-001` only to `accepted-for-validation`, preserving every documentation/governance blocker in `specs/002-oryxos-website/discrepancy-register.yaml`
- [ ] T081 After explicit maintainer approval, trigger `.github/workflows/deploy-pages.yml` for an immutable commit with the approved review ID, discrepancy snapshot, public-access acknowledgement, and `noindex` mode, and record the run ID in `specs/002-oryxos-website/checklists/deployed-validation.md`
- [ ] T082 Verify the deployed English/Chinese core and deep routes, assets, 404 recovery, metadata, no-index controls, and zero automatic main-push deployment behavior; record the URL/results and then resolve `DISC-DEPLOY-001` with workflow evidence in `specs/002-oryxos-website/checklists/deployed-validation.md` and `specs/002-oryxos-website/discrepancy-register.yaml`

**Checkpoint**: All automated gates pass, manual release review is recorded, validation deployment is explicitly
approved and verified, and unresolved documentation/governance discrepancies still block formal publication.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 - Setup**: No dependencies; begins immediately.
- **Phase 2 - Foundational**: Depends on Phase 1 and blocks every user story.
- **Phase 3 - User Story 1**: Depends on Phase 2; this is the local MVP.
- **Phase 4 - User Story 2**: Depends on Phase 2 and can run in parallel with User Story 1. Its complete
  home-to-Architecture/Roadmap journey is validated after User Story 1 exists.
- **Phase 5 - User Story 3**: Depends on the English core pages from User Stories 1 and 2 because translations and
  equivalent-page routing require stable English counterparts.
- **Phase 6 - User Story 4**: Depends on Phase 2 and the locale conventions from T050/T054. Paired documentation
  authoring can proceed in parallel once those locale conventions are stable.
- **Phase 7 - Polish and Deployment**: Depends on all four stories. T081 additionally requires explicit user or
  maintainer approval and must not be executed merely because local checks passed.

### User Story Dependency Graph

```text
Setup
  -> Foundational
      -> User Story 1 (English public-entry MVP) -----+
      -> User Story 2 (Architecture/Roadmap/Policy) --+-> User Story 3 (Core bilingual parity)
      -> User Story 4 content research can begin -----+        |
                                                               +-> User Story 4 integration
                                                                    -> Polish and validation deployment
```

### Within Each User Story

- Write the listed tests first and observe the expected failure.
- Create data/assets and localized content before wiring navigation that points to them.
- Keep evidence-backed states and Claim IDs synchronized with content.
- Run the story-specific tests before its checkpoint.
- Do not use the full-site green state as a prerequisite for an earlier story checkpoint; the complete suite becomes
  mandatory in T076.

### Parallel Opportunities

- T004-T006 can proceed in parallel after T001-T003 establish the project.
- T008-T012, T018-T020 can proceed in parallel within the foundational phase.
- User Stories 1 and 2 can proceed in parallel after Phase 2.
- English/Chinese page pairs grouped under different US4 tasks can be authored in parallel after locale
  conventions and evidence states are stable.
- Original diagrams and social assets can proceed in parallel with prose in the same story when their conceptual
  model is already fixed by the contracts.
- Cross-route test files T070-T072 can proceed in parallel before final integrated execution.

---

## Parallel Example: User Story 1

```text
Task T022: Write home positioning and keyboard tests in website/tests/e2e/home.spec.ts
Task T023: Write no-JavaScript static-content tests in website/tests/e2e/static-content.spec.ts

After tests fail as expected:
Task T024: Create original SVG identity assets under website/public/brand/ and website/public/icons/
Task T025: Create the English social card under website/public/social/
Task T026: Implement website/.vitepress/theme/components/HomeLanding.vue
Task T027: Author website/index.md
Task T028: Implement website/.vitepress/theme/styles/home.css
```

## Parallel Example: User Story 2

```text
Task T031: Write Architecture/Roadmap browser tests
Task T032: Write workflow-policy tests

After tests fail as expected:
Task T033: Create architecture diagrams
Task T034: Implement CapabilityMatrix.vue
Task T035: Implement RoadmapTimeline.vue
Task T036: Author architecture.md
Task T037: Author roadmap.md
Task T040: Create the validation-review template
Task T041: Create the non-deploying website CI workflow
```

## Parallel Example: User Story 3

```text
Task T044: Write locale contract tests
Task T045: Write locale navigation browser tests

After tests fail as expected:
Task T047: Author the Chinese Architecture page
Task T048: Author the Chinese Roadmap page
Task T049: Create bilingual Documentation and Community entry pages
Task T051: Create explicit translation fallback pages
Task T053: Create the Chinese social card
```

## Parallel Example: User Story 4

```text
Task T056: Write documentation contract tests
Task T057: Write documentation and Community browser tests

After locale conventions and evidence are stable:
Task T059: Author conceptual documentation pairs
Task T061: Author Contributing and Community pairs
Task T062: Author Provider and ReAct pairs
Task T063: Author Tool and Memory pairs
Task T064: Author the Skill/Profile pair
Task T065: Author CLI and REST API pairs
Task T066: Create the ReAct target-design diagram
```

---

## Implementation Strategy

### MVP First: User Story 1 Only

1. Complete Phase 1.
2. Complete Phase 2.
3. Complete Phase 3.
4. Stop and validate the English home page independently.
5. Treat this as a local content/visual MVP only; do not deploy it to Pages.

### Incremental Delivery

1. **Foundation**: reproducible static project, shared data contracts, validators, and theme.
2. **US1**: truthful English public entry point.
3. **US2**: transparent Architecture/Roadmap plus manual-only deployment policy.
4. **US3**: equivalent bilingual core journeys and robust locale recovery.
5. **US4**: complete bilingual documentation and contributor journey.
6. **Final gates**: full automation, manual review, approved validation deployment, and discrepancy evidence.

### Parallel Team Strategy

After Phase 2:

- Developer A can implement User Story 1.
- Developer B can implement User Story 2.
- A bilingual reviewer can prepare terminology and parity review while waiting for stable English pages.
- Documentation authors can research User Story 4 evidence without publishing pages until locale conventions and
  Claim states are fixed.
- Brand/diagram work can proceed independently as long as it follows `contracts/brand-assets.md` and does not use
  retired-site material.

---

## Notes

- All paths are Linux/workspace-relative paths under `k-oryxos`.
- If installing Node.js 24 or Playwright browsers encounters a permission error, stop and ask the user how to
  proceed; do not install into an unapproved alternate location or weaken version requirements.
- `README.md` and existing authoritative project documents are outside implementation scope.
- `.website.bak` is excluded from all discovery and implementation work.
- Do not add `website/` to Maven modules or package website output into the Spring Boot JAR.
- Do not start or call OryxOS Runtime services for normal website build/test flows.
- Validation deployment is public-address validation, not formal publication.
- T081 requires explicit approval and must not be performed automatically by an implementation agent.
