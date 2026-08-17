# Local Preview and Non-Deployment Contract

## Prototype boundary

- VitePress base: `/oryxos/`
- Build output: `website/.vitepress/dist`
- Allowed execution: local preview and non-deploying CI validation
- Public GitHub Pages deployment: prohibited in this Feature
- Final canonical origin, sitemap hostname, indexing policy, and public release review: deferred

## Website CI

The automatic website workflow is introduced as a safe skeleton during Setup and hardened during final quality
work. It may run for relevant pull requests and pushes, uses only `contents: read`, may
upload a regular Actions artifact, and never receives `pages: write` or `id-token: write`.

Required sequence:

1. Read the exact Node.js 24 version from `website/.nvmrc`.
2. Run `npm ci`.
3. Install Playwright Chromium and required Linux browser dependencies.
4. Run script unit tests, prototype-content checks, asset export/verification, and type checking.
5. Run `npm run docs:build` with dead-link checking enabled.
6. Start `vitepress preview` for the built output and run Chromium/axe tests.
7. Optionally upload `website/.vitepress/dist` with the ordinary Actions artifact action for authorized download.

## Existing Pages workflow

`.github/workflows/deploy-pages.yml` must be removed and replaced by
`.github/workflows/website-prototype-artifact.yml`, a non-deploying manually triggered artifact workflow. Across
all `.github/workflows/*`, automated policy tests reject:

- `pages: write`;
- `id-token: write` in either website workflow;
- `actions/configure-pages`;
- `actions/upload-pages-artifact`;
- `actions/deploy-pages`;
- branch-based Pages publication;
- a job using the `github-pages` deployment Environment.

The workflow may build and upload a regular CI artifact, but it must not create or update a public site.

## Local production preview

The supported prototype review command serves the completed production build below `/oryxos/`:

```bash
npm run docs:build
npm run docs:preview -- --host 127.0.0.1 --port 4173
```

Playwright uses the same sequence through its `webServer` command. Story-level checkpoints may filter test files,
but the build always includes route skeletons for all required pages so dead-link checking remains enabled.

## Prototype metadata

Every locale-owned route provides:

- a unique localized title;
- a concise localized description;
- the correct `<html lang>`;
- relative Open Graph and Twitter image metadata;
- favicon and Apple Touch links resolved through `/oryxos/`;
- language-counterpart metadata that does not require an approved public origin.

The site-level `404.html` instead uses `lang="en"`, a unique bilingual title and description, bilingual recovery
content, and no counterpart metadata. Both language recovery groups must be present in SSR output.

The prototype must not generate placeholder public canonical URLs, a production sitemap hostname, ratings,
customers, security certifications, or unverified software versions.

## Project-path validation

Automated checks fail when:

- any required source or built route is missing;
- built internal links or static assets bypass `/oryxos/` incorrectly;
- any generated page, stylesheet, script, image, favicon, or social image fails to load;
- `404.html` is missing or lacks locale-aware recovery links;
- a locale switch reaches a non-equivalent route;
- body-level horizontal overflow occurs at the required viewport matrix;
- an internal link crawl reports a missing route or fragment.

## Local prototype review

Completion requires a repository record containing:

- exact source ref or working-tree state;
- build and test results;
- bilingual route review;
- keyboard and focus review;
- responsive and real 200% zoom review;
- draft-notice and conservative-copy review;
- brand originality and asset consistency review;
- brand creator or generation process;
- third-party font/tool license statement;
- asset legibility results at navigation, favicon, and social-card sizes;
- unresolved discrepancy snapshot;
- decision: `approved-for-prototype`, `changes-requested`, or `rejected`.

No review decision in this Feature authorizes public deployment.
