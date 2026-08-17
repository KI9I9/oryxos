<script setup lang="ts">
import { computed } from "vue";
import { useData, withBase } from "vitepress";

const props = defineProps<{
  items?: Array<{ label: string; route: string }>;
}>();

const { lang } = useData();
const isChinese = computed(() => lang.value.toLowerCase().startsWith("zh"));
const navigationItems = computed(() => props.items ?? []);
</script>

<template>
  <nav v-if="navigationItems.length" class="related-navigation" aria-labelledby="related-navigation-title">
    <p id="related-navigation-title">
      {{ isChinese ? "继续浏览" : "Continue exploring" }}
    </p>
    <a v-for="item in navigationItems" :key="item.route" :href="withBase(item.route)">
      {{ item.label }}
      <span aria-hidden="true">↗</span>
    </a>
  </nav>
</template>
