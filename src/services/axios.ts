import axios from "axios";
import type { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

const token = localStorage.getItem("token");
if (token) {
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export default axiosInstance;
