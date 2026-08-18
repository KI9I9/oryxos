import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import YAML from "yaml";

const WEBSITE_WORKFLOW_NAMES = new Set([
  "website-ci.yml",
  "website-ci.yaml",
  "website-prototype-artifact.yml",
  "website-prototype-artifact.yaml",
  "website-pages.yml",
  "website-pages.yaml",
]);

const PAGES_WORKFLOW_NAME = "website-pages.yml";

const REQUIRED_WORKFLOW_NAMES = [
  "website-ci.yml",
  "website-prototype-artifact.yml",
  "website-pages.yml",
];

const OFFICIAL_PAGES_ACTIONS = {
  configure: "actions/configure-pages",
  upload: "actions/upload-pages-artifact",
  deploy: "actions/deploy-pages",
};

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

const REQUIRED_PUBLICATION_PATHS = [
  "website/**",
  ".github/workflows/website-*.yml",
  ".github/workflows/website-*.yaml",
  "specs/003-oryxos-pages-publication/**",
  "README.md",
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

function normalizeStringArray(value) {
  if (typeof value === "string") {
    return [value];
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry) => typeof entry === "string");
}

function permissionsMatch(permissions, expectedPermissions) {
  if (!isPlainObject(permissions)) {
    return false;
  }

  const actualEntries = Object.entries(permissions)
    .map(([permissionName, permissionValue]) => [
      permissionName.trim().toLowerCase(),
      normalizePermissionValue(permissionValue),
    ])
    .sort(([leftName], [rightName]) => leftName.localeCompare(rightName));
  const expectedEntries = Object.entries(expectedPermissions)
    .sort(([leftName], [rightName]) => leftName.localeCompare(rightName));

  return JSON.stringify(actualEntries) === JSON.stringify(expectedEntries);
}

function jobDependsOn(job, requiredJobId) {
  const dependencies = normalizeStringArray(job?.needs);
  return dependencies.includes(requiredJobId);
}

function actionNameForStep(step) {
  if (!isPlainObject(step) || typeof step.uses !== "string") {
    return null;
  }

  return step.uses.trim().toLowerCase().split("@", 1)[0];
}

function stepsUsingAction(job, actionName) {
  if (!isPlainObject(job) || !Array.isArray(job.steps)) {
    return [];
  }

  return job.steps.filter((step) => actionNameForStep(step) === actionName);
}

function inspectPermissions(
  permissions,
  filePath,
  location,
  errors,
  { isPagesWorkflow, isDeployJob },
) {
  if (normalizePermissionValue(permissions) === "write-all") {
    errors.push(
      `${formatLocation(filePath, location)} grants write-all, which implicitly includes prohibited deployment permissions.`,
    );
    return;
  }

  if (!isPlainObject(permissions)) {
    return;
  }

  for (const [permissionName, permissionValue] of Object.entries(permissions)) {
    const normalizedName = permissionName.trim().toLowerCase();
    const normalizedValue = normalizePermissionValue(permissionValue);
    const isPagesWrite = normalizedName === "pages" && normalizedValue === "write";
    const isOidcWrite = normalizedName === "id-token" && normalizedValue === "write";

    if ((isPagesWrite || isOidcWrite) && !(isPagesWorkflow && isDeployJob)) {
      errors.push(
        `${formatLocation(filePath, `${location}.${permissionName}`)} is reserved for website-pages.yml jobs.deploy.`,
      );
    }
  }
}

function inspectEnvironment(
  environment,
  filePath,
  location,
  errors,
  { isPagesWorkflow, isDeployJob },
) {
  const environmentName = isPlainObject(environment) ? environment.name : environment;
  const environmentUrl = isPlainObject(environment) ? environment.url : null;

  if (
    typeof environmentName === "string" &&
    environmentName.trim().toLowerCase() === "github-pages" &&
    !(isPagesWorkflow && isDeployJob)
  ) {
    errors.push(
      `${formatLocation(filePath, location)} uses github-pages, which is reserved for website-pages.yml jobs.deploy.`,
    );
  }

  if (
    typeof environmentUrl === "string" &&
    /(?:github\.io|\/pages(?:\/|$))/i.test(environmentUrl) &&
    !(isPagesWorkflow && isDeployJob)
  ) {
    errors.push(
      `${formatLocation(filePath, `${location}.url`)} points to a public Pages address (${environmentUrl}).`,
    );
  }
}

