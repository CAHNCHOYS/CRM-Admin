<template>
  <div class="fullscreen h-100 d-flex justify-center align-center">
    <VDialogTransition mode="out-in">
      <VAlert
        class="alert"
        type="success"
        border="start"
        :max-width="450"
        closable
        close-label="Закрыть уведомление"
        v-if="isRegisterSucess"
      >
        <VAlertTitle class="text-h4 mb-2 text-weight-bold"> Успех </VAlertTitle>

        <div class="text-white text-h6">
          Вы успешно зарегистрировались, можете перейти на страницу входа
        </div>
      </VAlert>
    </VDialogTransition>

    <VDialogTransition mode="out-in">
      <VAlert class="alert" type="error" :max-width="480" border="start" v-if="isRegistrationError">
        <VAlertTitle class="mb-2">Произошла ошибка </VAlertTitle>
        <div class="text-white text-h6">
          {{ errorMessage }}
        </div>
      </VAlert>
    </VDialogTransition>

    <VDialogTransition mode="out-in">
      <VAlert
        class="alert"
        type="warning"
        :max-width="450"
        border="start"
        v-if="isAlreadyRegistered"
      >
        <VAlertTitle class="text-h4 mb-2">Упс </VAlertTitle>
        <div class="text-white text-h6">Пользователь с таким email уже зарегистрирован !</div>
      </VAlert>
    </VDialogTransition>

    <VCard class="form-card flex-grow-1 pb-8 rounded-lg" :max-width="486" :elevation="0">
      <div class="form-title font-weight-bold text-center text-h4 py-4">Регистрация</div>

      <VCardActions class="pt-4 pb-1 px-lg-10 px-md-8 px-4">
        <VForm @submit="registerSubmit" class="fullscreen__form w-100">
          <VCardTitle class="text-indigo-darken-2 text-center mb-2 px-0">
            Введите ваши данные</VCardTitle
          >

          <VRow no-gutters>
            <VCol class="mb-2" cols="12">
              <VTextField
                v-model="name"
                :error-messages="nameErrors"
                placeholder="Ваше имя"
                hint="Ваше настоящее имя"
                variant="outlined"
                :bg-color="'rgba(229, 229, 229, 0.25)'"
                clearable
              >
                <template #prepend-inner>
                  <VIcon class="icon mr-lg-3 mr-1" icon="mdi-clipboard-account" size="large" />
                </template>
              </VTextField>
            </VCol>
            <VCol class="mb-2" cols="12">
              <VTextField
                v-model="email"
                :error-messages="emailErrors"
                placeholder="Ваша почта"
                hint="Ваш адрес электронной почты"
                variant="outlined"
                :bg-color="'rgba(229, 229, 229, 0.25)'"
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
                type="password"
                placeholder="Ваш пароль"
                hint="Ваш пароль для входа на сайт"
                variant="outlined"
                :bg-color="'rgba(229, 229, 229, 0.25)'"
                clearable
              >
                <template #prepend-inner>
                  <VIcon class="icon mr-lg-3 mr-1" icon="mdi-lock" size="large" />
                </template>
              </VTextField>
            </VCol>
            <VCol cols="12">
              <VTextField
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
                  <VIcon class="icon mr-lg-3 mr-1" icon="mdi-lock" size="large" />
                </template>
              </VTextField>
            </VCol>
            <VCol class="mb-2" cols="12">
              <VCheckbox
                v-model="agreement"
                :error-messages="agreementErrors"
                density="compact"
                label="Вы согласны на обработку данных?"
              />
            </VCol>

            <VCol cols="12">
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
                <span class="text-white text-h6 font-weight-medium">Зарегистрироваться</span>
              </VBtn>
            </VCol>

            <VCol cols="12">
              <VScaleTransition>
                <VBtn
                  block
                  variant="flat"
                  color="success"
                  class="mt-5"
                  :height="50"
                  v-if="isRegisterSucess"
                >
                  <RouterLink to="/login" class="text-white text-h6 font-weight-medium"
                    >Перейти к авторизации</RouterLink
                  >
                </VBtn>
              </VScaleTransition>
            </VCol>
          </VRow>
        </VForm>
      </VCardActions>
    </VCard>

    <VImg cover class="bg-image" :src="bg" alt="Оффис" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import bg from "@/assets/Images/LoginRegister/bg2.jpg";
import { useFormSchemas } from "@/composables/useFormSchemas";
import { useField, useForm } from "vee-validate";
import { registerUser } from "@/api/registerUser";

const isRegistrationError = ref(false);
const isAlreadyRegistered = ref(false);
const isRegisterSucess = ref(false);
const errorMessage = ref("");

//Валидация формы----------------------------------------------
const { registerSchema } = useFormSchemas();

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: registerSchema
});

const { value: name, errorMessage: nameErrors } = useField("name");
const { value: email, errorMessage: emailErrors } = useField("email");
const { value: password, errorMessage: passwordErrors } = useField("password");
const { value: passwordConfirm, errorMessage: passwordConfirmErrors } = useField("passwordConfirm");
const { value: agreement, errorMessage: agreementErrors } = useField("agreement");
//--------------------------------------------------------------

const registerSubmit = handleSubmit(async (values) => {
  console.log(values);

  const { success, alreadyRegistered, error } = await registerUser({
    name: values.name,
    email: values.email,
    password: values.password
  });

  console.log(alreadyRegistered, success, error);

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
