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

function createSafeWebsiteWorkflow() {
  return `
name: Website validation
on:
  pull_request:
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

function validateYaml(source, filePath) {
  const parsed = parseWorkflowYaml(source, filePath);
  assert.deepEqual(parsed.errors, []);
  return validateWorkflowDefinition(parsed.workflow, { filePath });
}

function includesError(errors, expectedText) {
  return errors.some((error) => error.includes(expectedText));
}

test("accepts non-deploying website workflows using the repository Node file", () => {
  const errors = validateYaml(createSafeWebsiteWorkflow(), "website-ci.yml");
  assert.deepEqual(errors, []);
});

test("rejects pages: write at workflow and job scope", () => {
  const workflowLevel = createSafeWebsiteWorkflow().replace(
    "contents: read",
    "contents: read\n  pages: write",
  );
  const jobLevel = createSafeWebsiteWorkflow().replace(
    "runs-on: ubuntu-latest",
    "runs-on: ubuntu-latest\n    permissions:\n      pages: write",
  );

  assert.equal(includesError(validateYaml(workflowLevel, "other.yml"), "pages: write"), true);
  assert.equal(includesError(validateYaml(jobLevel, "other.yml"), "pages: write"), true);
});

test("rejects write-all because it implicitly grants Pages permissions", () => {
  const unsafeWorkflow = createSafeWebsiteWorkflow().replace(
    "permissions:\n  contents: read",
    "permissions: write-all",
  );

  const errors = validateYaml(unsafeWorkflow, "other.yml");
  assert.equal(includesError(errors, "implicitly includes prohibited Pages"), true);
});

test("rejects id-token: write in both website workflows", () => {
  for (const fileName of ["website-ci.yml", "website-prototype-artifact.yml"]) {
    const unsafeWorkflow = createSafeWebsiteWorkflow().replace(
      "contents: read",
      "contents: read\n  id-token: write",
    );
    const errors = validateYaml(unsafeWorkflow, fileName);
    assert.equal(includesError(errors, "id-token: write"), true, fileName);
  }
});

test("rejects every GitHub Pages action", () => {
  for (const action of [
    "actions/configure-pages@v5",
    "actions/upload-pages-artifact@v3",
    "actions/deploy-pages@v4",
  ]) {
    const unsafeWorkflow = createSafeWebsiteWorkflow().replace(
      "- run: npm ci",
      `- uses: ${action}`,
    );
    const errors = validateYaml(unsafeWorkflow, "other.yml");
    assert.equal(includesError(errors, "Pages-specific actions are prohibited"), true, action);
  }
});

test("rejects github-pages Environments and branch publication", () => {
  const environmentWorkflow = createSafeWebsiteWorkflow().replace(
    "runs-on: ubuntu-latest",
    "runs-on: ubuntu-latest\n    environment:\n      name: github-pages",
  );
  const branchWorkflow = createSafeWebsiteWorkflow().replace(
    "- run: npm ci",
    "- uses: example/deployer@v1\n        with:\n          publish_branch: gh-pages",
  );

  assert.equal(
    includesError(validateYaml(environmentWorkflow, "other.yml"), "github-pages deployment Environment"),
    true,
  );
  assert.equal(
    includesError(validateYaml(branchWorkflow, "other.yml"), "publishes to the gh-pages branch"),
    true,
  );
});

test("rejects public deployment actions and commands", () => {
  const actionWorkflow = createSafeWebsiteWorkflow().replace(
    "- run: npm ci",
    "- uses: peaceiris/actions-gh-pages@v4",
  );
  const commandWorkflow = createSafeWebsiteWorkflow().replace(
    "- run: npm ci",
    "- run: npm run deploy",
  );

  assert.equal(
    includesError(validateYaml(actionWorkflow, "other.yml"), "public-site deployment action"),
    true,
  );
  assert.equal(
    includesError(validateYaml(commandWorkflow, "other.yml"), "public deployment command"),
    true,
  );
});

test("rejects jobs explicitly named as public website deployment", () => {
  const unsafeWorkflow = createSafeWebsiteWorkflow().replace(
    "validate:\n    runs-on",
    "publish-website:\n    name: Publish public site\n    runs-on",
  );

  const errors = validateYaml(unsafeWorkflow, "other.yml");
  assert.equal(includesError(errors, "public website deployment job"), true);
});

test("requires node-version-file in both website workflows", () => {
  const unsafeWorkflow = createSafeWebsiteWorkflow().replace(
    "node-version-file: website/.nvmrc",
    "node-version: 24",
  );
  const errors = validateYaml(unsafeWorkflow, "website-ci.yml");

  assert.equal(includesError(errors, "node-version-file: website/.nvmrc"), true);
});

test("scans every YAML extension in the workflow directory", async () => {
  const workflowsDirectory = await mkdtemp(path.join(os.tmpdir(), "oryxos-workflows-"));
  try {
    await Promise.all([
      writeFile(
        path.join(workflowsDirectory, "website-ci.yml"),
        createSafeWebsiteWorkflow(),
      ),
      writeFile(
        path.join(workflowsDirectory, "website-prototype-artifact.yml"),
        createSafeWebsiteWorkflow(),
      ),
      writeFile(
        path.join(workflowsDirectory, "unsafe.yaml"),
        createSafeWebsiteWorkflow().replace(
          "contents: read",
          "contents: read\n  pages: write",
        ),
      ),
    ]);

    const errors = await checkWorkflowDirectory(workflowsDirectory);
    assert.equal(includesError(errors, "unsafe.yaml"), true);
    assert.equal(includesError(errors, "pages: write"), true);
  } finally {
    await rm(workflowsDirectory, { recursive: true, force: true });
  }
});