function inspectStep(
  step,
  filePath,
  location,
  errors,
  { isPagesWorkflow, jobId },
) {
  if (!isPlainObject(step)) {
    return;
  }

  if (typeof step.uses === "string") {
    const normalizedAction = actionNameForStep(step);

    if (Object.values(OFFICIAL_PAGES_ACTIONS).includes(normalizedAction)) {
      if (!isPagesWorkflow) {
        errors.push(
          `${formatLocation(filePath, `${location}.uses`)} invokes ${step.uses}; official Pages actions are reserved for website-pages.yml.`,
        );
      } else {
        const expectedJobId = normalizedAction === OFFICIAL_PAGES_ACTIONS.upload
          ? "build"
          : "deploy";
        if (jobId !== expectedJobId) {
          errors.push(
            `${formatLocation(filePath, `${location}.uses`)} invokes ${step.uses}; ${path.basename(normalizedAction)} must run only in jobs.${expectedJobId}.`,
          );
        }
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

      return (
        actionNameForStep(step) === "actions/setup-node" &&
        isPlainObject(step.with) &&
        step.with["node-version-file"] === "website/.nvmrc"
      );
    });
  });
}

function inspectPagesWorkflow(workflow, filePath, errors) {
  const triggers = workflow.on;

  if (!isPlainObject(triggers)) {
    errors.push(`${filePath}:on must define push and workflow_dispatch triggers.`);
  } else {
    const allowedTriggerNames = new Set(["push", "workflow_dispatch"]);
    const unexpectedTriggerNames = Object.keys(triggers)
      .filter((triggerName) => !allowedTriggerNames.has(triggerName))
      .sort();
    if (unexpectedTriggerNames.length > 0) {
      errors.push(
        `${filePath}:on must use only push and workflow_dispatch; found ${unexpectedTriggerNames.join(", ")}.`,
      );
    }

    if (Object.hasOwn(triggers, "pull_request")) {
      errors.push(`${filePath} must not declare pull_request; pull requests use website-ci.yml.`);
    }

    if (!Object.hasOwn(triggers, "workflow_dispatch")) {
      errors.push(`${filePath} must declare workflow_dispatch for authorized manual publication.`);
    }

    const pushTrigger = triggers.push;
    if (!isPlainObject(pushTrigger)) {
      errors.push(`${filePath}:on.push must configure learn-main and publication paths.`);
    } else {
      const allowedPushKeys = new Set(["branches", "paths"]);
      const unexpectedPushKeys = Object.keys(pushTrigger)
        .filter((pushKey) => !allowedPushKeys.has(pushKey))
        .sort();
      if (unexpectedPushKeys.length > 0) {
        errors.push(
          `${filePath}:on.push must use only branches and paths; found ${unexpectedPushKeys.join(", ")}.`,
        );
      }

      const branches = normalizeStringArray(pushTrigger.branches);
      if (branches.length !== 1 || branches[0] !== "learn-main") {
        errors.push(`${filePath}:on.push.branches must push only from learn-main.`);
      }

      const paths = normalizeStringArray(pushTrigger.paths);
      for (const requiredPath of REQUIRED_PUBLICATION_PATHS) {
        if (!paths.includes(requiredPath)) {
          errors.push(`${filePath}:on.push.paths must include ${requiredPath}.`);
        }
      }
    }
  }

  if (
    !isPlainObject(workflow.concurrency) ||
    workflow.concurrency["cancel-in-progress"] !== true
  ) {
    errors.push(`${filePath}:concurrency must set cancel-in-progress: true.`);
  }

  if (!isPlainObject(workflow.jobs)) {
    return;
  }

  const buildJob = workflow.jobs.build;
  const deployJob = workflow.jobs.deploy;
  const smokeJob = workflow.jobs.smoke;

  if (!isPlainObject(buildJob)) {
    errors.push(`${filePath}:jobs.build is required.`);
  }
  if (!isPlainObject(deployJob)) {
    errors.push(`${filePath}:jobs.deploy is required.`);
  }
  if (!isPlainObject(smokeJob)) {
    errors.push(`${filePath}:jobs.smoke is required.`);
  }

  if (isPlainObject(buildJob)) {
    if (!permissionsMatch(buildJob.permissions, { contents: "read" })) {
      errors.push(`${filePath}:jobs.build job must use only contents: read.`);
    }

    const uploadSteps = stepsUsingAction(buildJob, OFFICIAL_PAGES_ACTIONS.upload);
    if (uploadSteps.length !== 1) {
      errors.push(`${filePath}:jobs.build must invoke actions/upload-pages-artifact exactly once.`);
    } else {
      const uploadInputs = uploadSteps[0].with;
      if (
        !isPlainObject(uploadInputs) ||
        uploadInputs.name !== "github-pages" ||
        uploadInputs.path !== "website/.vitepress/dist"
      ) {
        errors.push(
          `${filePath}:jobs.build upload-pages-artifact must use name github-pages and path website/.vitepress/dist.`,
        );
      }
    }
  }

  if (isPlainObject(deployJob)) {
    if (!jobDependsOn(deployJob, "build")) {
      errors.push(`${filePath}:jobs.deploy job must depend on build.`);
    }

    if (!permissionsMatch(deployJob.permissions, {
      contents: "read",
      pages: "write",
      "id-token": "write",
    })) {
      errors.push(
        `${filePath}:jobs.deploy must use exact permissions contents: read, pages: write, and id-token: write.`,
      );
    }

    const environmentName = isPlainObject(deployJob.environment)
      ? deployJob.environment.name
      : deployJob.environment;
    if (environmentName !== "github-pages") {
      errors.push(`${filePath}:jobs.deploy must use the github-pages environment.`);
    }

    if (stepsUsingAction(deployJob, OFFICIAL_PAGES_ACTIONS.configure).length !== 1) {
      errors.push(`${filePath}:jobs.deploy must invoke actions/configure-pages exactly once.`);
    }

    const deploySteps = stepsUsingAction(deployJob, OFFICIAL_PAGES_ACTIONS.deploy);
    if (deploySteps.length !== 1) {
      errors.push(`${filePath}:jobs.deploy must invoke actions/deploy-pages exactly once.`);
    } else if (deploySteps[0].id !== "deployment") {
      errors.push(`${filePath}:jobs.deploy deploy-pages step must use id: deployment.`);
    }

    if (
      !isPlainObject(deployJob.outputs) ||
      typeof deployJob.outputs.page_url !== "string" ||
      !deployJob.outputs.page_url.includes("steps.deployment.outputs.page_url")
    ) {
      errors.push(`${filePath}:jobs.deploy must expose the deploy-pages page_url output.`);
    }
  }

  if (isPlainObject(smokeJob)) {
    if (!jobDependsOn(smokeJob, "deploy")) {
      errors.push(`${filePath}:jobs.smoke job must depend on deploy.`);
    }

    if (!permissionsMatch(smokeJob.permissions, { contents: "read" })) {
      errors.push(`${filePath}:jobs.smoke must use only contents: read.`);
    }

    const smokeTimeoutMinutes = smokeJob["timeout-minutes"];
    if (
      !Number.isInteger(smokeTimeoutMinutes) ||
      smokeTimeoutMinutes <= 0 ||
      smokeTimeoutMinutes > 10
    ) {
      errors.push(`${filePath}:jobs.smoke must set timeout-minutes between 1 and 10.`);
    }

    const smokeSteps = Array.isArray(smokeJob.steps) ? smokeJob.steps : [];
    const smokeEvidence = JSON.stringify(smokeSteps);
    const smokeCommands = smokeSteps
      .filter((step) => isPlainObject(step) && typeof step.run === "string")
      .map((step) => step.run)
      .join("\n");
    const retryRangeMatch = smokeCommands.match(/for\s+\w+\s+in\s+\{1\.\.([0-9]+)\}/);
    const retryLimit = retryRangeMatch ? Number.parseInt(retryRangeMatch[1], 10) : null;
    const maxTimeMatch = smokeCommands.match(/--max-time\s+([0-9]+)/);
    const maxRequestSeconds = maxTimeMatch
      ? Number.parseInt(maxTimeMatch[1], 10)
      : null;
    const sleepMatch = smokeCommands.match(/sleep\s+([0-9]+)/);
    const retrySleepSeconds = sleepMatch
      ? Number.parseInt(sleepMatch[1], 10)
      : null;
    const estimatedWorstCaseSeconds =
      retryLimit !== null &&
      maxRequestSeconds !== null &&
      retrySleepSeconds !== null
        ? 2 * (
          retryLimit * maxRequestSeconds +
          Math.max(retryLimit - 1, 0) * retrySleepSeconds
        )
        : null;
    const jobTimeoutSeconds = Number.isInteger(smokeTimeoutMinutes)
      ? smokeTimeoutMinutes * 60
      : null;
    const avoidsSleepingAfterFinalAttempt = retryLimit !== null
      ? smokeCommands.includes(`if [[ "\${attempt}" -lt ${retryLimit} ]]`)
      : false;
    const failsAfterExhaustion =
      smokeCommands.includes("route_available=false") &&
      smokeCommands.includes("route_available=true") &&
      smokeCommands.includes('if [[ "${route_available}" != "true" ]]') &&
      smokeCommands.includes("exit 1");
    if (
      !smokeEvidence.includes("needs.deploy.outputs.page_url") ||
      !smokeCommands.includes("${PAGE_URL%/}/") ||
      !smokeCommands.includes('for route in "" "zh/"') ||
      !smokeEvidence.includes("zh/") ||
      !smokeCommands.includes("curl") ||
      !smokeCommands.includes("--fail") ||
      !smokeCommands.includes("--location") ||
      !smokeCommands.includes("--connect-timeout") ||
      !smokeCommands.includes("--max-time") ||
      retryLimit === null ||
      retryLimit <= 0 ||
      retryLimit > 30 ||
      maxRequestSeconds === null ||
      maxRequestSeconds <= 0 ||
      retrySleepSeconds === null ||
      retrySleepSeconds <= 0 ||
      estimatedWorstCaseSeconds === null ||
      jobTimeoutSeconds === null ||
      estimatedWorstCaseSeconds >= jobTimeoutSeconds ||
      !avoidsSleepingAfterFinalAttempt ||
      !failsAfterExhaustion
    ) {
      errors.push(
        `${filePath}:jobs.smoke must normalize the deploy URL, fit bounded timed retries within the job timeout, and fail after exhaustion for root and zh/.`,
      );
    }
  }
}

