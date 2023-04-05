<template>
  <v-dialog
    :model-value="isOpened"
    @update:model-value="$emit('closeModal')"
    scrollable
    width="auto"
  >
    <v-card width="450" color="white" class="pa-4">
      <v-card-title class="text-h6 font-weight-bold"> Редактирование клиента </v-card-title>
      <v-card-actions>
        <v-form @submit="updateClientSubmit">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="firstName" :error-messages="firstNameErrors" label="Имя" />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="secondName"
                :error-messages="secondNameErrors"
                label="Фамилия"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="thirdName"
                :error-messages="thirdNameErrors"
                label="Отчество"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field label="Номер телефона" v-model="phone" :error-messages="phoneErrors" />
            </v-col>
            <v-col cols="12">
              <p class="text-h6">Премиум клиент ?</p>
              <v-switch
                v-model="premium"
                :true-value="1"
                :false-value="0"
                hide-details
                :label="premium ? 'Да' : 'Нет'"
                color="indigo"
              />
            </v-col>

            <v-col cols="12">
              <v-btn color="green-darken-4" variant="flat" type="submit" :loading="isSubmitting">
                Обновить 
              </v-btn>
              <v-btn color="blue-darken-4" variant="flat" @click="$emit('closeModal')">
                Отмена
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { useFormSchemas } from "@/composables/useFormSchemas";
import { updateClient } from "@/services/ClientsService";
import { useUserClientsStore } from "@/stores/userClients";
import { useAlertStore } from "@/stores/alert";

import { isAxiosError } from "axios";
import { handleAxiosError } from "@/services/axioxErrorHandle";

import type { UserClientFields } from "@/types/Forms";
import type { IUserClient } from "@/types/interfaces";
import { computed } from "@vue/reactivity";

const props = defineProps<{
  isOpened: boolean;
  client: IUserClient;
}>();

const emit = defineEmits<{
  (e: "closeModal"): void;
}>();

//Работа с формой--------------------------------------------------------------
const initialFormValues = computed(() => ({
  firstName: props.client.firstName,
  secondName: props.client.secondName,
  thirdName: props.client.thirdName,
  phone: props.client.phone,
  premium: props.client.premium
}));

const { userClientSchema } = useFormSchemas();
const { resetForm, handleSubmit, isSubmitting } = useForm<UserClientFields>({
  validationSchema: userClientSchema,
  initialValues: initialFormValues
});
const { value: firstName, errorMessage: firstNameErrors } = useField<string>("firstName");
const { value: secondName, errorMessage: secondNameErrors } = useField<string>("secondName");
const { value: thirdName, errorMessage: thirdNameErrors } = useField<string>("thirdName");
const { value: phone, errorMessage: phoneErrors } = useField<string>("phone");
const { value: premium } = useField<0 | 1>("premium");
//-------------------------------------------------------------------------------

const alertStore = useAlertStore();
const userClientsStore = useUserClientsStore();

const updateClientSubmit = handleSubmit(async (values: UserClientFields) => {
  console.log(values);
  try {
    await updateClient(values, props.client.id);
    userClientsStore.updateClient({ ...values, id: props.client.id });
    alertStore.showMessage("success", "Клиент был успешно изменен");
  } catch (error) {
    if (isAxiosError(error)) {
      alertStore.showMessage("error", handleAxiosError(error));
    } else alertStore.showMessage("error", "Ошибка при изменении клиента");
  } finally {
    resetForm();
    emit("closeModal");
  }
});
</script>

<style scoped></style>
