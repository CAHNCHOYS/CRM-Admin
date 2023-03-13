import type { ApiError } from "@/types/BackendResponses";
import { isAxiosError, type AxiosRequestConfig } from "axios";
import axios from "./axios";

import { handleAxiosError } from "./axioxErrorHandle";

type Method = "get" | "post" | "patch" | "delete" | "put";

type FetchSettings = {
  method: Method;
  url: string;
  body?: {};
  settings?: AxiosRequestConfig;
};

export const fetchData = async <T>({  method,  url,  body,  settings}: FetchSettings): Promise<T | ApiError> => {
  try {
    let { data } = await axios[method]<T>(url, body, settings);
    return data;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      return handleAxiosError(error);
    } else return { error: "Неизвестная ошибка" };
  }
};
