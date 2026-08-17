import type { DefaultTheme } from "vitepress";

import externalLinksJson from "../../data/external-links.json";
import { localeUiLabels } from "./locales";
import {
  CHINESE_LOCALE_ID,
  getPageRecord,
  ROOT_LOCALE_ID,
  withSiteBase,
  type LocaleId
} from "./shared";

interface ExternalLinkRecord {
  key: string;
  url: string;
  rootLabel: string;
  zhLabel: string;
  approved: boolean;
  external: boolean;
  openInNewTab: boolean;
  rel: string;
}

interface ExternalLinksManifest {
  schemaVersion: number;
  links: ExternalLinkRecord[];
}

interface LocalizedNavigationLabels {
  architecture: string;
  roadmap: string;
  documentation: string;
  community: string;
  concepts: string;
  project: string;
  gettingStarted: string;
  runtime: string;
  interfaces: string;
  contributing: string;
  whatIsOryxos: string;
  whyJava: string;
  designPrinciples: string;
  projectStatus: string;
  buildFromSource: string;
  provider: string;
  reactLoop: string;
  tool: string;
  memory: string;
  skillProfile: string;
  cli: string;
  restApi: string;
}

const externalLinksManifest = externalLinksJson as ExternalLinksManifest;

const navigationLabels: Record<LocaleId, LocalizedNavigationLabels> = {
  root: {
    architecture: "Architecture",
    roadmap: "Roadmap",
    documentation: "Documentation",
    community: "Community",
    concepts: "Concepts",
    project: "Project",
    gettingStarted: "Getting Started",
    runtime: "Runtime",
    interfaces: "Interfaces",
    contributing: "Contributing",
    whatIsOryxos: "What Is OryxOS?",
    whyJava: "Why Java?",
    designPrinciples: "Design Principles",
    projectStatus: "Project Status",
    buildFromSource: "Build from Source",
    provider: "Provider",
    reactLoop: "ReAct Loop",
    tool: "Tool",
    memory: "Memory",
    skillProfile: "Skill and Profile",
    cli: "CLI",
    restApi: "REST API"
  },
  zh: {
    architecture: "架构",
    roadmap: "路线图",
    documentation: "文档",
    community: "社区",
    concepts: "核心概念",
    project: "项目",
    gettingStarted: "开始使用",
    runtime: "运行时",
    interfaces: "接口",
    contributing: "参与贡献",
    whatIsOryxos: "什么是 OryxOS？",
    whyJava: "为什么选择 Java？",
    designPrinciples: "设计原则",
    projectStatus: "项目状态",
    buildFromSource: "从源码构建",
    provider: "Provider",
    reactLoop: "ReAct 循环",
    tool: "Tool",
    memory: "Memory",
    skillProfile: "Skill 与 Profile",
    cli: "CLI",
    restApi: "REST API"
  }
};

function getApprovedExternalLink(linkKey: string): ExternalLinkRecord {
  const externalLink = externalLinksManifest.links.find(
    (link) => link.key === linkKey && link.approved
  );

  if (!externalLink) {
    throw new Error(
      `Missing approved external link '${linkKey}' in website/data/external-links.json.`
    );
  }

  return externalLink;
}

function getLocalizedExternalLabel(
  externalLink: ExternalLinkRecord,
  localeId: LocaleId
): string {
  return localeId === CHINESE_LOCALE_ID
    ? externalLink.zhLabel
    : externalLink.rootLabel;
}

export function createPrimaryNavigation(
  localeId: LocaleId
): DefaultTheme.NavItem[] {
  const labels = navigationLabels[localeId];
  const repositoryLink = getApprovedExternalLink("github-repository");

  return [
    {
      text: labels.architecture,
      link: getPageRecord("architecture", localeId).route
    },
    {
      text: labels.roadmap,
      link: getPageRecord("roadmap", localeId).route
    },
    {
      text: labels.documentation,
      link: getPageRecord("docs-index", localeId).route,
      activeMatch:
        localeId === CHINESE_LOCALE_ID ? "^/zh/docs/" : "^/docs/"
    },
    {
      text: labels.community,
      link: getPageRecord("community", localeId).route
    },
    {
      text: getLocalizedExternalLabel(repositoryLink, localeId),
      link: repositoryLink.url,
      target: repositoryLink.openInNewTab ? "_blank" : undefined,
      rel: repositoryLink.rel
    }
  ];
}

