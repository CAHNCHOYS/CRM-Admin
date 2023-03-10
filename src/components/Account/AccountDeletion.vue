<template>
  <div>
    <div class="text-h5 mb-4">Удаление аккаунта</div>

    <v-snackbar v-model="isDeletionError" location="bottom right" color="error">
      <p class="text-h6">{{ deleteErrorMessage }}</p>
    </v-snackbar>

    <v-form @submit.prevent="deletionSubmit">
      <v-alert :border="'end'" variant="tonal" color="red-darken-2">
        <v-alert-title class="text-h6 mb-1">Вы уверены что хотите удалить аккаунт?</v-alert-title>
        <p class="text-h6">Отменить это действие будет невозможно</p>
      </v-alert>

      <p class="mb-2">
        <v-checkbox
          v-model="accountDeletionConfirm"
          :rules="[(v) => !!v || 'Подтвердите удаление аккаунта']"
          required
          color="red-darken-2"
          class="text-red-darken-4"
        >
          <template #label>
            <span class="font-weight-bold">Я хочу удалить аккаунт </span>
          </template>
        </v-checkbox>
      </p>

      <v-btn type="submit" color="error">
        <span class="text-h6">Удалить аккаунт</span>
      </v-btn>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import type { DeleteAccountResponse } from "@/types/BackendResponses";

import { useUserAuthStore } from "@/stores/userAuth";

const { deleteUserAccount } = useUserAuthStore();

const router = useRouter();


const accountDeletionConfirm = ref(false);


const isDeletionError = ref(false);
const deleteErrorMessage = ref("");

const deletionSubmit = async () => {
  if (!accountDeletionConfirm.value) return;

  if (!window.confirm("Вы точно уверены?")) return;

  let deleteResult: DeleteAccountResponse = await deleteUserAccount();

  if (deleteResult.errorMessage) {
    isDeletionError.value = true;
    deleteErrorMessage.value = deleteResult.errorMessage;
    setTimeout(() => (isDeletionError.value = false), 3500);
  } else if (deleteResult.isAccountDeleted) {
    router.push({ name: "login-page" });
  }
};
</script>

<style scoped>
.text {
  font-weight: 600;
}
</style>
