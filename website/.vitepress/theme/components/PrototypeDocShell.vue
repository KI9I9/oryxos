<script setup lang="ts">
defineProps<{
  eyebrow: string;
  summary: string;
}>();
</script>

<template>
  <section class="prototype-doc-shell">
    <p class="prototype-doc-shell__eyebrow">{{ eyebrow }}</p>
    <p class="prototype-doc-shell__summary">{{ summary }}</p>
    <slot />
  </section>
</template>
