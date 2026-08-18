# Contract: GitHub Pages Publication Workflow

**Feature**: `003-oryxos-pages-publication`

## Workflow Boundary

Exactly one workflow may deploy the Website:

```text
.github/workflows/website-pages.yml
```

All other workflows, including Website pull-request validation and the existing ordinary prototype artifact
workflow, remain non-deploying.

## Triggers

The publication workflow MUST support:

- `push` to `main` for `website/**`, `.github/workflows/website-*.yml`,
  `specs/003-oryxos-pages-publication/**`, and `README.md`;
- `workflow_dispatch` for an authorized manual publication.

The publication workflow MUST NOT declare a `pull_request` trigger.

## Concurrency

Use one publication concurrency group with:

```yaml
cancel-in-progress: true
```

A newer publication may supersede an older in-progress publication. This Feature does not preserve or reconcile a
custom candidate history.

## Build Job

The build job MUST:

1. use only `contents: read`;
2. check out the repository;
3. use `actions/setup-node` with `website/.nvmrc` and npm lockfile caching;
4. run `npm ci` from `website/`;
5. install Playwright Chromium with required runner dependencies;
6. run `npm run test:quality`;
7. upload only `website/.vitepress/dist` through `actions/upload-pages-artifact`;
8. use the standard artifact name `github-pages`.

The build job MUST NOT receive `pages: write` or `id-token: write`.

## Deploy Job

The deploy job MUST:

1. depend on the successful build job;
2. use the `github-pages` environment;
3. receive only `contents: read`, `pages: write`, and `id-token: write`;
4. run `actions/configure-pages`;
5. run `actions/deploy-pages` against the uploaded `github-pages` artifact;
6. expose the returned Pages URL as a job output and environment URL.

No third-party deployment action, `gh-pages` branch, personal access token, or repository write permission is
allowed.

## Smoke Job

The smoke job MUST:

- depend on successful deployment;
- remain read-only and require no checkout;
- consume the page URL returned by the deploy job;
- check the root URL and `${page_url}zh/`;
- follow redirects and require a successful final response;
- retry for a bounded period to tolerate normal Pages propagation;
- fail clearly after the retry limit without triggering automatic rollback.

## Pull-Request Safety

Pull requests are handled only by `.github/workflows/website-ci.yml`, which retains `contents: read` and no Pages,
OIDC, deployment environment, or public deployment action. Workflow-policy tests enforce this boundary across all
checked-in workflow YAML files.
