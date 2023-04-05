import { defineStore } from "pinia";
import { ref } from "vue";

import { useUserProductsStore } from "./userProducts";
import { useUserClientsStore } from "./userClients";
import { useAlertStore } from "./alert";

import { login, register, getUserByToken } from "@/services/UserService";
import { isAxiosError } from "axios";
import { handleAxiosError } from "@/services/axioxErrorHandle";

import type { IUser } from "@/types/interfaces";
import type { LoginFields, RegisterFields } from "@/types/Forms";


export const useUserAuthStore = defineStore("userAuth", () => {
  
  const currentUser = ref<IUser | null>(null);
  const isUserLoggedIn = ref(false);

  const alertStore = useAlertStore(); //Показ уведомлений

  async function loginUser(loginPayload: LoginFields): Promise<void> {
    try {
      const { data } = await login(loginPayload);
      setToken(data.token);
      setUser(data.user);
      isUserLoggedIn.value = true;
      alertStore.showMessage("success", "Авторизация успешна, вскоре вы будете переведены на сайт");
    } catch (error) {
      if (isAxiosError(error)) {
        alertStore.showMessage("error", handleAxiosError(error));
      } else alertStore.showMessage("error", "Ошибка при авторизации, попробуйте позже");
    }
  }

  async function registerUser(registerPayload: RegisterFields): Promise<boolean> {
    try {
      await register(registerPayload);
      alertStore.showMessage("success", "Вы успешно зарегистрировались, можете переходить к авторизации");
      return true;
    } catch (error) {
      if (isAxiosError(error)) {
        alertStore.showMessage("error", handleAxiosError(error));
      } else alertStore.showMessage("error", "Ошибка при регистрации, попробуйте позже");
      return false;
    }
  }

  function setToken(token: string) {
    localStorage.setItem("token", token);
  }

  function setUser(user: IUser) {
    currentUser.value = user;
  }

  function logOutUser(): void {
    const userProductsStore = useUserProductsStore();
    const userClientsStore = useUserClientsStore();
 
    userProductsStore.clearUserProducts();
    userClientsStore.clearUserClients();

    currentUser.value = null;
    localStorage.removeItem("token");
    isUserLoggedIn.value = false;
  }

  async function fetchUser(): Promise<void> {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const { data } = await getUserByToken(token);
        setUser(data.user);
       
        isUserLoggedIn.value = true;
      } catch (error) {
        logOutUser();
      }
    }
  }

  return {
    currentUser,
    isUserLoggedIn,

    loginUser,
    registerUser,
    logOutUser,
    fetchUser
  };
});
