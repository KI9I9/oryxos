import type { DefaultTheme, UserConfig } from "vitepress";

import pagesManifestJson from "../../data/pages.json";

export const SITE_BASE = "/oryxos/" as const;
export const ROOT_LOCALE_ID = "root" as const;
export const CHINESE_LOCALE_ID = "zh" as const;

export type LocaleId = typeof ROOT_LOCALE_ID | typeof CHINESE_LOCALE_ID;
export type PageKind = "core" | "documentation" | "fallback";
export type ContentStatus = "prototype" | "reviewed";

export interface LocaleRecord {
  id: LocaleId;
  languageTag: "en" | "zh-Hans";
  socialLocale: "en_US" | "zh_CN";
  routePrefix: "/" | "/zh/";
  label: string;
  defaultTitle: string;
  defaultDescription: string;
  fallbackPageId: string;
  defaultOgImage: string;
}

export interface PageRecord {
  pageId: string;
  locale: LocaleId;
  kind: PageKind;
  topicGroup: string;
  route: string;
  sourcePath: string;
  title: string;
  description: string;
  counterpartPageId: string | null;
  required: boolean;
  contentStatus: ContentStatus;
  templateId: string | null;
  draftNoticeKey: string;
  localeSwitchFallbackPageId?: string;
  primaryActionKeys: string[];
  requiredSectionKeys: string[];
  capabilityLegendStateKeys: string[];
  roadmapVisualStageKeys: string[];
  requiresLimitationsPlaceholder: boolean;
  navigationVisibility: string[];
  ogImage: string;
}

export interface PrototypePageTemplate {
  templateId: string;
  noticeKey: string;
  sectionKeys: string[];
  allowsRunnableExamples: boolean;
  allowsAvailabilityClaims: boolean;
}

export interface SiteRecoveryArtifact {
  artifactId: "not-found";
  sourcePath: string;
  outputPath: "/404.html";
  documentLanguage: "en";
  title: string;
  description: string;
  englishRecoveryRoutes: string[];
  chineseRecoveryRoutes: string[];
  clientLocaleEnhancement: boolean;
  ogImage: string;
  ogImageAlt: string;
}

export interface PageManifest {
  schemaVersion: number;
  locales: LocaleRecord[];
  templates: PrototypePageTemplate[];
  pages: PageRecord[];
  siteRecoveryArtifact: SiteRecoveryArtifact;
}

export const pageManifest = pagesManifestJson as PageManifest;

function requireRecord<RecordType>(
  record: RecordType | undefined,
  description: string
): RecordType {
  if (!record) {
    throw new Error(`Missing ${description} in website/data/pages.json.`);
  }

  return record;
}

export function getLocaleRecord(localeId: LocaleId): LocaleRecord {
  return requireRecord(
    pageManifest.locales.find((locale) => locale.id === localeId),
    `locale '${localeId}'`
  );
}

export function getPageRecord(
  pageId: string,
  localeId: LocaleId
): PageRecord {
  return requireRecord(
    pageManifest.pages.find(
      (page) => page.pageId === pageId && page.locale === localeId
    ),
    `page '${pageId}' for locale '${localeId}'`
  );
}

export function findPageRecordBySourcePath(
  sourcePath: string
): PageRecord | undefined {
  const normalizedSourcePath = normalizeSourcePath(sourcePath);

  return pageManifest.pages.find(
    (page) => normalizeSourcePath(page.sourcePath) === normalizedSourcePath
  );
}

export function findPageRecordByRoute(route: string): PageRecord | undefined {
  const normalizedRoute = normalizeLogicalRoute(route);

  return pageManifest.pages.find(
    (page) => normalizeLogicalRoute(page.route) === normalizedRoute
  );
}

export function getLocaleSwitchPage(
  currentPage: PageRecord,
  targetLocaleId: LocaleId
): PageRecord {
  if (currentPage.locale === targetLocaleId) {
    return currentPage;
  }

  if (currentPage.counterpartPageId) {
    const counterpartPage = pageManifest.pages.find(
      (page) =>
        page.pageId === currentPage.counterpartPageId &&
        page.locale === targetLocaleId
    );

    if (counterpartPage) {
      return counterpartPage;
    }
  }

  const targetLocale = getLocaleRecord(targetLocaleId);
  const fallbackPageId =
    currentPage.localeSwitchFallbackPageId ?? targetLocale.fallbackPageId;

  return getPageRecord(fallbackPageId, targetLocaleId);
}

export function resolveLocaleSwitchRoute(
  currentRoute: string,
  targetLocaleId: LocaleId
): string {
  const currentPage = findPageRecordByRoute(currentRoute);

  if (!currentPage) {
    return getPageRecord(
      getLocaleRecord(targetLocaleId).fallbackPageId,
      targetLocaleId
    ).route;
  }

  return getLocaleSwitchPage(currentPage, targetLocaleId).route;
}

export function resolveLocaleSwitchHref(
  currentRoute: string,
  targetLocaleId: LocaleId
): string {
  return withSiteBase(resolveLocaleSwitchRoute(currentRoute, targetLocaleId));
}

export function normalizeSourcePath(sourcePath: string): string {
  return sourcePath
    .replaceAll("\\", "/")
    .replace(/^\.\//, "")
    .replace(/^website\//, "");
}

export function normalizeLogicalRoute(route: string): string {
  const routeWithoutOrigin = route.replace(/^https?:\/\/[^/]+/i, "");
  const routeWithoutQueryOrHash = routeWithoutOrigin.split(/[?#]/, 1)[0] ?? "/";
  const routeWithoutBase = removeSiteBase(routeWithoutQueryOrHash);
  const routeWithLeadingSlash = routeWithoutBase.startsWith("/")
    ? routeWithoutBase
    : `/${routeWithoutBase}`;
  const cleanRoute = routeWithLeadingSlash.replace(/\.html$/, "");

  if (cleanRoute === "/index" || cleanRoute === "") {
    return "/";
  }

  if (cleanRoute.endsWith("/index")) {
    return `${cleanRoute.slice(0, -"index".length)}`;
  }

  return cleanRoute;
}

export function removeSiteBase(route: string): string {
  if (route === SITE_BASE.slice(0, -1)) {
    return "/";
  }

  if (route.startsWith(SITE_BASE)) {
    return `/${route.slice(SITE_BASE.length)}`;
  }

  return route;
}

export function withSiteBase(routeOrAssetPath: string): string {
  if (
    /^(?:[a-z]+:)?\/\//i.test(routeOrAssetPath) ||
    routeOrAssetPath.startsWith("#")
  ) {
    return routeOrAssetPath;
  }

  if (routeOrAssetPath === SITE_BASE.slice(0, -1)) {
    return SITE_BASE;
  }

  if (routeOrAssetPath.startsWith(SITE_BASE)) {
    return routeOrAssetPath;
  }

  const rootRelativePath = routeOrAssetPath.startsWith("/")
    ? routeOrAssetPath.slice(1)
    : routeOrAssetPath;

  return `${SITE_BASE}${rootRelativePath}`;
}

const rootLocale = getLocaleRecord(ROOT_LOCALE_ID);

export const sharedSiteConfig = {
  title: "OryxOS",
  titleTemplate: false,
  description: rootLocale.defaultDescription,
  lang: rootLocale.languageTag,
  dir: "ltr",
  base: SITE_BASE,
  cleanUrls: true,
  appearance: false,
  ignoreDeadLinks: false,
  lastUpdated: false,
  useWebFonts: false,
  router: {
    prefetchLinks: true
  }
} satisfies UserConfig<DefaultTheme.Config>;
