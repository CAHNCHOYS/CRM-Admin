<template>
  <v-dialog
    transition="dialog-bottom-transition"
    max-width="500"
    @update:model-value="$emit('closeModal')"
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
              <v-select
                v-model="categoryId"
                label="Категория товара"
                :error-messages="categoryIdErrors"
                :items="productsCategories"
                item-title="name"
                :clearable="false"
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
                suffix="руб"
                type="number"
              />
            </v-col>

            <v-col cols="12">
              <v-btn color="green-darken-4" variant="flat" :loading="isSubmitting" type="submit">
                Добавить
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
import { useForm, useField } from "vee-validate";
import { useFormSchemas } from "@/composables/useFormSchemas";
import { storeToRefs } from "pinia";
import { useUserProductsStore } from "@/stores/userProducts";
import { useAlertStore } from "@/stores/alert";
import { useUserAuthStore } from "@/stores/userAuth";

import { addProduct } from "@/services/ProductService";
import { isAxiosError } from "axios";
import { handleAxiosError } from "@/services/axioxErrorHandle";

import type { UserProductFields } from "@/types/Forms";

const props = defineProps<{
  isActive: boolean;
}>();

const emit = defineEmits<{
  (e: "closeModal"): void;
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

const userProductsStore = useUserProductsStore();
const alertStore = useAlertStore();
const userAuthStore = useUserAuthStore();

const { productsCategories, categoriesErrorMessage } =
  storeToRefs(userProductsStore);

const addProductSubmit = handleSubmit(async (values: UserProductFields) => {
  try {
    const { data } = await addProduct(values, userAuthStore.currentUser!.id);
    
    console.log(data);
    userProductsStore.addUserProduct({...values, ...data});
    alertStore.showMessage("success", `Товар ${values.name} был успешно добавлен!`);
    
  } catch (error) {
    if (isAxiosError(error)) {
      alertStore.showMessage("error", handleAxiosError(error));
    } else alertStore.showMessage("error", "Ошибка при добавлении товара !");
  } finally {
    resetForm();
    emit("closeModal");
  }
});
</script>

<style scoped></style>