export function createDocumentationSidebar(
  localeId: LocaleId
): DefaultTheme.Sidebar {
  const labels = navigationLabels[localeId];
  const documentationPrefix =
    localeId === CHINESE_LOCALE_ID ? "/zh/docs/" : "/docs/";

  return {
    [documentationPrefix]: [
      {
        text: labels.concepts,
        items: [
          {
            text: labels.whatIsOryxos,
            link: getPageRecord("docs-what-is-oryxos", localeId).route
          },
          {
            text: labels.whyJava,
            link: getPageRecord("docs-why-java", localeId).route
          },
          {
            text: labels.designPrinciples,
            link: getPageRecord("docs-design-principles", localeId).route
          }
        ]
      },
      {
        text: labels.project,
        items: [
          {
            text: labels.projectStatus,
            link: getPageRecord("docs-project-status", localeId).route
          }
        ]
      },
      {
        text: labels.gettingStarted,
        items: [
          {
            text: labels.buildFromSource,
            link: getPageRecord("docs-build-from-source", localeId).route
          }
        ]
      },
      {
        text: labels.runtime,
        items: [
          {
            text: labels.provider,
            link: getPageRecord("docs-provider", localeId).route
          },
          {
            text: labels.reactLoop,
            link: getPageRecord("docs-react-loop", localeId).route
          },
          {
            text: labels.tool,
            link: getPageRecord("docs-tool", localeId).route
          },
          {
            text: labels.memory,
            link: getPageRecord("docs-memory", localeId).route
          },
          {
            text: labels.skillProfile,
            link: getPageRecord("docs-skill-profile", localeId).route
          }
        ]
      },
      {
        text: labels.interfaces,
        items: [
          {
            text: labels.cli,
            link: getPageRecord("docs-cli", localeId).route
          },
          {
            text: labels.restApi,
            link: getPageRecord("docs-rest-api", localeId).route
          }
        ]
      },
      {
        text: labels.contributing,
        items: [
          {
            text: labels.contributing,
            link: getPageRecord("docs-contributing", localeId).route
          }
        ]
      }
    ]
  };
}

export function createLocaleThemeConfig(
  localeId: LocaleId
): DefaultTheme.Config {
  const labels = localeUiLabels[localeId];
  const repositoryLink = getApprovedExternalLink("github-repository");

  return {
    logo: {
      src: "/brand/logo-mark.svg",
      alt: "OryxOS"
    },
    logoLink: withSiteBase(getPageRecord("home", localeId).route),
    siteTitle: "OryxOS",
    nav: createPrimaryNavigation(localeId),
    sidebar: createDocumentationSidebar(localeId),
    outline: {
      level: [2, 3],
      label: labels.outline
    },
    docFooter: {
      prev: labels.previousPage,
      next: labels.nextPage
    },
    socialLinks: [
      {
        icon: "github",
        link: repositoryLink.url,
        ariaLabel: getLocalizedExternalLabel(repositoryLink, localeId)
      }
    ],
    footer: {
      message: labels.footerMessage,
      copyright: labels.footerCopyright
    },
    sidebarMenuLabel: labels.menu,
    returnToTopLabel: labels.returnToTop,
    langMenuLabel: labels.languageMenu,
    skipToContentLabel: labels.skipToContent,
    externalLinkIcon: true,
    i18nRouting: false,
    notFound: {
      title: labels.notFoundTitle,
      quote: labels.notFoundQuote,
      linkLabel: labels.notFoundHomeLabel,
      linkText: labels.notFoundHomeText
    }
  };
}

export const rootThemeConfig = createLocaleThemeConfig(ROOT_LOCALE_ID);
