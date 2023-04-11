import axios from "./axios";
import type { AxiosResponse } from "axios";
import type {
  DeleteResponse,
  GetProductCategoriseResponse,
  GetProductsResponse,
  NewProductResponse
} from "@/types/BackendResponses";
import type { UserProductFields } from "@/types/Forms";

export const getUserProducts = async (
  userId: number
): Promise<AxiosResponse<GetProductsResponse>> => {
  return await axios.get(`/Products/${userId}`);
};

export const deleteProduct = async (productId: number): Promise<AxiosResponse<DeleteResponse>> => {
  return await axios.delete(`/Products/${productId}`);
};

export const addProduct = async (
  productInfo: UserProductFields
): Promise<AxiosResponse<NewProductResponse>> => {
  return await axios.post("/Products", productInfo);
};

export const updateProduct = async (
  productNewInfo: UserProductFields,
  productId: number
): Promise<AxiosResponse<NewProductResponse>> => {
  return await axios.patch("/Products", { ...productNewInfo, productId });
};

export const getCategories = async (): Promise<AxiosResponse<GetProductCategoriseResponse>> => {
  return await axios.get("/ProductCategories");
};

type SearchPayload = {
  productName: string;
  startPrice: number;
  endPrice: number;
  userId: number;
};

export const getSearchedProducts = async ({
  productName,
  startPrice,
  endPrice,
  userId
}: SearchPayload): Promise<AxiosResponse<GetProductsResponse>> => {
  return await axios.get(
    `/SearchProducts/${userId}?name=${productName}&startPrice=${startPrice}&endPrice=${endPrice}`
  );
};
