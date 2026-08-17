import type { DefaultTheme, UserConfig } from "vitepress";

import {
  CHINESE_LOCALE_ID,
  getLocaleRecord,
  getPageRecord,
  ROOT_LOCALE_ID,
  type LocaleId
} from "./shared";

export interface LocaleUiLabels {
  languageMenu: string;
  menu: string;
  outline: string;
  previousPage: string;
  nextPage: string;
  returnToTop: string;
  skipToContent: string;
  notFoundTitle: string;
  notFoundQuote: string;
  notFoundHomeLabel: string;
  notFoundHomeText: string;
  footerMessage: string;
  footerCopyright: string;
}

export const localeUiLabels: Record<LocaleId, LocaleUiLabels> = {
  root: {
    languageMenu: "Change language",
    menu: "Menu",
    outline: "On this page",
    previousPage: "Previous page",
    nextPage: "Next page",
    returnToTop: "Return to top",
    skipToContent: "Skip to content",
    notFoundTitle: "Page not found / 页面未找到",
    notFoundQuote:
      "Choose an English or Simplified Chinese recovery path below. / 请从英文或简体中文恢复路径中选择。",
    notFoundHomeLabel: "Go to the English home page",
    notFoundHomeText: "English home",
    footerMessage:
      "Draft visual prototype — content is provisional and not public documentation.",
    footerCopyright: "OryxOS is licensed under Apache License 2.0."
  },
  zh: {
    languageMenu: "切换语言",
    menu: "菜单",
    outline: "本页目录",
    previousPage: "上一页",
    nextPage: "下一页",
    returnToTop: "返回顶部",
    skipToContent: "跳到正文",
    notFoundTitle: "页面未找到 / Page not found",
    notFoundQuote:
      "请从简体中文或英文恢复路径中选择。 / Choose a Simplified Chinese or English recovery path.",
    notFoundHomeLabel: "前往简体中文首页",
    notFoundHomeText: "简体中文首页",
    footerMessage: "视觉原型草案 — 内容为临时内容，并非公开文档。",
    footerCopyright: "OryxOS 采用 Apache License 2.0 许可证。"
  }
};

const rootLocale = getLocaleRecord(ROOT_LOCALE_ID);
const chineseLocale = getLocaleRecord(CHINESE_LOCALE_ID);

export const siteLocales = {
  root: {
    label: rootLocale.label,
    lang: rootLocale.languageTag,
    link: getPageRecord("home", ROOT_LOCALE_ID).route,
    title: "OryxOS",
    titleTemplate: false,
    description: rootLocale.defaultDescription
  },
  zh: {
    label: chineseLocale.label,
    lang: chineseLocale.languageTag,
    link: getPageRecord("home", CHINESE_LOCALE_ID).route,
    title: "OryxOS",
    titleTemplate: false,
    description: chineseLocale.defaultDescription
  }
} satisfies NonNullable<UserConfig<DefaultTheme.Config>["locales"]>;
