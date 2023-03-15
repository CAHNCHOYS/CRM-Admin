<template>
  <v-app>
    <p v-if="isLoading">Site Loading... pls wait</p>
    <component :is="getCurrentLayout" v-else>
      <router-view v-slot="{ Component }">
        <transition name="slide" mode="out-in">
          <component :is="Component"> </component>
        </transition>
      </router-view>
    </component>
  </v-app>
</template>

<script setup lang="ts">
import { useLayouts } from "@/composables/useLayouts";
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

import { useUserAuthStore } from "./stores/userAuth";

const userAuthStore = useUserAuthStore();

const isLoading = ref(true);
const route = useRoute();

const { getCurrentLayout } = useLayouts(route);

onMounted(async () => {
  // await userAuthStore.verifyUserToken();

  // console.log(route.meta.fullPath);
  // if (route.meta.requireAuth && !userAuthStore.isUserLoggedIn) {
  //   return {
  //     name: "login-page",
  //     query: {
  //       redirectedFrom: route.name?.toString() || route.fullPath
  //     }
  //   };
  // }

  isLoading.value = false;
});
</script>

<style lang="scss">
@import "@/assets/scss/nullstyle.scss";

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
  transition: all 0.6s ease 0s;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translate(10%, 0);
}





</style>
