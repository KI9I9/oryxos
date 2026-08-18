# Research: Minimal GitHub Pages Publication

**Feature**: `003-oryxos-pages-publication`

**Date**: 2026-08-18

## Decision 1: Use the default GitHub Pages project site

**Decision**: Publish to `https://ki9i9.github.io/oryxos/` and preserve the existing VitePress base `/oryxos/`.

**Rationale**: The Website already generates links and assets for this project base. A custom domain would add DNS,
certificate, redirect, and ownership work unrelated to the request.

## Decision 2: Use official GitHub Pages Actions

**Decision**: Use `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages`.

**Rationale**: This is GitHub's supported Pages deployment path and avoids maintaining a `gh-pages` branch or
granting a third-party action repository write access.

## Decision 3: Keep validation and deployment permissions separate

**Decision**: Build with `contents: read`; grant `pages: write` and `id-token: write` only to the deploy job.

**Rationale**: Website tests and static generation do not need deployment permission. Job-scoped permissions keep
the privileged surface small without introducing a complex promotion system.

## Decision 4: Publish from learn-main and allow manual reruns

**Decision**: Trigger automatic publication for relevant changes pushed to `learn-main`, and support
`workflow_dispatch`. Do not add a pull-request trigger to the deployment workflow.

**Rationale**: Pull requests already have a read-only validation workflow. Manual dispatch is sufficient for an
authorized republish of the current revision without creating a separate recovery system.

## Decision 5: Separate browser validation from publication

**Decision**: Keep the locked Chromium browser and `npm run test:quality` in the read-only validation workflow. Run
`npm run test:publish` before Pages artifact upload, covering all static checks without installing Chromium again.

**Rationale**: Pull-request and push validation already covers the browser-dependent accessibility, interaction,
and responsive tests. Publication still blocks on script tests, workflow policy, content checks, deterministic
assets, TypeScript, production build, and output verification, while avoiding a second browser download and E2E
run for the same revision.

## Decision 6: Use bounded public smoke checks

**Decision**: After deployment, retry the public root and Chinese home routes for a short bounded period and fail
the workflow if they never return a successful final response.

**Rationale**: Pages may need a brief propagation period. A small retry loop verifies the user-visible deployment
without creating custom deployment records, timers, or rollback automation.

## Decision 7: Use GitHub-native history instead of custom publication models

**Decision**: Rely on GitHub Actions runs, Pages deployments, environments, and logs for operational history.

**Rationale**: The requested Website publication does not require custom Candidate, Public Release, restoration,
artifact-manifest, or outage-accounting entities. Those systems would add substantial implementation and
maintenance cost without improving the basic deployment outcome.

## Rejected Alternatives

- **Publish a `gh-pages` branch**: unnecessary branch and token management.
- **Third-party deployment action**: broader trust boundary than the official Pages actions.
- **Custom release baseline before publishing**: not required to deploy the existing Website.
- **Protected historical restoration workflow**: GitHub reruns and normal source reverts are sufficient for this
  Feature.
- **Custom deployment database or evidence bundle**: duplicates GitHub-native records.
- **Run Maven as part of Website publication**: violates the independent Website/Runtime build boundary.
