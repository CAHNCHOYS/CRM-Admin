<template>
  <v-app>
    <v-overlay :model-value="isLoading" class="align-center justify-center">
      <v-progress-circular color="primary" indeterminate size="124" />
    </v-overlay>
    <component :is="getCurrentLayout" v-if="!isLoading">
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
const router = useRouter();

const { getCurrentLayout } = useLayouts(route);

onMounted(async () => {
  console.log("mounted");


  // if (route.meta.requireAuth && !userAuthStore.isUserLoggedIn) {
  //   router.push({
  //     name: "login-page",
  //     query: {
  //       redirectedFrom: route.name?.toString() || route.fullPath
  //     }
  //   });
  // }

  setTimeout(()=>{
    isLoading.value = false;
  },1000)

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
