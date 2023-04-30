import { useUserAuthStore } from "@/stores/userAuth";
import { ref } from "vue";
import { useRouter } from "vue-router";

export const useLogoutHandler = (pageName: string) => {
  const userAuthStore = useUserAuthStore();

  const router = useRouter();
  const isLogoutLoading = ref(false);

  const handleLogout = async () => {
    try {
      isLogoutLoading.value = true;
      await userAuthStore.logOutUser();
      router.push({
        name: "login-page",
        query: { isExpiredToken: "true", redirectedFrom: pageName }
      });
    } catch (error) {
      console.log(error);
    } finally {
      isLogoutLoading.value = false;
    }
  };

  return { handleLogout, isLogoutLoading };
};
