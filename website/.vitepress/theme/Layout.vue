<script setup lang="ts">
import DefaultTheme from "vitepress/theme";

import DraftNotice from "./components/DraftNotice.vue";
import LocaleSwitcher from "./components/LocaleSwitcher.vue";
import NotFoundExperience from "./components/NotFoundExperience.vue";

const DefaultLayout = DefaultTheme.Layout;
</script>

<template>
  <DefaultLayout>
    <template #nav-bar-content-after>
      <LocaleSwitcher />
    </template>

    <template #home-hero-before>
      <div class="prototype-home-notice">
        <DraftNotice />
      </div>
    </template>

    <template #doc-before>
      <DraftNotice />
    </template>

    <template #not-found>
      <NotFoundExperience />
    </template>
  </DefaultLayout>
</template>
