<template>
  <VLayout>
    <TheSidebarMenu @close-drawer="isSidebarOpened = false" :is-opened="isSidebarOpened" />

    <VMain class="main">
      <div class="page pa-5">
        <VAppBarNavIcon v-if="smAndDown" @click="isSidebarOpened = !isSidebarOpened" />
        <slot></slot>
      </div>
    </VMain>
  </VLayout>
</template>

<script setup lang="ts">
import TheSidebarMenu from '@/components/TheSidebarMenu.vue';
import { ref } from 'vue';

import { useDisplay } from 'vuetify/lib/framework.mjs';

const { smAndDown } = useDisplay();

const isSidebarOpened = ref(true);
</script>

<style lang="scss" scoped>
.main {
  background-color: whitesmoke;
  background-color: black;
}
</style>
