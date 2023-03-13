import type { ApiError } from "@/types/BackendResponses";
import type{ AxiosError } from "axios";

export const handleAxiosError = (error: AxiosError<ApiError>) => {
    if (error.response) {
      return { error: error.response.data.error || error.response.data.toString() };
    } else if (error.request) {
      return { error: "Не получили ответа с сервера, возможно, он не доступен, попробуйте повторить позже" };
    } else {
      return { error: "Что-то случилось при отправке запроса, возможно сервер не доступен, попробуйте, позже" };
    }
  };