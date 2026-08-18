import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  checkWorkflowDirectory,
  parseWorkflowYaml,
  validateWorkflowDefinition,
} from "../../scripts/check-workflows.mjs";

function createReadOnlyWebsiteWorkflow() {
  return `
name: Website validation
on:
  pull_request:
    paths:
      - .github/workflows/**
  push:
    paths:
      - .github/workflows/**
permissions:
  contents: read
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: website/.nvmrc
      - run: npm ci
      - uses: actions/upload-artifact@v4
        with:
          path: website/.vitepress/dist
`;
}

function createPagesWorkflow() {
  return `
name: Publish OryxOS website
on:
  push:
    branches: [learn-main]
    paths:
      - website/**
      - .github/workflows/website-*.yml
      - .github/workflows/website-*.yaml
      - specs/003-oryxos-pages-publication/**
      - README.md
  workflow_dispatch:
permissions: {}
concurrency:
  group: website-pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    defaults:
      run:
        working-directory: website
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: website/.nvmrc
          cache: npm
          cache-dependency-path: website/package-lock.json
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:quality
      - uses: actions/upload-pages-artifact@v3
        with:
          name: github-pages
          path: website/.vitepress/dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    outputs:
      page_url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/configure-pages@v5
      - id: deployment
        uses: actions/deploy-pages@v4
  smoke:
    needs: deploy
    runs-on: ubuntu-latest
    timeout-minutes: 5
    permissions:
      contents: read
    steps:
      - env:
          PAGE_URL: \${{ needs.deploy.outputs.page_url }}
        run: |
          set -euo pipefail
          page_base_url="\${PAGE_URL%/}/"
          for route in "" "zh/"; do
            url="\${page_base_url}\${route}"
            route_available=false
            for attempt in {1..6}; do
              if curl --fail --location --connect-timeout 3 --max-time 10 "\${url}"; then
                route_available=true
                break
              fi
              if [[ "\${attempt}" -lt 6 ]]; then
                sleep 5
              fi
            done
            if [[ "\${route_available}" != "true" ]]; then
              echo "Route unavailable: \${url}" >&2
              exit 1
            fi
          done
`;
}

function validateYaml(source, filePath) {
  const parsed = parseWorkflowYaml(source, filePath);
  assert.deepEqual(parsed.errors, []);
  return validateWorkflowDefinition(parsed.workflow, { filePath });
}

function includesError(errors, expectedText) {
  return errors.some((error) => error.includes(expectedText));
}

test("accepts read-only Website workflows and the sole official Pages workflow", () => {
  assert.deepEqual(validateYaml(createReadOnlyWebsiteWorkflow(), "website-ci.yml"), []);
  assert.deepEqual(validateYaml(createPagesWorkflow(), "website-pages.yml"), []);
});

test("rejects Pages permissions and actions outside website-pages.yml", () => {
  const unsafePermissions = createReadOnlyWebsiteWorkflow().replace(
    "contents: read",
    "contents: read\n  pages: write\n  id-token: write",
  );
  const unsafeAction = createReadOnlyWebsiteWorkflow().replace(
    "- run: npm ci",
    "- uses: actions/deploy-pages@v4",
  );
  const unsafeEnvironment = createReadOnlyWebsiteWorkflow().replace(
    "runs-on: ubuntu-latest",
    "runs-on: ubuntu-latest\n    environment: github-pages",
  );

  assert.equal(
    includesError(validateYaml(unsafePermissions, "website-ci.yml"), "reserved for website-pages.yml"),
    true,
  );
  assert.equal(
    includesError(validateYaml(unsafeAction, "website-ci.yml"), "reserved for website-pages.yml"),
    true,
  );
  assert.equal(
    includesError(validateYaml(unsafeEnvironment, "website-ci.yml"), "reserved for website-pages.yml"),
    true,
  );
});

test("rejects write-all because it implicitly grants deployment permissions", () => {
  const unsafeWorkflow = createReadOnlyWebsiteWorkflow().replace(
    "permissions:\n  contents: read",
    "permissions: write-all",
  );

  assert.equal(
    includesError(validateYaml(unsafeWorkflow, "website-ci.yml"), "implicitly includes prohibited"),
    true,
  );
});

test("requires website-pages.yml to exclude pull requests", () => {
  const unsafeWorkflow = createPagesWorkflow().replace(
    "  workflow_dispatch:",
    "  pull_request:\n  workflow_dispatch:",
  );

  assert.equal(
    includesError(validateYaml(unsafeWorkflow, "website-pages.yml"), "must not declare pull_request"),
    true,
  );
});

