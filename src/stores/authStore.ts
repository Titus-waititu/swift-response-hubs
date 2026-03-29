import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole =
  | "USER"
  | "ADMIN"
  | "OFFICER"
  | "RESPONDER"
  | "DISPATCHER";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  logout: () => void;
  hydrate: () => void;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      setUser: (user: User) => set({ user }),

      setAccessToken: (token: string) => set({ accessToken: token }),

      setRefreshToken: (token: string) => set({ refreshToken: token }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error }),

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // For cookies if using httpOnly cookies
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed");
          }

          const data = await response.json();

          // Store token and user
          set({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken || null,
            user: data.user,
            isLoading: false,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Login failed";
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();

        if (!refreshToken) {
          console.warn("No refresh token available");
          get().logout();
          return false;
        }

        try {
          const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ refreshToken }),
          });

          if (!response.ok) {
            console.warn("Token refresh failed");
            get().logout();
            return false;
          }

          const data = await response.json();
          set({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken || refreshToken,
          });
          console.log("Access token refreshed successfully");
          return true;
        } catch (error) {
          console.error("Token refresh error:", error);
          get().logout();
          return false;
        }
      },

      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null, error: null });
        // Clear from localStorage automatically via persist middleware
      },

      hydrate: () => {
        // Called on app initialization to restore state
        // Zustand persist middleware handles this automatically
      },
    }),
    {
      name: "auth-store", // localStorage key
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    },
  ),
);
