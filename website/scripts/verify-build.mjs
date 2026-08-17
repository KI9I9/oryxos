import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_PROJECT_BASE = "/oryxos/";
const ENGLISH_DRAFT_NOTICE =
  "Draft visual prototype — content is provisional and not public documentation.";

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

function normalizeBase(base) {
  if (typeof base !== "string" || base.trim() === "") {
    return DEFAULT_PROJECT_BASE;
  }

  return `/${base.trim()}`.replace(/\/{2,}/g, "/").replace(/\/?$/, "/");
}

function normalizeLogicalRoute(route) {
  if (typeof route !== "string" || route.trim() === "") {
    return null;
  }

  let normalizedRoute = `/${route.trim()}`.replace(/\/{2,}/g, "/");
  normalizedRoute = normalizedRoute.split(/[?#]/, 1)[0];
  if (normalizedRoute !== "/" && normalizedRoute.endsWith("/")) {
    return normalizedRoute;
  }
  if (normalizedRoute.endsWith(".html")) {
    normalizedRoute = normalizedRoute.slice(0, -5);
  }

  return normalizedRoute || "/";
}

function routeToProjectPath(route, base) {
  const normalizedRoute = normalizeLogicalRoute(route);
  if (!normalizedRoute || normalizedRoute === "/") {
    return base;
  }

  return `${base}${normalizedRoute.slice(1)}`.replace(/\/{2,}/g, "/");
}

function routeToOutputCandidates(outputDirectory, route) {
  const normalizedRoute = normalizeLogicalRoute(route);
  if (!normalizedRoute || normalizedRoute === "/") {
    return [path.join(outputDirectory, "index.html")];
  }

  const routeWithoutLeadingSlash = normalizedRoute.slice(1);
  if (normalizedRoute.endsWith("/")) {
    return [path.join(outputDirectory, routeWithoutLeadingSlash, "index.html")];
  }

  return [
    path.join(outputDirectory, `${routeWithoutLeadingSlash}.html`),
    path.join(outputDirectory, routeWithoutLeadingSlash, "index.html"),
  ];
}

function decodeHtmlEntities(value) {
  return String(value)
    .replace(/&#(\d+);/g, (_, codePoint) => String.fromCodePoint(Number(codePoint)))
    .replace(/&#x([0-9a-f]+);/gi, (_, codePoint) =>
      String.fromCodePoint(Number.parseInt(codePoint, 16)),
    )
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

function parseAttributes(attributeSource) {
  const attributes = {};
  const attributePattern =
    /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let attributeMatch;

  while ((attributeMatch = attributePattern.exec(attributeSource)) !== null) {
    const attributeName = attributeMatch[1].toLowerCase();
    const attributeValue =
      attributeMatch[2] ?? attributeMatch[3] ?? attributeMatch[4] ?? "";
    attributes[attributeName] = decodeHtmlEntities(attributeValue);
  }

  return attributes;
}

function extractTags(html, tagName) {
  const tags = [];
  const tagPattern = new RegExp(`<${tagName}\\b([^>]*)>`, "gi");
  let tagMatch;

  while ((tagMatch = tagPattern.exec(html)) !== null) {
    tags.push(parseAttributes(tagMatch[1]));
  }

  return tags;
}

function collectSourceSetReferences(attributes) {
  if (typeof attributes.srcset !== "string") {
    return [];
  }

  return attributes.srcset
    .split(",")
    .map((candidate) => candidate.trim().split(/\s+/, 1)[0])
    .filter(Boolean);
}

export function parseHtmlDocument(html, label = "document.html") {
  const htmlTag = extractTags(html, "html")[0] ?? {};
  const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const metaTags = extractTags(html, "meta");
  const linkTags = extractTags(html, "link");
  const anchorTags = extractTags(html, "a");
  const resourceReferences = [];

  for (const linkTag of linkTags) {
    const relationTokens = (linkTag.rel ?? "").toLowerCase().split(/\s+/).filter(Boolean);
    if (
      relationTokens.some((relation) =>
        [
          "stylesheet",
          "icon",
          "apple-touch-icon",
          "preload",
          "modulepreload",
          "manifest",
        ].includes(relation),
      ) &&
      linkTag.href
    ) {
      resourceReferences.push({
        value: linkTag.href,
        kind: `link rel=${linkTag.rel}`,
      });
    }
  }

  for (const scriptTag of extractTags(html, "script")) {
    if (scriptTag.src) {
      resourceReferences.push({ value: scriptTag.src, kind: "script src" });
    }
  }

  for (const imageTag of extractTags(html, "img")) {
    if (imageTag.src) {
      resourceReferences.push({ value: imageTag.src, kind: "image src" });
    }
    for (const sourceSetReference of collectSourceSetReferences(imageTag)) {
      resourceReferences.push({ value: sourceSetReference, kind: "image srcset" });
    }
  }

  for (const sourceTag of extractTags(html, "source")) {
    if (sourceTag.src) {
      resourceReferences.push({ value: sourceTag.src, kind: "source src" });
    }
    for (const sourceSetReference of collectSourceSetReferences(sourceTag)) {
      resourceReferences.push({ value: sourceSetReference, kind: "source srcset" });
    }
  }

  for (const videoTag of extractTags(html, "video")) {
    if (videoTag.poster) {
      resourceReferences.push({ value: videoTag.poster, kind: "video poster" });
    }
  }

  const elementIds = new Set();
  const allOpeningTagsPattern = /<[a-z][a-z0-9:-]*\b([^>]*)>/gi;
  let openingTagMatch;
  while ((openingTagMatch = allOpeningTagsPattern.exec(html)) !== null) {
    const attributes = parseAttributes(openingTagMatch[1]);
    if (attributes.id) {
      elementIds.add(attributes.id);
    }
  }
  for (const anchorTag of anchorTags) {
    if (anchorTag.name) {
      elementIds.add(anchorTag.name);
    }
  }

  const visibleText = decodeHtmlEntities(
    html
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<template\b[\s\S]*?<\/template>/gi, " ")
      .replace(/<!--([\s\S]*?)-->/g, " ")
      .replace(/<[^>]+>/g, " "),
  ).replace(/\s+/g, " ").trim();

  return {
    label,
    lang: htmlTag.lang ?? "",
    title: decodeHtmlEntities(titleMatch?.[1] ?? "").replace(/\s+/g, " ").trim(),
    metaTags,
    linkTags,
    anchorTags,
    resourceReferences,
    elementIds,
    visibleText,
  };
}

function getMetaContent(document, attributeName, expectedValue) {
  const normalizedExpectedValue = expectedValue.toLowerCase();
  const matchingTag = document.metaTags.find(
    (metaTag) =>
      String(metaTag[attributeName] ?? "").toLowerCase() === normalizedExpectedValue,
  );
  return matchingTag?.content?.trim() ?? "";
}

function getLinkTagsByRelation(document, relation) {
  const normalizedRelation = relation.toLowerCase();
  return document.linkTags.filter((linkTag) =>
    String(linkTag.rel ?? "")
      .toLowerCase()
      .split(/\s+/)
      .includes(normalizedRelation),
  );
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

export function resolveDraftNotices(prototypeContent) {
  const strings = flattenStringValues(prototypeContent);
  const englishNotice =
    strings.find(({ value }) => value.trim() === ENGLISH_DRAFT_NOTICE)?.value ?? null;
  const chineseNotice =
    strings.find(({ path: valuePath, value }) => {
      const pathSuggestsChinese = /(?:^|\.)(?:zh|zh-hans|chinese)(?:\.|$)/i.test(
        valuePath,
      );
      return (
        pathSuggestsChinese &&
        /(?:草案|原型)/.test(value) &&
        /(?:临时|暂定|暂未定稿)/.test(value) &&
        /(?:非公开|不是公开|并非公开)/.test(value)
      );
    })?.value ?? null;

  return { root: englishNotice, zh: chineseNotice };
}

async function discoverFiles(directory) {
  const discoveredFiles = [];
  let directoryEntries;

  try {
    directoryEntries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    throw new Error(`Cannot read build output directory ${directory}: ${error.message}`);
  }

  for (const directoryEntry of directoryEntries) {
    const entryPath = path.join(directory, directoryEntry.name);
    if (directoryEntry.isDirectory()) {
      discoveredFiles.push(...(await discoverFiles(entryPath)));
    } else if (directoryEntry.isFile()) {
      discoveredFiles.push(entryPath);
    }
  }

  return discoveredFiles;
}

function findExistingOutputCandidate(outputFileSet, candidates) {
  return candidates.find((candidate) => outputFileSet.has(path.resolve(candidate))) ?? null;
}

function projectPathToOutputCandidates(outputDirectory, projectPath, base) {
  if (!projectPath.startsWith(base)) {
    return [];
  }

  let relativeProjectPath;
  try {
    relativeProjectPath = decodeURIComponent(projectPath.slice(base.length));
  } catch {
    return [];
  }
  relativeProjectPath = relativeProjectPath.replace(/^\/+/, "");

  if (relativeProjectPath === "") {
    return [path.join(outputDirectory, "index.html")];
  }

  if (path.posix.extname(relativeProjectPath)) {
    return [path.join(outputDirectory, ...relativeProjectPath.split("/"))];
  }

  if (projectPath.endsWith("/")) {
    return [path.join(outputDirectory, ...relativeProjectPath.split("/"), "index.html")];
  }

  return [
    path.join(outputDirectory, ...relativeProjectPath.split("/")) + ".html",
    path.join(outputDirectory, ...relativeProjectPath.split("/"), "index.html"),
  ];
}

function classifyReference(reference) {
  const trimmedReference = reference.trim();
  if (trimmedReference === "") {
    return "empty";
  }
  if (/^(?:mailto|tel|javascript):/i.test(trimmedReference)) {
    return "non-http";
  }
  if (/^data:/i.test(trimmedReference)) {
    return "data";
  }
  if (/^(?:https?:)?\/\//i.test(trimmedReference)) {
    return "external";
  }
  return "project";
}

function safelyDecodeFragment(hash) {
  if (!hash) {
    return "";
  }

  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return hash.slice(1);
  }
}

function resolveProjectReference(reference, sourceProjectPath, base) {
  let parsedUrl;
  try {
    parsedUrl = new URL(reference, `https://prototype.invalid${sourceProjectPath}`);
  } catch (error) {
    return { error: `is not a valid URL (${error.message})` };
  }
  if (!parsedUrl.pathname.startsWith(base)) {
    return {
      error: `bypasses the required ${base} project base (resolved path: ${parsedUrl.pathname})`,
    };
  }

  return {
    projectPath: parsedUrl.pathname,
    fragment: safelyDecodeFragment(parsedUrl.hash),
  };
}

function describePage(page) {
  return `${page.pageId ?? "unknown"}/${page.locale ?? "unknown"}`;
}

function validateRequiredMetadata({
  page,
  document,
  counterpartPage,
  draftNotices,
  base,
}) {
  const errors = [];
  const pageLabel = describePage(page);
  const expectedLanguage = page.locale === "zh" ? "zh-Hans" : "en";
  const expectedOpenGraphLocale = page.locale === "zh" ? "zh_CN" : "en_US";

  if (document.lang !== expectedLanguage) {
    errors.push(
      `${pageLabel} must render <html lang="${expectedLanguage}">; found ${JSON.stringify(document.lang)}.`,
    );
  }
  if (!document.title) {
    errors.push(`${pageLabel} is missing a document title.`);
  } else if (
    typeof page.title === "string" &&
    !document.title.toLocaleLowerCase().includes(page.title.trim().toLocaleLowerCase())
  ) {
    errors.push(
      `${pageLabel} title must include its localized manifest title ${JSON.stringify(page.title)}; found ${JSON.stringify(document.title)}.`,
    );
  }

  const description = getMetaContent(document, "name", "description");
  if (!description) {
    errors.push(`${pageLabel} is missing meta[name="description"].`);
  } else if (
    typeof page.description === "string" &&
    description !== page.description.trim()
  ) {
    errors.push(`${pageLabel} description does not match its localized manifest description.`);
  }

  const openGraphLocale = getMetaContent(document, "property", "og:locale");
  if (openGraphLocale !== expectedOpenGraphLocale) {
    errors.push(
      `${pageLabel} must set og:locale to ${expectedOpenGraphLocale}; found ${JSON.stringify(openGraphLocale)}.`,
    );
  }

  const expectedDraftNotice = draftNotices[page.locale];
  if (!expectedDraftNotice) {
    errors.push(`No localized draft notice could be resolved for locale ${page.locale}.`);
  } else if (!document.visibleText.includes(expectedDraftNotice)) {
    errors.push(`${pageLabel} is missing its SSR-rendered localized draft notice.`);
  }

  const alternateLinks = getLinkTagsByRelation(document, "alternate");
  if (counterpartPage) {
    const expectedCounterpartLanguage = counterpartPage.locale === "zh" ? "zh-Hans" : "en";
    const expectedCounterpartPath = routeToProjectPath(counterpartPage.route, base);
    const matchingAlternateLink = alternateLinks.find(
      (linkTag) =>
        linkTag.hreflang === expectedCounterpartLanguage &&
        linkTag.href === expectedCounterpartPath,
    );

    if (!matchingAlternateLink) {
      errors.push(
        `${pageLabel} must include a relative alternate link to ${expectedCounterpartPath} with hreflang=${expectedCounterpartLanguage}.`,
      );
    }
  }

  for (const alternateLink of alternateLinks) {
    if (/^https?:\/\//i.test(alternateLink.href ?? "")) {
      errors.push(`${pageLabel} counterpart metadata must not use a public absolute origin.`);
    }
  }

  const canonicalLinks = getLinkTagsByRelation(document, "canonical");
  if (canonicalLinks.length > 0) {
    errors.push(
      `${pageLabel} must not emit canonical metadata before a public origin is approved.`,
    );
  }

  for (const deferredUrlProperty of ["og:url", "twitter:url"] ) {
    if (getMetaContent(document, "property", deferredUrlProperty) || getMetaContent(document, "name", deferredUrlProperty)) {
      errors.push(
        `${pageLabel} must not emit ${deferredUrlProperty} before a public origin is approved.`,
      );
    }
  }

  const openGraphImage = getMetaContent(document, "property", "og:image");
  const twitterImage = getMetaContent(document, "name", "twitter:image");
  const openGraphImageAlt = getMetaContent(document, "property", "og:image:alt");
  const twitterImageAlt = getMetaContent(document, "name", "twitter:image:alt");

  if (!openGraphImage) {
    errors.push(`${pageLabel} is missing og:image metadata.`);
  }
  if (!twitterImage) {
    errors.push(`${pageLabel} is missing twitter:image metadata.`);
  }
  if (!openGraphImageAlt) {
    errors.push(`${pageLabel} is missing localized og:image:alt metadata.`);
  }
  if (!twitterImageAlt) {
    errors.push(`${pageLabel} is missing localized twitter:image:alt metadata.`);
  }
  for (const [metadataName, metadataValue] of [
    ["og:image", openGraphImage],
    ["twitter:image", twitterImage],
  ]) {
    if (metadataValue && !metadataValue.startsWith(base)) {
      errors.push(`${pageLabel} ${metadataName} must resolve through ${base}; found ${metadataValue}.`);
    }
    if (/^https?:\/\//i.test(metadataValue)) {
      errors.push(`${pageLabel} ${metadataName} must be relative to the local prototype origin.`);
    }
  }

  const iconLinks = getLinkTagsByRelation(document, "icon");
  const appleTouchLinks = getLinkTagsByRelation(document, "apple-touch-icon");
  if (iconLinks.length === 0) {
    errors.push(`${pageLabel} is missing a favicon link.`);
  }
  if (appleTouchLinks.length === 0) {
    errors.push(`${pageLabel} is missing an Apple Touch icon link.`);
  }
  for (const iconLink of [...iconLinks, ...appleTouchLinks]) {
    if (!String(iconLink.href ?? "").startsWith(base)) {
      errors.push(`${pageLabel} icon asset must resolve through ${base}; found ${iconLink.href}.`);
    }
  }

  return {
    errors,
    description,
    openGraphImageAlt,
    twitterImageAlt,
  };
}

function validateMetadataUniqueness(pageResults) {
  const errors = [];

  for (const locale of ["root", "zh"]) {
    const titles = new Map();
    const descriptions = new Map();
    const localizedResults = pageResults.filter((result) => result.page.locale === locale);

    for (const result of localizedResults) {
      const normalizedTitle = result.document.title.toLocaleLowerCase();
      const normalizedDescription = result.description.toLocaleLowerCase();
      if (normalizedTitle) {
        if (titles.has(normalizedTitle)) {
          errors.push(
            `${describePage(result.page)} duplicates the localized title used by ${titles.get(normalizedTitle)}.`,
          );
        } else {
          titles.set(normalizedTitle, describePage(result.page));
        }
      }
      if (normalizedDescription) {
        if (descriptions.has(normalizedDescription)) {
          errors.push(
            `${describePage(result.page)} duplicates the localized description used by ${descriptions.get(normalizedDescription)}.`,
          );
        } else {
          descriptions.set(normalizedDescription, describePage(result.page));
        }
      }
    }
  }

  const resultsByPageId = new Map();
  for (const result of pageResults) {
    if (!resultsByPageId.has(result.page.pageId)) {
      resultsByPageId.set(result.page.pageId, []);
    }
    resultsByPageId.get(result.page.pageId).push(result);
  }

  for (const [pageId, localizedResults] of resultsByPageId.entries()) {
    const rootResult = localizedResults.find((result) => result.page.locale === "root");
    const chineseResult = localizedResults.find((result) => result.page.locale === "zh");
    if (!rootResult || !chineseResult) {
      continue;
    }

    if (
      rootResult.openGraphImageAlt.toLocaleLowerCase() ===
      chineseResult.openGraphImageAlt.toLocaleLowerCase()
    ) {
      errors.push(`${pageId} must localize og:image:alt across its locale counterparts.`);
    }
    if (
      rootResult.twitterImageAlt.toLocaleLowerCase() ===
      chineseResult.twitterImageAlt.toLocaleLowerCase()
    ) {
      errors.push(`${pageId} must localize twitter:image:alt across its locale counterparts.`);
    }
  }

  return errors;
}

function validateNotFoundDocument(document, options) {
  const { draftNotices, base, pageResults } = options;
  const errors = [];
  const description = getMetaContent(document, "name", "description");

  if (document.lang !== "en") {
    errors.push(`404.html must use <html lang="en">; found ${JSON.stringify(document.lang)}.`);
  }
  if (!document.title || !/[A-Za-z]/.test(document.title) || !/[\u3400-\u9fff]/.test(document.title)) {
    errors.push("404.html must have a unique bilingual English/Chinese title.");
  }
  if (!description || !/[A-Za-z]/.test(description) || !/[\u3400-\u9fff]/.test(description)) {
    errors.push("404.html must have a bilingual English/Chinese meta description.");
  }
  if (pageResults.some((result) => result.document.title === document.title)) {
    errors.push("404.html title must be unique among generated routes.");
  }
  if (pageResults.some((result) => result.description === description)) {
    errors.push("404.html description must be unique among generated routes.");
  }
  if (getLinkTagsByRelation(document, "alternate").length > 0) {
    errors.push("404.html is a bilingual site artifact and must not emit locale counterpart links.");
  }

  for (const locale of ["root", "zh"]) {
    const draftNotice = draftNotices[locale];
    if (!draftNotice || !document.visibleText.includes(draftNotice)) {
      errors.push(`404.html must SSR-render the ${locale} prototype draft notice.`);
    }
  }

  const recoveryRoutes = [
    "/",
    "/docs/",
    "/community",
    "/zh/",
    "/zh/docs/",
    "/zh/community",
  ];
  const recoveryLinks = new Set(document.anchorTags.map((anchorTag) => anchorTag.href));
  for (const recoveryRoute of recoveryRoutes) {
    const requiredHref = routeToProjectPath(recoveryRoute, base);
    if (!recoveryLinks.has(requiredHref)) {
      errors.push(`404.html is missing the SSR recovery link ${requiredHref}.`);
    }
  }

  const syntheticPage = {
    pageId: "not-found",
    locale: "root",
    title: document.title,
    description,
  };
  const metadataResult = validateRequiredMetadata({
    page: syntheticPage,
    document,
    counterpartPage: null,
    draftNotices: { root: draftNotices.root },
    base,
  });
  errors.push(
    ...metadataResult.errors.filter(
      (error) =>
        !error.includes("manifest title") &&
        !error.includes("localized manifest description") &&
        !error.includes("SSR-rendered localized draft notice"),
    ),
  );

  return errors;
}

function validateReferenceTarget({
  reference,
  sourceLabel,
  sourceProjectPath,
  outputDirectory,
  outputFileSet,
  parsedDocumentsByPath,
  base,
  requireLocalResource,
}) {
  const referenceType = classifyReference(reference);
  if (["empty", "non-http", "data"].includes(referenceType)) {
    return [];
  }
  if (referenceType === "external") {
    return requireLocalResource
      ? [`${sourceLabel} references a remote resource ${reference}; generated resources must be local.`]
      : [];
  }

  const resolvedReference = resolveProjectReference(reference, sourceProjectPath, base);
  if (resolvedReference.error) {
    return [`${sourceLabel} reference ${reference} ${resolvedReference.error}.`];
  }

  const outputCandidates = projectPathToOutputCandidates(
    outputDirectory,
    resolvedReference.projectPath,
    base,
  );
  const targetPath = findExistingOutputCandidate(outputFileSet, outputCandidates);
  if (!targetPath) {
    return [
      `${sourceLabel} reference ${reference} resolves to missing build output ${resolvedReference.projectPath}.`,
    ];
  }

  if (resolvedReference.fragment) {
    const targetDocument = parsedDocumentsByPath.get(path.resolve(targetPath));
    if (!targetDocument) {
      return [
        `${sourceLabel} reference ${reference} uses a fragment on a non-HTML output.`,
      ];
    }
    if (!targetDocument.elementIds.has(resolvedReference.fragment)) {
      return [
        `${sourceLabel} reference ${reference} targets missing fragment #${resolvedReference.fragment}.`,
      ];
    }
  }

  return [];
}

function extractCssReferences(cssSource) {
  const references = [];
  const urlPattern = /url\(\s*(?:"([^"]+)"|'([^']+)'|([^)'"\s]+))\s*\)/gi;
  const importPattern = /@import\s+(?:url\(\s*)?["']([^"']+)["']/gi;
  let match;

  while ((match = urlPattern.exec(cssSource)) !== null) {
    references.push(match[1] ?? match[2] ?? match[3]);
  }
  while ((match = importPattern.exec(cssSource)) !== null) {
    references.push(match[1]);
  }

  return references;
}

