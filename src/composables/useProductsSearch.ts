import { ref, watch } from "vue";

import type { RouteLocationNormalizedLoaded, Router } from "vue-router";
import type { IUserProduct } from "@/types/interfaces";

import { useAlertStore } from "@/stores/alert";

import ProductService from "@/services/ProductService";
import { handleAxiosError, isAxiosError } from "@/services/axioxErrorHandle";

export const useProductsSearch = (
  route: RouteLocationNormalizedLoaded,
  router: Router,
  userId: number
) => {
  const alertStore = useAlertStore();

  const searchPrices = ref<[number, number]>([
    +(route.query.startPrice as string) || 1,
    +(route.query.endPrice as string) || 99999
  ]);
  const searchName = ref((route.query.productName as string) || "");

  const searchedProducts = ref<IUserProduct[]>([]);

  const isSearchActive = ref(false);
  const isSearchLoading = ref(false);
  const isSearchFormActive = ref(false);

  const resetSearch = () => {
    searchName.value = "";
    searchPrices.value = [1, 99999];
    isSearchActive.value = false;
    searchedProducts.value = [];
    router.push({ name: "products-page", query: {} });
  };

  const addSearchQuery = () => {
    router.push({
      name: "products-page",
      query: {
        ...route.query,
        productName: searchName.value,
        startPrice: searchPrices.value[0],
        endPrice: searchPrices.value[1]
      }
    });
  };

  const searchUserProducts = async (): Promise<void> => {
    try {
      isSearchLoading.value = true;

      const { data } = await ProductService.getSearchedProducts({
        startPrice: route.query.startPrice as string,
        endPrice: route.query.endPrice as string,
        productName: route.query.productName as string,
        userId
      });

      searchedProducts.value = data.products;
      console.log(searchedProducts.value);
      isSearchActive.value = true;
    } catch (error) {
      if (isAxiosError(error)) {
        alertStore.showMessage("error", handleAxiosError(error));
      } else alertStore.showMessage("error", "Ошибка при поиске товара(");
    } finally {
      isSearchLoading.value = false;
    }
  };

  watch(
    [() => route.query.startPrice, () => route.query.endPrice, () => route.query.productName],
    async () => {
      if (!route.query.startPrice && !route.query.endPrice) return;
      searchUserProducts();
    },
    { immediate: true }
  );

  return {
    searchPrices,
    searchName,
    isSearchActive,
    searchedProducts,
    isSearchLoading,
    isSearchFormActive,
    searchUserProducts,
    addSearchQuery,
    resetSearch
  };
};
