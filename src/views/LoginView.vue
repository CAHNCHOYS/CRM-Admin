<template>
  <div class="fullscreen h-100 d-flex justify-center align-center">
    <VDialogTransition>
      <VAlert class="alert" type="warning" border="start" :max-width="400" v-if="isWrongEmail">
        <VAlertTitle class="text-h4 mb-2"> Ой </VAlertTitle>
        <div class="text-white text-h6">
          Не удалось найти пользователя с введенным эмейлом {{ email }}
        </div>
      </VAlert>
    </VDialogTransition>

    <VDialogTransition>
      <VAlert
        class="alert"
        position="fixed"
        type="warning"
        border="start"
        :max-width="400"
        v-if="isWrongPassword"
      >
        <VAlertTitle class="text-h4 mb-2"> Ой </VAlertTitle>
        <div class="text-white text-h6">Неверный пароль</div>
      </VAlert>
    </VDialogTransition>

    <VDialogTransition>
      <VAlert type="error" border="start" :max-width="400" v-if="isLoginError">
        <VAlertTitle class="text-h4 mb-2"> Произошла ошибка </VAlertTitle>
        <div class="text-white text-h6">Ошибка: {{ errorMessage }}</div>
      </VAlert>
    </VDialogTransition>

    <VCard class="form-card flex-grow-1 pb-8 rounded-lg" :max-width="486" :elevation="0">
      <div class="form-title font-weight-bold text-center text-h4 py-4">Авторизация</div>

      <VCardActions class="pt-4 pb-1 px-lg-10 px-md-8 px-4">
        <VForm @submit.prevent="loginSubmit" class="fullscreen__form w-100">
          <VCardTitle class="text-indigo-darken-2 text-center mb-2">
            Введите ваши данные</VCardTitle
          >

          <VRow no-gutters>
            <VCol class="mb-2" cols="12">
              <VTextField
                v-model="email"
                :error-messages="emailErrors"
                :bg-color="'rgba(229, 229, 229, 0.25)'"
                placeholder="Ваша почта"
                hint="Ваша почта при регистрации"
                variant="outlined"
                clearable
              >
                <template #prepend-inner>
                  <VIcon class="icon mr-lg-3 mr-1" icon="mdi-email" size="large" />
                </template>
              </VTextField>
            </VCol>
            <VCol class="mb-2" cols="12">
              <VTextField
                v-model="password"
                :error-messages="passwordErrors"
                :bg-color="'rgba(229, 229, 229, 0.25)'"
                variant="outlined"
                placeholder="Ваш пароль"
                hint="Ваш пароль при регистрации"
                :type="isPasswordSeen ? 'text' : 'password'"
                clearable
              >
                <template #prepend-inner>
                  <VIcon class="icon mr-lg-3 mr-1" icon="mdi-lock" size="large" />
                </template>
                <template #append-inner>
                  <VIcon
                    @click="isPasswordSeen = !isPasswordSeen"
                    class="text-dark-blue text-high-emphasis"
                    :icon="isPasswordSeen ? 'mdi-eye' : 'mdi-eye-off'"
                    size="large"
                  />
                </template>
              </VTextField>
            </VCol>

            <VCol>
              <VBtn
                type="submit"
                :loading="isSubmitting"
                :disabled="isSubmitting"
                :height="50"
                block
                :rounded="50"
                color="dark-blue"
                variant="flat"
              >
                <span class="text-white text-h6 font-weight-medium">Войти</span>
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardActions>
    </VCard>

    <VImg class="bg-image" cover :src="bg" alt="OfficePic" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import bg from "@/assets/Images/LoginRegister/bg.png";

import { useForm, useField } from "vee-validate";
import { useFormSchemas } from "@/composables/useFormSchemas";

import { loginUser } from "@/api/loginUser";
import { useUserAuthStore } from "@/stores/userAuth";

const { addTokenToStorage } = useUserAuthStore();

const isPasswordSeen = ref(false);
const isWrongEmail = ref(false);
const isWrongPassword = ref(false);
const isLoginError = ref(false);

const errorMessage = ref("");

const { loginSchema } = useFormSchemas();
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: loginSchema
});

const { value: email, errorMessage: emailErrors } = useField("email");
const { value: password, errorMessage: passwordErrors } = useField("password");

const loginSubmit = handleSubmit(async (values) => {
  console.log(values);
  console.log("SUBMITTED");

  const loginResult = await loginUser({
    email: values.email,
    password: values.password
  });

  console.log(loginResult);

  if (loginResult.error) {
    isLoginError.value = true;
    errorMessage.value = loginResult.error;
    setTimeout(() => (isLoginError.value = false), 3500);
  } else if (loginResult.wrongEmail) {
    isWrongEmail.value = true;
    setTimeout(() => (isWrongEmail.value = false), 3500);
  } else if (loginResult.wrongPassword) {
    isWrongPassword.value = true;
    setTimeout(() => (isWrongPassword.value = false), 3500);
  } else if (loginResult.token && loginResult.user) {
    console.log(loginResult.token);
    console.log(loginResult.user);
    addTokenToStorage(loginResult.token, loginResult.user);
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/LoginRegister.scss";
</style>
