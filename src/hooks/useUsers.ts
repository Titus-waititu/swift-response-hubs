import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";

// Query Keys
export const usersKeys = {
  all: ["users"] as const,
  lists: () => [...usersKeys.all, "list"] as const,
  detail: (id: string) => [...usersKeys.all, "detail", id] as const,
  stats: () => [...usersKeys.all, "stats"] as const,
  active: () => [...usersKeys.all, "active"] as const,
  byRole: (role: string) => [...usersKeys.all, "role", role] as const,
};

// Queries
export const useGetUsers = () =>
  useQuery({
    queryKey: usersKeys.lists(),
    queryFn: async () => {
      try {
        const response = await apiClient.get("/users/");

        if (!response) {
          return [];
        }

        // Handle array directly
        if (Array.isArray(response)) {
          return response.filter((u) => u);
        }

        // Handle wrapped response (data property)
        if (response?.data && Array.isArray(response.data)) {
          return response.data.filter((u) => u);
        }

        // Handle paginated response
        if (response?.users && Array.isArray(response.users)) {
          return response.users.filter((u) => u);
        }

        // Handle object with user list
        if (response?.list && Array.isArray(response.list)) {
          return response.list.filter((u) => u);
        }

        // Fallback
        return [];
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    },
  });

export const useGetUserById = (id: string | undefined) =>
  useQuery({
    queryKey: usersKeys.detail(id!),
    queryFn: () => apiClient.get(`/users/${id}`),
    enabled: !!id,
  });

export const useGetUserStats = () =>
  useQuery({
    queryKey: usersKeys.stats(),
    queryFn: () => apiClient.get("/users/stats"),
  });

export const useGetActiveUsers = () =>
  useQuery({
    queryKey: usersKeys.active(),
    queryFn: () => apiClient.get("/users/active"),
  });

export const useGetUsersByRole = (role: string | undefined) =>
  useQuery({
    queryKey: usersKeys.byRole(role!),
    queryFn: () => apiClient.get(`/users/role/${role}`),
    enabled: !!role,
  });

// Mutations
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post("/users/", data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: usersKeys.stats() });
      await queryClient.refetchQueries({ queryKey: usersKeys.lists() });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.patch(`/users/${id}`, data),
    onSuccess: async (_, variables) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: usersKeys.detail(variables.id),
      });
      await queryClient.refetchQueries({ queryKey: usersKeys.lists() });
    },
  });
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.patch(`/users/${id}/activate`, {}),
    onSuccess: async () => {
      // Clear cache and force refetch
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      await queryClient.refetchQueries({ queryKey: usersKeys.lists() });
    },
  });
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.patch(`/users/${id}/deactivate`, {}),
    onSuccess: async () => {
      // Clear cache and force refetch
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      await queryClient.refetchQueries({ queryKey: usersKeys.lists() });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
};
