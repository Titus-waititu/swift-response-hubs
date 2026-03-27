import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";

// Query Keys
export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
  sessions: () => [...authKeys.all, "sessions"] as const,
  session: (id: string) => [...authKeys.sessions(), id] as const,
};

// Mutations
export const useSignin = () =>
  useMutation({
    mutationFn: (credentials: any) =>
      apiClient.post("/auth/signin", credentials),
  });

export const useRefreshAuth = () =>
  useMutation({
    mutationFn: (data: any) => apiClient.post("/auth/refresh", data),
  });

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.post("/auth/logout", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
};

export const useChangePassword = () =>
  useMutation({
    mutationFn: (data: any) => apiClient.post("/auth/change-password", data),
  });

export const useForgotPassword = () =>
  useMutation({
    mutationFn: (data: any) => apiClient.post("/auth/forgot-password", data),
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: (data: any) => apiClient.post("/auth/reset-password", data),
  });

// Queries
export const useGetProfile = () =>
  useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => apiClient.get("/auth/profile"),
  });

// Mutations
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.patch("/auth/profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
};

export const useGetSessions = () =>
  useQuery({
    queryKey: authKeys.sessions(),
    queryFn: () => apiClient.get("/auth/sessions"),
  });

export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) =>
      apiClient.delete(`/auth/sessions/${sessionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.sessions() });
    },
  });
};

export const useDeleteAllSessions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.delete("/auth/sessions"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.sessions() });
    },
  });
};
