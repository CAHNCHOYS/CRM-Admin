<template>
  <v-layout>
    
    <TheSidebarMenu @close-menu="isSidebarOpened = false" :is-opened="isSidebarOpened" />

    <v-main class="main">
      <div class="page pa-5">
        <v-app-bar-nav-icon v-if="smAndDown" @click="isSidebarOpened = !isSidebarOpened" />
        <slot></slot>
      </div>
    </v-main>
  </v-layout>
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

}
</style>
