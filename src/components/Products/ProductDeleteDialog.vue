<template>
  <v-dialog :model-value="modelValue" :max-width="450" persistent>
    <v-card class="pa-4">
      <v-card-title class="pa-0 mb-3">
        <p class="font-weight-bold text-h5">Подтверждение удаления</p>
      </v-card-title>
      <v-card-text class="pa-0">
        <p class="text-h6">
          Вы уверены что хотите удалить товар
          <span class="text-red">{{ props.product?.name }} </span> с базы данных ?
        </p>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn @click="$emit('close')" height="40" color="orange" variant="flat">
          <span class="text-white">Нет</span>
        </v-btn>
        <v-btn
          height="40"
          :loading="isProductActionLoading"
          color="error"
          variant="flat"
          @click="deleteProduct"
          >Да</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useUserProductsStore } from "@/stores/userProducts";

import { storeToRefs } from "pinia";
import type { IUserProduct } from "@/types/interfaces";

const props = defineProps<{
  product: IUserProduct;
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const userProductsStore = useUserProductsStore();

const { deleteUserProduct } = userProductsStore;
const { isProductActionLoading } = storeToRefs(userProductsStore);

const deleteProduct = async () => {
  isProductActionLoading.value = true;

  await deleteUserProduct(props.product.id);

  isProductActionLoading.value = false;
  emit("close");
};
</script>

<style scoped></style>
