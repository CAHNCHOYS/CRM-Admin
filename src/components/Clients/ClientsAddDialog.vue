<template>
  <v-dialog
    :model-value="isOpened"
    @update:model-value="emit('closeModal')"
    width="auto"
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card color="white" class="pa-4" width="450">
      <v-card-title class="font-weight-bold text-h6 mb-3"> Добавление нового клиента </v-card-title>

      <v-card-actions>
        <v-form @submit="addClientSubmit">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="firstName" :error-messages="firstNameErrors" label="Имя">
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="secondName" :error-messages="secondNameErrors" label="Фамилия">
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="thirdName" :error-messages="thirdNameErrors" label="Отчество">
              </v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field label="Номер телефона" v-model="phone" :error-messages="phoneErrors">
              </v-text-field>
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
                Добавить
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
import { addClient } from "@/services/ClientsService";
import { useUserClientsStore } from "@/stores/userClients";
import { useAlertStore } from "@/stores/alert";
import { useUserAuthStore } from "@/stores/userAuth";
import type { UserClientFields } from "@/types/Forms";
import { isAxiosError } from "axios";
import { handleAxiosError } from "@/services/axioxErrorHandle";

const props = defineProps<{
  isOpened: boolean;
}>();

const emit = defineEmits<{
  (e: "closeModal"): void;
}>();

const { userClientSchema } = useFormSchemas();
const { resetForm, handleSubmit, isSubmitting } = useForm<UserClientFields>({
  validationSchema: userClientSchema
});
const { value: firstName, errorMessage: firstNameErrors } = useField<string>("firstName");
const { value: secondName, errorMessage: secondNameErrors } = useField<string>("secondName");
const { value: thirdName, errorMessage: thirdNameErrors } = useField<string>("thirdName");
const { value: phone, errorMessage: phoneErrors } = useField<string>("phone");
const { value: premium } = useField<0 | 1>("premium");

const alertStore = useAlertStore();
const userAuthStore = useUserAuthStore();
const userClientsStore = useUserClientsStore();

const addClientSubmit = handleSubmit(async (values: UserClientFields) => {
  console.log(values);

  try {
    const { data } = await addClient(values, userAuthStore.currentUser!.id);

    userClientsStore.addClient({ ...values, id: data.clientId });

    alertStore.showMessage("success", "Клиент " + values.secondName + " был успешно добавлен!");
  } catch (error) {
    if (isAxiosError(error)) {
      alertStore.showMessage("error", handleAxiosError(error));
    } else alertStore.showMessage("error", "Ошибка при добавлении клиента");
  } finally {
    emit("closeModal");
    resetForm();
  }
});
</script>

<style scoped></style>
