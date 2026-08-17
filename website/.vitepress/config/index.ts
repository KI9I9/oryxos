import { defineConfigWithTheme, type DefaultTheme } from "vitepress";

import { siteLocales } from "./locales";
import { createPageDataPatch, createPageHead, globalHead } from "./metadata";
import { createLocaleThemeConfig, rootThemeConfig } from "./navigation";
import {
  CHINESE_LOCALE_ID,
  ROOT_LOCALE_ID,
  SITE_BASE,
  sharedSiteConfig
} from "./shared";

const staticNotFoundRecovery = `
<noscript>
  <main class="not-found-experience">
    <aside class="prototype-notice prototype-notice--bilingual" role="note">
      <span class="prototype-notice__marker" aria-hidden="true">DRAFT / 00</span>
      <div>
        <p lang="en">Draft visual prototype — content is provisional and not public documentation.</p>
        <p lang="zh-Hans">视觉原型草案 — 内容为暂定信息，并非公开项目文档。</p>
      </div>
    </aside>
    <div class="not-found-experience__code" aria-hidden="true">404 / LOST NODE</div>
    <div class="not-found-experience__heading">
      <p>ROUTE RECOVERY / 路由恢复</p>
      <h1>Signal not found.<br>未找到页面信号。</h1>
      <p>The requested prototype route is unavailable. Choose a recovery path below.</p>
      <p lang="zh-Hans">请求的雏形页面不可用，请从下方选择恢复入口。</p>
    </div>
    <div class="not-found-experience__routes">
      <nav aria-labelledby="static-english-recovery-title">
        <h2 id="static-english-recovery-title">English recovery</h2>
        <a href="${SITE_BASE}">Home <span aria-hidden="true">↗</span></a>
        <a href="${SITE_BASE}docs/">Documentation <span aria-hidden="true">↗</span></a>
        <a href="${SITE_BASE}community">Community <span aria-hidden="true">↗</span></a>
      </nav>
      <nav aria-labelledby="static-chinese-recovery-title" lang="zh-Hans">
        <h2 id="static-chinese-recovery-title">中文恢复入口</h2>
        <a href="${SITE_BASE}zh/">首页 <span aria-hidden="true">↗</span></a>
        <a href="${SITE_BASE}zh/docs/">文档 <span aria-hidden="true">↗</span></a>
        <a href="${SITE_BASE}zh/community">社区 <span aria-hidden="true">↗</span></a>
      </nav>
    </div>
  </main>
</noscript>`;

export default defineConfigWithTheme<DefaultTheme.Config>({
  ...sharedSiteConfig,
  head: globalHead,
  locales: {
    root: {
      ...siteLocales.root,
      themeConfig: rootThemeConfig
    },
    zh: {
      ...siteLocales.zh,
      themeConfig: createLocaleThemeConfig(CHINESE_LOCALE_ID)
    }
  },
  themeConfig: createLocaleThemeConfig(ROOT_LOCALE_ID),
  transformPageData: createPageDataPatch,
  transformHead: ({ pageData }) => createPageHead(pageData),
  transformHtml(html, outputFilePath) {
    if (!outputFilePath.endsWith("404.html")) {
      return html;
    }

    return html.replace('<div id="app"></div>', `${staticNotFoundRecovery}\n    <div id="app"></div>`);
  }
});
