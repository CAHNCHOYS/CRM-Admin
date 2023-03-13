import type { GetProductsResponse } from "@/types/BackendResponses";
import { isAxiosError } from "axios";
import axios from "./axios";
import { handleAxiosError } from "./axioxErrorHandle";

export const getAllUserProducts = async (userId: number) => {
  try {
    const { data } = await axios.get<GetProductsResponse>("/getAllProducts/" + userId);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      return handleAxiosError(error);
    }
    return { error: "Неизвестная ошибка" };
  }

};



