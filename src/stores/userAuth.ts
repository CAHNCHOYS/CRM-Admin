import { defineStore } from "pinia";
import { ref } from "vue";

import { useUserProductsStore } from "./userProducts";
import { useUserCustomersStore } from "./userCustomers";
import { useUserOrdersStore } from "./userOrders";

import AuthService from "@/services/AuthService";
import axiosInstance from "@/services/axios";

import type { IUser } from "@/types/interfaces";

export const useUserAuthStore = defineStore("userAuth", () => {
  const currentUser = ref<IUser | null>(null);
  const isUserLoggedIn = ref(false);

  const isUserDataFetching = ref(false);

  function setToken(token: string): void {
    localStorage.setItem("token", token);
  }

  function removeToken(): void {
    localStorage.removeItem("token");
    delete axiosInstance.defaults.headers.common["Authorization"];
  }

  function setUser(user: IUser): void {
    currentUser.value = user;
    isUserLoggedIn.value = true;
  }

  async function logOutUser(): Promise<void> {
    try {
      await AuthService.logoutUser();
      removeToken();
      currentUser.value = null;
      isUserLoggedIn.value = false;
    } catch (error) {
      throw error;
    }
  }

  async function fetchData(): Promise<void> {
    const { getAllUserCustomers } = useUserCustomersStore();
    const { getAllUserProducts } = useUserProductsStore();
    const { getAllUserOrders } = useUserOrdersStore();

    await getAllUserCustomers(currentUser.value!.id);
    await getAllUserProducts(currentUser.value!.id);
    await getAllUserOrders(currentUser.value!.id);
  }

  async function getUserData(): Promise<void> {
    if (localStorage.getItem("token")) {
      try {
        isUserDataFetching.value = true;
        const { data } = await AuthService.getUser();
        setUser(data.user);
        await fetchData();
      } catch (error) {
        removeToken();
      } finally {
        isUserDataFetching.value = false;
      }
    }
  }

  return {
    currentUser,
    isUserLoggedIn,
    isUserDataFetching,

    logOutUser,
    fetchData,
    getUserData,
    setUser,
    setToken
  };
});
