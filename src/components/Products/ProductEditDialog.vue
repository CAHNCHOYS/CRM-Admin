<template>
  <v-dialog
    transition="dialog-bottom-transition"
    max-width="500"
    @update:model-value="$emit('closeModal')"
    :model-value="isActive"
  >
    <v-card class="pa-5" color="white" elevation="4">
      <v-card-title>
        <p class="text-h6 font-weight-bold mb-4">Редактирование товара</p>
      </v-card-title>

      <v-card-actions>
        <v-form @submit.prevent="updateProductSubmit">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="name" :error-messages="nameErrors" label="Название товара" />
            </v-col>

            <v-col cols="12">
              <v-select
                v-model="categoryId"
                label="Категория товара"
                :error-messages="categoryIdErrors"
                :items="productsCategories"
                item-title="name"
                item-value="id"
                v-if="productsCategories.length"
              />
              <p v-if="categoriesErrorMessage" class="text-h6 text-red">
                {{ categoriesErrorMessage }}
              </p>
            </v-col>

            <v-col sm="6" cols="12">
              <v-text-field
                v-model="count"
                :error-messages="countErrors"
                label="Количество"
                type="number"
              />
            </v-col>

            <v-col sm="6" cols="12">
              <v-text-field
                v-model="price"
                :error-messages="priceErrors"
                label="Цена"
                type="number"
                suffix="руб"
              />
            </v-col>

            <v-col cols="12">
              <v-btn color="green-darken-4" variant="flat" :loading="isSubmitting" type="submit">
                Сохранить
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
import { useRouter } from "vue-router";
import { computed } from "vue";
import { storeToRefs } from "pinia";

import { useForm, useField } from "vee-validate";
import { useFormSchemas } from "@/composables/useFormSchemas";

import { useUserProductsStore } from "@/stores/userProducts";
import { useAlertStore } from "@/stores/alert";

import { updateProduct } from "@/services/ProductService";
import { handleAxiosError, isAxiosError } from "@/services/axioxErrorHandle";

import type { UserProductFields } from "@/types/Forms";
import type { IUserProduct } from "@/types/interfaces";



const props = defineProps<{
  isActive: boolean;
  product: IUserProduct;
}>();

const emit = defineEmits<{
  (e: "closeModal"): void;
}>();

//------------Работа с формой-------------------------------
const initialFormValues = computed(() => ({
  name: props.product?.name || "Товар не был выбран",
  price: props.product?.price || 0,
  count: props.product?.count || 0,
  categoryId: props.product?.categoryId || 0
}));

const { userProductSchema } = useFormSchemas();

const { handleSubmit, isSubmitting, resetForm } = useForm<UserProductFields>({
  validationSchema: userProductSchema,
  initialValues: initialFormValues
});
const { value: name, errorMessage: nameErrors } = useField("name");
const { value: price, errorMessage: priceErrors } = useField("price");
const { value: count, errorMessage: countErrors } = useField("count");
const { value: categoryId, errorMessage: categoryIdErrors } = useField("categoryId");
//------------------------------------------------------------

const userProductsStore = useUserProductsStore();
const alertStore = useAlertStore();

const { productsCategories, categoriesErrorMessage } = storeToRefs(userProductsStore);
const router = useRouter();

const updateProductSubmit = handleSubmit(async (values: UserProductFields) => {
  try {
    const { data } = await updateProduct(values, props.product.id);

    userProductsStore.updateUserProduct({ ...values, ...data });
    alertStore.showMessage("success", "Товар был изменен");
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        router.push({
          name: "login-page",
          query: {
            isExpiredToken: "true"
          }
        });
      }
      alertStore.showMessage("error", handleAxiosError(error));
    } else alertStore.showMessage("error", "Ошибка при обновлении товара!");
  } finally {
    resetForm();
    emit("closeModal");
  }
});
</script>

<style scoped></style>
