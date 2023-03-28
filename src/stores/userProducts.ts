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
  const productsErrorMessage = ref<string | null>(null);

  const productsCategories = ref<IUserProductCategory[]>([]);
  const categoriesErrorMessage = ref<string | null >(null);

  async function fetchUserProducts() {
    isProductsLoading.value = true;
    try {
      const { data } = await getUserProducts(userAuthStore.currentUser!.id);
      userProducts.value = data.products;
    } catch (error) {
      if (isAxiosError(error)) {
        productsErrorMessage.value = handleAxiosError(error);
      } else productsErrorMessage.value = "Ошибка при загрузке товаров";
    }
    isProductsLoading.value = false;
  }

  async function fetchProductsCategories() {
    try {
      const { data } = await getCategories();
      productsCategories.value = data.categories;
    } catch (error) {
      if (isAxiosError(error)) {
        categoriesErrorMessage.value = handleAxiosError(error);
      } else categoriesErrorMessage.value = "Ошибка при загрузке категорий";
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
    isProductsLoading,
    productsErrorMessage,
    productsCategories,
    categoriesErrorMessage,

    clearUserProducts,
    fetchUserProducts,
    deleteUserProduct,
    updateUserProduct,
    addUserProduct,
    fetchProductsCategories
  };
});
