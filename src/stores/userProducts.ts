import { defineStore } from "pinia";
import { ref } from "vue";

import { useUserAuthStore } from "@/stores/userAuth";
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

  const isProductsError = ref(false);
  const isProductsFetching = ref(false);
  const loadProductsError = ref("");

  const isProductActionLoading = ref(false);
  const isActionMessageShown = ref(false); //После добавления,удаления, изменения тоавра показываем уведомление
  const actionMessageText = ref("");
  const actionMessageType = ref<"success" | "error">("success");

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
    const deletionResult = await makeRequest<DeleteProductResponse>(
      {
        url: "/DeleteProduct/" + productId,
        method: "delete"
      }
    );

    isActionMessageShown.value = true;
    if ("error" in deletionResult) {
      actionMessageType.value = "error";
      actionMessageText.value = deletionResult.error;
    } else {
      //обновляем на фронте
      userProducts.value = userProducts.value.filter((product) => product.id != productId);
      actionMessageType.value = "success";
      actionMessageText.value = "Товар был успешно удален!";
    }
    setTimeout(() => (isActionMessageShown.value = false), 3500);
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
    isActionMessageShown.value = true;
    if ("error" in updateResult) {
      actionMessageType.value = "error";
      actionMessageText.value = updateResult.error;
    } else {
      let index = userProducts.value.findIndex((product) => product.id === productId);
      userProducts.value[index] = updateResult.data;
      actionMessageType.value = "success";
      actionMessageText.value = "Товар был изменен";
    }
    setTimeout(() => (isActionMessageShown.value = false), 3500);
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

    isActionMessageShown.value = true;
    if ("error" in addResult) {
      actionMessageType.value = "error";
      actionMessageText.value = addResult.error;
    } else {
      userProducts.value.push(addResult.data);
      actionMessageType.value = "success";
      actionMessageText.value = `Товар ${data.name} был успешно добавлен!`;
    }
    setTimeout(() => (isActionMessageShown.value = false), 3500);
  }

  return {
    userProducts,
    isProductsError,
    isProductsFetching,
    loadProductsError,
    isProductActionLoading,
    actionMessageText,
    actionMessageType,
    isActionMessageShown,

    fetchUserProducts,
    deleteUserProduct,
    updateUserProduct,
    addUserProduct
  };
});
