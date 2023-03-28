<template>
  <div v-if="userAuthStore.currentUser">
    <div class="title text-h2 mb-5 anim">Аккаунт</div>

    <v-card color="white" elevation="2" class="pa-5 mb-6 rounded-lg mx-sm-0 mx-n5">
      <AccountInfo />
    </v-card>
    <v-card color="white" elevation="2" class="pa-5 mb-6 rounded-lg mx-sm-0 mx-n5">
      <AccountPrivateInfo />
    </v-card>

    <v-card color="white" elevation="2" class="pa-5 rounded-lg mx-sm-0 mx-n5">
      <AccountDeletion />
    </v-card>
  </div>
</template>

<script setup lang="ts">
import AccountInfo from "@/components/Account/AccountInfo.vue";
import AccountPrivateInfo from "@/components/Account/AccountSecurity.vue";
import AccountDeletion from "@/components/Account/AccountDeletion.vue";
import gsap from "gsap";

import { useUserAuthStore } from "@/stores/userAuth";
import { onMounted } from "vue";
const userAuthStore = useUserAuthStore();

onMounted(() => {
  gsap.from(".anim", {
    y: 100,
    duration: 0.5,

    opacity: 0,
    stagger: 0.4,
  });
});
</script>

<style lang="scss" scoped></style>
