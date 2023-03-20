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

export const useUserAuthStore = defineStore("userAuth", () => {
  
  const currentUser = ref<IUser | null>(null);
  const isUserLoggedIn = ref(false);

  const alertStore = useAlertStore(); //Показ уведомлений

  async function loginUser(loginPayload: LoginFields, resetForm: Function): Promise<void> {
    const loginResult: LoginResponse | ApiError = await makeRequest({
      method: "post",
      url: "/Login",
      body: loginPayload
    });

    if ("error" in loginResult) {
      resetForm();
      alertStore.showMessage("error", loginResult.error);
    } else {
      addTokenToStorage(loginResult.userTokenData);
      alertStore.showMessage(
        "success",
        "Вы успешно авторизировались, вскоре вы будете переведены на сайт"
      );
      isUserLoggedIn.value = true;
      resetForm();
    }
  }

  async function registerUser(registerPayload: RegisterFields): Promise<boolean> {
    const registerResult: RegisterResponse | ApiError = await makeRequest({
      url: "/Registration",
      method: "post",
      body: registerPayload
    });

    console.log(registerResult);
    if ("error" in registerResult) {
      alertStore.showMessage("error", registerResult.error);
      return false;
    } else {
      alertStore.showMessage(
        "success",
        "Вы успешно зарегистрировались, можете переходить к авторизации!"
      );
      return true;
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

  type UpdateTokenResult = {
    isTokenUpdated?: true;
    error?: string;
  };

  async function updateUserToken(): Promise<UpdateTokenResult> {
    const updatedToken: LoginResponse | ApiError = await makeRequest({
      url: "/UpdateToken",
      method: "patch",
      body: { id: currentUser.value!.id }
    });

    if ("error" in updatedToken) {
      return { error: updatedToken.error };
    } else {
      addTokenToStorage(updatedToken.userTokenData);
      return { isTokenUpdated: true };
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
