import { defineStore } from "pinia";
import { ref } from "vue";

import { handleAxiosError, isAxiosError } from "@/services/axioxErrorHandle";
import OrderService from "@/services/OrderService";

import type { IUserOrder } from "@/types/interfaces";

export const useUserOrdersStore = defineStore("userOrders", () => {
  const orders = ref<IUserOrder[]>([]);

  const ordersErrorMessage = ref<string | null>(null);

  async function getAllUserOrders(id: number) {
    try {
      const { data } = await OrderService.getOrders(id);
      console.log(data);
      orders.value = data.orders;
    } catch (error) {
      if (isAxiosError(error)) {
        ordersErrorMessage.value = handleAxiosError(error);
      } else ordersErrorMessage.value = "Ошибка при получении заказов";
    }
  }

  function addOrder(order: IUserOrder) {
    orders.value.push(order);
  }

  function deleteOrder(orderId: number) {
    orders.value = orders.value.filter((order) => order.id != orderId);
  }

  function updateOrder(newOrder: IUserOrder) {
    const indexToUpdate = orders.value.findIndex((order) => order.id === newOrder.id);
    orders.value[indexToUpdate] = newOrder;
  }

  return {
    orders,
    ordersErrorMessage,
    getAllUserOrders,
    deleteOrder,
    addOrder,
    updateOrder
  };
});
