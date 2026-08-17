<script setup lang="ts">
import { computed } from "vue";
import { useData, withBase } from "vitepress";

const { lang } = useData();
const isChinese = computed(() => lang.value.toLowerCase().startsWith("zh"));

const englishTopics = [
  { index: "01", label: "Concepts", summary: "Positioning, Java rationale, and design principles.", route: "/docs/concepts/what-is-oryxos" },
  { index: "02", label: "Project", summary: "Prototype maturity and evidence boundaries.", route: "/docs/project/project-status" },
  { index: "03", label: "Getting started", summary: "A non-runnable source-build page form.", route: "/docs/getting-started/build-from-source" },
  { index: "04", label: "Runtime", summary: "Provider, loop, tool, memory, and Profile topics.", route: "/docs/runtime/provider" },
  { index: "05", label: "Interfaces", summary: "CLI and REST documentation placeholders.", route: "/docs/interfaces/cli" },
  { index: "06", label: "Contributing", summary: "Repository and community navigation.", route: "/docs/contributing" }
];

const chineseTopics = [
  { index: "01", label: "核心概念", summary: "产品定位、Java 选择与设计原则。", route: "/zh/docs/concepts/what-is-oryxos" },
  { index: "02", label: "项目状态", summary: "雏形成熟度与证据边界。", route: "/zh/docs/project/project-status" },
  { index: "03", label: "开始了解", summary: "不可执行的源码构建页面形态。", route: "/zh/docs/getting-started/build-from-source" },
  { index: "04", label: "运行时", summary: "Provider、循环、Tool、Memory 与 Profile 主题。", route: "/zh/docs/runtime/provider" },
  { index: "05", label: "接口", summary: "CLI 与 REST 文档占位结构。", route: "/zh/docs/interfaces/cli" },
  { index: "06", label: "参与贡献", summary: "代码仓库与社区导航。", route: "/zh/docs/contributing" }
];

const topics = computed(() => (isChinese.value ? chineseTopics : englishTopics));
</script>

<template>
  <section class="documentation-landing" aria-labelledby="documentation-landing-title">
    <div class="documentation-landing__heading">
      <p>DOCUMENT MAP / 06</p>
      <h2 id="documentation-landing-title">
        {{ isChinese ? "按系统问题组织文档" : "Documentation organized by system question" }}
      </h2>
      <p>
        {{
          isChinese
            ? "每个主题页都使用相同的雏形章节结构，以便比较中英文信息层级。"
            : "Every topic uses the same prototype section form so English and Chinese hierarchy can be compared."
        }}
      </p>
    </div>
    <div class="documentation-landing__grid">
      <a v-for="topic in topics" :key="topic.index" :href="withBase(topic.route)">
        <span>{{ topic.index }}</span>
        <h3>{{ topic.label }}</h3>
        <p>{{ topic.summary }}</p>
        <strong aria-hidden="true">↗</strong>
      </a>
    </div>
  </section>
</template>
