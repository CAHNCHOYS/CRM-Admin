import axios from "./axios";
import type { AxiosResponse } from "axios";
import type {
  DeleteResponse,
  GetProductCategoriseResponse,
  GetProductsResponse,
  AddProductResponse,
  UpdateResponse
} from "@/types/BackendResponses";

import type { UserProductFields } from "@/types/Forms";

type SearchPayload = {
  productName: string;
  startPrice: string;
  endPrice: string;
  userId: number;
};

class ProductService {
  constructor() {}

  async getProducts(userId: number): Promise<AxiosResponse<GetProductsResponse>> {
    return await axios.get(`/Products/${userId}`);
  }

  async getProductCategories(): Promise<AxiosResponse<GetProductCategoriseResponse>> {
    return await axios.get("/Products/categories/all");
  }

  async deleteProduct(productId: number): Promise<AxiosResponse<DeleteResponse>> {
    return await axios.delete(`/Products/${productId}`);
  }

  async addProduct(addPayload: UserProductFields): Promise<AxiosResponse<AddProductResponse>> {
    return await axios.post("/Products", addPayload);
  }

  async updateProduct(
    updatePayload: UserProductFields,
    productId: number
  ): Promise<AxiosResponse<UpdateResponse>> {
    return await axios.patch("/Products", { ...updatePayload, productId });
  }

  async getSearchedProducts({
    productName,
    startPrice,
    endPrice,
    userId
  }: SearchPayload): Promise<AxiosResponse<GetProductsResponse>> {
    return await axios.get(
      `/Products/search/${userId}?name=${productName}&startPrice=${startPrice}&endPrice=${endPrice}`
    );
  }
}

export default new ProductService();
