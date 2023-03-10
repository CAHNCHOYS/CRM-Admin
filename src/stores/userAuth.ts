import { defineStore } from "pinia";
import { ref } from "vue";

import type { IUser } from "@/types/interfaces";
import type { LoginFields, RegisterFields } from "@/types/FormFields";
import type {
  VerifyTokenResponse,
  DeleteAccountResponse,
  RegisterResponse,
  LoginResponse,
  ApiError
} from "@/types/BackendResponses";
import { fetchData } from "@/services/axiosFetch";


export const useUserAuthStore = defineStore("userAuth", () => {
  const currentUser = ref<IUser | null>(null);

  const isSuccessMessageShown = ref(false); //Уведомления после успешной регистрации|авторизации
  const isErrorMessageShown = ref(false); // Если ошибка пре регистрации|авторизации
  const authErrorMessage = ref("Произошла ошибка");

  const isUserLoggedIn = ref(false);

  async function loginUser(loginPayload: LoginFields, resetForm: Function): Promise<void> {
    const loginResult: LoginResponse | ApiError = await fetchData<LoginResponse>({
      method: "post",
      url: "/Login",
      body: loginPayload
    });

    //Если ошибка
    if ("error" in loginResult) {
      isErrorMessageShown.value = true;
      authErrorMessage.value = loginResult.error;
      resetForm();
      setTimeout(() => (isErrorMessageShown.value = false), 3500);
    } else {
      //Если залогинились
      addTokenToStorage(loginResult.userTokenData);
      isSuccessMessageShown.value = true;

      isUserLoggedIn.value = true;
      resetForm();
      setTimeout(() => (isSuccessMessageShown.value = false), 3500);
    }
  }

  async function registerUser(registerPayload: RegisterFields): Promise<void> {
    const registerResult: RegisterResponse | ApiError = await fetchData<RegisterResponse>({
      url: "/Register",
      body: registerPayload,
      method: "post"
    });

    console.log(registerResult);
    if ("error" in registerResult) {
      isErrorMessageShown.value = true;
      authErrorMessage.value = registerResult.error;
      setTimeout(() => (isErrorMessageShown.value = false), 3500);
    } else if (registerResult.isSuccess) {
      isSuccessMessageShown.value = true;
      setTimeout(() => (isSuccessMessageShown.value = false), 3500);
    }
  }

  function addTokenToStorage({ token, user }: { token: string; user: IUser }): void {
    localStorage.setItem("token", token);
    currentUser.value = user;
  }

  function logOutUser(): void {
    currentUser.value = null;
    localStorage.removeItem("token");
    isUserLoggedIn.value = false;
  }

  async function verifyUserToken(): Promise<void> {
    let token = localStorage.getItem("token");

    if (token) {
      const checkToken: VerifyTokenResponse | ApiError = await fetchData<VerifyTokenResponse>({
        url: "/VerifyToken",
        method: "post",
        body: { token }
      });
      console.log(checkToken);
      if ("error" in checkToken) logOutUser();
      else {
        currentUser.value = checkToken.userData;
        isUserLoggedIn.value = true;
      }
    }
  }

  async function deleteUserAccount(): Promise<{ error: string } | { isAccountDeleted: true }> {
    const deletionResult: DeleteAccountResponse | ApiError = await fetchData<DeleteAccountResponse>(
      {
        method: "delete",
        url: "/DeleteAccount" + currentUser.value!.id
      }
    );

    if ("error" in deletionResult) {
      logOutUser();
      return { error: deletionResult.error };
    } else {
      logOutUser();
      return { isAccountDeleted: true };
    }
  }

  type UpdateTokenResult = {
    isTokenUpdated?: true;
    error?: string;
  };

  async function updateUserToken(): Promise<UpdateTokenResult> {

    const updatedToken: LoginResponse | ApiError = await fetchData<LoginResponse>({
      url:"/UpdateToken",
      method: "patch",
      body: {id: currentUser.value!.id}
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
    isErrorMessageShown,
    isSuccessMessageShown,
    authErrorMessage,

    loginUser,
    registerUser,
    logOutUser,
    verifyUserToken,
    updateUserToken,
    deleteUserAccount
  };
});
