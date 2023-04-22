<template>
  <div>
    <div class="text-h5 mb-4">Общая информация об аккаунте</div>

    <v-form @submit.prevent="updateInfoSubmit" enctype="multipart/form-data">
      <v-row align="center">
        <v-col md="6" cols="12">
          <div class="d-flex flex-sm-row flex-column align-sm-center">
            <v-avatar
              size="80"
              class="mr-sm-3 mb-sm-0 mb-4 border mx-auto"
              :image="
                previewAvatarImage
                || `https://crm-backend-mocha.vercel.app/UserAvatars/${userAuthStore.currentUser!.avatar}`
              "
            />
            <v-file-input
              v-model="avatar"
              :error-messages="avatarErrorMessages"
              show-size
              prepend-icon="mdi-camera"
              hide-details="auto"
              label="Загрузите ваш аватар"
              accept=".jpg, .png, .jpeg, .svg , .webp"
              @change="setImagePreview"
              @click:clear="clearPreviewImage"
            />
          </div>
        </v-col>
        <v-col sm="6" cols="12">
          <v-text-field v-model="name" :error-messages="nameErrors" label="Ваше имя" />
        </v-col>
        <v-col sm="6" cols="12">
          <v-text-field v-model="email" :error-messages="emailErrors" label="Ваша почта" />
        </v-col>

        <v-col sm="6" cols="12">
          <v-select
            v-model="country"
            :error-messages="countryErrors"
            :items="['Россия', 'Беларусь', 'Латвия', 'Украина', 'Казахстан', 'Узбекистан']"
            label="Страна проживания"
          />
        </v-col>

        <v-col cols="12">
          <v-btn type="submit" variant="flat" :loading="isSubmitting" color="green">
            <span class="text-h6">Обновить данные </span>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import { useFormSchemas } from "@/composables/useFormSchemas";
import { useField, useForm } from "vee-validate";

import { useUserAuthStore } from "@/stores/userAuth";

import AuthService from "@/services/AuthService";
import { handleAxiosError, isAxiosError } from "@/services/axioxErrorHandle";

import type { UpdateInfoFields } from "@/types/Forms";

const emit = defineEmits<{
  (e: "showMessage", type: "error" | "success", message: string): void;
}>();

const userAuthStore = useUserAuthStore();

//---------------- Валидация формы -------------------------------------------------------------

//Начальные значения формы
const initialFormValues = computed(() => ({
  name: userAuthStore.currentUser?.name || "user logged out",
  email: userAuthStore.currentUser?.email || "user logged out",
  country: userAuthStore.currentUser?.country || "user logged out",
  avatar: []
}));
const { updateInfoShchema } = useFormSchemas();
const { handleSubmit, isSubmitting } = useForm<UpdateInfoFields>({
  validationSchema: updateInfoShchema,
  initialValues: initialFormValues
});
const { value: name, errorMessage: nameErrors } = useField<string>("name");
const { value: email, errorMessage: emailErrors } = useField<string>("email");
const { value: country, errorMessage: countryErrors } = useField<string>("country");
const { value: avatar, errorMessage: avatarErrorMessages } = useField<File[]>("avatar");
//--------------------------------------------------------------------------------------------

const router = useRouter();

const updateInfoSubmit = handleSubmit(async (values: UpdateInfoFields) => {
  try {
    let formData = new FormData();

    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("country", values.country);
    formData.append("avatar", values.avatar[0], avatar.value[0].name);

    await AuthService.updateInfo(formData);

    const { data } = await AuthService.getUser();

    userAuthStore.setUser(data.user);

    emit("showMessage", "success", "Данные были обновлены!");
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        router.push({
          name: "login-page",
          query: { isExpiredToken: "true", redirectedFrom: "account-page" }
        });
      }
      emit("showMessage", "error", handleAxiosError(error));
    } else emit("showMessage", "error", "Ошибка при изменении данных!");
  }
});

//Предпросмотр аватара  пользователя---
const previewAvatarImage = ref("");

function setImagePreview(e: Event): void {
  const file: File = (<HTMLInputElement>e.target).files![0];
  previewAvatarImage.value = URL.createObjectURL(file);
  console.log(URL.createObjectURL(file));
}
function clearPreviewImage(): void {
  previewAvatarImage.value = "";
}
//-------------------------------------
</script>

<style lang="scss" scoped></style>
