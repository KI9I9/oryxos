# Implementation Plan: Publish the OryxOS Website with GitHub Pages

**Branch**: `learn-main` | **Date**: 2026-08-18 | **Spec**: [spec.md](spec.md)

## Summary

Add one official GitHub Pages workflow for the existing VitePress Website. The workflow validates and builds the
site with the repository-pinned Node/npm setup, uploads `website/.vitepress/dist` as the Pages artifact, deploys it
to the `github-pages` environment, and performs bounded public smoke checks. Existing pull-request validation stays
read-only and cannot deploy.

The Feature deliberately relies on GitHub's native workflow and deployment history. It does not add custom
publication records, release baselines, evidence chains, restoration workflows, or rollback state machines.

## Technical Context

**Website stack**: Node.js 24.11.0, npm 11.6.1, VitePress 1.6.4, Vue 3, TypeScript

**Build inputs**: `website/.nvmrc`, `website/package-lock.json`, existing Website source and tests

**Build command**: `npm ci` followed by `npm run test:quality` from `website/`

**Build output**: `website/.vitepress/dist`

**Target**: GitHub Pages project site at `https://ki9i9.github.io/oryxos/`

**Workflow actions**: Official Pages configuration, artifact upload, and deployment actions

**Browser policy**: Existing Playwright Chromium quality gate

## Constitution Check

| Requirement | Plan response | Status |
|---|---|---|
| Website remains an independent static Node/VitePress project | Workflow runs only Website npm commands and uploads static output | PASS |
| Reproducible install and build | Uses `website/.nvmrc`, the committed lockfile, and `npm ci` | PASS |
| Website is not added to Maven | No Maven module or Runtime packaging change is introduced | PASS |
| Runtime is not required to serve Website content | GitHub Pages serves independent static files | PASS |
| Applicable Website quality gates remain blocking | Publication runs the existing `npm run test:quality` command | PASS |
| Minimal permissions and no long-lived credential | Build is read-only; deploy uses job-scoped Pages/OIDC permissions | PASS |
| No server runtime, CMS, database, login, or tracking | None are introduced | PASS |
| Spec-driven implementation | Specification, plan, contracts, tasks, and validation precede workflow changes | PASS |

No Constitution exception is required.

## Project Structure

### Feature documentation

```text
specs/003-oryxos-pages-publication/
├── spec.md
├── plan.md
├── research.md
├── quickstart.md
├── tasks.md
├── checklists/
│   └── requirements.md
└── contracts/
    ├── public-site.md
    └── pages-publication.md
```

### Implementation files

```text
.github/workflows/
├── website-ci.yml                     # read-only validation
├── website-prototype-artifact.yml     # existing non-deploying review artifact
└── website-pages.yml                  # new sole Pages deployment workflow

website/
├── .nvmrc
├── package.json
├── package-lock.json
├── .vitepress/config/shared.ts        # existing /oryxos/ base
├── .vitepress/dist/                   # generated, not committed
├── scripts/check-workflows.mjs
└── tests/scripts/workflow-policy.test.mjs

README.md                              # public URL and publication instructions
```

## Implementation Approach

### Phase 1 - Update workflow policy

Change the existing deployment prohibition into a narrow allowlist: exactly `website-pages.yml` may use official
Pages actions and Pages/OIDC write permissions. All other Website workflows remain read-only and non-deploying.

### Phase 2 - Add publication workflow

Create a workflow with three jobs:

1. **build**: check out, set up Node, run `npm ci`, install Chromium, run `npm run test:quality`, and upload the
   generated Pages artifact.
2. **deploy**: use the `github-pages` environment, configure Pages, and deploy the uploaded artifact with job-scoped
   `pages: write` and `id-token: write`.
3. **smoke**: use the returned page URL and bounded `curl` retries to verify the root and Chinese home routes.

Use one workflow-level concurrency group with `cancel-in-progress: true` so a newer publication supersedes an older
in-progress publication.

### Phase 3 - Verify and document

Run the existing local Website quality gate, validate workflow policy, enable Pages through repository settings,
execute the workflow, and verify the public site. Document the automatic and manual paths in `README.md` and the
Feature quickstart.

## Risk Controls

- A failed build cannot reach the deploy job.
- Pull requests cannot trigger the publication workflow.
- Only official GitHub Pages actions are allowed.
- The build output remains generated and untracked.
- Smoke checks retry briefly to tolerate normal Pages propagation delay.
- A post-deployment smoke failure reports a failed workflow but does not attempt an unreviewed automatic rollback.
