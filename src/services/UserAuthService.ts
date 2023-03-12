import axios from "./axios";
import { handleAxiosError } from "./axioxErrorHandle";
import { isAxiosError } from "axios";

import type {
  ApiError,
  DeleteAccountResponse,
  LoginResponse,
  RegisterResponse,
  UpdateInfoResponse,
  VerifyTokenResponse
} from "@/types/BackendResponses";

import type { LoginFields, RegisterFields, UpdatePasswordFields } from "@/types/FormFields";

export const loginUser = async (loginPayload: LoginFields): Promise<LoginResponse | ApiError> => {
  try {
    let { data } = await axios.post<LoginResponse>("/Login", loginPayload);
    console.log(data);

    return data;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      return handleAxiosError(error);
    } else return { error: "Неизвестная ошибка" };
  }
};

export const registerUser = async (
  registerPayload: RegisterFields
): Promise<RegisterResponse | ApiError> => {
  try {
    let { data } = await axios.post<RegisterResponse>("/Login", registerPayload);
    return data;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      return handleAxiosError(error);
    } else return { error: "Неизвестная ошибка" };
  }
};

export const verifyToken = async (token: string): Promise<VerifyTokenResponse> => {
  try {
    let { data } = await axios.post<VerifyTokenResponse>("/VerifyToken", { token });
    return data;
  } catch (error) {
    console.log(error);
    return { isInvalidToken: true };
  }
};

export const deleteAccount = async (userId: number): Promise<DeleteAccountResponse | ApiError> => {
  try {
    let { data } = await axios.delete<DeleteAccountResponse>("/DeleteAccount" + userId);
    return data;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      return handleAxiosError(error);
    } else return { error: "Неизвестная ошибка" };
  }
};

export const updateToken = async (userId: number): Promise<LoginResponse | ApiError> => {
  try {
    let { data } = await axios.post<LoginResponse>("/UpdateToken", { id: userId });
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      return handleAxiosError(error);
    } else return { error: "Неизвестная ошибка" };
  }
};

export const updateUserInfo = async (newData: FormData): Promise<UpdateInfoResponse | ApiError> => {
  try {
    let { data } = await axios<UpdateInfoResponse>({
      url: "/UpdateUserInfo",
      method: "patch",
      headers: {
        "Content-Type": "multipart/form-data"
      },
      data: newData,
    });
    return data;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      return handleAxiosError(error);
    } else return { error: "Неизвестная ошибка" };
  }
};

export const updateUserPassword = async (
  newData: UpdatePasswordFields,
  userId: number
): Promise<UpdateInfoResponse | ApiError> => {
  try {
    let { data } = await axios.patch<UpdateInfoResponse>("/UpdateUserPassword", {
      ...newData,
      id: userId
    });

    return data;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      return handleAxiosError(error);
    } else return { error: "Неизвестная ошибка" };
  }
};
