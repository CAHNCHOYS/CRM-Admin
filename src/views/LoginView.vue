<template>
  <div class="fullscreen h-100 d-flex justify-center align-center">
    <v-dialog-transition>
      <v-alert
        class="alert"
        type="warning"
        border="start"
        :max-width="400"
        v-if="isNoExistentEmail"
      >
        <v-alert-title class="text-h4 mb-2"> Сообщение </v-alert-title>
        <div class="text-white text-h6">
          Не удалось найти пользователя с введенным эмейлом {{ email }}
        </div>
      </v-alert>
    </v-dialog-transition>

    <v-dialog-transition>
      <v-alert class="alert" type="warning" border="start" :max-width="280" v-if="isWrongPassword">
        <v-alert-title class="text-h4 mb-3"> Ой </v-alert-title>
        <div class="text-white text-h6">Неверный пароль</div>
      </v-alert>
    </v-dialog-transition>

    <v-dialog-transition>
      <v-alert class="alert pa-4" type="info" border="start" :max-width="450" v-if="isRedirected">
        <v-alert-title class="text-h4 mb-3"> Сообщение </v-alert-title>
        <div class="text-white text-h6">
          Для доступа к странице
          <span class="text-light-green-accent-2 font-weight-bold text-uppercase">
            {{ $route.query.redirectedFrom }}</span
          >
          необходимо сначала авторизироваться
        </div>
      </v-alert>
    </v-dialog-transition>

    <v-dialog-transition>
      <v-alert class="alert" type="error" border="start" :max-width="290" v-if="isLoginError">
        <v-alert-title class="text-h4 mb-3"> Произошла ошибка </v-alert-title>
        <div class="text-white text-h6">Ошибка: {{ errorMessage }}</div>
      </v-alert>
    </v-dialog-transition>

    <v-dialog-transition>
      <v-alert
        class="alert"
        type="success"
        border="start"
        :max-width="600"
        closable
        v-if="isLoginSuccess"
      >
        <v-alert-title class="text-h4 mb-3"> Успех </v-alert-title>
        <div class="text-white text-h6">
          Вы упсешно вошли в аккаунт, вы скоро будете перенаправлены на сайт
        </div>
      </v-alert>
    </v-dialog-transition>

    <v-card class="form-card flex-grow-1 pb-8 rounded-lg" :max-width="486" :elevation="0">
      <div class="form-title text-center text-h4 py-4">Авторизация</div>

      <v-card-actions class="pt-4 pb-1 px-lg-10 px-md-8 px-4">
        <v-form @submit.prevent="loginSubmit" class="w-100">
          <v-card-title class="text-indigo-darken-2 text-center mb-2">
            Введите ваши данные</v-card-title
          >

          <v-row no-gutters>
            <v-col class="mb-2" cols="12">
              <v-text-field
                v-model="email"
                :error-messages="emailErrors"
                :bg-color="'rgba(229, 229, 229, 0.25)'"
                placeholder="Ваша почта"
                hint="Ваша почта при регистрации"
                variant="outlined"
                clearable
              >
                <template #prepend-inner>
                  <v-icon icon="mdi-email" class="icon mr-lg-3 mr-1" size="large" />
                </template>
              </v-text-field>
            </v-col>
            <v-col class="mb-2" cols="12">
              <v-text-field
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
                  <v-icon icon="mdi-lock" class="icon mr-lg-3 mr-1" size="large" />
                </template>
                <template #append-inner>
                  <v-icon
                    @click="isPasswordSeen = !isPasswordSeen"
                    class="text-dark-blue text-high-emphasis"
                    :icon="isPasswordSeen ? 'mdi-eye' : 'mdi-eye-off'"
                    size="large"
                  />
                </template>
              </v-text-field>
            </v-col>

            <v-col>
              <v-btn
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
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-actions>
    </v-card>

    <v-img class="bg-image" cover :src="bg" alt="OfficePic" />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";

import bg from "@/assets/Images/LoginRegister/bg.png";

import { useForm, useField } from "vee-validate";
import { useFormSchemas } from "@/composables/useFormSchemas";

import { loginUser } from "@/api/loginUser";
import { useUserAuthStore } from "@/stores/userAuth";

const { addTokenToStorage } = useUserAuthStore();

const route = useRoute();
const router = useRouter();

//Form validation -----------------------------------------------------------
const { loginSchema } = useFormSchemas();
const { handleSubmit, isSubmitting, resetForm, resetField } = useForm({
  validationSchema: loginSchema
});

const { value: email, errorMessage: emailErrors } = useField("email");
const { value: password, errorMessage: passwordErrors } = useField("password");
//---------------------------------------------------------------------------

const isPasswordSeen = ref(false);

const isNoExistentEmail = ref(false);
const isLoginSuccess = ref(false);
const isWrongPassword = ref(false);
const isLoginError = ref(false);
const isRedirected = ref(false);

const errorMessage = ref("");

const loginSubmit = handleSubmit(async (values) => {
  const loginResult = await loginUser({
    email: values.email,
    password: values.password
  });

  console.log(loginResult);

  if (loginResult.error) {
    isLoginError.value = true;
    errorMessage.value = loginResult.error;
    setTimeout(() => (isLoginError.value = false), 3500);
  } else if (loginResult.noExistEmail) {
    isNoExistentEmail.value = true;
    resetField("password");
    setTimeout(() => (isNoExistentEmail.value = false), 3500);
  } else if (loginResult.wrongPassword) {
    isWrongPassword.value = true;
    resetField("password");
    setTimeout(() => (isWrongPassword.value = false), 3500);
  } else if (loginResult.loginData) {
    isLoginSuccess.value = true;
    addTokenToStorage(loginResult.loginData);
    resetForm();

    setTimeout(() => {
      if (route.query.redirectedFrom) {
        router.push({ name: route.query.redirectedFrom as string });
      } else {
        router.push({ name: "home" });
      }
    }, 2500);
  }
});

watchEffect(() => {
  if (route.query.redirectedFrom) {
    isRedirected.value = true;
    setTimeout(() => (isRedirected.value = false), 3500);
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/LoginRegister.scss";

input {
  font-size: 20px;
}
</style>
