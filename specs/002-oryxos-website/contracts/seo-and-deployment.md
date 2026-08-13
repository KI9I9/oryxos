# SEO and Validation Deployment Contract

## Deployment target

- Origin: `https://oryx-labs.github.io`
- Project base: `/oryxos/`
- Deployment output: `website/.vitepress/dist`
- Deployment mode for Feature 002: manually approved validation deployment only
- Indexing mode for Feature 002: `noindex`

## Workflow separation

### Website CI

Runs automatically for relevant pull requests and may run on relevant pushes, but never receives Pages write
permissions and never deploys.

Required sequence:

1. Set up the exact Node.js 24 version from `website/.nvmrc`.
2. `npm ci`
3. Install Chromium for Playwright in CI.
4. Run script unit tests and content validation.
5. Run TypeScript/Vue type checking.
6. `npm run docs:build`
7. Run build-output and Chromium/axe checks against `vitepress preview`.

### Pages deployment

The Pages workflow must use only:

```yaml
on:
  workflow_dispatch:
```

It must not deploy on a main-branch push. The deploy job uses the protected `github-pages` Environment and runs
only after validation for the exact source ref succeeds.

## Manual workflow inputs

| Input | Rule |
|---|---|
| `source_ref` | Full commit SHA; the workflow checks out this immutable ref |
| `review_record_id` | Required release-review identifier |
| `deployment_purpose` | Fixed to `validation` for this Feature |
| `discrepancy_snapshot` | Required reference to the reviewed register state |
| `acknowledge_public_access` | Must equal an explicit confirmation value |
| `indexing_mode` | Fixed to `noindex` |

The workflow fails before upload when acknowledgement or review input is missing.

## Release review gate

An authorized maintainer verifies and records:

- exact commit SHA and successful quality commands;
- `/oryxos/` base and direct English/Chinese deep links;
- claim/evidence and discrepancy review;
- locale semantic parity;
- keyboard, visible focus, 320–1440 layouts, and real 200% browser zoom;
- WCAG 2.2 AA contrast and image accessibility;
- external repository/license/community links;
- absence of secrets, internal addresses, tracking, CMS, and Runtime API calls;
- acceptance that the validation URL may be publicly accessible.

## Validation indexing controls

Every page emits:

```html
<meta name="robots" content="noindex,nofollow,noarchive">
```

`robots.txt` contains:

```text
User-agent: *
Disallow: /
```

These controls reduce discovery but are not access control. No sensitive or private content may be deployed.

## Page metadata

Every public page has localized:

- unique `<title>`;
- non-empty description;
- self-referencing canonical URL;
- `hreflang="en"`, `hreflang="zh-Hans"`, and `hreflang="x-default"`;
- Open Graph title, description, type, URL, image, image dimensions, image alt, and locale;
- Twitter summary-large-image metadata;
- correct `<html lang>`.

Chinese pages canonicalize to themselves, not to English. `x-default` points to the English counterpart.

## Structured data

- Home may use `SoftwareSourceCode` only with verified fields.
- Documentation may use `BreadcrumbList`.
- Do not publish ratings, customers, enterprise adoption, security certification, or unverified software versions.
- Do not publish a `SearchAction` because the first release has no site search.

## Project-path validation

Automated checks fail when built HTML or assets:

- bypass `/oryxos/` with an invalid root-absolute site URL;
- contain missing favicon, social, diagram, script, or stylesheet resources;
- fail direct deep-link access in preview;
- omit `404.html` or required metadata;
- send a locale switch to a non-equivalent destination.

## Promotion to formal publication

Re-enabling automatic publication, changing robots to index/follow, or treating the Pages site as a formal release
requires a separate reviewed Feature after all formal-publication discrepancy blockers are resolved. Feature 002
does not perform that promotion.
