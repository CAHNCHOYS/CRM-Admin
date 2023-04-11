import { defineStore } from "pinia";
import { ref } from "vue";

import { useUserProductsStore } from "./userProducts";
import { useUserClientsStore } from "./userClients";

import { getUserByToken } from "@/services/AuthService";
import axiosInstance from "@/services/axios";

import type { IUser } from "@/types/interfaces";

export const useUserAuthStore = defineStore("userAuth", () => {
  const currentUser = ref<IUser | null>(null);
  const isUserLoggedIn = ref(false);

  const isUserFetching = ref(false);

  function setToken(token: string) {
    localStorage.setItem("token", token);
  }
  function removeToken() {
    localStorage.removeItem("token");
  }

  function setUser(user: IUser) {
    currentUser.value = user;
    isUserLoggedIn.value = true;
  }

  function logOutUser(): void {
    const { clearUserClients } = useUserClientsStore();
    const { clearUserProducts } = useUserProductsStore();
    clearUserClients();
    clearUserProducts();
    currentUser.value = null;
    localStorage.removeItem("token");
    isUserLoggedIn.value = false;
    
    delete axiosInstance.defaults.headers.common["Authorization"];
  }

  async function fetchUser(): Promise<void> {
    isUserFetching.value = true;
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const { data } = await getUserByToken(token);
        setUser(data.user);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (error) {
        removeToken();
      }
    }
    isUserFetching.value = false;
  }

  return {
    currentUser,
    isUserLoggedIn,
    isUserFetching,

    logOutUser,
    fetchUser,
    setUser,
    setToken
  };
});