test("rejects every unapproved Pages workflow trigger", () => {
  for (const triggerName of ["pull_request_target", "schedule", "workflow_call"]) {
    const unsafeWorkflow = createPagesWorkflow().replace(
      "  workflow_dispatch:",
      `  ${triggerName}:\n  workflow_dispatch:`,
    );

    assert.equal(
      includesError(validateYaml(unsafeWorkflow, "website-pages.yml"), "must use only push and workflow_dispatch"),
      true,
      triggerName,
    );
  }
});

test("rejects alternate names for the privileged Pages workflow", () => {
  for (const fileName of ["website-pages.yaml", "Website-Pages.yml"]) {
    assert.equal(
      includesError(validateYaml(createPagesWorkflow(), fileName), "only permitted name is website-pages.yml"),
      true,
      fileName,
    );
  }
});

test("requires learn-main push and workflow_dispatch triggers", () => {
  const wrongBranch = createPagesWorkflow().replace("branches: [learn-main]", "branches: [develop]");
  const missingDispatch = createPagesWorkflow().replace("  workflow_dispatch:\n", "");

  assert.equal(
    includesError(validateYaml(wrongBranch, "website-pages.yml"), "push only from learn-main"),
    true,
  );
  assert.equal(
    includesError(validateYaml(missingDispatch, "website-pages.yml"), "workflow_dispatch"),
    true,
  );
});

test("rejects extra push filters that can publish tags", () => {
  for (const pushFilter of ["tags", "tags-ignore", "branches-ignore"]) {
    const unsafeWorkflow = createPagesWorkflow().replace(
      "    branches: [learn-main]",
      `    branches: [learn-main]\n    ${pushFilter}: [\"**\"]`,
    );

    assert.equal(
      includesError(validateYaml(unsafeWorkflow, "website-pages.yml"), "on.push must use only branches and paths"),
      true,
      pushFilter,
    );
  }
});

test("requires exact deploy permissions and keeps build read-only", () => {
  const missingOidc = createPagesWorkflow().replace("      id-token: write\n", "");
  const privilegedBuild = createPagesWorkflow().replace(
    "  build:\n    runs-on: ubuntu-latest\n    permissions:\n      contents: read",
    "  build:\n    runs-on: ubuntu-latest\n    permissions:\n      contents: read\n      pages: write",
  );
  const extraDeployPermission = createPagesWorkflow().replace(
    "      id-token: write",
    "      id-token: write\n      actions: write",
  );

  assert.equal(
    includesError(validateYaml(missingOidc, "website-pages.yml"), "exact permissions"),
    true,
  );
  assert.equal(
    includesError(validateYaml(privilegedBuild, "website-pages.yml"), "build job must use only contents: read"),
    true,
  );
  assert.equal(
    includesError(validateYaml(extraDeployPermission, "website-pages.yml"), "exact permissions"),
    true,
  );
});

test("requires official Pages actions in their intended jobs", () => {
  const configureInBuild = createPagesWorkflow().replace(
    "      - run: npm ci",
    "      - uses: actions/configure-pages@v5\n      - run: npm ci",
  );
  const missingUpload = createPagesWorkflow().replace(
    /      - uses: actions\/upload-pages-artifact@v3[\s\S]*?          path: website\/\.vitepress\/dist\n/,
    "",
  );
  const missingDeploy = createPagesWorkflow().replace(
    "      - id: deployment\n        uses: actions/deploy-pages@v4\n",
    "",
  );

  assert.equal(
    includesError(validateYaml(configureInBuild, "website-pages.yml"), "configure-pages must run only in jobs.deploy"),
    true,
  );
  assert.equal(
    includesError(validateYaml(missingUpload, "website-pages.yml"), "upload-pages-artifact"),
    true,
  );
  assert.equal(
    includesError(validateYaml(missingDeploy, "website-pages.yml"), "deploy-pages"),
    true,
  );
});

test("requires build, deploy, and smoke dependencies plus cancellation concurrency", () => {
  const missingDeployDependency = createPagesWorkflow().replace("    needs: build\n", "");
  const missingSmokeDependency = createPagesWorkflow().replace("    needs: deploy\n", "");
  const unsafeConcurrency = createPagesWorkflow().replace("cancel-in-progress: true", "cancel-in-progress: false");

  assert.equal(
    includesError(validateYaml(missingDeployDependency, "website-pages.yml"), "deploy job must depend on build"),
    true,
  );
  assert.equal(
    includesError(validateYaml(missingSmokeDependency, "website-pages.yml"), "smoke job must depend on deploy"),
    true,
  );
  assert.equal(
    includesError(validateYaml(unsafeConcurrency, "website-pages.yml"), "cancel-in-progress: true"),
    true,
  );
});

