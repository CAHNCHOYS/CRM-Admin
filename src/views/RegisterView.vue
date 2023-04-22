<template>
  <div class="fullscreen h-100 d-flex justify-center align-center">
    <!------- Уведомления после регистрации ------>
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

    <v-card class="form-card flex-grow-1 pb-2 rounded-lg" :max-width="486" :elevation="0">
      <div class="form-title text-center text-h4 py-4">Регистрация</div>

      <v-card-actions class="pt-4 pb-6 px-lg-10 px-md-8 px-4">
        <v-form @submit="registerSubmit" class="w-100">
          <v-card-title class="text-indigo-darken-2 text-center mb-2 px-0">
            Введите ваши данные</v-card-title
          >
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="name"
                :error-messages="nameErrors"
                placeholder="Ваше имя"
                hint="Ваше настоящее имя"
                :bg-color="'rgba(229, 229, 229, 0.25)'"
              >
                <template #prepend-inner>
                  <v-icon class="icon mr-lg-3 mr-1" icon="mdi-clipboard-account" size="large" />
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="email"
                :error-messages="emailErrors"
                placeholder="Ваша почта"
                hint="Ваш адрес электронной почты"
                :bg-color="'rgba(229, 229, 229, 0.25)'"
              >
                <template #prepend-inner>
                  <v-icon class="icon mr-lg-3 mr-1" icon="mdi-email" size="large" />
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12">
              <v-select
                v-model="country"
                placeholder="Выберете вашу страну"
                hint="Страна проживания"
                :items="['Россия', 'Беларусь', 'Латвия', 'Украина', 'Казахстан', 'Узбекистан']"
                :bg-color="'rgba(229, 229, 229, 0.25)'"
                :error-messages="countryErrors"
              >
                <template #prepend-inner>
                  <v-icon icon="mdi-city" class="icon mr-lg-3 mr-1" size="large" />
                </template>
              </v-select>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="password"
                :error-messages="passwordErrors"
                type="password"
                placeholder="Ваш пароль"
                hint="Ваш пароль для входа на сайт"
                :bg-color="'rgba(229, 229, 229, 0.25)'"
              >
                <template #prepend-inner>
                  <v-icon icon="mdi-lock" class="icon mr-lg-3 mr-1" size="large" />
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                type="password"
                v-model="passwordConfirm"
                :error-messages="passwordConfirmErrors"
                placeholder="Повторите пароль"
                hint="Ваш пароль еще раз"
                :bg-color="'rgba(229, 229, 229, 0.25)'"
              >
                <template #prepend-inner>
                  <v-icon icon="mdi-lock" class="icon mr-lg-3 mr-1" size="large" />
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12">
              <v-checkbox
                v-model="agreement"
                color="#0f1e54"
                :error-messages="agreementErrors"
                label="Вы согласны на обработку данных?"
              />
            </v-col>

            <v-col cols="12">
              <v-btn
                type="submit"
                :loading="isSubmitting"
                :disabled="isSubmitting || isMessageShown || userCanGoToLogin"
                block
                color="dark-blue"
                variant="flat"
              >
                <span class="text-white text-h6 font-weight-medium">Зарегистрироваться</span>
              </v-btn>

              <p class="mt-2" v-if="!userCanGoToLogin">
                <router-link :to="{ name: 'login-page' }" class="text-black text-h6"
                  >Уже есть аккаунт?
                  <span class="text-decoration-underline text-green"> Перейти к авторизации </span>
                </router-link>
              </p>
            </v-col>

            <v-col cols="12">
              <v-scale-transition>
                <v-btn block variant="flat" color="success" v-if="userCanGoToLogin">
                  <router-link to="/login" class="text-white text-h6 font-weight-medium"
                    >Перейти к авторизации</router-link
                  >
                </v-btn>
              </v-scale-transition>
            </v-col>
          </v-row>
        </v-form>
      </v-card-actions>
    </v-card>

    <v-img cover class="bg-image" :src="pageBackground" alt="Оффис" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { useFormSchemas } from "@/composables/useFormSchemas";
import { useField, useForm } from "vee-validate";

import { useAlertStore } from "@/stores/alert";
import { storeToRefs } from "pinia";

import pageBackground from "@/assets/Images/LoginRegister/bg2.jpg";
import type { RegisterFields } from "@/types/Forms";

import { handleAxiosError, isAxiosError } from "@/services/axioxErrorHandle";
import AuthService from "@/services/AuthService";

//Валидация формы----------------------------------------------
const { registerSchema } = useFormSchemas();

const { handleSubmit, isSubmitting } = useForm<RegisterFields>({
  validationSchema: registerSchema
});

const { value: name, errorMessage: nameErrors } = useField<string>("name");
const { value: email, errorMessage: emailErrors } = useField<string>("email");
const { value: country, errorMessage: countryErrors } = useField<string>("country");
const { value: password, errorMessage: passwordErrors } = useField<string>("password");
const { value: passwordConfirm, errorMessage: passwordConfirmErrors } =
  useField<string>("passwordConfirm");
const { value: agreement, errorMessage: agreementErrors } = useField<boolean>("agreement");

//--------------------------------------------------------------

const userCanGoToLogin = ref(false);

const alertStore = useAlertStore();
const { isMessageShown, messageText, messageType } = storeToRefs(alertStore);

const registerSubmit = handleSubmit(async (values: RegisterFields) => {
  try {
    await AuthService.register(values);
    alertStore.showMessage(
      "success",
      "Вы успешно зарегистрировались, можете переходить к авторизации"
    );
    userCanGoToLogin.value = true;
  } catch (error) {
    if (isAxiosError(error)) {
      alertStore.showMessage("error", handleAxiosError(error));
    } else alertStore.showMessage("error", "Ошибка при регистрации, попробуйте позже");
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/LoginRegister.scss";
</style>
