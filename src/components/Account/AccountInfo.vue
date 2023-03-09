<template>
  <div>
    <div class="text-h5 mb-4">Общая информация об аккаунте</div>

    <v-snackbar location="right bottom" :max-width="400" color="success" v-model="isInfoUpdated">
      <div class="text-h6">Данные были успешно обновлены!</div>
    </v-snackbar>

    <v-snackbar location="right bottom" color="error" :max-width="400" v-model="isInfoUpdateError">
      <div class="text-h6">
        Ошибка при обновлении информации! Попробуйте повторить позже.
        <p>{{ errorMessage }}</p>
      </div>
    </v-snackbar>

    <v-form @submit.prevent="updateInfoSubmit" enctype="multipart/form-data">
      <v-row align="center">
        <v-col cols="6">
          <div class="d-flex align-center">
            <v-avatar
              size="80"
              class="mr-4"
              :image="
                previewAvatarImage
                || `http://localhost:3000/UserAvatars/${userAuthStore.currentUser!.avatar}`
              "
            />
            <v-file-input
              v-model="avatar"
              :error-messages="avatarErrorMessages"
              hide-details="auto"
              label="Загрузите ваш аватар"
              show-size
              accept=".jpg, .png, .jpeg, .svg"
              @change="setImagePreview"
              @click:clear="clearPreviewImage"
            />
          </div>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="name" :error-messages="nameErrors" label="Ваше имя">
          </v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="email" :error-messages="emailErrors" label="Ваша почта">
          </v-text-field>
        </v-col>

        <v-col cols="6">
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
import { computed, ref } from "@vue/reactivity";

import { useFormSchemas } from "@/composables/useFormSchemas";
import { useField, useForm } from "vee-validate";

import { useUserAuthStore } from "@/stores/userAuth";
import type { UpdateInfoFields } from "@/types/FormFields";


const userAuthStore = useUserAuthStore();

const { updateInfoShchema } = useFormSchemas();


//Начальные значения формы
const initialFormValues = computed(() => ({
  name: userAuthStore.currentUser!.name,
  email: userAuthStore.currentUser!.email,
  country: userAuthStore.currentUser!.country,
  avatar: [],
}));

//---------------- Валидация формы -------------------------------------------------------------
const { handleSubmit, isSubmitting } = useForm<UpdateInfoFields>({
  validationSchema: updateInfoShchema,
  initialValues: initialFormValues
});

const { value: name, errorMessage: nameErrors } = useField<string>("name");
const { value: email, errorMessage: emailErrors } = useField<string>("email");
const { value: country, errorMessage: countryErrors } = useField<string>("country");
const { value: avatar, errorMessage: avatarErrorMessages } = useField<File[]>("avatar");

//--------------------------------------------------------------------------------------------



const isInfoUpdated = ref(false);
const isInfoUpdateError = ref(false);

const errorMessage = ref("");

const updateInfoSubmit = handleSubmit(async (values) => {
  console.log(values);
  //  console.log(previewAvatarImage.value);
  let data = new FormData();

  data.append("name", values.name);
  data.append("email", values.email);
  data.append("country", values.country);
  data.append("avatar", values.avatar[0], avatar.value[0].name);
  data.append("id", String(userAuthStore.currentUser!.id));

  const updateResult = await userAuthStore.updateUserInfo(data, values);
  console.log(updateResult);

  if (updateResult.errorMessage) {
    isInfoUpdateError.value = true;
    errorMessage.value = updateResult.errorMessage;
    setTimeout(() => (isInfoUpdateError.value = false), 3500);
    
  } else if (updateResult.isInfoUpdated) {
    isInfoUpdated.value = true;
    setTimeout(() => (isInfoUpdated.value = false), 3500);
  }
  
});



//Предпросмотр аватара  пользователя---
const previewAvatarImage = ref("");

async function setImagePreview(e: Event): Promise<void> {
  const file: any = (e.target as any).files[0];
  previewAvatarImage.value = URL.createObjectURL(file);
  console.log(URL.createObjectURL(file));
}
function clearPreviewImage() {
  previewAvatarImage.value = "";
}
//-------------------------------------





</script>

<style lang="scss" scoped></style>
