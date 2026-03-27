import axios, { AxiosInstance, AxiosError } from "axios";
import { useAuthStore } from "@/stores/authStore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://smartresponse-api.onrender.com/api/v1";

// Create axios instance
export const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // For cookies
});

// Request interceptor - add JWT token to all requests
client.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handle 401 errors
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear auth state and redirect to login
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth API calls
export const authAPI = {
  login: (email: string, password: string) =>
    client.post("/auth/signin", { email, password }),

  register: (name: string, email: string, password: string) =>
    client.post("/auth/signup", { name, email, password }),

  getCurrentUser: () => client.get("/auth/me"),
};

// Users API calls (for admin)
export const usersAPI = {
  createUser: (name: string, email: string, role: string) =>
    client.post("/users", { name, email, role }),

  getUsers: () => client.get("/users"),

  updateUser: (id: string, data: any) => client.put(`/users/${id}`, data),

  deleteUser: (id: string) => client.delete(`/users/${id}`),
};

export default client;
