<template>
  <v-dialog
    :model-value="isOpened"
    @update:model-value="$emit('closeDialog')"
    scrollable
    width="auto"
  >
    <v-card width="450" color="white" class="pa-4">
      <v-card-title class="text-h6 font-weight-bold"> Редактирование клиента </v-card-title>
      <v-card-actions>
        <v-form @submit="updateClientSubmit">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="firstName" :error-messages="firstNameErrors" label="Имя" />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="secondName"
                :error-messages="secondNameErrors"
                label="Фамилия"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="thirdName"
                :error-messages="thirdNameErrors"
                label="Отчество"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field label="Номер телефона" v-model="phone" :error-messages="phoneErrors" />
            </v-col>
            <v-col cols="12">
              <p class="text-h6">Премиум клиент ?</p>
              <v-switch
                v-model="premium"
                true-value="Да"
                false-value="Нет"
                hide-details
                :label="premium"
                color="indigo"
              />
            </v-col>

            <v-col cols="12">
              <v-btn color="green-darken-4" variant="flat" type="submit" :loading="isSubmitting">
                Обновить
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
import { computed } from "@vue/reactivity";
import { useField, useForm } from "vee-validate";
import { useFormSchemas } from "@/composables/useFormSchemas";

import { useUserCustomersStore } from "@/stores/userCustomers";
import { useAlertStore } from "@/stores/alert";
import { useRouter } from "vue-router";

import CustomerService from "@/services/CustomersService";
import { handleAxiosError, isAxiosError } from "@/services/axioxErrorHandle";

import type { UserCustomerFields } from "@/types/Forms";
import type { IUserCustomer } from "@/types/interfaces";

const props = defineProps<{
  isOpened: boolean;
  customer: IUserCustomer;
  isSearchActive: boolean;
}>();

const emit = defineEmits<{
  (e: "closeDialog"): void;
  (e: "updateSearchCustomers"): Promise<void>;
}>();

//Работа с формой--------------------------------------------------------------
const initialFormValues = computed(() => ({
  firstName: props.customer.firstName,
  secondName: props.customer.secondName,
  thirdName: props.customer.thirdName,
  phone: props.customer.phone,
  premium: props.customer.premium
}));

const { userCustomerSchema } = useFormSchemas();
const { resetForm, handleSubmit, isSubmitting } = useForm<UserCustomerFields>({
  validationSchema: userCustomerSchema,
  initialValues: initialFormValues
});
const { value: firstName, errorMessage: firstNameErrors } = useField<string>("firstName");
const { value: secondName, errorMessage: secondNameErrors } = useField<string>("secondName");
const { value: thirdName, errorMessage: thirdNameErrors } = useField<string>("thirdName");
const { value: phone, errorMessage: phoneErrors } = useField<string>("phone");
const { value: premium } = useField<"Да" | "Нет">("premium");
//-------------------------------------------------------------------------------

const alertStore = useAlertStore();
const userCustomersStore = useUserCustomersStore();

const router = useRouter();

const updateClientSubmit = handleSubmit(async (values: UserCustomerFields) => {
  console.log(values);
  try {
    await CustomerService.updateCustomer(values, props.customer.id);

    userCustomersStore.updateCustomer({
      ...values,
      id: props.customer.id,
      fullName: values.secondName + " " + values.firstName + " " + values.thirdName
    });

    if (props.isSearchActive) emit("updateSearchCustomers");

    alertStore.showMessage("success", "Клиент был успешно изменен");
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        router.push({
          name: "login-page",
          query: { isExpiredToken: "true", redirectedFrom: "customers-page" }
        });
        return;
      }
      alertStore.showMessage("error", handleAxiosError(error));
    } else alertStore.showMessage("error", "Ошибка при изменении клиента");
  } finally {
    resetForm();
    emit("closeDialog");
  }
});
</script>

<style scoped></style>
