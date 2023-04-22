import type { DeleteResponse, GetOrdersResponse, NewOrderResponse } from "@/types/BackendResponses";
import type { UserOrderFields } from "@/types/Forms";
import type { Axios, AxiosResponse } from "axios";
import axios from "./axios";


type SearchPayload = {
  userId: number;
  startDate: string;
  endDate: string;
  product: string;
  customer: string;
};



class OrderService {
  async getOrders(userId: number): Promise<AxiosResponse<GetOrdersResponse>> {
    return await axios.get(`/Orders/${userId}`);
  }

  async getSerachedOrders({
    userId,
    startDate,
    endDate,
    product,
    customer
  }: SearchPayload): Promise<AxiosResponse<GetOrdersResponse>> {
    return await axios.get(
      `/SearchOrders/${userId}?startDate=${startDate}&endDate=${endDate}&product=${product}&customer=${customer}`
    );
  }

  async addOrder(addOrderPayload: UserOrderFields): Promise<AxiosResponse<NewOrderResponse>> {
    return await axios.post("/Orders", addOrderPayload);
  }

  async updateOrder(
    updateOrderPayload: UserOrderFields,
    orderId: number
  ): Promise<AxiosResponse<NewOrderResponse>> {
    return await axios.patch("/Orders", { ...updateOrderPayload, orderId });
  }

  async deleteOrder(orderId: number): Promise<AxiosResponse<DeleteResponse>> {
    return await axios.delete("/Orders/" + orderId);
  }
}

export default new OrderService();
