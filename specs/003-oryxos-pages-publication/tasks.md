# Tasks: OryxOS GitHub Pages Publication

**Input**: Design documents from `specs/003-oryxos-pages-publication/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, and `quickstart.md`

**Tests**: Automated tests are required because the Feature changes public claims, metadata, release evidence,
deployment permissions, concurrency, restoration behavior, and the official Website. Story tests must be written
and observed failing before the corresponding implementation. Existing assertions must not be weakened merely to
obtain a pass.

**Publication boundary**: Implementation may proceed with a pending release baseline, but the first official
deployment remains blocked until `KI9I9/oryxos` has a qualifying published, non-draft GitHub Release bound to a
target-repository tag, all publication discrepancies are resolved, the protected `github-pages` environment is
verified, and an authorized maintainer approves the exact candidate.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel after its phase prerequisites because it changes different files.
- **[Story]**: Maps the task to a user story from `spec.md`.
- Setup, foundational, and cross-cutting tasks have no story label.
- Every task names the exact repository path or external evidence record it changes or verifies.

## Phase 1: Setup

**Purpose**: Prepare publication-oriented file names, records, scripts, and workflow boundaries without enabling
public deployment.

- [ ] T001 Create the initial blocked publication review record in `website/data/publication-review.json` with approved origin, Chromium-only policy, pending Release/environment evidence, null reviewed-source digest/SHA fields, and no candidate/deployment identity
- [ ] T002 Run the existing `npm ci`, `npm run test:quality`, and `npm run test:workflow-policy` from `website/` before renaming or changing any Workflow; record every pre-existing result in `website/data/publication-review.json` without weakening tests
- [ ] T003 Rename `.github/workflows/website-prototype-artifact.yml` to `.github/workflows/website-review-artifact.yml`, retain `contents: read`, ordinary artifact upload, Node from `website/.nvmrc`, and no Pages capability
- [ ] T004 Update `.github/workflows/website-ci.yml` and `.github/workflows/ci.yml` so Website validation observes `website/**`, `specs/003-oryxos-pages-publication/**`, `.github/workflows/website-*.yml`, `.github/workflows/ci.yml`, `README.md`, `CLAUDE.md`, and `LICENSE`, Runtime CI ignores Website/Feature-only changes, and each Runtime CI Maven invocation uses Constitution-mandated `./mvnw` while preserving its existing lifecycle and dependency-check options
- [ ] T005 [P] Add `website/.publication/` plus publication live-check and public-smoke artifact paths to `.gitignore` without removing existing Website build, test, or dependency ignores
- [ ] T006 [P] Create the status-discriminated pending Qualifying Release Baseline in `website/data/release-baseline.json`; set repository plus `verificationStatus: pending`, keep every Release identity/maturity/verification/evidence field null, set `failureReasons` empty, and do not invent or reuse local-only tag values
- [ ] T007 [P] Create an empty Claim Evidence inventory collection, not invalid placeholder records, in `website/data/claim-evidence.json`; declare the exact serialized category tokens `positioning`, `maturity`, `version`, `build`, `cli`, `api`, `provider`, `react-loop`, `tool`, `memory`, `skill-profile`, `security-property`, `governance`, `affiliation`, `adoption`, and `asset`
- [ ] T008 [P] Create `specs/003-oryxos-pages-publication/publication-discrepancies.yaml` with one open mapping for each of the nine Feature 002 public-deployment blockers, preserving the source discrepancy IDs

**Checkpoint**: Publication records and renamed review workflow exist, but every active workflow remains
non-deploying and the release baseline remains blocked.

---

## Phase 2: Foundational Publication Governance

**Purpose**: Implement deterministic release, claim, discrepancy, and public-content validation shared by all user
stories.

**CRITICAL**: No user story implementation begins until the offline schemas, validators, and blocking behavior in
this phase pass.

### Tests for the foundation

- [ ] T009 [P] Write failing fixture tests for null-identity pending, verified/stale records including nullable Release name with tag fallback, rejected observations with preserved values plus null missing fields and non-empty reasons, draft rejection, missing target tag, SHA mismatch, prerelease maturity, local-only tag rejection, and older-baseline staleness in `website/tests/scripts/check-release-baseline.test.mjs`
- [ ] T010 [P] Write failing fixture tests for Claim Evidence state/evidence rules across every high-risk category including security-property, affiliation, and adoption, all-page bilingual maturity/capability/action/destination parity, planned syntax classification, authoritative-document references, and stale/rejected claim blocking in `website/tests/scripts/check-claims.test.mjs`
- [ ] T011 [P] Extend failing content tests for public page states, claim/example references, final documentation section keys, removal of prototype-only requirements, and Feature 003 discrepancy closure in `website/tests/scripts/check-content.test.mjs`; add failing stable-ID coverage tests in `website/tests/scripts/check-requirement-coverage.test.mjs` that parse `^(FR|SC)-[0-9]+[A-Z]*$` and reject missing, duplicate, or numerically inferred suffixed requirements
- [ ] T012 [P] Write failing tests proving the live Release verifier paginates beyond 100 records, rejects draft, missing, wrong-repository, wrong-tag-SHA, local-only, and older otherwise-valid baselines, selects greatest `publishedAt` then numeric Release ID, accepts a nameless latest target prerelease, and falls back to its tag for display in `website/tests/scripts/check-release-live.test.mjs`

### Implementation for the foundation

- [ ] T013 Implement offline Qualifying Release Baseline parsing and validation in `website/scripts/check-release-baseline.mjs`
- [ ] T014 Implement fully paginated live enumeration of all target GitHub Releases, deterministic latest-qualifying selection by `publishedAt` then numeric Release ID, nameless-Release tag fallback, remote-tag comparison, stale-baseline rejection, and actionable unavailable/authentication/rate-limit errors in `website/scripts/check-release-live.mjs`; do not require network access during ordinary static builds
- [ ] T015 Implement Claim Evidence, Planned Syntax Example, authoritative-document inventory, and bilingual state validation in `website/scripts/check-claims.mjs`
- [ ] T016 Implement Feature 003 discrepancy parsing, Feature 002 source-ID coverage, closure rules, and publication blocking in `website/scripts/check-publication-discrepancies.mjs`; create the explicit FR/SC-to-task/test mapping in `website/data/requirement-coverage.json` and validate it with alphabetic-suffix preservation in `website/scripts/check-requirement-coverage.mjs`
- [ ] T017 Refactor `website/scripts/check-content.mjs` to consume `website/data/release-baseline.json`, `website/data/claim-evidence.json`, `website/data/pages.json`, the final public-content record, and `specs/003-oryxos-pages-publication/publication-discrepancies.yaml` instead of requiring prototype-only status
- [ ] T018 Update Page, template, claim, example, indexability, release-status, historical-restoration, all-pair parity, and semantic/decorative-image TypeScript types in `website/.vitepress/config/shared.ts` while preserving `/oryxos/`, locale counterpart resolution, and required route identities
- [ ] T019 Replace `website/data/prototype-content.json` with `website/data/public-content.json`, carrying forward approved navigation/actions/assets while defining public release status, final section labels, capability states, and planned-example warnings
- [ ] T020 Update imports and schema adapters in `website/.vitepress/config/metadata.ts`, `website/.vitepress/config/navigation.ts`, and existing theme components to read `website/data/public-content.json` without yet removing visible prototype UI
- [ ] T021 Add `check:release-baseline`, `check:release-live`, `check:claims`, `check:publication-content`, `check:requirement-coverage`, and `test:publication-scripts` commands to `website/package.json`; keep the live network check outside the ordinary offline build command
- [ ] T022 Run T009-T012 plus the existing suites from `website/package.json`, fix `website/scripts/`, `website/tests/scripts/`, and `website/data/` foundation files until all fixture tests pass, and prove pending, missing, or stale/non-latest qualifying Release states block publication, every explicit FR/SC including suffixed IDs has mapped coverage, and ordinary local schema validation remains deterministic

**Checkpoint**: Release, claim, discrepancy, and public-content models are machine-validatable. A pending or invalid
target Release blocks publication by design.

---

## Phase 3: User Story 1 - Visit the Trustworthy Official Website (Priority: P1; Publication-Ready Slice)

**Goal**: Convert the prototype into a truthful official bilingual Website whose current availability claims are
bound to one qualifying target GitHub Release and whose unavailable syntax is visibly non-executable.

**Independent Test**: Against a verified release fixture or live qualifying Release, build the site and browse all
required English/Chinese routes; no prototype notice or placeholder remains, prerelease status is consistent, every
`available` claim has release evidence, and every unavailable command/endpoint example is labeled non-executable.

### Tests for User Story 1

- [ ] T023 [P] [US1] Rewrite failing content fixtures for final public sections, prerelease status visibility, zero prototype wording, released-vs-unavailable claim handling, and planned syntax warnings in `website/tests/scripts/check-content.test.mjs`
- [ ] T024 [P] [US1] Add failing generated-output fixtures for release-status and historical-restoration notices, absence of draft markers/placeholders, accessible planned-example warnings, WCAG 2.2 AA shared text/key-control contrast, complete semantic/decorative-image handling, and public 404 copy in `website/tests/scripts/verify-build.test.mjs`
- [ ] T025 [P] [US1] Add failing Chromium assertions for equivalent English/Chinese release identity, maturity, capability boundaries, unavailable topic status, and non-executable examples in `website/tests/e2e/release-content.spec.ts`
- [ ] T026 [P] [US1] Rewrite home, architecture, roadmap, documentation, community, and no-JavaScript assertions for official public content in `website/tests/e2e/home.spec.ts`, `website/tests/e2e/architecture-roadmap.spec.ts`, `website/tests/e2e/documentation-community.spec.ts`, and `website/tests/e2e/static-content.spec.ts`

### Release evidence and content governance for User Story 1

- [ ] T027 [US1] Enumerate every paginated target Release and verify the latest qualifying published, non-draft GitHub Release/tag for `KI9I9/oryxos` by `publishedAt` then numeric Release ID using `specs/003-oryxos-pages-publication/quickstart.md`; if none exists, keep the null-identity pending baseline, record the original evidence/error in `website/data/publication-review.json`, continue generic work only, and leave release-specific content plus US1 completion blocked
- [ ] T028 [US1] Populate `website/data/release-baseline.json` only from the verified latest target Release, including numeric release ID/URL, nullable name with tag fallback, tag and commit SHA, publication/verification timestamps, prerelease flag, maturity label, `verificationStatus: verified`, empty `failureReasons`, and GitHub API provenance after latest-selection validation passes
- [ ] T029 [US1] Audit positioning, maturity, version, build, CLI, REST, Provider, ReAct Loop, Tool, Memory, Skill/Profile, security-property, governance, affiliation, adoption, and asset evidence from the qualifying Release tree, notes, license/governance records, and assets; record exact evidence references and bilingual handling in `website/data/claim-evidence.json`
- [ ] T030 [US1] Resolve or explicitly remove every Feature 002 publication blocker in `specs/003-oryxos-pages-publication/publication-discrepancies.yaml`; do not mark an entry resolved without verified claim IDs and resolution notes
- [ ] T031 [US1] Finalize public release labels, capability states, limitations, planned-example warnings, and localized actions in `website/data/public-content.json`
- [ ] T032 [US1] Convert all required Page records from prototype status to `public-reviewed` or `public-prerelease`, add claim/example/indexability relationships plus stable maturity, capability-boundary, primary-action, external-destination, semantic-image, and decorative-image identities for every locale pair, and replace placeholder template sections in `website/data/pages.json`

### Theme and shared presentation for User Story 1

- [ ] T033 [P] [US1] Implement an accessible localized release/maturity banner driven by `website/data/release-baseline.json` plus restore-mode historical/latest Release messaging in `website/.vitepress/theme/components/ReleaseStatusNotice.vue`
- [ ] T034 [P] [US1] Implement the semantically labeled non-executable command/endpoint treatment in `website/.vitepress/theme/components/PlannedSyntaxExample.vue`
- [ ] T035 [P] [US1] Implement final documentation structure for overview, current release status, released/design behavior, limitations, and related navigation in `website/.vitepress/theme/components/PublicDocShell.vue`
- [ ] T036 [US1] Replace `DraftNotice` and prototype shell mounting with release-aware public components in `website/.vitepress/theme/Layout.vue` and `website/.vitepress/theme/index.ts`
- [ ] T037 [US1] Remove obsolete prototype-only components `website/.vitepress/theme/components/DraftNotice.vue`, `website/.vitepress/theme/components/PrototypeDocShell.vue`, and `website/.vitepress/theme/components/LimitationsPlaceholder.vue` after all imports are migrated
- [ ] T038 [US1] Replace prototype notice, placeholder, and draft styles with release-status and planned-example styles in `website/.vitepress/theme/styles/base.css`, `website/.vitepress/theme/styles/documentation.css`, `website/.vitepress/theme/styles/not-found.css`, and `website/.vitepress/theme/styles/responsive.css`

### Core public pages for User Story 1

- [ ] T039 [P] [US1] Rewrite official English/Chinese home content and frontmatter in `website/index.md` and `website/zh/index.md` using only approved release claims and explicit prerelease maturity
- [ ] T040 [US1] Replace prototype positioning, legend-only behavior, and CTA copy with release-backed public presentation in `website/.vitepress/theme/components/HomeLanding.vue` and `website/.vitepress/theme/styles/home.css`
- [ ] T041 [P] [US1] Rewrite public architecture content in `website/architecture.md` and `website/zh/architecture.md`, then align released/unavailable relationships in `website/.vitepress/theme/components/ArchitectureMap.vue`
- [ ] T042 [P] [US1] Rewrite public roadmap content in `website/roadmap.md` and `website/zh/roadmap.md`, then align release, planned, and vision treatment in `website/.vitepress/theme/components/RoadmapTimeline.vue`
- [ ] T043 [P] [US1] Rewrite documentation landing content in `website/docs/index.md` and `website/zh/docs/index.md`, then replace prototype labels in `website/.vitepress/theme/components/DocumentationLanding.vue` and `website/.vitepress/theme/components/TopicGrid.vue`
- [ ] T044 [P] [US1] Rewrite equivalent concept pages in `website/docs/concepts/what-is-oryxos.md`, `website/docs/concepts/why-java.md`, `website/docs/concepts/design-principles.md`, `website/zh/docs/concepts/what-is-oryxos.md`, `website/zh/docs/concepts/why-java.md`, and `website/zh/docs/concepts/design-principles.md`
- [ ] T045 [P] [US1] Rewrite status, build, and contributing pages in `website/docs/project/project-status.md`, `website/docs/getting-started/build-from-source.md`, `website/docs/contributing.md`, `website/zh/docs/project/project-status.md`, `website/zh/docs/getting-started/build-from-source.md`, and `website/zh/docs/contributing.md`
- [ ] T046 [P] [US1] Rewrite Provider, ReAct Loop, and Tool pages in `website/docs/runtime/provider.md`, `website/docs/runtime/react-loop.md`, `website/docs/runtime/tool.md`, `website/zh/docs/runtime/provider.md`, `website/zh/docs/runtime/react-loop.md`, and `website/zh/docs/runtime/tool.md`
- [ ] T047 [P] [US1] Rewrite Memory and Skill/Profile pages in `website/docs/runtime/memory.md`, `website/docs/runtime/skill-profile.md`, `website/zh/docs/runtime/memory.md`, and `website/zh/docs/runtime/skill-profile.md`
- [ ] T048 [US1] Rewrite CLI and REST API pages in `website/docs/interfaces/cli.md`, `website/docs/interfaces/rest-api.md`, `website/zh/docs/interfaces/cli.md`, and `website/zh/docs/interfaces/rest-api.md`; render syntax absent from the qualifying Release only through `PlannedSyntaxExample.vue`
- [ ] T049 [P] [US1] Rewrite official community, repository, license, governance, and contribution content in `website/community.md`, `website/zh/community.md`, and `website/.vitepress/theme/components/CommunityLinks.vue`
- [ ] T050 [US1] Remove prototype wording from `website/404.md`, `website/translation-unavailable.md`, `website/zh/translation-unavailable.md`, `website/.vitepress/theme/components/NotFoundExperience.vue`, and the static no-JavaScript 404 markup in `website/.vitepress/config/index.ts`

### Authoritative-document synchronization and validation for User Story 1

- [ ] T051 [US1] Synchronize repository identity, asset paths, maturity, version, build, CLI, REST, capability, license, organization, and ASF-aspiration statements in `README.md` with the verified claim inventory; remove unsupported or retired references
- [ ] T052 [US1] Synchronize only claim-inventory-designated positioning, maturity, module, interface, and release statements in `CLAUDE.md`; do not modify Runtime implementation to make prose true
- [ ] T053 [US1] Run `npm run test:publication-scripts`, focused `release-content.spec.ts`, updated core-page E2E suites, and an all-page bilingual review that compares maturity, capability boundaries, primary actions, and external destinations; fix only Website/content/authoritative-document files owned by US1 until the story passes independently

**Checkpoint**: The official Website content is truthful and independently buildable against the qualifying Release.
It is not yet publicly deployable until workflow, discovery, and final external gates are complete.

---

## Phase 4: User Story 2 - Approve and Publish a Verified Release (Priority: P2)

**Goal**: Build and validate the exact `main` candidate, require protected maintainer approval, grant Pages
credentials only to the deploy job, prevent stale candidates, and record the resulting public revision.

**Independent Test**: Validate workflow fixtures and the checked-in workflow: PRs cannot deploy, failed or stale
candidates cannot reach Pages, an approved current-`main` candidate consumes its exact artifact, and only the
deploy job has Pages/OIDC write permission.

### Tests for User Story 2

- [ ] T054 [P] [US2] Rewrite workflow-policy fixtures for Constitution-required Runtime `./mvnw` use, read-only Website CI observation of `.github/workflows/ci.yml`, one exact Pages workflow, exact per-job permission matrix including a restore-only `contents/actions/deployments: read` preflight, official Pages actions with configure-pages confined to deploy, fixed publication-relevant triggers, `main` automatic publication excluding Runtime-CI-only and audit-only `website/data/publication-review.json`, `website/data/deployment-history/**`, and `website/data/publication-history/**` updates, protected most-recent-prior restoration inputs, digest-verified preflight/build-to-deploy-to-terminal evidence dependencies, one shared `cancel-in-progress: false` production group, active-slot-only restoration acceptance, post-approval source/Release freshness, no automatic cancellation of an accepted restoration, controlled failure behavior, and rejection everywhere else in `website/tests/scripts/workflow-policy.test.mjs`
- [ ] T055 [P] [US2] Add a repository-workflow integration test that scans the actual `.github/workflows/` directory and fails on missing/extra deploy-capable workflows in `website/tests/scripts/workflow-repository.test.mjs`
- [ ] T056 [P] [US2] Write candidate/deployment/history lifecycle fixtures in `website/tests/scripts/publication-candidate.test.mjs` for complete `sha256-publication-source-tree-v1` exclusions, automatic current/stale source and Release identity, generated `/oryxos/publication.json`, normalized generated-tree digest, unchanged-tree enforcement, candidate-unique Pages artifact name plus ID/run/attempt proof including rerun isolation, `sha256-evidence-payload-v1` manifests with digest-encoded names/returned IDs and self-reference rejection, missing/duplicate/wrong-run/attempt evidence, ambiguous deployment lookup, positive `schemaVersion` and exact Candidate/Pages Deployment/Public Release schemas, the sole `pending -> passed|failed` transition, smoke-failure state mapping, append-only history validation, failed validation, rejected approval, explicit cancellation, and failed Pages deployment; compare deployment ID, Website SHA, and public URL identity before/after every pre-deployment failure

### Implementation for User Story 2

- [ ] T057 [US2] Replace the blanket non-deployment policy with a repository scan in `website/scripts/check-workflows.mjs` that requires Runtime CI `./mvnw`, enforces a single Pages workflow/job allowlist including the read-only restore preflight and `if: always()` terminal finalizer, validates authoritative triggers and preflight/build/deploy/finalizer dependencies, requires configure-pages only in the protected deploy job, and continues rejecting third-party deploy actions and `gh-pages` branch publication
- [ ] T058 [US2] Implement the complete inclusion/exclusion manifest from `specs/003-oryxos-pages-publication/data-model.md` for publication-source-tree digest computation, candidate review binding, workflow run/attempt plus historical/latest Release ID/time/tag/SHA fields, candidate-unique Pages artifact name/ID fields, positive schema versions, validation aggregation, generated `website/.vitepress/dist/publication.json`, normalized generated-tree manifest/digest, unchanged-tree verification, and `website/.publication/candidate.json` in `website/scripts/prepare-publication-candidate.mjs`; implement `sha256-evidence-payload-v1` manifests with attempt-unique digest-encoded artifact names and separate out-of-payload deterministic name/manifest digest, returned artifact ID/upload-Action digest, and workflow run/attempt evidence, plus append-only `website/data/deployment-history/<deploymentId>.json` and `website/data/publication-history/<publicReleaseId>.json` validation/serialization, in `website/scripts/record-publication-history.mjs`
- [ ] T059 [US2] Implement the post-approval target `main` SHA and exact latest Release ID/publication-time/tag/SHA guard for automatic candidates, with restore-mode current-`main` exemption plus exact historical/latest Release revalidation, in `website/scripts/check-publication-freshness.mjs`
- [ ] T060 [US2] Add repository workflow scanning, candidate/history/evidence tests, `test:workflow-policy`, and publication-candidate/history checks to `website/package.json`; ensure `npm run test:publication` invokes the real checked-in workflow scan
- [ ] T061 [US2] Update `.github/workflows/website-ci.yml` to run offline publication quality checks for relevant `website/**`, Feature 003, Website workflows, `.github/workflows/ci.yml`, `README.md`, `CLAUDE.md`, and `LICENSE` pull requests/pushes with `contents: read`, Chromium-only validation, and no Pages/OIDC permissions
- [ ] T062 [US2] Update `.github/workflows/website-review-artifact.yml` to build a clearly labeled non-deploying review artifact with `contents: read` and the full offline publication quality gate
- [ ] T063 [US2] After T084, create the automatic/manual candidate build job in `.github/workflows/website-pages.yml` with `contents: read`/`actions: read`, the fixed Website/Feature/Workflow plus `README.md`/`CLAUDE.md`/`LICENSE` trigger set, `website/.nvmrc`, `npm ci`, Chromium, latest-live-Release verification, discrepancy/claim/content, all-pair parity, WCAG contrast, image-semantics, publishable-source/generated-output safety, deterministic assets, type checking, production build, generated revision metadata, normalized tree digest, and `actions/upload-pages-artifact` under a run-attempt-unique candidate name; record its returned ID plus workflow run/attempt context and upload a separate `sha256-evidence-payload-v1` provenance artifact with attempt-unique digest-encoded name plus distinct deterministic name/manifest digest, returned ID/upload-Action digest, and run/attempt context outputs, while excluding automatic triggers for audit-only `website/data/publication-review.json`, `website/data/deployment-history/**`, and `website/data/publication-history/**`
- [ ] T064 [US2] Add the protected deploy job to `.github/workflows/website-pages.yml` with dependency on the exact build result, `github-pages` environment, only `contents: read`, `actions: read`, `deployments: read`, `pages: write`, and `id-token: write`; run `actions/configure-pages` here rather than in the read-only build job, verify provenance through the Actions API plus `sha256-evidence-payload-v1`, prove the candidate Pages artifact name resolves uniquely to its recorded ID/workflow run through the API, and separately require its encoded run/attempt to match Candidate, trusted build outputs, and current workflow context; perform post-approval current-`main` plus exact Release freshness checks, deploy by artifact name, preserve the normalized digest, resolve the exact GitHub deployment via environment/SHA/status `log_url` run correlation, record contractual `approvalReleasedAt`, and upload an attempt-unique pending-deployment evidence artifact with distinct deterministic name/manifest digest, returned ID/upload-Action digest, and run/attempt outputs containing `website/.publication/pages-deployment.json`
- [ ] T065 [US2] Add one shared workflow-level production concurrency group with `cancel-in-progress: false` to `.github/workflows/website-pages.yml`, covering restore preflight, automatic/restoration build, approval, deployment, and terminal finalization/post-deployment verification; create restoration acceptance only after active-slot acquisition, explicitly permit GitHub replacement of a still-unaccepted pending dispatch, and rely on T059 freshness rejection so a new automatic run cannot cancel an accepted restoration
- [ ] T066 [US2] After T084, add an `if: always()` read-only terminal finalizer to `.github/workflows/website-pages.yml` with build/preflight/deploy dependencies and only `contents: read`, `actions: read`, and `deployments: read`; always verify the exact restore-preflight artifact in restore mode, and for completed deployment also digest-verify run-attempt-specific provenance/pending evidence, verify the returned Pages URL including `/oryxos/publication.json`, routes/assets/metadata/security/accessibility and candidate/Release/artifact/deployment identity, set `verificationCompletedAt`, transition Candidate and Pages Deployment Record to `verified`/`passed` or `degraded`/`failed`, and write exact-schema `website/.publication/public-release.json` only on pass; for an accepted restoration ending before candidate/deployment, create the exact state-conditional Request/Result-only evidence from the authenticated preflight payload; upload one attempt-unique `sha256-evidence-payload-v1` terminal bundle with distinct deterministic name/manifest digest, returned ID/upload-Action digest, and run/attempt evidence and never automatically deploy a fallback
- [ ] T067 [US2] Verify or configure the target repository Pages source and `github-pages` environment using `specs/003-oryxos-pages-publication/quickstart.md`; require at least one authorized maintainer, allow self-review, and record original API/settings evidence in `website/data/publication-review.json`; stop and ask the owner on permission failure
- [ ] T068 [US2] After T084, run all workflow-policy, repository-scan, candidate/history/evidence digest, source/Release freshness, artifact name-ID-run-attempt/rerun-isolation, deployment lookup, exact Public Release schema, terminal-transition, pre-deployment no-change failure, degraded post-deployment, dependency, permission, `cancel-in-progress: false` concurrency/active-slot acceptance, accepted-restoration non-cancellation, authoritative-trigger, all audit-only exclusions, and checked-in YAML validations; fix only `.github/workflows/website-*.yml`, `website/scripts/check-workflows.mjs`, candidate/history scripts, tests, and package scripts until US2 passes with shared US3 tooling

**Checkpoint**: The publication path is least-privilege, protected, auditable, and stale-safe. It still cannot
publish until US1, US3, final review, and live Release/environment gates pass.

---

## Phase 5: User Story 3 - Discover and Share Localized Public Pages (Priority: P2)

**Goal**: Give each public page correct absolute identity, localized alternatives, sharing metadata, sitemap and
robots discovery, and public project-path recovery.

**Independent Test**: Build locally with the approved public origin and verify every indexable English/Chinese page
has one absolute canonical, correct absolute alternates and social URLs, appears exactly once in the sitemap, and
loads required resources below `/oryxos/`; utility/test routes are excluded or noindexed.

### Tests for User Story 3

- [ ] T069 [P] [US3] Rewrite failing build fixtures for absolute canonical, `hreflang`, `x-default`, `og:url`, absolute social images, sitemap, robots, indexability exclusions, and public-origin normalization in `website/tests/scripts/verify-build.test.mjs`
- [ ] T070 [P] [US3] Add failing Chromium metadata/discovery assertions for representative English/Chinese pages, unavailable topic pages, translation fallback, and 404 behavior in `website/tests/e2e/metadata-discovery.spec.ts`
- [ ] T071 [P] [US3] Add failing public-origin route/resource/metadata/revision-trace/historical-restoration fixtures in `website/tests/scripts/verify-public-site.test.mjs`, including every generated public HTML page plus translation-recovery/404 notice coverage, and safety/accessibility fixtures in `website/tests/scripts/check-public-safety.test.mjs` covering every publishable-source root and generated-output file, prohibited content classes, unexpected public file types, binary asset inventory, all rendered semantic/decorative images, shared text/key-control contrast states, and proof that no output path is silently skipped

### Implementation for User Story 3

- [ ] T072 [US3] Add approved origin, project-base URL builders, canonical normalization, and indexability helpers in `website/.vitepress/config/shared.ts`
- [ ] T073 [US3] Generate absolute canonical, English/Chinese/`x-default` alternates, `og:url`, absolute Open Graph/Twitter image URLs, and utility-route noindex metadata in `website/.vitepress/config/metadata.ts`
- [ ] T074 [US3] Configure VitePress sitemap generation from indexable Page records and the approved hostname in `website/.vitepress/config/index.ts`; exclude fallback fixtures, 404, and non-indexable utility routes
- [ ] T075 [P] [US3] Add crawler policy and the absolute sitemap reference in `website/public/robots.txt`
- [ ] T076 [US3] Remove `website/test-fixtures/locale-fallback.md` from the publishable VitePress source tree and move counterpart-fallback behavior to non-generated test fixtures under `website/tests/fixtures/locale-fallback/`
- [ ] T077 [US3] Mark translation-unavailable routes and bilingual 404 recovery with deliberate noindex/sitemap behavior in `website/data/pages.json`, `website/.vitepress/config/metadata.ts`, and `website/.vitepress/config/index.ts`
- [ ] T078 [P] [US3] Review and update localized public-origin titles/descriptions, exact `pagePurposeId`, full route identity, `socialImageAlt`, all semantic-image alternative text, decorative-image exclusions, all-pair primary-action/external-destination identities, and ownership metadata in `website/data/pages.json`, `website/data/public-content.json`, and `website/public/brand/asset-manifest.json`
- [ ] T079 [US3] Extend `website/scripts/verify-build.mjs` to enforce the public-site contract, including all-pair purpose parity, WCAG 2.2 AA shared text/key-control contrast, complete rendered-image semantic/decorative inventory, and historical-restoration notice coverage on every generated public HTML page including translation-recovery/404 output, while retaining route/fragment graph, required asset, favicon, social-image, project-base, and no-broken-resource checks
- [ ] T080 [US3] Implement exact-root publishable-source enumeration plus complete generated-output enumeration/prohibited-content/file-type scanning from `specs/003-oryxos-pages-publication/contracts/public-site.md` in `website/scripts/check-public-safety.mjs`, and HTTPS verification for required routes, assets, metadata, sitemap, robots, latest or historical-restoration Release identity, mandatory restoration notice, exact serialized `publicOrigin`, `/oryxos/publication.json`, candidate SHA, and local/placeholder-origin absence in `website/scripts/verify-public-site.mjs`
- [ ] T081 [US3] Make Playwright accept an explicit public base URL without changing the default local preview behavior in `website/playwright.config.ts` and `website/tests/e2e/site-fixtures.ts`
- [ ] T082 [US3] Implement `website/tests/e2e/metadata-discovery.spec.ts` and `website/tests/e2e/public-smoke.spec.ts` against local/public base modes while preserving Chromium-only execution
- [ ] T083 [US3] Update locale-switching, site-integrity, no-JavaScript, and 404/asset tests in `website/tests/e2e/locale-switching.spec.ts`, `website/tests/e2e/site-integrity.spec.ts`, `website/tests/e2e/static-content.spec.ts`, and `website/tests/e2e/not-found-assets.spec.ts` for absolute metadata and non-generated fixtures
- [ ] T084 [US3] Add `check:public-safety`, contrast/image/parity fixture tests, `verify:public-site`, and `test:e2e:public` commands to `website/package.json`; include source/output safety plus build-time contrast/image/parity checks in `test:publication` while keeping live public-origin commands separate when no deployment exists; this task is a prerequisite for T063, T066, T068, and T092
- [ ] T085 [US3] Run the build, metadata/discovery, locale, no-JavaScript, route/resource, source/output safety, revision-trace, and local public-origin simulation commands from `website/package.json`; fix only `website/.vitepress/config/`, `website/public/`, `website/scripts/check-public-safety.mjs`, `website/scripts/verify-build.mjs`, `website/scripts/verify-public-site.mjs`, and US3 tests until the story passes independently

**Checkpoint**: The exact Website output is discovery-ready for the approved Pages origin and can be validated
without deploying it.

---

## Phase 6: User Story 4 - Recover from a Publication Problem (Priority: P3)

**Goal**: Allow an authorized maintainer to rebuild, revalidate, approve, and redeploy a prior Website revision
whose immutable public verification passed, without accepting arbitrary SHAs or expiring artifacts.

**Independent Test**: With deployment-history fixtures, accept only prior Pages revisions whose immutable
post-deployment verification passed, reject arbitrary, failed, or unverified revisions, rebuild the selected source,
re-run release/content quality, require the same environment approval, and record the restored revision.

### Tests for User Story 4

- [ ] T086 [P] [US4] Write failing eligibility fixtures in `website/tests/scripts/check-restoration-target.test.mjs` for paginated GitHub deployments joined to retained terminal artifacts and append-only `website/data/deployment-history/` plus `website/data/publication-history/`; cover current deployment, most-recent-prior distinct passed record across automatic/restore and current/superseded states, equal timestamps resolved by greater numeric deployment ID, same-revision repeat, older non-most-recent, degraded/pending, missing/expired/unreconciled, wrong-repository/run/attempt/artifact/digest, ambiguous/contradictory evidence, arbitrary SHA, and R2-to-R1 historical restoration only with exact dual-Release evidence and every-public-HTML notice policy
- [ ] T087 [P] [US4] Add failing workflow fixtures for non-empty reason, target confirmation required before eligible candidate creation but optional for no-prior resolution, default-branch history resolution before immutable target checkout, full rebuild/revalidation, protected environment, self-approval, shared `cancel-in-progress: false` production serialization, `acceptedAt` only after the run becomes active rather than merely queued, proof a new automatic run cannot cancel an accepted restoration waiting for approval/deploy/verification, post-approval historical/latest Release revalidation, digest-verified restore-preflight and later evidence handoff, `if: always()` read-only terminal finalization for blocked/rejected/observable-cancelled/failed-before-deployment restore states, hard-cancel incomplete-terminalization handling, read-only post-restore verification, and no current-`main` guard in restore mode to `website/tests/scripts/workflow-policy.test.mjs`
- [ ] T088 [P] [US4] Write failing schema/state tests in `website/tests/scripts/restoration-record.test.mjs` as three explicit matrices: Restoration Request `eligibilityStatus` (`pending`, `eligible`, `rejected`, `blocked-no-prior-release`), Request `status` (`requested`, `validating`, `awaiting-approval`, `completed`, `cancelled`), and Restoration Result `status` (`restored`, `rejected`, `failed-before-deployment`, `degraded`, `cancelled`, `blocked-no-prior-release`); validate positive schema versions, matching workflow run/attempt and run-level URL semantics, request-owned reason/actor preservation, authenticated syntactically-valid acceptance time, exact historical/latest Release IDs/times/tags/SHAs, the single approval-wait interval, structured outage evidence, `[acceptedAt, smokePassedAt]` overlap, double-deduction rejection, derived seconds, pass-only `smokePassedAt`/`restorationEffectiveDurationSeconds`, exact `failureDetails`, and null success metrics plus zero observation overlap for every non-restored result

### Implementation for User Story 4

- [ ] T089 [US4] Implement paginated current/deployment lookup and authenticated retained-terminal-artifact retrieval joined with append-only default-branch `website/data/deployment-history/` and `website/data/publication-history/` in `website/scripts/check-restoration-target.mjs`; verify repository/workflow run/attempt/candidate/deployment/Pages and terminal artifact name-ID/upload-Action-digest/evidence-manifest-digest consistency, order passed records by completion time then numeric deployment ID across automatic/restore and current/superseded states, select the most-recent-prior distinct Website SHA, choose historical/latest Runtime Release policy, and reject same-current, older, degraded/pending, expired-unreconciled, ambiguous/contradictory, or arbitrary revisions
- [ ] T090 [US4] Implement exact Restoration Request/Result serialization in `website/scripts/prepare-restoration-candidate.mjs`: preserve `website/.publication/restoration-request.json` with workflow run/attempt, nullable current/target identities for no-deployment/no-prior cases, exact target Public Release linkage, request-owned reason/actor, eligibility, candidate linkage, authenticated syntactically-valid `acceptedAt`, candidate-ready approval-wait start, and successful `approvalReleasedAt` or authenticated rejection/cancellation end; generate terminal `website/.publication/restoration-result.json` with matching workflow run/attempt, historical/latest Release IDs/publication times/tags/SHAs, baseline policy, Pages deployment linkage, structured outage evidence, derived `approvalWaitSeconds`/`excludedOutageSeconds`, pass-only `smokePassedAt`/`restorationEffectiveDurationSeconds`, exact `failureDetails`, and Result status
- [ ] T091 [US4] Extend manual `workflow_dispatch` with a restore-only preflight job in `.github/workflows/website-pages.yml` using exactly `contents: read`, `actions: read`, and `deployments: read`; after active-slot acquisition accept explicit restore mode, non-empty reason, and optional deployment ID/Website SHA confirmation, resolve default-branch and retained GitHub evidence before checkout, require confirmation to match the most-recent-prior distinct target/Public Release before candidate creation, reject omission when a target exists, immediately upload attempt-unique `sha256-evidence-payload-v1` Request/eligibility evidence with distinct deterministic name/manifest digest, returned ID/upload-Action digest, and run/attempt outputs, and make conditional build/finalizer jobs authenticate it for `blocked-no-prior-release` or other pre-deployment terminalization
- [ ] T092 [US4] After T084, resolve the latest-live Runtime Release, reverify the selected historical Release ID/publication time/tag/SHA, generate and validate the bilingual historical-restoration notice on every generated public HTML page including translation-recovery/404 output, complete publication/safety/accessibility gates, revision metadata, normalized digest, run-attempt-unique Pages artifact plus provenance evidence, `github-pages` approval, immediate post-approval exact historical/latest Release revalidation, protected deployment by artifact name, and read-only post-restore verification in `.github/workflows/website-pages.yml`; do not reuse historical artifacts or overwrite the tracked automatic baseline
- [ ] T093 [US4] Record restored Pages deployment/artifact name-ID-run-attempt identity, Website SHA, historical/latest Runtime Release IDs/publication times/tags/SHAs, baseline policy, request linkage, workflow/public URLs, acceptance/approval-wait/verification timestamps, structured outage exclusions/derived seconds, pass-only `smokePassedAt`/`restorationEffectiveDurationSeconds` or exact `failureDetails`, and terminal Result status in GitHub summaries and one attempt-unique `sha256-evidence-payload-v1` terminal bundle whose deterministic name/manifest digest, returned ID/upload-Action digest, and workflow run/attempt remain outside the payload; include `website/.publication/candidate.json`, `website/.publication/pages-deployment.json`, conditional `website/.publication/public-release.json`, `website/.publication/restoration-request.json`, and `website/.publication/restoration-result.json`
- [ ] T094 [US4] Add restoration eligibility, record, and workflow tests to `website/package.json` publication suites
- [ ] T095 [US4] Run restoration selection/timing/history/evidence and workflow-policy suites, then perform a manual dry validation against paginated GitHub deployment plus retained/tracked terminal evidence when available; preserve `website/.publication/restoration-request.json` and `website/.publication/restoration-result.json` in the state-conditional terminal bundle and record Result `status: blocked-no-prior-release` without Candidate/Pages/Public Release objects rather than fabricating success if no most-recent-prior distinct deployment has complete evidence

**Checkpoint**: Restoration is implemented and testable. A live restoration drill remains conditional on an
eligible prior deployment with passed post-deployment verification.

---

## Phase 7: Final Quality, Approval, Publication, and Recovery Evidence

**Purpose**: Close cross-cutting security/content gates, publish only the exact approved candidate, verify the live
site, and record restoration evidence without mutating the reviewed source afterward.

- [ ] T096 [P] Revalidate repository, issue, license, organization, governance, contribution, release, and Pages destinations; update only `website/data/external-links.json`, affected public pages, and `website/data/publication-review.json` when an approved destination changes
- [ ] T097 [P] Run focused accessibility and responsive review for `ReleaseStatusNotice.vue`, historical-restoration state, `PlannedSyntaxExample.vue`, public 404, and representative English/Chinese routes in `website/tests/e2e/accessibility.spec.ts` and `website/tests/e2e/responsive.spec.ts`; verify WCAG 2.2 AA contrast for every shared text/key-control state, enumerate all public semantic/decorative images, and preserve 320-1440 widths, keyboard focus, reduced motion, and 200% zoom checks
- [ ] T098 Run a fresh `npm ci`, `npm run test:publication`, `npm run test:workflow-policy`, `npm run check:public-safety`, and `npm run docs:build` from `website/` with no Runtime process, database, private credential, Maven command, or live deployment
- [ ] T099 Verify the final repository diff for `website/`, `.github/workflows/`, `README.md`, `CLAUDE.md`, and `specs/003-oryxos-pages-publication/` does not modify Runtime Java implementation merely to support Website claims, depend on retired-site content, commit generated/cache/browser output, or grant Pages/OIDC write permissions outside the approved deploy job
- [ ] T100 Re-enumerate every paginated target Release and verify the tracked Release/tag is still the latest qualifying `KI9I9/oryxos` baseline by `publishedAt` then numeric Release ID; if absent, draft, mismatched, superseded, stale, or otherwise non-qualifying, set `website/data/publication-review.json` to `blocked` and stop before publication
- [ ] T101 Complete the final all-page bilingual content/action/destination parity, claim-evidence including security-property/affiliation/adoption, authoritative-document, metadata, asset/image semantics, WCAG contrast, external-link, Chromium, workflow, source/output safety, requirement-ID coverage, and discrepancy review in `website/data/publication-review.json`; compute `sha256-publication-source-tree-v1` with every exclusion in `specs/003-oryxos-pages-publication/data-model.md`, including `.publication`, publication review, deployment history, and publication history audit records, treat the digest as the authorized pre-candidate revision, leave `websiteCommitSha` null before candidate creation, and approve only when every blocking result passes
- [ ] T102 Verify GitHub Pages source and `github-pages` environment settings from `specs/003-oryxos-pages-publication/quickstart.md`, including at least one authorized reviewer and self-review allowed; on permission failure, report the command/path/error and ask the repository owner rather than bypassing the gate
- [ ] T103 Run the repository-root Runtime gate through the committed Maven Wrapper after T004 and after all synchronized `CLAUDE.md` changes: execute `./mvnw verify`, preserve the complete applicable Runtime quality result in `website/data/publication-review.json`, and stop before delivery if it fails; do not substitute Website tests or system `mvn`
- [ ] T104 Deliver the exact approved publication-relevant source tree to target `main` through the repository's normal review process, then verify the Workflow candidate's recomputed `reviewedSourceTreeDigest` matches `website/data/publication-review.json` and its SHA equals current `origin/main` before approval
- [ ] T105 Observe the complete build/validation job for `.github/workflows/website-pages.yml`; do not approve if latest Release, content, all-pair parity, contrast/image semantics, source/output safety, requirement coverage, generated revision metadata, normalized artifact digest, run-attempt-unique Pages artifact name-ID-run-attempt evidence, provenance artifact digest, metadata, Chromium, workflow, or freshness checks fail
- [ ] T106 Approve the exact candidate through protected `github-pages` as an authorized maintainer; verify the deploy job rechecks current source and Release identities, proves the run-attempt-unique candidate artifact name maps uniquely to the recorded ID/workflow run through the Actions API, independently verifies its encoded attempt against Candidate/trusted outputs/current context, invokes the official action by that name, resolves one exact GitHub deployment, and records contractual `approvalReleasedAt` from its earliest `in_progress` status; self-approval is permitted
- [ ] T107 Observe the read-only post-deployment job and independently run `npm run verify:public-site` plus `npm run test:e2e:public` from `website/package.json` against `https://ki9i9.github.io/oryxos/`; verify routes, metadata, sitemap, robots, assets, accessibility, safety, `/oryxos/publication.json`, and artifact/candidate/Release/deployment identity; download and digest-check the terminal bundle, always preserve `website/.publication/pages-deployment.json`, create exact-schema `website/.publication/public-release.json` only after the first complete smoke pass within 10 minutes of `approvalReleasedAt`, and preserve degraded evidence without claiming a Public Release
- [ ] T108 If a most-recent-prior eligible distinct deployment has complete GitHub plus retained/tracked terminal evidence, execute the protected restoration drill from `specs/003-oryxos-pages-publication/quickstart.md`, including R2-to-R1 historical baseline when applicable; verify Website SHA, every-public-HTML dual-Release notice, request/result linkage, structured outage evidence, and first smoke pass within 15 effective minutes after the single approval-wait/outage deductions, preserving both `.publication` restoration records; otherwise record `blocked-no-prior-release` in the Result and do not claim live success
- [ ] T109 Before workflow artifacts expire, reconcile each digest-verified terminal bundle's deterministic name/manifest digest, returned artifact ID/upload-Action digest, and workflow run/attempt into `website/data/publication-review.json`; append immutable `website/data/deployment-history/<deploymentId>.json` for every terminal deployment and `website/data/publication-history/<publicReleaseId>.json` only for a pass, include linked Restoration Request/Result when applicable, reject any overwrite or digest/name/attempt mismatch, record a hard-cancel with retained preflight/provenance evidence but no terminal bundle as incomplete terminalization without fabricating a Result, set `decision: published` only for a passed Pages Deployment Record with its exact Public Release, and keep degraded/blocked restoration status distinct
- [ ] T110 Run fresh offline publication, requirement-coverage, history-integrity, and workflow-policy gates from `website/package.json` after audit-only changes to `website/data/publication-review.json`, `website/data/deployment-history/**`, or `website/data/publication-history/**`; verify `.github/workflows/website-pages.yml` does not auto-publish those edits, and if public content, metadata, workflow, or build source changes, return to T098 and publish a newly reviewed candidate

**Final Checkpoint**: The official bilingual Website is traceable to one approved Website revision and its verified
Runtime Release baseline, with the latest qualifying Runtime Release separately identified during historical
restoration; it is published only through the protected least-privilege Pages path and has verified
public route/metadata/accessibility/security behavior. Restoration capability is automated; live restoration
success is claimed only when an eligible prior deployment has actually been restored.

---

## Dependencies & Execution Order

### Phase dependencies

- **Phase 1 - Setup**: Starts immediately and remains non-deploying. T001 creates the evidence record and T002
  captures the unchanged baseline before T003/T004 alter Workflow policy.
- **Phase 2 - Foundation**: Depends on Phase 1 and blocks all user-story implementation.
- **Phase 3 - US1**: Depends on Phase 2. Generic tests, components, and workflow integration can proceed with
  rejected/pending/verified fixtures, but T027 blocks T028-T032, release-specific content finalization, and US1
  completion until a live qualifying target GitHub Release exists.
- **Phase 4 - US2**: T054-T062 depend on Phase 2 and can develop structural workflow/candidate policy in parallel
  with US1 after shared schemas stabilize. T063, T066, and T068 depend on T084 so the Workflow cannot consume
  safety/public-verification commands before they exist. Live environment verification T067 depends on
  repository-owner access.
- **Phase 5 - US3**: Depends on Phase 2 and approved origin; may proceed in parallel with US1/US2, but final metadata
  wording depends on release/public page records from T028-T032.
- **Phase 6 - US4**: Depends on Phase 4 workflow structure and T084 shared verification tooling; T092 explicitly
  depends on T084. Live restoration evidence depends on a most-recent-prior passed-verification Pages deployment
  with a Website SHA distinct from the current deployment.
- **Phase 7 - Final publication**: Depends on all selected user stories and every external release/environment gate.
  T103 must record a successful Runtime `./mvnw verify` result before T104 delivers the candidate to `main`.

### User story dependencies

```text
Setup -> Foundation
Foundation -> US1
Foundation -> US2
Foundation -> US3
US3 shared verification tooling (T084) -> US2 deployment jobs (T063/T066/T068)
US2 + T084 -> US4
US1 + US2 + US3 + US4 -> Final publication
Qualifying target GitHub Release -> US1 official content completion -> Final publication
Protected environment access -> US2 live verification -> Final publication
Most-recent-prior distinct passed-verification Pages deployment -> US4 live restoration drill
```

- **US1 (P1)**: Its content slice starts after Foundation and has the qualifying Release external gate; final User
  Story acceptance depends on US2 deployment and US3 public-origin verification.
- **US2 (P2)**: Its structural policy and candidate lifecycle are independently testable after Foundation; full
  Workflow completion waits for T084 shared safety/public-verification tooling.
- **US3 (P2)**: Independently testable with local public-origin simulation after Foundation and public page schema.
- **US4 (P3)**: Depends on US2's publication workflow but remains independently testable with deployment-history
  fixtures before a live prior release exists.

### Within each story

- Write and observe focused test failures first.
- Define/verify data records before components and page integration.
- Complete implementation before story-focused integration tests.
- Do not change a release or claim state merely to satisfy a test.
- Do not cross an external publication/permission gate without verified evidence.

## Parallel Opportunities

### Setup and foundation

- T001 must precede T002, and T002 must precede the Workflow changes T003/T004.
- T005-T008 can run in parallel after T002 because they create separate ignore/data/spec records.
- T009-T012 can run in parallel because they create separate fixture test files.
- T013-T016 can proceed in parallel after their corresponding tests exist; T017 waits for their public APIs.

### User Story 1

- T023-T026 tests can be authored in parallel.
- After T028-T032 establish the baseline and claim/page records, T033-T035 can run in parallel.
- T039, T041-T047, and T049 can be split by disjoint bilingual page groups.
- T051 and T052 can run in parallel after the claim inventory is verified.

### User Story 2

- T054-T056 tests can run in parallel.
- T058 and T059 can run in parallel after candidate test contracts are fixed.
- T061 and T062 can run in parallel; after T084, T063-T066 modify the shared Pages workflow and should be
  sequential.

### User Story 3

- T069-T071 tests can run in parallel.
- T075 and T078 can run in parallel with metadata implementation because they change separate files.
- T080 and T081 can run in parallel after public-origin behavior is defined.

### User Story 4

- T086-T088 tests can run in parallel.
- T089 and T090 can run in parallel after their fixture contracts are fixed.

## Parallel Examples

### US1: Public content slices

```text
Task A: T041 Architecture pages and ArchitectureMap
Task B: T042 Roadmap pages and RoadmapTimeline
Task C: T044 Concept page pairs
Task D: T046 Provider/ReAct/Tool page pairs
Task E: T047 Memory/Skill-Profile page pairs
```

### US2: Policy and candidate services

```text
Task A: T054 Workflow allowlist tests
Task B: T055 Checked-in workflow scan test
Task C: T056 Candidate provenance/freshness tests
After tests: T058 candidate preparation and T059 freshness guard in parallel
```

### US3: Discovery validation

```text
Task A: T069 Generated metadata/sitemap/robots fixtures
Task B: T070 Chromium metadata/discovery tests
Task C: T071 Public-origin verifier fixtures
```

### US4: Restoration validation

```text
Task A: T086 restoration target eligibility fixtures
Task B: T087 restoration workflow fixtures
Task C: T088 restoration state-transition fixtures
```

## Implementation Strategy

### First increment: User Story 1 publication-ready content slice

1. Complete Setup and Foundation.
2. Obtain and verify a qualifying target GitHub Release.
3. Complete US1 release evidence, public content, bilingual pages, and authoritative-document synchronization.
4. Stop and validate the US1 content slice locally; it is not an independently accepted User Story until US2 and
   US3 provide the official public address and post-deployment verification.

If no qualifying Release exists, the safe interim deliverable is the validator/schema foundation plus a blocked
publication review. It is not an official Website release.

### Incremental delivery

1. **Foundation**: deterministic release/claim/discrepancy governance.
2. **US1**: trustworthy official bilingual content.
3. **US2**: protected least-privilege publication workflow.
4. **US3**: canonical metadata, discovery, and public-origin verification.
5. **US4**: protected restoration capability.
6. **Final**: external settings, approval, actual Pages release, live smoke checks, and conditional restoration drill.

### Multi-developer strategy

After Foundation:

- Developer A: US1 content/evidence and bilingual page conversion.
- Developer B: US2 workflow policy and Pages candidate/deploy path.
- Developer C: US3 metadata, sitemap, robots, and public smoke verification.
- Developer D: US4 restoration fixtures and eligibility logic after US2 workflow contracts stabilize.

Merge story branches only after their technical checkpoints pass; US1 and the overall Feature are accepted only
after the integrated public deployment, post-deployment verification, and external gates pass.

## Notes

- `[P]` means separate files and no dependency on another incomplete task in the same phase.
- Every user-story task includes its `[US#]` label and an exact path.
- A live GitHub failure or permission error is a blocking result, not a reason to switch repository, install tools
  in an unapproved location, weaken checks, or publish through another mechanism.
- Keep Feature 002 artifacts as historical prototype evidence; Feature 003 owns publication discrepancy closure.
- Do not commit `.vitepress/dist`, `.vitepress/.temp`, browser reports, dependency directories, or expiring
  publication artifacts.
- Do not push, create Releases, configure repository environments, approve deployments, or publish unless the task
  explicitly reaches that external step and the user has authorized the required repository operation.
