import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";

// Query Keys
export const notificationsKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationsKeys.all, "list"] as const,
  unread: () => [...notificationsKeys.all, "unread"] as const,
  detail: (id: string) => [...notificationsKeys.all, "detail", id] as const,
};

// Queries
export const useGetNotifications = () =>
  useQuery({
    queryKey: notificationsKeys.lists(),
    queryFn: async () => {
      const response = await apiClient.get("/notifications/");
      const data = Array.isArray(response) ? response : response?.data || [];
      return data;
    },
  });

export const useGetUnreadNotifications = () =>
  useQuery({
    queryKey: notificationsKeys.unread(),
    queryFn: async () => {
      const response = await apiClient.get("/notifications/unread");
      const data = Array.isArray(response) ? response : response?.data || [];
      return data;
    },
    refetchInterval: 5000, // Poll every 5 seconds for real-time updates
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

export const useGetNotificationById = (id: string | undefined) =>
  useQuery({
    queryKey: notificationsKeys.detail(id!),
    queryFn: () => apiClient.get(`/notifications/${id}`),
    enabled: !!id,
  });

// Mutations
export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post("/notifications/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationsKeys.unread() });
    },
  });
};

export const useSendNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      message: string;
      type?: "alert" | "info" | "warning" | "success";
      recipients?: "all" | "dispatcher" | "responder" | "officer" | string[];
      priority?: "low" | "medium" | "high" | "critical";
    }) =>
      apiClient.post("/notifications/send", {
        message: data.message,
        type: data.type || "info",
        recipients: data.recipients || "all",
        priority: data.priority || "medium",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationsKeys.unread() });
    },
    onError: (error: any) => {
      console.error("Send notification error:", error?.response?.data || error);
    },
  });
};

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.patch(`/notifications/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: notificationsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationsKeys.unread() });
    },
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.patch(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.unread() });
      queryClient.invalidateQueries({ queryKey: notificationsKeys.lists() });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationsKeys.unread() });
    },
  });
};
