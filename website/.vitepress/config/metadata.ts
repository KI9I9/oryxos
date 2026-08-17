import type { HeadConfig, PageData } from "vitepress";

import prototypeContentJson from "../../data/prototype-content.json";
import {
  CHINESE_LOCALE_ID,
  findPageRecordBySourcePath,
  getLocaleRecord,
  getLocaleSwitchPage,
  pageManifest,
  ROOT_LOCALE_ID,
  withSiteBase,
  type LocaleId,
  type PageRecord
} from "./shared";

interface LocalizedSocialImageAlt {
  root: string;
  zh: string;
}

interface PrototypeContentMetadata {
  socialImageAlts: Record<string, LocalizedSocialImageAlt>;
}

interface ResolvedPageMetadata {
  title: string;
  description: string;
  languageTag: string;
  socialLocale: string;
  alternateSocialLocale: string;
  socialImagePath: string;
  socialImageAlt: string;
  pageRecord?: PageRecord;
  isSiteRecoveryArtifact: boolean;
}

const prototypeContent = prototypeContentJson as PrototypeContentMetadata;

const socialImagePaths: Record<string, string> = {
  "social-default-en": "/social/og-default-en.png",
  "social-default-zh": "/social/og-default-zh.png"
};

export const globalHead: HeadConfig[] = [
  ["meta", { name: "color-scheme", content: "light" }],
  ["meta", { name: "theme-color", content: "#f7f8fa" }],
  [
    "link",
    {
      rel: "icon",
      type: "image/svg+xml",
      href: withSiteBase("/icons/favicon.svg")
    }
  ],
  [
    "link",
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: withSiteBase("/icons/favicon-32x32.png")
    }
  ],
  [
    "link",
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: withSiteBase("/icons/favicon-16x16.png")
    }
  ],
  [
    "link",
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: withSiteBase("/icons/apple-touch-icon.png")
    }
  ]
];

function getSocialImagePath(assetId: string): string {
  const socialImagePath = socialImagePaths[assetId];

  if (!socialImagePath) {
    throw new Error(
      `Missing social image path for asset '${assetId}' in metadata configuration.`
    );
  }

  return withSiteBase(socialImagePath);
}

function getSocialImageAlt(assetId: string, localeId: LocaleId): string {
  const localizedAlt = prototypeContent.socialImageAlts[assetId];

  if (!localizedAlt) {
    throw new Error(
      `Missing localized social image alt for asset '${assetId}' in website/data/prototype-content.json.`
    );
  }

  return localizedAlt[localeId];
}

function resolveMetadata(pageData: PageData): ResolvedPageMetadata | undefined {
  const siteRecoveryArtifact = pageManifest.siteRecoveryArtifact;
  const isSiteRecoveryArtifact =
    pageData.isNotFound === true ||
    pageData.relativePath === siteRecoveryArtifact.sourcePath;

  if (isSiteRecoveryArtifact) {
    return {
      title: siteRecoveryArtifact.title,
      description: siteRecoveryArtifact.description,
      languageTag: siteRecoveryArtifact.documentLanguage,
      socialLocale: getLocaleRecord(ROOT_LOCALE_ID).socialLocale,
      alternateSocialLocale: getLocaleRecord(CHINESE_LOCALE_ID).socialLocale,
      socialImagePath: getSocialImagePath(siteRecoveryArtifact.ogImage),
      socialImageAlt: siteRecoveryArtifact.ogImageAlt,
      isSiteRecoveryArtifact: true
    };
  }

  const pageRecord = findPageRecordBySourcePath(pageData.relativePath);

  if (!pageRecord) {
    return undefined;
  }

  const activeLocale = getLocaleRecord(pageRecord.locale);
  const alternateLocaleId =
    pageRecord.locale === ROOT_LOCALE_ID
      ? CHINESE_LOCALE_ID
      : ROOT_LOCALE_ID;
  const alternateLocale = getLocaleRecord(alternateLocaleId);

  return {
    title: pageRecord.title,
    description: pageRecord.description,
    languageTag: activeLocale.languageTag,
    socialLocale: activeLocale.socialLocale,
    alternateSocialLocale: alternateLocale.socialLocale,
    socialImagePath: getSocialImagePath(pageRecord.ogImage),
    socialImageAlt: getSocialImageAlt(pageRecord.ogImage, pageRecord.locale),
    pageRecord,
    isSiteRecoveryArtifact: false
  };
}

