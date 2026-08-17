import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  REQUIRED_PAGE_IDS,
  checkContentProject,
  findCapabilityStateAssignments,
  findProhibitedContent,
  validateContentFixture,
  validateMarkdownPage,
  validatePageManifest,
} from "../../scripts/check-content.mjs";

const ENGLISH_DRAFT_NOTICE =
  "Draft visual prototype — content is provisional and not public documentation.";
const CHINESE_DRAFT_NOTICE =
  "视觉原型草案 — 内容为临时内容，并非公开文档。";

const ROUTES_BY_PAGE_ID = {
  home: "/",
  architecture: "/architecture",
  roadmap: "/roadmap",
  "docs-index": "/docs/",
  community: "/community",
  "docs-what-is-oryxos": "/docs/concepts/what-is-oryxos",
  "docs-why-java": "/docs/concepts/why-java",
  "docs-design-principles": "/docs/concepts/design-principles",
  "docs-project-status": "/docs/project/project-status",
  "docs-build-from-source": "/docs/getting-started/build-from-source",
  "docs-contributing": "/docs/contributing",
  "docs-provider": "/docs/runtime/provider",
  "docs-react-loop": "/docs/runtime/react-loop",
  "docs-tool": "/docs/runtime/tool",
  "docs-memory": "/docs/runtime/memory",
  "docs-skill-profile": "/docs/runtime/skill-profile",
  "docs-cli": "/docs/interfaces/cli",
  "docs-rest-api": "/docs/interfaces/rest-api",
};

function routeToSourcePath(route, locale) {
  const localePrefix = locale === "zh" ? "zh/" : "";
  if (route === "/") {
    return `${localePrefix}index.md`;
  }
  if (route.endsWith("/")) {
    return `${localePrefix}${route.slice(1)}index.md`;
  }
  return `${localePrefix}${route.slice(1)}.md`;
}

function createPageRecord(pageId, locale, pageIndex) {
  const rootRoute = ROUTES_BY_PAGE_ID[pageId];
  const route = locale === "zh"
    ? rootRoute === "/"
      ? "/zh/"
      : `/zh${rootRoute}`
    : rootRoute;
  const kind = pageId.startsWith("docs-") && pageId !== "docs-index"
    ? "documentation"
    : "core";

  return {
    pageId,
    locale,
    kind,
    route,
    sourcePath: routeToSourcePath(rootRoute, locale),
    title: `${locale === "zh" ? "中文" : "English"} title ${pageIndex}`,
    description: `${locale === "zh" ? "中文" : "English"} description ${pageIndex}`,
    counterpartPageId: pageId,
    required: true,
    contentStatus: "prototype",
    draftNoticeKey: "draft-visual-prototype",
    templateId: kind === "documentation" ? "prototype-documentation" : null,
    primaryActionKeys: kind === "documentation" ? ["return-to-docs"] : [],
    ogImage: locale === "zh" ? "social-default-zh" : "social-default-en",
  };
}

function createValidManifest() {
  const pages = [];
  REQUIRED_PAGE_IDS.forEach((pageId, pageIndex) => {
    pages.push(createPageRecord(pageId, "root", pageIndex));
    pages.push(createPageRecord(pageId, "zh", pageIndex));
  });

  return {
    pages,
    templates: [
      {
        templateId: "prototype-documentation",
        noticeKey: "draft-visual-prototype",
        sectionKeys: [
          "overview",
          "intended-design",
          "status-placeholder",
          "limitations-placeholder",
          "related-navigation",
        ],
        allowsRunnableExamples: false,
        allowsAvailabilityClaims: false,
      },
    ],
  };
}

function createPrototypeContent() {
  return {
    draftNotices: {
      "draft-visual-prototype": {
        root: ENGLISH_DRAFT_NOTICE,
        zh: CHINESE_DRAFT_NOTICE,
      },
    },
    capabilityLegend: [
      { state: "available", englishLabel: "Available", chineseLabel: "可用" },
      {
        state: "in-development",
        englishLabel: "In development",
        chineseLabel: "开发中",
      },
      { state: "planned", englishLabel: "Planned", chineseLabel: "计划中" },
      { state: "vision", englishLabel: "Vision", chineseLabel: "愿景" },
    ],
  };
}

function createDiscrepancyRegister() {
  return {
    public_deployment_allowed: false,
    discrepancies: [
      {
        discrepancy_id: "DISC-TEST-001",
        status: "open",
        prototype_handling: "draft-label",
        public_deployment_blocked: true,
      },
    ],
  };
}

