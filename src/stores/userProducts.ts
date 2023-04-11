import { defineStore } from "pinia";
import { ref } from "vue";

import { isAxiosError } from "axios";
import { handleAxiosError } from "@/services/axioxErrorHandle";
import { getUserProducts, getCategories } from "@/services/ProductService";

import type { IUserProduct, IUserProductCategory } from "@/types/interfaces";

export const useUserProductsStore = defineStore("userProducts", () => {
  
  const userProducts = ref<IUserProduct[]>([]);

  const isProductsLoading = ref(false);
  const productsErrorMessage = ref<string | null>(null);

  const productsCategories = ref<IUserProductCategory[]>([]);
  const categoriesErrorMessage = ref<string | null>(null);

  async function getAllProducts(userId: number) {
    try {
      isProductsLoading.value = true;
      const { data } = await getUserProducts(userId);
      userProducts.value = data.products;
    } catch (error) {
      console.log(error);
      if (isAxiosError(error)) {
        productsErrorMessage.value = handleAxiosError(error);
      } else productsErrorMessage.value = "Произошла ошибка при загрузке товаров";
    }finally{
      isProductsLoading.value = false;
    }
  
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

  function deleteUserProduct(productId: number) {
    userProducts.value = userProducts.value.filter((product) => product.id != productId);
  }

  function updateUserProduct(newProduct: IUserProduct) {
    let index = userProducts.value.findIndex((product) => product.id === newProduct.id);
    userProducts.value[index] = newProduct;
  }

  function addUserProduct(newProduct: IUserProduct) {
    console.log(newProduct);
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
    getAllProducts,
    deleteUserProduct,
    updateUserProduct,
    addUserProduct,
    fetchProductsCategories
  };
});