export function createPageDataPatch(
  pageData: PageData
): Partial<PageData> | undefined {
  const metadata = resolveMetadata(pageData);

  if (!metadata) {
    return undefined;
  }

  if (metadata.isSiteRecoveryArtifact) {
    return {
      title: metadata.title,
      description: metadata.description,
      frontmatter: {
        ...pageData.frontmatter,
        pageId: pageManifest.siteRecoveryArtifact.artifactId,
        locale: "site",
        lang: metadata.languageTag,
        contentStatus: "prototype",
        isSiteRecoveryArtifact: true
      }
    };
  }

  const pageRecord = metadata.pageRecord;

  if (!pageRecord) {
    return undefined;
  }

  return {
    title: metadata.title,
    description: metadata.description,
    frontmatter: {
      ...pageData.frontmatter,
      pageId: pageRecord.pageId,
      locale: pageRecord.locale,
      lang: metadata.languageTag,
      contentStatus: pageRecord.contentStatus,
      templateId: pageRecord.templateId,
      draftNoticeKey: pageRecord.draftNoticeKey
    }
  };
}

function createAlternateHead(pageRecord: PageRecord): HeadConfig[] {
  const rootAlternate = getLocaleSwitchPage(pageRecord, ROOT_LOCALE_ID);
  const chineseAlternate = getLocaleSwitchPage(pageRecord, CHINESE_LOCALE_ID);

  return [
    [
      "link",
      {
        rel: "alternate",
        hreflang: getLocaleRecord(ROOT_LOCALE_ID).languageTag,
        href: withSiteBase(rootAlternate.route)
      }
    ],
    [
      "link",
      {
        rel: "alternate",
        hreflang: getLocaleRecord(CHINESE_LOCALE_ID).languageTag,
        href: withSiteBase(chineseAlternate.route)
      }
    ],
    [
      "link",
      {
        rel: "alternate",
        hreflang: "x-default",
        href: withSiteBase(rootAlternate.route)
      }
    ]
  ];
}

function createSocialHead(metadata: ResolvedPageMetadata): HeadConfig[] {
  return [
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "OryxOS" }],
    ["meta", { property: "og:title", content: metadata.title }],
    [
      "meta",
      { property: "og:description", content: metadata.description }
    ],
    ["meta", { property: "og:locale", content: metadata.socialLocale }],
    [
      "meta",
      {
        property: "og:locale:alternate",
        content: metadata.alternateSocialLocale
      }
    ],
    ["meta", { property: "og:image", content: metadata.socialImagePath }],
    ["meta", { property: "og:image:type", content: "image/png" }],
    ["meta", { property: "og:image:width", content: "1200" }],
    ["meta", { property: "og:image:height", content: "630" }],
    [
      "meta",
      { property: "og:image:alt", content: metadata.socialImageAlt }
    ],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:title", content: metadata.title }],
    [
      "meta",
      { name: "twitter:description", content: metadata.description }
    ],
    ["meta", { name: "twitter:image", content: metadata.socialImagePath }],
    [
      "meta",
      { name: "twitter:image:alt", content: metadata.socialImageAlt }
    ]
  ];
}

export function createPageHead(pageData: PageData): HeadConfig[] {
  const metadata = resolveMetadata(pageData);

  if (!metadata) {
    return [];
  }

  const localizedHead = createSocialHead(metadata);

  if (metadata.isSiteRecoveryArtifact || !metadata.pageRecord) {
    return localizedHead;
  }

  return [...createAlternateHead(metadata.pageRecord), ...localizedHead];
}
