<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";

const { lang } = useData();
const isChinese = computed(() => lang.value.toLowerCase().startsWith("zh"));
</script>

<template>
  <div class="limitations-placeholder" role="note">
    <span aria-hidden="true">!</span>
    <p>
      {{
        isChinese
          ? "限制信息占位：正式发布前仍需依据源码、测试和发布证据完成核验。"
          : "Limitations placeholder: source, test, and release evidence still require verification before publication."
      }}
    </p>
  </div>
</template>
