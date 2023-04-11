import { ref, watch } from "vue";

import { useAlertStore } from "@/stores/alert";
import { getSearchedProducts } from "@/services/ProductService";

import { handleAxiosError, isAxiosError } from "@/services/axioxErrorHandle";

import type { IUserProduct } from "@/types/interfaces";
import type { RouteLocationNormalizedLoaded, Router } from "vue-router";

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
  const isSearchActive = ref(false);
  const isSearchLoading = ref(false);

  const productsBySearch = ref<IUserProduct[]>([]);

  const resetSearch = () => {
    searchName.value = "";
    searchPrices.value = [1, 99999];
    router.push({ name: "products-page", query: {} });
    isSearchActive.value = false;
  };
  
  const searchProducts = () => {
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

  watch(
    [() => route.query.startPrice, () => route.query.endPrice, () => route.query.productName],
    async () => {
      if (!route.query.startPrice) return;
      isSearchLoading.value = true;
      const startPrice = +(route.query.startPrice as string);
      const endPrice = +(route.query.endPrice as string);
      const productName = route.query.productName as string;
      try {
        const { data } = await getSearchedProducts({
          startPrice,
          endPrice,
          productName,
          userId
        });
        productsBySearch.value = data.products;
        isSearchActive.value = true;
      } catch (error) {
        if (isAxiosError(error)) {
          alertStore.showMessage("error", handleAxiosError(error));
        } else alertStore.showMessage("error", "Ошибка при поиске товара(");
      }
      isSearchLoading.value = false;
    },
    { immediate: true }
  );

  return {
    searchPrices,
    searchName,
    isSearchActive,
    isSearchLoading,
    productsBySearch,

    resetSearch,
    searchProducts
  };
};
