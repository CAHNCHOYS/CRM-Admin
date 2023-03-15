<template>
  <v-dialog   transition="dialog-bottom-transition" max-width="500" @update:model-value="$emit('closeModal')" :model-value="isActive">
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
                :items="categories"
                item-title="name"
                item-value="id"
                v-if="categories.length"
              />
              <p v-if="isCategoriesLoadError" class="text-h6 text-red">
                {{ categoriesLoadErrorMessage }}
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
                suffix="руб"
              />
            </v-col>

            <v-col cols="12">
              <v-btn color="green-darken-4" variant="flat" :loading="isSubmitting" type="submit">
                Сохранить
              </v-btn>
              <v-btn color="blue-darken-4" variant="flat" @click="$emit('closeModal')"> Отмена </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { useForm, useField } from "vee-validate";
import { useFormSchemas } from "@/composables/useFormSchemas";

import { useProductsCategoiresFetch } from "@/composables/useProductsCategoriesFetch";
import { useUserProductsStore } from "@/stores/userProducts";

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

const { handleSubmit, isSubmitting } = useForm<UserProductFields>({
  validationSchema: userProductSchema,
  initialValues: initialFormValues
});
const { value: name, errorMessage: nameErrors } = useField("name");
const { value: price, errorMessage: priceErrors } = useField("price");
const { value: count, errorMessage: countErrors } = useField("count");
const { value: categoryId, errorMessage: categoryIdErrors } = useField("categoryId");
//------------------------------------------------------------

const { categories, isCategoriesLoadError, categoriesLoadErrorMessage } =
  useProductsCategoiresFetch();

const { updateUserProduct } = useUserProductsStore();

const updateProductSubmit = handleSubmit(async (formValues: UserProductFields) => {
  await updateUserProduct(formValues, props.product.id);
  emit("closeModal");
});
</script>

<style  scoped>


</style>
