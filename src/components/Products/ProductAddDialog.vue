<template>
  <v-dialog max-width="500" @update:model-value="$emit('close')" :model-value="isActive">
    <v-card class="pa-5" color="white" elevation="4">
      <v-card-title>
        <p class="text-h6 font-weight-bold mb-4">Добавление товара товара</p>
      </v-card-title>

      <v-card-actions>
        <v-form @submit.prevent="addProductSubmit">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="name" :error-messages="nameErrors" label="Название товара" />
            </v-col>

            <v-col cols="12">
              <v-select
                v-model="categoryId"
                label="Категория товара"
                :error-messages="categoryIdErrors"
                :items="categories"
                item-title="name"
                item-value="id"
                v-if="categories.length"
              />
              <p v-if="isCategoriesLoadError" class="text-h6 text-red">
                {{ categoriesLoadErroMessage }}
              </p>
            </v-col>

            <v-col cols="6">
              <v-text-field
                v-model="count"
                :error-messages="countErrors"
                label="Количество"
                type="number"
              />
            </v-col>

            <v-col cols="6">
              <v-text-field
                v-model="price"
                :error-messages="priceErrors"
                label="Цена"
                type="number"
              />
            </v-col>

            <v-col cols="12">
              <v-btn color="green" variant="flat" :loading="isSubmitting" type="submit">
                Добавить
              </v-btn>
              <v-btn color="info" variant="flat" @click="$emit('close')"> Отмена </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useForm, useField } from "vee-validate";
import { useFormSchemas } from "@/composables/useFormSchemas";
import { useProductsCategoiresFetch } from "@/composables/useProductsCategoriesFetch";
import { useUserProductsStore } from "@/stores/userProducts";

import type { UserProductFields } from "@/types/FormFields";

const props = defineProps<{
  isActive: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();
//-----------------------------------------------------------
const { userProductSchema } = useFormSchemas();

const { handleSubmit, isSubmitting, resetForm } = useForm<UserProductFields>({
  validationSchema: userProductSchema
});
const { value: name, errorMessage: nameErrors } = useField("name");
const { value: categoryId, errorMessage: categoryIdErrors } = useField("categoryId");
const { value: count, errorMessage: countErrors } = useField("count");
const { value: price, errorMessage: priceErrors } = useField("price");
//-----------------------------------------------------------

const { addUserProduct } = useUserProductsStore();

const { categories, isCategoriesLoadError, categoriesLoadErroMessage } =
  useProductsCategoiresFetch();

const addProductSubmit = handleSubmit(async (values) => {
  console.log(values);
  await addUserProduct(values);
  resetForm();
  emit("close");
});
</script>

<style scoped></style>