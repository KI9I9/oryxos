# Contract: Public GitHub Pages Site

**Feature**: `003-oryxos-pages-publication`

## Address and Base

- Public project URL: `https://ki9i9.github.io/oryxos/`
- Host origin: `https://ki9i9.github.io`
- VitePress project base: `/oryxos/`
- Custom domain: not used in this Feature

The existing `SITE_BASE` value in `website/.vitepress/config/shared.ts` remains `/oryxos/`.

## Required Public Checks

After deployment, the following routes MUST resolve successfully after following redirects:

```text
https://ki9i9.github.io/oryxos/
https://ki9i9.github.io/oryxos/zh/
```

The existing production build verifier remains responsible for the complete route, fragment, and required-resource
graph. The workflow smoke check is intentionally smaller and confirms only that the deployed English and Chinese
entry points are publicly reachable.

## Static Resource Rules

- Internal Website links and required static resources MUST resolve below `/oryxos/`.
- Generated output MUST come from `website/.vitepress/dist`.
- Generated output MUST NOT be committed to Git.
- Publication MUST NOT require the OryxOS Runtime to run.
- The Website MUST NOT contain deployment credentials or require a long-lived Pages token.

## Content Boundary

This Feature publishes the existing Website content and design. Content redesign, release-evidence modeling, and a
full product-claim audit are not part of this publication change. Existing Website quality tests continue to guard
the current route, content, accessibility, asset, and responsive requirements.

## Failure Semantics

- Install, test, build, or artifact-upload failure occurs before deployment and leaves the current public site
  unchanged.
- Deploy failure is reported by the Pages action and does not trigger a third-party fallback.
- Smoke failure after deployment marks the workflow failed for maintainer investigation; it does not initiate an
  automatic rollback.
