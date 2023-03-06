<template>
  <v-navigation-drawer
    @update:model-value="$emit('closeMenu')"
    :model-value="isOpened"
    class="py-5"
    width="268"
    color="#2F76E6"
    :permanent="mdAndUp"
    :temporary="smAndDown"
  >
    <h2 class="text mb-10 px-4 text-white">
      <span class="text-uppercase text-indigo-darken-4">crm</span> System
    </h2>

    <v-list class="pa-0">
      <v-list-item class="text-center d-block">
        <v-list-item-title class="text-white text-h6"
          >{{ userAuthStore.currentUser?.name }}
        </v-list-item-title>
        <template #prepend>
          <v-avatar class="mx-auto" size="60px">
            <v-img src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460" />
          </v-avatar>
        </template>
      </v-list-item>

      <v-divider color="white" thickness="2" class="my-2" />

      <v-list-item v-for="item in menuItems" :value="item" active-class="active">
        <v-list-item-title>
          <router-link
            :to="item.link"
            class="d-flex justify-space-between align-center text-h6 text-white"
          >
            {{ item.title }}

            <v-icon :icon="item.icon" />
          </router-link>
        </v-list-item-title>
      </v-list-item>
    </v-list>

 
    <template #append>
      <div class="px-4">
        <v-btn @click="logOut" block variant="flat" :height="60" color="red-darken-4" :rounded="0">
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
    title: "Рабочие",
    icon: "mdi-account",
    link: "/workers"
  },
  {
    title: "Личный кабинет",
    icon: "mdi-key",
    link: "/account"
  }
]);

function logOut(): void {
  if (window.confirm("Вы уверены что хотите выйти с аккаунта ?")) {
    userAuthStore.logOutUser();
    router.push({ name: "login-page" });
  }
}

</script>

<style lang="scss" scoped>
.active {
}
</style>
