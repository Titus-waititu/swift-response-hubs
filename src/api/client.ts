import axios from "axios";
import { baseUrl } from "./url";
import { useAuthStore } from "@/stores/authStore";

export const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  isRefreshing = false;
  failedQueue = [];
};

// Request interceptor for adding auth tokens if needed
apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor - handle token expiration and extract data
apiClient.interceptors.response.use(
  (response) => {
    // Return the actual data from the response
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Don't try to refresh token on login/auth endpoints - pass the error through
    const isAuthEndpoint = originalRequest?.url?.includes("/auth/signin") || 
                          originalRequest?.url?.includes("/auth/login");
    
    if (isAuthEndpoint) {
      console.error(
        "Auth Error:",
        error?.response?.data || error?.message || error,
      );
      return Promise.reject(error);
    }

    // Check if it's a 401 Unauthorized error (likely token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const success = await useAuthStore.getState().refreshAccessToken();

        if (success) {
          const { accessToken } = useAuthStore.getState();
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          processQueue(null, accessToken);
          return apiClient(originalRequest);
        } else {
          // Refresh failed, logout user
          processQueue(new Error("Token refresh failed"), null);
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      }
    }

    // If no valid refresh or other error occurred, log it
    if (
      error.response?.status === 401 &&
      !useAuthStore.getState().refreshToken
    ) {
      console.warn(
        "No valid token and refresh token not available - logging out",
      );
      useAuthStore.getState().logout();
    }

    console.error(
      "API Error:",
      error?.response?.data || error?.message || error,
    );
    return Promise.reject(error);
  },
);
