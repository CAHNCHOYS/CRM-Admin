import { defineStore } from "pinia";
import { ref } from "vue";

import { useUserAuthStore } from "@/stores/userAuth";

import { isAxiosError } from "axios";
import { handleAxiosError } from "@/services/axioxErrorHandle";
import { getUserProducts, getCategories } from "@/services/ProductService";

import type { IUserProduct, IUserProductCategory } from "@/types/interfaces";

export const useUserProductsStore = defineStore("userProducts", () => {
  const userProducts = ref<IUserProduct[]>([]);

  const userAuthStore = useUserAuthStore();

  const isProductsLoading = ref(false);
  const isProductsError = ref(false);

  const loadErrorMessage = ref("");

  const productsCategories = ref<IUserProductCategory[]>([]);
  const isCategoriesFetchError = ref(false);
  const categoriesLoadErrorMessage = ref("");

  async function fetchUserProducts() {
    isProductsLoading.value = true;
    try {
      const { data } = await getUserProducts(userAuthStore.currentUser!.id);
      userProducts.value = data.products;
    } catch (error) {
      isProductsError.value = true;
      if (isAxiosError(error)) {
        loadErrorMessage.value = handleAxiosError(error);
      } else loadErrorMessage.value = "Ошибка при загрузке товаров";
    }
    isProductsLoading.value = false;
  }

  async function fetchProductsCategories() {
    try {
      const { data } = await getCategories();
      productsCategories.value = data.categories;
    } catch (error) {
      isCategoriesFetchError.value = true;
      if (isAxiosError(error)) {
        categoriesLoadErrorMessage.value = handleAxiosError(error);
      } else categoriesLoadErrorMessage.value = "Ошибка при загрузке категорий";
    }
  }

  async function deleteUserProduct(productId: number): Promise<void> {
    userProducts.value = userProducts.value.filter((product) => product.id != productId);
  }

  async function updateUserProduct(newProduct: IUserProduct) {
    let index = userProducts.value.findIndex((product) => product.id === newProduct.id);
    userProducts.value[index] = newProduct;
  }

  async function addUserProduct(newProduct: IUserProduct): Promise<void> {
    userProducts.value.push(newProduct);
  }

  function clearUserProducts() {
    userProducts.value = [];
  }

  return {
    userProducts,
    isProductsError,
    isProductsLoading,
    loadErrorMessage,
    productsCategories,
    isCategoriesFetchError,
    categoriesLoadErrorMessage,

    clearUserProducts,
    fetchUserProducts,
    deleteUserProduct,
    updateUserProduct,
    addUserProduct,
    fetchProductsCategories
  };
});
