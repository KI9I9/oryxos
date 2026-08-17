<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";

import externalLinks from "../../../data/external-links.json";

const { lang } = useData();
const isChinese = computed(() => lang.value.toLowerCase().startsWith("zh"));
const repositoryUrl =
  externalLinks.links.find((externalLink) => externalLink.key === "github-repository")?.url ??
  "https://github.com/KI9I9/oryxos";
</script>

<template>
  <section class="community-links" aria-labelledby="community-links-title">
    <div class="community-links__intro">
      <p>OPEN SOURCE / LOCAL PROTOTYPE</p>
      <h2 id="community-links-title">
        {{ isChinese ? "从代码与讨论开始了解项目" : "Start with the code and the conversation" }}
      </h2>
      <p>
        {{
          isChinese
            ? "社区页面目前只提供清晰、安全的外部入口，不包含账号、表单、分析脚本或远程内容。"
            : "This page currently offers clear, safe external routes without accounts, forms, analytics, or remote content."
        }}
      </p>
    </div>

    <div class="community-links__cards">
      <a :href="repositoryUrl" rel="noopener noreferrer" target="_blank">
        <span>01 / SOURCE</span>
        <h3>{{ isChinese ? "查看 GitHub 仓库" : "Inspect the GitHub repository" }}</h3>
        <p>
          {{ isChinese ? "阅读源码、Issue 与贡献上下文。" : "Read the source, issues, and contribution context." }}
        </p>
        <strong>{{ isChinese ? "打开外部链接" : "Open external link" }} ↗</strong>
      </a>
      <article>
        <span>02 / GOVERNANCE</span>
        <h3>{{ isChinese ? "先核验，再发布" : "Verify before publishing" }}</h3>
        <p>
          {{
            isChinese
              ? "公开能力说明将在后续 Feature 中与源码、测试、发布和权威文档对齐。"
              : "Public capability copy will be aligned with source, tests, releases, and authoritative documents in a later Feature."
          }}
        </p>
      </article>
      <article>
        <span>03 / ASPIRATION</span>
        <h3>{{ isChinese ? "开放治理仍是长期愿景" : "Open governance remains an aspiration" }}</h3>
        <p>
          {{
            isChinese
              ? "任何基金会或 ASF 相关表达仅可作为未来愿景，不表示当前隶属关系。"
              : "Any foundation or ASF language is future-looking and does not imply current affiliation."
          }}
        </p>
      </article>
    </div>
  </section>
</template>
