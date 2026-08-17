<script setup lang="ts">
import { computed } from "vue";
import { useData, withBase } from "vitepress";

import pageManifest from "../../../data/pages.json";

interface PageRecord {
  pageId: string;
  locale: "root" | "zh";
  route: string;
  sourcePath: string;
}

const { page } = useData();
const pageRecords = pageManifest.pages as PageRecord[];

const currentPage = computed(() =>
  pageRecords.find((pageRecord) => pageRecord.sourcePath === page.value.relativePath)
);

const targetLocale = computed<"root" | "zh">(() =>
  currentPage.value?.locale === "zh" ? "root" : "zh"
);

const targetPage = computed(() => {
  if (!currentPage.value) {
    return undefined;
  }

  const counterpart = pageRecords.find(
    (pageRecord) =>
      pageRecord.pageId === currentPage.value?.pageId && pageRecord.locale === targetLocale.value
  );

  if (counterpart) {
    return counterpart;
  }

  return pageRecords.find(
    (pageRecord) =>
      pageRecord.pageId === "translation-unavailable" &&
      pageRecord.locale === targetLocale.value
  );
});

const targetLabel = computed(() => (targetLocale.value === "zh" ? "中文" : "English"));
const accessibleLabel = computed(() =>
  targetLocale.value === "zh" ? "切换到简体中文" : "Switch to English"
);
const targetHref = computed(() => (targetPage.value ? withBase(targetPage.value.route) : undefined));
</script>

<template>
  <a
    v-if="targetHref"
    class="locale-switcher"
    :href="targetHref"
    :aria-label="accessibleLabel"
    data-testid="locale-switcher"
  >
    <span aria-hidden="true">EN / 中</span>
    <strong>{{ targetLabel }}</strong>
  </a>
</template>
