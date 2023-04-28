import { defineStore } from "pinia";
import { ref } from "vue";

import { isAxiosError } from "axios";
import { handleAxiosError } from "@/services/axioxErrorHandle";
import ProductService from "@/services/ProductService";
import { useUserOrdersStore } from "./userOrders";

import type { IUserProduct, IUserProductCategory } from "@/types/interfaces";

export const useUserProductsStore = defineStore("userProducts", () => {
  const userProducts = ref<IUserProduct[]>([]);

  const isCategoriesLoading = ref(false);
  const productsErrorMessage = ref<string | null>(null);

  const productsCategories = ref<IUserProductCategory[]>([]);
  const categoriesErrorMessage = ref<string | null>(null);

  async function getAllUserProducts(userId: number) {
    try {
      const { data } = await ProductService.getProducts(userId);
      userProducts.value = data.products;
    } catch (error) {
      console.log(error);
      if (isAxiosError(error)) {
        productsErrorMessage.value = handleAxiosError(error);
      } else productsErrorMessage.value = "Произошла ошибка при загрузке товаров";
    }
  }

  async function getAllProductsCategories() {
    try {
      isCategoriesLoading.value = true;

      const { data } = await ProductService.getProductCategories();
      productsCategories.value = data.categories;
    } catch (error) {
      console.log(error);
      if (isAxiosError(error)) {
        categoriesErrorMessage.value = handleAxiosError(error);
      } else categoriesErrorMessage.value = "Ошибка при загрузке категорий";
    } finally {
      isCategoriesLoading.value = false;
    }
  }

  function deleteUserProduct(productId: number) {
    const userOrdersStore = useUserOrdersStore();
    userProducts.value = userProducts.value.filter((product) => product.id != productId);
    userOrdersStore.orders = userOrdersStore.orders.filter(
      (order) => order.productId !== productId
    );
  }

  function updateUserProduct(newProduct: IUserProduct) {
    console.log(newProduct);
    let index = userProducts.value.findIndex((product) => product.id === newProduct.id);
    userProducts.value[index] = newProduct;
  }

  function addUserProduct(newProduct: IUserProduct) {

    userProducts.value.push(newProduct);
  }



  return {
    userProducts,
    isCategoriesLoading,
    productsErrorMessage,
    productsCategories,
    categoriesErrorMessage,

    getAllUserProducts,
    deleteUserProduct,
    updateUserProduct,
    addUserProduct,
    getAllProductsCategories
  };
});
