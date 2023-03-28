<template>
  <div class="fullscreen h-100 d-flex justify-center align-center">
    <!----- Уведомления после авторизации ----------->

    <v-dialog-transition>
      <v-alert class="alert" :type="messageType" :max-width="400" v-model="isMessageShown">
        <v-alert-title class="text-h4 mb-2">
          {{ messageType === "error" ? "Ошибка" : "Уведомление" }}
        </v-alert-title>
        <div class="text-white text-h6">
          {{ messageText }}
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
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="email"
                :error-messages="emailErrors"
                :bg-color="'rgba(229, 229, 229, 0.25)'"
                placeholder="Ваша почта"
                hint="Ваша почта при регистрации"
                clearable
              >
                <template #prepend-inner>
                  <v-icon icon="mdi-email" class="icon mr-lg-3 mr-1" size="large" />
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="password"
                :error-messages="passwordErrors"
                :bg-color="'rgba(229, 229, 229, 0.25)'"
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
                    class="text-dark-blue"
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
                :disabled="isSubmitting || isMessageShown"
                block
                color="dark-blue"
                variant="flat"
              >
                <span class="text-white text-h6 font-weight-medium">Войти</span>
              </v-btn>
              <p class="mt-2">
                <router-link :to="{ name: 'register-page' }" class="text-black text-h6"
                  >Нет аккаунта?
                  <span class="text-decoration-underline text-green"> Зарегистрироваться </span>
                </router-link>
              </p>
            </v-col>
          </v-row>
        </v-form>
      </v-card-actions>
    </v-card>

    <v-img class="bg-image" cover :src="pageBackground" alt="OfficePic" />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";

import { storeToRefs } from "pinia";
import { useUserAuthStore } from "@/stores/userAuth";
import { useAlertStore } from "@/stores/alert";

import pageBackground from "@/assets/Images/LoginRegister/bg.png";

import { useForm, useField } from "vee-validate";
import { useFormSchemas } from "@/composables/useFormSchemas";

import type { LoginFields } from "@/types/Forms";

//Form validation -----------------------------------------------------------
const { loginSchema } = useFormSchemas();

const { handleSubmit, isSubmitting, resetForm } = useForm<LoginFields>({
  validationSchema: loginSchema
});

const { value: email, errorMessage: emailErrors } = useField<string>("email");
const { value: password, errorMessage: passwordErrors } = useField<string>("password");
//---------------------------------------------------------------------------

const isPasswordSeen = ref(false);

const userAuthStore = useUserAuthStore();
const alertStore = useAlertStore();
const { isMessageShown, messageText, messageType } = storeToRefs(alertStore);

const route = useRoute();
const router = useRouter();

//Авторизация
const loginSubmit = handleSubmit(async (values: LoginFields) => {
  await userAuthStore.loginUser(values);

  //Если вошли в аккаунт
  if (userAuthStore.isUserLoggedIn) {
    setTimeout(() => {
      if (route.query.redirectedFrom) {
        router.push({ name: route.query.redirectedFrom as string });
      } else router.push("/");
    }, 3500);
  } else resetForm();
});

//Если зашли на страницу, которая требует авторизации, то перекидываем на эту странциу и показываем сообщение
watchEffect(() => {
  if (route.query.redirectedFrom) {
    alertStore.showMessage(
      "error",
      `Для доступа к странице ${route.query.redirectedFrom} необходимо авторизироваться`
    );
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/LoginRegister.scss";
</style>
