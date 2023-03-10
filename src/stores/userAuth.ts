import { defineStore } from "pinia";
import { ref } from "vue";

import type { IUser } from "@/types/interfaces";
import type { LoginFields,  RegisterFields } from "@/types/FormFields";
import type {
  VerifyTokenResponse,
  DeleteAccountResponse,
  LoginResponse,
  RegisterResponse
} from "@/types/BackendResponses";
import type { UpdateTokenResponse } from "@/types/BackendResponses";

import { verifyToken } from "@/api/verifyToken";
import { updateToken } from "@/api/updateToken";
import { deleteAccount } from "@/api/deleteAccout";
import { loginUser as login } from "@/api/loginUser";
import { registerUser as register } from "@/api/registerUser";

export const useUserAuthStore = defineStore("userAuth", () => {
  const currentUser = ref<IUser | null>(null);

  const isAuthMessageShown = ref(false); //После регистрации и авторизации пользователю показывается алерт с сообщением
  const authMessageType = ref<"success" | "info" | "warning" | "error">("success");
  const authMessageText = ref("");

  function addTokenToStorage({ token, user }: { token: string; user: IUser }): void {
    localStorage.setItem("token", token);
    currentUser.value = user;
  }

  async function loginUser(
    loginData: LoginFields,
    resetField: Function,
    resetForm: Function
  ): Promise<void> {
    const loginResult: LoginResponse = await login(loginData);

    isAuthMessageShown.value = true;
    if (loginResult.errorMessage) {
      authMessageType.value = "error";
      authMessageText.value = loginResult.errorMessage;
    } else if (loginResult.isNoExistEmail) {
      resetField("password");
      authMessageType.value = "info";
      authMessageText.value = `Пользователь с эмейлом  ${loginData.email} не найден`;
    } else if (loginResult.isWrongPassword) {
      resetField("password");
      authMessageType.value = "warning";
      authMessageText.value = "Неверный пароль, пожалуйста, повторите попытку";
    } else if (loginResult.userTokenData) {
      resetForm();
      authMessageType.value = "success";
      authMessageText.value = "Вы успешно авторизировались, вскоре вы будете переведены на сайт!";
      addTokenToStorage(loginResult.userTokenData);
    }
    setTimeout(() => (isAuthMessageShown.value = false), 3500);
  }

  async function registerUser(registerData: RegisterFields, resetForm: Function): Promise<void> {
    const registerResult: RegisterResponse = await register(registerData);
    isAuthMessageShown.value = true;

    if (registerResult.errorMessage) {
      authMessageType.value = "error";
      authMessageText.value = registerResult.errorMessage;
    } else if (registerResult.isUserAlreadyRegistered) {
      authMessageType.value = "info";
      authMessageText.value = "Пользователь с таким email уже зарегистрирован!";
    } else if (registerResult.isSuccess) {
      resetForm();
      authMessageType.value = "success";
      authMessageText.value = "Регистрация прошла успешно, можете переходить к авторизации!";
    }
    setTimeout(() => (isAuthMessageShown.value = false), 3500);
  }


  function logOutUser(): void {
    currentUser.value = null;
    localStorage.removeItem("token");
  }

   
  async function verifyUserToken(token: string): Promise<boolean> {
    const checkToken: VerifyTokenResponse = await verifyToken(token);
    console.log(checkToken);
    if (checkToken.isInvalidToken || checkToken.errorMessage) {
      logOutUser();
    } else if (checkToken.userData) {
      currentUser.value = checkToken.userData;
    }
    return currentUser.value === null;
  }

  async function deleteUserAccount(): Promise<DeleteAccountResponse> {
    const deletionResult: DeleteAccountResponse = await deleteAccount(currentUser.value!.id);
    if (deletionResult.isAccountDeleted) {
      logOutUser();
      return { isAccountDeleted: true };
    } else return { errorMessage: deletionResult.errorMessage };
  }

  type UpdateTokenResult = {
    isTokenUpdated?: true;
    errorMessage?: string;
  }

  async function updateUserToken(userId: number): Promise<UpdateTokenResult> {
    const updatedToken: UpdateTokenResponse = await updateToken(userId);
    if (updatedToken.userTokenData) {
      addTokenToStorage(updatedToken.userTokenData);
      return { isTokenUpdated: true };
    } else return { errorMessage: updatedToken.errorMessage };
  }

  // async function updateUserInfo(formData: FormData) {
  //   let updateResult: UpdateInfoResponse = await updatePublicUserInfo(formData);
  //   console.log(updateResult);
  //   if (updateResult.isInfoUpdated) {
  //     //Так как данные хранятся в токене то получаем новый токен и закидываем в storage
  //     return await updateUserToken(currentUser.value!.id);
  //   } else return { errorMessage: updateResult.errorMessage };
  // }

  // async function updateUserPassword(
  //   userPasswords: UpdatePasswordFields
  // ): Promise<UpdatePasswordResponse> {
  //   let res: UpdatePasswordResponse = await updatePassword(userPasswords, currentUser.value!.id);

  //   if (res.newPassword) {
  //     //Так как данные хранятся в токене то получаем новый токен и закидываем в storage
  //     return await updateUserToken(currentUser.value!.id);
  //   } else if (res.isWrongPassword) {
  //     return { isWrongPassword: true };
  //   } else return { errorMessage: res.errorMessage };
  // }

 

  return {
    currentUser,
    authMessageText,
    authMessageType,
    isAuthMessageShown,

    loginUser,
    registerUser,
    logOutUser,
    addTokenToStorage,
    verifyUserToken,
    updateUserToken,

   // updateUserInfo,
  //  updateUserPassword,
    deleteUserAccount
  };
});