function extractJavaScriptReferences(javaScriptSource) {
  const references = [];
  const importPattern =
    /(?:\bfrom\s*|\bimport\s*\(|\bimport\s*)["']([^"']+\.(?:m?js|css|json|wasm))(?:\?[^"']*)?["']/g;
  let importMatch;

  while ((importMatch = importPattern.exec(javaScriptSource)) !== null) {
    references.push(importMatch[1]);
  }

  return references;
}

function outputPathToProjectPath(outputPath, outputDirectory, base) {
  const relativePath = path.relative(outputDirectory, outputPath).split(path.sep).join("/");
  return `${base}${relativePath}`.replace(/\/{2,}/g, "/");
}

async function validateGeneratedDependencyGraph(options) {
  const {
    outputFiles,
    outputDirectory,
    outputFileSet,
    parsedDocumentsByPath,
    base,
  } = options;
  const errors = [];

  for (const outputPath of outputFiles) {
    const extension = path.extname(outputPath).toLowerCase();
    if (![".css", ".js", ".mjs"].includes(extension)) {
      continue;
    }

    let source;
    try {
      source = await readFile(outputPath, "utf8");
    } catch (error) {
      errors.push(`Cannot read generated dependency ${outputPath}: ${error.message}`);
      continue;
    }

    const references =
      extension === ".css" ? extractCssReferences(source) : extractJavaScriptReferences(source);
    const sourceProjectPath = outputPathToProjectPath(outputPath, outputDirectory, base);

    for (const reference of references) {
      errors.push(
        ...validateReferenceTarget({
          reference,
          sourceLabel: path.relative(outputDirectory, outputPath),
          sourceProjectPath,
          outputDirectory,
          outputFileSet,
          parsedDocumentsByPath,
          base,
          requireLocalResource: true,
        }),
      );
    }
  }

  return errors;
}

export async function verifyBuildOutput(options) {
  const outputDirectory = path.resolve(options.outputDirectory);
  const base = normalizeBase(options.base ?? DEFAULT_PROJECT_BASE);
  const pages = getPageRecords(options.pageManifest);
  const draftNotices = options.draftNotices ?? resolveDraftNotices(options.prototypeContent);
  const errors = [];

  if (!pages) {
    return ["Page manifest must be an array or an object with a pages array."];
  }

  let outputFiles;
  try {
    outputFiles = await discoverFiles(outputDirectory);
  } catch (error) {
    return [error.message];
  }
  const outputFileSet = new Set(outputFiles.map((outputPath) => path.resolve(outputPath)));
  const htmlFiles = outputFiles.filter((outputPath) => outputPath.endsWith(".html"));
  const parsedDocumentsByPath = new Map();

  await Promise.all(
    htmlFiles.map(async (htmlPath) => {
      try {
        const html = await readFile(htmlPath, "utf8");
        parsedDocumentsByPath.set(
          path.resolve(htmlPath),
          parseHtmlDocument(html, path.relative(outputDirectory, htmlPath)),
        );
      } catch (error) {
        errors.push(`Cannot read generated HTML ${htmlPath}: ${error.message}`);
      }
    }),
  );

  const pageResults = [];
  const pagesByPageId = new Map();
  for (const page of pages) {
    if (isPlainObject(page) && typeof page.pageId === "string") {
      if (!pagesByPageId.has(page.pageId)) {
        pagesByPageId.set(page.pageId, []);
      }
      pagesByPageId.get(page.pageId).push(page);
    }
  }

  for (const page of pages) {
    if (!isPlainObject(page) || typeof page.route !== "string") {
      errors.push("Page manifest contains a record without a valid route.");
      continue;
    }

    const outputPath = findExistingOutputCandidate(
      outputFileSet,
      routeToOutputCandidates(outputDirectory, page.route),
    );
    if (!outputPath) {
      errors.push(
        `${describePage(page)} is missing its generated output for route ${page.route}.`,
      );
      continue;
    }

    const document = parsedDocumentsByPath.get(path.resolve(outputPath));
    if (!document) {
      errors.push(`${describePage(page)} output ${outputPath} is not readable HTML.`);
      continue;
    }

    const counterpartPage = (pagesByPageId.get(page.pageId) ?? []).find(
      (candidate) => candidate.locale !== page.locale,
    );
    const metadataResult = validateRequiredMetadata({
      page,
      document,
      counterpartPage,
      draftNotices,
      base,
    });
    errors.push(...metadataResult.errors);
    pageResults.push({
      page,
      document,
      outputPath,
      description: metadataResult.description,
      openGraphImageAlt: metadataResult.openGraphImageAlt,
      twitterImageAlt: metadataResult.twitterImageAlt,
    });
  }

  errors.push(...validateMetadataUniqueness(pageResults));

  const notFoundPath = path.join(outputDirectory, "404.html");
  const notFoundDocument = parsedDocumentsByPath.get(path.resolve(notFoundPath));
  if (!notFoundDocument) {
    errors.push(`Build output is missing the required bilingual ${notFoundPath}.`);
  } else {
    errors.push(
      ...validateNotFoundDocument(notFoundDocument, {
        draftNotices,
        base,
        pageResults,
      }),
    );
  }

  const graphDocuments = [
    ...pageResults.map((result) => ({
      document: result.document,
      projectPath: routeToProjectPath(result.page.route, base),
      label: describePage(result.page),
    })),
  ];
  if (notFoundDocument) {
    graphDocuments.push({
      document: notFoundDocument,
      projectPath: `${base}404.html`,
      label: "404.html",
    });
  }

  for (const graphDocument of graphDocuments) {
    for (const anchorTag of graphDocument.document.anchorTags) {
      if (!anchorTag.href) {
        continue;
      }
      errors.push(
        ...validateReferenceTarget({
          reference: anchorTag.href,
          sourceLabel: graphDocument.label,
          sourceProjectPath: graphDocument.projectPath,
          outputDirectory,
          outputFileSet,
          parsedDocumentsByPath,
          base,
          requireLocalResource: false,
        }),
      );
    }

    for (const resourceReference of graphDocument.document.resourceReferences) {
      errors.push(
        ...validateReferenceTarget({
          reference: resourceReference.value,
          sourceLabel: `${graphDocument.label} ${resourceReference.kind}`,
          sourceProjectPath: graphDocument.projectPath,
          outputDirectory,
          outputFileSet,
          parsedDocumentsByPath,
          base,
          requireLocalResource: true,
        }),
      );
    }

    for (const socialMetadata of [
      getMetaContent(graphDocument.document, "property", "og:image"),
      getMetaContent(graphDocument.document, "name", "twitter:image"),
    ]) {
      if (!socialMetadata) {
        continue;
      }
      errors.push(
        ...validateReferenceTarget({
          reference: socialMetadata,
          sourceLabel: `${graphDocument.label} social metadata`,
          sourceProjectPath: graphDocument.projectPath,
          outputDirectory,
          outputFileSet,
          parsedDocumentsByPath,
          base,
          requireLocalResource: true,
        }),
      );
    }
  }

  errors.push(
    ...(await validateGeneratedDependencyGraph({
      outputFiles,
      outputDirectory,
      outputFileSet,
      parsedDocumentsByPath,
      base,
    })),
  );

  return errors;
}

async function readJsonFile(filePath, label) {
  try {
    return { value: JSON.parse(await readFile(filePath, "utf8")), errors: [] };
  } catch (error) {
    const explanation =
      error.code === "ENOENT"
        ? `${label} is missing at ${filePath}. Build verification requires the intended repository-owned data file.`
        : `Cannot read ${label} at ${filePath}: ${error.message}`;
    return { value: null, errors: [explanation] };
  }
}

export async function verifyBuildProject(websiteRoot) {
  const outputDirectory = path.join(websiteRoot, ".vitepress", "dist");
  const pageManifestPath = path.join(websiteRoot, "data", "pages.json");
  const prototypeContentPath = path.join(websiteRoot, "data", "prototype-content.json");
  const [pageManifestResult, prototypeContentResult] = await Promise.all([
    readJsonFile(pageManifestPath, "Page manifest"),
    readJsonFile(prototypeContentPath, "Prototype content data"),
  ]);
  const errors = [...pageManifestResult.errors, ...prototypeContentResult.errors];

  if (pageManifestResult.value === null || prototypeContentResult.value === null) {
    return errors;
  }

  errors.push(
    ...(await verifyBuildOutput({
      outputDirectory,
      pageManifest: pageManifestResult.value,
      prototypeContent: prototypeContentResult.value,
      base: DEFAULT_PROJECT_BASE,
    })),
  );
  return errors;
}

async function runCommandLine() {
  const websiteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const errors = await verifyBuildProject(websiteRoot);

  if (errors.length > 0) {
    console.error("Generated website validation failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("Generated website validation passed.");
}

const invokedScriptPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (invokedScriptPath === fileURLToPath(import.meta.url)) {
  await runCommandLine();
}
