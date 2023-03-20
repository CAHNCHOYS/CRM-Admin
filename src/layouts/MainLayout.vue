<template>
  <v-layout>
    <TheSidebarMenu @close-menu="isSidebarOpened = false" :is-opened="isSidebarOpened" />

    <v-app-bar
      color="blue-grey-darken-4"
      :height="65"
      :elevation="0"
    >
      <v-app-bar-nav-icon @click="isSidebarOpened = !isSidebarOpened" />
      <v-spacer></v-spacer>
      <v-btn>GitHub</v-btn>
    </v-app-bar>

    <v-main class="main">
      <div class="page pa-5">
        <slot></slot>
      </div>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import TheSidebarMenu from "@/components/TheSidebarMenu.vue";
import { ref } from "vue";

const isSidebarOpened = ref(true);
</script>

<style scoped>
/* .main {
  background-color: #f7f8fc;
} */
</style>
