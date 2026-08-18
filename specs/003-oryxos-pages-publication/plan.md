# Implementation Plan: OryxOS GitHub Pages Publication

**Branch**: `003-oryxos-pages-publication` | **Date**: 2026-08-18 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-oryxos-pages-publication/spec.md`

## Summary

Promote the Feature 002 bilingual VitePress visual prototype into the official OryxOS GitHub Pages project site
at `https://ki9i9.github.io/oryxos/`. The implementation will replace prototype-only content state with a
qualifying GitHub Release baseline, bilingual claim evidence, public prerelease/status handling, absolute public
metadata, sitemap/robots discovery, and final-content validation. It will add one least-privilege Pages workflow
whose exact candidate is built and validated before entering a protected `github-pages` environment requiring one
authorized maintainer approval, with self-approval permitted. The workflow will generate public revision metadata,
compute a deterministic generated-tree digest, bind a candidate-unique Pages artifact name to its returned
ID and workflow run/attempt context, and run a read-only post-deployment verification job with digest-verified
cross-job evidence. A successful Pages action creates a Pages Deployment Record, while only a passed public smoke
result creates an exact-schema Public Release. Terminal evidence is reconciled into append-only
deployment/publication history for
protected restoration of the most recent prior eligible distinct Website revision, including a controlled
historical-baseline mode with a bilingual notice on every generated public HTML page when that deployment predates
the latest Runtime Release.

Publication remains externally blocked until `KI9I9/oryxos` has a published, non-draft GitHub Release bound to a
target-repository tag. Planning found local `v0.1.x-RELEASE` tags but no matching tags on `origin`; those tags are
not valid target-repository release evidence.

## Technical Context

**Language/Version**: Node.js 24.11.0 LTS; npm 11.6.1; TypeScript 5.9.3; Vue 3.5.41; Markdown; JSON; YAML; GitHub
Actions workflow YAML

**Primary Dependencies**: Existing VitePress 1.6.4, Vue, `vue-tsc`, Playwright 1.62.1, axe 4.13.0, `yaml`, and
`@resvg/resvg-js`; VitePress sitemap/build hooks; official GitHub Pages actions for configuration, artifact upload,
and deployment; GitHub Release/Deployment metadata supplied by the target repository

**Storage**: Repository-owned JSON/YAML release-baseline, claim-evidence, page-manifest, discrepancy, review, and
append-only deployment/publication history records; digest-verified GitHub Actions evidence artifacts; GitHub
Release, Actions run, environment approval, Pages deployment, and deployment-status metadata; no Website database,
browser persistence, CMS, or Runtime data service

**Testing**: Existing Node.js `node:test` suites; expanded content/release/claim/workflow validators; publishable
source and generated-output safety scanning; deterministic asset and Pages-tree digest checks; TypeScript checking;
VitePress production build and internal graph validation; Playwright Chromium and axe against local production
preview; automated and manual WCAG 2.2 AA contrast checks; complete semantic/decorative image checks; a read-only
Workflow post-deployment route/resource/metadata/security/revision smoke job; controlled pre-deploy failure-state
fixtures; artifact name/ID/run/attempt, deployment lookup, evidence transport/history integrity, and suffixed-requirement
coverage fixtures; manual bilingual content, 200% zoom, release-evidence, protected-environment, and restoration review;
separate Runtime `./mvnw verify` evidence because this Feature changes Runtime CI policy

**Target Platform**: Static GitHub Pages project site for `KI9I9/oryxos`, served over HTTPS below `/oryxos/`;
Linux GitHub-hosted build runners; evergreen Chromium layouts from 320 through 1440 CSS pixels

**Project Type**: Independent bilingual static Website plus repository publication automation and public-content
governance

**Performance Goals**: Approved automatic publication reaches its first complete public smoke pass within 10
minutes from contractual `approvalReleasedAt`, the exact protected deployment's earliest `in_progress` status; the
most recent prior eligible distinct Website revision
is restorable within 15 effective minutes from authenticated syntactically-valid request acceptance to smoke pass
after subtracting one recorded approval-wait interval and GitHub outage intervals; every route remains pre-rendered
and requires no Runtime/network data fetch for core content

**Constraints**: Official site rather than public prototype; no custom domain; qualifying GitHub Release required;
prerelease status explicit in both locales; no unreleased availability claims; planned syntax non-executable; one
deploy-capable workflow; protected `github-pages` environment; one maintainer approval with self-approval allowed;
shared `cancel-in-progress: false` production serialization with restoration acceptance only after active-slot
acquisition; post-approval source/Release freshness; Chromium-only browser
approval; WCAG 2.2 AA text/key-control contrast; complete image alternative semantics; no
Runtime implementation changes merely to support copy; Runtime CI policy changes still require separate Wrapper
validation; no retired-site dependency; no analytics, tracking, login, CMS, database, private API, or long-lived
deploy credential

