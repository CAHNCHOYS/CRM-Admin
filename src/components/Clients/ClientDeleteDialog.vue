<template>
  <v-dialog
    width="auto"
    :model-value="isOpened"
    :persistent="true"
    transition="dialog-bottom-transition"
  >
    <v-card color="white" class="pa-4" :max-width="450">
      <v-card-title class="text-h5 mb-4 pa-0 font-weight-bold"
        >Подтвердите удаление клиента</v-card-title
      >

      <v-card-text class="text-h6 mb-3 pa-0">
        Вы уверены что хотиет удалить клиента
        <span class="text-error">
          {{ client.firstName + " " + client.secondName }}
        </span>
        ?
      </v-card-text>
      <v-card-actions class="justify-center pa-0">
        <v-btn @click="$emit('closeModal')" height="40" color="blue-darken-4" variant="flat">
          Нет
        </v-btn>
        <v-btn height="40" color="error" variant="flat" :loading="isDeleting" @click="deleteSubmit"
          >Да</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAlertStore } from "@/stores/alert";
import { useUserClientsStore } from "@/stores/userClients";

import { handleAxiosError } from "@/services/axioxErrorHandle";
import { isAxiosError } from "axios";
import { deleteClient } from "@/services/ClientsService";

import type { IUserClient } from "@/types/interfaces";

const props = defineProps<{
  isOpened: boolean;
  client: IUserClient;
}>();

const emit = defineEmits<{
  (e: "closeModal"): void;
}>();


const alertStore = useAlertStore();
const userClientsStore = useUserClientsStore();

const isDeleting = ref(false);
const deleteSubmit = async () => {
  try {
    isDeleting.value = true;
    await deleteClient(props.client.id);
    userClientsStore.deleteClient(props.client.id);
    alertStore.showMessage("success", "Клиент был успешно удален!");
  } catch (error) {
    if (isAxiosError(error)) {
      alertStore.showMessage("error", handleAxiosError(error));
    } else alertStore.showMessage("error", "Ошибка при удалении клиента!");
  } finally {
    emit("closeModal");
    isDeleting.value = false;
  }
};
</script>

<style scoped></style>
