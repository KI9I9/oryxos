# Feature Specification: Publish the OryxOS Website with GitHub Pages

**Feature**: `003-oryxos-pages-publication`

**Date**: 2026-08-18

**Status**: Complete (2026-08-19)

**Input**: `之前开发的官网要使用GitHub的page进行发布`

## Scope

Publish the existing static VitePress Website from this repository to the default GitHub Pages project URL:

```text
https://ki9i9.github.io/oryxos/
```

This Feature is deployment-focused. It does not redesign the Website, introduce a release-evidence system, add a
custom publication database, or implement automatic rollback.

## User Scenarios

### User Story 1 - Visit the Published Website (Priority: P1)

As a visitor, I can open the OryxOS Website from its GitHub Pages URL and navigate the existing English and Chinese
content without broken project-base links or missing required assets.

**Independent Test**: Open `/oryxos/` and `/oryxos/zh/` from the public Pages host and confirm both return a
successful response and load their required styles, scripts, images, and internal links below `/oryxos/`.

### User Story 2 - Publish Changes from learn-main (Priority: P1)

As a maintainer, I can push a Website-related change to `learn-main` and have GitHub Actions validate, build, and publish
the static site without manually copying files to a branch.

**Independent Test**: Run the publication workflow from a qualifying `learn-main` revision and confirm it completes the
quality gate, uploads the generated VitePress output, and deploys that output through GitHub Pages.

### User Story 3 - Validate Safely and Republish Manually (Priority: P2)

As a maintainer, I can validate Website pull requests without granting them deployment capability, and I can
manually republish the current repository revision through `workflow_dispatch` when needed.

**Independent Test**: Confirm a pull request runs the read-only Website validation workflow but cannot invoke the
Pages deployment workflow; then confirm an authorized manual dispatch follows the same build and deployment path.

## Edge Cases

- A dependency installation, Website test, or production build fails before artifact upload.
- A pull request changes Website or workflow files but must not deploy.
- Generated links or assets accidentally omit the `/oryxos/` project base.
- GitHub Pages takes a short time to serve the new deployment after the deploy action completes.
- Two publication runs overlap after rapid updates to `learn-main`; only the newest active publication should continue.
- Repository Pages settings are missing or not configured for GitHub Actions.

## Functional Requirements

- **FR-001**: The Website MUST publish to `https://ki9i9.github.io/oryxos/` using the repository's default GitHub
  Pages project site, without a custom domain.
- **FR-002**: The VitePress production build MUST continue using the project base `/oryxos/`.
- **FR-003**: One dedicated workflow MUST publish Website-related changes pushed to `learn-main` and MUST also support
  authorized manual execution through `workflow_dispatch`.
- **FR-004**: Pull requests MUST NOT trigger a Pages deployment; they MUST use the existing read-only Website
  validation workflow, including its Chromium end-to-end checks.
- **FR-005**: The publication build MUST use `website/.nvmrc`, the committed npm lockfile, and `npm ci`.
- **FR-006**: The publication build MUST run `npm run test:publish` before uploading any Pages artifact. This static
  publication gate MUST cover script tests, workflow policy, content and asset checks, type checking, production
  build, and generated-output verification without installing a browser.
- **FR-007**: The workflow MUST deploy only the generated `website/.vitepress/dist` directory.
- **FR-008**: Publication MUST use the official `actions/configure-pages`, `actions/upload-pages-artifact`, and
  `actions/deploy-pages` actions rather than a `gh-pages` branch or third-party deployment action.
- **FR-009**: The build job MUST remain read-only with `contents: read`; only the deploy job MAY receive
  `pages: write` and `id-token: write`.
- **FR-010**: The deploy job MUST use the `github-pages` environment and expose the URL returned by the Pages deploy
  action.
- **FR-011**: A read-only smoke job MUST check the deployed root and Chinese home routes with bounded retries after
  deployment.
- **FR-012**: A failed install, quality check, or build MUST stop before deployment and leave the previously
  published site unchanged.
- **FR-013**: Publication automation MUST NOT require the OryxOS Runtime to start, must not add Website code to the
  Maven build, and must not introduce long-lived deployment credentials.
- **FR-014**: Repository documentation MUST explain the local validation command, Pages settings, automatic
  publication path, manual publication path, and public URL.

## Success Criteria

- **SC-001**: A successful qualifying `learn-main` run deploys the generated VitePress site through GitHub Pages without
  manual branch publication.
- **SC-002**: The final public responses for `/oryxos/` and `/oryxos/zh/` succeed after deployment.
- **SC-003**: Required internal links and static resources remain below `/oryxos/` and pass the existing production
  build verification.
- **SC-004**: Pull-request validation has no Pages or OIDC write permission and cannot deploy.
- **SC-005**: `npm ci` and `npm run test:quality` pass from `website/` before the first publication.
- **SC-006**: Repository workflow policy permits exactly one official Pages deployment workflow and rejects Pages
  permissions or deployment actions elsewhere.

## Assumptions

- The existing Website content, visual design, route inventory, and bilingual structure are the source to publish.
- The repository owner can enable GitHub Pages with **GitHub Actions** as its source.
- The default public address is `https://ki9i9.github.io/oryxos/`.
- GitHub's normal workflow, deployment, and run history provide sufficient operational history for this Feature.

## Out of Scope

- Rewriting or reclassifying all Website product claims.
- Requiring a GitHub Release before Website deployment.
- Custom candidate, deployment, release, or restoration data models.
- Multi-layer evidence artifacts or custom artifact digest protocols.
- Protected historical restoration or automatic rollback.
- Publication and restoration service-level timing metrics.
- Custom domains, analytics, a CMS, a database, login, or a server-side Website runtime.
