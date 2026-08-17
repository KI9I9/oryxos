import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, unlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { verifyBuildOutput } from "../../scripts/verify-build.mjs";

const ENGLISH_DRAFT_NOTICE =
  "Draft visual prototype — content is provisional and not public documentation.";
const CHINESE_DRAFT_NOTICE =
  "视觉原型草案 — 内容为临时内容，并非公开文档。";

const PROTOTYPE_CONTENT = {
  notices: {
    root: ENGLISH_DRAFT_NOTICE,
    zh: CHINESE_DRAFT_NOTICE,
  },
};

function createPageManifest() {
  return {
    pages: [
      {
        pageId: "home",
        locale: "root",
        route: "/",
        title: "OryxOS Home",
        description: "English home description.",
      },
      {
        pageId: "home",
        locale: "zh",
        route: "/zh/",
        title: "OryxOS 首页",
        description: "中文首页说明。",
      },
      {
        pageId: "guide",
        locale: "root",
        route: "/guide",
        title: "Prototype Guide",
        description: "English guide description.",
      },
      {
        pageId: "guide",
        locale: "zh",
        route: "/zh/guide",
        title: "原型指南",
        description: "中文指南说明。",
      },
    ],
  };
}

function createLocalizedPageHtml(page, alternatePage) {
  const isChinese = page.locale === "zh";
  const language = isChinese ? "zh-Hans" : "en";
  const openGraphLocale = isChinese ? "zh_CN" : "en_US";
  const alternateLanguage = isChinese ? "en" : "zh-Hans";
  const alternateHref = alternatePage.route === "/"
    ? "/oryxos/"
    : `/oryxos/${alternatePage.route.slice(1)}`;
  const socialImage = isChinese
    ? "/oryxos/social/og-default-zh.png"
    : "/oryxos/social/og-default-en.png";
  const socialAlt = isChinese
    ? `${page.pageId} 的中文 OryxOS 社交卡片`
    : `English OryxOS social card for ${page.pageId}`;
  const draftNotice = isChinese ? CHINESE_DRAFT_NOTICE : ENGLISH_DRAFT_NOTICE;
  const guideHref = isChinese
    ? "/oryxos/zh/guide#details"
    : "/oryxos/guide#details";

  return `<!doctype html>
<html lang="${language}">
  <head>
    <meta charset="utf-8">
    <title>${page.title}</title>
    <meta name="description" content="${page.description}">
    <meta property="og:locale" content="${openGraphLocale}">
    <meta property="og:image" content="${socialImage}">
    <meta property="og:image:alt" content="${socialAlt}">
    <meta name="twitter:image" content="${socialImage}">
    <meta name="twitter:image:alt" content="${socialAlt}">
    <link rel="alternate" hreflang="${alternateLanguage}" href="${alternateHref}">
    <link rel="icon" href="/oryxos/icons/favicon.svg">
    <link rel="apple-touch-icon" href="/oryxos/icons/apple-touch-icon.png">
    <link rel="stylesheet" href="/oryxos/assets/site.css">
    <script type="module" src="/oryxos/assets/app.js"></script>
  </head>
  <body>
    <aside role="note">${draftNotice}</aside>
    <main>
      <h1>${page.title}</h1>
      <section id="details">Details</section>
      <a href="${guideHref}">Guide details</a>
    </main>
  </body>
</html>`;
}

function createNotFoundHtml() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Page not found / 页面未找到</title>
    <meta name="description" content="Recover the requested OryxOS page / 返回 OryxOS 页面。">
    <meta property="og:locale" content="en_US">
    <meta property="og:image" content="/oryxos/social/og-default-en.png">
    <meta property="og:image:alt" content="Bilingual OryxOS recovery card">
    <meta name="twitter:image" content="/oryxos/social/og-default-en.png">
    <meta name="twitter:image:alt" content="Bilingual OryxOS recovery card">
    <link rel="icon" href="/oryxos/icons/favicon.svg">
    <link rel="apple-touch-icon" href="/oryxos/icons/apple-touch-icon.png">
    <link rel="stylesheet" href="/oryxos/assets/site.css">
    <script type="module" src="/oryxos/assets/app.js"></script>
  </head>
  <body>
    <aside>${ENGLISH_DRAFT_NOTICE}</aside>
    <aside>${CHINESE_DRAFT_NOTICE}</aside>
    <main>
      <section aria-label="English recovery">
        <a href="/oryxos/">Home</a>
        <a href="/oryxos/docs/">Documentation</a>
        <a href="/oryxos/community">Community</a>
      </section>
      <section aria-label="中文恢复导航">
        <a href="/oryxos/zh/">首页</a>
        <a href="/oryxos/zh/docs/">文档</a>
        <a href="/oryxos/zh/community">社区</a>
      </section>
    </main>
  </body>
