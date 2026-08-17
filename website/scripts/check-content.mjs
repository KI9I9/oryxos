import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import YAML from "yaml";

export const REQUIRED_PAGE_IDS = Object.freeze([
  "home",
  "architecture",
  "roadmap",
  "docs-index",
  "community",
  "docs-what-is-oryxos",
  "docs-why-java",
  "docs-design-principles",
  "docs-project-status",
  "docs-build-from-source",
  "docs-contributing",
  "docs-provider",
  "docs-react-loop",
  "docs-tool",
  "docs-memory",
  "docs-skill-profile",
  "docs-cli",
  "docs-rest-api",
]);

export const REQUIRED_DOCUMENTATION_SECTIONS = Object.freeze([
  "overview",
  "intended-design",
  "status-placeholder",
  "limitations-placeholder",
  "related-navigation",
]);

const REQUIRED_SECTION_LABELS = Object.freeze({
  overview: ["overview", "概述", "概览"],
  "intended-design": ["intended design", "预期设计", "设计意图"],
  "status-placeholder": ["status placeholder", "状态占位", "状态占位说明"],
  "limitations-placeholder": [
    "limitations placeholder",
    "limitation placeholder",
    "局限性占位",
    "限制占位",
    "局限性",
  ],
  "related-navigation": ["related navigation", "相关导航", "相关链接"],
});

const REAL_CAPABILITY_TERMS = [
  "provider",
  "react loop",
  "tool",
  "memory",
  "mcp",
  "distributed",
  "cli",
  "rest api",
  "skill",
  "profile management",
  "提供商",
  "工具",
  "记忆",
  "分布式",
  "命令行",
  "接口",
  "技能",
];

const CAPABILITY_STATE_LABELS = [
  "available",
  "in development",
  "planned",
  "vision",
  "可用",
  "开发中",
  "计划中",
  "愿景",
];

const PROHIBITED_RUNNABLE_PATTERNS = [
  {
    pattern: /(?:^|\s)(?:\$\s*)?oryxos\s+(?:init|chat|serve)\b/im,
    explanation: "presents an unverified OryxOS command as runnable",
  },
  {
    pattern: /\bcurl\b[^\n]*(?:https?:\/\/|\/api\/)/i,
    explanation: "presents an unverified HTTP interface as runnable",
  },
  {
    pattern: /\b(?:GET|POST|PUT|PATCH|DELETE)\s+\/(?:api|v\d+)\//,
    explanation: "presents an unverified REST endpoint as runnable",
  },
  {
    pattern: /\b(?:mcp|runtime)(?:Client|Api|API)\s*[.(]/i,
    explanation: "calls an unverified MCP or Runtime API",
  },
];

const PROHIBITED_SENSITIVE_PATTERNS = [
  {
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    explanation: "contains private-key material",
  },
  {
    pattern: /\b(?:api[_-]?key|access[_-]?token|client[_-]?secret|password)\s*[:=]\s*["']?[^\s"']{8,}/i,
    explanation: "contains a likely secret or credential",
  },
  {
    pattern: /\b(?:10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})\b/,
    explanation: "contains an internal network address",
  },
  {
    pattern: /\b(?:gtag\s*\(|google-analytics|googletagmanager|segment\.com|mixpanel|plausible\.io)\b/i,
    explanation: "contains tracking or analytics integration",
  },
  {
    pattern: /\b(?:contentful|sanity|strapi|wordpress|wp-json)\b/i,
    explanation: "contains a CMS integration that is outside the prototype",
  },
];

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function getPageRecords(manifest) {
  if (Array.isArray(manifest)) {
    return manifest;
  }

  if (isPlainObject(manifest) && Array.isArray(manifest.pages)) {
    return manifest.pages;
  }

  return null;
}

function getTemplateRecords(manifest) {
  if (!isPlainObject(manifest)) {
    return [];
  }

  for (const candidateKey of [
    "templates",
    "pageTemplates",
    "prototypePageTemplates",
  ]) {
    if (Array.isArray(manifest[candidateKey])) {
      return manifest[candidateKey];
    }
  }

  return [];
}

function normalizeComparableArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...value].map(String).sort((left, right) => left.localeCompare(right));
}

