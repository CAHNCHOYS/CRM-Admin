import { defineStore } from "pinia";
import { ref } from "vue";
import { isAxiosError } from "axios";

import { useUserOrdersStore } from "@/stores/userOrders";
import { handleAxiosError } from "@/services/axioxErrorHandle";
import CustomerService from "@/services/CustomersService";

import type { IUserCustomer } from "@/types/interfaces";

export const useUserCustomersStore = defineStore("userClients", () => {
  const customers = ref<IUserCustomer[]>([]);

  const customersErrorMessage = ref<string | null>(null);

  async function getAllUserCustomers(userId: number) {
    try {
      const { data } = await CustomerService.getCustomers(userId);
      customers.value = data.customers;
    } catch (error) {
      if (isAxiosError(error)) {
        customersErrorMessage.value = handleAxiosError(error);
      } else customersErrorMessage.value = "Ошибка при загрзке клиентов";
    }
  }

  function deleteCustomer(customerId: number) {
    customers.value = customers.value.filter((customer) => customer.id != customerId);
    const userOrdersStore = useUserOrdersStore();
    userOrdersStore.orders = userOrdersStore.orders.filter(
      (order) => order.customerId != customerId
    );
  }

  function updateCustomer(newCustomer: IUserCustomer) {
    console.log(newCustomer);
    let indexToUpdate = customers.value.findIndex((customer) => customer.id === newCustomer.id);
    customers.value[indexToUpdate] = newCustomer;
  }

  function addCustomer(newCustomer: IUserCustomer) {
    customers.value.push(newCustomer);
  }



  return {
    customers,
    customersErrorMessage,
    getAllUserCustomers,
    deleteCustomer,
    addCustomer,
    updateCustomer,
  };
});
