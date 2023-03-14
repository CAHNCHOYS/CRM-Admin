<template>
  <v-dialog max-width="500" @update:model-value="$emit('close')" :model-value="isOpened">
    <v-card class="pa-5" color="white" elevation="4">
      <v-card-title>
        <p class="text-h6 font-weight-bold mb-4">Редактирование товара</p>
      </v-card-title>

      <v-card-actions>
        <v-form @submit.prevent="updateProductSubmit">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="name" :error-messages="nameErrors" label="Название товара">
              </v-text-field>
            </v-col>

            <v-col cols="12">
              <v-select
                :items="categories"
                item-title="name"
                item-value="id"
                v-model="categoryId"
                :error-messages="categoryIdErrors"
                v-if="categories.length"
              />
            </v-col>

            <v-col cols="6">
              <v-text-field
                v-model="count"
                :error-messages="countErrors"
                label="Количество"
                type="number"
              >
              </v-text-field>
            </v-col>

            <v-col cols="6">
              <v-text-field
                v-model="price"
                :error-messages="priceErrors"
                label="Цена"
                type="number"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12">
              <v-btn color="green" variant="flat" :loading="isSubmitting" type="submit">
                Сохранить
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
import { computed } from "vue";

import { useForm, useField } from "vee-validate";
import { useFormSchemas } from "@/composables/useFormSchemas";

import { useProductsCategoiresFetch } from "@/composables/useProductsCategoriesFetch";
import { useUserProductsStore } from "@/stores/userProducts";

import type { UserProductFields } from "@/types/FormFields";
import type { IUserProduct } from "@/types/interfaces";


const props = defineProps<{
  isOpened: boolean;
  product: IUserProduct;
}>();

const emit = defineEmits<{
  (e: "close"): void;
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

const { categories, isCategoriesLoadError, categoriesLoadErroMessage } =
  useProductsCategoiresFetch();

const { updateUserProduct } = useUserProductsStore();

const updateProductSubmit = handleSubmit(async (formValues: UserProductFields) => {

  await updateUserProduct(formValues, props.product!.id);
  emit("close");

});
</script>

<style lang="scss" scoped>

</style>
