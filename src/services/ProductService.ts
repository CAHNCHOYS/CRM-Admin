import axios from "./axios";
import type { AxiosResponse } from "axios";
import type {
  DeleteProductResponse,
  GetProductCategoriseResponse,
  GetProductsResponse,
  NewProductResponse
} from "@/types/BackendResponses";
import type { UserProductFields } from "@/types/Forms";

export const getUserProducts = async (
  userId: number
): Promise<AxiosResponse<GetProductsResponse>> => {
  return await axios.get(`/AllUserProducts/${userId}`);
};

export const deleteProduct = async (
  productId: number
): Promise<AxiosResponse<DeleteProductResponse>> => {
  return await axios.delete(`/DeleteProduct/${productId}`);
};

export const addProduct = async (
  productInfo: UserProductFields,
  userId: number
): Promise<AxiosResponse<NewProductResponse>> => {
  return await axios.post("/AddProduct", { ...productInfo, userId });
};

export const updateProduct = async (
  productNewInfo: UserProductFields,
  userId: number,
  productId: number
): Promise<AxiosResponse<NewProductResponse>> => {
  return await axios.patch("/UpdateUserProduct", { ...productNewInfo, userId, productId });
};

export const getCategories = async (): Promise<AxiosResponse<GetProductCategoriseResponse>> => {
  return await axios.get("/ProductCategories");
};
