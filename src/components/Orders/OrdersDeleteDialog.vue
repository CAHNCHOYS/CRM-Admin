<template>
  <v-dialog
    scrollable
    width="auto"
    :model-value="isOpened"
    @update:model-value="$emit('closeDialog')"
    persistent
  >
    <v-card width="450" elevation="3" class="pa-4">
      <v-card-title class="font-weight-bold text-h6 mb-4 pa-0">Удаление заказа</v-card-title>
      <v-card-text class="mb-4 pa-0">
        <p class="text-h6">
          Вы уверены что хотите удалить заказ за {{ order.date }} клиента
          <span class="text-error"> {{ order.customerFullName }} </span> ?
        </p>
      </v-card-text>
      <v-card-actions class="pa-0">
        <v-btn @click="$emit('closeDialog')" height="40" color="blue-darken-4" variant="flat">
          Нет
        </v-btn>
        <v-btn
          height="40"
          color="error"
          variant="flat"
          :loading="isDeleting"
          @click="deleteOrderSubmit"
          >Да</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAlertStore } from "@/stores/alert";
import { useRouter } from "vue-router";
import { useUserOrdersStore } from "@/stores/userOrders";

import { handleAxiosError, isAxiosError } from "@/services/axioxErrorHandle";
import OrderService from "@/services/OrderService";

import type { IUserOrder } from "@/types/interfaces";

const props = defineProps<{
  isOpened: boolean;
  order: IUserOrder;
  isSearchActive: boolean;
}>();

const emit = defineEmits<{
  (e: "closeDialog"): void;
  (e: "updateSearchOrders"): Promise<void>;
}>();

const isDeleting = ref(false);

const alertStore = useAlertStore();
const userOrdersStore = useUserOrdersStore();

const router = useRouter();

const deleteOrderSubmit = async () => {
  try {
    isDeleting.value = true;
    await OrderService.deleteOrder(props.order.id);

    userOrdersStore.deleteOrder(props.order.id);
    if(props.isSearchActive) emit("updateSearchOrders")
    alertStore.showMessage("success", "Заказ был успешно удален!");
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        router.push({
          name: "login-page",
          query: { isExpiredToken: "true", redirectedFrom: "orders-page" }
        });
        return;
      } 
      alertStore.showMessage("error", handleAxiosError(error));
    } else alertStore.showMessage("error", "Ошибка при удалении заказа");
  } finally {
    isDeleting.value = false;
    emit("closeDialog");
  }
};
</script>

<style scoped></style>
