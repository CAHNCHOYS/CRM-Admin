import { defineStore } from "pinia";
import { ref } from "vue";

import { useUserAuthStore } from "@/stores/userAuth";
import { useAlertStore } from "./alert";
import type { IUserProduct } from "@/types/interfaces";
import type {
  AddProductResponse,
  ApiError,
  DeleteProductResponse,
  GetProductsResponse,
  UpdateUserProductResponse
} from "@/types/BackendResponses";
import type { UserProductFields } from "@/types/Forms";

import { makeRequest } from "@/services/axiosFetch";

export const useUserProductsStore = defineStore("userProducts", () => {
  const userProducts = ref<IUserProduct[]>([]);

  const userAuthStore = useUserAuthStore();
  const alertStore = useAlertStore();

  const isProductsError = ref(false);
  const isProductsFetching = ref(false);
  const loadProductsError = ref("");

  const isProductActionLoading = ref(false);


  async function fetchUserProducts() {
    isProductsFetching.value = true;

    const products = await makeRequest<GetProductsResponse>({
      method: "get",
      url: "/AllUserProducts/" + userAuthStore.currentUser!.id
    });

    if ("error" in products) {
      console.log(products.error);
      isProductsError.value = true;
      loadProductsError.value = products.error;
    } else if (products.data) userProducts.value = products.data;

    isProductsFetching.value = false;
  }

  async function deleteUserProduct(productId: number): Promise<void> {
    const deletionResult = await makeRequest<DeleteProductResponse>({
      url: "/DeleteProduct/" + productId,
      method: "delete"
    });

    if ("error" in deletionResult) {
      alertStore.showMessage("error", deletionResult.error);
    } else {
      //обновляем на фронте
      userProducts.value = userProducts.value.filter((product) => product.id != productId);
      alertStore.showMessage("success", "Товар был успешно удален");
    }
  }

  async function updateUserProduct(updatePayload: UserProductFields, productId: number) {
    const updateResult = await makeRequest<UpdateUserProductResponse>({
      url: "/UpdateUserProduct",
      method: "patch",
      body: {
        ...updatePayload,
        userId: userAuthStore.currentUser!.id,
        productId
      }
    });
    console.log(updateResult);

    if ("error" in updateResult) {
      alertStore.showMessage("error", updateResult.error);
    } else {
      let index = userProducts.value.findIndex((product) => product.id === productId);
      userProducts.value[index] = updateResult.data;
      alertStore.showMessage("success", "Товар был изменен");
    }
  }

  async function addUserProduct(data: UserProductFields): Promise<void> {
    const addResult = await makeRequest<AddProductResponse>({
      url: "/AddProduct",
      method: "post",
      body: {
        ...data,
        userId: userAuthStore.currentUser!.id
      }
    });

    if ("error" in addResult) {
      alertStore.showMessage("error", addResult.error);
    } else {
      userProducts.value.push(addResult.data);
      alertStore.showMessage("success", `Товар ${data.name} был успешно добавлен!`);
    }
  }

  function clearUserProducts() {
    userProducts.value = [];
  }

  return {
    userProducts,
    isProductsError,
    isProductsFetching,
    loadProductsError,
    isProductActionLoading,

    clearUserProducts,
    fetchUserProducts,
    deleteUserProduct,
    updateUserProduct,
    addUserProduct
  };
});
