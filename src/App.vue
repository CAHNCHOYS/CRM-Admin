<template>
  <v-app>
    <v-overlay :model-value="userAuthStore.isUserDataFetching" class="align-center justify-center">
      <v-progress-circular color="indigo" indeterminate size="164" />
    </v-overlay>
    <component :is="getCurrentLayout" v-if="!userAuthStore.isUserDataFetching">
      <router-view v-slot="{ Component }">
        <transition name="slide" mode="out-in">
          <component :is="Component"> </component>
        </transition>
      </router-view>
    </component>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from "vue";

import LoginLayout from "@/layouts/LoginLayout.vue";
import MainLayout from "@/layouts/MainLayout.vue";

import { useRoute } from "vue-router";

import { useUserAuthStore } from "./stores/userAuth";
import type { Component } from "vue";

const userAuthStore = useUserAuthStore();

const route = useRoute();

const obj: {
  [index: string]: Component;
} = {
  main: MainLayout,
  login: LoginLayout
};

const getCurrentLayout = computed(() => {
  return obj[route.meta.layout || "main"];
});
</script>

<style lang="scss">
@import "@/assets/scss/nullstyle.scss";
@import "@/assets/scss/global.scss";

@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap");

body {
  min-width: 320px;
  font-family: "Poppins", sans-serif;
}
#app {
  overflow: hidden;
}

//route transition

.slide-enter-active,
.slide-leave-active {
  transition: all 0.35s ease 0s;
  
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translate(15%, 0);
}

th {
  cursor: pointer;
}
tr {
  position: relative;
}

.v-dialog {
  min-width: 320px !important;
}
</style>
