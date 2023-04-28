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
  UpdateAccessTokenResponse,
  UpdateResponse
} from "@/types/BackendResponses";
import type { AxiosResponse } from "axios";

class AuthService {
  async login(loginPayload: LoginFields): Promise<AxiosResponse<LoginResponse>> {
    return await axios.post("/Auth/login", loginPayload);
  }

  async getUser(): Promise<AxiosResponse<GetUserResponse>> {
    return await axios.get("/Auth/FetchUser");
  }

  async logoutUser() {
    return await axios.post("/Auth/logout");
  }

  async updateAccessToken(): Promise<AxiosResponse<UpdateAccessTokenResponse>> {
    return await axios.patch("/Auth/refresh");
  }

  async register(registerPayload: RegisterFields): Promise<AxiosResponse<RegisterResponse>> {
    return await axios.post("/Auth/register", registerPayload);
  }

  async deleteAccount(userId: number): Promise<AxiosResponse<DeleteResponse>> {
    return await axios.delete(`/Auth/delete/${userId}`);
  }

  async updatePassword(
    updatePayload: UpdatePasswordFields
  ): Promise<AxiosResponse<UpdateResponse>> {
    return await axios.patch("/Auth/UpdateUserPassword", updatePayload);
  }

  async updateInfo(formData: FormData): Promise<AxiosResponse<UpdateResponse>> {
    return await axios.patch("/Auth/UpdateUserInfo", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
}

export default new AuthService();