function arraysEqual(left, right) {
  return (
    left.length === right.length &&
    left.every((leftValue, index) => leftValue === right[index])
  );
}

function normalizeRoutePurpose(route) {
  const normalizedRoute = normalizeRoute(route);
  if (normalizedRoute === "/zh") {
    return "/";
  }

  return normalizedRoute.replace(/^\/zh(?=\/)/, "") || "/";
}

export function normalizeRoute(route) {
  if (typeof route !== "string" || route.trim() === "") {
    return "";
  }

  let normalizedRoute = route.trim().split(/[?#]/, 1)[0].replaceAll("\\", "/");
  normalizedRoute = `/${normalizedRoute}`.replace(/\/{2,}/g, "/");
  normalizedRoute = normalizedRoute.replace(/\/index\.html?$/i, "/");
  normalizedRoute = normalizedRoute.replace(/\.html?$/i, "");

  if (normalizedRoute.length > 1) {
    normalizedRoute = normalizedRoute.replace(/\/$/, "");
  }

  return normalizedRoute || "/";
}

export function parseMarkdownFrontmatter(markdown, sourcePath = "page.md") {
  if (typeof markdown !== "string" || !markdown.startsWith("---")) {
    return {
      attributes: {},
      body: typeof markdown === "string" ? markdown : "",
      errors: [`${sourcePath} must start with YAML frontmatter.`],
    };
  }

  const frontmatterMatch = markdown.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);
  if (!frontmatterMatch) {
    return {
      attributes: {},
      body: markdown,
      errors: [`${sourcePath} has an unterminated YAML frontmatter block.`],
    };
  }

  try {
    const attributes = YAML.parse(frontmatterMatch[1]) ?? {};
    if (!isPlainObject(attributes)) {
      return {
        attributes: {},
        body: markdown.slice(frontmatterMatch[0].length),
        errors: [`${sourcePath} frontmatter must be a YAML mapping.`],
      };
    }

    return {
      attributes,
      body: markdown.slice(frontmatterMatch[0].length),
      errors: [],
    };
  } catch (error) {
    return {
      attributes: {},
      body: markdown.slice(frontmatterMatch[0].length),
      errors: [`${sourcePath} frontmatter is not valid YAML: ${error.message}`],
    };
  }
}

function validateTemplateRecords(manifest) {
  const templates = getTemplateRecords(manifest);
  const errors = [];
  const templateIds = new Set();

  for (const [templateIndex, template] of templates.entries()) {
    const location = `pages.json templates[${templateIndex}]`;
    if (!isPlainObject(template)) {
      errors.push(`${location} must be an object.`);
      continue;
    }

    if (typeof template.templateId !== "string" || template.templateId.trim() === "") {
      errors.push(`${location}.templateId must be a non-empty string.`);
      continue;
    }

    if (typeof template.noticeKey !== "string" || template.noticeKey.trim() === "") {
      errors.push(`${location}.noticeKey must be a non-empty draft-notice key.`);
    }

    if (templateIds.has(template.templateId)) {
      errors.push(`${location}.templateId duplicates ${template.templateId}.`);
    }
    templateIds.add(template.templateId);

    const sectionKeys = normalizeComparableArray(template.sectionKeys);
    const requiredSectionKeys = normalizeComparableArray(REQUIRED_DOCUMENTATION_SECTIONS);
    if (!arraysEqual(sectionKeys, requiredSectionKeys)) {
      errors.push(
        `${location}.sectionKeys must contain exactly ${REQUIRED_DOCUMENTATION_SECTIONS.join(
          ", ",
        )}.`,
      );
    }

    if (template.allowsRunnableExamples !== false) {
      errors.push(`${location}.allowsRunnableExamples must be false for this prototype.`);
    }
    if (template.allowsAvailabilityClaims !== false) {
      errors.push(`${location}.allowsAvailabilityClaims must be false for this prototype.`);
    }
  }

  return { errors, templateIds };
}

export function validatePageManifest(manifest, options = {}) {
  const requiredPageIds = options.requiredPageIds ?? REQUIRED_PAGE_IDS;
  const pages = getPageRecords(manifest);
  const errors = [];

  if (!pages) {
    return ["pages.json must be an array or an object with a pages array."];
  }

  const templateValidation = validateTemplateRecords(manifest);
  errors.push(...templateValidation.errors);

  const routeOwners = new Map();
  const pagesByPageId = new Map();

  for (const [pageIndex, page] of pages.entries()) {
    const location = `pages.json pages[${pageIndex}]`;
    if (!isPlainObject(page)) {
      errors.push(`${location} must be an object.`);
      continue;
    }

    for (const requiredStringField of [
      "pageId",
      "locale",
      "kind",
      "route",
      "sourcePath",
      "title",
      "description",
    ]) {
      if (
        typeof page[requiredStringField] !== "string" ||
        page[requiredStringField].trim() === ""
      ) {
        errors.push(`${location}.${requiredStringField} must be a non-empty string.`);
      }
    }

    if (!page.pageId || !page.locale) {
      continue;
    }

    if (!pagesByPageId.has(page.pageId)) {
      pagesByPageId.set(page.pageId, []);
    }
    pagesByPageId.get(page.pageId).push(page);

    if (!["root", "zh"].includes(page.locale)) {
      errors.push(`${location}.locale must be root or zh.`);
    }
    if (!["core", "documentation", "fallback"].includes(page.kind)) {
      errors.push(`${location}.kind must be core, documentation, or fallback.`);
    }
    if (typeof page.required !== "boolean") {
      errors.push(`${location}.required must be a boolean.`);
    }
    if (page.contentStatus !== "prototype") {
      errors.push(
        `${location}.contentStatus must be prototype so the shared draft notice is mandatory.`,
      );
    }
    if (!Array.isArray(page.primaryActionKeys)) {
      errors.push(`${location}.primaryActionKeys must be an array.`);
    }
    if (typeof page.draftNoticeKey !== "string" || page.draftNoticeKey.trim() === "") {
      errors.push(`${location}.draftNoticeKey must be a non-empty string.`);
    }

    const normalizedRoute = normalizeRoute(page.route);
    if (!normalizedRoute) {
      errors.push(`${location}.route is not a valid route.`);
    } else if (routeOwners.has(normalizedRoute)) {
      errors.push(
        `${location}.route duplicates normalized route ${normalizedRoute}, already used by ${routeOwners.get(
          normalizedRoute,
        )}.`,
      );
    } else {
      routeOwners.set(normalizedRoute, `${page.pageId}/${page.locale}`);
    }

    if (typeof page.sourcePath === "string") {
      if (
        path.isAbsolute(page.sourcePath) ||
        page.sourcePath.includes("\\") ||
        page.sourcePath.split("/").includes("..") ||
        !page.sourcePath.endsWith(".md")
      ) {
        errors.push(
          `${location}.sourcePath must be a safe website-relative Markdown path using forward slashes.`,
        );
      }
    }

    if (page.kind === "documentation") {
      if (typeof page.templateId !== "string" || page.templateId.trim() === "") {
        errors.push(`${location}.templateId is required for documentation pages.`);
      } else if (
        templateValidation.templateIds.size > 0 &&
        !templateValidation.templateIds.has(page.templateId)
      ) {
        errors.push(`${location}.templateId does not resolve to a declared template.`);
      }
    }
  }

  for (const requiredPageId of requiredPageIds) {
    const localizedPages = pagesByPageId.get(requiredPageId) ?? [];
    for (const requiredLocale of ["root", "zh"]) {
      const matchingPages = localizedPages.filter((page) => page.locale === requiredLocale);
      if (matchingPages.length !== 1) {
        errors.push(
          `Required page ${requiredPageId} must have exactly one ${requiredLocale} record; found ${matchingPages.length}.`,
        );
      } else if (matchingPages[0].required !== true) {
        errors.push(`Required page ${requiredPageId}/${requiredLocale} must set required: true.`);
      }
    }
  }

  for (const [pageId, localizedPages] of pagesByPageId.entries()) {
    const rootPage = localizedPages.find((page) => page.locale === "root");
    const chinesePage = localizedPages.find((page) => page.locale === "zh");

    if (rootPage && chinesePage) {
      for (const page of [rootPage, chinesePage]) {
        if (page.counterpartPageId !== pageId) {
          errors.push(
            `${pageId}/${page.locale}.counterpartPageId must be ${pageId} because both locale records share the semantic Page ID.`,
          );
        }
      }

      if (rootPage.kind !== chinesePage.kind) {
        errors.push(`${pageId} locale counterparts must share the same kind.`);
      }
      if ((rootPage.templateId ?? null) !== (chinesePage.templateId ?? null)) {
        errors.push(`${pageId} locale counterparts must share the same templateId.`);
      }
      if ((rootPage.draftNoticeKey ?? null) !== (chinesePage.draftNoticeKey ?? null)) {
        errors.push(`${pageId} locale counterparts must share the same draftNoticeKey.`);
      }
      if (
        !arraysEqual(
          normalizeComparableArray(rootPage.primaryActionKeys),
          normalizeComparableArray(chinesePage.primaryActionKeys),
        )
      ) {
        errors.push(`${pageId} locale counterparts must share primaryActionKeys.`);
      }
      if (normalizeRoutePurpose(rootPage.route) !== normalizeRoutePurpose(chinesePage.route)) {
        errors.push(`${pageId} locale counterparts must represent equivalent route purposes.`);
      }
    } else {
      for (const page of localizedPages) {
        if (page.required !== false || page.counterpartPageId !== null) {
          errors.push(
            `${pageId}/${page.locale} has no locale counterpart and therefore must set required: false and counterpartPageId: null.`,
          );
        }
      }
    }
  }

  return errors;
}

function extractMarkdownHeadings(markdownBody) {
  const headings = [];
  const headingPattern = /^#{1,6}\s+(.+?)\s*#*\s*$/gm;
  let headingMatch;

  while ((headingMatch = headingPattern.exec(markdownBody)) !== null) {
    headings.push(
      headingMatch[1]
        .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
        .replace(/[*_`]/g, "")
        .trim()
        .toLocaleLowerCase(),
    );
  }

  return headings;
}

function validateRequiredDocumentationSections(page, markdownBody) {
  if (page.kind !== "documentation") {
    return [];
  }

  const headings = extractMarkdownHeadings(markdownBody);
  const errors = [];

  for (const sectionKey of REQUIRED_DOCUMENTATION_SECTIONS) {
    const acceptedLabels = REQUIRED_SECTION_LABELS[sectionKey];
    const hasSection = headings.some((heading) =>
      acceptedLabels.some((label) => heading === label || heading.startsWith(`${label} `)),
    );

    if (!hasSection) {
      errors.push(
        `${page.sourcePath} is a provisional documentation page and is missing the ${sectionKey} heading.`,
      );
    }
  }

  return errors;
}

function extractRunnableCode(markdownBody) {
  const runnableFragments = [];
  const fencedCodePattern = /```(?:bash|sh|shell|console|http|javascript|typescript|java)?\s*\r?\n([\s\S]*?)```/gi;
  let fencedCodeMatch;

  while ((fencedCodeMatch = fencedCodePattern.exec(markdownBody)) !== null) {
    runnableFragments.push(fencedCodeMatch[1]);
  }

  const inlineCodePattern = /`([^`\n]+)`/g;
  let inlineCodeMatch;
  while ((inlineCodeMatch = inlineCodePattern.exec(markdownBody)) !== null) {
    runnableFragments.push(inlineCodeMatch[1]);
  }

  return runnableFragments;
}

export function findProhibitedContent(markdownBody, sourcePath = "page.md") {
  const errors = [];
  const runnableFragments = extractRunnableCode(markdownBody);

  for (const fragment of runnableFragments) {
    for (const prohibitedRule of PROHIBITED_RUNNABLE_PATTERNS) {
      if (prohibitedRule.pattern.test(fragment)) {
        errors.push(`${sourcePath} ${prohibitedRule.explanation}: ${JSON.stringify(fragment.trim())}.`);
      }
    }
  }

  for (const prohibitedRule of PROHIBITED_SENSITIVE_PATTERNS) {
    if (prohibitedRule.pattern.test(markdownBody)) {
      errors.push(`${sourcePath} ${prohibitedRule.explanation}.`);
    }
  }

  return errors;
}

export function findCapabilityStateAssignments(markdownBody, sourcePath = "page.md") {
  const errors = [];
  const lines = markdownBody.split(/\r?\n/);

  lines.forEach((line, lineIndex) => {
    const normalizedLine = line.toLocaleLowerCase();
    const containsCapability = REAL_CAPABILITY_TERMS.some((term) =>
      normalizedLine.includes(term),
    );
    const containsState = CAPABILITY_STATE_LABELS.some((state) =>
      normalizedLine.includes(state),
    );
    const isLegendDefinition =
      /\b(?:legend|definition|example category|visual treatment)\b/i.test(line) ||
      /图例|定义|示例类别|视觉样式/.test(line);
    const resemblesAssignment = /\||:|：|—|–|\bbadge\b|\bstate\b|状态/i.test(line);

    if (containsCapability && containsState && resemblesAssignment && !isLegendDefinition) {
      errors.push(
        `${sourcePath}:${lineIndex + 1} assigns a capability-state label to a real capability: ${line.trim()}`,
      );
    }
  });

  return errors;
}

export function validateMarkdownPage(page, markdown) {
  const sourcePath = page.sourcePath ?? `${page.pageId ?? "unknown"}.md`;
  const frontmatter = parseMarkdownFrontmatter(markdown, sourcePath);
  const errors = [...frontmatter.errors];

  const frontmatterContentStatus =
    frontmatter.attributes.contentStatus ?? frontmatter.attributes.content_status;
  if (frontmatterContentStatus !== "prototype") {
    errors.push(
      `${sourcePath} frontmatter must declare contentStatus: prototype so the shared draft notice applies.`,
    );
  }

  errors.push(...validateRequiredDocumentationSections(page, frontmatter.body));
  errors.push(...findProhibitedContent(frontmatter.body, sourcePath));
  errors.push(...findCapabilityStateAssignments(frontmatter.body, sourcePath));

  return errors;
}

function flattenStringValues(value, currentPath = "root", output = []) {
  if (typeof value === "string") {
    output.push({ path: currentPath, value });
    return output;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => flattenStringValues(item, `${currentPath}[${index}]`, output));
    return output;
  }

  if (isPlainObject(value)) {
    for (const [key, nestedValue] of Object.entries(value)) {
      flattenStringValues(nestedValue, `${currentPath}.${key}`, output);
    }
  }

  return output;
}

export function validatePrototypeContent(prototypeContent) {
  if (!isPlainObject(prototypeContent)) {
    return ["prototype-content.json must contain a JSON object."];
  }

  const errors = [];
  const stringValues = flattenStringValues(prototypeContent);
  const englishDraftNotice =
    "Draft visual prototype — content is provisional and not public documentation.";
  const hasEnglishDraftNotice = stringValues.some(
    ({ value }) => value.trim() === englishDraftNotice,
  );
  const hasChineseDraftNotice = stringValues.some(({ path: valuePath, value }) => {
    const pathSuggestsChinese = /(?:^|\.)(?:zh|zh-hans|chinese)(?:\.|$)/i.test(valuePath);
    const textLooksLikeDraftNotice =
      /(?:草案|原型)/.test(value) &&
      /(?:临时|暂定|暂未定稿)/.test(value) &&
      /(?:非公开|不是公开|并非公开)/.test(value);
    return pathSuggestsChinese && textLooksLikeDraftNotice;
  });

  if (!hasEnglishDraftNotice) {
    errors.push(
      `prototype-content.json must define the exact English draft notice: ${englishDraftNotice}`,
    );
  }
  if (!hasChineseDraftNotice) {
    errors.push(
      "prototype-content.json must define a Chinese draft notice that clearly says the visual prototype is provisional and not public documentation.",
    );
  }

  const declaredStates = new Set();
  function collectStates(value) {
    if (Array.isArray(value)) {
      value.forEach(collectStates);
      return;
    }
    if (!isPlainObject(value)) {
      return;
    }
    if (typeof value.state === "string") {
      declaredStates.add(value.state);
    }
    Object.values(value).forEach(collectStates);
  }
  collectStates(prototypeContent);

  for (const requiredState of ["available", "in-development", "planned", "vision"]) {
    if (!declaredStates.has(requiredState)) {
      errors.push(
        `prototype-content.json must include the non-claim capability legend state ${requiredState}.`,
      );
    }
  }

  return errors;
}

function validateDraftNoticeReferences(pageManifest, prototypeContent) {
  const pages = getPageRecords(pageManifest) ?? [];
  const templates = getTemplateRecords(pageManifest);
  const declaredDraftNotices = isPlainObject(prototypeContent?.draftNotices)
    ? prototypeContent.draftNotices
    : {};
  const errors = [];

  for (const page of pages) {
    if (!isPlainObject(page) || typeof page.draftNoticeKey !== "string") {
      continue;
    }
    if (!isPlainObject(declaredDraftNotices[page.draftNoticeKey])) {
      errors.push(
        `${page.pageId}/${page.locale}.draftNoticeKey does not resolve in prototype-content.json: ${page.draftNoticeKey}.`,
      );
    }
  }

  for (const template of templates) {
    if (!isPlainObject(template) || typeof template.noticeKey !== "string") {
      continue;
    }
    if (!isPlainObject(declaredDraftNotices[template.noticeKey])) {
      errors.push(
        `Template ${template.templateId ?? "unknown"}.noticeKey does not resolve in prototype-content.json: ${template.noticeKey}.`,
      );
    }
  }

  return errors;
}

export function validateDiscrepancyRegister(register) {
  if (!isPlainObject(register)) {
    return ["discrepancy-register.yaml must contain a YAML mapping."];
  }

  const errors = [];
  if (register.public_deployment_allowed !== false) {
    errors.push("discrepancy-register.yaml must set public_deployment_allowed: false.");
  }
  if (!Array.isArray(register.discrepancies)) {
    errors.push("discrepancy-register.yaml must contain a discrepancies array.");
    return errors;
  }

  const discrepancyIds = new Set();
  register.discrepancies.forEach((discrepancy, discrepancyIndex) => {
    const location = `discrepancy-register.yaml discrepancies[${discrepancyIndex}]`;
    if (!isPlainObject(discrepancy)) {
      errors.push(`${location} must be a mapping.`);
      return;
    }

    if (
      typeof discrepancy.discrepancy_id !== "string" ||
      discrepancy.discrepancy_id.trim() === ""
    ) {
      errors.push(`${location}.discrepancy_id must be a non-empty string.`);
    } else if (discrepancyIds.has(discrepancy.discrepancy_id)) {
      errors.push(`${location}.discrepancy_id duplicates ${discrepancy.discrepancy_id}.`);
    } else {
      discrepancyIds.add(discrepancy.discrepancy_id);
    }

    const isUnresolved = !["resolved", "superseded"].includes(discrepancy.status);
    if (isUnresolved && discrepancy.public_deployment_blocked !== true) {
      errors.push(`${location} is unresolved and must set public_deployment_blocked: true.`);
    }
    if (isUnresolved && discrepancy.prototype_handling === "resolved") {
      errors.push(`${location} is unresolved and cannot use prototype_handling: resolved.`);
    }
    if (
      !["neutral-copy", "draft-label", "omit-detail", "resolved"].includes(
        discrepancy.prototype_handling,
      )
    ) {
      errors.push(`${location}.prototype_handling is not an allowed value.`);
    }
  });

  return errors;
}

export function validateContentFixture({
  pageManifest,
  prototypeContent,
  discrepancyRegister,
  markdownBySourcePath,
  requiredPageIds,
}) {
  const errors = [
    ...validatePageManifest(pageManifest, { requiredPageIds }),
    ...validatePrototypeContent(prototypeContent),
    ...validateDiscrepancyRegister(discrepancyRegister),
    ...validateDraftNoticeReferences(pageManifest, prototypeContent),
  ];
  const pages = getPageRecords(pageManifest) ?? [];

  for (const page of pages) {
    if (!isPlainObject(page) || typeof page.sourcePath !== "string") {
      continue;
    }

    const markdown = markdownBySourcePath.get(page.sourcePath);
    if (markdown === undefined) {
      errors.push(
        `${page.sourcePath} is missing for ${page.pageId ?? "an unknown page"}/${page.locale ?? "unknown locale"}.`,
      );
      continue;
    }
    errors.push(...validateMarkdownPage(page, markdown));
  }

  return errors;
}

async function readJson(jsonPath, label) {
  try {
    const source = await readFile(jsonPath, "utf8");
    return { value: JSON.parse(source), errors: [] };
  } catch (error) {
    const explanation =
      error.code === "ENOENT"
        ? `${label} is missing at ${jsonPath}. Create the intended repository-owned file before running content validation.`
        : `Cannot read ${label} at ${jsonPath}: ${error.message}`;
    return { value: null, errors: [explanation] };
  }
}

async function readYaml(yamlPath, label) {
  try {
    const source = await readFile(yamlPath, "utf8");
    return { value: YAML.parse(source), errors: [] };
  } catch (error) {
    const explanation =
      error.code === "ENOENT"
        ? `${label} is missing at ${yamlPath}. Create the intended governance file before running content validation.`
        : `Cannot read or parse ${label} at ${yamlPath}: ${error.message}`;
    return { value: null, errors: [explanation] };
  }
}

export async function checkContentProject(websiteRoot) {
  const repositoryRoot = path.resolve(websiteRoot, "..");
  const pageManifestPath = path.join(websiteRoot, "data", "pages.json");
  const prototypeContentPath = path.join(websiteRoot, "data", "prototype-content.json");
  const discrepancyRegisterPath = path.join(
    repositoryRoot,
    "specs",
    "002-oryxos-website",
    "discrepancy-register.yaml",
  );

  const [pageManifestResult, prototypeContentResult, discrepancyRegisterResult] =
    await Promise.all([
      readJson(pageManifestPath, "Page manifest"),
      readJson(prototypeContentPath, "Prototype content data"),
      readYaml(discrepancyRegisterPath, "Discrepancy register"),
    ]);
  const errors = [
    ...pageManifestResult.errors,
    ...prototypeContentResult.errors,
    ...discrepancyRegisterResult.errors,
  ];

  if (
    pageManifestResult.value === null ||
    prototypeContentResult.value === null ||
    discrepancyRegisterResult.value === null
  ) {
    return errors;
  }

  const markdownBySourcePath = new Map();
  const pages = getPageRecords(pageManifestResult.value) ?? [];
  await Promise.all(
    pages.map(async (page) => {
      if (!isPlainObject(page) || typeof page.sourcePath !== "string") {
        return;
      }

      const sourcePath = path.resolve(websiteRoot, page.sourcePath);
      const sourceRemainsInsideWebsite =
        sourcePath === websiteRoot || sourcePath.startsWith(`${websiteRoot}${path.sep}`);
      if (!sourceRemainsInsideWebsite) {
        return;
      }

      try {
        markdownBySourcePath.set(page.sourcePath, await readFile(sourcePath, "utf8"));
      } catch {
        // validateContentFixture emits the Page-specific actionable missing-file error.
      }
    }),
  );

  errors.push(
    ...validateContentFixture({
      pageManifest: pageManifestResult.value,
      prototypeContent: prototypeContentResult.value,
      discrepancyRegister: discrepancyRegisterResult.value,
      markdownBySourcePath,
    }),
  );

  return errors;
}

async function runCommandLine() {
  const websiteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const errors = await checkContentProject(websiteRoot);

  if (errors.length > 0) {
    console.error("Prototype content validation failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("Prototype content validation passed.");
}

const invokedScriptPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (invokedScriptPath === fileURLToPath(import.meta.url)) {
  await runCommandLine();
}