test("requires normalized URLs and bounded, timed smoke requests", () => {
  const missingNormalization = createPagesWorkflow().replace(
    '          page_base_url="\${PAGE_URL%/}/"\n',
    '          page_base_url="\${PAGE_URL}"\n',
  );
  const missingRequestTimeout = createPagesWorkflow().replace(" --max-time 10", "");
  const missingJobTimeout = createPagesWorkflow().replace("    timeout-minutes: 5\n", "");
  const unboundedRetryCount = createPagesWorkflow().replace("{1..6}", "{1..100}");
  const missingExhaustionFailure = createPagesWorkflow().replace(
    "            if [[ \"${route_available}\" != \"true\" ]]; then\n" +
      "              echo \"Route unavailable: ${url}\" >&2\n" +
      "              exit 1\n" +
      "            fi\n",
    "",
  );

  for (const unsafeWorkflow of [
    missingNormalization,
    missingRequestTimeout,
    missingJobTimeout,
    unboundedRetryCount,
    missingExhaustionFailure,
  ]) {
    assert.equal(
      includesError(validateYaml(unsafeWorkflow, "website-pages.yml"), "jobs.smoke"),
      true,
    );
  }
});

test("requires Website CI to scan every workflow change", () => {
  const missingPullRequestCoverage = createReadOnlyWebsiteWorkflow().replace(
    "  pull_request:\n    paths:\n      - .github/workflows/**\n",
    "  pull_request:\n",
  );
  const missingPushCoverage = createReadOnlyWebsiteWorkflow().replace(
    "  push:\n    paths:\n      - .github/workflows/**\n",
    "  push:\n",
  );

  assert.equal(
    includesError(validateYaml(missingPullRequestCoverage, "website-ci.yml"), "pull_request.paths"),
    true,
  );
  assert.equal(
    includesError(validateYaml(missingPushCoverage, "website-ci.yml"), "push.paths"),
    true,
  );
});

test("requires node-version-file in every Website workflow that sets up Node", () => {
  for (const fileName of [
    "website-ci.yml",
    "website-prototype-artifact.yml",
    "website-pages.yml",
  ]) {
    const source = fileName === "website-pages.yml"
      ? createPagesWorkflow()
      : createReadOnlyWebsiteWorkflow();
    const unsafeWorkflow = source.replace(
      "node-version-file: website/.nvmrc",
      "node-version: 24",
    );

    assert.equal(
      includesError(validateYaml(unsafeWorkflow, fileName), "node-version-file: website/.nvmrc"),
      true,
      fileName,
    );
  }
});

test("continues rejecting third-party deployment and gh-pages branch publication", () => {
  const thirdPartyAction = createPagesWorkflow().replace(
    "- uses: actions/configure-pages@v5",
    "- uses: peaceiris/actions-gh-pages@v4",
  );
  const branchPublication = createPagesWorkflow().replace(
    "- uses: actions/configure-pages@v5",
    "- uses: example/deployer@v1\n        with:\n          publish_branch: gh-pages",
  );

  assert.equal(
    includesError(validateYaml(thirdPartyAction, "website-pages.yml"), "public-site deployment action"),
    true,
  );
  assert.equal(
    includesError(validateYaml(branchPublication, "website-pages.yml"), "gh-pages branch"),
    true,
  );
});

test("scans all workflow YAML and requires the three Website workflows", async () => {
  const workflowsDirectory = await mkdtemp(path.join(os.tmpdir(), "oryxos-workflows-"));
  try {
    await Promise.all([
      writeFile(path.join(workflowsDirectory, "website-ci.yml"), createReadOnlyWebsiteWorkflow()),
      writeFile(
        path.join(workflowsDirectory, "website-prototype-artifact.yml"),
        createReadOnlyWebsiteWorkflow(),
      ),
      writeFile(path.join(workflowsDirectory, "website-pages.yml"), createPagesWorkflow()),
      writeFile(
        path.join(workflowsDirectory, "unsafe.yaml"),
        createReadOnlyWebsiteWorkflow().replace(
          "contents: read",
          "contents: read\n  pages: write",
        ),
      ),
    ]);

    const errors = await checkWorkflowDirectory(workflowsDirectory);
    assert.equal(includesError(errors, "unsafe.yaml"), true);
    assert.equal(includesError(errors, "reserved for website-pages.yml"), true);
  } finally {
    await rm(workflowsDirectory, { recursive: true, force: true });
  }
});
