import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import YAML from "yaml";

const WEBSITE_WORKFLOW_NAMES = new Set([
  "website-ci.yml",
  "website-ci.yaml",
  "website-prototype-artifact.yml",
  "website-prototype-artifact.yaml",
]);

const FORBIDDEN_PAGES_ACTIONS = [
  "actions/configure-pages",
  "actions/upload-pages-artifact",
  "actions/deploy-pages",
];

const PUBLIC_DEPLOYMENT_ACTION_PATTERNS = [
  /peaceiris\/actions-gh-pages/i,
  /jamesives\/github-pages-deploy-action/i,
  /crazy-max\/ghaction-github-pages/i,
  /github-pages-deploy-action/i,
];

const PUBLIC_DEPLOYMENT_COMMAND_PATTERNS = [
  /\bgh-pages\b/i,
  /\bnpm\s+run\s+deploy(?=\s|$)/i,
  /\byarn\s+deploy(?=\s|$)/i,
  /\bpnpm\s+(?:run\s+)?deploy(?=\s|$)/i,
  /\bgit\s+push\b[^\n]*\bgh-pages\b/i,
];

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function formatLocation(filePath, location) {
  return location ? `${filePath}:${location}` : filePath;
}

function normalizePermissionValue(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : value;
}

function inspectPermissions(permissions, filePath, location, errors, isWebsiteWorkflow) {
  if (normalizePermissionValue(permissions) === "write-all") {
    errors.push(
      `${formatLocation(filePath, location)} grants write-all, which implicitly includes prohibited Pages deployment permissions.`,
    );
    return;
  }

  if (!isPlainObject(permissions)) {
    return;
  }

  for (const [permissionName, permissionValue] of Object.entries(permissions)) {
    const normalizedName = permissionName.trim().toLowerCase();
    const normalizedValue = normalizePermissionValue(permissionValue);
    const permissionLocation = `${location}.${permissionName}`;

    if (normalizedName === "pages" && normalizedValue === "write") {
      errors.push(
        `${formatLocation(filePath, permissionLocation)} grants pages: write; website prototype workflows must remain non-deploying.`,
      );
    }

    if (
      isWebsiteWorkflow &&
      normalizedName === "id-token" &&
      normalizedValue === "write"
    ) {
      errors.push(
        `${formatLocation(filePath, permissionLocation)} grants id-token: write; both website workflows must omit this deployment credential.`,
      );
    }
  }
}

function inspectEnvironment(environment, filePath, location, errors) {
  const environmentName = isPlainObject(environment) ? environment.name : environment;
  const environmentUrl = isPlainObject(environment) ? environment.url : null;

  if (
    typeof environmentName === "string" &&
    environmentName.trim().toLowerCase() === "github-pages"
  ) {
    errors.push(
      `${formatLocation(filePath, location)} uses the github-pages deployment Environment, which is prohibited for the local prototype.`,
    );
  }

  if (
    typeof environmentUrl === "string" &&
    /(?:github\.io|\/pages(?:\/|$))/i.test(environmentUrl)
  ) {
    errors.push(
      `${formatLocation(filePath, `${location}.url`)} points to a public Pages address (${environmentUrl}).`,
    );
  }
}

function inspectStep(step, filePath, location, errors) {
  if (!isPlainObject(step)) {
    return;
  }

  if (typeof step.uses === "string") {
    const normalizedAction = step.uses.trim().toLowerCase();

    for (const forbiddenAction of FORBIDDEN_PAGES_ACTIONS) {
      if (normalizedAction.startsWith(forbiddenAction)) {
        errors.push(
          `${formatLocation(filePath, `${location}.uses`)} invokes ${step.uses}; Pages-specific actions are prohibited.`,
        );
      }
    }

    if (PUBLIC_DEPLOYMENT_ACTION_PATTERNS.some((pattern) => pattern.test(step.uses))) {
      errors.push(
        `${formatLocation(filePath, `${location}.uses`)} invokes a public-site deployment action (${step.uses}).`,
      );
    }
  }

  if (typeof step.run === "string") {
    for (const pattern of PUBLIC_DEPLOYMENT_COMMAND_PATTERNS) {
      if (pattern.test(step.run)) {
        errors.push(
          `${formatLocation(filePath, `${location}.run`)} contains a public deployment command matching ${pattern}.`,
        );
        break;
      }
    }
  }

  if (isPlainObject(step.with)) {
    for (const [inputName, inputValue] of Object.entries(step.with)) {
      const normalizedInputName = inputName.toLowerCase().replaceAll("_", "-");
      const normalizedInputValue = String(inputValue).trim().toLowerCase();

      if (
        ["publish-branch", "target-branch", "branch"].includes(normalizedInputName) &&
        normalizedInputValue === "gh-pages"
      ) {
        errors.push(
          `${formatLocation(filePath, `${location}.with.${inputName}`)} publishes to the gh-pages branch.`,
        );
      }
    }
  }
}

