<template>
  <v-dialog
    transition="dialog-bottom-transition"
    max-width="500"
    @update:model-value="$emit('closeDialog')"
    scrollable
    :model-value="isActive"
  >
    <v-card class="pa-5" color="white" elevation="4">
      <v-card-title>
        <p class="text-h6 font-weight-bold mb-4">Добавление нового товара</p>
      </v-card-title>

      <v-card-actions>
        <v-form @submit.prevent="addProductSubmit">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="name" :error-messages="nameErrors" label="Название товара" />
            </v-col>

            <v-col cols="12">
              <v-sheet v-if="isCategoriesLoading">
                <p class="text-h6 mb-2">Загрузка категорий....</p>
                <v-progress-linear indeterminate height="6" color="green" />
              </v-sheet>
              <v-autocomplete
                v-model="categoryId"
                label="Категория товара"
                :error-messages="categoryIdErrors"
                :items="productsCategories"
                item-title="name"
                :clearable="false"
                item-value="id"
                no-data-text="Нет категорий"
                v-else-if="!categoriesErrorMessage"
              />
              <v-sheet v-else>
                <v-alert type="error" border="end" variant="outlined" class="pa-2">
                  <v-alert-title class="text-h6"> {{ categoriesErrorMessage }}</v-alert-title>
                </v-alert>
              </v-sheet>
            </v-col>

            <v-col sm="6" cols="12">
              <v-text-field
                v-model.number="count"
                :error-messages="countErrors"
                label="Количество"
                type="number"
              />
            </v-col>

            <v-col sm="6" cols="12">
              <v-text-field
                v-model.number="price"
                :error-messages="priceErrors"
                label="Цена"
                suffix="руб"
                type="number"
              />
            </v-col>

            <v-col cols="12">
              <v-btn color="green-darken-4" variant="flat" :loading="isSubmitting" type="submit">
                Добавить
              </v-btn>
              <v-btn color="blue-darken-4" variant="flat" @click="$emit('closeDialog')">
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
import { storeToRefs } from "pinia";
import { useForm, useField } from "vee-validate";

import { useLogoutHandler } from "@/composables/useLogoutHandler";
import { useFormSchemas } from "@/composables/useFormSchemas";

import { useUserProductsStore } from "@/stores/userProducts";
import { useAlertStore } from "@/stores/alert";

import ProductService from "@/services/ProductService";
import { handleAxiosError, isAxiosError } from "@/services/axioxErrorHandle";

import type { UserProductFields } from "@/types/Forms";

const props = defineProps<{
  isActive: boolean;
}>();

const emit = defineEmits<{
  (e: "closeDialog"): void;
}>();

//----Валидация формы-------------------------------------------------------
const { userProductSchema } = useFormSchemas();
const { handleSubmit, isSubmitting, resetForm } = useForm<UserProductFields>({
  validationSchema: userProductSchema
});
const { value: name, errorMessage: nameErrors } = useField("name");
const { value: categoryId, errorMessage: categoryIdErrors } = useField("categoryId");
const { value: count, errorMessage: countErrors } = useField("count");
const { value: price, errorMessage: priceErrors } = useField("price");
//----------------------------------------------------------------------------

const userProductsStore = useUserProductsStore();
const alertStore = useAlertStore();
const { handleLogout } = useLogoutHandler("products-page");

const { productsCategories, categoriesErrorMessage, isCategoriesLoading } =
  storeToRefs(userProductsStore);

const addProductSubmit = handleSubmit(async (values: UserProductFields) => {
  try {
    const { data } = await ProductService.addProduct(values);

    const category = productsCategories.value.find(
      (category) => category.id === values.categoryId
    )!.name;

    userProductsStore.addUserProduct({ ...values, id: data.productId, category });
    alertStore.showMessage("success", `Товар ${values.name} был успешно добавлен!`);
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        await handleLogout();
        return;
      }
      alertStore.showMessage("error", handleAxiosError(error));
    } else alertStore.showMessage("error", "Ошибка при добавлении товара !");
  } finally {
    resetForm();
    emit("closeDialog");
  }
});
</script>

<style scoped></style>
