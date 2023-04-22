<template>
  <v-dialog
    :model-value="isActive"
    :max-width="450"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="pa-4">
      <v-card-title class="pa-0 mb-3">
        <p class="font-weight-bold text-h5">Подтверждение удаления</p>
      </v-card-title>
      <v-card-text class="pa-0 mb-4">
        <p class="text-h6">
          Вы уверены что хотите удалить товар
          <span class="text-red">{{ props.product.name }} </span> из списка?
        </p>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn @click="$emit('closeModal')" height="40" color="blue-darken-4" variant="flat">
          <span class="text-white">Нет</span>
        </v-btn>
        <v-btn
          height="40"
          :loading="isDeleting"
          color="error"
          variant="flat"
          @click="deletUserProduct"
          >Да</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useUserProductsStore } from "@/stores/userProducts";
import { useAlertStore } from "@/stores/alert";
import ProductService from "@/services/ProductService";

import { handleAxiosError, isAxiosError } from "@/services/axioxErrorHandle";

import type { IUserProduct } from "@/types/interfaces";

const props = defineProps<{
  product: IUserProduct;
  isActive: boolean;
  isSearchActive: boolean;
}>();

const emit = defineEmits<{
  (e: "closeModal"): void;
  (e: "updateSearchProducts"): Promise<void>;
}>();

const isDeleting = ref(false);

const userProductsStore = useUserProductsStore();
const alertStore = useAlertStore();

const router = useRouter();

const deletUserProduct = async () => {
  try {
    isDeleting.value = true;
    await ProductService.deleteProduct(props.product.id);

    userProductsStore.deleteUserProduct(props.product.id);
    if (props.isSearchActive) emit("updateSearchProducts");

    alertStore.showMessage("success", "Товар был успешно удален");
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        router.push({
          name: "login-page",
          query: { isExpiredToken: "true", redirectedFrom: "products-page" }
        });
        return;
      }
      alertStore.showMessage("error", handleAxiosError(error));
    } else alertStore.showMessage("error", "Ошибка при удалении товара!");
  } finally {
    isDeleting.value = false;
    emit("closeModal");
  }
};
</script>

<style scoped></style>
