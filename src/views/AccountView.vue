<template>
  <div v-if="userAuthStore.currentUser">
    <v-snackbar
      v-model="alertStore.isMessageShown"
      :color="alertStore.messageType"
      location="bottom right"
    >
      <p class="text-h6">{{ alertStore.messageText }}</p>
    </v-snackbar>

    <div class="title text-h2 mb-5 anim">Аккаунт</div>

    <div class="account-items">
      <div>
        <v-card color="white" elevation="2" class="pa-5 mb-6 rounded-lg mx-sm-0 mx-n5">
          <AccountInfo @show-message="showAccountActionResult" />
        </v-card>
      </div>

      <div>
        <v-card color="white" elevation="2" class="pa-5 mb-6 rounded-lg mx-sm-0 mx-n5">
          <AccountPrivateInfo @show-message="showAccountActionResult" />
        </v-card>
      </div>

      <div>
        <v-card color="white" elevation="2" class="pa-5 rounded-lg mx-sm-0 mx-n5">
          <AccountDeletion @show-message="showAccountActionResult" />
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AccountInfo from "@/components/Account/AccountInfo.vue";
import AccountPrivateInfo from "@/components/Account/AccountSecurity.vue";
import AccountDeletion from "@/components/Account/AccountDeletion.vue";
import gsap from "gsap";

import { useUserAuthStore } from "@/stores/userAuth";
import { useAlertStore } from "@/stores/alert";
import { onMounted } from "vue";

const userAuthStore = useUserAuthStore();
const alertStore = useAlertStore();

const showAccountActionResult = (type: "error" | "success", message: string) => {
  alertStore.showMessage(type, message);
};

onMounted(() => {
  gsap.from(".account-items > *", {
    y: "-70%",
    opacity: 0,
    duration: 0.8,
    stagger: 0.4,
    ease: "power3.out"
  });

 
});
</script>

<style lang="scss" scoped></style>
