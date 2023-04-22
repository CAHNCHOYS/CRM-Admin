<template>
  <v-navigation-drawer
    @update:model-value="$emit('closeMenu')"
    :model-value="isOpened"
    class="pb-5 py-10"
    width="268"
    color="#363740"
    :permanent="mdAndUp"
    style="position: fixed"
    :temporary="smAndDown"
    v-if="userAuthStore.currentUser"
  >
    <div
      v-if="smAndDown"
      style="position: absolute; right: 10px; top: 5px"
      @click="$emit('closeMenu')"
    >
      <v-icon icon="mdi-arrow-left" class="text-white text-h4" />
    </div>
    <v-list class="pa-0">
      <v-list-item class="text-center d-block link">
        <v-list-item-title class="text-white text-h6"
          >{{ userAuthStore.currentUser.name }}
        </v-list-item-title>
        <template #prepend>
          <v-avatar class="mx-auto mb-2" size="60px">
            <v-img
              :src="`https://crm-backend-mocha.vercel.app/UserAvatars/${userAuthStore.currentUser.avatar}`"
              alt="No avatar"
              cover
            />
          </v-avatar>
        </template>
      </v-list-item>

      <v-divider color="white" thickness="2" class="mt-4" />

      <v-list-item
        v-for="item in menuItems"
        :key="item.link"
        :value="item.link"
        @click="navigateTo(item.link)"
        active-class="active-link"
        class="link"
      >
        <v-list-item-title>
          <router-link :to="item.link" class="text-subtitle-1 text-white">
            <v-icon class="mr-2" :icon="item.icon" />
            {{ item.title }}
          </router-link>
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <template #append>
      <div class="px-4 btn">
        <v-btn @click="logOut" block variant="flat" color="red-darken-2" :rounded="0">
          <span class="font-weight-medium">Выйти с аккаунта</span>
          <v-icon end icon="mdi-exit-to-app" size="x-large" />
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";
import { useUserAuthStore } from "@/stores/userAuth";
import { useRouter, useRoute } from "vue-router";

import gsap from "gsap";

const props = defineProps<{
  isOpened: boolean;
}>();

const { smAndDown, mdAndUp } = useDisplay();

type MenuItem = {
  title: string;
  icon: string;
  link: string;
};

const menuItems = ref<MenuItem[]>([
  {
    title: "Статиститка",
    icon: "mdi-chart-areaspline",
    link: "stats-page"
  },

  {
    title: "Товары",
    icon: "mdi-cards-variant",
    link: "products-page"
  },
  {
    title: "Клиенты",
    icon: "mdi-account-group",
    link: "customers-page"
  },
  {
    title: "Заказы",
    icon: "mdi-wallet",
    link: "orders-page"
  },

  {
    title: "Личный кабинет",
    icon: "mdi-account-circle",
    link: "account-page"
  },
  {
    title: "Заметки",
    icon: "mdi-note-multiple",
    link: "notes-page"
  },
  {
    title: "О приложении",
    icon: "mdi-information",
    link: "info-page"
  }
  // {
  //   title: "Анимации",
  //   icon: "mdi-animation",
  //   link: "gsap-animations"
  // }
]);

const userAuthStore = useUserAuthStore();

const router = useRouter();
const route = useRoute();

const logOut = (): void => {
  if (window.confirm("Вы уверены что хотите выйти с аккаунта ?")) {
    userAuthStore.logOutUser();
    router.push({ name: "login-page" });
  }
};

const navigateTo = (link: string): void => {
  if (link === (route.name as string)) {
    router.push({ name: link, query: { ...route.query } });
  } else router.push({ name: link });
};

//Анимация gsap
onMounted(() => {
  gsap.from(".link", {
    xPercent: 100,
    opacity: 0,
    stagger: 0.25,
    transformOrigin: "top left",
    duration: 0.25,
    ease: "sine.out"
  });
  gsap.from(".btn", {
    scale: 0,
    opacity: 0,
    delay: 2,
    duration: 0.35
  });
});
</script>

<style lang="scss" scoped>
.active-link {
  background-color: rgba($color: #9c27b0, $alpha: 1) !important;
  color: white !important;
  transition: all 0s ease 0s !important;
}
</style>
