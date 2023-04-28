<template>
  <div>
    <div class="text-h5 mb-4">Удаление аккаунта</div>

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
import { useUserAuthStore } from "@/stores/userAuth";
import AuthService from "@/services/AuthService";

import { handleAxiosError, isAxiosError } from "@/services/axioxErrorHandle";
import { useLogoutHandler } from "@/composables/useLogoutHandler";

const emit = defineEmits<{
  (e: "showMessage", type: "error" | "success", message: string): void;
}>();

const userAuthStore = useUserAuthStore();
const router = useRouter();

const accountDeletionConfirm = ref(false);

const { handleLogout } = useLogoutHandler("account-page");

const deletionSubmit = async () => {
  if (!accountDeletionConfirm.value) return;

  if (!window.confirm("Вы точно уверены?")) return;

  try {
    await AuthService.deleteAccount(userAuthStore.currentUser!.id);
    await userAuthStore.logOutUser();
    router.push({ name: "login-page" });
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        await handleLogout();
        return;
      }
      emit("showMessage", "error", handleAxiosError(error));
    } else emit("showMessage", "error", "Ошибка при удалении профиля!");
  }
};
</script>

<style scoped>
.text {
  font-weight: 600;
}
</style>
