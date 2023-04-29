import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { AxiosInstance } from "axios";
import { useUserAuthStore } from "@/stores/userAuth";
import AuthService from "./AuthService";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _sent: boolean;
  }
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

//set Token
const token = localStorage.getItem("token");
if (token) {
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
}

//refresh access token
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    console.log("error occuried", error);

    const originalRequest = error.config as InternalAxiosRequestConfig;
    console.log("config", originalRequest);
    if (error.response?.status === 403 && !originalRequest._sent) {
      try {
        originalRequest._sent = true;
        const { data } = await AuthService.updateAccessToken();
        const userAuthStore = useUserAuthStore();
        userAuthStore.setToken(data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (error) {
        await AuthService.logoutUser();
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;