</html>`;
}

function routeToFixtureOutputPath(route) {
  if (route === "/") {
    return "index.html";
  }
  if (route.endsWith("/")) {
    return `${route.slice(1)}index.html`;
  }
  return `${route.slice(1)}.html`;
}

async function writeFixtureFile(outputDirectory, relativePath, contents) {
  const outputPath = path.join(outputDirectory, ...relativePath.split("/"));
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, contents);
}

async function createBuildFixture() {
  const outputDirectory = await mkdtemp(path.join(os.tmpdir(), "oryxos-build-"));
  const pageManifest = createPageManifest();
  const pagesByPageId = new Map();

  for (const page of pageManifest.pages) {
    if (!pagesByPageId.has(page.pageId)) {
      pagesByPageId.set(page.pageId, []);
    }
    pagesByPageId.get(page.pageId).push(page);
  }

  for (const page of pageManifest.pages) {
    const counterpartPage = pagesByPageId
      .get(page.pageId)
      .find((candidate) => candidate.locale !== page.locale);
    await writeFixtureFile(
      outputDirectory,
      routeToFixtureOutputPath(page.route),
      createLocalizedPageHtml(page, counterpartPage),
    );
  }

  await Promise.all([
    writeFixtureFile(outputDirectory, "404.html", createNotFoundHtml()),
    writeFixtureFile(outputDirectory, "docs/index.html", "<html><body id=docs>Docs</body></html>"),
    writeFixtureFile(outputDirectory, "community.html", "<html><body>Community</body></html>"),
    writeFixtureFile(outputDirectory, "zh/docs/index.html", "<html><body id=docs>文档</body></html>"),
    writeFixtureFile(outputDirectory, "zh/community.html", "<html><body>社区</body></html>"),
    writeFixtureFile(outputDirectory, "icons/favicon.svg", "<svg xmlns=\"http://www.w3.org/2000/svg\"></svg>"),
    writeFixtureFile(outputDirectory, "icons/apple-touch-icon.png", "fixture-touch-icon"),
    writeFixtureFile(outputDirectory, "social/og-default-en.png", "fixture-social-en"),
    writeFixtureFile(outputDirectory, "social/og-default-zh.png", "fixture-social-zh"),
    writeFixtureFile(
      outputDirectory,
      "assets/site.css",
      "body { background-image: url('../icons/favicon.svg'); }",
    ),
    writeFixtureFile(outputDirectory, "assets/app.js", "import './chunk.js';"),
    writeFixtureFile(outputDirectory, "assets/chunk.js", "export const ready = true;"),
  ]);

  return { outputDirectory, pageManifest };
}

async function mutateFixtureFile(outputDirectory, relativePath, transform) {
  const outputPath = path.join(outputDirectory, ...relativePath.split("/"));
  const originalContents = await readFile(outputPath, "utf8");
  await writeFile(outputPath, transform(originalContents));
}

async function verifyFixture(fixture) {
  return verifyBuildOutput({
    outputDirectory: fixture.outputDirectory,
    pageManifest: fixture.pageManifest,
    prototypeContent: PROTOTYPE_CONTENT,
    base: "/oryxos/",
  });
}

function includesError(errors, expectedText) {
  return errors.some((error) => error.includes(expectedText));
}

async function withBuildFixture(assertions) {
  const fixture = await createBuildFixture();
  try {
    await assertions(fixture);
  } finally {
    await rm(fixture.outputDirectory, { recursive: true, force: true });
  }
}

test("accepts localized routes, metadata, assets, notices, and internal graph", async () => {
  await withBuildFixture(async (fixture) => {
    assert.deepEqual(await verifyFixture(fixture), []);
  });
});

test("requires the localized draft notice on every generated Page", async () => {
  await withBuildFixture(async (fixture) => {
    await mutateFixtureFile(fixture.outputDirectory, "zh/guide.html", (html) =>
      html.replace(CHINESE_DRAFT_NOTICE, "Notice omitted"),
    );

    const errors = await verifyFixture(fixture);
    assert.equal(includesError(errors, "missing its SSR-rendered localized draft notice"), true);
  });
});

test("requires unique per-locale titles and descriptions", async () => {
  await withBuildFixture(async (fixture) => {
    await mutateFixtureFile(fixture.outputDirectory, "guide.html", (html) =>
      html
        .replace("<title>Prototype Guide</title>", "<title>OryxOS Home</title>")
        .replace("English guide description.", "English home description."),
    );

    const errors = await verifyFixture(fixture);
    assert.equal(includesError(errors, "duplicates the localized title"), true);
    assert.equal(includesError(errors, "duplicates the localized description"), true);
  });
});

test("requires the correct html language and Open Graph locale", async () => {
  await withBuildFixture(async (fixture) => {
    await mutateFixtureFile(fixture.outputDirectory, "zh/guide.html", (html) =>
      html.replace('lang="zh-Hans"', 'lang="en"').replace('content="zh_CN"', 'content="en_US"'),
    );

    const errors = await verifyFixture(fixture);
    assert.equal(includesError(errors, "must render <html lang=\"zh-Hans\">"), true);
    assert.equal(includesError(errors, "must set og:locale to zh_CN"), true);
  });
});

test("requires relative locale-counterpart metadata", async () => {
  await withBuildFixture(async (fixture) => {
    await mutateFixtureFile(fixture.outputDirectory, "guide.html", (html) =>
      html.replace('href="/oryxos/zh/guide"', 'href="https://example.invalid/oryxos/zh/guide"'),
    );

    const errors = await verifyFixture(fixture);
    assert.equal(includesError(errors, "must include a relative alternate link"), true);
    assert.equal(includesError(errors, "must not use a public absolute origin"), true);
  });
});

test("requires localized Open Graph and Twitter image alt text", async () => {
  await withBuildFixture(async (fixture) => {
    await mutateFixtureFile(fixture.outputDirectory, "zh/guide.html", (html) =>
      html.replaceAll(
        "guide 的中文 OryxOS 社交卡片",
        "English OryxOS social card for guide",
      ),
    );

    const errors = await verifyFixture(fixture);
    assert.equal(includesError(errors, "must localize og:image:alt"), true);
    assert.equal(includesError(errors, "must localize twitter:image:alt"), true);
  });
});

test("rejects resources that bypass the project base", async () => {
  await withBuildFixture(async (fixture) => {
    await mutateFixtureFile(fixture.outputDirectory, "guide.html", (html) =>
      html.replace("/oryxos/assets/site.css", "/assets/site.css"),
    );

    const errors = await verifyFixture(fixture);
    assert.equal(includesError(errors, "bypasses the required /oryxos/ project base"), true);
  });
});

test("enforces the bilingual 404 exception and recovery links", async () => {
  await withBuildFixture(async (fixture) => {
    await mutateFixtureFile(fixture.outputDirectory, "404.html", (html) =>
      html
        .replace(CHINESE_DRAFT_NOTICE, "Chinese notice omitted")
        .replace('<a href="/oryxos/zh/community">社区</a>', ""),
    );

    const errors = await verifyFixture(fixture);
    assert.equal(includesError(errors, "must SSR-render the zh prototype draft notice"), true);
    assert.equal(includesError(errors, "missing the SSR recovery link /oryxos/zh/community"), true);
  });
});

test("requires favicon, touch, and social files to exist", async () => {
  await withBuildFixture(async (fixture) => {
    await unlink(path.join(fixture.outputDirectory, "icons", "apple-touch-icon.png"));

    const errors = await verifyFixture(fixture);
    assert.equal(includesError(errors, "apple-touch-icon.png"), true);
    assert.equal(includesError(errors, "missing build output"), true);
  });
});

test("rejects missing internal routes and fragments", async () => {
  await withBuildFixture(async (fixture) => {
    await mutateFixtureFile(fixture.outputDirectory, "index.html", (html) =>
      html.replace("/oryxos/guide#details", "/oryxos/missing#details"),
    );
    await mutateFixtureFile(fixture.outputDirectory, "zh/index.html", (html) =>
      html.replace("/oryxos/zh/guide#details", "/oryxos/zh/guide#missing-fragment"),
    );

    const errors = await verifyFixture(fixture);
    assert.equal(includesError(errors, "resolves to missing build output /oryxos/missing"), true);
    assert.equal(includesError(errors, "targets missing fragment #missing-fragment"), true);
  });
});
