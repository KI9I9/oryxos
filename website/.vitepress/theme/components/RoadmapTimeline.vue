<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";

import prototypeContent from "../../../data/prototype-content.json";

const { lang } = useData();
const isChinese = computed(() => lang.value.toLowerCase().startsWith("zh"));
const stages = prototypeContent.roadmapVisualStages;
</script>

<template>
  <section class="roadmap-timeline" aria-labelledby="roadmap-timeline-title">
    <div class="roadmap-timeline__heading">
      <p>SEQUENCE / PROVISIONAL</p>
      <h2 id="roadmap-timeline-title">
        {{ isChinese ? "从内核基础到协作研究" : "From kernel foundations to collaboration research" }}
      </h2>
    </div>

    <ol>
      <li v-for="(stage, stageIndex) in stages" :key="stage.key">
        <span class="roadmap-timeline__number">0{{ stageIndex + 1 }}</span>
        <div>
          <p class="roadmap-timeline__label">{{ stage.key.replaceAll("-", " / ") }}</p>
          <h3>{{ isChinese ? stage.zhLabel : stage.rootLabel }}</h3>
          <p>{{ isChinese ? stage.zhDescription : stage.rootDescription }}</p>
        </div>
      </li>
    </ol>

    <p class="roadmap-timeline__boundary">
      {{
        isChinese
          ? "这些阶段是页面展示顺序，不是发布日期、版本承诺或能力状态。"
          : "These stages are a presentation sequence, not release dates, version promises, or capability states."
      }}
    </p>
  </section>
</template>