**Scale/Scope**: Existing 18 English and 18 Chinese required Page records plus fallback/404 behavior; nine Feature
002 public-deployment discrepancies; high-risk claim inventory across positioning, maturity, version, build, CLI,
REST, Provider, ReAct Loop, Tool, Memory, Skill/Profile, security properties, governance, affiliation, adoption, and
assets; one automatic/manual Pages workflow with conditional restore preflight, build, protected deploy, and
read-only terminal-finalization/post-verification jobs plus one separate read-only Website validation path

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

### Pre-research gate

| Constitution requirement | Plan response | Status |
|---|---|---|
| Website remains an independent Node.js 24/npm/VitePress static project | All build, content, metadata, test, and deployment changes stay in `website/`, Website workflows, Feature artifacts, and synchronized authoritative prose | PASS |
| Use committed wrappers/lockfile, `npm ci`, and static build | T004 will correct Runtime CI to the committed Wrapper; local, CI, publication, and restoration Website paths use `website/.nvmrc`, `package-lock.json`, `npm ci`, and the production build; final evidence must include a separate successful `./mvnw verify` run | PENDING IMPLEMENTATION |
| Website is not a Maven module or Runtime JAR asset | No Maven module or packaging integration is introduced; Runtime need not start to build or publish | PASS |
| Public product claims must be evidence-backed and use truthful states | A qualifying target GitHub Release plus claim-evidence inventory gates every high-risk public claim; unreleased behavior cannot be `available` | PASS |
| README, Website, roadmap, and authoritative documents must be consistent | Feature 003 owns an explicit authoritative-document inventory and discrepancy closure before publication | PASS |
| English/Chinese parity, accessibility, responsive behavior, and metadata are mandatory | Page manifest, all-pair action/destination parity, public metadata validators, Chromium/axe, explicit WCAG 2.2 AA contrast, complete image semantics, viewport, keyboard, and manual review remain blocking | PASS BY DESIGN; PENDING IMPLEMENTATION |
| No secrets, private data, internal addresses, trackers, or privileged Runtime calls | A dedicated publishable-source/generated-output scanner is blocking; Pages uses ephemeral job-level OIDC and Pages permissions only, with no Website secret or Runtime API | PASS |
| Public deployment requires a new Feature and compliance review | Feature 003 is the dedicated publication Feature, with protected approval, least privilege, release evidence, and restoration contracts | PASS |
| Cross-project scope and validation must be explicit | Runtime implementation remains out of scope, but `.github/workflows/ci.yml` is an explicit Runtime-policy deliverable; the final gate records both `./mvnw verify` and Website publication results without substituting one for the other | PASS BY DESIGN; PENDING IMPLEMENTATION |
| One active Spec-Driven Feature | `.specify/feature.json` points to `specs/003-oryxos-pages-publication`; implementation waits for tasks | PASS |

**Pre-research result**: CONDITIONAL PASS FOR DESIGN. The live target Release and repository Pages/environment
settings are external publication prerequisites, not Constitution exceptions. Runtime Wrapper validation,
contrast, and complete image semantics remain explicit implementation gates and MUST pass before merge/publication.

### Post-design gate

The Phase 1 design keeps deterministic static generation separate from live GitHub verification, grants deployment
permissions only to one protected deploy job, requires release evidence and all-pair bilingual claim/action/link
parity, preserves Chromium checks, adds explicit contrast and image-semantics gates, scans publishable source and
generated output, verifies the live deployment in a read-only follow-up job, and defines an approved
most-recent-prior restoration path. It requires Runtime CI to use the Constitution-mandated Maven Wrapper and
requires a separate successful Wrapper validation result. It introduces no Website server runtime, database,
private credential, Runtime build dependency, or unreviewed public deployment route.

**Post-design result**: PASS BY DESIGN, PENDING IMPLEMENTATION EVIDENCE. No Constitution violation or complexity
exception is required. First publication remains blocked until Runtime and Website gates pass, the target
repository has a qualifying Release, accessibility evidence is complete, and the protected environment is verified.

## Project Structure

### Documentation (this feature)

```text
specs/003-oryxos-pages-publication/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── publication-discrepancies.yaml    # implementation output; maps Feature 002 blockers
├── checklists/
│   └── requirements.md
├── contracts/
│   ├── release-and-claims.md
│   ├── public-site.md
│   ├── pages-publication.md
│   └── restoration.md
└── tasks.md                           # created later by /speckit-tasks
```

### Source Code (repository root)

