<template>
  <div class="fullscreen h-100 d-flex justify-center align-center">
    <v-dialog-transition>
      <v-alert
        class="alert"
        type="success"
        border="start"
        :max-width="450"
        closable
        close-label="Закрыть уведомление"
        v-if="isRegisterSucess"
      >
        <v-alert-title class="text-h4 mb-2 text-weight-bold"> Успех </v-alert-title>

        <div class="text-white text-h6">
          Вы успешно зарегистрировались, можете перейти на страницу входа
        </div>
      </v-alert>
    </v-dialog-transition>

    <v-dialog-transition>
      <v-alert
        class="alert"
        type="error"
        :max-width="320"
        border="start"
        v-if="isRegistrationError"
      >
        <v-alert-title class="mb-2">Произошла ошибка </v-alert-title>
        <div class="text-white text-h6">Ошибка: {{ errorMessage }}</div>
      </v-alert>
    </v-dialog-transition>

    <v-dialog-transition>
      <v-alert
        class="alert"
        type="warning"
        :max-width="450"
        border="start"
        v-if="isAlreadyRegistered"
      >
        <v-alert-title class="text-h4 mb-2">Упс </v-alert-title>
        <div class="text-white text-h6">Пользователь с таким email уже зарегистрирован !</div>
      </v-alert>
    </v-dialog-transition>

    <v-card class="form-card flex-grow-1 pb-8 rounded-lg" :max-width="486" :elevation="0">
      <div class="form-title text-center text-h4 py-4">Регистрация</div>

      <v-card-actions class="pt-4 pb-1 px-lg-10 px-md-8 px-4">
        <v-form @submit="registerSubmit" class="w-100">
          <v-card-title class="text-indigo-darken-2 text-center mb-2 px-0">
            Введите ваши данные</v-card-title
          >

          <v-row no-gutters>
            <v-col class="mb-2" cols="12">
              <v-text-field
                v-model="name"
                :error-messages="nameErrors"
                placeholder="Ваше имя"
                hint="Ваше настоящее имя"
                variant="outlined"
                :bg-color="'rgba(229, 229, 229, 0.25)'"
                clearable
              >
                <template #prepend-inner>
                  <v-icon class="icon mr-lg-3 mr-1" icon="mdi-clipboard-account" size="large" />
                </template>
              </v-text-field>
            </v-col>
            <v-col class="mb-2" cols="12">
              <v-text-field
                v-model="email"
                :error-messages="emailErrors"
                placeholder="Ваша почта"
                hint="Ваш адрес электронной почты"
                variant="outlined"
                :bg-color="'rgba(229, 229, 229, 0.25)'"
                clearable
              >
                <template #prepend-inner>
                  <v-icon class="icon mr-lg-3 mr-1" icon="mdi-email" size="large" />
                </template>
              </v-text-field>
            </v-col>

            <v-col class="mb-2" cols="12">
              <v-select
                v-model="city"
                placeholder="Выберете ваш город"
                hint="Страна проживания"
                :items="['Россия', 'Беларусь', 'Латвия', 'Украина', 'Казахстан', 'Узбекистан']"
                variant="outlined"
                :bg-color="'rgba(229, 229, 229, 0.25)'"
                :error-messages="cityErrors"
              >
                <template #prepend-inner>
                  <v-icon icon="mdi-city" class="icon mr-lg-3 mr-1"  size="large" />
                </template>
              </v-select>
            </v-col>

            <v-col class="mb-2" cols="12">
              <v-text-field
                v-model="password"
                :error-messages="passwordErrors"
                type="password"
                placeholder="Ваш пароль"
                hint="Ваш пароль для входа на сайт"
                variant="outlined"
                :bg-color="'rgba(229, 229, 229, 0.25)'"
                clearable
              >
                <template #prepend-inner>
                  <v-icon  icon="mdi-lock" class="icon mr-lg-3 mr-1" size="large" />
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                type="password"
                v-model="passwordConfirm"
                :error-messages="passwordConfirmErrors"
                variant="outlined"
                placeholder="Повторите пароль"
                hint="Ваш пароль еще раз"
                :bg-color="'rgba(229, 229, 229, 0.25)'"
                clearable
              >
                <template #prepend-inner>
                  <v-icon icon="mdi-lock" class="icon mr-lg-3 mr-1"  size="large" />
                </template>
              </v-text-field>
            </v-col>

            <v-col class="mb-2" cols="12">
              <v-checkbox
                v-model="agreement"
                :error-messages="agreementErrors"
                density="compact"
                label="Вы согласны на обработку данных?"
              />
            </v-col>

            <v-col cols="12">
              <v-btn
                type="submit"
                :loading="isSubmitting"
                :disabled="isSubmitting"
                :height="50"
                block
                color="dark-blue"
                variant="flat"
              >
                <span class="text-white text-h6 font-weight-medium">Зарегистрироваться</span>
              </v-btn>
            </v-col>

            <v-col cols="12">
              <v-scale-transition>
                <v-btn
                  block
                  variant="flat"
                  color="success"
                  class="mt-5"
                  :height="50"
                  v-if="isRegisterSucess"
                >
                  <router-link to="/login" class="text-white text-h6 font-weight-medium"
                    >Перейти к авторизации</router-link
                  >
                </v-btn>
              </v-scale-transition>
            </v-col>
          </v-row>>
        </v-form>
      </v-card-actions>
    </v-card>

    <v-img cover class="bg-image" :src="bg" alt="Оффис" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import bg from "@/assets/Images/LoginRegister/bg2.jpg";
import { useFormSchemas } from "@/composables/useFormSchemas";
import { useField, useForm } from "vee-validate";
import { registerUser } from "@/api/registerUser";

//Валидация формы----------------------------------------------
const { registerSchema } = useFormSchemas();

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: registerSchema
});

const { value: name, errorMessage: nameErrors } = useField("name");
const { value: email, errorMessage: emailErrors } = useField("email");
const { value: city, errorMessage: cityErrors } = useField("city");
const { value: password, errorMessage: passwordErrors } = useField("password");
const { value: passwordConfirm, errorMessage: passwordConfirmErrors } = useField("passwordConfirm");
const { value: agreement, errorMessage: agreementErrors } = useField("agreement");

//--------------------------------------------------------------

const isRegistrationError = ref(false);
const isAlreadyRegistered = ref(false);
const isRegisterSucess = ref(false);
const errorMessage = ref("");

const registerSubmit = handleSubmit(async (values) => {
  console.log(values);

  const { success, alreadyRegistered, error } = await registerUser({
    name: values.name,
    email: values.email,
    password: values.password,
    city: values.city
  });

  if (error) {
    isRegistrationError.value = true;
    setTimeout(() => (isRegistrationError.value = false), 3500);
    errorMessage.value = error;
  } else if (alreadyRegistered) {
    isAlreadyRegistered.value = true;
    setTimeout(() => (isAlreadyRegistered.value = false), 3500);
  } else if (success) {
    isRegisterSucess.value = true;
    resetForm();
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/LoginRegister.scss";
</style>
