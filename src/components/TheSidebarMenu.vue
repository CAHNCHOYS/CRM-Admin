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
    <v-list class="pa-0">
      <v-list-item class="text-center d-block">
        <v-list-item-title class="text-white text-h6"
          >{{ userAuthStore.currentUser?.name }}
        </v-list-item-title>
        <template #prepend>
          <v-avatar class="mx-auto mb-2" size="60px">
            <v-img
              :src="`http://localhost:3000/UserAvatars/${userAuthStore.currentUser.avatar}`"
              alt="No avatar"
              cover
            />
          </v-avatar>
        </template>
      </v-list-item>

      <v-divider color="white" thickness="2" class="my-2" />

      <v-list-item
        v-for="item in menuItems"
        :key="item.link"
        :value="item.link"
        @click="navigateTo(item.link)"
        active-class="active"
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
      <div class="px-4">
        <v-btn @click="logOut" block variant="flat" color="deep-orange-darken-2" :rounded="0">
          <span class="font-weight-medium">Выйти с аккаунта</span>
          <v-icon end icon="mdi-exit-to-app" size="x-large" />
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";
import { useUserAuthStore } from "@/stores/userAuth";
import { useRouter } from "vue-router";

const props = defineProps<{
  isOpened: boolean;
}>();

const userAuthStore = useUserAuthStore();

const { smAndDown, mdAndUp } = useDisplay();

const router = useRouter();

type MenuItem = {
  title: string;
  icon: string;
  link: string;
};

const menuItems = ref<MenuItem[]>([
  {
    title: "Статиститка",
    icon: "mdi-account",
    link: "/workers"
  },

  {
    title: "Товары",
    icon: "mdi-note",
    link: "/goods"
  },
  {
    title: "Личный кабинет",
    icon: "mdi-account-circle",
    link: "/account"
  },
  {
    title: "О приложении",
    icon: "mdi-information",
    link: "/about"
  }
]);

function logOut(): void {
  if (window.confirm("Вы уверены что хотите выйти с аккаунта ?")) {
    userAuthStore.logOutUser();
    router.push({ name: "login-page" });
  }
}

function navigateTo(link: string) {
  router.push(`${link}`);
}

</script>

<style lang="scss" scoped>
.active {
}
</style>
