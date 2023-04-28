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
    return axios.get("/Customers/" + userId);
  }

  async getSearchedCustomers({
    secondName,
    userId,
    searchWithPremium,
    premium
  }: SeachPayload): Promise<AxiosResponse<GetCustomersResponse>> {
    return await axios.get(
      `/Customers/search/${userId}?secondName=${secondName}&searchWithPremium=${searchWithPremium}&premium=${premium}`
    );
  }

  async deleteCustomer(customerId: number): Promise<AxiosResponse<DeleteResponse>> {
    return axios.delete("/Customers/" + customerId);
  }

  async addCustomer(addPayload: UserCustomerFields): Promise<AxiosResponse<AddCustomersResponse>> {
    return axios.post("/Customers", addPayload);
  }

  async updateCustomer(
    updatePayload: UserCustomerFields,
    customerId: number
  ): Promise<AxiosResponse<UpdateResponse>> {
    return await axios.patch("/Customers", { ...updatePayload, customerId });
  }
}

export default new CustomerService();
