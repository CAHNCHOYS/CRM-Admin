import axios from "./axios";

import type { LoginFields, RegisterFields, UpdatePasswordFields } from "@/types/Forms";
import type {
 DeleteResponse,
  GetUserResponse,
  LoginResponse,
  RegisterResponse,
  UpdateUserResponse
} from "@/types/BackendResponses";
import type { AxiosResponse } from "axios";

export const login = async (loginPayload: LoginFields): Promise<AxiosResponse<LoginResponse>> => {
  return await axios.post("/Login", loginPayload);
};

export const register = async (
  registerPayload: RegisterFields
): Promise<AxiosResponse<RegisterResponse>> => {
  return await axios.post("/Registration", registerPayload);
};

export const deleteAccount = async (id: number): Promise<AxiosResponse<DeleteResponse>> => {
  return await axios.delete(`/DeleteAccount/${id}`);
};

export const getUserByToken = async (token: string): Promise<AxiosResponse<GetUserResponse>> => {
  return await axios.get("/FetchUser", {
    headers: {
      authorization: `Bearer ${token}`
    }
  });
};

export const updatePassword = async (
  updatePasswordPayload: UpdatePasswordFields,
  id: number
): Promise<AxiosResponse<UpdateUserResponse>> => {
  return await axios.patch("/UpdateUserPassword", { ...updatePasswordPayload, id });
};

export const updateInfo = async (
  formData: FormData
): Promise<AxiosResponse<UpdateUserResponse>> => {
  return await axios.patch("/UpdateUserInfo", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};


