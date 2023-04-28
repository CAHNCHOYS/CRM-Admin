<template>
  <div>
    <div class="text-h5 mb-3">Безопасность</div>

    <v-form @submit.prevent="updatePasswordSubmit">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="oldPassword"
            :error-messages="oldPasswordErrors"
            label="Старый пароль"
            :type="isOldPasswordSeen ? 'text' : 'password'"
            :append-inner-icon="isOldPasswordSeen ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="isOldPasswordSeen = !isOldPasswordSeen"
          />
        </v-col>

        <v-col sm="6" cols="12">
          <v-text-field
            label="Новый пароль"
            v-model="newPassword"
            :error-messages="newPasswordErrors"
            :type="isNewPasswordSeen ? 'text' : 'password'"
            :append-inner-icon="isNewPasswordSeen ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="isNewPasswordSeen = !isNewPasswordSeen"
          />
        </v-col>

        <v-col sm="6" cols="12">
          <v-text-field
            v-model="newPasswordConfirm"
            :error-messages="newPasswordConfirmErrors"
            label="Повторите новый пароль"
            :type="isNewPasswordSeen ? 'text' : 'password'"
          />
        </v-col>
        <v-col cols="12">
          <v-btn type="submit" :loading="isSubmitting" variant="flat" color="green">
            <span class="text-white text-h6">Обновить пароль</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserAuthStore } from "@/stores/userAuth";

import { useFormSchemas } from "@/composables/useFormSchemas";
import { useForm, useField } from "vee-validate";

import AuthService from "@/services/AuthService";
import { handleAxiosError, isAxiosError } from "@/services/axioxErrorHandle";

import type { UpdatePasswordFields } from "@/types/Forms";

const emit = defineEmits<{
  (e: "showMessage", type: "error" | "success", message: string): void;
}>();

//---------------- Валидация формы -------------------------------------------------------------
const { updatePasswordSchema } = useFormSchemas();

const { handleSubmit, isSubmitting, resetForm } = useForm<UpdatePasswordFields>({
  validationSchema: updatePasswordSchema
});

const { value: oldPassword, errorMessage: oldPasswordErrors } = useField<string>("oldPassword");
const { value: newPassword, errorMessage: newPasswordErrors } = useField<string>("newPassword");
const { value: newPasswordConfirm, errorMessage: newPasswordConfirmErrors } =
  useField<string>("newPasswordConfirm");
//----------------------------------------------------------------------------------------------

const isNewPasswordSeen = ref(false);
const isOldPasswordSeen = ref(false);

const userAuthStore = useUserAuthStore();

const router = useRouter();

const updatePasswordSubmit = handleSubmit(async (values: UpdatePasswordFields) => {
  try {
    await AuthService.updatePassword(values);
    const { data } = await AuthService.getUser();
    userAuthStore.setUser(data.user);

    emit("showMessage", "success", "Пароль был успешно имзенен");
    resetForm();
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        userAuthStore.logOutUser();
        router.push({
          name: "login-page",
          query: { isExpiredToken: "true", redirectedFrom: "account-page" }
        });
        return;
      }
      emit("showMessage", "error", handleAxiosError(error));
    } else {
      emit("showMessage", "error", "Ошибка при изменении пароля!");
    }
  }
});
</script>

<style lang="scss" scoped></style>
