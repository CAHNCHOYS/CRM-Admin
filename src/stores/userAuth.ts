import { defineStore } from "pinia";
import { ref } from "vue";

import type { IUser } from "@/types/interfaces";
import type { UpdateInfoFields, UpdatePasswordFields } from "@/types/FormFields";
import type {
  VerifyTokenResponse,
  UpdateInfoResponse,
  UpdatePasswordResponse
} from "@/types/responses";
import type { UpdateTokenResponse } from "@/types/responses";

import { updatePublicUserInfo } from "@/api/updatePublicUserInfo";
import { verifyToken } from "@/api/verifyToken";
import { updateToken } from "@/api/updateToken";
import { updatePassword } from "@/api/updatePassword";

export const useUserAuthStore = defineStore("userAuth", () => {
  const currentUser = ref<IUser | null>(null);

  const isAuthMessageShown = ref(false); //После регистрации и авторизации пользователю показывается алерт с сообщением
  const authMessageType = ref<"success" | "info" | "warning" | "error">("success");
  const authMessageText = ref("");

  
  function addTokenToStorage({ token, user }: { token: string; user: IUser }): void {
    localStorage.setItem("token", token);
    currentUser.value = user;
  }

  

  async function verifyUserToken(token: string) {
    const checkToken: VerifyTokenResponse = await verifyToken(token);
    console.log(checkToken);
    if (checkToken.isInvalidToken || checkToken.errorMessage) {
      logOutUser();
    } else if (checkToken.userData) {
      currentUser.value = checkToken.userData;
    }
    return currentUser.value === null ? { isInvalidToken: true } : { isValidToken: true };
  }

  type InfoUpdatedResult = {
    isInfoUpdated?: true;
    errorMessage?: string;
  };

  async function updateUserToken(userId: number): Promise<InfoUpdatedResult> {
    const updatedToken: UpdateTokenResponse = await updateToken(userId);

    if (updatedToken.userTokenData) {
      addTokenToStorage(updatedToken.userTokenData);
      return { isInfoUpdated: true };
    } else return { errorMessage: updatedToken.errorMessage };
  }

  async function updateUserInfo(formData: FormData, userData: UpdateInfoFields) {
    let updateResult: UpdateInfoResponse = await updatePublicUserInfo(formData);

    console.log(updateResult);
    if (updateResult.isInfoUpdated) {
      //Картинки хранятся на сервере с названием user + id юзера + название картинки
      userData.avatar = `user${currentUser.value!.id}` + (userData.avatar[0] as File).name;
      //Обновляем информацию на фронте
      currentUser.value = Object.assign(currentUser.value!, userData);

      //Так как данные хранятся в токене то получаем новый токен и закидываем в storage
      return await updateUserToken(currentUser.value.id);
    } else return { errorMessage: updateResult.errorMessage };
  }

  type UpdatePasswordResult = {
    isWrongPassword?: true;
    isInfoUpdated?: true;
    errorMessage?: string;
  };

  async function updateUserPassword(
    userPasswords: UpdatePasswordFields
  ): Promise<UpdatePasswordResult> {
    let res: UpdatePasswordResponse = await updatePassword(userPasswords, currentUser.value!.id);

    if (res.newPassword) {
      currentUser.value!.password = res.newPassword;

      //Так как данные хранятся в токене то получаем новый токен и закидываем в storage
      return await updateUserToken(currentUser.value!.id);
    } else if (res.isWrongPassword) {
      return { isWrongPassword: true };
    } else {
      return { errorMessage: res.errorMessage };
    }
  }

  function deleteUserAccount() {
    logOutUser();
  }

  function logOutUser(): void {
    currentUser.value = null;
    localStorage.removeItem("token");
  }

  return {
    currentUser,
    authMessageText,
    authMessageType,
    isAuthMessageShown,

    addTokenToStorage,
    verifyUserToken,
    logOutUser,
    updateUserInfo,
    updateUserPassword
  };
});
