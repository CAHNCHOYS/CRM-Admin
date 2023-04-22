import { ref, watch } from "vue";

import { useAlertStore } from "@/stores/alert";

import { handleAxiosError, isAxiosError } from "@/services/axioxErrorHandle";
import CustomerService from "@/services/CustomersService";

import type { IUserCustomer } from "@/types/interfaces";
import type { RouteLocationNormalizedLoaded, Router } from "vue-router";

export const useCustomersSearch = (
  route: RouteLocationNormalizedLoaded,
  router: Router,
  userId: number
) => {
  const alertStore = useAlertStore();

  const isSearchFormActive = ref(false);
  const secondName = ref((route.query.secondName as string) || "");
  const premium = ref<0 | 1>((+(route.query.premium as string) as 0 | 1) || 0);
  const searchWithPremium = ref(false);

  const searchedCustomers = ref<IUserCustomer[]>([]);
  const isSearchActive = ref(false);
  const isSearchLoading = ref(false);

  const resetSearch = () => {
    secondName.value = "";
    searchWithPremium.value = false;
    premium.value = 0;
    isSearchActive.value = false;
    searchedCustomers.value = [];
    router.push({ name: "clients-page", query: {} });
  };

  const addSearchQuery = () => {
    router.push({
      name: "clients-page",
      query: {
        ...route.query,
        secondName: secondName.value,
        searchWithPremium: String(searchWithPremium.value),
        premium: premium.value
      }
    });
  };

  const searchUserCustomers = async () => {
    try {
      isSearchLoading.value = true;

      const { data } = await CustomerService.getSearchedCustomers({
        userId,
        premium: +(route.query.premium as string) as 0 | 1,
        secondName: route.query.secondName as string,
        searchWithPremium: route.query.searchWithPremium as string
      });

      console.log(data);
      searchedCustomers.value = data.customers;
      isSearchActive.value = true;
    } catch (error) {
      if (isAxiosError(error)) {
        alertStore.showMessage("error", handleAxiosError(error));
      } else alertStore.showMessage("error", "Ошибка при поиске товаров!");
    } finally {
      isSearchLoading.value = false;
    }
  };

  watch(
    [() => route.query.secondName, () => route.query.premium, () => route.query.searchWithPremium],
    async () => {
      if (route.query.secondName === undefined && !route.query.premium) return;
      searchUserCustomers();
    },
    { immediate: true }
  );    

  return {
    premium,
    searchWithPremium,
    isSearchFormActive,
    isSearchActive,
    isSearchLoading,
    secondName,
    searchedCustomers,
    searchUserCustomers,
    addSearchQuery,
    resetSearch
  };
};
