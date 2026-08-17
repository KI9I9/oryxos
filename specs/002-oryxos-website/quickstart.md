# Quickstart: Validate the OryxOS Website Visual Prototype

This guide validates only the independent static website prototype. It does not package the OryxOS Runtime and
does not deploy the prototype to GitHub Pages or another public address.

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

The Node.js version must start with `v24.` and exactly match `website/.nvmrc`.

If Node.js 24 is unavailable or cannot be installed because of permissions, stop and ask the repository owner how
to proceed. Do not install into an unapproved location or bypass `engine-strict`.

## 2. Reproducible installation

```bash
cd website
npm ci
npx playwright install --with-deps chromium
```

Expected:

- installation succeeds from committed `package-lock.json`;
- the Playwright Chromium version is controlled by the lockfile;
- no global package, Runtime service, API key, CMS credential, or database is required.

## 3. Static validation and production build

```bash
npm run test:scripts
npm run check:content
npm run assets:build
npm run assets:verify
npm run docs:typecheck
npm run docs:build
npm run verify:build
```

Expected:

- all 18 English Page IDs and all 18 Chinese counterparts are present;
- the hidden English-only fallback fixture routes language switching to `/zh/translation-unavailable`;
- every locale-owned prototype page contains the localized draft notice, `404.html` contains a bilingual
  prototype notice, and every documentation page contains the required page form;
- no unverified command, endpoint, or real capability is presented as runnable or Available;
- VitePress reports no dead internal links;
- output exists at `website/.vitepress/dist`;
- `404.html`, brand assets, localized social images, touch icons, and required diagrams exist;
- generated internal links and assets work below `/oryxos/`;
- no workflow contains a Pages deployment action or Pages write permission.

## 4. Browser and accessibility checks

Run the Chromium suite against a production preview:

```bash
npm run test:e2e:ci
```

Before local prototype approval, also run the locked Chromium review suite:

```bash
npm run test:e2e:release
```

Expected:

- the command builds before it starts `vitepress preview`;
- English and Chinese deep links load below `/oryxos/`;
- primary navigation and language switching work with the keyboard;
- desktop and mobile navigation expose correct focus and expanded state;
- axe reports no configured WCAG A/AA violations;
- tested widths from 320 through 1440 CSS pixels have no body-level horizontal overflow;
- an internal route/fragment crawl succeeds;
- no page error, unexpected console error, or failed required site resource is observed.

## 5. Inspect the local production preview

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

- core content is readable with JavaScript disabled;
- English is the root locale;
- language switching keeps the equivalent Page ID;
- missing routes provide locale-aware recovery;
- the visual hierarchy, page forms, capability-state legend, diagrams, and CTAs are reviewable;
- every page visibly says it is a draft visual prototype;
- no page calls an OryxOS Runtime API.

## 6. Required local prototype review

Record pass/fail and concrete notes in `website/data/prototype-review.json` for:

1. Visual hierarchy and consistency across Home, Architecture, Roadmap, Documentation, and Community.
2. Equivalent English and Chinese route forms and navigation purpose.
3. Draft-notice prominence and conservative treatment of provisional copy.
4. Constitution-aligned Profile and Skill wording.
5. Keyboard-only core journeys and visibly clear focus.
6. Real browser zoom at 200% in the locked Playwright Chromium browser. With local preview running, open it using
   `npx playwright open --browser=chromium http://127.0.0.1:4173/oryxos/`.
7. Layout quality at 320, 375, 390, breakpoint edges, 1280, and 1440 CSS pixels.
8. WCAG 2.2 AA text, control, focus, diagram, and interactive-state contrast.
9. Meaningful localized alt text and nearby explanations for diagrams.
10. External repository, issue, license, governance, and organization links.
11. Originality and consistency of logo, wordmark, favicon, social cards, and diagrams.
12. Brand creator or generation process, third-party font/tool license statement, and legibility at navigation,
    favicon, and social-card sizes.
13. Absence of secrets, private data, internal hosts, analytics, trackers, CMS calls, and Runtime API calls.
14. Snapshot of every open item in `specs/002-oryxos-website/discrepancy-register.yaml`.

Set the review decision to `approved-for-prototype`, `changes-requested`, or `rejected`. None of these decisions
authorize public deployment.

## 7. Verify non-deployment policy

```bash
npm run test:workflow-policy
```

Expected:

- no push or manual workflow can deploy GitHub Pages;
- workflows have no `pages: write` permission;
- website workflows have no `id-token: write` permission and both read Node from `website/.nvmrc`;
- workflows do not use `actions/configure-pages`, `actions/upload-pages-artifact`, or `actions/deploy-pages`;
- a manual prototype workflow may upload only a regular Actions artifact.

## 8. Runtime independence check

Do not start Java or SQLite. Repeat the production build with no OryxOS process listening on port 8080:

```bash
npm run docs:build
```

Expected: the build succeeds and all prototype content remains present because the website has no Runtime
dependency. Do not run `./mvnw verify` for this website-only Feature.
