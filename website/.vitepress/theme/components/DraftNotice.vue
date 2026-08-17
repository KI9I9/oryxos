<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";

const { lang } = useData();
const isChinese = computed(() => lang.value.toLowerCase().startsWith("zh"));
</script>

<template>
  <aside class="prototype-notice" data-testid="draft-notice" role="note">
    <span class="prototype-notice__marker" aria-hidden="true">DRAFT / 00</span>
    <p v-if="isChinese">
      视觉原型草案 — 内容为暂定信息，并非公开项目文档。
    </p>
    <p v-else>
      Draft visual prototype — content is provisional and not public documentation.
    </p>
  </aside>
</template>