function workflowUsesNodeVersionFile(workflow) {
  if (!isPlainObject(workflow.jobs)) {
    return false;
  }

  return Object.values(workflow.jobs).some((job) => {
    if (!isPlainObject(job) || !Array.isArray(job.steps)) {
      return false;
    }

    return job.steps.some((step) => {
      if (!isPlainObject(step) || typeof step.uses !== "string") {
        return false;
      }

      const usesSetupNode = step.uses.toLowerCase().startsWith("actions/setup-node@");
      return (
        usesSetupNode &&
        isPlainObject(step.with) &&
        step.with["node-version-file"] === "website/.nvmrc"
      );
    });
  });
}

export function parseWorkflowYaml(source, filePath = "workflow.yml") {
  try {
    const workflow = YAML.parse(source);

    if (!isPlainObject(workflow)) {
      return {
        workflow: null,
        errors: [`${filePath} must contain one YAML mapping at its document root.`],
      };
    }

    return { workflow, errors: [] };
  } catch (error) {
    return {
      workflow: null,
      errors: [`${filePath} is not valid YAML: ${error.message}`],
    };
  }
}

export function validateWorkflowDefinition(workflow, options = {}) {
  const filePath = options.filePath ?? "workflow.yml";
  const fileName = path.basename(filePath).toLowerCase();
  const isWebsiteWorkflow = WEBSITE_WORKFLOW_NAMES.has(fileName);
  const errors = [];

  if (!isPlainObject(workflow)) {
    return [`${filePath} must contain one YAML mapping at its document root.`];
  }

  inspectPermissions(workflow.permissions, filePath, "permissions", errors, isWebsiteWorkflow);

  if (!isPlainObject(workflow.jobs)) {
    errors.push(`${filePath}:jobs must be a YAML mapping with at least one job.`);
    return errors;
  }

  for (const [jobId, job] of Object.entries(workflow.jobs)) {
    const jobLocation = `jobs.${jobId}`;

    if (!isPlainObject(job)) {
      errors.push(`${formatLocation(filePath, jobLocation)} must be a YAML mapping.`);
      continue;
    }

    const jobIdentity = `${jobId} ${typeof job.name === "string" ? job.name : ""}`;
    const explicitlyPublishesPublicSite =
      /(?:^|[\s_-])(?:deploy|publish)[\s_-]+(?:pages|site|website|public)(?:[\s_-]|$)/i.test(
        jobIdentity,
      ) ||
      /(?:^|[\s_-])(?:pages|site|website)[\s_-]+(?:deploy|publish)(?:[\s_-]|$)/i.test(
        jobIdentity,
      );
    if (explicitlyPublishesPublicSite) {
      errors.push(
        `${formatLocation(filePath, jobLocation)} is named as a public website deployment job (${jobIdentity.trim()}).`,
      );
    }

    inspectPermissions(
      job.permissions,
      filePath,
      `${jobLocation}.permissions`,
      errors,
      isWebsiteWorkflow,
    );
    inspectEnvironment(job.environment, filePath, `${jobLocation}.environment`, errors);

    if (Array.isArray(job.steps)) {
      job.steps.forEach((step, stepIndex) => {
        inspectStep(step, filePath, `${jobLocation}.steps[${stepIndex}]`, errors);
      });
    }
  }

  if (isWebsiteWorkflow && !workflowUsesNodeVersionFile(workflow)) {
    errors.push(
      `${filePath} must configure actions/setup-node with node-version-file: website/.nvmrc.`,
    );
  }

  return errors;
}

export async function checkWorkflowDirectory(workflowsDirectory) {
  let directoryEntries;

  try {
    directoryEntries = await readdir(workflowsDirectory, { withFileTypes: true });
  } catch (error) {
    return [
      `Cannot read workflow directory ${workflowsDirectory}: ${error.message}. Expected .github/workflows to exist.`,
    ];
  }

  const workflowFileNames = directoryEntries
    .filter(
      (entry) =>
        entry.isFile() && /\.(?:ya?ml)$/i.test(entry.name),
    )
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
  const errors = [];

  for (const workflowFileName of workflowFileNames) {
    const workflowPath = path.join(workflowsDirectory, workflowFileName);
    let source;

    try {
      source = await readFile(workflowPath, "utf8");
    } catch (error) {
      errors.push(`Cannot read workflow ${workflowPath}: ${error.message}`);
      continue;
    }

    const parsedWorkflow = parseWorkflowYaml(source, workflowPath);
    errors.push(...parsedWorkflow.errors);

    if (parsedWorkflow.workflow) {
      errors.push(
        ...validateWorkflowDefinition(parsedWorkflow.workflow, { filePath: workflowPath }),
      );
    }
  }

  for (const requiredWorkflowName of [
    "website-ci.yml",
    "website-prototype-artifact.yml",
  ]) {
    if (!workflowFileNames.includes(requiredWorkflowName)) {
      errors.push(
        `${path.join(workflowsDirectory, requiredWorkflowName)} is missing; both non-deploying website workflows are required.`,
      );
    }
  }

  return errors;
}

async function runCommandLine() {
  const websiteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const repositoryRoot = path.resolve(websiteRoot, "..");
  const workflowsDirectory = path.join(repositoryRoot, ".github", "workflows");
  const errors = await checkWorkflowDirectory(workflowsDirectory);

  if (errors.length > 0) {
    console.error("Workflow policy validation failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("Workflow policy validation passed.");
}

const invokedScriptPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (invokedScriptPath === fileURLToPath(import.meta.url)) {
  await runCommandLine();
}
