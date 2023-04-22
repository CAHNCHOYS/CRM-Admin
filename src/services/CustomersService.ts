import axios from "./axios";
import type { AxiosResponse } from "axios";
import type {
  AddCustomersResponse,
  DeleteResponse,
  GetCustomersResponse,
  UpdateResponse
} from "@/types/BackendResponses";
import type { UserCustomerFields } from "@/types/Forms";

type SeachPayload = {
  userId: number;
  secondName: string;
  searchWithPremium: string;
  premium: 0 | 1;
};

class CustomerService {
  async getCustomers(userId: number): Promise<AxiosResponse<GetCustomersResponse>> {
    return axios.get("/Clients/" + userId);
  }

  async getSearchedCustomers({
    secondName,
    userId,
    searchWithPremium,
    premium
  }: SeachPayload): Promise<AxiosResponse<GetCustomersResponse>> {
    return await axios.get(
      `/SearchClients/${userId}?secondName=${secondName}&searchWithPremium=${searchWithPremium}&premium=${premium}`
    );
  }

  async deleteCustomer(customerId: number): Promise<AxiosResponse<DeleteResponse>> {
    return axios.delete("/Clients/" + customerId);
  }

  async addCustomer(addPayload: UserCustomerFields): Promise<AxiosResponse<AddCustomersResponse>> {
    return axios.post("/Clients", addPayload);
  }

  async updateCustomer(updatePayload: UserCustomerFields, customerId: number): Promise<AxiosResponse<UpdateResponse>> {
    return await axios.patch("/Clients", { ...updatePayload, customerId });
  }
}

export default new CustomerService();
