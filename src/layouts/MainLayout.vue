<template>
  <v-layout>
    <TheSidebarMenu @close-menu="isSidebarOpened = false" :is-opened="isSidebarOpened" />

    <v-app-bar color="light-blue-darken-1" :height="smAndDown ? 55 : 65" :elevation="2" style="position: fixed">
      <v-app-bar-nav-icon @click="isSidebarOpened = !isSidebarOpened" />
      <v-spacer></v-spacer>
      <v-btn class="d-inline-flex align-center"
        ><a
          href="https://github.com/CAHNCHOYS/CRM-Admin"
          target="_blank"
          class="text-white pr-2 d-inline-flex"
          >GitHub</a
        >
        <v-icon size="large" icon="mdi-github" />
      </v-btn>
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
import { useDisplay } from "vuetify/lib/framework.mjs";

const isSidebarOpened = ref(true);

const { smAndDown } = useDisplay();
</script>

<style scoped>
/* .main {
  background-color: #f7f8fc;
} */
</style>
