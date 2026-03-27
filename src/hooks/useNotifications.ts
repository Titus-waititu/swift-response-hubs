import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";

// Query Keys
export const notificationsKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationsKeys.all, "list"] as const,
  detail: (id: string) => [...notificationsKeys.all, "detail", id] as const,
};

// Queries
export const useGetNotifications = () =>
  useQuery({
    queryKey: notificationsKeys.lists(),
    queryFn: () => apiClient.get("/notifications/"),
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
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.lists() });
    },
  });
};
