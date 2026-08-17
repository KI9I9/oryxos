<script setup lang="ts">
import { withBase } from "vitepress";
</script>

<template>
  <main class="not-found-experience">
    <aside class="prototype-notice prototype-notice--bilingual" data-testid="draft-notice" role="note">
      <span class="prototype-notice__marker" aria-hidden="true">DRAFT / 00</span>
      <div>
        <p lang="en">Draft visual prototype — content is provisional and not public documentation.</p>
        <p lang="zh-Hans">视觉原型草案 — 内容为暂定信息，并非公开项目文档。</p>
      </div>
    </aside>
    <div class="not-found-experience__code" aria-hidden="true">404 / LOST NODE</div>
    <div class="not-found-experience__heading">
      <p>ROUTE RECOVERY / 路由恢复</p>
      <h1>Signal not found.<br />未找到页面信号。</h1>
      <p>The requested prototype route is unavailable. Choose a recovery path below.</p>
      <p>请求的雏形页面不可用，请从下方选择恢复入口。</p>
    </div>
    <div class="not-found-experience__routes">
      <nav aria-labelledby="english-recovery-title">
        <h2 id="english-recovery-title">English recovery</h2>
        <a :href="withBase('/')">Home <span aria-hidden="true">↗</span></a>
        <a :href="withBase('/docs/')">Documentation <span aria-hidden="true">↗</span></a>
        <a :href="withBase('/community')">Community <span aria-hidden="true">↗</span></a>
      </nav>
      <nav aria-labelledby="chinese-recovery-title" lang="zh-Hans">
        <h2 id="chinese-recovery-title">中文恢复入口</h2>
        <a :href="withBase('/zh/')">首页 <span aria-hidden="true">↗</span></a>
        <a :href="withBase('/zh/docs/')">文档 <span aria-hidden="true">↗</span></a>
        <a :href="withBase('/zh/community')">社区 <span aria-hidden="true">↗</span></a>
      </nav>
    </div>
  </main>
</template>
