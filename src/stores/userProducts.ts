import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { useUserAuthStore } from "@/stores/userAuth";
import type { IUserProduct } from "@/types/interfaces";
import type {
  ApiError,
  DeleteProductResponse,
  GetProductsResponse
} from "@/types/BackendResponses";

import { fetchData } from "@/services/axiosFetch";

export const useUserProductsStore = defineStore("userProducts", () => {
  const userProducts = ref<IUserProduct[]>([]);

  const isProductsFetching = ref(false);
  const isProductsError = ref(false);
  const loadProductsError = ref("");

  const isProductActionLoading = ref(false); //Индикатор зазгрузки при удалении, обновлении информации о товаре
  const isProdutActionSuccess = ref(false);
  const isProductActionError = ref(false); // Показ уведомления при ошибке при удалении, обновлении информации о товаре
  const productActionErrorMessage = ref("");

  async function fetchUserProducts() {
    isProductsFetching.value = true;

    let prom = await new Promise((res, rej) => {
      setTimeout(() => res("done"), 3500);
    });

    const userAuthStore = useUserAuthStore();

    let products: GetProductsResponse | ApiError = await fetchData<GetProductsResponse>({
      method: "get",
      url: "/getAllProducts/" + userAuthStore.currentUser!.id
    });

    if ("error" in products) {
      console.log(products.error);
      isProductsError.value = true;
      loadProductsError.value = products.error;
    } else if (products.data) {
      userProducts.value = products.data;
    }

    isProductsFetching.value = false;
  }

  async function deleteUserProduct(productId: number) {
    isProductActionLoading.value = true;
    const deletionResult: DeleteProductResponse | ApiError = await fetchData<DeleteProductResponse>(
      {
        url: "/DeleteProduct/" + productId,
        method: "delete"
      }
    );
    console.log(deletionResult);
    if ("error" in deletionResult) {
      isProductActionError.value = true;
      productActionErrorMessage.value = deletionResult.error;
      setTimeout(() => (isProductActionError.value = false), 3500);
    } else {
      isProdutActionSuccess.value = true;
      setTimeout(() => (isProdutActionSuccess.value = false), 3500);
      //Удаляем товар с фронта
      userProducts.value = userProducts.value.filter((product) => product.id != productId);
    }
    isProductActionLoading.value = false;
  }

  const sortProductsByField = computed(() => {
    return function (field: "name" | "count" | "price" | "id" | "category", inverse = false) {
      return inverse
        ? [...userProducts.value].sort((a, b) => (a[field] > b[field] ? 1 : -1))
        : [...userProducts.value].sort((a, b) => (a[field] > b[field] ? -1 : 1));
    };
  });

  return {
    userProducts,
    isProductsFetching,
    isProductsError,
    loadProductsError,
    isProductActionError,
    isProdutActionSuccess,
    isProductActionLoading,
    productActionErrorMessage,
    sortProductsByField,

    fetchUserProducts,
    deleteUserProduct
  };
});
