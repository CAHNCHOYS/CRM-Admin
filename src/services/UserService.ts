import axios from "./axios";

import type { LoginFields, RegisterFields, UpdatePasswordFields } from "@/types/Forms";
import type {
  LoginResponse,
  RegisterResponse,
  UpdateUserResponse,
  VerifyTokenResponse
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

export const verifyToken = async (token: string): Promise<AxiosResponse<VerifyTokenResponse>> => {
  return await axios.post("/VerifyToken", { token });
};

export const updateToken = async (id: number): Promise<AxiosResponse<LoginResponse>> => {
  return await axios.patch("/UpdateToken", { id });
};

type UpdatePasswordPayload = UpdatePasswordFields & {
  id: number;
};
export const updatePassword = async (
  updatePasswordPayload: UpdatePasswordPayload
): Promise<AxiosResponse<UpdateUserResponse>> => {
  return await axios.patch("/UpdateUserPassword", updatePasswordPayload);
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