function createMarkdown(page) {
  const frontmatter = "---\ncontentStatus: prototype\n---\n";
  if (page.kind !== "documentation") {
    return `${frontmatter}\n# ${page.title}\n\nConservative prototype copy.\n`;
  }

  if (page.locale === "zh") {
    return `${frontmatter}\n# ${page.title}\n\n## 概述\n\n临时说明。\n\n## 预期设计\n\n临时说明。\n\n## 状态占位\n\n临时说明。\n\n## 局限性占位\n\n临时说明。\n\n## 相关导航\n\n临时说明。\n`;
  }

  return `${frontmatter}\n# ${page.title}\n\n## Overview\n\nProvisional.\n\n## Intended design\n\nProvisional.\n\n## Status placeholder\n\nProvisional.\n\n## Limitations placeholder\n\nProvisional.\n\n## Related navigation\n\nProvisional.\n`;
}

function createValidContentFixture() {
  const pageManifest = createValidManifest();
  const markdownBySourcePath = new Map(
    pageManifest.pages.map((page) => [page.sourcePath, createMarkdown(page)]),
  );

  return {
    pageManifest,
    prototypeContent: createPrototypeContent(),
    discrepancyRegister: createDiscrepancyRegister(),
    markdownBySourcePath,
  };
}

function includesError(errors, expectedText) {
  return errors.some((error) => error.includes(expectedText));
}

test("accepts all 18 bilingual Page pairs and their provisional source form", () => {
  const fixture = createValidContentFixture();
  assert.deepEqual(validateContentFixture(fixture), []);
});

test("rejects duplicate normalized routes", () => {
  const manifest = createValidManifest();
  manifest.pages[1].route = manifest.pages[0].route;

  const errors = validatePageManifest(manifest);
  assert.equal(includesError(errors, "duplicates normalized route"), true);
});

test("rejects a missing required locale counterpart", () => {
  const manifest = createValidManifest();
  manifest.pages = manifest.pages.filter(
    (page) => !(page.pageId === "roadmap" && page.locale === "zh"),
  );

  const errors = validatePageManifest(manifest);
  assert.equal(includesError(errors, "roadmap must have exactly one zh record"), true);
});

test("rejects counterpart template, action, and route-purpose drift", () => {
  const manifest = createValidManifest();
  const chinesePage = manifest.pages.find(
    (page) => page.pageId === "docs-tool" && page.locale === "zh",
  );
  chinesePage.templateId = "different-template";
  chinesePage.primaryActionKeys = ["different-action"];
  chinesePage.route = "/zh/docs/runtime/not-the-tool-route";

  const errors = validatePageManifest(manifest);
  assert.equal(includesError(errors, "must share the same templateId"), true);
  assert.equal(includesError(errors, "must share primaryActionKeys"), true);
  assert.equal(includesError(errors, "equivalent route purposes"), true);
});

test("requires prototype status so every Page receives the global draft notice", () => {
  const manifest = createValidManifest();
  manifest.pages[0].contentStatus = "reviewed";

  const errors = validatePageManifest(manifest);
  assert.equal(includesError(errors, "shared draft notice is mandatory"), true);
});

test("requires every Page draft-notice key to resolve", () => {
  const fixture = createValidContentFixture();
  fixture.pageManifest.pages[0].draftNoticeKey = "missing-notice";

  const errors = validateContentFixture(fixture);
  assert.equal(includesError(errors, "draftNoticeKey does not resolve"), true);
});

test("requires every provisional documentation section", () => {
  const page = createPageRecord("docs-tool", "root", 1);
  const markdown = createMarkdown(page).replace("## Limitations placeholder", "## Notes");

  const errors = validateMarkdownPage(page, markdown);
  assert.equal(includesError(errors, "missing the limitations-placeholder heading"), true);
});

test("rejects unverified runnable commands and endpoints", () => {
  const markdown = [
    "Use this command:",
    "```bash",
    "oryxos serve",
    "```",
    "Then call `GET /api/agents`.",
  ].join("\n");

  const errors = findProhibitedContent(markdown, "unsafe.md");
  assert.equal(includesError(errors, "unverified OryxOS command"), true);
  assert.equal(includesError(errors, "unverified REST endpoint"), true);
});

test("rejects availability-state assignments to real capabilities", () => {
  const errors = findCapabilityStateAssignments(
    "| Provider | Planned |\n| Memory | Available |",
    "claims.md",
  );

  assert.equal(errors.length, 2);
  assert.equal(includesError(errors, "assigns a capability-state label"), true);
});

test("reports intended data files actionably when the project is incomplete", async () => {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "oryxos-content-missing-"));
  try {
    const errors = await checkContentProject(temporaryRoot);
    assert.equal(includesError(errors, "Page manifest is missing"), true);
    assert.equal(includesError(errors, "Prototype content data is missing"), true);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});
