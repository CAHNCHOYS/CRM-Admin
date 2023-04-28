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

      <v-card-text class="text-h6 mb-4 pa-0">
        Вы уверены что хотиет удалить клиента
        <span class="text-error">
          {{ customer.firstName + " " + customer.secondName }}
        </span>
        ?
      </v-card-text>
      <v-card-actions class="justify-center pa-0">
        <v-btn @click="$emit('closeDialog')" height="40" color="blue-darken-4" variant="flat">
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
import { useUserCustomersStore } from "@/stores/userCustomers";

import { useLogoutHandler } from "@/composables/useLogoutHandler";

import { handleAxiosError, isAxiosError } from "@/services/axioxErrorHandle";
import CustomerService from "@/services/CustomersService";

import type { IUserCustomer } from "@/types/interfaces";

const props = defineProps<{
  isOpened: boolean;
  customer: IUserCustomer;
  isSearchActive: boolean;
}>();

const emit = defineEmits<{
  (e: "closeDialog"): void;
  (e: "updateSearchCustomers"): Promise<void>;
}>();

const alertStore = useAlertStore();
const userCustomersStore = useUserCustomersStore();
const { handleLogout } = useLogoutHandler("customers-page");

const isDeleting = ref(false);

const deleteSubmit = async () => {
  try {
    isDeleting.value = true;
    await CustomerService.deleteCustomer(props.customer.id);
    userCustomersStore.deleteCustomer(props.customer.id);
    if (props.isSearchActive) emit("updateSearchCustomers");

    alertStore.showMessage("success", "Клиент был успешно удален!");
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        await handleLogout();
        return;
      }
      alertStore.showMessage("error", handleAxiosError(error));
    } else alertStore.showMessage("error", "Ошибка при удалении клиента!");
  } finally {
    isDeleting.value = false;
    emit("closeDialog");
  }
};
</script>

<style scoped></style>
