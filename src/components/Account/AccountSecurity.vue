<template>
  <div>
    <div class="text-h5 mb-3">Безопасность</div>

    <v-snackbar
      v-model="isUpdatePassMessageShown"
      location="bottom right"
      :color="updatePassMessageType"
      :max-width="450"
    >
      <p class="text-h6">{{ updatePassMessageText }}</p>
    </v-snackbar>

    <v-form @submit.prevent="updatePasswordSubmit">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="oldPassword"
            :error-messages="oldPasswordErrors"
            label="Старый пароль"
            type="password"

          >
          </v-text-field>
        </v-col>

        <v-col sm="6" cols="12" >
          <v-text-field
            label="Новый пароль"
            v-model="newPassword"
            :error-messages="newPasswordErrors"
            :type="isNewPasswordSeen ? 'text' : 'password'"
            :append-inner-icon="isNewPasswordSeen ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="isNewPasswordSeen = !isNewPasswordSeen"
          >
          </v-text-field>
        </v-col>

        <v-col sm="6" cols="12">
          <v-text-field
            v-model="newPasswordConfirm"
            :error-messages="newPasswordConfirmErrors"
            label="Повторите новый пароль"
            :type="isNewPasswordSeen ? 'text' : 'password'"
           
          >
          </v-text-field>
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

import type { UpdatePasswordFields } from "@/types/FormFields";
import type { UpdatePasswordResponse } from "@/types/responses";


const isUpdatePassMessageShown = ref(false); //После обновления пароля показываем уведомление пользователю 
const updatePassMessageType = ref<"error" | "success" | "info">("success");
const updatePassMessageText = ref("");

const { updateUserPassword } = useUserAuthStore();

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

const updatePasswordSubmit = handleSubmit(async (values: UpdatePasswordFields) => {

  let res: UpdatePasswordResponse = await updateUserPassword(values);
  console.log(res);

  isUpdatePassMessageShown.value = true;      
  
  if (res.errorMessage) {
    updatePassMessageText.value = "Ошибка + \n" + res.errorMessage + ", попробуйте повторить позже";
    updatePassMessageType.value = "error";
  } else if (res.isWrongPassword) {
    updatePassMessageText.value = "Неверный старый пароль от аккаунта";
    updatePassMessageType.value = "info";
  } else if (res.newPassword) {
    updatePassMessageText.value = "Пароль успешно обновлен!";
    updatePassMessageType.value = "success";
    resetForm();
  }

  setTimeout(() => (isUpdatePassMessageShown.value = false), 3500);
});
</script>

<style lang="scss" scoped></style>
