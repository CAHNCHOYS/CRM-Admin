import axios from "./axios";

import type { LoginFields, RegisterFields, UpdatePasswordFields, UpdateInfoFields } from "@/types/Forms";
import type { LoginResponse, RegisterResponse, UpdateUserResponse } from "@/types/BackendResponses";
import type { AxiosResponse } from "axios";

export const login = async (loginPayload: LoginFields): Promise<AxiosResponse<LoginResponse>> => {
  return await axios.post("/Login", loginPayload);
};

export const register = async (
  registerPayload: RegisterFields
): Promise<AxiosResponse<RegisterResponse>> => {
  return await axios.post("/Registration", registerPayload);
};

export const updateToken = async (id: number): Promise<AxiosResponse<LoginResponse>> => {
  return await axios.patch("/UpdateToken", { id });
};

export const updatePassword = async (
  updatePasswordPayload: UpdatePasswordFields
): Promise<AxiosResponse<UpdateUserResponse>> => {
  return await axios.patch("/UpdateUserPassword", updatePasswordPayload);
};


export const updateInfo =async (formData: FormData):Promise<AxiosResponse<UpdateUserResponse>> => {
    return await axios.patch("/UpdateUserInfo", formData, {
      headers: {
        "Content-Type":  "multipart/form-data",
      }
    });
}