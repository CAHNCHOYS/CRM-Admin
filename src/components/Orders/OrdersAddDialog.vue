<template>
  <v-dialog
    :model-value="isOpened"
    @update:model-value="$emit('closeDialog')"
    width="auto"
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card width="450" color="white" class="pa-4">
      <v-card-title class="font-weight-bold text-h6 mb-3"> Добавление заказа </v-card-title>

      <v-card-actions>
        <v-form @submit.prevent="handleAddOrder">
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="customerId"
                :error-messages="customerIdErrors"
                label="Клиент"
                :items="customers"
                item-title="fullName"
                item-value="id"
                no-data-text="Клиенты не найдены"
                v-if="!customersErrorMessage"
              />

              <v-sheet v-else>
                <v-alert type="error" border="end" variant="outlined" class="pa-2">
                  <v-alert-title class="text-h6"> {{ customersErrorMessage }}</v-alert-title>
                </v-alert>
              </v-sheet>
            </v-col>

            <v-col cols="12">
              <v-autocomplete
                v-model="productId"
                :error-messages="productIdErrors"
                label="Товар"
                :items="userProducts"
                item-title="name"
                item-value="id"
                no-data-text="Товары не найдены"
                v-if="!productsErrorMessage"
              />
              <v-sheet v-else>
                <v-alert type="error" border="end" variant="outlined" class="pa-2">
                  <v-alert-title class="text-h6"> {{ productsErrorMessage }}</v-alert-title>
                </v-alert>
              </v-sheet>
            </v-col>

            <v-col cols="12">
              <v-text-field
                type="number"
                v-model.number="productCount"
                label="Количество товара"
                :error-messages="productCountErrors"

              />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="date" :error-messages="dateErrors" type="date" />
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col sm="auto" cols="12">
                  <v-btn
                    color="green-darken-4"
                    variant="flat"
                    type="submit"
                    block
                    :loading="isSubmitting"
                  >
                    Добавить
                  </v-btn></v-col
                >
                <v-col sm="5" cols="6">
                  <v-btn color="error" variant="flat" @click="resetForm()" block>
                    <span class="px-5 text-wrap">Очистить </span>
                  </v-btn>
                </v-col>
                <v-col sm="auto" cols="6">
                  <v-btn color="blue-darken-4" block variant="flat" @click="$emit('closeDialog')">
                    Отмена
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useFormSchemas } from "@/composables/useFormSchemas";
import { useField, useForm } from "vee-validate";
import { storeToRefs } from "pinia";
import { useUserCustomersStore } from "@/stores/userCustomers";
import { useUserProductsStore } from "@/stores/userProducts";
import { useAlertStore } from "@/stores/alert";
import { useUserOrdersStore } from "@/stores/userOrders";
import { handleAxiosError, isAxiosError } from "@/services/axioxErrorHandle";
import { useRouter } from "vue-router";
import OrderService from "@/services/OrderService";

import type { UserOrderFields } from "@/types/Forms";

const props = defineProps<{
  isOpened: boolean;
}>();

const emit = defineEmits<{
  (e: "closeDialog"): void;
  
}>();

const userProductsStore = useUserProductsStore();
const userCustomersStore = useUserCustomersStore();
const userOrdersStore = useUserOrdersStore();
const alertStore = useAlertStore();

const { userProducts, productsErrorMessage } = storeToRefs(userProductsStore);
const { customers, customersErrorMessage } = storeToRefs(userCustomersStore);

//Валидация формы ------------------------------------------
const { userOrderSchema } = useFormSchemas();
const { handleSubmit, isSubmitting, resetForm } = useForm<UserOrderFields>({
  validationSchema: userOrderSchema
});

const { value: customerId, errorMessage: customerIdErrors } = useField<number>("customerId");
const { value: productId, errorMessage: productIdErrors } = useField<number>("productId");
const { value: productCount, errorMessage: productCountErrors } = useField<number>("productCount");
const { value: date, errorMessage: dateErrors } = useField<string>("date");
//----------------------------------------------------------

const router = useRouter();

const handleAddOrder = handleSubmit(async (values: UserOrderFields) => {
  try {
    const { data } = await OrderService.addOrder(values);

    values.date = values.date.split("-").reverse().join("-");

    userOrdersStore.addOrder({ ...values, ...data });

    alertStore.showMessage("success", "Заказ был успешно добавлен!");
    resetForm();
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
    } else alertStore.showMessage("error", "Ошибка при добавлении заказа");
  } finally {
    emit("closeDialog");
  }
});
</script>

<style scoped></style>
