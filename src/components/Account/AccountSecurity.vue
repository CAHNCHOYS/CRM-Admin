<template>
  <div>
    <div class="text-h5 mb-3">Безопасность</div>

    <v-snackbar v-model="isUpdateError" color="error" location="bottom right">
      <p class="text-h6 mb-1">Ошибка:</p>
      <p class="text-h6">{{ updatePassErrorMessage }}</p>
    </v-snackbar>

    <v-snackbar v-model="isUpdateSuccess" color="success" location="bottom right">
      <p class="text-h6">Пароль был успешно обновлен !</p>
    </v-snackbar>

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
import { useUserAuthStore } from "@/stores/userAuth";

import { useFormSchemas } from "@/composables/useFormSchemas";
import { useForm, useField } from "vee-validate";

import type { UpdatePasswordFields } from "@/types/Forms";
import type { ApiError, UpdateUserResponse } from "@/types/BackendResponses";


import { fetchData } from "@/services/axiosFetch";

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

const isUpdateError = ref(false);
const isUpdateSuccess = ref(false);
const updatePassErrorMessage = ref("");

const isNewPasswordSeen = ref(false);
const isOldPasswordSeen = ref(false);

const userAuthStore = useUserAuthStore();

const updatePasswordSubmit = handleSubmit(async (values: UpdatePasswordFields) => {
  const userId = userAuthStore.currentUser!.id;

  let updatePasswordResult:  UpdateUserResponse | ApiError = await fetchData<UpdateUserResponse>({
    url: "/UpdateUserPassword",
    method: "patch",
    body: {
      ...values,
      id: userId,
    }
  });

  console.log(updatePasswordResult);

  if ("error" in updatePasswordResult) {
    isUpdateError.value = true;
    updatePassErrorMessage.value = updatePasswordResult.error;
    setTimeout(() => (isUpdateError.value = false), 3500);
  } else if (updatePasswordResult.isInfoUpdated) {
    //Так как даннные хранятся в токене, то получаемы новый токен
 
    const updateTokenResult = await userAuthStore.updateUserToken();
    if (updateTokenResult.error) {
      isUpdateError.value = true;
      updatePassErrorMessage.value = updateTokenResult.error;
      setTimeout(() => (isUpdateError.value = false), 3500);
    } else if (updateTokenResult.isTokenUpdated) {
      isUpdateSuccess.value = true;
      setTimeout(() => (isUpdateSuccess.value = false), 3500);
      resetForm();
    }
  }
});
</script>

<style lang="scss" scoped></style>