function inspectWebsiteCiWorkflow(workflow, filePath, errors) {
  if (!isPlainObject(workflow.on)) {
    errors.push(`${filePath}:on must define pull_request and push validation triggers.`);
    return;
  }

  for (const triggerName of ["pull_request", "push"]) {
    const trigger = workflow.on[triggerName];
    const triggerPaths = isPlainObject(trigger)
      ? normalizeStringArray(trigger.paths)
      : [];
    if (!triggerPaths.includes(".github/workflows/**")) {
      errors.push(
        `${filePath}:on.${triggerName}.paths must include .github/workflows/** so every workflow change is policy-checked.`,
      );
    }
  }
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
  const fileName = path.basename(filePath);
  const normalizedFileName = fileName.toLowerCase();
  const isWebsiteWorkflow = WEBSITE_WORKFLOW_NAMES.has(normalizedFileName);
  const isPagesWorkflow = fileName === PAGES_WORKFLOW_NAME;
  const resemblesPagesWorkflow = ["website-pages.yml", "website-pages.yaml"].includes(
    normalizedFileName,
  );
  const errors = [];

  if (!isPlainObject(workflow)) {
    return [`${filePath} must contain one YAML mapping at its document root.`];
  }

  if (resemblesPagesWorkflow && !isPagesWorkflow) {
    errors.push(
      `${filePath} is a reserved Pages workflow alias; the only permitted name is ${PAGES_WORKFLOW_NAME}.`,
    );
  }

  inspectPermissions(workflow.permissions, filePath, "permissions", errors, {
    isPagesWorkflow,
    isDeployJob: false,
  });

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
    if (explicitlyPublishesPublicSite && !isPagesWorkflow) {
      errors.push(
        `${formatLocation(filePath, jobLocation)} is named as a public website deployment job (${jobIdentity.trim()}).`,
      );
    }

    const jobContext = {
      isPagesWorkflow,
      isDeployJob: isPagesWorkflow && jobId === "deploy",
    };
    inspectPermissions(
      job.permissions,
      filePath,
      `${jobLocation}.permissions`,
      errors,
      jobContext,
    );
    inspectEnvironment(
      job.environment,
      filePath,
      `${jobLocation}.environment`,
      errors,
      jobContext,
    );

    if (Array.isArray(job.steps)) {
      job.steps.forEach((step, stepIndex) => {
        inspectStep(step, filePath, `${jobLocation}.steps[${stepIndex}]`, errors, {
          isPagesWorkflow,
          jobId,
        });
      });
    }
  }

  if (isWebsiteWorkflow && !workflowUsesNodeVersionFile(workflow)) {
    errors.push(
      `${filePath} must configure actions/setup-node with node-version-file: website/.nvmrc.`,
    );
  }

  if (isPagesWorkflow) {
    inspectPagesWorkflow(workflow, filePath, errors);
  }

  if (fileName === "website-ci.yml") {
    inspectWebsiteCiWorkflow(workflow, filePath, errors);
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
    .filter((entry) => entry.isFile() && /\.(?:ya?ml)$/i.test(entry.name))
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

  for (const requiredWorkflowName of REQUIRED_WORKFLOW_NAMES) {
    if (!workflowFileNames.includes(requiredWorkflowName)) {
      errors.push(
        `${path.join(workflowsDirectory, requiredWorkflowName)} is missing; Website validation, review artifact, and Pages publication workflows are required.`,
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
