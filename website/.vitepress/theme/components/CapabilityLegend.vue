<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";

import prototypeContent from "../../../data/prototype-content.json";

const { lang } = useData();
const isChinese = computed(() => lang.value.toLowerCase().startsWith("zh"));
const legendItems = prototypeContent.capabilityLegend;
</script>

<template>
  <section class="capability-legend" aria-labelledby="capability-legend-title">
    <div class="section-heading section-heading--compact">
      <span class="section-heading__index">LEGEND / 04</span>
      <div>
        <h2 id="capability-legend-title">
          {{ isChinese ? "未来证据的状态图例" : "A legend for future evidence" }}
        </h2>
        <p>
          {{
            isChinese
              ? "仅用于评审信息视觉层级；本雏形未给任何真实能力分配状态。"
              : "For reviewing visual hierarchy only; no real capability receives a state in this prototype."
          }}
        </p>
      </div>
    </div>

    <div class="capability-legend__grid">
      <article
        v-for="legendItem in legendItems"
        :key="legendItem.state"
        class="capability-legend__item"
        :data-state="legendItem.state"
      >
        <span class="capability-legend__shape" aria-hidden="true"></span>
        <h3>{{ isChinese ? legendItem.chineseLabel : legendItem.englishLabel }}</h3>
        <p>{{ isChinese ? legendItem.chineseDescription : legendItem.englishDescription }}</p>
      </article>
    </div>
  </section>
</template>
