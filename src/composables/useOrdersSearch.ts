import { ref, watch } from "vue";

import { handleAxiosError, isAxiosError } from "@/services/axioxErrorHandle";
import OrderService from "@/services/OrderService";

import { useAlertStore } from "@/stores/alert";

import type { IUserOrder } from "@/types/interfaces";
import type { RouteLocationNormalizedLoaded, Router } from "vue-router";

export const useOrdersSearch = (
  route: RouteLocationNormalizedLoaded,
  router: Router,
  userId: number
) => {
  const alertStore = useAlertStore();

  const isSearchFormActive = ref(false);
  const isSearchActive = ref(false);
  const isSearchLoading = ref(false);

  const searchedOrders = ref<IUserOrder[]>([]);

  const startDate = ref("2023-01-01");
  const endDate = ref("2024-01-01");
  const customerName = ref("");
  const productName = ref("");

  const addSearchQuery = (): void => {
    router.push({
      name: "orders-page",
      query: {
        startDate: startDate.value,
        endDate: endDate.value,
        customerName: customerName.value,
        productName: productName.value
      }
    });
  };

  const resetSearch = (): void => {
    startDate.value = "2023-01-01";
    endDate.value = "2024-01-01";
    customerName.value = "";
    productName.value = "";
    isSearchActive.value = false;
    searchedOrders.value = [];

    router.push({ name: "orders-page", query: {} });
  };

  const searchOrders = async (): Promise<void> => {
    try {
      if (!route.query.startDate && !route.query.endDate) return;
      isSearchLoading.value = true;

      const { data } = await OrderService.getSerachedOrders({
        userId,
        product: route.query.productName as string,
        customer: route.query.customerName as string,
        startDate: route.query.startDate as string,
        endDate: route.query.endDate as string
      });

      searchedOrders.value = data.orders;
      isSearchActive.value = true;
    } catch (error) {
      if (isAxiosError(error)) {
        alertStore.showMessage("error", handleAxiosError(error));
      } else alertStore.showMessage("error", "Ошибка при поиске заказов");
    } finally {
      isSearchLoading.value = false;
    }
  };

  watch(
    [
      () => route.query.startDate,
      () => route.query.endDate,
      () => route.query.customerName,
      () => route.query.productName
    ],
    async () => {
      if (!route.query.startDate && !route.query.endDate) return;
      searchOrders();
    }
  );

  return {
    isSearchLoading,
    isSearchFormActive,
    isSearchActive,
    startDate,
    endDate,
    customerName,
    productName,
    searchedOrders,
    resetSearch,
    addSearchQuery,
    searchOrders
  };
};
