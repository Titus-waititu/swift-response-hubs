import axios from "axios";
import { baseUrl } from "./url";
import { useAuthStore } from "@/stores/authStore";

export const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth tokens if needed
apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor - extract data from axios response
apiClient.interceptors.response.use(
  (response) => {
    // Return the actual data from the response
    return response.data;
  },
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);
