<script setup lang="ts">
defineProps<{
  items: Array<{
    eyebrow: string;
    title: string;
    description: string;
  }>;
}>();
</script>

<template>
  <div class="topic-grid">
    <article v-for="item in items" :key="item.title">
      <span>{{ item.eyebrow }}</span>
      <h3>{{ item.title }}</h3>
      <p>{{ item.description }}</p>
    </article>
  </div>
</template>
