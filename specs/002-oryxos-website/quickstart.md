# Quickstart: Validate the New OryxOS Website

This guide describes the runnable validation flow expected after Feature 002 implementation. It validates only
the independent static website; it does not start or package the OryxOS Runtime.

## 1. Prerequisites

- Linux, macOS, or WSL shell
- Git
- Node.js 24 LTS matching `website/.nvmrc`
- npm supplied with that Node.js installation

From the repository root:

```bash
node --version
npm --version
```

Expected: the Node.js version starts with `v24.` and exactly matches `website/.nvmrc`.

If Node.js 24 is unavailable or cannot be installed because of permissions, stop and ask the repository owner how
to proceed. Do not replace the version, install into an unapproved location, or bypass `engine-strict`.

## 2. Reproducible installation

```bash
cd website
npm ci
```

Expected:

- installation succeeds from committed `package-lock.json`;
- no global package is required;
- no Runtime service, API key, CMS credential, or database is requested.

## 3. Static validation and production build

Run the complete deterministic checks:

```bash
npm run test:scripts
npm run check:content
npm run docs:typecheck
npm run docs:build
npm run verify:build
```

Expected:

- all 18 required English Page IDs and all 18 Chinese counterparts are present;
- capability states and shared Claim IDs are consistent;
- VitePress reports no dead internal links;
- output exists at `website/.vitepress/dist`;
- `404.html`, brand assets, localized social images, and required diagrams exist;
- generated internal links and assets work below `/oryxos/`;
- every public page has localized metadata and image alternative-text handling.

## 4. Browser and accessibility checks

Install the Chromium browser managed by Playwright when it is not already present:

```bash
npx playwright install --with-deps chromium
```

Run the pull-request browser suite:

```bash
npm run test:e2e:ci
```

Expected:

- tests launch `vitepress preview`, not the development server;
- English and Chinese deep links load below `/oryxos/`;
- primary navigation and language switching work with the keyboard;
- desktop and mobile navigation expose correct focus and expanded state;
- axe reports no configured WCAG A/AA violations;
- representative widths from 320 through 1440 CSS pixels have no body-level horizontal overflow;
- no page error, unexpected console error, or failed required site resource is observed.

Before a manual validation deployment, run the full supported browser matrix:

```bash
npx playwright install --with-deps chromium firefox webkit
npm run test:e2e:release
```

## 5. Inspect the production preview

```bash
npm run docs:preview -- --host 127.0.0.1 --port 4173
```

Open:

```text
http://127.0.0.1:4173/oryxos/
http://127.0.0.1:4173/oryxos/zh/
http://127.0.0.1:4173/oryxos/docs/runtime/provider
http://127.0.0.1:4173/oryxos/zh/docs/runtime/provider
http://127.0.0.1:4173/oryxos/not-a-page
```

Expected:

- core content is readable even when JavaScript is disabled;
- English is the root language;
- language switching keeps the equivalent Page ID;
- missing routes use the locale-aware recovery experience;
- Pre-alpha and single-node status are prominent;
- incomplete capability pages separate current behavior, target design, and limitations;
- no page calls an OryxOS Runtime API.

## 6. Required manual release review

Record pass/fail and evidence for:

1. English/Chinese semantic parity for all required pages.
2. Claim accuracy against the exact reviewed commit or release.
3. Open items in `specs/002-oryxos-website/discrepancy-register.yaml`.
4. Keyboard-only core journeys and visually clear focus.
5. Real browser zoom at 200% in Chrome and Firefox.
6. Layout quality at 320, 375/390, breakpoint edges, 1280, and 1440 CSS pixels.
7. WCAG 2.2 AA text, control, focus, diagram, and interactive-state contrast.
8. Meaningful localized alt text and nearby explanations for diagrams.
9. External repository, issue, license, governance, and organization links.
10. Originality and consistency of logo, wordmark, favicon, social cards, and diagrams.
11. Absence of secrets, private data, internal hosts, analytics, trackers, CMS calls, and Runtime API calls.
12. Explicit acknowledgement that the validation Pages URL may be public.

A validation deployment may proceed only after this review is approved. Formal publication remains blocked while
formal-publication discrepancies are open.

## 7. Manual GitHub Pages validation deployment

After committing the implementation and creating an approved review record, trigger the Pages workflow for an
immutable commit:

```bash
SOURCE_REF="$(git rev-parse HEAD)"

gh workflow run deploy-pages.yml \
  --ref main \
  -f source_ref="$SOURCE_REF" \
  -f review_record_id="<approved-review-id>" \
  -f deployment_purpose="validation" \
  -f discrepancy_snapshot="<reviewed-register-ref>" \
  -f acknowledge_public_access="I_ACCEPT_PUBLIC_VALIDATION" \
  -f indexing_mode="noindex"
```

Expected:

- no main-branch push deploys automatically;
- the protected `github-pages` Environment requests approval;
- the workflow validates and builds the exact `source_ref` before upload;
- the resulting site is served under `/oryxos/` and emits no-index controls.

## 8. Runtime independence check

Do not start Java or SQLite. Repeat the production build with no OryxOS process listening on port 8080:

```bash
npm run docs:build
```

Expected: the build succeeds and all core content remains present because the website has no Runtime dependency.
