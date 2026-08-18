# Quickstart: Publish the OryxOS Website

This guide covers local validation, GitHub Pages configuration, automatic publication, manual publication, and
basic public verification for Feature 003.

## 1. Validate locally

From the repository Website directory:

```bash
cd website
npm ci
npx playwright install --with-deps chromium
npm run test:quality
```

The production output is generated at:

```text
website/.vitepress/dist
```

The output remains untracked.

## 2. Preview the production build

```bash
npm run docs:preview -- --host 127.0.0.1 --port 4173
```

Open:

```text
http://127.0.0.1:4173/oryxos/
http://127.0.0.1:4173/oryxos/zh/
```

Required project base:

```text
/oryxos/
```

## 3. Configure GitHub Pages

In repository settings for `KI9I9/oryxos`:

1. Open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Confirm the `github-pages` environment may be used by the publication workflow.
4. Do not configure a custom domain for this Feature.

Expected public URL:

```text
https://ki9i9.github.io/oryxos/
```

## 4. Automatic publication

Merge or push a relevant Website change to `main`. The `Publish OryxOS website` workflow should:

1. install dependencies with `npm ci`;
2. install Chromium;
3. run `npm run test:quality`;
4. upload `website/.vitepress/dist` through the official Pages artifact action;
5. deploy through the `github-pages` environment;
6. smoke-check the English and Chinese home routes.

A failure before deployment leaves the previous public site unchanged.

## 5. Manual publication

Use the GitHub Actions interface and select **Run workflow**, or use GitHub CLI:

```bash
gh workflow run "Publish OryxOS website" --repo KI9I9/oryxos
```

Observe the run:

```bash
gh run list --repo KI9I9/oryxos --workflow "Publish OryxOS website"
gh run watch <run-id> --repo KI9I9/oryxos
```

Manual publication runs the same validation, build, deployment, and smoke path as automatic publication.

## 6. Verify the public site

```bash
curl -fsSL "https://ki9i9.github.io/oryxos/" > /dev/null
curl -fsSL "https://ki9i9.github.io/oryxos/zh/" > /dev/null
```

Also inspect representative internal links and assets to confirm they remain below `/oryxos/`.

## 7. Failure handling

- If `npm ci`, tests, or the VitePress build fails, fix the source and run the workflow again.
- If Pages is not configured for GitHub Actions, correct the repository Pages setting and rerun.
- If smoke checks fail immediately after deployment, inspect the deploy URL and Actions logs, then rerun after
  resolving the cause.
- If a published revision must be reversed, revert the source change through the normal repository process and
  publish the resulting `main` revision. This Feature does not implement automatic rollback.