```text
.github/workflows/
├── ci.yml                             # Runtime validation remains separate
├── website-ci.yml                     # read-only Website/publication validation
├── website-review-artifact.yml        # optional ordinary review artifact; never deploys
└── website-pages.yml                  # sole protected Pages publication/restoration workflow

website/
├── package.json
├── package-lock.json
├── .nvmrc
├── index.md
├── architecture.md
├── roadmap.md
├── community.md
├── 404.md
├── docs/
│   ├── concepts/
│   ├── project/
│   ├── getting-started/
│   ├── runtime/
│   ├── interfaces/
│   └── contributing.md
├── zh/                                # exact public counterpart tree
├── data/
│   ├── pages.json                     # public route/indexability/claim relationships
│   ├── public-content.json            # final localized status, labels, and planned examples
│   ├── release-baseline.json          # tracked qualifying GitHub Release snapshot
│   ├── claim-evidence.json            # bilingual high-risk public claim inventory
│   ├── requirement-coverage.json       # explicit FR/SC-to-task/test mapping
│   ├── external-links.json
│   ├── publication-review.json        # tracked review intent plus reconciled audit evidence
│   ├── deployment-history/            # append-only terminal Pages Deployment Records
│   └── publication-history/           # append-only passed Public Releases
├── public/
│   ├── robots.txt
│   ├── brand/
│   ├── icons/
│   ├── diagrams/
│   └── social/
├── scripts/
│   ├── check-content.mjs              # final public content and parity validation
│   ├── check-release-baseline.mjs      # offline release snapshot validation
│   ├── check-release-live.mjs          # live target GitHub Release/tag validation
│   ├── check-claims.mjs                # claims, examples, discrepancies, docs consistency
│   ├── check-publication-discrepancies.mjs # Feature 002 blocker closure gate
│   ├── check-requirement-coverage.mjs  # explicit FR/SC IDs including suffixes
│   ├── check-public-safety.mjs         # publishable-source/generated-output security scan
│   ├── check-workflows.mjs             # single-workflow Pages permission allowlist
│   ├── prepare-publication-candidate.mjs # revision metadata and deterministic tree digest
│   ├── record-publication-history.mjs  # terminal bundle validation and append-only records
│   ├── check-publication-freshness.mjs # automatic current-main guard
│   ├── check-restoration-target.mjs    # most-recent-prior eligible deployment selection
│   ├── prepare-restoration-candidate.mjs # restoration evidence and timing record
│   ├── export-assets.mjs
│   ├── verify-assets.mjs
│   ├── verify-build.mjs                # canonical/sitemap/robots/public-origin validation
│   └── verify-public-site.mjs          # post-deployment public smoke checks
├── tests/
│   ├── scripts/
│   │   ├── check-content.test.mjs
│   │   ├── check-release-baseline.test.mjs
│   │   ├── check-release-live.test.mjs
│   │   ├── check-claims.test.mjs
│   │   ├── check-requirement-coverage.test.mjs
│   │   ├── check-public-safety.test.mjs
│   │   ├── workflow-policy.test.mjs
│   │   ├── workflow-repository.test.mjs
│   │   ├── publication-candidate.test.mjs
│   │   ├── check-restoration-target.test.mjs
│   │   ├── restoration-record.test.mjs
│   │   ├── verify-build.test.mjs
│   │   ├── verify-public-site.test.mjs
│   │   └── export-assets.test.mjs
│   └── e2e/
│       ├── accessibility.spec.ts
│       ├── responsive.spec.ts
│       ├── site-integrity.spec.ts
│       ├── locale-switching.spec.ts
│       ├── release-content.spec.ts
│       ├── metadata-discovery.spec.ts
│       └── public-smoke.spec.ts
└── .vitepress/
    ├── config/
    │   ├── index.ts
    │   ├── shared.ts                   # base plus approved absolute public origin
    │   ├── metadata.ts                 # canonical/hreflang/og:url/absolute social URLs
    │   ├── navigation.ts
    │   └── locales.ts
    └── theme/
        ├── Layout.vue                  # release status replaces draft notice
        ├── components/
        │   ├── ReleaseStatusNotice.vue
        │   ├── PlannedSyntaxExample.vue
        │   ├── PublicDocShell.vue
        │   └── NotFoundExperience.vue
        └── styles/

README.md                               # synchronized public positioning and links
CLAUDE.md                               # synchronized only where designated authoritative claims conflict
LICENSE                                 # evidence input; content changes not expected
pom.xml                                 # current/release evidence input; Runtime version not changed by Website
```

The exact authoritative documents beyond `README.md` are finalized by the claim inventory. Class/tutorial material
is not rewritten unless explicitly designated authoritative for a public claim. Runtime Java source is evidence
input only and is not an implementation target for this Feature.

The fixed current-branch authoritative trigger set is `README.md`, `CLAUDE.md`, and `LICENSE`. `pom.xml` may be
inspected at the qualifying historical Release tag as evidence, but an unrelated current Runtime-only `pom.xml`
change does not force developers to run the Website toolchain.

**Structure Decision**: Extend the independent Feature 002 VitePress project and existing validators rather than
introducing another site or deployment branch. Keep deterministic release/claim snapshots in repository data,
perform live GitHub verification only in the publication gate, and whitelist one official Pages workflow. Join
paginated GitHub deployment metadata with digest-verified terminal workflow artifacts or append-only tracked
deployment/publication history for restoration eligibility; Git history alone proves source availability, not a
passed public release. The publication review uses a reviewed-source-tree digest before candidate creation; exact
candidate/deployment/artifact evidence and terminal history are reconciled later in audit-only commits excluded
from automatic publication triggers.

## Complexity Tracking

No Constitution violations require an exception. The new release/claim records and protected workflow are the
minimum structures needed to publish truthful official content with auditable approval and restoration.
