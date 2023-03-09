<template>
  <div>
    <div class="title text-h2 mb-5">Аккаунт</div>

    <v-card color="white pa-5 mb-6">
      <AccountInfo />
    </v-card>
    <v-card color="white pa-5 mb-6">
      <AccountPrivateInfo  />
    </v-card>
    
    <v-card color="white pa-5">
      <AccountDeletion  />
    </v-card>

  </div>
</template>

<script setup lang="ts">
import AccountInfo from "@/components/Account/AccountInfo.vue";
import AccountPrivateInfo from "@/components/Account/AccountSecurity.vue";
import AccountDeletion from "@/components/Account/AccountDeletion.vue";






</script>

<style lang="scss" scoped></style>
