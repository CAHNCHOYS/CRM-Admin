import axios from "axios";
import type {AxiosInstance} from "axios"


const axiosInstance: AxiosInstance = axios.create({
    baseURL:"https://crm-backend-mocha.vercel.app/api",
    headers: {
        "Content-Type": "application/json",
    },
})

export default axiosInstance;