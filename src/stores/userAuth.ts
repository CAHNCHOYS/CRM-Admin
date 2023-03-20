import { defineStore } from "pinia";
import { ref } from "vue";

import { useUserProductsStore } from "./userProducts";
import { useAlertStore } from "./alert";

import type { IUser } from "@/types/interfaces";
import type { LoginFields, RegisterFields } from "@/types/Forms";
import type {
  VerifyTokenResponse,
  RegisterResponse,
  LoginResponse,
  ApiError
} from "@/types/BackendResponses";
import { makeRequest } from "@/services/axiosFetch";
import { login, register, updateToken } from "@/services/users";
import { isAxiosError, type AxiosError, type AxiosResponse } from "axios";
import { handleAxiosError } from "@/services/axioxErrorHandle";

export const useUserAuthStore = defineStore("userAuth", () => {
  const currentUser = ref<IUser | null>(null);
  const isUserLoggedIn = ref(false);

  const alertStore = useAlertStore(); //Показ уведомлений

  async function loginUser(loginPayload: LoginFields, resetForm: Function): Promise<void> {
    try {
      const { data }: AxiosResponse<LoginResponse> = await login(loginPayload);

      addTokenToStorage(data.userTokenData);
      isUserLoggedIn.value = true;
      alertStore.showMessage(
        "success",
        "Вы успешно авторизировались, вскоре вы будете переведены на сайт"
      );
    } catch (error) {
      if (isAxiosError<ApiError>(error)) {
        alertStore.showMessage("error", handleAxiosError(error).error);
      } else {
        alertStore.showMessage("error", "Ошибка при авторизации, попробуйте позже");
      }
      resetForm();
    }
  }

  async function registerUser(registerPayload: RegisterFields): Promise<boolean> {
    try {
      const { data } = await register(registerPayload);
      alertStore.showMessage(
        "success",
        "Вы успешно зарегистрировались, можете переходить к авторизации!"
      );
      return true;
    } catch (error) {
      if (isAxiosError<ApiError>(error)) {
        alertStore.showMessage("error", handleAxiosError(error).error);
      } else {
        alertStore.showMessage("error", "Ошибка при регистрации, попробуйте позже");
      }
      return false;
    }
  }

  function addTokenToStorage({ token, user }: { token: string; user: IUser }): void {
    localStorage.setItem("token", token);
    currentUser.value = user;
  }

  function logOutUser(): void {
    const userProductsStore = useUserProductsStore();
    currentUser.value = null;
    localStorage.removeItem("token");
    isUserLoggedIn.value = false;
    userProductsStore.clearUserProducts();
  }

  async function verifyUserToken(): Promise<void> {
    const token = localStorage.getItem("token");
    if (token) {
      const checkToken: VerifyTokenResponse | ApiError = await makeRequest({
        url: "/VerifyToken",
        method: "post",
        body: { token }
      });
      console.log(checkToken);
      //Если токен не валиден или произошла ошибка
      if ("error" in checkToken) logOutUser();
      else {
        currentUser.value = checkToken.userData;
        isUserLoggedIn.value = true;
      }
    }
  }

  async function updateUserToken(): Promise<void> {
    try {
      const { data } = await updateToken(currentUser.value!.id);
      addTokenToStorage(data.userTokenData);
    } catch (error) {
      throw error;
    }
  }

  return {
    currentUser,
    isUserLoggedIn,

    loginUser,
    registerUser,
    logOutUser,
    verifyUserToken,
    updateUserToken
  };
});
