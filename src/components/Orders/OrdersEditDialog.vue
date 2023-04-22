<template>
  <v-dialog
    :model-value="isOpened"
    @update:model-value="$emit('closeDialog')"
    width="auto"
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card width="450" color="white" class="pa-4">
      <v-card-title class="font-weight-bold text-h6 mb-3"> Редактирование заказа </v-card-title>

      <v-card-actions>
        <v-form @submit.prevent="handleOrderUpdate">
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
                v-model.number="productCount"
                label="Количество товара"
                :error-messages="productCountErrors"
                type="number"
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

                <v-col sm="auto" cols="12">
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

<script lang="ts" setup>
import { computed } from "@vue/reactivity";
import { storeToRefs } from "pinia";
import { useUserOrdersStore } from "@/stores/userOrders";
import { useUserCustomersStore } from "@/stores/userCustomers";
import { useUserProductsStore } from "@/stores/userProducts";
import { useAlertStore } from "@/stores/alert";
import { useForm, useField } from "vee-validate";
import { useFormSchemas } from "@/composables/useFormSchemas";
import { useRouter } from "vue-router";

import { handleAxiosError, isAxiosError } from "@/services/axioxErrorHandle";
import OrderService from "@/services/OrderService";

import type { IUserOrder } from "@/types/interfaces";
import type { UserOrderFields } from "@/types/Forms";

const props = defineProps<{
  isOpened: boolean;
  order: IUserOrder;
  isSearchActive: boolean;
}>();

const emit = defineEmits<{
  (e: "closeDialog"): void;
  (e: "updateSearchOrders"): Promise<void>;
}>();

//Валидация формы --------------------------------------
const formatDate = computed(() => {
  const date = props.order.date;
  const splitted = date.split("-");
  return splitted[2] + "-" + splitted[1] + "-" + splitted[0];
});

const initialFormValues = computed<UserOrderFields>(() => ({
  productCount: props.order.productCount,
  productId: props.order.productId,
  customerId: props.order.customerId,
  date: formatDate.value
}));

const { userOrderSchema } = useFormSchemas();

const { isSubmitting, resetForm, handleSubmit } = useForm<UserOrderFields>({
  validationSchema: userOrderSchema,
  initialValues: initialFormValues
});

const { value: customerId, errorMessage: customerIdErrors } = useField<number>("customerId");
const { value: productId, errorMessage: productIdErrors } = useField<number>("productId");
const { value: productCount, errorMessage: productCountErrors } = useField<number>("productCount");
const { value: date, errorMessage: dateErrors } = useField<string>("date");
//------------------------------------------------------

const userCustomersStore = useUserCustomersStore();
const userProductsStore = useUserProductsStore();
const userOrdersStore = useUserOrdersStore();
const alertStore = useAlertStore();

const router = useRouter();

const { customers, customersErrorMessage } = storeToRefs(userCustomersStore);
const { userProducts, productsErrorMessage } = storeToRefs(userProductsStore);

const handleOrderUpdate = handleSubmit(async (values: UserOrderFields) => {
  try {
    const { data } = await OrderService.updateOrder(values, props.order.id);

    values.date = values.date.split("-").reverse().join("-");

    userOrdersStore.updateOrder({ ...values, ...data });

    if (props.isSearchActive) emit("updateSearchOrders");
    alertStore.showMessage("success", "Заказ был успешно обновлен");
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
    resetForm();
  }
});
</script>

<style scoped></style>
