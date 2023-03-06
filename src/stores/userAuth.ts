import { defineStore } from "pinia";
import type { IUser } from "@/types/index";
import { ref } from "vue";

import { verifyToken } from "@/api/verifyToken";

export const useUserAuthStore = defineStore("userAuth", () => {
  const currentUser = ref<IUser | null>(null);

  function addTokenToStorage({ token, user }: { token: string; user: IUser }): void {
    localStorage.setItem("token", token);
    currentUser.value = user;
  }

  


  async function verifyUserToken(): Promise<void> {
    let token = localStorage.getItem("token");
    if(token){
      const checkToken = await verifyToken(token);

      console.log(checkToken);

      if(checkToken.isInvalidToken || checkToken.errorMessage){
         logOutUser();
      }
    }
  }


  


  function logOutUser(): void {
     currentUser.value = null;
     localStorage.removeItem("token");
  }

   



  return { currentUser, addTokenToStorage, verifyUserToken, logOutUser };
});
