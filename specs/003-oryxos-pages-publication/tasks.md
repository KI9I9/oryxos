# Tasks: Publish the OryxOS Website with GitHub Pages

**Input**: `spec.md`, `plan.md`, `research.md`, `quickstart.md`, and `contracts/`

**Scope rule**: Implement only the minimal GitHub Pages publication path. Do not add release baselines, custom
publication records, evidence bundles, historical restoration, automatic rollback, or publication timing systems.

## Phase 1: Baseline and Workflow Policy

- [x] T001 Run `npm ci` and `npm run test:quality` from `website/` before workflow changes; record the commands and
  results in the implementation summary without weakening existing tests.
- [x] T002 Add failing allowlist and permission tests for the sole Pages workflow in
  `website/tests/scripts/workflow-policy.test.mjs`, covering official Pages actions, exact deploy-job permissions,
  no pull-request deployment trigger, and rejection of Pages capability in every other workflow.
- [x] T003 Update `website/scripts/check-workflows.mjs` so only `.github/workflows/website-pages.yml` may use the
  official Pages actions, the `github-pages` environment, `pages: write`, and `id-token: write`; retain the existing
  Node-version-file and non-deployment checks for all other Website workflows.
- [x] T004 Update `.github/workflows/website-ci.yml` to validate changes to `website/**`, Website workflows, and
  `specs/003-oryxos-pages-publication/**` while keeping workflow-level `contents: read` and no deployment capability.

## Phase 2: GitHub Pages Workflow

- [x] T005 Create the build job in `.github/workflows/website-pages.yml` for pushes to `main` affecting
  `website/**`, `.github/workflows/website-*.yml`, `.github/workflows/website-*.yaml`,
  `specs/003-oryxos-pages-publication/**`, or `README.md`, plus
  `workflow_dispatch`; use `website/.nvmrc`, npm cache, `npm ci`, Chromium installation, and
  `npm run test:quality`, then upload only `website/.vitepress/dist` with `actions/upload-pages-artifact` under the
  standard `github-pages` artifact name.
- [x] T006 Add the deploy job in `.github/workflows/website-pages.yml`; depend on the successful build, use the
  `github-pages` environment, run `actions/configure-pages` and `actions/deploy-pages`, expose the returned page URL,
  and grant only `contents: read`, `pages: write`, and `id-token: write` at job scope.
- [x] T007 Add a read-only smoke job and workflow concurrency to `.github/workflows/website-pages.yml`; cancel an
  older in-progress publication when a newer one starts, and retry the returned root and `/zh/` URLs for a bounded
  period before failing.
- [x] T008 Add the public URL, local Website validation command, automatic publication behavior, manual workflow
  dispatch, and Pages settings to `README.md` without changing Runtime build instructions.

## Phase 3: Verification and Publication

- [x] T009 Run the focused workflow-policy tests from `website/package.json` and fix only the allowlist or workflow
  implementation until they pass.
- [x] T010 Run fresh `npm ci` and `npm run test:quality` from `website/`; verify the generated output remains
  untracked and all required links and assets work below `/oryxos/`.
- [x] T011 Validate `.github/workflows/website-ci.yml`, `.github/workflows/website-prototype-artifact.yml`, and
  `.github/workflows/website-pages.yml` through the checked-in workflow parser and confirm exactly one workflow has
  Pages deployment capability.
- [ ] T012 Configure `KI9I9/oryxos` Pages source as **GitHub Actions** and verify the `github-pages` environment; if
  repository permissions are unavailable, report the required owner action rather than bypassing the setting.
- [ ] T013 Run `Publish OryxOS website` from an authorized `main` revision or manual dispatch and confirm build,
  deploy, and smoke jobs succeed.
- [ ] T014 Verify `https://ki9i9.github.io/oryxos/` and `https://ki9i9.github.io/oryxos/zh/` publicly, then record
  the successful workflow URL and public URL in the delivery summary.

## Completion Criteria

- All fourteen tasks are complete.
- Pull requests remain non-deploying.
- Exactly one workflow can deploy GitHub Pages.
- The existing Website quality gate passes before deployment.
- The English and Chinese public home routes respond successfully.
