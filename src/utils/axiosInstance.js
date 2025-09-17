// /lib/axiosInstance.js
import axios from "axios";
import { getCookie, removeCookie } from "../../cookie";
import toast from "react-hot-toast";

const DEFAULT_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL;

// 🔹 Factory to create axios instance
function createAxios({ getToken } = {}) {
  
  const instance = axios.create({
    baseURL: DEFAULT_BASE_URL,
    timeout: 15000,
  });

  // Request interceptor → add x-auth-token if available
  instance.interceptors.request.use(
    (config) => {
      let token;

      if (getToken) {
        // On the server: caller provides token
        token = getToken();
      } else if (typeof window !== "undefined") {
        // On the client: you can use localStorage or rely on cookies
        token = getCookie("userToken");
      }

      if (token) {
        config.headers["x-auth-token"] = token;
        config.headers["Content-Type"] = "application/json";
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor → handle 401
  instance.interceptors.response.use(
    (res) => res,
    (error) => {
      const status = error?.response?.status;
      if (status === 401 && typeof window !== "undefined") {
        // Clear token from localStorage (since we’re not using js-cookie)
        toast.error("Your account is currently deactivate. Please Connect to Admin.");
        removeCookie("userToken");
        removeCookie("user");
        window.location.href =`${window.location.protocol}//${window.location.host}`;
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

const axiosClient = createAxios();

export const createServerAxios = (getToken) => createAxios({ getToken });

export default axiosClient;
