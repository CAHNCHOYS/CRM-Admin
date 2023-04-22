import axios from "./axios";

import type {
  LoginFields,
  RegisterFields,
  UpdateInfoFields,
  UpdatePasswordFields
} from "@/types/Forms";
import type {
  DeleteResponse,
  GetUserResponse,
  LoginResponse,
  RegisterResponse,
  UpdateResponse
} from "@/types/BackendResponses";
import type { AxiosResponse } from "axios";


class AuthService {
  async login(loginPayload: LoginFields): Promise<AxiosResponse<LoginResponse>> {
    return await axios.post("/Login", loginPayload);
  }

  async getUser(): Promise<AxiosResponse<GetUserResponse>> {
    return await axios.get("/FetchUser");
  }

  async register(registerPayload: RegisterFields): Promise<AxiosResponse<RegisterResponse>> {
    return await axios.post("/Registration", registerPayload);
  }

  async deleteAccount(userId: number): Promise<AxiosResponse<DeleteResponse>> {
    return await axios.delete(`/DeleteAccount/${userId}`);
  }

  async updatePassword(
    updatePayload: UpdatePasswordFields
  ): Promise<AxiosResponse<UpdateResponse>> {
    return await axios.patch("/UpdateUserPassword", updatePayload);
  }

  async updateInfo(formData: FormData): Promise<AxiosResponse<UpdateResponse>> {
    return await axios.patch("/UpdateUserInfo", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
}

export default new AuthService();
