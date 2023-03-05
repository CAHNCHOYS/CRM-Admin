import { defineStore } from "pinia";
import type { IUser } from "@/types/index";
import { ref } from "vue";

export const useUserAuthStore = defineStore("userAuth", () => {
    
  const currentUser = ref<IUser | null>(null);

  function addTokenToStorage(token: string, user: IUser): void {
    localStorage.setItem("token", token);
    currentUser.value = user;
  }


  function verifyUserToken(): void {


  }



  return { currentUser, addTokenToStorage };
});
