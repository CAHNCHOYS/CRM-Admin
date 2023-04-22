
import { isAxiosError } from "axios";
import type { ApiError } from "@/types/BackendResponses";
import type { AxiosError} from "axios";

export const handleAxiosError = (error: AxiosError<ApiError>) => {
  if (error.response) {
    return error.response.data.error || error.response.data.toString();
  } else if (error.request) {
    return "Сервер не отправил ответ, попробуйте повторить позже";
  } else {
    return "Что-то случилось при отправке запроса, возможно,  сервер не доступен, попробуйте, позже";
  }
};

export {isAxiosError};
