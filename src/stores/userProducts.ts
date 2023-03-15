import { defineStore } from "pinia";
import {  ref } from "vue";

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

import { fetchData } from "@/services/axiosFetch";


export const useUserProductsStore = defineStore("userProducts", () => {
  
  const userProducts = ref<IUserProduct[]>([]);
 
  const isProductsError = ref(false);
  const isProductsFetching = ref(false);
  const loadProductsError = ref("");

   
  const isProductActionLoading = ref(false);
  const isActionMessageShown = ref(false); //После добавления или удалени тоавра показываем уведомление
  const actionMessageText = ref("");
  const actionMessageType = ref<"success" | "error">("success");

  async function fetchUserProducts() {
    isProductsFetching.value = true;
    const userAuthStore = useUserAuthStore();

    const products: GetProductsResponse | ApiError = await fetchData<GetProductsResponse>({
      method: "get",
      url: "/AllUserProducts/" + userAuthStore.currentUser!.id
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

  async function deleteUserProduct(productId: number): Promise<void> {
    const deletionResult: DeleteProductResponse | ApiError = await fetchData<DeleteProductResponse>(
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
    const userAuthStore = useUserAuthStore();
    
    const updateResult: UpdateUserProductResponse | ApiError = await fetchData({
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
    const userAuthStore = useUserAuthStore();
    const addResult: AddProductResponse | ApiError = await fetchData({
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
